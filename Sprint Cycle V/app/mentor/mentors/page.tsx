import { RoleSignIn } from "../../components/RoleSignIn";
import { SprintNote } from "../../components/SprintNote";
import { accountLabel, canUseRole } from "../../lib/access";
import { listMentors } from "../../lib/records";
import { currentAccount } from "../../lib/session";

export const dynamic = "force-dynamic";

export default async function MentorPeersPage() {
  const account = await currentAccount();
  if (!canUseRole(account, "mentor")) {
    return (
      <RoleSignIn
        role="mentor"
        title="Other mentors"
        next="/mentor/mentors"
        signedInAs={account ? accountLabel(account) : undefined}
      />
    );
  }

  const mentors = await listMentors();

  return (
    <main className="page">
      <p className="eyebrow">Creative Mentor</p>
      <h1>Other mentors</h1>
      <p className="lede">Find another mentor when you want a second opinion on a post, or when you want to share a piece with them.</p>
      <div className="task-list">
        {mentors.length === 0 ? <p>No active mentors are listed yet.</p> : null}
        {mentors.map((mentor) => (
          <article key={mentor.account_id} className="panel">
            <h2>{mentor.name}</h2>
            <p className="meta-line">{mentor.email}{mentor.discipline ? ` · ${mentor.discipline}` : ""}</p>
            <div className="task-actions">
              <button className="button" type="button" disabled>Ask their opinion</button>
              <button className="button button-quiet" type="button" disabled>Share a post</button>
            </div>
          </article>
        ))}
      </div>
      <SprintNote label="asking or sharing with another mentor" />
    </main>
  );
}
