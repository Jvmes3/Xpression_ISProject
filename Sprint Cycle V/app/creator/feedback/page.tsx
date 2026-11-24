import Link from "next/link";
import { RoleSignIn } from "../../components/RoleSignIn";
import { SprintNote } from "../../components/SprintNote";
import { accountLabel, canUseRole } from "../../lib/access";
import { feedbackParts } from "../../lib/feedback-copy";
import { listFeedbackForCreator } from "../../lib/records";
import { currentAccount } from "../../lib/session";
import { accountForSession } from "../../lib/writes";

export const dynamic = "force-dynamic";

export default async function CreatorFeedbackPage() {
  const account = await currentAccount();
  if (!canUseRole(account, "creator")) {
    return (
      <RoleSignIn
        role="creator"
        title="Feedback on my work"
        next="/creator/feedback"
        signedInAs={account ? accountLabel(account) : undefined}
      />
    );
  }

  const creator = await accountForSession(account, "Creator");
  const notes = creator ? await listFeedbackForCreator(creator.account_id) : [];

  return (
    <main className="page">
      <p className="eyebrow">Creator</p>
      <h1>Feedback on your work</h1>
      <p className="lede">Mentor notes on your published pieces. Open a piece from your profile to read community comments.</p>
      <p className="more"><Link href="/creator/request">Request feedback from a mentor</Link></p>
      {notes.length === 0 ? (
        <section className="panel empty-state">
          <h2>No mentor notes yet</h2>
          <p>When a mentor writes structured feedback, it will appear here as a card for that piece.</p>
        </section>
      ) : (
        <div className="task-list">
          {notes.map((item) => (
            <article key={String(item.feedback_id)} className="panel">
              <p className="flag">{String(item.mentor_name)} · {String(item.written_at)}</p>
              <h2><Link href={`/creator/desk/${item.work_id}?talk=feedbacks`}>{String(item.title)}</Link></h2>
              {feedbackParts(String(item.strengths), String(item.improvements), String(item.recommendation)).map((part) => (
                <p key={part.label || "note"}>{part.label ? <strong>{part.label}. </strong> : null}{part.text}</p>
              ))}
              <p><Link href={`/creator/desk/${item.work_id}?talk=feedbacks`}>Open the piece</Link></p>
            </article>
          ))}
        </div>
      )}
      <SprintNote label="replies to feedback" />
      <p className="more"><Link href="/profile">Back to your profile</Link></p>
    </main>
  );
}
