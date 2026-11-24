import Link from "next/link";
import { RoleSignIn } from "../components/RoleSignIn";
import { SprintNote } from "../components/SprintNote";
import { accountLabel, canUseRole } from "../lib/access";
import { createScoutOpportunity } from "../lib/actions";
import { listOpportunities } from "../lib/records";
import { currentAccount } from "../lib/session";

export const dynamic = "force-dynamic";

export default async function OpportunitiesPage({
  searchParams,
}: {
  searchParams: Promise<{ opportunity?: string; title?: string }>;
}) {
  const account = await currentAccount();
  if (!canUseRole(account, "scout")) {
    return (
      <RoleSignIn
        role="scout"
        title="Opportunities"
        next="/opportunities"
        signedInAs={account ? accountLabel(account) : undefined}
      />
    );
  }

  const params = await searchParams;
  const opportunities = await listOpportunities();

  return (
    <main className="page">
      <p className="eyebrow">Talent Scout</p>
      <h1>Opportunities</h1>
      <p className="lede">Create a commission, audition, collaboration, or call. Each one is a card on this board.</p>
      {params.opportunity === "saved" ? <p className="note">{params.title || "The opportunity"} is in the database.</p> : null}
      {params.opportunity === "required" ? <p className="note">Add a title and a start date before saving.</p> : null}
      {params.opportunity === "range" ? <p className="note">The end date has to be on or after the start date.</p> : null}
      {params.opportunity === "date" || params.opportunity === "kind" ? <p className="note">Choose a kind of opportunity and a real start date.</p> : null}
      {params.opportunity === "account" ? <p className="note">This sign-in is not a Talent Scout row in the database. Approve a scout application, then sign in with the role email.</p> : null}
      <form className="form panel" action={createScoutOpportunity}>
        <label>
          Title
          <input name="title" required placeholder="Riverfront mural call" />
        </label>
        <label>
          Kind
          <select name="kind" defaultValue="Commission">
            <option>Commission</option>
            <option>Audition</option>
            <option>Collaboration</option>
            <option>Call</option>
          </select>
        </label>
        <label>
          Starts
          <input name="startsOn" type="date" required />
        </label>
        <label>
          Ends
          <input name="endsOn" type="date" />
        </label>
        <label>
          Description
          <textarea name="description" placeholder="What the creator would do." />
        </label>
        <button className="button" type="submit">Save opportunity</button>
      </form>
      <div className="work-grid">
        {opportunities.map((item) => (
          <Link key={String(item.opportunity_id)} href={`/opportunities/${item.opportunity_id}`} className="work-tile opportunity-card">
            <span className="flag">{String(item.scout_name)}</span>
            <strong>{String(item.title)}</strong>
            <span>{String(item.starts_on).slice(0, 10)}{item.ends_on ? ` to ${String(item.ends_on).slice(0, 10)}` : ""}</span>
            {item.description ? <span>{String(item.description)}</span> : null}
          </Link>
        ))}
      </div>
      <SprintNote label="invitations" />
      <p className="more"><Link href="/scout/desk">Back to the scout desk</Link></p>
    </main>
  );
}
