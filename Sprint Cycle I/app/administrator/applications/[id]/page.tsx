import Link from "next/link";
import { notFound } from "next/navigation";
import { Answers } from "../../../components/Answers";
import { decideApplication, undoApplication } from "../../../lib/actions";
import { answerLines } from "../../../lib/application";
import { currentAccount } from "../../../lib/session";
import { LaterSprint } from "../../../components/LaterSprint";
import { hasSprintData, readDatabase } from "../../../lib/store";

export const dynamic = "force-dynamic";

export default async function ApplicationRecordPage({ params }: { params: Promise<{ id: string }> }) {
  const viewer = await currentAccount();
  if (!viewer || viewer.role !== "administrator" || viewer.status !== "active") {
    return (
      <main className="page">
        <h1>Full application</h1>
        <p className="lede">Sign in as an administrator to read this application.</p>
        <p><Link className="button" href="/sign-in">Sign in</Link></p>
      </main>
    );
  }

  if (!hasSprintData()) return <LaterSprint title="Full application" />;

  const { id } = await params;
  const account = readDatabase().accounts.find((item) => item.id === id);
  const application = account?.application;
  if (!account || !application || application.status === "new" || application.status === "draft") {
    notFound();
  }

  return (
    <main className="page">
      <p className="eyebrow">{application.status}</p>
      <h1>{application.name || account.email}</h1>
      <p className="lede">Every question and answer from this application.</p>
      <Answers rows={answerLines(account.email, application)} />
      {application.status === "approved" && application.xpressionEmail ? (
        <p className="meta-line">Xpression login {application.xpressionEmail} · {application.xpressionPassword}</p>
      ) : null}
      <form className="task-actions">
        {application.status === "pending" || application.status === "rejected" ? (
          <button className="button" type="submit" formAction={decideApplication.bind(null, account.id, "approved")}>Approve</button>
        ) : null}
        {application.status === "pending" ? (
          <button className="button button-quiet" type="submit" formAction={decideApplication.bind(null, account.id, "rejected")}>Reject</button>
        ) : null}
        {application.status === "approved" || application.status === "rejected" ? (
          <button className="button button-quiet" type="submit" formAction={undoApplication.bind(null, account.id)}>Undo decision</button>
        ) : null}
      </form>
      <p className="more">
        <Link href="/administrator/desk#applications">Back to the administrator desk</Link>
      </p>
    </main>
  );
}
