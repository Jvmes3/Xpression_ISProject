import { redirect } from "next/navigation";
import { changeTemporaryPassword } from "../../lib/actions";
import { roleHome } from "../../lib/application";
import { passwordRule } from "../../lib/credentials.mjs";
import { currentAccount } from "../../lib/session";
import { needsTempPasswordChange } from "../../lib/store";

export const dynamic = "force-dynamic";

const errors: Record<string, string> = {
  password: passwordRule,
  match: "Change password and confirm password need to match.",
  same: "Choose a different password from the temporary password.",
};

export default async function ChangePasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const account = await currentAccount();
  if (!account) redirect("/sign-in?returnTo=/account/password");
  if (!needsTempPasswordChange(account)) {
    redirect(account.application?.status === "approved" ? roleHome(account.application.role) : "/account");
  }

  return (
    <main className="page">
      <p className="eyebrow">Temporary password</p>
      <h1>Change password</h1>
      <p className="lede">
        You signed in with the temporary password from your approved application.
        Choose the password you will use for this role from now on.
      </p>
      <form className="form panel" action={changeTemporaryPassword}>
        {error && errors[error] ? <p className="note">{errors[error]}</p> : null}
        <label>
          Change password
          <input type="password" name="password" placeholder="Change password" autoComplete="new-password" required />
        </label>
        <label>
          Confirm password
          <input type="password" name="confirm" placeholder="Confirm password" autoComplete="new-password" required />
        </label>
        <p className="note">{passwordRule}</p>
        <button className="button" type="submit">Save password</button>
      </form>
    </main>
  );
}
