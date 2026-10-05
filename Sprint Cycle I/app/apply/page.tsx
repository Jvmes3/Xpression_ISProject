import Link from "next/link";
import { createLogin } from "../lib/actions";
import { emailRule, passwordRule } from "../lib/credentials.mjs";
import { currentAccount } from "../lib/session";

export const dynamic = "force-dynamic";

const errors: Record<string, string> = {
  email: emailRule,
  password: passwordRule,
  match: "The passwords do not match.",
  taken: "That email already has an account. Sign in with it instead.",
};

export default async function ApplyPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const account = await currentAccount();

  if (account?.role === "applicant") {
    return (
      <main className="page">
        <p className="eyebrow">Application record</p>
        <h1>Your application login</h1>
        <p className="lede">
          You are already signed in as {account.email}. Opening another page
          does not submit the application.
        </p>
        <p><Link className="button" href="/account">Go to your application</Link></p>
      </main>
    );
  }

  return (
    <main className="page">
      <p className="eyebrow">Application record</p>
      <h1>Create your application login</h1>
      <p className="lede">
        Use an email you already have, such as a Gmail address, and choose a
        password. You will use this same email and password later to check
        whether your application is still being reviewed. This is the record of
        your application. It is not your Xpression role login.
      </p>
      <form className="form panel" action={createLogin}>
        {error && errors[error] ? <p className="note">{errors[error]}</p> : null}
        <label>
          Email
          <input type="email" name="email" placeholder="youremail@gmail.com" required />
        </label>
        <label>
          Password
          <input type="password" name="password" placeholder="Choose a password" required />
        </label>
        <label>
          Confirm password
          <input type="password" name="confirm" placeholder="Repeat the password" required />
        </label>
        <p className="note">
          {emailRule} {passwordRule} Moderator and administrator accounts use
          the same rules in the terminal.
        </p>
        <button className="button" type="submit">Continue</button>
      </form>
      <p className="more">
        Already started an application? <Link href="/sign-in">Sign in</Link>
      </p>
    </main>
  );
}
