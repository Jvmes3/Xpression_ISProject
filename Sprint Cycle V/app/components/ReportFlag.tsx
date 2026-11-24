"use client";

import Link from "next/link";
import { useState } from "react";
import { reportComment, reportPiece } from "../lib/comment-actions";

export function ReportMark({ reasons, href }: { reasons: string[]; href: string }) {
  const [open, setOpen] = useState(false);
  const list = reasons.map((item) => item.trim()).filter(Boolean);
  if (!href || list.length === 0) return null;
  const shown = list.slice(0, 3);
  const more = list.length > 3;
  return (
    <span className="report-mark-wrap">
      <button
        className={open ? "report-mark is-open" : "report-mark"}
        type="button"
        aria-expanded={open}
        aria-label="Reports"
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          setOpen((value) => !value);
        }}
      >
        !
      </button>
      {open ? (
        <span className="report-pop" onClick={(event) => event.stopPropagation()}>
          {shown.map((reason, index) => (
            <span className="report-pop-line" key={`${index}-${reason.slice(0, 40)}`}>{reason}</span>
          ))}
          <span className="report-pop-more">
            {more ? <span>...</span> : null}
            <Link href={href}>View reports</Link>
          </span>
        </span>
      ) : null}
    </span>
  );
}

function FlagSvg() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M6 3.5v17M6 4.5h12.2l-2.5 4.3 2.5 4.3H6" />
    </svg>
  );
}

export function FlagLink({ href, label }: { href: string; label: string }) {
  return (
    <Link className="flag-button" href={href} aria-label={label}>
      <FlagSvg />
    </Link>
  );
}

export function ReportFlag({
  workId,
  commentId,
  talk = "comments",
}: {
  workId: string;
  commentId?: number;
  talk?: "comments" | "feedbacks";
}) {
  const [open, setOpen] = useState(false);
  const label = commentId ? "Report this comment" : "Report this post";
  return (
    <div className={commentId ? "report-flag" : "report-flag report-flag-post"}>
      <button
        className={open ? "flag-button is-open" : "flag-button"}
        type="button"
        aria-label={label}
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        <FlagSvg />
      </button>
      {open ? (
        <form className="comment-form report-form" action={commentId ? reportComment : reportPiece}>
          <input type="hidden" name="workId" value={workId} />
          <input type="hidden" name="talk" value={talk} />
          {commentId ? <input type="hidden" name="commentId" value={commentId} /> : null}
          <textarea name="reason" rows={3} required placeholder="What should a moderator know?" />
          <div className="compose-actions">
            <button className="button" type="submit">Send report</button>
            <button className="button button-quiet" type="button" onClick={() => setOpen(false)}>Cancel</button>
          </div>
        </form>
      ) : null}
    </div>
  );
}
