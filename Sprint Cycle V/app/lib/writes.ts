import type { ResultSetHeader, RowDataPacket } from "mysql2";
import { postFilters } from "../components/DiscoverBar";
import { db } from "./db";
import { ensureWorkTones } from "./records";
import { setAccountStatusByEmail, type Account } from "./store";

export type DbAccount = RowDataPacket & {
  account_id: number;
  name: string;
  email: string;
  role: string;
  status: string;
};

const profileColumns = [
  ["bio", "VARCHAR(300) NULL"],
  ["avatar_url", "VARCHAR(500) NULL"],
  ["music_url", "VARCHAR(500) NULL"],
  ["website_url", "VARCHAR(500) NULL"],
  ["practices", "VARCHAR(80) NULL"],
] as const;

export async function ensureProfileColumns() {
  for (const [name, definition] of profileColumns) {
    const [rows] = await db().query<RowDataPacket[]>(
      `SELECT COUNT(*) AS n
       FROM information_schema.COLUMNS
       WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'account' AND COLUMN_NAME = ?`,
      [name],
    );
    if (!Number(rows[0]?.n)) {
      await db().query(`ALTER TABLE account ADD COLUMN ${name} ${definition}`);
    }
  }
}

export type AnyProfile = CreatorProfile & { role: string };

export async function readAccountByEmail(email: string) {
  await ensureProfileColumns();
  const [rows] = await db().query<AnyProfile[]>(
    `SELECT account_id, name, email, role, discipline, open_to_commissions, status, bio, website_url, music_url, avatar_url, practices
     FROM account
     WHERE LOWER(email) = ?
     LIMIT 1`,
    [email.trim().toLowerCase()],
  );
  return rows[0] || null;
}

export type CreatorProfile = RowDataPacket & {
  account_id: number;
  name: string;
  email: string;
  discipline: string | null;
  open_to_commissions: number;
  status: string;
  bio: string | null;
  website_url: string | null;
  music_url: string | null;
  avatar_url: string | null;
  practices: string | null;
};

export async function readCreatorProfile(accountId: number) {
  await ensureProfileColumns();
  const [rows] = await db().query<CreatorProfile[]>(
    `SELECT account_id, name, email, discipline, open_to_commissions, status, bio, website_url, music_url, avatar_url, practices
     FROM account
     WHERE account_id = ? AND role = 'Creator'
     LIMIT 1`,
    [accountId],
  );
  return rows[0] || null;
}

export async function saveAccountProfile(input: {
  accountId: number;
  name: string;
  bio: string;
  website: string;
  photoUrl: string | null;
}) {
  await ensureProfileColumns();
  await db().query(
    `UPDATE account SET name = ?, bio = ?, website_url = ?, avatar_url = ? WHERE account_id = ?`,
    [input.name, input.bio || null, input.website || null, input.photoUrl, input.accountId],
  );
}

export async function saveCreatorProfile(input: {
  accountId: number;
  name: string;
  discipline: string;
  bio: string;
  website: string;
  music: string;
  practices: string;
  openToCommissions: boolean;
  photoUrl: string | null;
}) {
  await ensureProfileColumns();
  await db().query(
    `UPDATE account
     SET name = ?, discipline = ?, bio = ?, website_url = ?, music_url = ?, practices = ?, open_to_commissions = ?, avatar_url = ?
     WHERE account_id = ? AND role = 'Creator'`,
    [
      input.name,
      input.discipline || null,
      input.bio || null,
      input.website || null,
      input.music || null,
      input.practices || null,
      input.openToCommissions ? 1 : 0,
      input.photoUrl,
      input.accountId,
    ],
  );
}

export async function accountForSession(account: Account | null, role?: string) {
  if (!account) return null;
  const emails = [account.email, account.application?.xpressionEmail || ""]
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);
  if (emails.length === 0) return null;
  const marks = emails.map(() => "?").join(", ");
  const [rows] = await db().query<DbAccount[]>(
    `SELECT account_id, name, email, role, status
     FROM account
     WHERE LOWER(email) IN (${marks})
     ${role ? "AND role = ?" : ""}
     LIMIT 1`,
    role ? [...emails, role] : emails,
  );
  return rows[0] || null;
}

export async function recordAccountStatus(
  administratorId: number,
  accountId: number,
  status: "active" | "deactivated",
) {
  const [current] = await db().query<DbAccount[]>(
    `SELECT account_id, name, email, role, status FROM account WHERE account_id = ? LIMIT 1`,
    [accountId],
  );
  const target = current[0];
  if (!target) return { error: "missing" as const };
  if (target.account_id === administratorId) return { error: "self" as const };
  if (target.status === status) return { error: "same" as const };
  await db().query(
    `INSERT INTO status_change (administrator_id, account_id, new_status, changed_at)
     VALUES (?, ?, ?, NOW())`,
    [administratorId, accountId, status],
  );
  await db().query(`UPDATE account SET status = ? WHERE account_id = ?`, [status, accountId]);
  setAccountStatusByEmail(target.email, status);
  return { ok: true as const, name: target.name, before: target.status, status };
}

export async function applyAccountTask(input: {
  actorId: number;
  actorRole: string;
  accountId: number;
  task: "warn" | "kick" | "ban";
}) {
  const [people] = await db().query<DbAccount[]>(
    `SELECT account_id, name, email, role, status FROM account WHERE account_id = ? LIMIT 1`,
    [input.accountId],
  );
  const target = people[0];
  if (!target) return { error: "missing" as const };
  if (target.account_id === input.actorId) return { error: "self" as const };
  const reason = input.task === "warn"
    ? "Warned from a report."
    : input.task === "kick"
      ? "Temporary restriction from a report."
      : "Referred for a ban from a report.";
  const [report] = await db().query<ResultSetHeader>(
    `INSERT INTO user_report (account_id, reason, reported_at) VALUES (?, ?, NOW())`,
    [input.accountId, reason],
  );
  const action = input.task === "warn" ? "warn" : input.task === "kick" ? "restrict" : "refer for ban";
  await db().query(
    `INSERT INTO account_restriction (user_report_id, moderator_id, action_type, recorded_at)
     VALUES (?, ?, ?, NOW())`,
    [report.insertId, input.actorId, action],
  );
  if (input.actorRole === "Administrator" && (input.task === "kick" || input.task === "ban")) {
    const status = input.task === "ban" ? "banned" : "suspended";
    if (target.status !== status) {
      await db().query(
        `INSERT INTO status_change (administrator_id, account_id, new_status, changed_at)
         VALUES (?, ?, ?, NOW())`,
        [input.actorId, input.accountId, status],
      );
    }
  }
  return { ok: true as const, name: target.name, task: input.task, role: input.actorRole };
}

const picturePattern = /\.(png|jpe?g|gif|webp)(\?.*)?$/i;
const documentPattern = /\.(pdf|txt)(\?.*)?$/i;

function isWebAddress(value: string) {
  return /^https?:\/\/\S+$/i.test(value);
}

function isStoredFile(value: string, pattern: RegExp) {
  return value.startsWith("/uploads/") && pattern.test(value);
}

function isPicture(value: string) {
  if (isStoredFile(value, picturePattern)) return true;
  if (!isWebAddress(value)) return false;
  try {
    return picturePattern.test(new URL(value).pathname);
  } catch {
    return false;
  }
}

function isDocument(value: string) {
  if (isStoredFile(value, documentPattern)) return true;
  if (!isWebAddress(value)) return false;
  try {
    return documentPattern.test(new URL(value).pathname);
  } catch {
    return false;
  }
}

export function publishProblem(input: {
  title: string;
  media: string;
  description: string;
  link: string;
  tone: string;
}) {
  if (!input.title || !["Writing", "Visual art", "Music"].includes(input.media)) return "required" as const;
  if (!postFilters.some((item) => item.label === input.tone)) return "filter" as const;
  if (input.media === "Visual art" && !isPicture(input.link)) return "picture" as const;
  if (input.media === "Music" && !isWebAddress(input.link)) return "music" as const;
  if (input.media === "Writing" && !input.description && !isDocument(input.link)) return "writing" as const;
  return null;
}

export async function publishPiece(input: {
  creatorId: number;
  title: string;
  media: "Writing" | "Visual art" | "Music";
  description: string;
  link: string;
  tone: string;
}) {
  const problem = publishProblem(input);
  if (problem) return { error: problem };
  await ensureWorkTones();
  const [result] = await db().query<ResultSetHeader>(
    `INSERT INTO creative_work
       (creator_id, title, media_type, description, soundcloud_url, featured, archived, published_at, tone)
     VALUES (?, ?, ?, ?, ?, 0, 0, NOW(), ?)`,
    [
      input.creatorId,
      input.title,
      input.media,
      input.description,
      input.link || null,
      input.tone,
    ],
  );
  return { ok: true as const, id: result.insertId };
}

export async function saveStructuredFeedback(input: {
  mentorId: number;
  workId: number;
  strengths: string;
  improvements: string;
  recommendation: string;
}) {
  const [works] = await db().query<RowDataPacket[]>(
    `SELECT creator_id, title FROM creative_work WHERE work_id = ? LIMIT 1`,
    [input.workId],
  );
  const work = works[0];
  if (!work) return { error: "work" as const };

  const [requests] = await db().query<RowDataPacket[]>(
    `SELECT request_id FROM review_request
     WHERE mentor_id = ? AND work_id = ? AND status = 'accepted'
     ORDER BY request_id DESC
     LIMIT 1`,
    [input.mentorId, input.workId],
  );
  let requestId = requests[0] ? Number(requests[0].request_id) : 0;
  if (!requestId) {
    const [created] = await db().query<ResultSetHeader>(
      `INSERT INTO review_request (creator_id, mentor_id, work_id, note, status, requested_at)
       VALUES (?, ?, ?, 'Recorded with the mentor feedback.', 'accepted', NOW())`,
      [Number(work.creator_id), input.mentorId, input.workId],
    );
    requestId = created.insertId;
  }

  const [existing] = await db().query<RowDataPacket[]>(
    `SELECT feedback_id FROM mentor_feedback WHERE request_id = ? LIMIT 1`,
    [requestId],
  );
  if (existing[0]) {
    await db().query(
      `UPDATE mentor_feedback
       SET strengths = ?, improvements = ?, recommendation = ?, written_at = NOW()
       WHERE feedback_id = ?`,
      [input.strengths, input.improvements, input.recommendation, existing[0].feedback_id],
    );
    return { ok: true as const, id: Number(existing[0].feedback_id), title: String(work.title), updated: true };
  }

  const [inserted] = await db().query<ResultSetHeader>(
    `INSERT INTO mentor_feedback
       (work_id, mentor_id, request_id, strengths, improvements, recommendation, written_at)
     VALUES (?, ?, ?, ?, ?, ?, NOW())`,
    [input.workId, input.mentorId, requestId, input.strengths, input.improvements, input.recommendation],
  );
  return { ok: true as const, id: inserted.insertId, title: String(work.title), updated: false };
}

export async function saveMentorComment(input: { mentorId: number; workId: number; body: string }) {
  const text = input.body.trim();
  if (!text) return { error: "required" as const };
  const [works] = await db().query<RowDataPacket[]>(
    `SELECT creator_id, title FROM creative_work WHERE work_id = ? LIMIT 1`,
    [input.workId],
  );
  const work = works[0];
  if (!work) return { error: "work" as const };
  const [created] = await db().query<ResultSetHeader>(
    `INSERT INTO review_request (creator_id, mentor_id, work_id, note, status, requested_at)
     VALUES (?, ?, ?, 'Recorded with the mentor feedback.', 'accepted', NOW())`,
    [Number(work.creator_id), input.mentorId, input.workId],
  );
  const [inserted] = await db().query<ResultSetHeader>(
    `INSERT INTO mentor_feedback
       (work_id, mentor_id, request_id, strengths, improvements, recommendation, written_at)
     VALUES (?, ?, ?, ?, ?, ?, NOW())`,
    [input.workId, input.mentorId, created.insertId, text, text, text],
  );
  return { ok: true as const, id: inserted.insertId, title: String(work.title) };
}

export async function requestMentorReview(input: {
  creatorId: number;
  mentorId: number;
  workId: number;
  note: string;
}) {
  const note = input.note.trim();
  if (!note || note.length > 500) return { error: "note" as const };
  const [mentors] = await db().query<RowDataPacket[]>(
    `SELECT name FROM account
     WHERE account_id = ? AND role = 'Mentor' AND status = 'active'
     LIMIT 1`,
    [input.mentorId],
  );
  const mentor = mentors[0];
  if (!mentor) return { error: "mentor" as const };
  const [works] = await db().query<RowDataPacket[]>(
    `SELECT title FROM creative_work
     WHERE work_id = ? AND creator_id = ? AND archived = 0
     LIMIT 1`,
    [input.workId, input.creatorId],
  );
  const work = works[0];
  if (!work) return { error: "work" as const };
  const [open] = await db().query<RowDataPacket[]>(
    `SELECT status FROM review_request
     WHERE creator_id = ? AND mentor_id = ? AND work_id = ? AND status IN ('waiting', 'accepted')
     ORDER BY request_id DESC
     LIMIT 1`,
    [input.creatorId, input.mentorId, input.workId],
  );
  if (open[0]?.status === "waiting") return { error: "waiting" as const, title: String(work.title), mentor: String(mentor.name) };
  if (open[0]?.status === "accepted") return { error: "accepted" as const, title: String(work.title), mentor: String(mentor.name) };
  await db().query(
    `INSERT INTO review_request (creator_id, mentor_id, work_id, note, status, requested_at)
     VALUES (?, ?, ?, ?, 'waiting', NOW())`,
    [input.creatorId, input.mentorId, input.workId, note],
  );
  return { ok: true as const, title: String(work.title), mentor: String(mentor.name) };
}

export async function nominatePiece(input: { mentorId: number; workId: number; reason: string }) {
  const [works] = await db().query<RowDataPacket[]>(
    `SELECT title FROM creative_work WHERE work_id = ? AND archived = 0 LIMIT 1`,
    [input.workId],
  );
  if (!works[0]) return { error: "work" as const };
  await db().query(
    `INSERT INTO nomination (mentor_id, work_id, moderator_id, reason, status, nominated_at, decided_at)
     VALUES (?, ?, NULL, ?, 'pending', NOW(), NULL)`,
    [input.mentorId, input.workId, input.reason],
  );
  return { ok: true as const, title: String(works[0].title) };
}

const opportunityKinds = ["Commission", "Audition", "Collaboration", "Call"] as const;

export async function createOpportunity(input: {
  scoutId: number;
  title: string;
  kind: string;
  startsOn: string;
  endsOn: string;
  description: string;
}) {
  if (!opportunityKinds.includes(input.kind as (typeof opportunityKinds)[number])) {
    return { error: "kind" as const };
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(input.startsOn)) return { error: "date" as const };
  if (input.endsOn && (!/^\d{4}-\d{2}-\d{2}$/.test(input.endsOn) || input.endsOn < input.startsOn)) {
    return { error: "range" as const };
  }
  const description = input.description
    ? `${input.kind}. ${input.description}`
    : input.kind;
  const [result] = await db().query<ResultSetHeader>(
    `INSERT INTO opportunity (scout_id, title, starts_on, ends_on, description)
     VALUES (?, ?, ?, ?, ?)`,
    [input.scoutId, input.title, input.startsOn, input.endsOn || null, description],
  );
  return { ok: true as const, id: result.insertId, title: input.title };
}

const caseActions = ["kept available", "hidden", "removed"] as const;
const caseStatuses = ["open", "in review", "escalated", "closed"] as const;

export async function updateModerationCase(input: {
  moderatorId: number;
  caseId: number;
  findings: string;
  action: string;
  status: string;
}) {
  if (!caseActions.includes(input.action as (typeof caseActions)[number])) return { error: "action" as const };
  if (!caseStatuses.includes(input.status as (typeof caseStatuses)[number])) return { error: "status" as const };
  const [rows] = await db().query<RowDataPacket[]>(
    `SELECT mc.case_id, mc.findings AS before_findings, mc.action_taken AS before_action, wr.work_id, w.title
     FROM moderation_case AS mc
     JOIN work_report AS wr ON wr.report_id = mc.report_id
     JOIN creative_work AS w ON w.work_id = wr.work_id
     WHERE mc.case_id = ?
     LIMIT 1`,
    [input.caseId],
  );
  const row = rows[0];
  if (!row) return { error: "missing" as const };
  await db().query(
    `UPDATE moderation_case
     SET moderator_id = ?, findings = ?, action_taken = ?, status = ?, recorded_at = NOW()
     WHERE case_id = ?`,
    [input.moderatorId, input.findings, input.action, input.status, input.caseId],
  );
  await db().query(
    `UPDATE creative_work SET archived = ? WHERE work_id = ?`,
    [input.action === "kept available" ? 0 : 1, row.work_id],
  );
  return {
    ok: true as const,
    caseId: input.caseId,
    title: String(row.title),
    before: String(row.before_action || ""),
    action: input.action,
  };
}

export async function openModerationCase(input: {
  moderatorId: number;
  moderatorName: string;
  reportId: number;
  workId: number;
  findings: string;
  action: string;
  status: string;
}) {
  if (!caseActions.includes(input.action as (typeof caseActions)[number])) return { error: "action" as const };
  if (!caseStatuses.includes(input.status as (typeof caseStatuses)[number])) return { error: "status" as const };
  let reportId = input.reportId;
  let workId = input.workId;
  if (reportId) {
    const [rows] = await db().query<RowDataPacket[]>(
      `SELECT wr.work_id, mc.case_id
       FROM work_report AS wr
       LEFT JOIN moderation_case AS mc ON mc.report_id = wr.report_id
       WHERE wr.report_id = ?
       LIMIT 1`,
      [reportId],
    );
    const row = rows[0];
    if (!row) return { error: "missing" as const };
    workId = Number(row.work_id);
    if (row.case_id != null) {
      return updateModerationCase({
        moderatorId: input.moderatorId,
        caseId: Number(row.case_id),
        findings: input.findings,
        action: input.action,
        status: input.status,
      });
    }
  } else {
    const [works] = await db().query<RowDataPacket[]>(
      `SELECT work_id FROM creative_work WHERE work_id = ? LIMIT 1`,
      [workId],
    );
    if (!works[0]) return { error: "missing" as const };
    const [inserted] = await db().query<ResultSetHeader>(
      `INSERT INTO work_report (work_id, reason, reporter_name, reported_at)
       VALUES (?, ?, ?, NOW())`,
      [workId, input.findings.slice(0, 2000), input.moderatorName.slice(0, 120)],
    );
    reportId = inserted.insertId;
  }
  const [created] = await db().query<ResultSetHeader>(
    `INSERT INTO moderation_case (report_id, moderator_id, findings, action_taken, status, recorded_at)
     VALUES (?, ?, ?, ?, ?, NOW())`,
    [reportId, input.moderatorId, input.findings, input.action, input.status],
  );
  await db().query(
    `UPDATE creative_work SET archived = ? WHERE work_id = ?`,
    [input.action === "kept available" ? 0 : 1, workId],
  );
  const [titles] = await db().query<RowDataPacket[]>(
    `SELECT title FROM creative_work WHERE work_id = ? LIMIT 1`,
    [workId],
  );
  return {
    ok: true as const,
    caseId: created.insertId,
    title: String(titles[0]?.title || ""),
    before: "",
    action: input.action,
  };
}
