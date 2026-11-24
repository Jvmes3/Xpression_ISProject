import Link from "next/link";
import { ReportMark } from "../components/ReportFlag";
import { SprintNote } from "../components/SprintNote";
import { reportQueue, reportsPage } from "../lib/access";
import { listSavedWorks, reportReasonByWork } from "../lib/records";
import { currentAccount } from "../lib/session";
import { accountForSession } from "../lib/writes";

export const dynamic = "force-dynamic";

export default async function SavedPage() {
  const account = await currentAccount();
  if (!account) {
    return (
      <main className="page">
        <p className="eyebrow">Settings and activity</p>
        <h1>Saved</h1>
        <p className="lede">Sign in to see posts you saved.</p>
        <p><Link className="button" href="/sign-in?returnTo=%2Fsaved">Sign in</Link></p>
      </main>
    );
  }

  const record = await accountForSession(account);
  const works = record ? await listSavedWorks(record.account_id) : [];
  const queue = reportQueue(account);
  const reported = queue ? await reportReasonByWork() : {};

  return (
    <main className="page">
      <p className="eyebrow">Settings and activity</p>
      <h1>Saved</h1>
      <p className="lede">Posts you saved from a piece.</p>
      {!record ? <p className="note">This sign-in is not a row in the database yet.</p> : null}
      {works.length === 0 ? <p>No saved posts yet. Open a piece and choose Save.</p> : null}
      <div className="task-list">
        {works.map((work) => (
          <article key={work.id} className="panel">
            <p className="flag">{work.media}</p>
            <h2>
              <Link href={`/creator/desk/${work.id}`}>{work.title}</Link>
              {queue && reported[work.id]?.length ? <ReportMark reasons={reported[work.id]} href={reportsPage(queue, "work", work.id)} /> : null}
            </h2>
            <p className="meta-line">{work.creator}</p>
          </article>
        ))}
      </div>
      <SprintNote label="following" />
    </main>
  );
}
