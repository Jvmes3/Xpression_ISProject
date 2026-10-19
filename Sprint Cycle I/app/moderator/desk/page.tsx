import { NotReady } from "../../components/NotReady";
import { SprintNote } from "../../components/SprintNote";
import { currentAccount } from "../../lib/session";

export const dynamic = "force-dynamic";

export default async function ModeratorDeskPage() {
  const moderator = await currentAccount();

  return (
    <main className="page">
      <p className="eyebrow">{moderator ? `Signed in as ${moderator.email}` : "Community Moderator"}</p>
      <h1>Moderator desk</h1>
      <p className="lede">
        Decide reported work, decide a featured nomination, or warn or restrict a reported user.
      </p>
      <nav className="desk-nav" aria-label="Moderator tasks">
        <a href="#work">Reported work</a>
        <a href="#nominations">Featured nominations</a>
        <a href="#users">Reported users</a>
      </nav>

      <section id="work" className="panel">
        <h2>Reported creative work</h2>
        <p>Keep the work available, hide it, or remove it, then record the case.</p>
        <SprintNote label="reports" />
        <form className="task-actions">
          <NotReady className="button">Keep available</NotReady>
          <NotReady className="button button-quiet">Hide</NotReady>
          <NotReady className="button button-quiet">Remove</NotReady>
          <NotReady className="button button-quiet">Undo</NotReady>
        </form>
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
          <NotReady className="button">Save case</NotReady>
        </form>
      </section>

      <section id="nominations" className="panel">
        <h2>Featured nominations</h2>
        <p>Approve work a mentor nominated, or leave it off the featured feed.</p>
        <SprintNote label="nominations" />
        <form className="task-actions">
          <NotReady className="button">Approve for featured</NotReady>
          <NotReady className="button button-quiet">Decline</NotReady>
          <NotReady className="button button-quiet">Undo</NotReady>
        </form>
      </section>

      <section id="users" className="panel">
        <h2>Reported users</h2>
        <p>Warn the account or apply a temporary restriction. A ban is sent to an Administrator.</p>
        <SprintNote label="reported users" />
        <form className="task-actions">
          <NotReady className="button">Warn</NotReady>
          <NotReady className="button button-quiet">Restrict</NotReady>
          <NotReady className="button button-quiet">Send ban to administrator</NotReady>
        </form>
      </section>
    </main>
  );
}
