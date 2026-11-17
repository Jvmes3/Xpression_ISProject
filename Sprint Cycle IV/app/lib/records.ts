import bcrypt from "bcryptjs";
import type { RowDataPacket } from "mysql2";
import { db, likeTerm } from "./db";

export type WorkCard = {
  id: string;
  title: string;
  media: string;
  creator: string;
  description: string;
  link: string;
  featured: boolean;
  publishedAt: string;
};

type WorkRow = RowDataPacket & {
  work_id: number;
  title: string;
  media_type: string;
  description: string;
  soundcloud_url: string | null;
  featured: number;
  creator_name: string;
  published_at: string;
};

export async function listWorks(media = "", q = "") {
  const term = likeTerm(q);
  const [rows] = await db().query<WorkRow[]>(
    `SELECT w.work_id, w.title, w.media_type, w.description, w.soundcloud_url, w.featured,
            DATE_FORMAT(w.published_at, '%Y-%m-%d %H:%i:%s') AS published_at,
            a.name AS creator_name
     FROM creative_work AS w
     JOIN account AS a ON a.account_id = w.creator_id
     WHERE w.archived = 0
       AND (? = '' OR w.media_type = ?)
       AND (? = '' OR w.title LIKE ? OR a.name LIKE ? OR w.description LIKE ?)
     ORDER BY w.published_at DESC`,
    [media, media, q, term, term, term],
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
};

export async function listComments(workId: string) {
  const id = Number(workId);
  if (!Number.isInteger(id)) return [];
  const [rows] = await db().query<RowDataPacket[]>(
    `SELECT c.comment_id, c.parent_comment_id, c.body, c.gif_url,
            DATE_FORMAT(c.created_at, '%Y-%m-%d %H:%i:%s') AS created_at,
            c.likes, c.dislikes, a.name AS author_name
     FROM comment AS c
     JOIN account AS a ON a.account_id = c.author_id
     WHERE c.work_id = ?
     ORDER BY c.created_at`,
    [id],
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
  }));
}

export async function findWork(id: string) {
  const workId = Number(id);
  if (!Number.isInteger(workId)) return null;
  const [rows] = await db().query<WorkRow[]>(
    `SELECT w.work_id, w.title, w.media_type, w.description, w.soundcloud_url, w.featured,
            DATE_FORMAT(w.published_at, '%Y-%m-%d %H:%i:%s') AS published_at,
            a.name AS creator_name
     FROM creative_work AS w
     JOIN account AS a ON a.account_id = w.creator_id
     WHERE w.work_id = ? AND w.archived = 0
     LIMIT 1`,
    [workId],
  );
  return rows[0] ? toCard(rows[0]) : null;
}

function toCard(row: WorkRow): WorkCard {
  return {
    id: String(row.work_id),
    title: row.title,
    media: row.media_type,
    creator: row.creator_name,
    description: row.description,
    link: row.soundcloud_url || "",
    featured: Boolean(row.featured),
    publishedAt: row.published_at ? String(row.published_at) : "",
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
    `SELECT w.work_id, w.title, w.media_type, w.description, w.soundcloud_url, w.featured,
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
  title: string;
  creator_name: string;
  reason: string;
  reporter_name: string;
  findings: string | null;
  action_taken: string | null;
  case_status: string | null;
  moderator_name: string | null;
};

export async function listReports(q = "") {
  const term = likeTerm(q);
  const [rows] = await db().query<ReportCard[]>(
    `SELECT report_id, title, creator_name, reason, reporter_name, findings, action_taken, case_status, moderator_name
     FROM reported_work
     WHERE ? = '' OR title LIKE ? OR creator_name LIKE ? OR reason LIKE ?
     ORDER BY reported_at`,
    [q, term, term, term],
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
