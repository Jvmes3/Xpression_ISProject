import { NotReady } from "../../components/NotReady";
import { SprintNote } from "../../components/SprintNote";

const MEDIA = ["Writing", "Visual art", "Music"];

export const dynamic = "force-dynamic";

export default async function ScoutDeskPage() {
  return (
    <main className="page">
      <p className="eyebrow">Talent Scout workspace</p>
      <h1>Scout desk</h1>
      <p className="lede">Search creators who are open to work, contact one of them, or invite creators to an opportunity.</p>
      <nav className="desk-nav" aria-label="Scout tasks">
        <a href="#search">Search creators</a>
        <a href="#contact">Contact a creator</a>
        <a href="#invite">Invite to an opportunity</a>
      </nav>

      <section id="search" className="panel">
        <h2>Search creators</h2>
        <p>Filter by discipline, media type, and whether the creator is open to commissions, then open that portfolio.</p>
        <form className="task-actions">
          <label>
            Search
            <input name="q" disabled placeholder="Name or title" />
          </label>
          <NotReady className="button">Search</NotReady>
        </form>
        <nav className="desk-nav" aria-label="Media filter">
          {MEDIA.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </nav>
        <SprintNote label="creators to review" />
        <NotReady className="button">Open portfolio</NotReady>
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
          <NotReady className="button">Send message</NotReady>
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
          <NotReady className="button">Send invite</NotReady>
        </form>
      </section>
    </main>
  );
}
