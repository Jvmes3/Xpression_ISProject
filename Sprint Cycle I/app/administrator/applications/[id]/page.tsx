import { NotReady } from "../../../components/NotReady";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Answers } from "../../../components/Answers";
import { answerLines } from "../../../lib/application";
import { readDatabase } from "../../../lib/store";

export const dynamic = "force-dynamic";

export default async function ApplicationRecordPage({ params }: { params: Promise<{ id: string }> }) {
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
          <NotReady className="button">Approve</NotReady>
        ) : null}
        {application.status === "pending" ? (
          <NotReady className="button button-quiet">Reject</NotReady>
        ) : null}
        {application.status === "approved" || application.status === "rejected" ? (
          <NotReady className="button button-quiet">Undo decision</NotReady>
        ) : null}
      </form>
      <p className="more">
        <Link href="/administrator/desk#applications">Back to the administrator desk</Link>
      </p>
    </main>
  );
}
