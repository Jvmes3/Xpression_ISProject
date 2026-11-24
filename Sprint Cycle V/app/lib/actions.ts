"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { canUseRole } from "./access";
import { passwordIsTemporary, roleHome, type ApplicantRole } from "./application";
import { credentialError, emailError, passwordError } from "./credentials.mjs";
import { db } from "./db";
import { ensureCommentThreadColumns, hasPieceInteraction, saveRoleAccount } from "./records";
import { saveUpload } from "./uploads";
import {
  accountForSession,
  createOpportunity,
  publishPiece,
  publishProblem,
  readAccountByEmail,
  readCreatorProfile,
  applyAccountTask,
  recordAccountStatus,
  nominatePiece,
  requestMentorReview,
  saveAccountProfile,
  saveCreatorProfile,
  saveMentorComment,
  saveStructuredFeedback,
  openModerationCase,
  updateModerationCase,
} from "./writes";
import { ensureSampleAccounts } from "./sample-accounts";
import { clearSessionCookie, currentAccount, currentToken, writeSessionCookie } from "./session";
import {
  addCategory,
  authenticate,
  clearSession,
  createApplicant,
  generateReport,
  addScoutNote,
  addTicket,
  answerTicketRecord,
  needsTempPasswordChange,
  reopenApplication,
  readDatabase,
  replaceRolePassword,
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

export async function signIn(first: { error: string } | FormData | undefined, second?: FormData): Promise<{ error: string }> {
  const formData = first instanceof FormData ? first : second;
  if (!formData) return { error: "credentials" };
  const email = String(formData.get("email") || "");
  const password = String(formData.get("password") || "");
  const rawReturn = String(formData.get("returnTo") || "");
  const requested = safeNext(rawReturn);
  const problem = credentialError(email, password);
  if (problem) return { error: problem };
  await ensureSampleAccounts();
  const match = authenticate(email, password);
  if (!match) return { error: "credentials" };
  const stored = await accountForSession(match.account);
  const liveStatus = stored?.status || match.account.status;
  if (liveStatus === "deactivated") return { error: "deactivated" };
  if (liveStatus !== "active") return { error: "blocked" };
  const kind = match.account.role !== "applicant" || match.via === "xpression" ? "role" : "record";
  const token = await setSessionToken(match.account.id, kind);
  await writeSessionCookie(token);
  if (match.via === "xpression" && match.account.application && passwordIsTemporary(match.account.application)) {
    redirect("/account/password");
  }
  redirect(requested || destination(match.account.role, match.via, match.account.application?.role || ""));
}

export async function signOut() {
  const token = await currentToken();
  if (token) await clearSession(token);
  await clearSessionCookie();
  redirect("/");
}

export async function changeTemporaryPassword(formData: FormData) {
  const account = await currentAccount();
  if (!account) redirect("/sign-in?returnTo=/account/password");
  const application = account.application;
  if (!application || !needsTempPasswordChange(account)) {
    redirect(application?.status === "approved" ? roleHome(application.role) : "/account");
  }
  const password = String(formData.get("password") || "");
  const confirm = String(formData.get("confirm") || "");
  if (passwordError(password)) redirect("/account/password?error=password");
  if (password !== confirm) redirect("/account/password?error=match");
  if (password === application.xpressionPassword) redirect("/account/password?error=same");
  const saved = await replaceRolePassword(account.id, password);
  if (!saved || !("ok" in saved)) redirect("/account/password?error=password");
  const role = saved.role === "Creative Mentor"
    ? "Mentor"
    : saved.role === "Talent Scout"
      ? "Talent Scout"
      : saved.role === "Creator"
        ? "Creator"
        : "";
  if (role) {
    await saveRoleAccount({
      name: saved.name || saved.email || "Account",
      email: saved.email || "",
      role,
      password,
    });
  }
  redirect(roleHome(saved.role || ""));
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
  if (decision === "approved") {
    const approved = readDatabase().accounts.find((item) => item.id === accountId)?.application;
    const role = approved?.role === "Creative Mentor"
      ? "Mentor"
      : approved?.role === "Talent Scout"
        ? "Talent Scout"
        : approved?.role === "Creator"
          ? "Creator"
          : "";
    if (approved?.xpressionEmail && approved.xpressionPassword && role) {
      await saveRoleAccount({
        name: approved.name || approved.xpressionEmail,
        email: approved.xpressionEmail,
        role,
        password: approved.xpressionPassword,
      });
    }
  }
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
  const account = await currentAccount();
  if (!canUseRole(account, "creator")) redirect("/sign-in?returnTo=/creator/desk/publish");
  const title = String(formData.get("title") || "").trim();
  const media = String(formData.get("media") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const link = String(formData.get("link") || "").trim();
  const problem = publishProblem({ title, media, description, link });
  if (problem) redirect(`/creator/desk/publish?error=${problem}`);
  const creator = await accountForSession(account, "Creator");
  if (!creator) redirect("/creator/desk/publish?error=account");
  const saved = await publishPiece({
    creatorId: creator.account_id,
    title,
    media: media as "Writing" | "Visual art" | "Music",
    description,
    link,
  });
  if ("error" in saved) redirect(`/creator/desk/publish?error=${saved.error}`);
  redirect(`/creator/desk/publish/done?id=${saved.id}`);
}

const practiceChoices = ["Writing", "Visual art", "Music"];

export async function savePortfolio(formData: FormData) {
  const account = await currentAccount();
  if (!canUseRole(account, "creator")) redirect("/sign-in?returnTo=/profile/edit");
  const creator = await accountForSession(account, "Creator");
  if (!creator) redirect("/profile/edit?error=account");
  const intent = String(formData.get("intent") || "save");
  if (intent === "feature" || intent === "archive") redirect(`/profile/edit?notice=${intent}`);

  const current = await readCreatorProfile(creator.account_id);
  if (!current) redirect("/profile/edit?error=account");
  const name = String(formData.get("name") || "").trim();
  const bio = String(formData.get("bio") || "").trim();
  const website = String(formData.get("website") || "").trim();
  const music = String(formData.get("music") || "").trim();
  const discipline = String(formData.get("discipline") || "").trim();
  const practices = formData.getAll("practice").map((value) => String(value)).filter((value) => practiceChoices.includes(value));
  if (!name) redirect("/profile/edit?error=name");
  if (name.length > 120) redirect("/profile/edit?error=name");
  if (bio.length > 150) redirect("/profile/edit?error=bio");
  if (website && !/^https?:\/\/\S+$/i.test(website)) redirect("/profile/edit?error=website");
  if (music && !/^https?:\/\/\S+$/i.test(music)) redirect("/profile/edit?error=music");
  if (discipline.length > 80) redirect("/profile/edit?error=discipline");

  let photoUrl = current.avatar_url || null;
  if (String(formData.get("removePhoto") || "") === "yes") photoUrl = null;
  const file = formData.get("photo");
  if (file instanceof File && file.size > 0) {
    const saved = await saveUpload(file);
    if ("error" in saved) redirect("/profile/edit?error=photo");
    photoUrl = saved.url;
  }

  await saveCreatorProfile({
    accountId: creator.account_id,
    name,
    discipline,
    bio,
    website,
    music,
    practices: practices.join(", "),
    openToCommissions: formData.get("commissions") === "yes",
    photoUrl,
  });
  revalidatePath("/profile");
  revalidatePath(`/profile/${creator.account_id}`);
  redirect("/profile?saved=1");
}

export async function saveAnyProfile(formData: FormData) {
  const account = await currentAccount();
  if (!account || account.status !== "active") redirect("/sign-in?returnTo=/profile/edit");
  const record = await accountForSession(account);
  if (!record) redirect("/profile/edit?error=account");
  const current = await readAccountByEmail(record.email);
  if (!current) redirect("/profile/edit?error=account");
  const name = String(formData.get("name") || "").trim();
  const bio = String(formData.get("bio") || "").trim();
  const website = String(formData.get("website") || "").trim();
  if (!name || name.length > 120) redirect("/profile/edit?error=name");
  if (bio.length > 150) redirect("/profile/edit?error=bio");
  if (website && !/^https?:\/\/\S+$/i.test(website)) redirect("/profile/edit?error=website");
  let photoUrl = current.avatar_url || null;
  if (String(formData.get("removePhoto") || "") === "yes") photoUrl = null;
  const file = formData.get("photo");
  if (file instanceof File && file.size > 0) {
    const saved = await saveUpload(file);
    if ("error" in saved) redirect("/profile/edit?error=photo");
    photoUrl = saved.url;
  }
  await saveAccountProfile({ accountId: record.account_id, name, bio, website, photoUrl });
  revalidatePath("/profile");
  redirect("/profile?saved=1");
}

export async function toggleSavedWork(formData: FormData) {
  const workId = Number(formData.get("workId"));
  const back = `/creator/desk/${Number.isInteger(workId) ? workId : ""}`;
  const account = await currentAccount();
  if (!account || account.status !== "active") redirect(`/sign-in?returnTo=${encodeURIComponent(back)}`);
  const record = await accountForSession(account);
  if (!record) redirect(`${back}?notice=account`);
  if (!Number.isInteger(workId)) redirect(back);
  const [existing] = await db().query<import("mysql2").RowDataPacket[]>(
    `SELECT save_id FROM saved_work WHERE account_id = ? AND work_id = ? LIMIT 1`,
    [record.account_id, workId],
  );
  if (existing[0]) {
    await db().query(`DELETE FROM saved_work WHERE save_id = ?`, [existing[0].save_id]);
  } else {
    await db().query(
      `INSERT INTO saved_work (account_id, work_id, saved_at) VALUES (?, ?, NOW())`,
      [record.account_id, workId],
    );
  }
  revalidatePath(back);
  revalidatePath("/saved");
  redirect(back);
}

export async function moderateAccount(formData: FormData) {
  const requested = safeNext(String(formData.get("back") || ""));
  const back = requested.startsWith("/moderator/users") || requested.startsWith("/administrator/activity")
    ? requested
    : "/moderator/users";
  const join = back.includes("?") ? "&" : "?";
  const account = await currentAccount();
  const moderator = canUseRole(account, "moderator");
  const administrator = canUseRole(account, "administrator");
  if (back.startsWith("/administrator/") && !administrator) redirect(`/sign-in?returnTo=${encodeURIComponent(back)}`);
  if (back.startsWith("/moderator/") && !moderator) redirect(`/sign-in?returnTo=${encodeURIComponent(back)}`);
  if (!moderator && !administrator) redirect(`/sign-in?returnTo=${encodeURIComponent(back)}`);
  const record = await accountForSession(account);
  if (!record) redirect(`${back}${join}done=account`);
  const accountId = Number(formData.get("accountId"));
  const task = String(formData.get("task") || "");
  if (!Number.isInteger(accountId) || (task !== "warn" && task !== "kick" && task !== "ban")) {
    redirect(`${back}${join}done=invalid`);
  }
  const saved = await applyAccountTask({
    actorId: record.account_id,
    actorRole: record.role,
    accountId,
    task,
  });
  if ("error" in saved) redirect(`${back}${join}done=${saved.error}`);
  revalidatePath("/moderator/users");
  revalidatePath("/administrator/activity");
  revalidatePath("/administrator/accounts");
  const word = saved.task === "warn"
    ? "warned"
    : saved.task === "kick"
      ? "kicked"
      : saved.role === "Administrator"
        ? "banned"
        : "referred for a ban";
  redirect(`${back}${join}done=saved&who=${encodeURIComponent(saved.name)}&word=${encodeURIComponent(word)}`);
}

export async function activateOrDeactivate(formData: FormData) {
  const admin = await requireRole("administrator");
  if (!admin) redirect("/sign-in?returnTo=/administrator/accounts");
  const record = await accountForSession(admin, "Administrator");
  if (!record) redirect("/administrator/accounts?status=account");
  const accountId = Number(formData.get("accountId"));
  const status = String(formData.get("status") || "");
  if (!Number.isInteger(accountId) || (status !== "active" && status !== "deactivated")) {
    redirect("/administrator/accounts?status=invalid");
  }
  const saved = await recordAccountStatus(record.account_id, accountId, status);
  if ("error" in saved) redirect(`/administrator/accounts?status=${saved.error}`);
  revalidatePath("/administrator/accounts");
  redirect(`/administrator/accounts?status=saved&who=${encodeURIComponent(saved.name)}&before=${encodeURIComponent(saved.before)}&next=${status}`);
}

export async function saveMentorFeedback(formData: FormData) {
  const account = await currentAccount();
  if (!canUseRole(account, "mentor")) redirect("/sign-in?returnTo=/mentor/feedback");
  const mentor = await accountForSession(account, "Mentor");
  if (!mentor) redirect("/mentor/feedback?feedback=account");
  const workId = Number(formData.get("workId"));
  const strengths = String(formData.get("strengths") || "").trim();
  const improvements = String(formData.get("improvements") || "").trim();
  const recommendation = String(formData.get("recommendation") || "").trim();
  if (!Number.isInteger(workId) || !strengths || !improvements || !recommendation) {
    redirect("/mentor/feedback?feedback=required");
  }
  const saved = await saveStructuredFeedback({
    mentorId: mentor.account_id,
    workId,
    strengths,
    improvements,
    recommendation,
  });
  if ("error" in saved) redirect(`/mentor/feedback?feedback=${saved.error}`);
  revalidatePath("/mentor/desk");
  revalidatePath("/mentor/feedback");
  revalidatePath(`/creator/desk/${workId}`);
  const back = safeNext(String(formData.get("back") || ""));
  if (back.startsWith("/creator/desk/")) redirect(`${back}?talk=feedbacks&review=saved`);
  redirect(`/mentor/feedback?feedback=saved&piece=${encodeURIComponent(saved.title)}`);
}

export async function commentAsMentorFeedback(formData: FormData) {
  const workId = Number(formData.get("workId"));
  const back = `/creator/desk/${Number.isInteger(workId) ? workId : ""}?talk=feedbacks`;
  const account = await currentAccount();
  if (!canUseRole(account, "mentor")) redirect(`/sign-in?returnTo=${encodeURIComponent(back)}`);
  const mentor = await accountForSession(account, "Mentor");
  if (!mentor) redirect(`${back}&notice=account`);
  const body = String(formData.get("body") || "").trim();
  if (!Number.isInteger(workId) || !body) redirect(`${back}&notice=empty`);
  const saved = await saveMentorComment({ mentorId: mentor.account_id, workId, body });
  if ("error" in saved) redirect(`${back}&notice=${saved.error}`);
  await ensureCommentThreadColumns();
  await db().query(
    `INSERT INTO comment
       (work_id, author_id, parent_comment_id, body, created_at, likes, dislikes, channel, feedback_id)
     VALUES (?, ?, NULL, ?, NOW(), 0, 0, 'feedbacks', ?)`,
    [workId, mentor.account_id, body.slice(0, 4000), saved.id],
  );
  revalidatePath(`/creator/desk/${workId}`);
  revalidatePath("/mentor/history");
  redirect(`${back}&review=saved`);
}

async function mentorFeedbackPost(commentId: number, workId: number, mentorId: number) {
  await ensureCommentThreadColumns();
  const [rows] = await db().query<import("mysql2").RowDataPacket[]>(
    `SELECT comment_id, author_id, channel, feedback_id, parent_comment_id
     FROM comment
     WHERE comment_id = ? AND work_id = ?
     LIMIT 1`,
    [commentId, workId],
  );
  const row = rows[0];
  if (!row || String(row.channel) !== "feedbacks" || row.parent_comment_id != null || Number(row.author_id) !== mentorId) {
    return null;
  }
  return row;
}

async function deleteCommentTree(commentId: number) {
  const [kids] = await db().query<import("mysql2").RowDataPacket[]>(
    `SELECT comment_id FROM comment WHERE parent_comment_id = ?`,
    [commentId],
  );
  for (const kid of kids) await deleteCommentTree(Number(kid.comment_id));
  await db().query(`DELETE FROM comment WHERE comment_id = ?`, [commentId]);
}

export async function editMentorFeedbackPost(formData: FormData) {
  const workId = Number(formData.get("workId"));
  const commentId = Number(formData.get("commentId"));
  const back = `/creator/desk/${Number.isInteger(workId) ? workId : ""}?talk=feedbacks`;
  const account = await currentAccount();
  if (!canUseRole(account, "mentor")) redirect(`/sign-in?returnTo=${encodeURIComponent(back)}`);
  const mentor = await accountForSession(account, "Mentor");
  if (!mentor) redirect(`${back}&notice=account`);
  const body = String(formData.get("body") || "").trim();
  if (!Number.isInteger(workId) || !Number.isInteger(commentId) || !body) redirect(`${back}&notice=empty`);
  const row = await mentorFeedbackPost(commentId, workId, mentor.account_id);
  if (!row) redirect(`${back}&notice=owner`);
  await db().query(`UPDATE comment SET body = ? WHERE comment_id = ?`, [body.slice(0, 4000), commentId]);
  if (row.feedback_id != null) {
    await db().query(
      `UPDATE mentor_feedback
       SET strengths = ?, improvements = ?, recommendation = ?, written_at = NOW()
       WHERE feedback_id = ? AND mentor_id = ?`,
      [body.slice(0, 4000), body.slice(0, 4000), body.slice(0, 4000), row.feedback_id, mentor.account_id],
    );
  }
  revalidatePath(`/creator/desk/${workId}`);
  revalidatePath("/mentor/history");
  redirect(`${back}&review=edited`);
}

export async function unsendMentorFeedbackPost(formData: FormData) {
  const workId = Number(formData.get("workId"));
  const commentId = Number(formData.get("commentId"));
  const back = `/creator/desk/${Number.isInteger(workId) ? workId : ""}?talk=feedbacks`;
  const account = await currentAccount();
  if (!canUseRole(account, "mentor")) redirect(`/sign-in?returnTo=${encodeURIComponent(back)}`);
  const mentor = await accountForSession(account, "Mentor");
  if (!mentor) redirect(`${back}&notice=account`);
  if (!Number.isInteger(workId) || !Number.isInteger(commentId)) redirect(`${back}&notice=owner`);
  const row = await mentorFeedbackPost(commentId, workId, mentor.account_id);
  if (!row) redirect(`${back}&notice=owner`);
  if (row.feedback_id != null) {
    const [notes] = await db().query<import("mysql2").RowDataPacket[]>(
      `SELECT request_id FROM mentor_feedback WHERE feedback_id = ? AND mentor_id = ? LIMIT 1`,
      [row.feedback_id, mentor.account_id],
    );
    await db().query(`DELETE FROM feedback_reply WHERE feedback_id = ?`, [row.feedback_id]);
    await db().query(`DELETE FROM mentor_feedback WHERE feedback_id = ? AND mentor_id = ?`, [row.feedback_id, mentor.account_id]);
    const requestId = notes[0] ? Number(notes[0].request_id) : 0;
    if (requestId) {
      await db().query(
        `DELETE FROM review_request
         WHERE request_id = ?
           AND NOT EXISTS (SELECT 1 FROM mentor_feedback WHERE request_id = ?)`,
        [requestId, requestId],
      );
    }
  }
  await deleteCommentTree(commentId);
  revalidatePath(`/creator/desk/${workId}`);
  revalidatePath("/mentor/history");
  redirect(`${back}&review=unsent`);
}

export async function requestFeedback(formData: FormData) {
  const account = await currentAccount();
  const mentorId = Number(formData.get("mentorId"));
  const q = String(formData.get("q") || "").trim();
  const back = `/creator/request?mentor=${Number.isInteger(mentorId) ? mentorId : ""}&q=${encodeURIComponent(q)}`;
  if (!canUseRole(account, "creator")) redirect(`/sign-in?returnTo=${encodeURIComponent(back)}`);
  const creator = await accountForSession(account, "Creator");
  if (!creator) redirect(`${back}&request=account`);
  const workId = Number(formData.get("workId"));
  const note = String(formData.get("note") || "").trim();
  if (!Number.isInteger(mentorId) || !Number.isInteger(workId) || !note) redirect(`${back}&request=required`);
  const saved = await requestMentorReview({
    creatorId: creator.account_id,
    mentorId,
    workId,
    note,
  });
  if ("error" in saved) redirect(`${back}&request=${saved.error}`);
  revalidatePath("/creator/request");
  revalidatePath("/mentor/requests");
  redirect(`${back}&request=saved&piece=${encodeURIComponent(saved.title)}&who=${encodeURIComponent(saved.mentor)}`);
}

export async function nominateWork(formData: FormData) {
  const account = await currentAccount();
  if (!canUseRole(account, "mentor")) redirect("/sign-in?returnTo=/mentor/nominate");
  const mentor = await accountForSession(account, "Mentor");
  if (!mentor) redirect("/mentor/nominate?nominate=account");
  const workId = Number(formData.get("workId"));
  const reason = String(formData.get("reason") || "").trim();
  if (!Number.isInteger(workId) || !reason) redirect("/mentor/nominate?nominate=required");
  if (!(await hasPieceInteraction(mentor.account_id, workId))) redirect("/mentor/nominate?nominate=work");
  const saved = await nominatePiece({ mentorId: mentor.account_id, workId, reason });
  if ("error" in saved) redirect("/mentor/nominate?nominate=work");
  revalidatePath("/mentor/nominate");
  redirect(`/mentor/nominate?nominate=saved&piece=${encodeURIComponent(saved.title)}`);
}

export async function createScoutOpportunity(formData: FormData) {
  const account = await currentAccount();
  if (!canUseRole(account, "scout")) redirect("/sign-in?returnTo=/opportunities");
  const scout = await accountForSession(account, "Talent Scout");
  if (!scout) redirect("/opportunities?opportunity=account");
  const title = String(formData.get("title") || "").trim();
  const kind = String(formData.get("kind") || "").trim();
  const startsOn = String(formData.get("startsOn") || "").trim();
  const endsOn = String(formData.get("endsOn") || "").trim();
  const description = String(formData.get("description") || "").trim();
  if (!title || !startsOn) redirect("/opportunities?opportunity=required");
  const saved = await createOpportunity({
    scoutId: scout.account_id,
    title,
    kind,
    startsOn,
    endsOn,
    description,
  });
  if ("error" in saved) redirect(`/opportunities?opportunity=${saved.error}`);
  revalidatePath("/scout/desk");
  revalidatePath("/opportunities");
  redirect(`/opportunities?opportunity=saved&title=${encodeURIComponent(saved.title)}`);
}

export async function decideReport(formData: FormData) {
  const moderator = await requireRole("moderator");
  if (!moderator) redirect("/sign-in?returnTo=/moderator/reports");
  const record = await accountForSession(moderator, "Moderator");
  if (!record) redirect("/moderator/reports?case=account");
  const caseId = Number(formData.get("caseId"));
  const findings = String(formData.get("findings") || "").trim();
  const action = String(formData.get("action") || "");
  const status = String(formData.get("caseStatus") || "");
  const back = safeNext(String(formData.get("back") || ""));
  const fail = (code: string): never => {
    if (back.startsWith("/moderator/cases/")) redirect(`${back}?case=${code}`);
    redirect(`/moderator/reports?case=${code}`);
  };
  if (!Number.isInteger(caseId) || !findings) fail("required");
  const saved = await updateModerationCase({
    moderatorId: record.account_id,
    caseId,
    findings,
    action,
    status,
  });
  if ("error" in saved) fail(saved.error || "missing");
  revalidatePath("/moderator/reports");
  revalidatePath("/moderator/cases");
  revalidatePath("/feed");
  if (back.startsWith("/moderator/cases/")) {
    revalidatePath(back);
    redirect(`${back}?case=saved`);
  }
  redirect(`/moderator/reports?case=saved&piece=${encodeURIComponent(saved.title || "")}&before=${encodeURIComponent(saved.before || "")}&action=${encodeURIComponent(saved.action || "")}`);
}

export async function openReportCase(formData: FormData) {
  const moderator = await requireRole("moderator");
  const reportId = Number(formData.get("reportId")) || 0;
  const workId = Number(formData.get("workId")) || 0;
  const back = reportId
    ? `/moderator/cases/new?report=${reportId}`
    : `/moderator/cases/new?work=${Number.isInteger(workId) ? workId : ""}`;
  if (!moderator) redirect(`/sign-in?returnTo=${encodeURIComponent(back)}`);
  const record = await accountForSession(moderator, "Moderator");
  if (!record) redirect(`${back}&case=account`);
  const findings = String(formData.get("findings") || "").trim();
  const action = String(formData.get("action") || "");
  const status = String(formData.get("caseStatus") || "");
  if (!findings || (!reportId && !workId)) redirect(`${back}&case=required`);
  const saved = await openModerationCase({
    moderatorId: record.account_id,
    moderatorName: record.name,
    reportId,
    workId,
    findings,
    action,
    status,
  });
  if ("error" in saved) redirect(`${back}&case=${saved.error || "missing"}`);
  revalidatePath("/moderator/reports");
  revalidatePath("/moderator/cases");
  revalidatePath("/moderator/users");
  revalidatePath("/feed");
  if (workId) revalidatePath(`/creator/desk/${workId}`);
  redirect(`/moderator/cases/${saved.caseId}?case=saved`);
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
  if (result && "error" in result) redirect(`${staff.role === "administrator" ? "/administrator/tickets" : "/moderator/tickets"}?ticket=required`);
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
  const back = staff.role === "administrator" ? "/administrator/tickets" : "/moderator/tickets";
  if (!reason) redirect(`${back}?ticket=reason`);
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
