import { RoleSignIn } from "../../components/RoleSignIn";
import { ToggleNav } from "../../components/ToggleNav";
import { SprintNote } from "../../components/SprintNote";
import { accountLabel, canUseRole } from "../../lib/access";
import { piecePreview } from "../../lib/pieces";
import { listWorks } from "../../lib/records";
import { currentAccount } from "../../lib/session";

export const dynamic = "force-dynamic";

export default async function MentorDeskPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
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

  const q = (await searchParams).q?.trim() || "";
  const works = await listWorks("", q);

  return (
    <main className="page">
      <p className="eyebrow">Creative Mentor workspace</p>
      <h1>Mentor desk</h1>
      <p className="lede">Search published work available for review. Requests, feedback, and nominations wait for a later sprint.</p>
      <ToggleNav
        label="Mentor tasks"
        links={[
          { href: "#requests", label: "Review requests" },
          { href: "#feedback", label: "Structured feedback" },
          { href: "#discover", label: "Discover work" },
          { href: "#nominate", label: "Nominate" },
          { href: "#history", label: "Review history" },
          { href: "#messages", label: "Messages" },
        ]}
      />

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
        <p>Search by title, creator, or media type. These are the published pieces in the database.</p>
        <form className="task-actions" action="/mentor/desk#discover" method="get">
          <label>
            Search
            <input name="q" defaultValue={q} placeholder="Title, creator, or media" />
          </label>
          <button className="button" type="submit">Search</button>
        </form>
        <div className="task-list">
          {works.length === 0 ? <p>No pieces match that search.</p> : null}
          {works.map((work) => (
            <article key={work.id}>
              <p className="flag">{work.media}{work.featured ? " · Featured" : ""}</p>
              <h3>{work.title}</h3>
              <p className="meta-line">{work.creator}</p>
              <p>{piecePreview(work.id, work.description)}</p>
            </article>
          ))}
        </div>
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
