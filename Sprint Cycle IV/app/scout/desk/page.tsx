import Link from "next/link";
import { RoleSignIn } from "../../components/RoleSignIn";
import { ToggleNav } from "../../components/ToggleNav";
import { SprintNote } from "../../components/SprintNote";
import { accountLabel, canUseRole } from "../../lib/access";
import { listCreators } from "../../lib/records";
import { currentAccount } from "../../lib/session";

export const dynamic = "force-dynamic";

export default async function ScoutDeskPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const account = await currentAccount();
  if (!canUseRole(account, "scout")) {
    return (
      <RoleSignIn
        role="scout"
        title="Scout desk"
        next="/scout/desk"
        signedInAs={account ? accountLabel(account) : undefined}
      />
    );
  }

  const q = (await searchParams).q?.trim() || "";
  const creators = await listCreators(q);

  return (
    <main className="page">
      <p className="eyebrow">Talent Scout workspace</p>
      <h1>Scout desk</h1>
      <p className="lede">Search creators and open a portfolio. Messages and invitations wait for a later sprint.</p>
      <ToggleNav
        label="Scout tasks"
        links={[
          { href: "#search", label: "Search" },
          { href: "#portfolio", label: "Portfolio" },
          { href: "#contact", label: "Contact" },
          { href: "#invite", label: "Invite" },
          { href: "#saved", label: "Saved" },
          { href: "#responses", label: "Responses" },
        ]}
      />

      <section id="search" className="panel">
        <h2>Search creators</h2>
        <p>Search by name or discipline, then open a portfolio.</p>
        <form className="task-actions" action="/scout/desk#search" method="get">
          <label>
            Search
            <input name="q" defaultValue={q} placeholder="Name or discipline" />
          </label>
          <button className="button" type="submit">Search</button>
        </form>
        <div className="task-list">
          {creators.length === 0 ? <p>No creators match that search.</p> : null}
          {creators.map((creator) => (
            <article key={creator.account_id}>
              <p className="flag">{creator.status}{creator.open_to_commissions ? " · Open to commissions" : ""}</p>
              <h3>{creator.name}</h3>
              <p className="meta-line">{creator.discipline || "No discipline listed"}</p>
              <p><Link href={`/scout/desk/${creator.account_id}`}>View portfolio</Link></p>
            </article>
          ))}
        </div>
      </section>

      <section id="portfolio" className="panel">
        <h2>Review a portfolio</h2>
        <p>Choose View portfolio on a creator above. The portfolio is that creator&apos;s published work.</p>
      </section>

      <section id="contact" className="panel">
        <h2>Contact a creator</h2>
        <p>Send a private message about a commission or collaboration.</p>
        <SprintNote label="messages" />
        <form className="form">
          <label>
            Message
            <textarea name="message" disabled placeholder="What you want to talk about." />
          </label>
          <button className="button" type="button" disabled>Send message</button>
        </form>
      </section>

      <section id="invite" className="panel">
        <h2>Invite to an opportunity</h2>
        <p>Create a call with dates and invite selected creators.</p>
        <SprintNote label="invitations" />
        <form className="form">
          <label>
            Opportunity
            <input name="title" disabled placeholder="Commission, call, or performance" />
          </label>
          <label>
            Dates
            <input name="dates" disabled placeholder="When it happens" />
          </label>
          <button className="button" type="button" disabled>Send invite</button>
        </form>
      </section>

      <section id="saved" className="panel">
        <h2>Saved candidates</h2>
        <p>Organize bookmarked creators and individual works.</p>
        <SprintNote label="saved candidates" />
      </section>

      <section id="responses" className="panel">
        <h2>Track responses</h2>
        <p>See who was invited and how they replied.</p>
        <SprintNote label="responses" />
      </section>
    </main>
  );
}
