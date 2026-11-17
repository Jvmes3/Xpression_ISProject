"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { addComment, setReaction } from "../lib/comment-actions";
import type { CommentCard } from "../lib/records";
import { formatWhen } from "../lib/when";

function CommentItem({
  comment,
  comments,
  workId,
  canComment,
  creator,
}: {
  comment: CommentCard;
  comments: CommentCard[];
  workId: string;
  canComment: boolean;
  creator: string;
}) {
  const [open, setOpen] = useState(false);
  const [vote, setVote] = useState<"" | "like" | "dislike">("");
  const [likes, setLikes] = useState(comment.likes);
  const [dislikes, setDislikes] = useState(comment.dislikes);
  const replies = comments.filter((item) => item.parentId === comment.id);
  const signIn = `/sign-in?returnTo=${encodeURIComponent(`/creator/desk/${workId}`)}`;

  useEffect(() => {
    const saved = window.localStorage.getItem(`xpression-vote-${comment.id}`);
    setVote(saved === "like" || saved === "dislike" ? saved : "");
    setLikes(comment.likes);
    setDislikes(comment.dislikes);
  }, [comment.id, comment.likes, comment.dislikes]);

  async function choose(next: "like" | "dislike") {
    const previous = vote;
    const chosen = previous === next ? "" : next;
    const likeDelta = (chosen === "like" ? 1 : 0) - (previous === "like" ? 1 : 0);
    const dislikeDelta = (chosen === "dislike" ? 1 : 0) - (previous === "dislike" ? 1 : 0);
    setVote(chosen);
    setLikes((count) => count + likeDelta);
    setDislikes((count) => count + dislikeDelta);
    if (chosen) window.localStorage.setItem(`xpression-vote-${comment.id}`, chosen);
    else window.localStorage.removeItem(`xpression-vote-${comment.id}`);
    try {
      await setReaction(comment.id, likeDelta, dislikeDelta, workId);
    } catch {
      setVote(previous);
      setLikes((count) => count - likeDelta);
      setDislikes((count) => count - dislikeDelta);
      if (previous) window.localStorage.setItem(`xpression-vote-${comment.id}`, previous);
      else window.localStorage.removeItem(`xpression-vote-${comment.id}`);
    }
  }

  return (
    <article className="comment">
      <p className="comment-by">
        <strong>{comment.author}</strong>
        {comment.author === creator ? <span className="op-tag">OP</span> : null}
        {formatWhen(comment.when) ? <span>{formatWhen(comment.when)}</span> : null}
      </p>
      <p>{comment.body}</p>
      {comment.gif ? <p><a href={comment.gif}>{comment.gif}</a></p> : null}
      <div className="comment-actions">
        <button className={vote === "like" ? "comment-action is-on" : "comment-action"} type="button" aria-pressed={vote === "like"} onClick={() => choose("like")}>
          Like {likes}
        </button>
        <button className={vote === "dislike" ? "comment-action is-down is-on" : "comment-action"} type="button" aria-pressed={vote === "dislike"} onClick={() => choose("dislike")}>
          Dislike {dislikes}
        </button>
        {canComment ? (
          <button className="comment-action" type="button" onClick={() => setOpen((value) => !value)}>
            {open ? "Cancel" : "Reply"}
          </button>
        ) : (
          <Link className="comment-action" href={signIn}>Reply</Link>
        )}
      </div>
      {open ? (
        <form className="comment-form" action={addComment}>
          <input type="hidden" name="workId" value={workId} />
          <input type="hidden" name="parentId" value={comment.id} />
          <textarea name="body" rows={3} placeholder={`Reply to ${comment.author}`} required />
          <button className="button" type="submit">Reply</button>
        </form>
      ) : null}
      {replies.length > 0 ? (
        <div className="comment-replies">
          {replies.map((reply) => (
            <CommentItem key={reply.id} comment={reply} comments={comments} workId={workId} canComment={canComment} creator={creator} />
          ))}
        </div>
      ) : null}
    </article>
  );
}

export function CommentThread({
  workId,
  comments,
  canComment,
  notice,
  creator,
}: {
  workId: string;
  comments: CommentCard[];
  canComment: boolean;
  notice?: string;
  creator: string;
}) {
  const roots = comments.filter((comment) => comment.parentId == null || !comments.some((item) => item.id === comment.parentId));
  const note = notice === "empty"
    ? "Write a comment before posting."
    : notice === "account"
      ? "This sign-in is not a role account yet, so it cannot comment."
      : "";

  return (
    <section className="thread">
      <h2>Comments</h2>
      {note ? <p className="note">{note}</p> : null}
      {canComment ? (
        <form className="comment-form comment-compose" action={addComment}>
          <input type="hidden" name="workId" value={workId} />
          <label>
            Add a comment
            <textarea name="body" rows={3} placeholder="Write your own comment" required />
          </label>
          <button className="button" type="submit">Comment</button>
        </form>
      ) : (
        <p><Link href={`/sign-in?returnTo=${encodeURIComponent(`/creator/desk/${workId}`)}`}>Sign in to comment</Link></p>
      )}
      {roots.length === 0 ? <p className="meta-line">No comments yet.</p> : null}
      {roots.map((comment) => (
        <CommentItem key={comment.id} comment={comment} comments={comments} workId={workId} canComment={canComment} creator={creator} />
      ))}
    </section>
  );
}
