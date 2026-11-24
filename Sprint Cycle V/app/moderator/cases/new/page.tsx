import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { RoleSignIn } from "../../../components/RoleSignIn";
import { accountLabel, canUseRole } from "../../../lib/access";
import { openReportCase } from "../../../lib/actions";
import { findWork, findWorkReport } from "../../../lib/records";
import { currentAccount } from "../../../lib/session";

export const dynamic = "force-dynamic";

const actions = ["kept available", "hidden", "removed"];
const statuses = ["open", "in review", "escalated", "closed"];

export default async function NewModerationCasePage({
  searchParams,
}: {
  searchParams: Promise<{ report?: string; work?: string; action?: string; case?: string }>;
}) {
  const account = await currentAccount();
  const query = await searchParams;
  const next = query.report
    ? `/moderator/cases/new?report=${query.report}`
    : `/moderator/cases/new?work=${query.work || ""}`;
  if (!canUseRole(account, "moderator")) {
    return (
      <RoleSignIn
        role="moderator"
        title="Moderation case"
        next={next}
        signedInAs={account ? accountLabel(account) : undefined}
      />
    );
  }

  const report = query.report ? await findWorkReport(query.report) : null;
  if (query.report && !report) notFound();
  if (report?.case_id) redirect(`/moderator/cases/${report.case_id}${query.action ? `?action=${encodeURIComponent(query.action)}` : ""}`);
  const work = !report && query.work ? await findWork(query.work, { includeArchived: true }) : null;
  if (!report && !work) notFound();

  const title = report ? String(report.title) : work?.title || "Piece";
  const chosen = actions.includes(query.action || "") ? query.action : "kept available";

  return (
    <main className="page">
      <p className="eyebrow">Community Moderator</p>
      <h1>{title}</h1>
      <p className="lede">
        {report
          ? String(report.reason)
          : "This piece has not been reported. The decision you write here opens the case."}
      </p>
      {report ? <p className="meta-line">{String(report.creator_name)} · reported by {String(report.reporter_name)}</p> : null}
      <p><Link href={`/creator/desk/${report ? report.work_id : work?.id}`}>Open the piece</Link></p>
      {query.case === "saved" ? <p className="note">The decision is saved.</p> : null}
      {query.case === "required" ? <p className="note">Write what you found before saving the decision.</p> : null}
      {query.case === "action" || query.case === "status" || query.case === "missing" ? <p className="note">Choose an action and a case status.</p> : null}
      {query.case === "account" ? <p className="note">This sign-in is not a Moderator row in the database.</p> : null}
      <form className="form panel" action={openReportCase}>
        <h2>Record a decision</h2>
        {report ? <input type="hidden" name="reportId" value={String(report.report_id)} /> : null}
        {!report && work ? <input type="hidden" name="workId" value={work.id} /> : null}
        <label>
          Findings
          <textarea name="findings" required placeholder="What you found when you reviewed the piece." />
        </label>
        <label>
          Action taken
          <select name="action" defaultValue={chosen || "kept available"}>
            {actions.map((item) => <option key={item}>{item}</option>)}
          </select>
        </label>
        <label>
          Case status
          <select name="caseStatus" defaultValue="in review">
            {statuses.map((item) => <option key={item}>{item}</option>)}
          </select>
        </label>
        <button className="button" type="submit">Save decision</button>
      </form>
      <p className="more"><Link href="/moderator/reports">Back to reported work</Link></p>
    </main>
  );
}
