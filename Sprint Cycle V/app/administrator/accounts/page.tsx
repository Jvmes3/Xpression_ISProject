import Link from "next/link";
import { RoleSignIn } from "../../components/RoleSignIn";
import { SprintNote } from "../../components/SprintNote";
import { activateOrDeactivate } from "../../lib/actions";
import { accountLabel, canUseRole } from "../../lib/access";
import { listAccounts } from "../../lib/records";
import { currentAccount } from "../../lib/session";

export const dynamic = "force-dynamic";

export default async function AccountsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string; who?: string; before?: string; next?: string }>;
}) {
  const account = await currentAccount();
  if (!canUseRole(account, "administrator")) {
    return (
      <RoleSignIn role="administrator" title="User accounts" next="/administrator/accounts" signedInAs={account ? accountLabel(account) : undefined} />
    );
  }
  const { status: statusNote, who, before, next, q: rawQuery } = await searchParams;
  const q = rawQuery?.trim() || "";
  const users = await listAccounts(q);

  return (
    <main className="page">
      <p className="eyebrow">Administrator</p>
      <h1>User accounts</h1>
      <p className="lede">Search the accounts in the database, then activate or deactivate one.</p>
      {statusNote === "saved" && who ? <p className="note">{who} was {before || "unchanged"} and is now {next}.</p> : null}
      {statusNote === "same" ? <p className="note">That account already has the status you chose. Pick the other action to change it.</p> : null}
      {statusNote === "self" ? <p className="note">An administrator cannot activate or deactivate their own account.</p> : null}
      {statusNote === "missing" || statusNote === "invalid" ? <p className="note">Choose an account and a status of active or deactivated.</p> : null}
      {statusNote === "account" ? <p className="note">This sign-in is not an Administrator row in the database.</p> : null}
      <form className="discover" action="/administrator/accounts" method="get">
        <input className="discover-search" name="q" defaultValue={q} placeholder="Email, name, or role" aria-label="Search accounts" />
        <button className="button" type="submit">Search</button>
      </form>
      <div className="task-list">
        {users.length === 0 ? <p>No accounts match that search.</p> : null}
        {users.map((user) => (
          <article key={user.account_id} className="panel">
            <p className="flag">{user.status}</p>
            <h2>{user.name}</h2>
            <p className="meta-line">{user.email} · {user.role}{user.discipline ? ` · ${user.discipline}` : ""}</p>
            <form className="task-actions" action={activateOrDeactivate}>
              <input type="hidden" name="accountId" value={user.account_id} />
              <button className="button" type="submit" name="status" value="active">Activate</button>
              <button className="button button-quiet" type="submit" name="status" value="deactivated">Deactivate</button>
            </form>
          </article>
        ))}
      </div>
      <SprintNote label="suspend or ban" />
      <p className="more"><Link href="/administrator/desk">Back to workspace</Link></p>
    </main>
  );
}
