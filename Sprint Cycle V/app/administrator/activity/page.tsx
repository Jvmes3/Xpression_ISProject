import Link from "next/link";
import { ReportSubject, reportSubjectTitle } from "../../components/ReportSubject";
import { RoleSignIn } from "../../components/RoleSignIn";
import { accountLabel, canUseRole } from "../../lib/access";
import { listCommentReports, listReports } from "../../lib/records";
import { currentAccount } from "../../lib/session";

export const dynamic = "force-dynamic";

export default async function ActivityPage({
  searchParams,
}: {
  searchParams: Promise<{ work?: string; comment?: string; done?: string; who?: string; word?: string }>;
}) {
  const account = await currentAccount();
  if (!canUseRole(account, "administrator")) {
    return <RoleSignIn role="administrator" title="Reported activity" next="/administrator/activity" signedInAs={account ? accountLabel(account) : undefined} />;
  }

  const query = await searchParams;
  const workId = Number(query.work);
  const commentId = Number(query.comment);
  const openedComment = Number.isInteger(commentId);
  const openedWork = !openedComment && Number.isInteger(workId);
  const reports = await listReports();
  const comments = openedComment ? await listCommentReports() : [];
  const opened = openedComment
    ? comments.filter((item) => Number(item.comment_id) === commentId)
    : openedWork
      ? reports.filter((report) => Number(report.work_id) === workId)
      : null;
  const escalated = reports.filter((report) => report.case_status === "escalated");
  const openedItem = opened?.[0];
  const heading = openedComment && openedItem
    ? reportSubjectTitle("comment", String(openedItem.body || ""))
    : openedWork && openedItem
      ? reportSubjectTitle("post", String(openedItem.title || ""))
      : "Reported activity";
  const openedPerson = openedComment && openedItem
    ? String(openedItem.author_name)
    : openedWork && openedItem
      ? String(openedItem.creator_name)
      : "";
  const openedAccount = openedComment && openedItem
    ? Number(openedItem.author_id)
    : openedWork && openedItem
      ? Number(openedItem.creator_id)
      : 0;
  const openedBack = openedComment
    ? `/administrator/activity?comment=${commentId}`
    : `/administrator/activity?work=${workId}`;

  return (
    <main className="page">
      <p className="eyebrow">Administrator</p>
      {openedItem && openedAccount ? (
        <ReportSubject title={heading} person={openedPerson} accountId={openedAccount} back={openedBack} />
      ) : (
        <>
          <h1>{heading}</h1>
          <p className="lede">Cases a moderator has sent up.</p>
        </>
      )}
      {query.done === "saved" && query.who && query.word ? <p className="note">{query.who} was {query.word}.</p> : null}
      {query.done === "self" ? <p className="note">You cannot take that action on your own account.</p> : null}
      {query.done === "missing" || query.done === "invalid" || query.done === "account" ? <p className="note">That action did not save.</p> : null}
      {opened ? <p className="note"><Link href="/administrator/activity">All reported activity</Link></p> : null}
      <div className="task-list">
        {opened ? (
          opened.length === 0 ? <p>That report is no longer on file.</p> : openedComment ? (
            opened.map((item) => {
              const href = `/creator/desk/${item.work_id}${String(item.channel) === "feedbacks" ? "?talk=feedbacks" : ""}`;
              return (
                <article key={Number(item.comment_report_id)} className="panel is-reported">
                  <p className="flag">Comment · {String(item.reported_at)}</p>
                  <h2>Reported by {String(item.reporter_name)}</h2>
                  <p>{String(item.reason)}</p>
                  <p><Link href={href}>Open the piece</Link></p>
                </article>
              );
            })
          ) : (
            opened.map((report) => (
              <article key={report.report_id} className="panel is-reported">
                <p className="flag">{report.case_status || "Report"}{report.action_taken ? ` · ${report.action_taken}` : ""}</p>
                <h2>Reported by {report.reporter_name}</h2>
                <p>{report.reason}</p>
                <p><Link href={`/creator/desk/${report.work_id}`}>Open the piece</Link></p>
              </article>
            ))
          )
        ) : (
          <>
            {escalated.length === 0 ? <p>No cases are escalated right now.</p> : null}
            {escalated.map((report) => (
              <article key={report.case_id ?? report.report_id} className="panel">
                <p className="flag">{report.case_status} · {report.action_taken || "no action yet"}</p>
                <h2><Link href={`/creator/desk/${report.work_id}`}>{report.title}</Link></h2>
                <p className="meta-line">{report.creator_name} · {report.moderator_name || "No moderator yet"}</p>
                <p>{report.reason}</p>
              </article>
            ))}
          </>
        )}
      </div>
    </main>
  );
}
