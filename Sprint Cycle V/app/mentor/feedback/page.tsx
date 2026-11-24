import Link from "next/link";
import { RoleSignIn } from "../../components/RoleSignIn";
import { accountLabel, canUseRole } from "../../lib/access";
import { saveMentorFeedback } from "../../lib/actions";
import { feedbackParts } from "../../lib/feedback-copy";
import { listMentorFeedback, listMentorPieces } from "../../lib/records";
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
        title="Structured feedback"
        next="/mentor/feedback"
        signedInAs={account ? accountLabel(account) : undefined}
      />
    );
  }

  const params = await searchParams;
  const mentor = await accountForSession(account, "Mentor");
  const works = mentor ? await listMentorPieces(mentor.account_id) : [];
  const notes = mentor ? await listMentorFeedback(mentor.account_id) : [];

  return (
    <main className="page">
      <p className="eyebrow">Creative Mentor</p>
      <h1>Structured feedback</h1>
      <p className="lede">Write strengths, what to revise, and a recommendation. The note is saved with the piece.</p>
      {params.feedback === "saved" ? <p className="note">Feedback for {params.piece || "that piece"} is in the database.</p> : null}
      {params.feedback === "required" ? <p className="note">Choose a piece and fill in strengths, improvements, and a recommendation.</p> : null}
      {params.feedback === "work" ? <p className="note">That piece is not in the database.</p> : null}
      {params.feedback === "account" ? <p className="note">This sign-in is not a Mentor row in the database. Approve a mentor application, then sign in with the role email.</p> : null}
      {works.length === 0 ? <p className="note">Save a piece, comment on it, or leave feedback from the piece first. Those pieces show up here.</p> : null}
      {works.length > 0 ? <form className="form panel" action={saveMentorFeedback}>
        <label>
          Piece
          <select name="workId" defaultValue={works[0]?.id || ""} required>
            {works.map((work) => (
              <option key={work.id} value={work.id}>{work.title} · {work.creator}</option>
            ))}
          </select>
        </label>
        <label>
          Strengths
          <textarea name="strengths" required placeholder="What is working in the piece." />
        </label>
        <label>
          Improvements
          <textarea name="improvements" required placeholder="What to revise next." />
        </label>
        <label>
          Recommendation
          <textarea name="recommendation" required placeholder="A next step for the creator." />
        </label>
        <button className="button" type="submit">Save feedback</button>
      </form> : null}
      <section className="panel">
        <h2>Notes you have written</h2>
        {notes.length === 0 ? <p>No feedback is stored for this mentor yet.</p> : null}
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
