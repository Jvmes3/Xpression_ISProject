"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { RowDataPacket } from "mysql2";
import { db } from "./db";
import { canUseRole } from "./access";
import { readExpression } from "./expressions";
import { ensureCommentThreadColumns, ensureCommentVotes } from "./records";
import { currentAccount } from "./session";
import { accountForSession } from "./writes";

export async function addComment(formData: FormData) {
  const workId = Number(formData.get("workId"));
  const back = `/creator/desk/${Number.isInteger(workId) ? workId : ""}`;
  const account = await currentAccount();
  if (!account || account.status !== "active") redirect(`/sign-in?returnTo=${encodeURIComponent(back)}`);

  const body = String(formData.get("body") || "").trim();
  const expression = readExpression(String(formData.get("media") || ""));
  const parentRaw = String(formData.get("parentId") || "").trim();
  const parentId = parentRaw ? Number(parentRaw) : null;
  await ensureCommentThreadColumns();
  let channel = "comments";
  if (parentId === null && String(formData.get("channel") || "") === "feedbacks") {
    redirect(`${back}?talk=feedbacks&notice=mentor`);
  }
  if (parentId !== null) {
    if (!Number.isInteger(parentId)) redirect(back);
    const [parents] = await db().query<RowDataPacket[]>(
      "SELECT comment_id, channel FROM comment WHERE comment_id = ? AND work_id = ? LIMIT 1",
      [parentId, workId],
    );
    if (!parents[0]) redirect(back);
    if (String(parents[0].channel) === "feedbacks") channel = "feedbacks";
  }
  const place = channel === "feedbacks" ? `${back}?talk=feedbacks` : back;
  const withNotice = (notice: string) => (place.includes("?") ? `${place}&notice=${notice}` : `${place}?notice=${notice}`);
  if (!Number.isInteger(workId) || (!body && !expression)) redirect(withNotice("empty"));

  const emails = [account.email, account.application?.xpressionEmail || ""].filter(Boolean);
  const [people] = await db().query<RowDataPacket[]>(
    `SELECT account_id FROM account WHERE email IN (?, ?) LIMIT 1`,
    [emails[0] || "", emails[1] || emails[0] || ""],
  );
  const authorId = people[0] ? Number(people[0].account_id) : 0;
  if (!authorId) redirect(withNotice("account"));

  const gifUrl = expression ? `xpression-gif:${expression.item.id}` : null;
  if (parentId !== null && gifUrl && !body) {
    const [existing] = await db().query<RowDataPacket[]>(
      `SELECT comment_id FROM comment
       WHERE parent_comment_id = ? AND author_id = ? AND gif_url = ?
       LIMIT 1`,
      [parentId, authorId, gifUrl],
    );
    if (!existing[0]) {
      await db().query(
        `INSERT INTO comment (work_id, author_id, parent_comment_id, body, gif_url, created_at, channel)
         VALUES (?, ?, ?, '', ?, NOW(), ?)`,
        [workId, authorId, parentId, gifUrl, channel],
      );
    }
  } else {
    await db().query(
      `INSERT INTO comment (work_id, author_id, parent_comment_id, body, gif_url, created_at, channel)
       VALUES (?, ?, ?, ?, ?, NOW(), ?)`,
      [workId, authorId, parentId, body.slice(0, 4000), gifUrl, channel],
    );
  }
  revalidatePath(back);
  redirect(place);
}

export async function toggleGifReaction(workId: number, parentId: number, gifId: string) {
  const gifUrl = `xpression-gif:${gifId}`;
  if (!readExpression(gifUrl) || !Number.isInteger(workId) || !Number.isInteger(parentId)) return;
  const account = await currentAccount();
  if (!account || account.status !== "active") return;
  const person = await accountForSession(account);
  const authorId = person ? Number(person.account_id) : 0;
  if (!authorId) return;
  await ensureCommentThreadColumns();
  const [parents] = await db().query<RowDataPacket[]>(
    `SELECT comment_id, channel FROM comment WHERE comment_id = ? AND work_id = ? LIMIT 1`,
    [parentId, workId],
  );
  const parent = parents[0];
  if (!parent) return;
  const channel = String(parent.channel) === "feedbacks" ? "feedbacks" : "comments";
  const [mine] = await db().query<RowDataPacket[]>(
    `SELECT comment_id, body FROM comment
     WHERE parent_comment_id = ? AND author_id = ? AND gif_url = ?`,
    [parentId, authorId, gifUrl],
  );
  if (mine.length) {
    await ensureCommentVotes();
    for (const row of mine) {
      const id = Number(row.comment_id);
      if (String(row.body || "").trim()) {
        await db().query(
          `UPDATE comment SET gif_url = NULL WHERE comment_id = ? AND author_id = ?`,
          [id, authorId],
        );
        continue;
      }
      await db().query(`UPDATE comment SET parent_comment_id = ? WHERE parent_comment_id = ?`, [parentId, id]);
      await db().query(`DELETE FROM comment_report WHERE comment_id = ?`, [id]);
      await db().query(`DELETE FROM comment_vote WHERE comment_id = ?`, [id]);
      await db().query(`DELETE FROM comment WHERE comment_id = ? AND author_id = ?`, [id, authorId]);
    }
  } else {
    await db().query(
      `INSERT INTO comment (work_id, author_id, parent_comment_id, body, gif_url, created_at, channel)
       VALUES (?, ?, ?, '', ?, NOW(), ?)`,
      [workId, authorId, parentId, gifUrl, channel],
    );
  }
  revalidatePath(`/creator/desk/${workId}`);
}

function piecePath(workId: number, talk: string) {
  const base = `/creator/desk/${Number.isInteger(workId) ? workId : ""}`;
  return talk === "feedbacks" ? `${base}?talk=feedbacks` : base;
}

function withNote(path: string, key: string, value: string) {
  return path.includes("?") ? `${path}&${key}=${value}` : `${path}?${key}=${value}`;
}

export async function reportPiece(formData: FormData) {
  const workId = Number(formData.get("workId"));
  const talk = String(formData.get("talk") || "") === "feedbacks" ? "feedbacks" : "comments";
  const back = piecePath(workId, talk);
  const account = await currentAccount();
  if (!account || account.status !== "active") redirect(`/sign-in?returnTo=${encodeURIComponent(back)}`);
  const person = await accountForSession(account);
  if (!person) redirect(withNote(back, "notice", "account"));
  const reason = String(formData.get("reason") || "").trim();
  if (!Number.isInteger(workId) || !reason) redirect(withNote(back, "notice", "report"));
  const [works] = await db().query<RowDataPacket[]>(
    `SELECT work_id, creator_id FROM creative_work WHERE work_id = ? LIMIT 1`,
    [workId],
  );
  const work = works[0];
  if (!work) redirect(withNote(back, "notice", "report"));
  if (Number(work.creator_id) === person.account_id) redirect(withNote(back, "notice", "self"));
  const [existing] = await db().query<RowDataPacket[]>(
    `SELECT report_id FROM work_report WHERE work_id = ? AND reporter_name = ? LIMIT 1`,
    [workId, person.name],
  );
  if (existing[0]) redirect(withNote(back, "notice", "already"));
  await db().query(
    `INSERT INTO work_report (work_id, reason, reporter_name, reported_at)
     VALUES (?, ?, ?, NOW())`,
    [workId, reason.slice(0, 2000), person.name.slice(0, 120)],
  );
  revalidatePath(`/creator/desk/${workId}`);
  revalidatePath("/feed");
  revalidatePath("/moderator/reports");
  revalidatePath("/moderator/users");
  revalidatePath("/moderator/cases");
  redirect(withNote(back, "review", "reported"));
}

export async function reportComment(formData: FormData) {
  const workId = Number(formData.get("workId"));
  const commentId = Number(formData.get("commentId"));
  const talk = String(formData.get("talk") || "") === "feedbacks" ? "feedbacks" : "comments";
  const back = piecePath(workId, talk);
  const account = await currentAccount();
  if (!account || account.status !== "active") redirect(`/sign-in?returnTo=${encodeURIComponent(back)}`);
  const person = await accountForSession(account);
  if (!person) redirect(withNote(back, "notice", "account"));
  const reason = String(formData.get("reason") || "").trim();
  if (!Number.isInteger(workId) || !Number.isInteger(commentId) || !reason) redirect(withNote(back, "notice", "report"));
  await ensureCommentThreadColumns();
  const [rows] = await db().query<RowDataPacket[]>(
    `SELECT comment_id, author_id FROM comment WHERE comment_id = ? AND work_id = ? LIMIT 1`,
    [commentId, workId],
  );
  const row = rows[0];
  if (!row) redirect(withNote(back, "notice", "report"));
  if (Number(row.author_id) === person.account_id) redirect(withNote(back, "notice", "self"));
  const [existing] = await db().query<RowDataPacket[]>(
    `SELECT comment_report_id FROM comment_report WHERE comment_id = ? AND reporter_id = ? LIMIT 1`,
    [commentId, person.account_id],
  );
  if (existing[0]) redirect(withNote(back, "notice", "already"));
  await db().query(
    `INSERT INTO comment_report (comment_id, reporter_id, reason, reported_at)
     VALUES (?, ?, ?, NOW())`,
    [commentId, person.account_id, reason.slice(0, 500)],
  );
  revalidatePath(`/creator/desk/${workId}`);
  revalidatePath("/moderator/users");
  redirect(withNote(back, "review", "reported"));
}

async function deleteCommentTree(commentId: number) {
  const [kids] = await db().query<RowDataPacket[]>(
    `SELECT comment_id FROM comment WHERE parent_comment_id = ?`,
    [commentId],
  );
  for (const kid of kids) await deleteCommentTree(Number(kid.comment_id));
  const [rows] = await db().query<RowDataPacket[]>(
    `SELECT feedback_id FROM comment WHERE comment_id = ? LIMIT 1`,
    [commentId],
  );
  const feedbackId = rows[0]?.feedback_id == null ? 0 : Number(rows[0].feedback_id);
  await db().query(`DELETE FROM comment_report WHERE comment_id = ?`, [commentId]);
  if (feedbackId) {
    const [notes] = await db().query<RowDataPacket[]>(
      `SELECT request_id FROM mentor_feedback WHERE feedback_id = ? LIMIT 1`,
      [feedbackId],
    );
    await db().query(`DELETE FROM feedback_reply WHERE feedback_id = ?`, [feedbackId]);
    await db().query(`DELETE FROM mentor_feedback WHERE feedback_id = ?`, [feedbackId]);
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
  await db().query(`DELETE FROM comment WHERE comment_id = ?`, [commentId]);
}

export async function removeComment(formData: FormData) {
  const workId = Number(formData.get("workId"));
  const commentId = Number(formData.get("commentId"));
  const talk = String(formData.get("talk") || "") === "feedbacks" ? "feedbacks" : "comments";
  const back = piecePath(workId, talk);
  const account = await currentAccount();
  if (!canUseRole(account, "moderator")) redirect(`/sign-in?returnTo=${encodeURIComponent(back)}`);
  if (!Number.isInteger(workId) || !Number.isInteger(commentId)) redirect(back);
  await ensureCommentThreadColumns();
  const [rows] = await db().query<RowDataPacket[]>(
    `SELECT comment_id FROM comment WHERE comment_id = ? AND work_id = ? LIMIT 1`,
    [commentId, workId],
  );
  if (!rows[0]) redirect(back);
  await deleteCommentTree(commentId);
  revalidatePath(`/creator/desk/${workId}`);
  revalidatePath("/moderator/users");
  redirect(withNote(back, "review", "removed"));
}

export async function setReaction(
  commentId: number,
  likeDelta: number,
  dislikeDelta: number,
  workId: string,
  vote: "" | "like" | "dislike" = "",
) {
  await ensureCommentThreadColumns();
  const like = Math.trunc(likeDelta);
  const dislike = Math.trunc(dislikeDelta);
  if (!Number.isInteger(commentId) || ![-1, 0, 1].includes(like) || ![-1, 0, 1].includes(dislike)) return;
  await db().query(
    `UPDATE comment SET likes = GREATEST(0, likes + ?), dislikes = GREATEST(0, dislikes + ?) WHERE comment_id = ?`,
    [like, dislike, commentId],
  );
  const account = await currentAccount();
  const person = account && account.status === "active" ? await accountForSession(account) : null;
  if (person && (vote === "like" || vote === "dislike" || vote === "")) {
    await ensureCommentVotes();
    if (vote === "like" || vote === "dislike") {
      await db().query(
        `INSERT INTO comment_vote (account_id, comment_id, vote) VALUES (?, ?, ?)
         ON DUPLICATE KEY UPDATE vote = VALUES(vote)`,
        [person.account_id, commentId, vote],
      );
    } else {
      await db().query(
        `DELETE FROM comment_vote WHERE account_id = ? AND comment_id = ?`,
        [person.account_id, commentId],
      );
    }
  }
  revalidatePath(`/creator/desk/${workId}`);
}
