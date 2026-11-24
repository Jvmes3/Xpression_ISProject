import Link from "next/link";
import { RoleSignIn } from "../../components/RoleSignIn";
import { decideApplication, undoApplication } from "../../lib/actions";
import { accountLabel, canUseRole } from "../../lib/access";
import { currentAccount } from "../../lib/session";
import { readDatabase } from "../../lib/store";

export const dynamic = "force-dynamic";

export default async function ApplicationsPage() {
  const account = await currentAccount();
  if (!canUseRole(account, "administrator")) {
    return (
      <RoleSignIn role="administrator" title="Applications" next="/administrator/applications" signedInAs={account ? accountLabel(account) : undefined} />
    );
  }
  const applications = readDatabase().accounts.filter((item) => item.application && item.application.status !== "new" && item.application.status !== "draft");

  return (
    <main className="page">
      <p className="eyebrow">Administrator</p>
      <h1>Applications</h1>
      <p className="lede">Mentor and Talent Scout applications wait here after they are submitted. Creator applications can be approved the same way.</p>
      {applications.length === 0 ? <p>No submitted applications yet.</p> : null}
      <div className="task-list">
        {applications.map((item) => {
          const application = item.application;
          if (!application) return null;
          const areas = application.areas.map((area) => area.label || area.media).filter(Boolean);
          return (
            <article key={item.id} className="panel">
              <p className="flag">{application.status}</p>
              <h2>{application.name || item.email}</h2>
              <p className="meta-line">{item.email} · {application.role || "Role not chosen"}{areas.length ? ` · ${areas.join(", ")}` : ""}</p>
              <p>{application.reason}</p>
              <p><Link href={`/administrator/applications/${item.id}`}>See full application</Link></p>
              {application.status === "approved" ? (
                <p className="meta-line">
                  {application.mustChangePassword === false
                    ? `Role login ${application.xpressionEmail}. The temporary password has been changed.`
                    : `Role login ${application.xpressionEmail}. Temporary password ${application.xpressionPassword}`}
                </p>
              ) : null}
              <form className="task-actions">
                {application.status === "pending" || application.status === "rejected" ? (
                  <button className="button" type="submit" formAction={decideApplication.bind(null, item.id, "approved")}>Approve</button>
                ) : null}
                {application.status === "pending" ? (
                  <button className="button button-quiet" type="submit" formAction={decideApplication.bind(null, item.id, "rejected")}>Reject</button>
                ) : null}
                {application.status === "approved" || application.status === "rejected" ? (
                  <button className="button button-quiet" type="submit" formAction={undoApplication.bind(null, item.id)}>Undo decision</button>
                ) : null}
              </form>
            </article>
          );
        })}
      </div>
    </main>
  );
}
