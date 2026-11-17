"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { RowDataPacket } from "mysql2";
import { db } from "./db";
import { currentAccount } from "./session";

export async function addComment(formData: FormData) {
  const workId = Number(formData.get("workId"));
  const back = `/creator/desk/${Number.isInteger(workId) ? workId : ""}`;
  const account = await currentAccount();
  if (!account || account.status !== "active") redirect(`/sign-in?returnTo=${encodeURIComponent(back)}`);

  const body = String(formData.get("body") || "").trim();
  const parentRaw = String(formData.get("parentId") || "").trim();
  const parentId = parentRaw ? Number(parentRaw) : null;
  if (!Number.isInteger(workId) || !body) redirect(`${back}?notice=empty`);
  if (parentId !== null && !Number.isInteger(parentId)) redirect(back);

  const emails = [account.email, account.application?.xpressionEmail || ""].filter(Boolean);
  const [people] = await db().query<RowDataPacket[]>(
    `SELECT account_id FROM account WHERE email IN (?, ?) LIMIT 1`,
    [emails[0] || "", emails[1] || emails[0] || ""],
  );
  const authorId = people[0] ? Number(people[0].account_id) : 0;
  if (!authorId) redirect(`${back}?notice=account`);

  if (parentId !== null) {
    const [parents] = await db().query<RowDataPacket[]>(
      "SELECT comment_id FROM comment WHERE comment_id = ? AND work_id = ? LIMIT 1",
      [parentId, workId],
    );
    if (!parents[0]) redirect(back);
  }

  await db().query(
    `INSERT INTO comment (work_id, author_id, parent_comment_id, body, created_at)
     VALUES (?, ?, ?, ?, NOW())`,
    [workId, authorId, parentId, body.slice(0, 4000)],
  );
  revalidatePath(back);
  redirect(back);
}

export async function setReaction(commentId: number, likeDelta: number, dislikeDelta: number, workId: string) {
  const like = Math.trunc(likeDelta);
  const dislike = Math.trunc(dislikeDelta);
  if (!Number.isInteger(commentId) || ![-1, 0, 1].includes(like) || ![-1, 0, 1].includes(dislike)) return;
  await db().query(
    `UPDATE comment SET likes = GREATEST(0, likes + ?), dislikes = GREATEST(0, dislikes + ?) WHERE comment_id = ?`,
    [like, dislike, commentId],
  );
  revalidatePath(`/creator/desk/${workId}`);
}
