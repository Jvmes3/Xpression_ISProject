import Link from "next/link";
import { RoleSignIn } from "../../components/RoleSignIn";
import { accountLabel, canUseRole } from "../../lib/access";
import { listReports } from "../../lib/records";
import { currentAccount } from "../../lib/session";

export const dynamic = "force-dynamic";

export default async function ModeratorReportsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; case?: string; piece?: string; before?: string; action?: string }>;
}) {
  const account = await currentAccount();
  if (!canUseRole(account, "moderator")) {
    return (
      <RoleSignIn
        role="moderator"
        title="Reported work"
        next="/moderator/reports"
        signedInAs={account ? accountLabel(account) : undefined}
      />
    );
  }

  const { case: caseNote, piece, before, action, q: rawQuery } = await searchParams;
  const q = rawQuery?.trim() || "";
  const reports = await listReports(q);

  return (
    <main className="page">
      <p className="eyebrow">Community Moderator</p>
      <h1>Reported work</h1>
      <p className="lede">Search from the top of the page, then open the piece. The decision is recorded on the case page.</p>
      {caseNote === "saved" ? <p className="note">{piece || "That piece"} was {before || "unchanged"} and is now {action}.</p> : null}
      {caseNote === "account" ? <p className="note">This sign-in is not a Moderator row in the database.</p> : null}
      <form className="discover" action="/moderator/reports" method="get">
        <label className="search">
          <span className="sr-only">Search reports</span>
          <input name="q" defaultValue={q} placeholder="Title, creator, or reason" />
        </label>
        <button className="button" type="submit">Search</button>
      </form>
      <div className="task-list">
        {reports.length === 0 ? <p>No reports match that search.</p> : null}
        {reports.map((report) => (
          <article key={report.report_id} className="panel">
            <p className="flag">{report.case_status || "No case"}{report.action_taken ? ` · ${report.action_taken}` : ""}</p>
            <h2><Link href={`/creator/desk/${report.work_id}`}>{report.title}</Link></h2>
            <p className="meta-line">{report.creator_name} · reported by {report.reporter_name}</p>
            <p>{report.reason}</p>
            <p>
              <Link href={report.case_id ? `/moderator/cases/${report.case_id}` : `/moderator/cases/new?report=${report.report_id}`}>
                {report.case_id ? "Review the case" : "Record a decision"}
              </Link>
            </p>
          </article>
        ))}
      </div>
    </main>
  );
}
