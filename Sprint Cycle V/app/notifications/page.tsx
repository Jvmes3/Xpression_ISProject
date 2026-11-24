import Link from "next/link";
import { SprintNote } from "../components/SprintNote";
import { currentAccount } from "../lib/session";

export const dynamic = "force-dynamic";

const kinds = ["Feedback", "Comments", "Invitations", "Reports", "Messages"];

export default async function NotificationsPage() {
  const account = await currentAccount();
  if (!account) {
    return (
      <main className="page">
        <h1>Notifications</h1>
        <p className="lede">Sign in to see activity on your account.</p>
        <p><Link className="button" href="/sign-in?returnTo=%2Fnotifications">Sign in</Link></p>
      </main>
    );
  }

  return (
    <main className="page">
      <p className="eyebrow">Activity</p>
      <h1>Notifications</h1>
      <p className="lede">Posts, comments, feedback, invitations, and reports that involve you.</p>
      <div className="notice-list">
        {kinds.map((kind) => (
          <article key={kind} className="panel notice-row">
            <p className="flag">{kind}</p>
            <h2>Nothing new</h2>
            <p>When {kind.toLowerCase()} arrive, they will show in this list.</p>
          </article>
        ))}
      </div>
      <SprintNote label="live notifications" />
    </main>
  );
}
