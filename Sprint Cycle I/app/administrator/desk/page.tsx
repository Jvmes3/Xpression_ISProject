import { NotReady } from "../../components/NotReady";
import { SprintNote } from "../../components/SprintNote";
import { currentAccount } from "../../lib/session";

export const dynamic = "force-dynamic";

export default async function AdministratorDeskPage() {
  const admin = await currentAccount();

  return (
    <main className="page">
      <p className="eyebrow">{admin ? `Signed in as ${admin.email}` : "Administrator"}</p>
      <h1>Administrator desk</h1>
      <p className="lede">
        Update a user account, decide a Mentor or Talent Scout application, or generate a platform report.
      </p>
      <nav className="desk-nav" aria-label="Administrator tasks">
        <a href="#accounts">User accounts</a>
        <a href="#applications">Specialized accounts</a>
        <a href="#analytics">Analytics and reports</a>
      </nav>

      <section id="accounts" className="panel">
        <h2>User accounts</h2>
        <p>Search by email or name, then activate, suspend, ban, or deactivate an account.</p>
        <form className="task-actions">
          <label>
            Search
            <input name="q" disabled placeholder="Email or name" />
          </label>
          <NotReady className="button">Search</NotReady>
        </form>
        <SprintNote label="account changes" />
        <form className="task-actions">
          <NotReady className="button">Activate</NotReady>
          <NotReady className="button button-quiet">Suspend</NotReady>
          <NotReady className="button button-quiet">Ban</NotReady>
          <NotReady className="button button-quiet">Deactivate</NotReady>
        </form>
      </section>

      <section id="applications" className="panel">
        <h2>Approve specialized accounts</h2>
        <p>Accept or reject an application for Mentor or Talent Scout. Creators do not wait for this approval.</p>
        <SprintNote label="applications" />
        <form className="task-actions">
          <NotReady className="button">Accept</NotReady>
          <NotReady className="button button-quiet">Reject</NotReady>
        </form>
      </section>

      <section id="analytics" className="panel">
        <h2>Analytics and reports</h2>
        <p>Choose what the report should cover, then generate it.</p>
        <form className="form">
          <label>
            Report
            <select name="report" disabled defaultValue="usage">
              <option value="usage">Platform usage</option>
              <option value="accounts">Accounts</option>
              <option value="posts">Creative posts</option>
            </select>
          </label>
          <label>
            From
            <input name="from" disabled placeholder="Start date" />
          </label>
          <label>
            To
            <input name="to" disabled placeholder="End date" />
          </label>
          <NotReady className="button">Generate report</NotReady>
        </form>
      </section>
    </main>
  );
}
