import crypto from "crypto";
import fs from "fs";
import path from "path";
import {
  type Application,
  type DraftInput,
  emptyApplication,
  missingFields,
  sanitizeDraft,
} from "./application";
import { checkPassword, hashPassword, readablePassword } from "./passwords";

export type AccountRole = "applicant" | "moderator" | "administrator";
export type AccountStatus = "active" | "suspended" | "banned" | "deactivated";

export type Account = {
  id: string;
  email: string;
  passwordHash: string;
  salt: string;
  role: AccountRole;
  status: AccountStatus;
  application: Application | null;
  displayName?: string;
  background?: string;
  sessionToken: string;
  sessionKind?: "record" | "role";
  createdAt: string;
};

export type ReportKind = "work" | "comment" | "user";
export type ReportStatus = "open" | "kept" | "hidden" | "removed" | "warned" | "restricted" | "escalated";

export type Report = {
  id: string;
  kind: ReportKind;
  title: string;
  detail: string;
  media: string;
  creator: string;
  status: ReportStatus;
  note: string;
};

export type Nomination = {
  id: string;
  title: string;
  by: string;
  media: string;
  status: "pending" | "featured" | "declined";
};

export type ModCase = {
  id: string;
  title: string;
  findings: string;
  status: "open" | "in review" | "escalated" | "closed";
  action: string;
};

export type Category = { id: string; name: string; active: boolean };
export type PlatformPost = {
  id: string;
  title: string;
  media: string;
  creator: string;
  status: "visible" | "hidden" | "removed";
  description?: string;
  link?: string;
  tone?: string;
  createdAt?: string;
};

export type ReviewRequest = {
  id: string;
  creator: string;
  title: string;
  media: string;
  note: string;
  status: "open" | "accepted" | "declined";
  strengths: string;
  improvements: string;
  recommendations: string;
};

export type ScoutNote = {
  id: string;
  creator: string;
  kind: "message" | "invite";
  body: string;
  when: string;
};

export type TicketStatus = "open" | "answered" | "resolved" | "ignored" | "escalated";

export type Ticket = {
  id: string;
  name: string;
  email: string;
  title: string;
  description: string;
  status: TicketStatus;
  answer: string;
  ignoreReason: string;
  createdAt: string;
};

export type Settings = {
  commentsOpen: boolean;
  gifsAllowed: boolean;
  uploadNote: string;
  moderationRule: string;
};

export type ReportSnapshot = {
  generatedAt: string;
  accounts: number;
  pendingApplications: number;
  openReports: number;
  visiblePosts: number;
  featuredNominations: number;
};

export type Database = {
  accounts: Account[];
  reports: Report[];
  nominations: Nomination[];
  cases: ModCase[];
  categories: Category[];
  posts: PlatformPost[];
  reviewRequests: ReviewRequest[];
  scoutNotes: ScoutNote[];
  tickets: Ticket[];
  settings: Settings;
  lastReport: ReportSnapshot | null;
};

const filePath = path.join(process.cwd(), "data", "xpression.json");
const seedPath = path.join(process.cwd(), "data", "seed.json");

let chain: Promise<unknown> = Promise.resolve();

function fallbackRequests(): ReviewRequest[] {
  return [
    {
      id: "req-1",
      creator: "Luis Ortega",
      title: "Studio wall study",
      media: "Visual art",
      note: "Is the crop too tight for the wall study?",
      status: "open",
      strengths: "",
      improvements: "",
      recommendations: "",
    },
    {
      id: "req-2",
      creator: "Nia Brooks",
      title: "Harbor demo",
      media: "Music",
      note: "Does the chorus arrive too late?",
      status: "open",
      strengths: "",
      improvements: "",
      recommendations: "",
    },
  ];
}

function seedDatabase(): Database {
  const seed = JSON.parse(fs.readFileSync(seedPath, "utf8")) as Omit<Database, "accounts">;
  return { accounts: [], ...seed };
}

function read(): Database {
  if (!fs.existsSync(filePath)) {
    const created = seedDatabase();
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, JSON.stringify(created, null, 2));
    return created;
  }
  const parsed = JSON.parse(fs.readFileSync(filePath, "utf8")) as Database;
  if (!Array.isArray(parsed.accounts)) parsed.accounts = [];
  let changed = false;
  if (!Array.isArray(parsed.reviewRequests)) {
    parsed.reviewRequests = fallbackRequests();
    changed = true;
  }
  if (!Array.isArray(parsed.scoutNotes)) {
    parsed.scoutNotes = [];
    changed = true;
  }
  if (!Array.isArray(parsed.tickets)) {
    parsed.tickets = [];
    changed = true;
  }
  if (changed) write(parsed);
  return parsed;
}

function write(db: Database) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(db, null, 2));
}

export function update<T>(fn: (db: Database) => T): Promise<T> {
  const run = chain.then(() => {
    const db = read();
    const result = fn(db);
    write(db);
    return result;
  });
  chain = run.then(
    () => undefined,
    () => undefined,
  );
  return run;
}

export function readDatabase() {
  return read();
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export function emailTaken(db: Database, email: string) {
  const needle = normalizeEmail(email);
  return db.accounts.some(
    (account) =>
      account.email === needle || account.application?.xpressionEmail === needle,
  );
}

export function createApplicant(email: string, password: string) {
  const normalized = normalizeEmail(email);
  return update((db) => {
    if (emailTaken(db, normalized)) return { error: "taken" as const };
    const { salt, passwordHash } = hashPassword(password);
    const account: Account = {
      id: crypto.randomUUID(),
      email: normalized,
      passwordHash,
      salt,
      role: "applicant",
      status: "active",
      application: emptyApplication(),
      sessionToken: crypto.randomBytes(32).toString("hex"),
      sessionKind: "record",
      createdAt: new Date().toISOString(),
    };
    db.accounts.push(account);
    return { account };
  });
}

export function authenticate(email: string, password: string) {
  const db = read();
  const needle = normalizeEmail(email);
  for (const account of db.accounts) {
    if (account.email === needle && checkPassword(password, account.salt, account.passwordHash)) {
      return { account, via: "record" as const };
    }
    const application = account.application;
    if (
      application?.xpressionEmail === needle &&
      application.status === "approved" &&
      checkPassword(password, application.xpressionSalt, application.xpressionPasswordHash)
    ) {
      return { account, via: "xpression" as const };
    }
  }
  return null;
}

export function findBySession(token: string) {
  if (!token) return null;
  return read().accounts.find((account) => account.sessionToken === token) ?? null;
}

export function setSessionToken(accountId: string, kind: "record" | "role") {
  const token = crypto.randomBytes(32).toString("hex");
  return update((db) => {
    const account = db.accounts.find((item) => item.id === accountId);
    if (!account) return "";
    account.sessionToken = token;
    account.sessionKind = kind;
    return token;
  });
}

export function clearSession(token: string) {
  return update((db) => {
    const account = db.accounts.find((item) => item.sessionToken === token);
    if (account) account.sessionToken = "";
  });
}

function applyDraft(application: Application, input: DraftInput) {
  const next = sanitizeDraft(input);
  application.role = next.role;
  application.name = next.name;
  application.age = next.age;
  application.reason = next.reason;
  application.credentials = next.credentials;
  application.experience = next.experience;
  application.selectedMedia = next.selectedMedia;
  application.areas = next.areas;
  application.organization = next.organization;
  application.opportunities = next.opportunities;
  application.proof = next.proof;
}

export function saveDraft(accountId: string, input: DraftInput) {
  return update((db) => {
    const account = db.accounts.find((item) => item.id === accountId);
    if (!account?.application) return { error: "missing" as const };
    if (account.application.status !== "new" && account.application.status !== "draft") {
      return { ignored: true as const };
    }
    applyDraft(account.application, input);
    account.application.status = "draft";
    return { ok: true as const };
  });
}

export function submitApplication(accountId: string, input: DraftInput) {
  return update((db) => {
    const account = db.accounts.find((item) => item.id === accountId);
    if (!account?.application) return { error: "missing" as const };
    if (account.application.status !== "new" && account.application.status !== "draft") {
      return { error: "closed" as const };
    }
    applyDraft(account.application, input);
    const missing = missingFields(input);
    if (missing) return { error: "required" as const, message: missing };
    account.application.status = "pending";
    return { ok: true as const };
  });
}

function slugName(name: string) {
  const base = name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ".")
    .replace(/^\.|\.$/g, "");
  return base || "member";
}

function issueLogin(db: Database, name: string) {
  const stem = slugName(name);
  let email = `${stem}@xpression.com`;
  let n = 2;
  while (emailTaken(db, email)) {
    email = `${stem}${n}@xpression.com`;
    n += 1;
  }
  const password = readablePassword();
  const { salt, passwordHash } = hashPassword(password);
  return { email, password, salt, passwordHash };
}

export function reviewApplication(accountId: string, decision: "approved" | "rejected") {
  return update((db) => {
    const account = db.accounts.find((item) => item.id === accountId);
    if (!account?.application) return { error: "missing" as const };
    if (account.application.status !== "pending" && account.application.status !== "rejected") {
      return { error: "closed" as const };
    }
    if (decision === "rejected") {
      account.application.status = "rejected";
      return { ok: true as const };
    }
    if (!account.application.xpressionEmail) {
      const login = issueLogin(db, account.application.name);
      account.application.xpressionEmail = login.email;
      account.application.xpressionPassword = login.password;
      account.application.xpressionSalt = login.salt;
      account.application.xpressionPasswordHash = login.passwordHash;
    }
    account.application.status = "approved";
    return { ok: true as const };
  });
}

export function reopenApplication(accountId: string) {
  return update((db) => {
    const account = db.accounts.find((item) => item.id === accountId);
    if (!account?.application) return { error: "missing" as const };
    if (account.application.status !== "approved" && account.application.status !== "rejected") {
      return { error: "closed" as const };
    }
    account.application.status = "pending";
    return { ok: true as const };
  });
}

export function setAccountStatus(accountId: string, status: AccountStatus, actorId: string) {
  return update((db) => {
    const account = db.accounts.find((item) => item.id === accountId);
    if (!account) return { error: "missing" as const };
    if (account.id === actorId && status !== "active") {
      return { error: "self" as const };
    }
    if (account.role === "administrator" && status !== "active") {
      const otherAdmins = db.accounts.filter(
        (item) => item.role === "administrator" && item.status === "active" && item.id !== account.id,
      );
      if (otherAdmins.length === 0) return { error: "last-admin" as const };
    }
    account.status = status;
    if (status !== "active") account.sessionToken = "";
    return { ok: true as const };
  });
}

export function setReportStatus(id: string, status: ReportStatus, note: string) {
  return update((db) => {
    const report = db.reports.find((item) => item.id === id);
    if (!report) return;
    report.status = status;
    report.note = status === "open" ? "" : note || report.note;
  });
}

export function setNominationStatus(id: string, status: Nomination["status"]) {
  return update((db) => {
    const nomination = db.nominations.find((item) => item.id === id);
    if (nomination) nomination.status = status;
  });
}

export function saveCase(id: string, findings: string, status: ModCase["status"], action: string) {
  return update((db) => {
    const item = db.cases.find((entry) => entry.id === id);
    if (!item) return;
    item.findings = findings;
    item.status = status;
    item.action = action;
  });
}

export function setPostStatus(id: string, status: PlatformPost["status"]) {
  return update((db) => {
    const post = db.posts.find((item) => item.id === id);
    if (post) post.status = status;
  });
}

export function addCategory(name: string) {
  const trimmed = name.trim();
  if (!trimmed) return Promise.resolve();
  return update((db) => {
    db.categories.push({ id: crypto.randomUUID(), name: trimmed, active: true });
  });
}

export function setCategory(id: string, name: string, active: boolean) {
  return update((db) => {
    const category = db.categories.find((item) => item.id === id);
    if (!category) return;
    if (name.trim()) category.name = name.trim();
    category.active = active;
  });
}

export function saveSettings(settings: Settings) {
  return update((db) => {
    db.settings = settings;
  });
}

export function addPost(post: { title: string; media: string; creator: string; description: string; link: string; tone: string }) {
  return update((db) => {
    const id = `post-${crypto.randomUUID()}`;
    db.posts.unshift({
      id,
      title: post.title,
      media: post.media,
      creator: post.creator,
      status: "visible",
      description: post.description,
      link: post.link,
      tone: post.tone,
      createdAt: new Date().toISOString(),
    });
    return id;
  });
}

export function setReviewStatus(id: string, status: ReviewRequest["status"]) {
  return update((db) => {
    const request = db.reviewRequests.find((item) => item.id === id);
    if (!request) return;
    request.status = status;
    if (status === "open") {
      request.strengths = "";
      request.improvements = "";
      request.recommendations = "";
    }
  });
}

export function saveFeedback(
  id: string,
  feedback: { strengths: string; improvements: string; recommendations: string },
) {
  return update((db) => {
    const request = db.reviewRequests.find((item) => item.id === id);
    if (!request || request.status !== "accepted") return { error: "closed" as const };
    request.strengths = feedback.strengths;
    request.improvements = feedback.improvements;
    request.recommendations = feedback.recommendations;
    return { ok: true as const };
  });
}

export function addTicket(ticket: { name: string; email: string; title: string; description: string }) {
  return update((db) => {
    const id = crypto.randomUUID();
    db.tickets.unshift({
      id,
      name: ticket.name,
      email: ticket.email,
      title: ticket.title,
      description: ticket.description,
      status: "open",
      answer: "",
      ignoreReason: "",
      createdAt: new Date().toISOString(),
    });
    return id;
  });
}

export function answerTicketRecord(id: string, answer: string) {
  return update((db) => {
    const ticket = db.tickets.find((item) => item.id === id);
    if (!ticket || !answer.trim()) return { error: "required" as const };
    ticket.answer = answer.trim();
    ticket.status = "answered";
    return { ok: true as const };
  });
}

export function setTicketStatus(id: string, status: TicketStatus, ignoreReason = "") {
  return update((db) => {
    const ticket = db.tickets.find((item) => item.id === id);
    if (!ticket) return { error: "missing" as const };
    ticket.status = status;
    ticket.ignoreReason = status === "ignored" ? ignoreReason : "";
    return { ok: true as const };
  });
}

export function addScoutNote(note: { creator: string; kind: ScoutNote["kind"]; body: string }) {
  return update((db) => {
    db.scoutNotes.unshift({
      id: crypto.randomUUID(),
      creator: note.creator,
      kind: note.kind,
      body: note.body,
      when: new Date().toISOString(),
    });
  });
}

export function generateReport() {
  return update((db) => {
    const snapshot: ReportSnapshot = {
      generatedAt: new Date().toISOString(),
      accounts: db.accounts.length,
      pendingApplications: db.accounts.filter((item) => item.application?.status === "pending").length,
      openReports: db.reports.filter((item) => item.status === "open" || item.status === "escalated").length,
      visiblePosts: db.posts.filter((item) => item.status === "visible").length,
      featuredNominations: db.nominations.filter((item) => item.status === "featured").length,
    };
    db.lastReport = snapshot;
    return snapshot;
  });
}
