import { NotReady } from "../../components/NotReady";
import { SprintNote } from "../../components/SprintNote";

export const dynamic = "force-dynamic";

export default async function MentorDeskPage() {
  return (
    <main className="page">
      <p className="eyebrow">Creative Mentor workspace</p>
      <h1>Mentor desk</h1>
      <p className="lede">Accept or decline a request, record structured feedback, and nominate work for the featured feed.</p>
      <nav className="desk-nav" aria-label="Mentor tasks">
        <a href="#requests">Review requests</a>
        <a href="#feedback">Structured feedback</a>
        <a href="#nominate">Nominate featured work</a>
      </nav>

      <section id="requests" className="panel">
        <h2>Review requests</h2>
        <p>Accept or decline a request. Undo returns it to the waiting list. Accepted work can take structured feedback.</p>
        <SprintNote label="review requests" />
        <form className="task-actions">
          <NotReady className="button">Accept</NotReady>
          <NotReady className="button button-quiet">Decline</NotReady>
          <NotReady className="button button-quiet">Undo</NotReady>
        </form>
      </section>

      <section id="feedback" className="panel">
        <h2>Structured feedback</h2>
        <p>Record strengths, improvements, and a recommendation for the creator.</p>
        <SprintNote label="feedback to write" />
        <form className="form">
          <label>
            Strengths
            <textarea name="strengths" disabled placeholder="What is working in the piece." />
          </label>
          <label>
            Improvements
            <textarea name="improvements" disabled placeholder="What to revise next." />
          </label>
          <label>
            Recommendation
            <textarea name="recommendation" disabled placeholder="A next step for the creator." />
          </label>
          <NotReady className="button">Save feedback</NotReady>
        </form>
      </section>

      <section id="nominate" className="panel">
        <h2>Nominate featured work</h2>
        <p>Send a strong piece to a Moderator, with a short reason it belongs on the featured feed.</p>
        <form className="form">
          <label>
            Why it should be featured
            <textarea name="reason" disabled placeholder="What stands out in this piece." />
          </label>
          <NotReady className="button">Nominate</NotReady>
        </form>
      </section>
    </main>
  );
}
