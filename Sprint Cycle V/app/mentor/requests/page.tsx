import Link from "next/link";
import { RoleSignIn } from "../../components/RoleSignIn";
import { SprintNote } from "../../components/SprintNote";
import { accountLabel, canUseRole } from "../../lib/access";
import { listMentorRequests } from "../../lib/records";
import { currentAccount } from "../../lib/session";
import { accountForSession } from "../../lib/writes";

export const dynamic = "force-dynamic";

export default async function MentorRequestsPage() {
  const account = await currentAccount();
  if (!canUseRole(account, "mentor")) {
    return (
      <RoleSignIn
        role="mentor"
        title="Review requests"
        next="/mentor/requests"
        signedInAs={account ? accountLabel(account) : undefined}
      />
    );
  }

  const mentor = await accountForSession(account, "Mentor");
  const requests = mentor ? await listMentorRequests(mentor.account_id) : [];

  return (
    <main className="page">
      <p className="eyebrow">Creative Mentor</p>
      <h1>Review requests</h1>
      <p className="lede">Creators ask you to look at a specific piece. Open it when you are ready to write feedback.</p>
      {!mentor ? <p className="note">This sign-in is not a Mentor row in the database.</p> : null}
      <div className="task-list">
        {requests.length === 0 ? <p>No review requests are assigned to you yet.</p> : null}
        {requests.map((item) => (
          <article key={item.request_id} className="panel">
            <p className="flag">{item.status}</p>
            <h2><Link href={`/creator/desk/${item.work_id}`}>{item.title}</Link></h2>
            <p className="meta-line">{item.creator_name} · requested {item.requested_at}</p>
            {item.note ? <p>{item.note}</p> : null}
            <p><Link className="button" href={`/creator/desk/${item.work_id}`}>Open the piece</Link></p>
            <div className="task-actions">
              <button className="button" type="button" disabled>Accept</button>
              <button className="button button-quiet" type="button" disabled>Decline</button>
            </div>
          </article>
        ))}
      </div>
      <SprintNote label="accepting or declining a request" />
    </main>
  );
}
