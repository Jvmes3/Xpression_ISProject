import Link from "next/link";
import { RoleSignIn } from "../../components/RoleSignIn";
import { accountLabel, canUseRole } from "../../lib/access";
import { listCreators } from "../../lib/records";
import { currentAccount } from "../../lib/session";

export const dynamic = "force-dynamic";

export default async function ScoutSearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const account = await currentAccount();
  if (!canUseRole(account, "scout")) {
    return (
      <RoleSignIn
        role="scout"
        title="Search creators"
        next="/scout/search"
        signedInAs={account ? accountLabel(account) : undefined}
      />
    );
  }

  const q = (await searchParams).q?.trim() || "";
  const creators = await listCreators(q);

  return (
    <main className="page">
      <p className="eyebrow">Talent Scout</p>
      <h1>Search creators</h1>
      <p className="lede">Find a creator from the top of the page, then open their profile.</p>
      <form className="discover" action="/scout/search" method="get">
        <label className="search">
          <span className="sr-only">Search creators</span>
          <input name="q" defaultValue={q} placeholder="Name or discipline" />
        </label>
        <button className="button" type="submit">Search</button>
      </form>
      <div className="task-list">
        {creators.length === 0 ? <p>No creators match that search.</p> : null}
        {creators.map((creator) => (
          <article key={creator.account_id} className="panel">
            <h2><Link href={`/profile/${creator.account_id}`}>{creator.name}</Link></h2>
            <p className="meta-line">
              {creator.discipline || "Discipline not listed"}
              {creator.open_to_commissions ? " · Open to commissions" : ""}
            </p>
            <p><Link className="button" href={`/profile/${creator.account_id}`}>View profile</Link></p>
          </article>
        ))}
      </div>
    </main>
  );
}
