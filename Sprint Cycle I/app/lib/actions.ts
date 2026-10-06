"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { roleHome, type ApplicantRole } from "./application";
import { credentialError, emailError } from "./credentials.mjs";
import { clearSessionCookie, currentAccount, currentToken, writeSessionCookie } from "./session";
import {
  addCategory,
  authenticate,
  clearSession,
  createApplicant,
  generateReport,
  addPost,
  addScoutNote,
  addTicket,
  answerTicketRecord,
  reopenApplication,
  reviewApplication,
  saveCase,
  saveFeedback,
  setReviewStatus,
  saveDraft,
  saveSettings,
  setAccountStatus,
  setCategory,
  setNominationStatus,
  setPostStatus,
  setReportStatus,
  setSessionToken,
  setTicketStatus,
  type AccountStatus,
  type ModCase,
  type Nomination,
  type PlatformPost,
  type ReportStatus,
  type ReviewRequest,
  type ScoutNote,
} from "./store";

function safeNext(value: string) {
  if (!value.startsWith("/") || value.startsWith("//") || value.includes("://") || value.includes("\\")) return "";
  return value;
}

function destination(role: "applicant" | "moderator" | "administrator", via: "record" | "xpression", applied: ApplicantRole | "") {
  if (role === "moderator") return "/moderator/desk";
  if (role === "administrator") return "/administrator/desk";
  if (via === "xpression") return roleHome(applied);
  return "/account";
}

export async function signIn(formData: FormData) {
  const email = String(formData.get("email") || "");
  const password = String(formData.get("password") || "");
  const rawReturn = String(formData.get("returnTo") || "");
  const requested = safeNext(rawReturn);
  const fail = rawReturn === "account" ? "/account" : requested ? `/sign-in?returnTo=${encodeURIComponent(requested)}` : "/sign-in";
  const problem = credentialError(email, password);
  if (problem) redirect(`${fail}${fail.includes("?") ? "&" : "?"}error=${problem}`);
  const match = authenticate(email, password);
  if (!match) redirect(`${fail}${fail.includes("?") ? "&" : "?"}error=credentials`);
  if (match.account.status !== "active") redirect(`${fail}${fail.includes("?") ? "&" : "?"}error=blocked`);
  const kind = match.account.role !== "applicant" || match.via === "xpression" ? "role" : "record";
  const token = await setSessionToken(match.account.id, kind);
  await writeSessionCookie(token);
  redirect(requested || destination(match.account.role, match.via, match.account.application?.role || ""));
}

export async function signOut() {
  const token = await currentToken();
  if (token) await clearSession(token);
  await clearSessionCookie();
  redirect("/");
}

export async function beginApplication() {
  const account = await currentAccount();
  if (!account || account.role !== "applicant" || !account.application) redirect("/apply");
  if (account.application.status === "new") {
    const application = account.application;
    await saveDraft(account.id, {
      role: application.role,
      name: application.name,
      age: application.age,
      reason: application.reason,
      credentials: application.credentials,
      experience: application.experience,
      selectedMedia: application.selectedMedia,
      areas: application.areas,
      organization: application.organization,
      opportunities: application.opportunities,
      proof: application.proof,
    });
  }
  redirect("/application");
}

export async function createLogin(formData: FormData) {
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");
  const confirm = String(formData.get("confirm") || "");
  const problem = credentialError(email, password);
  if (problem) redirect(`/apply?error=${problem}`);
  if (password !== confirm) redirect("/apply?error=match");
  const result = await createApplicant(email, password);
  if ("error" in result) redirect("/apply?error=taken");
  await writeSessionCookie(result.account.sessionToken);
  redirect("/account");
}

async function requireRole(role: "moderator" | "administrator") {
  const account = await currentAccount();
  if (!account || account.role !== role || account.status !== "active") return null;
  return account;
}

async function requireStaff() {
  const account = await currentAccount();
  if (!account || account.status !== "active") return null;
  if (account.role !== "moderator" && account.role !== "administrator") return null;
  return account;
}

export async function decideApplication(accountId: string, decision: "approved" | "rejected") {
  const admin = await requireRole("administrator");
  if (!admin) redirect("/sign-in");
  await reviewApplication(accountId, decision);
  revalidatePath("/administrator/desk");
  revalidatePath(`/administrator/applications/${accountId}`);
  revalidatePath("/account");
}

export async function undoApplication(accountId: string) {
  const admin = await requireRole("administrator");
  if (!admin) redirect("/sign-in");
  await reopenApplication(accountId);
  revalidatePath("/administrator/desk");
  revalidatePath(`/administrator/applications/${accountId}`);
  revalidatePath("/account");
}

export async function changeAccountStatus(accountId: string, status: AccountStatus) {
  const admin = await requireRole("administrator");
  if (!admin) redirect("/sign-in");
  await setAccountStatus(accountId, status, admin.id);
  revalidatePath("/administrator/desk");
}

export async function moderateReport(id: string, status: ReportStatus) {
  const moderator = await requireRole("moderator");
  if (!moderator) redirect("/sign-in");
  await setReportStatus(id, status, "");
  revalidatePath("/moderator/desk");
}

export async function reviewNomination(id: string, status: Nomination["status"]) {
  const moderator = await requireRole("moderator");
  if (!moderator) redirect("/sign-in");
  await setNominationStatus(id, status);
  revalidatePath("/moderator/desk");
}

export async function updateCase(formData: FormData) {
  const moderator = await requireRole("moderator");
  if (!moderator) redirect("/sign-in");
  const status = String(formData.get("status") || "open") as ModCase["status"];
  const allowed: ModCase["status"][] = ["open", "in review", "escalated", "closed"];
  await saveCase(
    String(formData.get("id") || ""),
    String(formData.get("findings") || ""),
    allowed.includes(status) ? status : "open",
    String(formData.get("action") || ""),
  );
  revalidatePath("/moderator/desk");
  revalidatePath("/administrator/desk");
}

export async function moderatePost(id: string, status: PlatformPost["status"]) {
  const admin = await requireRole("administrator");
  if (!admin) redirect("/sign-in");
  await setPostStatus(id, status);
  revalidatePath("/administrator/desk");
}

export async function createCategory(formData: FormData) {
  const admin = await requireRole("administrator");
  if (!admin) redirect("/sign-in");
  await addCategory(String(formData.get("name") || ""));
  revalidatePath("/administrator/desk");
}

export async function updateCategory(formData: FormData) {
  const admin = await requireRole("administrator");
  if (!admin) redirect("/sign-in");
  await setCategory(
    String(formData.get("id") || ""),
    String(formData.get("name") || ""),
    formData.get("active") === "yes",
  );
  revalidatePath("/administrator/desk");
}

export async function updateSettings(formData: FormData) {
  const admin = await requireRole("administrator");
  if (!admin) redirect("/sign-in");
  await saveSettings({
    commentsOpen: formData.get("commentsOpen") === "yes",
    gifsAllowed: formData.get("gifsAllowed") === "yes",
    uploadNote: String(formData.get("uploadNote") || ""),
    moderationRule: String(formData.get("moderationRule") || ""),
  });
  revalidatePath("/administrator/desk");
}

export async function runReport() {
  const admin = await requireRole("administrator");
  if (!admin) redirect("/sign-in");
  await generateReport();
  revalidatePath("/administrator/desk");
}

export async function publishWork(formData: FormData) {
  const title = String(formData.get("title") || "").trim();
  const media = String(formData.get("media") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const link = String(formData.get("link") || "").trim();
  const tone = String(formData.get("tone") || "entertaining");
  const allowedTones = ["entertaining", "educational", "personal", "experimental"];
  if (!title || !description || !["Writing", "Visual art", "Music"].includes(media)) {
    redirect("/creator/desk/publish?error=required");
  }
  const account = await currentAccount();
  const creator = account?.application?.name?.trim() || "You";
  const id = await addPost({
    title,
    media,
    creator,
    description,
    link,
    tone: allowedTones.includes(tone) ? tone : "entertaining",
  });
  redirect(`/creator/desk/publish/done?id=${id}`);
}

export async function decideReview(id: string, status: ReviewRequest["status"]) {
  await setReviewStatus(id, status);
  revalidatePath("/mentor/desk");
  revalidatePath(`/mentor/desk/${id}`);
}

export async function recordFeedback(formData: FormData) {
  const id = String(formData.get("id") || "");
  const strengths = String(formData.get("strengths") || "").trim();
  const improvements = String(formData.get("improvements") || "").trim();
  const recommendations = String(formData.get("recommendations") || "").trim();
  if (!strengths || !improvements || !recommendations) {
    redirect(`/mentor/desk/${id}/feedback?error=required`);
  }
  const result = await saveFeedback(id, { strengths, improvements, recommendations });
  if (result && "error" in result) redirect(`/mentor/desk/${id}`);
  redirect(`/mentor/desk/${id}/feedback/sent`);
}

export async function fileTicket(formData: FormData) {
  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const title = String(formData.get("title") || "").trim();
  const description = String(formData.get("description") || "").trim();
  if (emailError(email)) redirect("/help?error=email");
  if (!name || !title || !description) redirect("/help?error=required");
  await addTicket({ name, email, title, description });
  redirect(`/help?email=${encodeURIComponent(email)}&sent=1`);
}

export async function replyToTicket(formData: FormData) {
  const staff = await requireStaff();
  if (!staff) redirect("/sign-in");
  const id = String(formData.get("id") || "");
  const answer = String(formData.get("answer") || "").trim();
  const result = await answerTicketRecord(id, answer);
  if (result && "error" in result) redirect(`${staff.role === "administrator" ? "/administrator/desk" : "/moderator/desk"}?ticket=required#tickets`);
  revalidatePath("/moderator/desk");
  revalidatePath("/administrator/desk");
  revalidatePath("/help");
}

export async function resolveTicket(id: string) {
  const staff = await requireStaff();
  if (!staff) redirect("/sign-in");
  await setTicketStatus(id, "resolved");
  revalidatePath("/moderator/desk");
  revalidatePath("/administrator/desk");
  revalidatePath("/help");
}

export async function escalateTicket(id: string) {
  const moderator = await requireRole("moderator");
  if (!moderator) redirect("/sign-in");
  await setTicketStatus(id, "escalated");
  revalidatePath("/moderator/desk");
  revalidatePath("/administrator/desk");
  revalidatePath("/help");
}

export async function ignoreTicket(formData: FormData) {
  const staff = await requireStaff();
  if (!staff) redirect("/sign-in");
  const id = String(formData.get("id") || "");
  const choice = String(formData.get("ignoreReason") || "");
  const other = String(formData.get("otherReason") || "").trim();
  const reason = choice === "other" ? other : choice;
  const back = staff.role === "administrator" ? "/administrator/desk" : "/moderator/desk";
  if (!reason) redirect(`${back}?ticket=reason#tickets`);
  await setTicketStatus(id, "ignored", reason);
  revalidatePath("/moderator/desk");
  revalidatePath("/administrator/desk");
  revalidatePath("/help");
}

export async function sendScoutNote(formData: FormData) {
  const creator = String(formData.get("creator") || "").trim();
  const slug = String(formData.get("slug") || "").trim();
  const kind = String(formData.get("kind") || "message") === "invite" ? "invite" : "message";
  const body = String(formData.get("body") || "").trim();
  const path = kind === "invite" ? "invite" : "message";
  if (!creator || !body) redirect(`/scout/desk/${slug}/${path}?error=required`);
  await addScoutNote({ creator, kind: kind as ScoutNote["kind"], body });
  redirect(`/scout/desk/${slug}/${path}/sent`);
}
