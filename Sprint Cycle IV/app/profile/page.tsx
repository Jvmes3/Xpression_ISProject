import Link from "next/link";
import { roleHome } from "../lib/application";
import { currentAccount } from "../lib/session";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const account = await currentAccount();
  if (!account) {
    return (
      <main className="page">
        <h1>Profile</h1>
        <p className="lede">Sign in to see the account you are using.</p>
        <p><Link className="button" href="/sign-in">Sign in</Link></p>
      </main>
    );
  }

  const name = account.application?.name?.trim() || account.displayName?.trim() || account.email;
  const approved = account.application?.status === "approved" ? account.application.role : "";
  const roleLabel =
    account.role === "moderator"
      ? "Moderator"
      : account.role === "administrator"
        ? "Administrator"
        : approved || account.application?.role || "Applicant";
  const workspace =
    account.role === "moderator"
      ? "/moderator/desk"
      : account.role === "administrator"
        ? "/administrator/desk"
        : approved
          ? roleHome(approved)
          : "/account";

  return (
    <main className="page">
      <p className="eyebrow">Signed in</p>
      <h1>{name}</h1>
      <p className="lede">{roleLabel}</p>
      <dl className="answers panel">
        <div>
          <dt>Email</dt>
          <dd>{account.email}</dd>
        </div>
        <div>
          <dt>Role</dt>
          <dd>{roleLabel}</dd>
        </div>
        {account.application?.xpressionEmail && approved ? (
          <div>
            <dt>Xpression login</dt>
            <dd>{account.application.xpressionEmail}</dd>
          </div>
        ) : null}
      </dl>
      <p>
        <Link className="button" href={workspace}>
          {account.role === "applicant" && !approved ? "Your application" : "Open your pages"}
        </Link>
      </p>
    </main>
  );
}
