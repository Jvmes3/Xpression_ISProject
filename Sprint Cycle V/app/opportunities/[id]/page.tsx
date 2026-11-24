import Link from "next/link";
import { notFound } from "next/navigation";
import { RoleSignIn } from "../../components/RoleSignIn";
import { SprintNote } from "../../components/SprintNote";
import { accountLabel, canUseRole } from "../../lib/access";
import { findOpportunity } from "../../lib/records";
import { currentAccount } from "../../lib/session";
import { accountForSession } from "../../lib/writes";

export const dynamic = "force-dynamic";

export default async function OpportunityPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const account = await currentAccount();
  if (!canUseRole(account, "scout")) {
    return (
      <RoleSignIn
        role="scout"
        title="Opportunity"
        next="/opportunities"
        signedInAs={account ? accountLabel(account) : undefined}
      />
    );
  }

  const { id } = await params;
  const found = await findOpportunity(id);
  if (!found) notFound();
  const scout = await accountForSession(account, "Talent Scout");
  const item = found.opportunity;
  const mine = scout && Number(item.scout_id) === scout.account_id;

  return (
    <main className="page">
      <p className="eyebrow">Talent Scout</p>
      <h1>{String(item.title)}</h1>
      <p className="lede">{String(item.scout_name)}{mine ? " · Your opportunity" : ""}</p>
      <p className="meta-line">
        {String(item.starts_on).slice(0, 10)}
        {item.ends_on ? ` to ${String(item.ends_on).slice(0, 10)}` : ""}
      </p>
      {item.description ? <p>{String(item.description)}</p> : null}
      <section className="panel">
        <h2>Invitations</h2>
        {found.invites.length === 0 ? <p>No creators have been invited to this opportunity yet.</p> : null}
        <div className="task-list">
          {found.invites.map((invite) => (
            <Link key={Number(invite.invitation_id)} className="open-card" href={`/profile/${invite.creator_id}`}>
              <p className="flag">{String(invite.status)}</p>
              <h3>{String(invite.creator_name)}</h3>
              <p className="meta-line">Invited {String(invite.invited_at)}</p>
              <p className="meta-line">Open the profile</p>
            </Link>
          ))}
        </div>
        <SprintNote label="sending a new invitation from this page" />
      </section>
      <p className="more"><Link href="/opportunities">Back to opportunities</Link></p>
    </main>
  );
}
