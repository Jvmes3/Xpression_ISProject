import Link from "next/link";
import { signIn } from "../lib/actions";
import { notReadyMessage } from "../lib/not-ready";
import { emailRule, passwordRule } from "../lib/credentials.mjs";

export const dynamic = "force-dynamic";

const errors: Record<string, string> = {
  email: emailRule,
  password: passwordRule,
  credentials: "That email and password do not match an account.",
  blocked: "This account cannot sign in. An administrator can change the account status.",
  unavailable: notReadyMessage,
};

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; returnTo?: string }>;
}) {
  const { error, returnTo = "" } = await searchParams;
  const next = returnTo.startsWith("/") && !returnTo.startsWith("//") ? returnTo : "";

  return (
    <main className="page">
      <p className="eyebrow">Sign in</p>
      <h1>Sign in</h1>
      <p className="lede">
        This is the sign-in screen for Sprint Cycle I. Each role page is opened
        from that role&apos;s home.
      </p>
      <form className="form panel" action={signIn}>
        {next ? <input type="hidden" name="returnTo" value={next} /> : null}
        {error && errors[error] ? <p className="note">{errors[error]}</p> : null}
        <label>
          Email
          <input type="email" name="email" placeholder="youremail@gmail.com" required />
        </label>
        <label>
          Password
          <input type="password" name="password" placeholder="Password" required />
        </label>
        <p className="note">{emailRule} {passwordRule}</p>
        <button className="button" type="submit">Sign in</button>
      </form>
      <p className="more">
        New applicant? <Link href="/apply">Create an application login</Link>
      </p>
    </main>
  );
}
