import bcrypt from "bcryptjs";
import type { RowDataPacket } from "mysql2";
import { db, likeTerm } from "./db";
import { feedbackParts } from "./feedback-copy";
import { ensureSampleAccounts } from "./sample-accounts";

export type WorkCard = {
  id: string;
  creatorId: string;
  title: string;
  media: string;
  creator: string;
  description: string;
  link: string;
  featured: boolean;
  publishedAt: string;
  tone: string;
};

type WorkRow = RowDataPacket & {
  work_id: number;
  creator_id?: number;
  title: string;
  media_type: string;
  description: string;
  soundcloud_url: string | null;
  featured: number;
  creator_name: string;
  published_at: string;
  tone?: string | null;
};

const knownTones: Record<string, string> = {
  "night bus": "Personal",
  "last light on the platform": "Personal",
  "studio wall study": "Educational",
  "harbor demo": "Entertaining",
  "unsent letter": "Personal",
  "sprint cycle demonstration": "Educational",
  "video demonstration": "Experimental",
  "testing1": "Experimental",
};

let tonesReady: Promise<void> | null = null;

export function ensureWorkTones() {
  tonesReady ??= prepareWorkTones().catch((error) => {
    tonesReady = null;
    throw error;
  });
  return tonesReady;
}

async function prepareWorkTones() {
  const [rows] = await db().query<RowDataPacket[]>(
    `SELECT COUNT(*) AS n
     FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'creative_work' AND COLUMN_NAME = 'tone'`,
  );
  if (!Number(rows[0]?.n)) {
    await db().query(`ALTER TABLE creative_work ADD COLUMN tone VARCHAR(40) NULL`);
  }
  for (const [title, tone] of Object.entries(knownTones)) {
    await db().query(
      `UPDATE creative_work SET tone = ? WHERE LOWER(title) = ? AND (tone IS NULL OR tone = '')`,
      [tone, title],
    );
  }
  await db().query(
    `UPDATE creative_work SET tone = 'Personal' WHERE tone IS NULL OR tone = ''`,
  );
}

export async function listWorks(media = "", q = "", tone = "") {
  await ensureWorkTones();
  const term = likeTerm(q);
  const filter = tone.trim().toLowerCase();
  const [rows] = await db().query<WorkRow[]>(
    `SELECT w.work_id, w.creator_id, w.title, w.media_type, w.description, w.soundcloud_url, w.featured, w.tone,
            DATE_FORMAT(w.published_at, '%Y-%m-%d %H:%i:%s') AS published_at,
            a.name AS creator_name
     FROM creative_work AS w
     JOIN account AS a ON a.account_id = w.creator_id
     WHERE w.archived = 0
       AND (? = '' OR w.media_type = ?)
       AND (? = '' OR LOWER(w.tone) = ?)
       AND (? = '' OR w.title LIKE ? OR a.name LIKE ? OR w.description LIKE ?)
     ORDER BY w.published_at DESC`,
    [media, media, filter, filter, q, term, term, term],
  );
  return rows.map(toCard);
}

export type CommentCard = {
  id: number;
  parentId: number | null;
  author: string;
  body: string;
  gif: string;
  when: string;
  likes: number;
  dislikes: number;
  mentorPost: boolean;
  strengths: string;
  improvements: string;
  recommendation: string;
  authorId: number;
  reportReasons: string[];
};

const commentColumns = [
  ["parent_comment_id", "INT NULL"],
  ["likes", "INT NOT NULL DEFAULT 0"],
  ["dislikes", "INT NOT NULL DEFAULT 0"],
  ["channel", "VARCHAR(20) NOT NULL DEFAULT 'comments'"],
  ["feedback_id", "INT NULL"],
] as const;

export async function ensureCommentThreadColumns() {
  for (const [name, definition] of commentColumns) {
    const [rows] = await db().query<RowDataPacket[]>(
      `SELECT COUNT(*) AS n
       FROM information_schema.COLUMNS
       WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'comment' AND COLUMN_NAME = ?`,
      [name],
    );
    if (!Number(rows[0]?.n)) {
      await db().query(`ALTER TABLE comment ADD COLUMN ${name} ${definition}`);
    }
  }
  await db().query(
    `CREATE TABLE IF NOT EXISTS comment_report (
       comment_report_id INT NOT NULL AUTO_INCREMENT,
       comment_id INT NOT NULL,
       reporter_id INT NOT NULL,
       reason VARCHAR(500) NOT NULL,
       reported_at DATETIME NOT NULL,
       PRIMARY KEY (comment_report_id)
     )`,
  );
}

export async function ensureCommentVotes() {
  await db().query(
    `CREATE TABLE IF NOT EXISTS comment_vote (
       account_id INT NOT NULL,
       comment_id INT NOT NULL,
       vote VARCHAR(8) NOT NULL,
       PRIMARY KEY (account_id, comment_id)
     )`,
  );
}

async function syncFeedbackComments(workId: number) {
  const [notes] = await db().query<RowDataPacket[]>(
    `SELECT f.feedback_id, f.mentor_id, f.strengths, f.improvements, f.recommendation, f.written_at
     FROM mentor_feedback AS f
     WHERE f.work_id = ?
       AND NOT EXISTS (SELECT 1 FROM comment AS c WHERE c.feedback_id = f.feedback_id)`,
    [workId],
  );
  for (const note of notes) {
    const parts = feedbackParts(String(note.strengths), String(note.improvements), String(note.recommendation));
    const body = parts.map((part) => (part.label ? `${part.label}. ${part.text}` : part.text)).join("\n\n");
    await db().query(
      `INSERT INTO comment
         (work_id, author_id, parent_comment_id, body, created_at, likes, dislikes, channel, feedback_id)
       VALUES (?, ?, NULL, ?, ?, 0, 0, 'feedbacks', ?)`,
      [workId, note.mentor_id, body, note.written_at, note.feedback_id],
    );
  }
}

export async function listComments(workId: string, channel: "comments" | "feedbacks" = "comments") {
  const id = Number(workId);
  if (!Number.isInteger(id)) return [];
  await ensureCommentThreadColumns();
  if (channel === "feedbacks") await syncFeedbackComments(id);
  const [rows] = await db().query<RowDataPacket[]>(
    `SELECT c.comment_id, c.parent_comment_id, c.author_id, c.body, c.gif_url, c.channel,
            DATE_FORMAT(c.created_at, '%Y-%m-%d %H:%i:%s') AS created_at,
            c.likes, c.dislikes, a.name AS author_name,
            IFNULL(f.strengths, '') AS strengths,
            IFNULL(f.improvements, '') AS improvements,
            IFNULL(f.recommendation, '') AS recommendation,
            IFNULL((
              SELECT GROUP_CONCAT(r.reason ORDER BY r.reported_at SEPARATOR '\u001f')
              FROM comment_report AS r
              WHERE r.comment_id = c.comment_id
            ), '') AS report_reason
     FROM comment AS c
     JOIN account AS a ON a.account_id = c.author_id
     LEFT JOIN mentor_feedback AS f ON f.feedback_id = c.feedback_id
     WHERE c.work_id = ?
       AND (
         (? = 'feedbacks' AND c.channel = 'feedbacks')
         OR (? = 'comments' AND (c.channel IS NULL OR c.channel = 'comments'))
       )
     ORDER BY c.created_at`,
    [id, channel, channel],
  );
  return rows.map((row) => ({
    id: Number(row.comment_id),
    parentId: row.parent_comment_id == null ? null : Number(row.parent_comment_id),
    author: String(row.author_name),
    body: String(row.body),
    gif: row.gif_url ? String(row.gif_url) : "",
    when: String(row.created_at),
    likes: Number(row.likes || 0),
    dislikes: Number(row.dislikes || 0),
    mentorPost: String(row.channel) === "feedbacks" && row.parent_comment_id == null,
    strengths: row.strengths ? String(row.strengths) : "",
    improvements: row.improvements ? String(row.improvements) : "",
    recommendation: row.recommendation ? String(row.recommendation) : "",
    authorId: Number(row.author_id),
    reportReasons: String(row.report_reason || "").split("\u001f").map((item) => item.trim()).filter(Boolean),
  }));
}

export async function listCommentReports() {
  await ensureCommentThreadColumns();
  const [rows] = await db().query<RowDataPacket[]>(
    `SELECT r.comment_report_id, r.reason,
            DATE_FORMAT(r.reported_at, '%Y-%m-%d %H:%i:%s') AS reported_at,
            c.comment_id, c.body, c.work_id, c.author_id, c.channel, w.title, a.name AS author_name, m.name AS reporter_name
     FROM comment_report AS r
     JOIN comment AS c ON c.comment_id = r.comment_id
     JOIN creative_work AS w ON w.work_id = c.work_id
     JOIN account AS a ON a.account_id = c.author_id
     JOIN account AS m ON m.account_id = r.reporter_id
     ORDER BY r.reported_at DESC`,
  );
  return rows;
}

export async function findWork(id: string, options?: { includeArchived?: boolean }) {
  const workId = Number(id);
  if (!Number.isInteger(workId)) return null;
  await ensureWorkTones();
  const [rows] = await db().query<WorkRow[]>(
    `SELECT w.work_id, w.creator_id, w.title, w.media_type, w.description, w.soundcloud_url, w.featured, w.tone,
            DATE_FORMAT(w.published_at, '%Y-%m-%d %H:%i:%s') AS published_at,
            a.name AS creator_name
     FROM creative_work AS w
     JOIN account AS a ON a.account_id = w.creator_id
     WHERE w.work_id = ? AND (? = 1 OR w.archived = 0)
     LIMIT 1`,
    [workId, options?.includeArchived ? 1 : 0],
  );
  return rows[0] ? toCard(rows[0]) : null;
}

function toCard(row: WorkRow): WorkCard {
  return {
    id: String(row.work_id),
    creatorId: row.creator_id ? String(row.creator_id) : "",
    title: row.title,
    media: row.media_type,
    creator: row.creator_name,
    description: row.description,
    link: row.soundcloud_url || "",
    featured: Boolean(row.featured),
    publishedAt: row.published_at ? String(row.published_at) : "",
    tone: row.tone ? String(row.tone) : "",
  };
}

export type AccountCard = RowDataPacket & {
  account_id: number;
  name: string;
  email: string;
  role: string;
  status: string;
  discipline: string | null;
  open_to_commissions: number;
};

export async function listAccounts(q = "") {
  await ensureSampleAccounts();
  const term = likeTerm(q);
  const [rows] = await db().query<AccountCard[]>(
    `SELECT account_id, name, email, role, status, discipline, open_to_commissions
     FROM account
     WHERE ? = '' OR name LIKE ? OR email LIKE ? OR role LIKE ?
     ORDER BY account_id`,
    [q, term, term, term],
  );
  return rows;
}

export async function listMentors(q = "") {
  const term = likeTerm(q);
  const [rows] = await db().query<AccountCard[]>(
    `SELECT account_id, name, email, role, status, discipline, open_to_commissions
     FROM account
     WHERE role = 'Mentor' AND status = 'active'
       AND (? = '' OR name LIKE ? OR IFNULL(discipline, '') LIKE ?)
     ORDER BY name`,
    [q, term, term],
  );
  return rows;
}

export async function findActiveMentor(id: number) {
  if (!Number.isInteger(id)) return null;
  const [rows] = await db().query<AccountCard[]>(
    `SELECT account_id, name, email, role, status, discipline, open_to_commissions
     FROM account
     WHERE account_id = ? AND role = 'Mentor' AND status = 'active'
     LIMIT 1`,
    [id],
  );
  return rows[0] || null;
}

export async function listCreatorPieces(creatorId: number) {
  const [rows] = await db().query<RowDataPacket[]>(
    `SELECT work_id, title
     FROM creative_work
     WHERE creator_id = ? AND archived = 0
     ORDER BY published_at DESC`,
    [creatorId],
  );
  return rows.map((row) => ({ id: Number(row.work_id), title: String(row.title) }));
}

export async function listCreatorRequests(creatorId: number) {
  const [rows] = await db().query<RowDataPacket[]>(
    `SELECT r.request_id, r.work_id, r.status, IFNULL(r.note, '') AS note, w.title, m.name AS mentor_name,
            DATE_FORMAT(r.requested_at, '%Y-%m-%d') AS requested_at
     FROM review_request AS r
     JOIN creative_work AS w ON w.work_id = r.work_id
     JOIN account AS m ON m.account_id = r.mentor_id
     WHERE r.creator_id = ?
     ORDER BY r.requested_at DESC, r.request_id DESC`,
    [creatorId],
  );
  return rows;
}

export async function listMentorRequests(mentorId: number) {
  const [rows] = await db().query<RowDataPacket[]>(
    `SELECT r.request_id, r.work_id, r.status, IFNULL(r.note, '') AS note, w.title, a.name AS creator_name,
            DATE_FORMAT(r.requested_at, '%Y-%m-%d') AS requested_at
     FROM review_request AS r
     JOIN creative_work AS w ON w.work_id = r.work_id
     JOIN account AS a ON a.account_id = r.creator_id
     WHERE r.mentor_id = ?
     ORDER BY r.requested_at DESC`,
    [mentorId],
  );
  return rows;
}

export async function listScoutInvitations(scoutId: number) {
  const [rows] = await db().query<RowDataPacket[]>(
    `SELECT i.invitation_id, i.status, o.opportunity_id, o.title, a.name AS creator_name,
            DATE_FORMAT(i.invited_at, '%Y-%m-%d') AS invited_at
     FROM invitation AS i
     JOIN opportunity AS o ON o.opportunity_id = i.opportunity_id
     JOIN account AS a ON a.account_id = i.creator_id
     WHERE o.scout_id = ?
     ORDER BY i.invited_at DESC`,
    [scoutId],
  );
  return rows;
}

export async function listNominations() {
  const [rows] = await db().query<RowDataPacket[]>(
    `SELECT n.nomination_id, n.reason, n.status, w.work_id, w.title, a.name AS mentor_name,
            DATE_FORMAT(n.nominated_at, '%Y-%m-%d') AS nominated_at
     FROM nomination AS n
     JOIN creative_work AS w ON w.work_id = n.work_id
     JOIN account AS a ON a.account_id = n.mentor_id
     ORDER BY n.nominated_at DESC`,
  );
  return rows;
}

export async function listCreators(q = "") {
  const term = likeTerm(q);
  const [rows] = await db().query<AccountCard[]>(
    `SELECT account_id, name, email, role, status, discipline, open_to_commissions
     FROM account
     WHERE role = 'Creator'
       AND (? = '' OR name LIKE ? OR IFNULL(discipline, '') LIKE ?)
     ORDER BY name`,
    [q, term, term],
  );
  return rows;
}

export async function creatorPortfolio(id: string) {
  const accountId = Number(id);
  if (!Number.isInteger(accountId)) return null;
  const [people] = await db().query<AccountCard[]>(
    `SELECT account_id, name, email, role, status, discipline, open_to_commissions
     FROM account
     WHERE account_id = ? AND role = 'Creator'
     LIMIT 1`,
    [accountId],
  );
  const person = people[0];
  if (!person) return null;
  const [works] = await db().query<WorkRow[]>(
    `SELECT w.work_id, w.creator_id, w.title, w.media_type, w.description, w.soundcloud_url, w.featured,
            DATE_FORMAT(w.published_at, '%Y-%m-%d %H:%i:%s') AS published_at,
            a.name AS creator_name
     FROM creative_work AS w
     JOIN account AS a ON a.account_id = w.creator_id
     WHERE w.creator_id = ? AND w.archived = 0
     ORDER BY w.published_at`,
    [accountId],
  );
  return { person, works: works.map(toCard) };
}

export type ReportCard = RowDataPacket & {
  report_id: number;
  case_id: number | null;
  work_id: number;
  title: string;
  creator_id?: number;
  creator_name: string;
  reason: string;
  reporter_name: string;
  findings: string | null;
  action_taken: string | null;
  case_status: string | null;
  moderator_name: string | null;
};

const unsentReports = [
  ["Amara Cole", "He was told in the chat to drop this and then posted it on the feed.", "2026-10-08 11:50:00"],
  ["Luis Ortega", "This is the same argument from the group chat. He was asked to stop and left the post up.", "2026-10-08 12:20:00"],
  ["Nia Brooks", "A private argument is on the feed after people asked him to stop posting about it.", "2026-10-08 15:10:00"],
  ["Marcus Hale", "He posted the receipt after everybody told him to stop. The messages should not be a post.", "2026-10-08 21:25:00"],
] as const;

async function ensurePieceReports() {
  await db().query(
    `DELETE wr FROM work_report AS wr
     WHERE wr.work_id = 5
       AND wr.reason = 'Several creators reported repeated messages after they asked the conversation to stop.'
       AND NOT EXISTS (SELECT 1 FROM moderation_case AS mc WHERE mc.report_id = wr.report_id)`,
  );
  for (const [name, reason, reportedAt] of unsentReports) {
    await db().query(
      `INSERT INTO work_report (work_id, reason, reporter_name, reported_at)
       SELECT 5, ?, ?, ?
       FROM creative_work AS w
       WHERE w.work_id = 5 AND w.title = 'Unsent letter'
         AND NOT EXISTS (
           SELECT 1 FROM work_report AS wr
           WHERE wr.work_id = 5 AND wr.reporter_name = ? AND wr.reason = ?
         )`,
      [reason, name, reportedAt, name, reason],
    );
  }
}

export async function reportReasonByWork() {
  await ensurePieceReports();
  const [rows] = await db().query<RowDataPacket[]>(
    `SELECT work_id, reason FROM work_report ORDER BY reported_at`,
  );
  const marks: Record<string, string[]> = {};
  for (const row of rows) {
    const id = String(row.work_id);
    const reason = String(row.reason || "").trim();
    if (!reason) continue;
    if (!marks[id]) marks[id] = [];
    marks[id].push(reason);
  }
  return marks;
}

export async function listReports(q = "") {
  await ensurePieceReports();
  const term = likeTerm(q);
  const [rows] = await db().query<ReportCard[]>(
    `SELECT wr.report_id, mc.case_id, wr.work_id, w.title, c.account_id AS creator_id, c.name AS creator_name,
            wr.reason, wr.reporter_name, mc.findings, mc.action_taken,
            mc.status AS case_status, m.name AS moderator_name
     FROM work_report AS wr
     JOIN creative_work AS w ON w.work_id = wr.work_id
     JOIN account AS c ON c.account_id = w.creator_id
     LEFT JOIN moderation_case AS mc ON mc.report_id = wr.report_id
     LEFT JOIN account AS m ON m.account_id = mc.moderator_id
     WHERE ? = '' OR w.title LIKE ? OR c.name LIKE ? OR wr.reason LIKE ?
     ORDER BY wr.reported_at DESC`,
    [q, term, term, term],
  );
  return rows;
}

export async function findCase(caseId: string) {
  const id = Number(caseId);
  if (!Number.isInteger(id)) return null;
  const [rows] = await db().query<ReportCard[]>(
    `SELECT report_id, case_id, work_id, title, creator_name, reason, reporter_name,
            findings, action_taken, case_status, moderator_name
     FROM reported_work
     WHERE case_id = ?
     LIMIT 1`,
    [id],
  );
  return rows[0] || null;
}

export async function listUserReports() {
  await ensureCommentThreadColumns();
  await ensurePieceReports();
  const [rows] = await db().query<RowDataPacket[]>(
    `SELECT source, report_id, account_id, name, email, reason, reporter_name,
            DATE_FORMAT(reported_at, '%Y-%m-%d %H:%i') AS reported_at,
            work_id, title, channel, comment_id, body
     FROM (
       SELECT 'account' AS source, u.user_report_id AS report_id, a.account_id, a.name, a.email,
              u.reason, NULL AS reporter_name, u.reported_at, NULL AS work_id, NULL AS title,
              NULL AS channel, NULL AS comment_id, NULL AS body
       FROM user_report AS u
       JOIN account AS a ON a.account_id = u.account_id
       WHERE u.reason <> 'Several creators reported repeated messages after they asked the conversation to stop.'
         AND NOT EXISTS (
           SELECT 1
           FROM work_report AS wr
           JOIN creative_work AS w ON w.work_id = wr.work_id
           WHERE w.creator_id = u.account_id AND wr.reason = u.reason
         )
       UNION ALL
       SELECT 'post', wr.report_id, c.account_id, c.name, c.email,
              wr.reason, wr.reporter_name, wr.reported_at, w.work_id, w.title, 'comments', NULL, NULL
       FROM work_report AS wr
       JOIN creative_work AS w ON w.work_id = wr.work_id
       JOIN account AS c ON c.account_id = w.creator_id
       UNION ALL
       SELECT 'comment', r.comment_report_id, a.account_id, a.name, a.email,
              r.reason, rep.name, r.reported_at, c.work_id, w.title, c.channel, c.comment_id, c.body
       FROM comment_report AS r
       JOIN comment AS c ON c.comment_id = r.comment_id
       JOIN account AS a ON a.account_id = c.author_id
       JOIN account AS rep ON rep.account_id = r.reporter_id
       JOIN creative_work AS w ON w.work_id = c.work_id
     ) AS reports
     ORDER BY reported_at DESC`,
  );
  return rows;
}

export async function findAccountName(id: string) {
  const accountId = Number(id);
  if (!Number.isInteger(accountId)) return null;
  const [rows] = await db().query<RowDataPacket[]>(
    `SELECT account_id, name, email FROM account WHERE account_id = ? LIMIT 1`,
    [accountId],
  );
  return rows[0] || null;
}

export type WorkReportMark = {
  reportId: number;
  caseId: number | null;
  reason: string;
  status: string;
};

export async function reportsForWork(workId: string) {
  const id = Number(workId);
  if (!Number.isInteger(id)) return [];
  await ensurePieceReports();
  const [rows] = await db().query<RowDataPacket[]>(
    `SELECT wr.report_id, wr.reason, mc.case_id, mc.status AS case_status
     FROM work_report AS wr
     LEFT JOIN moderation_case AS mc ON mc.report_id = wr.report_id
     WHERE wr.work_id = ?
     ORDER BY wr.reported_at DESC`,
    [id],
  );
  return rows.map((row) => ({
    reportId: Number(row.report_id),
    caseId: row.case_id == null ? null : Number(row.case_id),
    reason: String(row.reason || ""),
    status: row.case_status ? String(row.case_status) : "",
  }));
}

export async function findWorkReport(reportId: string) {
  const id = Number(reportId);
  if (!Number.isInteger(id)) return null;
  const [rows] = await db().query<RowDataPacket[]>(
    `SELECT wr.report_id, wr.work_id, wr.reason, wr.reporter_name, w.title, a.name AS creator_name, mc.case_id
     FROM work_report AS wr
     JOIN creative_work AS w ON w.work_id = wr.work_id
     JOIN account AS a ON a.account_id = w.creator_id
     LEFT JOIN moderation_case AS mc ON mc.report_id = wr.report_id
     WHERE wr.report_id = ?
     LIMIT 1`,
    [id],
  );
  return rows[0] || null;
}

export async function caseForWork(workId: string) {
  const id = Number(workId);
  if (!Number.isInteger(id)) return null;
  const [rows] = await db().query<ReportCard[]>(
    `SELECT report_id, case_id, work_id, title, creator_name, reason, reporter_name,
            findings, action_taken, case_status, moderator_name
     FROM reported_work
     WHERE work_id = ?
     LIMIT 1`,
    [id],
  );
  return rows[0] || null;
}

export async function listInteractedPieces(accountId: number) {
  await ensureCommentVotes();
  const [rows] = await db().query<WorkRow[]>(
    `SELECT w.work_id, w.creator_id, w.title, w.media_type, w.description, w.soundcloud_url, w.featured,
            DATE_FORMAT(w.published_at, '%Y-%m-%d %H:%i:%s') AS published_at,
            a.name AS creator_name
     FROM creative_work AS w
     JOIN account AS a ON a.account_id = w.creator_id
     WHERE w.archived = 0
       AND (
         EXISTS (SELECT 1 FROM comment AS c WHERE c.work_id = w.work_id AND c.author_id = ?)
         OR EXISTS (SELECT 1 FROM saved_work AS s WHERE s.work_id = w.work_id AND s.account_id = ?)
         OR EXISTS (
           SELECT 1
           FROM comment_vote AS v
           JOIN comment AS liked ON liked.comment_id = v.comment_id
           WHERE liked.work_id = w.work_id AND v.account_id = ? AND v.vote = 'like'
         )
       )
     ORDER BY w.title`,
    [accountId, accountId, accountId],
  );
  return rows.map(toCard);
}

export async function hasPieceInteraction(accountId: number, workId: number) {
  await ensureCommentVotes();
  const [rows] = await db().query<RowDataPacket[]>(
    `SELECT w.work_id
     FROM creative_work AS w
     WHERE w.work_id = ? AND w.archived = 0
       AND (
         EXISTS (SELECT 1 FROM comment AS c WHERE c.work_id = w.work_id AND c.author_id = ?)
         OR EXISTS (SELECT 1 FROM saved_work AS s WHERE s.work_id = w.work_id AND s.account_id = ?)
         OR EXISTS (
           SELECT 1
           FROM comment_vote AS v
           JOIN comment AS liked ON liked.comment_id = v.comment_id
           WHERE liked.work_id = w.work_id AND v.account_id = ? AND v.vote = 'like'
         )
       )
     LIMIT 1`,
    [workId, accountId, accountId, accountId],
  );
  return Boolean(rows[0]);
}

export async function listMentorPieces(mentorId: number) {
  const [rows] = await db().query<WorkRow[]>(
    `SELECT w.work_id, w.creator_id, w.title, w.media_type, w.description, w.soundcloud_url, w.featured,
            DATE_FORMAT(w.published_at, '%Y-%m-%d %H:%i:%s') AS published_at,
            a.name AS creator_name
     FROM creative_work AS w
     JOIN account AS a ON a.account_id = w.creator_id
     WHERE w.archived = 0
       AND w.work_id IN (
         SELECT work_id FROM mentor_feedback WHERE mentor_id = ?
         UNION
         SELECT work_id FROM comment WHERE author_id = ?
         UNION
         SELECT work_id FROM saved_work WHERE account_id = ?
         UNION
         SELECT work_id FROM review_request WHERE mentor_id = ?
       )
     ORDER BY w.title`,
    [mentorId, mentorId, mentorId, mentorId],
  );
  return rows.map(toCard);
}

export async function isWorkSaved(accountId: number, workId: string) {
  const id = Number(workId);
  if (!Number.isInteger(id)) return false;
  const [rows] = await db().query<RowDataPacket[]>(
    `SELECT save_id FROM saved_work WHERE account_id = ? AND work_id = ? LIMIT 1`,
    [accountId, id],
  );
  return Boolean(rows[0]);
}

export async function listSavedWorks(accountId: number) {
  const [rows] = await db().query<WorkRow[]>(
    `SELECT w.work_id, w.creator_id, w.title, w.media_type, w.description, w.soundcloud_url, w.featured,
            DATE_FORMAT(w.published_at, '%Y-%m-%d %H:%i:%s') AS published_at,
            a.name AS creator_name
     FROM saved_work AS s
     JOIN creative_work AS w ON w.work_id = s.work_id
     JOIN account AS a ON a.account_id = w.creator_id
     WHERE s.account_id = ?
     ORDER BY s.saved_at DESC`,
    [accountId],
  );
  return rows.map(toCard);
}

export async function listAccountActivity(accountId: number) {
  const [rows] = await db().query<RowDataPacket[]>(
    `SELECT 'comment' AS kind, w.title, w.work_id, c.body AS detail,
            DATE_FORMAT(c.created_at, '%Y-%m-%d %H:%i:%s') AS happened_at
     FROM comment AS c
     JOIN creative_work AS w ON w.work_id = c.work_id
     WHERE c.author_id = ?
     UNION ALL
     SELECT 'feedback', w.title, w.work_id, f.recommendation,
            DATE_FORMAT(f.written_at, '%Y-%m-%d %H:%i:%s')
     FROM mentor_feedback AS f
     JOIN creative_work AS w ON w.work_id = f.work_id
     WHERE f.mentor_id = ?
     UNION ALL
     SELECT 'opportunity', o.title, o.opportunity_id, IFNULL(o.description, ''),
            DATE_FORMAT(o.starts_on, '%Y-%m-%d %H:%i:%s')
     FROM opportunity AS o
     WHERE o.scout_id = ?
     ORDER BY happened_at DESC
     LIMIT 40`,
    [accountId, accountId, accountId],
  );
  return rows;
}

export async function findOpportunity(id: string) {
  const opportunityId = Number(id);
  if (!Number.isInteger(opportunityId)) return null;
  const [rows] = await db().query<RowDataPacket[]>(
    `SELECT o.opportunity_id, o.scout_id, o.title,
            DATE_FORMAT(o.starts_on, '%Y-%m-%d') AS starts_on,
            DATE_FORMAT(o.ends_on, '%Y-%m-%d') AS ends_on,
            o.description, a.name AS scout_name
     FROM opportunity AS o
     JOIN account AS a ON a.account_id = o.scout_id
     WHERE o.opportunity_id = ?
     LIMIT 1`,
    [opportunityId],
  );
  if (!rows[0]) return null;
  const [invites] = await db().query<RowDataPacket[]>(
    `SELECT i.invitation_id, i.status, i.creator_id, a.name AS creator_name,
            DATE_FORMAT(i.invited_at, '%Y-%m-%d') AS invited_at
     FROM invitation AS i
     JOIN account AS a ON a.account_id = i.creator_id
     WHERE i.opportunity_id = ?
     ORDER BY i.invited_at DESC`,
    [opportunityId],
  );
  return { opportunity: rows[0], invites };
}

export async function listOpportunities() {
  const [rows] = await db().query<RowDataPacket[]>(
    `SELECT o.opportunity_id, o.title,
            DATE_FORMAT(o.starts_on, '%Y-%m-%d') AS starts_on,
            DATE_FORMAT(o.ends_on, '%Y-%m-%d') AS ends_on,
            o.description, a.name AS scout_name
     FROM opportunity AS o
     JOIN account AS a ON a.account_id = o.scout_id
     ORDER BY o.opportunity_id DESC`,
  );
  return rows;
}

export async function listFeedbackForWork(workId: string) {
  const id = Number(workId);
  if (!Number.isInteger(id)) return [];
  const [rows] = await db().query<RowDataPacket[]>(
    `SELECT f.feedback_id, f.strengths, f.improvements, f.recommendation, m.name AS mentor_name,
            DATE_FORMAT(f.written_at, '%Y-%m-%d %H:%i:%s') AS written_at
     FROM mentor_feedback AS f
     JOIN account AS m ON m.account_id = f.mentor_id
     WHERE f.work_id = ?
     ORDER BY f.written_at`,
    [id],
  );
  return rows;
}

export async function listFeedbackForCreator(creatorId: number) {
  const [rows] = await db().query<RowDataPacket[]>(
    `SELECT f.feedback_id, w.work_id, w.title, m.name AS mentor_name,
            f.strengths, f.improvements, f.recommendation,
            DATE_FORMAT(f.written_at, '%Y-%m-%d %H:%i:%s') AS written_at
     FROM mentor_feedback AS f
     JOIN creative_work AS w ON w.work_id = f.work_id
     JOIN account AS m ON m.account_id = f.mentor_id
     WHERE w.creator_id = ?
     ORDER BY f.written_at DESC`,
    [creatorId],
  );
  return rows;
}

export async function listMentorFeedback(mentorId: number) {
  const [rows] = await db().query<RowDataPacket[]>(
    `SELECT f.feedback_id, f.work_id, w.title, f.strengths, f.improvements, f.recommendation,
            DATE_FORMAT(f.written_at, '%Y-%m-%d %H:%i:%s') AS written_at
     FROM mentor_feedback AS f
     JOIN creative_work AS w ON w.work_id = f.work_id
     WHERE f.mentor_id = ?
     ORDER BY f.written_at DESC`,
    [mentorId],
  );
  return rows;
}

const dbRoles = ["Creator", "Mentor", "Talent Scout", "Moderator", "Administrator"] as const;

export async function saveRoleAccount(input: {
  name: string;
  email: string;
  role: (typeof dbRoles)[number];
  password: string;
}) {
  const hash = await bcrypt.hash(input.password, 10);
  await db().query(
    `INSERT INTO account (name, email, role, status, password_hash)
     VALUES (?, ?, ?, 'active', ?)
     ON DUPLICATE KEY UPDATE
       name = VALUES(name),
       role = VALUES(role),
       status = 'active',
       password_hash = VALUES(password_hash)`,
    [input.name, input.email.trim().toLowerCase(), input.role, hash],
  );
}
