import Link from "next/link";
import { RoleSignIn } from "../../components/RoleSignIn";
import { accountLabel, canUseRole } from "../../lib/access";
import { feedbackParts } from "../../lib/feedback-copy";
import { listMentorFeedback } from "../../lib/records";
import { currentAccount } from "../../lib/session";
import { accountForSession } from "../../lib/writes";

export const dynamic = "force-dynamic";

export default async function MentorFeedbackPage({
  searchParams,
}: {
  searchParams: Promise<{ feedback?: string; piece?: string }>;
}) {
  const account = await currentAccount();
  if (!canUseRole(account, "mentor")) {
    return (
      <RoleSignIn
        role="mentor"
        title="Written feedback"
        next="/mentor/feedback"
        signedInAs={account ? accountLabel(account) : undefined}
      />
    );
  }

  const params = await searchParams;
  const mentor = await accountForSession(account, "Mentor");
  const notes = mentor ? await listMentorFeedback(mentor.account_id) : [];

  return (
    <main className="page">
      <p className="eyebrow">Creative Mentor</p>
      <h1>Written feedback</h1>
      <p className="lede">Pieces you have already left feedback on. Open one to read it, or write new feedback from that piece’s Feedbacks tab.</p>
      {params.feedback === "saved" ? <p className="note">Feedback for {params.piece || "that piece"} is in the database.</p> : null}
      {params.feedback === "account" ? <p className="note">This sign-in is not a Mentor row in the database. Approve a mentor application, then sign in with the role email.</p> : null}
      <section className="panel">
        <h2>Your feedback</h2>
        {notes.length === 0 ? <p>You have not written feedback yet.</p> : null}
        <div className="task-list">
          {notes.map((item) => (
            <Link key={String(item.feedback_id)} className="open-card" href={`/creator/desk/${item.work_id}?talk=feedbacks`}>
              <p className="flag">{String(item.written_at)}</p>
              <h3>{String(item.title)}</h3>
              {feedbackParts(String(item.strengths), String(item.improvements), String(item.recommendation)).map((part) => (
                <p key={part.label || "note"}>{part.label ? <strong>{part.label}. </strong> : null}{part.text}</p>
              ))}
              <p className="meta-line">Open feedback</p>
            </Link>
          ))}
        </div>
      </section>
      <p className="more"><Link href="/mentor/desk">Back to the mentor desk</Link></p>
    </main>
  );
}
