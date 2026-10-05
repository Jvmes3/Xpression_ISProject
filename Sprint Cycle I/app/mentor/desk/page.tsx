import { RoleSignIn } from "../../components/RoleSignIn";
import { SprintNote } from "../../components/SprintNote";
import { accountLabel, canUseRole } from "../../lib/access";
import { currentAccount } from "../../lib/session";

export const dynamic = "force-dynamic";

export default async function MentorDeskPage() {
  const account = await currentAccount();
  if (!canUseRole(account, "mentor")) {
    return (
      <RoleSignIn
        role="mentor"
        title="Mentor desk"
        next="/mentor/desk"
        signedInAs={account ? accountLabel(account) : undefined}
      />
    );
  }

  return (
    <main className="page">
      <p className="eyebrow">Creative Mentor workspace</p>
      <h1>Mentor desk</h1>
      <p className="lede">Accept or decline a request, then record structured feedback. The lists below are ready for the next sprint.</p>
      <nav className="desk-nav" aria-label="Mentor tasks">
        <a href="#requests">Review requests</a>
        <a href="#feedback">Structured feedback</a>
        <a href="#discover">Discover work</a>
        <a href="#nominate">Nominate</a>
        <a href="#history">Review history</a>
        <a href="#messages">Messages</a>
      </nav>

      <section id="requests" className="panel">
        <h2>Review requests</h2>
        <p>Accept or decline a request. Undo returns it to the waiting list. Accepted work can take structured feedback.</p>
        <SprintNote label="review requests" />
        <form className="task-actions">
          <button className="button" type="button" disabled>Accept</button>
          <button className="button button-quiet" type="button" disabled>Decline</button>
          <button className="button button-quiet" type="button" disabled>Undo</button>
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
          <button className="button" type="button" disabled>Save feedback</button>
        </form>
      </section>

      <section id="discover" className="panel">
        <h2>Discover work</h2>
        <p>Search by creator, media type, or genre before offering a review.</p>
        <SprintNote label="discovery tools" />
      </section>

      <section id="nominate" className="panel">
        <h2>Nominate featured work</h2>
        <p>Send strong pieces to a Moderator for the featured feed.</p>
        <SprintNote label="nominations" />
        <button className="button" type="button" disabled>Nominate</button>
      </section>

      <section id="history" className="panel">
        <h2>Review history</h2>
        <p>See past reviews and requests still in progress.</p>
        <SprintNote label="review history" />
      </section>

      <section id="messages" className="panel">
        <h2>Messages</h2>
        <p>Clarify a review with the creator in private.</p>
        <SprintNote label="messages" />
      </section>
    </main>
  );
}
