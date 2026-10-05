import Link from "next/link";
import { rolePage, roleSignInLabel, type TaskNeed } from "../lib/tasks";

export function RoleSignIn({
  role,
  title,
  next,
  signedInAs,
}: {
  role: TaskNeed;
  title: string;
  next: string;
  signedInAs?: string;
}) {
  const label = roleSignInLabel[role];
  return (
    <main className="page">
      <p className="eyebrow">{label}</p>
      <h1>{title}</h1>
      <p className="lede">
        {signedInAs
          ? `You are signed in as ${signedInAs}. Sign in with a ${label} account to open this.`
          : `Sign in with a ${label} account to open this.`}
      </p>
      <p><Link className="button" href={`/sign-in?returnTo=${encodeURIComponent(next)}`}>Sign in</Link></p>
      <p className="more"><Link href={rolePage[role]}>Back to the {label} page</Link></p>
    </main>
  );
}
