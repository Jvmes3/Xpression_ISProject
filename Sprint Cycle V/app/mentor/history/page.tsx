import Link from "next/link";
import { RoleSignIn } from "../../components/RoleSignIn";
import { accountLabel, canUseRole } from "../../lib/access";
import { accountForSession } from "../../lib/writes";
import { feedbackParts } from "../../lib/feedback-copy";
import { listMentorFeedback } from "../../lib/records";
import { currentAccount } from "../../lib/session";

export const dynamic = "force-dynamic";

export default async function ReviewHistoryPage() {
  const account = await currentAccount();
  if (!canUseRole(account, "mentor")) {
    return (
      <RoleSignIn
        role="mentor"
        title="Review history"
        next="/mentor/history"
        signedInAs={account ? accountLabel(account) : undefined}
      />
    );
  }

  const mentor = await accountForSession(account, "Mentor");
  const feedback = mentor ? await listMentorFeedback(mentor.account_id) : [];

  return (
    <main className="page">
      <p className="eyebrow">Creative Mentor</p>
      <h1>Review history</h1>
      <p className="lede">Feedback you have already written.</p>
      {!mentor ? <p className="note">This sign-in is not a Mentor row in the database.</p> : null}

      <section className="panel">
        <h2>Previous feedback</h2>
        {feedback.length === 0 ? <p>You have not saved structured feedback yet.</p> : null}
        <div className="task-list">
          {feedback.map((item) => (
            <Link key={item.feedback_id} className="open-card" href={`/creator/desk/${item.work_id}?talk=feedbacks`}>
              <p className="flag">{item.written_at}</p>
              <h3>{item.title}</h3>
              {feedbackParts(String(item.strengths), String(item.improvements), String(item.recommendation)).map((part) => (
                <p key={part.label || "note"}>{part.label ? <strong>{part.label}. </strong> : null}{part.text}</p>
              ))}
              <p className="meta-line">Open feedback</p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
