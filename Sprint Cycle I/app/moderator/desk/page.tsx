import { RoleSignIn } from "../../components/RoleSignIn";
import { SprintNote } from "../../components/SprintNote";
import { TicketQueue } from "../../components/TicketQueue";
import { accountLabel, canUseRole } from "../../lib/access";
import { currentAccount } from "../../lib/session";
import { readDatabase } from "../../lib/store";

export const dynamic = "force-dynamic";

export default async function ModeratorDeskPage({
  searchParams,
}: {
  searchParams: Promise<{ ticket?: string }>;
}) {
  const account = await currentAccount();
  if (!canUseRole(account, "moderator")) {
    return (
      <RoleSignIn
        role="moderator"
        title="Moderator desk"
        next="/moderator/desk"
        signedInAs={account ? accountLabel(account) : undefined}
      />
    );
  }
  const moderator = account;
  const { ticket } = await searchParams;
  const tickets = readDatabase().tickets;

  return (
    <main className="page">
      <p className="eyebrow">{moderator ? `Signed in as ${moderator.email}` : "Community Moderator"}</p>
      <h1>Moderator desk</h1>
      <p className="lede">
        Review reported work, comments, and accounts. Record a case, and decide
        which nominated work is featured.
      </p>
      <nav className="desk-nav" aria-label="Moderator tasks">
        <a href="#work">Reported work</a>
        <a href="#comments">Comments and GIFs</a>
        <a href="#users">Reported users</a>
        <a href="#cases">Cases</a>
        <a href="#nominations">Featured nominations</a>
        <a href="#tickets">Help tickets</a>
      </nav>

      <section id="work" className="panel">
        <h2>Reported creative work</h2>
        <p>Keep the work available, hide it, or remove it.</p>
        <SprintNote label="reports" />
        <form className="task-actions">
          <button className="button" type="button" disabled>Keep available</button>
          <button className="button button-quiet" type="button" disabled>Hide</button>
          <button className="button button-quiet" type="button" disabled>Remove</button>
          <button className="button button-quiet" type="button" disabled>Undo</button>
        </form>
      </section>

      <section id="comments" className="panel">
        <h2>Comments and GIFs</h2>
        <p>Remove a reply that is abusive, spam, or unrelated to the work. Keep a reply that belongs in the conversation.</p>
        <SprintNote label="comments" />
        <form className="task-actions">
          <button className="button" type="button" disabled>Keep</button>
          <button className="button button-quiet" type="button" disabled>Remove</button>
          <button className="button button-quiet" type="button" disabled>Undo</button>
        </form>
      </section>

      <section id="users" className="panel">
        <h2>Reported users</h2>
        <p>Warn the account or apply a temporary restriction. Undo clears a warning, restriction, or escalation. Bans and other serious account actions go to an administrator.</p>
        <SprintNote label="reported users" />
        <form className="task-actions">
          <button className="button" type="button" disabled>Warn</button>
          <button className="button button-quiet" type="button" disabled>Restrict</button>
          <button className="button button-quiet" type="button" disabled>Escalate to administrator</button>
          <button className="button button-quiet" type="button" disabled>Undo</button>
        </form>
      </section>

      <section id="cases" className="panel">
        <h2>Moderation cases</h2>
        <p>Record findings, the action taken, and whether the case is still open, escalated, or closed.</p>
        <SprintNote label="cases" />
        <form className="form">
          <label>
            Findings
            <textarea name="findings" disabled placeholder="What you found in the report and the account activity." />
          </label>
          <label>
            Action taken
            <input name="action" disabled placeholder="Warning sent, content hidden, or sent to an administrator." />
          </label>
          <label>
            Case status
            <select name="status" disabled defaultValue="open">
              <option>open</option>
              <option>in review</option>
              <option>escalated</option>
              <option>closed</option>
            </select>
          </label>
          <button className="button" type="button" disabled>Save case</button>
        </form>
      </section>

      <section id="nominations" className="panel">
        <h2>Featured nominations</h2>
        <p>Approve work a mentor nominated, or leave it off the featured feed.</p>
        <SprintNote label="nominations" />
        <form className="task-actions">
          <button className="button" type="button" disabled>Approve for featured</button>
          <button className="button button-quiet" type="button" disabled>Decline</button>
          <button className="button button-quiet" type="button" disabled>Undo</button>
        </form>
      </section>

      <section id="tickets" className="panel">
        <h2>Help tickets</h2>
        <p>Reply with a specific answer, mark the ticket resolved, set it aside with a reason, or send it to an administrator.</p>
        <TicketQueue tickets={tickets} canEscalate notice={ticket} />
      </section>
    </main>
  );
}
