import Link from "next/link";
import { RoleSignIn } from "../../components/RoleSignIn";
import { SprintNote } from "../../components/SprintNote";
import { accountLabel, canUseRole } from "../../lib/access";
import { listNominations } from "../../lib/records";
import { currentAccount } from "../../lib/session";

export const dynamic = "force-dynamic";

export default async function ModeratorNominationsPage() {
  const account = await currentAccount();
  if (!canUseRole(account, "moderator")) {
    return (
      <RoleSignIn
        role="moderator"
        title="Featured nominations"
        next="/moderator/nominations"
        signedInAs={account ? accountLabel(account) : undefined}
      />
    );
  }

  const nominations = await listNominations();

  return (
    <main className="page">
      <p className="eyebrow">Community Moderator</p>
      <h1>Featured nominations</h1>
      <p className="lede">Mentors nominate a piece. Approving or declining that nomination is still ahead.</p>
      <div className="task-list">
        {nominations.length === 0 ? <p>No nominations yet.</p> : null}
        {nominations.map((item) => (
          <article key={item.nomination_id} className="panel">
            <p className="flag">{item.status}</p>
            <h2><Link href={`/creator/desk/${item.work_id}`}>{item.title}</Link></h2>
            <p className="meta-line">{item.mentor_name} · nominated {item.nominated_at}</p>
            <p>{item.reason}</p>
            <div className="task-actions">
              <button className="button" type="button" disabled>Approve for featured</button>
              <button className="button button-quiet" type="button" disabled>Decline</button>
            </div>
          </article>
        ))}
      </div>
      <SprintNote label="nominations" />
    </main>
  );
}
