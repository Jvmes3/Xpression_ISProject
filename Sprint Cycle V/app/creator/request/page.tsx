import Link from "next/link";
import { RoleSignIn } from "../../components/RoleSignIn";
import { accountLabel, canUseRole } from "../../lib/access";
import { requestFeedback } from "../../lib/actions";
import { findActiveMentor, listCreatorPieces, listCreatorRequests, listMentors } from "../../lib/records";
import { currentAccount } from "../../lib/session";
import { accountForSession } from "../../lib/writes";

export const dynamic = "force-dynamic";

export default async function RequestFeedbackPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; mentor?: string; request?: string; piece?: string; who?: string }>;
}) {
  const account = await currentAccount();
  if (!canUseRole(account, "creator")) {
    return (
      <RoleSignIn
        role="creator"
        title="Request feedback"
        next="/creator/request"
        signedInAs={account ? accountLabel(account) : undefined}
      />
    );
  }

  const params = await searchParams;
  const q = params.q?.trim() || "";
  const creator = await accountForSession(account, "Creator");
  const mentors = await listMentors(q);
  const mentorId = Number(params.mentor);
  const chosen = Number.isInteger(mentorId) ? await findActiveMentor(mentorId) : null;
  const pieces = creator ? await listCreatorPieces(creator.account_id) : [];
  const sent = creator ? await listCreatorRequests(creator.account_id) : [];
  const notice = params.request;

  return (
    <main className="page">
      <p className="eyebrow">Creator</p>
      <h1>Request feedback</h1>
      <p className="lede">Search for a mentor, choose one, and ask them to review a piece you published. They see the request on their Review requests page.</p>
      {notice === "saved" ? <p className="note">{params.who || "That mentor"} has your request for {params.piece || "that piece"}.</p> : null}
      {notice === "required" ? <p className="note">Choose a mentor, choose one of your pieces, and say what you want them to look at.</p> : null}
      {notice === "note" ? <p className="note">Keep the note to 500 characters.</p> : null}
      {notice === "mentor" ? <p className="note">Choose an active mentor.</p> : null}
      {notice === "work" ? <p className="note">Choose one of your published pieces.</p> : null}
      {notice === "waiting" ? <p className="note">You already asked this mentor to review that piece.</p> : null}
      {notice === "accepted" ? <p className="note">This mentor already accepted a request for that piece.</p> : null}
      {notice === "account" ? <p className="note">This sign-in is not a Creator row in the database.</p> : null}
      <form className="discover" action="/creator/request" method="get">
        {chosen ? <input type="hidden" name="mentor" value={chosen.account_id} /> : null}
        <label className="search">
          <span className="sr-only">Search mentors</span>
          <input name="q" defaultValue={q} placeholder="Name or discipline" />
        </label>
        <button className="button" type="submit">Search</button>
      </form>
      <div className="task-list">
        {mentors.length === 0 ? <p>No mentors match that search.</p> : null}
        {mentors.map((mentor) => {
          const selected = chosen?.account_id === mentor.account_id;
          const href = `/creator/request?mentor=${mentor.account_id}&q=${encodeURIComponent(q)}`;
          return (
            <article key={mentor.account_id} className="panel">
              {selected ? <p className="flag">Chosen</p> : null}
              <h2>{mentor.name}</h2>
              <p className="meta-line">{mentor.discipline || "Creative Mentor"}</p>
              {selected ? null : <p><Link className="button" href={href}>Choose</Link></p>}
            </article>
          );
        })}
      </div>
      {chosen ? (
        <form className="form panel" action={requestFeedback}>
          <h2>Ask {chosen.name}</h2>
          <input type="hidden" name="mentorId" value={chosen.account_id} />
          <input type="hidden" name="q" value={q} />
          {pieces.length === 0 ? <p>Publish a piece before you ask for feedback.</p> : null}
          {pieces.length > 0 ? (
            <>
              <label>
                Piece
                <select name="workId" required defaultValue="">
                  <option value="" disabled>Choose a piece</option>
                  {pieces.map((piece) => (
                    <option key={piece.id} value={piece.id}>{piece.title}</option>
                  ))}
                </select>
              </label>
              <label>
                What you want them to look at
                <textarea name="note" required maxLength={500} placeholder="The question you want this mentor to answer." />
              </label>
              <button className="button" type="submit">Request feedback</button>
            </>
          ) : null}
        </form>
      ) : null}
      <h2>Requests you have sent</h2>
      {sent.length === 0 ? <p>You have not asked a mentor for feedback yet.</p> : null}
      <div className="task-list">
        {sent.map((item) => (
          <article key={String(item.request_id)} className="panel">
            <p className="flag">{String(item.status)}</p>
            <h3><Link href={`/creator/desk/${item.work_id}`}>{String(item.title)}</Link></h3>
            <p className="meta-line">{String(item.mentor_name)} · requested {String(item.requested_at)}</p>
            {item.note ? <p>{String(item.note)}</p> : null}
          </article>
        ))}
      </div>
    </main>
  );
}
