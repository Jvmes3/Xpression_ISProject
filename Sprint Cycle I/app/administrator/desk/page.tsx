import Link from "next/link";
import { RoleSignIn } from "../../components/RoleSignIn";
import { SprintNote } from "../../components/SprintNote";
import { TicketQueue } from "../../components/TicketQueue";
import { decideApplication, undoApplication } from "../../lib/actions";
import { accountLabel, canUseRole } from "../../lib/access";
import { currentAccount } from "../../lib/session";
import { readDatabase } from "../../lib/store";

export const dynamic = "force-dynamic";

export default async function AdministratorDeskPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; ticket?: string }>;
}) {
  const account = await currentAccount();
  if (!canUseRole(account, "administrator")) {
    return (
      <RoleSignIn
        role="administrator"
        title="Administrator desk"
        next="/administrator/desk"
        signedInAs={account ? accountLabel(account) : undefined}
      />
    );
  }
  const admin = account;
  const { ticket } = await searchParams;
  const db = readDatabase();
  const applications = db.accounts.filter((item) => item.application && item.application.status !== "new" && item.application.status !== "draft");

  return (
    <main className="page">
      <p className="eyebrow">{admin ? `Signed in as ${admin.email}` : "Administrator"}</p>
      <h1>Administrator desk</h1>
      <p className="lede">
        Review role applications, accounts, categories, content, escalated
        reports, and platform settings.
      </p>
      <nav className="desk-nav" aria-label="Administrator tasks">
        <a href="#applications">Applications</a>
        <a href="#accounts">Accounts</a>
        <a href="#roles">Roles</a>
        <a href="#categories">Categories</a>
        <a href="#content">Content</a>
        <a href="#reports">Reported activity</a>
        <a href="#tickets">Help tickets</a>
        <a href="#analytics">Analytics</a>
        <a href="#settings">Settings</a>
      </nav>

      <section id="applications" className="panel">
        <h2>Role applications</h2>
        <p>Mentor and Talent Scout applications wait here after they are submitted. Creator applications can be approved the same way.</p>
        {applications.length === 0 ? <p>No submitted applications yet.</p> : null}
        <div className="task-list">
          {applications.map((item) => {
            const application = item.application;
            if (!application) return null;
            const areas = application.areas.map((area) => area.label || area.media).filter(Boolean);
            return (
              <article key={item.id}>
                <p className="flag">{application.status}</p>
                <h3>{application.name || item.email}</h3>
                <p className="meta-line">{item.email} · {application.role || "Role not chosen"}{areas.length ? ` · ${areas.join(", ")}` : ""}</p>
                <p>{application.reason}</p>
                <p><Link href={`/administrator/applications/${item.id}`}>See full application</Link></p>
                {application.status === "approved" ? (
                  <p className="meta-line">Xpression login {application.xpressionEmail} · {application.xpressionPassword}</p>
                ) : null}
                <form className="task-actions">
                  {application.status === "pending" || application.status === "rejected" ? (
                    <button className="button" type="submit" formAction={decideApplication.bind(null, item.id, "approved")}>Approve</button>
                  ) : null}
                  {application.status === "pending" ? (
                    <button className="button button-quiet" type="submit" formAction={decideApplication.bind(null, item.id, "rejected")}>Reject</button>
                  ) : null}
                  {application.status === "approved" || application.status === "rejected" ? (
                    <button className="button button-quiet" type="submit" formAction={undoApplication.bind(null, item.id)}>Undo decision</button>
                  ) : null}
                </form>
              </article>
            );
          })}
        </div>
      </section>

      <section id="accounts" className="panel">
        <h2>User accounts</h2>
        <p>Activate returns a suspended, banned, or deactivated account.</p>
        <form className="task-actions">
          <label>
            Search
            <input name="q" disabled placeholder="Email or name" />
          </label>
          <button className="button" type="button" disabled>Search</button>
        </form>
        <SprintNote label="account changes" />
        <form className="task-actions">
          <button className="button" type="button" disabled>Activate</button>
          <button className="button button-quiet" type="button" disabled>Suspend</button>
          <button className="button button-quiet" type="button" disabled>Ban</button>
          <button className="button button-quiet" type="button" disabled>Deactivate</button>
        </form>
      </section>

      <section id="roles" className="panel">
        <h2>Roles and permissions</h2>
        <p>Moderator and administrator accounts are created in the terminal. Creators, mentors, and talent scouts come from Apply.</p>
        <SprintNote label="role changes" />
      </section>

      <section id="categories" className="panel">
        <h2>Creative categories</h2>
        <p>Writing, visual art, and music stay available. Add another category, rename one, or mark it inactive.</p>
        <SprintNote label="category changes" />
        <form className="task-actions">
          <label>
            New category
            <input name="name" disabled placeholder="For example, film or performance" />
          </label>
          <button className="button" type="button" disabled>Add category</button>
        </form>
      </section>

      <section id="content" className="panel">
        <h2>Platform content</h2>
        <p>Show puts a hidden or removed post back on the platform.</p>
        <SprintNote label="content changes" />
        <form className="task-actions">
          <button className="button" type="button" disabled>Show</button>
          <button className="button button-quiet" type="button" disabled>Hide</button>
          <button className="button button-quiet" type="button" disabled>Remove</button>
        </form>
      </section>

      <section id="reports" className="panel">
        <h2>Reported activity</h2>
        <p>Escalated user reports and cases appear here.</p>
        <SprintNote label="escalated reports" />
      </section>

      <section id="tickets" className="panel">
        <h2>Escalated help tickets</h2>
        <p>These tickets were sent by a moderator. Reply, mark one resolved, or set it aside with a reason.</p>
        <TicketQueue tickets={db.tickets.filter((item) => item.status === "escalated")} canEscalate={false} notice={ticket} />
      </section>

      <section id="analytics" className="panel">
        <h2>Analytics and reports</h2>
        <p>Generate a report of accounts, posts, and open cases.</p>
        <SprintNote label="reports" />
        <button className="button" type="button" disabled>Generate report</button>
      </section>

      <section id="settings" className="panel">
        <h2>System configuration</h2>
        <p>Comments, GIFs, uploads, and the moderation rule.</p>
        <SprintNote label="settings changes" />
        <form className="form">
          <label>
            Comments
            <select name="commentsOpen" disabled defaultValue="yes">
              <option value="yes">Open</option>
              <option value="no">Closed</option>
            </select>
          </label>
          <label>
            GIFs on comments
            <select name="gifsAllowed" disabled defaultValue="yes">
              <option value="yes">Allowed</option>
              <option value="no">Not allowed</option>
            </select>
          </label>
          <label>
            Upload note
            <textarea name="uploadNote" disabled placeholder="What members should know before uploading." />
          </label>
          <label>
            Moderation rule
            <textarea name="moderationRule" disabled placeholder="How reported work is handled." />
          </label>
          <button className="button" type="button" disabled>Save settings</button>
        </form>
      </section>
    </main>
  );
}
