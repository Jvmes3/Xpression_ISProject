import Link from "next/link";
import { notFound } from "next/navigation";
import { RoleSignIn } from "../../../components/RoleSignIn";
import { accountLabel, canUseRole } from "../../../lib/access";
import { decideReport } from "../../../lib/actions";
import { findCase } from "../../../lib/records";
import { currentAccount } from "../../../lib/session";

export const dynamic = "force-dynamic";

const actions = ["kept available", "hidden", "removed"];
const statuses = ["open", "in review", "escalated", "closed"];

export default async function ModeratorCasePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ action?: string; case?: string }>;
}) {
  const account = await currentAccount();
  const { id } = await params;
  if (!canUseRole(account, "moderator")) {
    return (
      <RoleSignIn
        role="moderator"
        title="Moderation case"
        next={`/moderator/cases/${id}`}
        signedInAs={account ? accountLabel(account) : undefined}
      />
    );
  }

  const report = await findCase(id);
  if (!report) notFound();
  const query = await searchParams;
  const chosen = actions.includes(query.action || "") ? query.action : report.action_taken || "kept available";
  const status = statuses.includes(report.case_status || "") ? report.case_status : "in review";

  return (
    <main className="page">
      <p className="eyebrow">Community Moderator</p>
      <h1>{report.title}</h1>
      <p className="lede">{report.reason}</p>
      <p className="meta-line">{report.creator_name} · reported by {report.reporter_name}</p>
      <p><Link href={`/creator/desk/${report.work_id}`}>Open the piece</Link></p>
      {query.case === "saved" ? <p className="note">The decision is saved.</p> : null}
      {query.case === "required" ? <p className="note">Write what you found before saving the decision.</p> : null}
      {query.case === "action" || query.case === "status" || query.case === "missing" ? <p className="note">Choose an action and a case status.</p> : null}
      {query.case === "account" ? <p className="note">This sign-in is not a Moderator row in the database.</p> : null}
      {report.findings ? (
        <section className="panel">
          <h2>Decision on record</h2>
          <p>{report.findings}</p>
          <p className="meta-line">{report.action_taken} · {report.case_status}{report.moderator_name ? ` · ${report.moderator_name}` : ""}</p>
        </section>
      ) : null}
      <form className="form panel" action={decideReport}>
        <h2>{report.findings ? "Change the decision" : "Record a decision"}</h2>
        <input type="hidden" name="caseId" value={report.case_id ?? ""} />
        <input type="hidden" name="back" value={`/moderator/cases/${report.case_id}`} />
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
          <select name="caseStatus" defaultValue={status || "in review"}>
            {statuses.map((item) => <option key={item}>{item}</option>)}
          </select>
        </label>
        <button className="button" type="submit">Save decision</button>
      </form>
      <p className="more"><Link href="/moderator/reports">Back to reported work</Link></p>
    </main>
  );
}
