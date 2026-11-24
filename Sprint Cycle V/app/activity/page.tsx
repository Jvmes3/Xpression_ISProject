import Link from "next/link";
import { listAccountActivity } from "../lib/records";
import { currentAccount } from "../lib/session";
import { accountForSession } from "../lib/writes";

export const dynamic = "force-dynamic";

export default async function ActivityPage() {
  const account = await currentAccount();
  if (!account) {
    return (
      <main className="page">
        <h1>Your activity</h1>
        <p className="lede">Sign in to see what this account has done.</p>
        <p><Link className="button" href="/sign-in?returnTo=%2Factivity">Sign in</Link></p>
      </main>
    );
  }

  const record = await accountForSession(account);
  const rows = record ? await listAccountActivity(record.account_id) : [];

  return (
    <main className="page">
      <p className="eyebrow">Settings and activity</p>
      <h1>Your activity</h1>
      {!record ? <p className="note">This sign-in is not a row in the database yet.</p> : null}
      {rows.length === 0 ? <p>Nothing is recorded for this account yet.</p> : null}
      <div className="task-list">
        {rows.map((item, index) => {
          const kind = String(item.kind);
          const href = kind === "opportunity"
            ? `/opportunities/${item.work_id}`
            : `/creator/desk/${item.work_id}${kind === "feedback" ? "?talk=feedbacks" : ""}`;
          return (
            <article key={`${kind}-${index}`} className="panel">
              <p className="flag">{kind} · {String(item.happened_at)}</p>
              <h2><Link href={href}>{String(item.title)}</Link></h2>
              {item.detail ? <p>{String(item.detail)}</p> : null}
            </article>
          );
        })}
      </div>
    </main>
  );
}
