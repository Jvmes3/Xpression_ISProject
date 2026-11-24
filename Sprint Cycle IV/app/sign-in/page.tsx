import Link from "next/link";
import { SignInForm } from "../components/SignInForm";
import { emailRule, passwordRule } from "../lib/credentials.mjs";

export const dynamic = "force-dynamic";

const errors: Record<string, string> = {
  email: emailRule,
  password: passwordRule,
  credentials: "That email and password do not match an account.",
  blocked: "This account cannot sign in. An administrator can change the account status.",
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
        Applicants sign in with the email and password they created for the
        application. After approval, a Creator, Creative Mentor, or Talent Scout
        signs in with the role email and temporary password, then chooses a new
        password. Moderators and administrators sign in with the email and
        password created for them in the terminal.
      </p>
      <SignInForm
        returnTo={next}
        errors={errors}
        note={`${emailRule} ${passwordRule}`}
        initialError={error && errors[error] ? error : ""}
      />
      <p className="more">
        New applicant? <Link href="/apply">Create an application login</Link>
      </p>
    </main>
  );
}
