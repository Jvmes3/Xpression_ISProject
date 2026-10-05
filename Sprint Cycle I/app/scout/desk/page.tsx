import { RoleSignIn } from "../../components/RoleSignIn";
import { SprintNote } from "../../components/SprintNote";
import { accountLabel, canUseRole } from "../../lib/access";
import { currentAccount } from "../../lib/session";

const MEDIA = ["Writing", "Visual art", "Music"];

export const dynamic = "force-dynamic";

export default async function ScoutDeskPage() {
  const account = await currentAccount();
  if (!canUseRole(account, "scout")) {
    return (
      <RoleSignIn
        role="scout"
        title="Scout desk"
        next="/scout/desk"
        signedInAs={account ? accountLabel(account) : undefined}
      />
    );
  }

  return (
    <main className="page">
      <p className="eyebrow">Talent Scout workspace</p>
      <h1>Scout desk</h1>
      <p className="lede">Search portfolios, contact a creator, and send an invitation. Those lists are ready for the next sprint.</p>
      <nav className="desk-nav" aria-label="Scout tasks">
        <a href="#search">Search</a>
        <a href="#portfolio">Portfolio</a>
        <a href="#contact">Contact</a>
        <a href="#invite">Invite</a>
        <a href="#saved">Saved</a>
        <a href="#responses">Responses</a>
      </nav>

      <section id="search" className="panel">
        <h2>Search creators</h2>
        <p>Search by name or filter by the kind of work, then open a portfolio.</p>
        <form className="task-actions">
          <label>
            Search
            <input name="q" disabled placeholder="Name or title" />
          </label>
          <button className="button" type="button" disabled>Search</button>
        </form>
        <nav className="desk-nav" aria-label="Media filter">
          {MEDIA.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </nav>
        <SprintNote label="creators to review" />
      </section>

      <section id="portfolio" className="panel">
        <h2>Review a portfolio</h2>
        <p>Open a creator profile and read the work published there.</p>
        <SprintNote label="open portfolios" />
        <button className="button" type="button" disabled>Open portfolio</button>
      </section>

      <section id="contact" className="panel">
        <h2>Contact a creator</h2>
        <p>Send a private message about a commission or collaboration.</p>
        <SprintNote label="messages" />
        <form className="form">
          <label>
            Message
            <textarea name="message" disabled placeholder="What you want to talk about." />
          </label>
          <button className="button" type="button" disabled>Send message</button>
        </form>
      </section>

      <section id="invite" className="panel">
        <h2>Invite to an opportunity</h2>
        <p>Create a call with dates and invite selected creators.</p>
        <SprintNote label="invitations" />
        <form className="form">
          <label>
            Opportunity
            <input name="title" disabled placeholder="Commission, call, or performance" />
          </label>
          <label>
            Dates
            <input name="dates" disabled placeholder="When it happens" />
          </label>
          <button className="button" type="button" disabled>Send invite</button>
        </form>
      </section>

      <section id="saved" className="panel">
        <h2>Saved candidates</h2>
        <p>Organize bookmarked creators and individual works.</p>
        <SprintNote label="saved candidates" />
      </section>

      <section id="responses" className="panel">
        <h2>Track responses</h2>
        <p>See who was invited and how they replied.</p>
        <SprintNote label="responses" />
      </section>
    </main>
  );
}
