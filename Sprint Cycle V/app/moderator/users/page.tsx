import Link from "next/link";
import { ReportSubject, reportSubjectTitle } from "../../components/ReportSubject";
import { RoleSignIn } from "../../components/RoleSignIn";
import { accountLabel, canUseRole } from "../../lib/access";
import { findAccountName, listUserReports } from "../../lib/records";
import { currentAccount } from "../../lib/session";

export const dynamic = "force-dynamic";

const sourceLabel: Record<string, string> = {
  account: "Account",
  post: "Post",
  comment: "Comment",
};

export default async function ModeratorUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ account?: string; work?: string; comment?: string; done?: string; who?: string; word?: string }>;
}) {
  const account = await currentAccount();
  if (!canUseRole(account, "moderator")) {
    return (
      <RoleSignIn
        role="moderator"
        title="Reported users"
        next="/moderator/users"
        signedInAs={account ? accountLabel(account) : undefined}
      />
    );
  }

  const query = await searchParams;
  const focus = Number(query.account);
  const workId = Number(query.work);
  const commentId = Number(query.comment);
  const reports = await listUserReports();
  const opened = Number.isInteger(commentId)
    ? reports.filter((item) => String(item.source) === "comment" && Number(item.comment_id) === commentId)
    : Number.isInteger(workId)
      ? reports.filter((item) => String(item.source) === "post" && Number(item.work_id) === workId)
      : null;
  const ordered = opened
    ?? (Number.isInteger(focus)
      ? [
          ...reports.filter((item) => Number(item.account_id) === focus),
          ...reports.filter((item) => Number(item.account_id) !== focus),
        ]
      : reports);
  const focused = Number.isInteger(focus) ? reports.some((item) => Number(item.account_id) === focus) : false;
  const missing = !opened && Number.isInteger(focus) && !focused ? await findAccountName(query.account || "") : null;
  const openedItem = opened?.[0];
  const openedKind = openedItem && String(openedItem.source) === "comment" ? "comment" : "post";
  const heading = openedItem
    ? reportSubjectTitle(openedKind, openedKind === "comment" ? String(openedItem.body || "") : String(openedItem.title || ""))
    : "Reported users";
  const openedBack = Number.isInteger(commentId)
    ? `/moderator/users?comment=${commentId}`
    : `/moderator/users?work=${workId}`;

  return (
    <main className="page">
      <p className="eyebrow">Community Moderator</p>
      {openedItem ? (
        <ReportSubject
          title={heading}
          person={String(openedItem.name)}
          accountId={Number(openedItem.account_id)}
          back={openedBack}
        />
      ) : (
        <>
          <h1>{heading}</h1>
          <p className="lede">Warn the account or apply a temporary restriction. Bans and other serious account actions go to an administrator.</p>
        </>
      )}
      {query.done === "saved" && query.who && query.word ? <p className="note">{query.who} was {query.word}.</p> : null}
      {query.done === "self" ? <p className="note">You cannot take that action on your own account.</p> : null}
      {query.done === "missing" || query.done === "invalid" || query.done === "account" ? <p className="note">That action did not save.</p> : null}
      {opened ? <p className="note"><Link href="/moderator/users">All reported users</Link></p> : null}
      {missing ? <p className="note">{String(missing.name)} has no report on file.</p> : null}
      <div className="task-list">
        {ordered.length === 0 ? <p>{opened ? "That report is no longer on file." : "No accounts have been reported."}</p> : null}
        {ordered.map((item) => {
          const pieceId = item.work_id == null ? "" : String(item.work_id);
          const href = pieceId
            ? `/creator/desk/${pieceId}${String(item.channel) === "feedbacks" ? "?talk=feedbacks" : ""}`
            : "";
          const source = sourceLabel[String(item.source)] || "Report";
          const reporter = String(item.reporter_name || "");
          return (
            <article
              key={`${item.source}-${item.report_id}`}
              className={opened || Number(item.account_id) === focus ? "panel is-reported" : "panel"}
            >
              <p className="flag">{source} · {String(item.reported_at)}</p>
              <h2>{reporter ? `Reported by ${reporter}` : String(item.name)}</h2>
              {opened ? null : <p className="meta-line">{String(item.email)}{item.title ? ` · ${String(item.title)}` : ""}</p>}
              <p>{String(item.reason)}</p>
              {href ? <p><Link href={href}>Open the piece</Link></p> : null}
            </article>
          );
        })}
      </div>
    </main>
  );
}
