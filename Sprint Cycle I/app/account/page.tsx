import Link from "next/link";
import { redirect } from "next/navigation";
import { beginApplication, signIn } from "../lib/actions";
import { roleHome } from "../lib/application";
import { emailRule, passwordRule } from "../lib/credentials.mjs";
import { currentAccount } from "../lib/session";

export const dynamic = "force-dynamic";

const signInErrors: Record<string, string> = {
  email: emailRule,
  password: passwordRule,
  credentials: "That email and password do not match an account. Sign in with the email and password you created for your application.",
  blocked: "This account cannot sign in. An administrator can change the account status.",
};

export default async function AccountPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const account = await currentAccount();
  if (!account) {
    return (
      <main className="page">
        <p className="eyebrow">Your application</p>
        <h1>Sign in to see your application</h1>
        <p className="lede">
          Use the email and password you created with Apply. After you sign in,
          this page shows whether your application is in progress, still being
          reviewed, or approved.
        </p>
        <form className="form panel" action={signIn}>
          <input type="hidden" name="returnTo" value="account" />
          {error && signInErrors[error] ? <p className="note">{signInErrors[error]}</p> : null}
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
  if (account.role === "moderator") redirect("/moderator/desk");
  if (account.role === "administrator") redirect("/administrator/desk");

  const application = account.application;
  if (!application) redirect("/sign-in");

  const status = application.status;
  const roleName = application.role || "Application";
  const areas = application.areas
    .map((area) => area.label || area.media)
    .filter(Boolean);

  return (
    <main className="page">
      <p className="eyebrow">
        {status === "new" ? "No application yet" : status === "draft" ? "Not submitted" : status === "pending" ? "Pending" : status === "approved" ? "Approved" : "Not approved"}
      </p>
      <h1>{status === "new" ? "Begin application" : roleName}</h1>
      {status === "new" ? (
        <p className="lede">You have an application login, and you have not started an application.</p>
      ) : null}
      {status === "draft" ? (
        <p className="lede">You started this application and have not submitted it. Open it to keep editing.</p>
      ) : null}
      {status === "pending" ? (
        <p className="lede">Your application is still being processed. Please wait until our team has reviewed your application.</p>
      ) : null}
      {status === "approved" ? (
        <p className="lede">Your application was approved. Open the {roleName} workspace below. Your Xpression login is further down.</p>
      ) : null}
      {status === "rejected" ? (
        <p className="lede">Your application was not approved, so that role stays closed. You can still read the answers you submitted.</p>
      ) : null}

      {status === "new" ? (
        <form action={beginApplication}>
          <button className="button" type="submit">Begin application</button>
        </form>
      ) : (
        <Link className="status-card" href={status === "draft" ? "/application" : "/application/answers"}>
          <span>{status === "draft" ? "In progress" : status === "pending" ? "Pending" : status === "approved" ? "Approved" : "Not approved"}</span>
          <strong>{roleName} application</strong>
          <p>
            {areas.length ? `Applying for ${areas.join(", ")}. ` : ""}
            {status === "draft" ? "Edit your answers" : "See your answers"}
          </p>
        </Link>
      )}

      {status === "pending" ? (
        <p className="note">
          You cannot open the role home while the application is pending. Sign in
          again later with {account.email} and the password you created to check
          this page.
        </p>
      ) : null}

      {status === "approved" ? (
        <>
          <p>
            <Link className="button" href={roleHome(application.role)}>Open {roleName} workspace</Link>
          </p>
          <section className="panel" id="xpression-login">
            <h2>Your Xpression login</h2>
            <p>
              Use this email and password to sign in to the role. Keep {account.email} and
              the password you created for checking this application.
            </p>
            <dl className="answers">
              <div>
                <dt>Email</dt>
                <dd>{application.xpressionEmail}</dd>
              </div>
              <div>
                <dt>Password</dt>
                <dd>{application.xpressionPassword}</dd>
              </div>
            </dl>
          </section>
        </>
      ) : null}
    </main>
  );
}
