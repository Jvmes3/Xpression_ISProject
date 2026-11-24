import Link from "next/link";
import { RoleSignIn } from "../../components/RoleSignIn";
import { SprintNote } from "../../components/SprintNote";
import { accountLabel, canUseRole } from "../../lib/access";
import { listScoutInvitations } from "../../lib/records";
import { currentAccount } from "../../lib/session";
import { accountForSession } from "../../lib/writes";

export const dynamic = "force-dynamic";

export default async function ScoutResponsesPage() {
  const account = await currentAccount();
  if (!canUseRole(account, "scout")) {
    return (
      <RoleSignIn
        role="scout"
        title="Responses"
        next="/scout/responses"
        signedInAs={account ? accountLabel(account) : undefined}
      />
    );
  }

  const scout = await accountForSession(account, "Talent Scout");
  const invitations = scout ? await listScoutInvitations(scout.account_id) : [];

  return (
    <main className="page">
      <p className="eyebrow">Talent Scout</p>
      <h1>Responses</h1>
      <p className="lede">Invitations you have already sent, and whether the creator accepted or declined.</p>
      {!scout ? <p className="note">This sign-in is not a Talent Scout row in the database.</p> : null}
      <div className="task-list">
        {invitations.length === 0 ? <p>No invitations are on record for this scout yet.</p> : null}
        {invitations.map((item) => (
          <Link key={item.invitation_id} className="panel open-card" href={`/opportunities/${item.opportunity_id}`}>
            <p className="flag">{item.status}</p>
            <h2>{item.title}</h2>
            <p className="meta-line">{item.creator_name} · invited {item.invited_at}</p>
            <p className="meta-line">Open the opportunity</p>
          </Link>
        ))}
      </div>
      <SprintNote label="sending a new invitation from this page" />
    </main>
  );
}
