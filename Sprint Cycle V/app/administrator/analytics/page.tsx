import { RoleSignIn } from "../../components/RoleSignIn";
import { SprintNote } from "../../components/SprintNote";
import { accountLabel, canUseRole } from "../../lib/access";
import { listAccounts, listReports, listWorks } from "../../lib/records";
import { currentAccount } from "../../lib/session";

export const dynamic = "force-dynamic";

export default async function AnalyticsPage() {
  const account = await currentAccount();
  if (!canUseRole(account, "administrator")) {
    return <RoleSignIn role="administrator" title="Analytics" next="/administrator/analytics" signedInAs={account ? accountLabel(account) : undefined} />;
  }
  const [accounts, works, reports] = await Promise.all([listAccounts(), listWorks(), listReports()]);
  const openCases = reports.filter((report) => report.case_status === "open" || report.case_status === "in review" || report.case_status === "escalated");

  return (
    <main className="page">
      <p className="eyebrow">Administrator</p>
      <h1>Analytics and reports</h1>
      <p className="lede">A current count of accounts, posts, and open cases.</p>
      <div className="cards">
        <article className="panel">
          <h2>{accounts.length}</h2>
          <p>Accounts</p>
        </article>
        <article className="panel">
          <h2>{works.length}</h2>
          <p>Posts on the feed</p>
        </article>
        <article className="panel">
          <h2>{openCases.length}</h2>
          <p>Open cases</p>
        </article>
      </div>
      <SprintNote label="a downloadable report" />
    </main>
  );
}
