import { RoleSignIn } from "../../components/RoleSignIn";
import { accountLabel, canUseRole } from "../../lib/access";
import { nominateWork } from "../../lib/actions";
import { listInteractedPieces } from "../../lib/records";
import { currentAccount } from "../../lib/session";
import { accountForSession } from "../../lib/writes";

export const dynamic = "force-dynamic";

export default async function NominatePage({
  searchParams,
}: {
  searchParams: Promise<{ nominate?: string; piece?: string }>;
}) {
  const account = await currentAccount();
  if (!canUseRole(account, "mentor")) {
    return (
      <RoleSignIn
        role="mentor"
        title="Nominate featured work"
        next="/mentor/nominate"
        signedInAs={account ? accountLabel(account) : undefined}
      />
    );
  }

  const { nominate, piece } = await searchParams;
  const mentor = await accountForSession(account, "Mentor");
  const works = mentor ? await listInteractedPieces(mentor.account_id) : [];

  return (
    <main className="page">
      <p className="eyebrow">Creative Mentor</p>
      <h1>Nominate featured work</h1>
      <p className="lede">Choose a piece you've interacted with and say why it belongs on the featured feed. A moderator decides later.</p>
      {nominate === "saved" ? <p className="note">{piece || "That piece"} is nominated and waiting for a moderator.</p> : null}
      {nominate === "required" ? <p className="note">Choose a piece and write a reason before nominating it.</p> : null}
      {nominate === "work" ? <p className="note">That piece is not available to nominate.</p> : null}
      {nominate === "account" ? <p className="note">This sign-in is not a Mentor row in the database.</p> : null}
      {works.length === 0 ? <p className="note">Like a comment, save a piece, or comment on it first. Those pieces are the ones you can nominate.</p> : null}
      {works.length > 0 ? <form className="form panel" action={nominateWork}>
        <label>
          Piece
          <select name="workId" required defaultValue="">
            <option value="" disabled>Choose a piece</option>
            {works.map((work) => (
              <option key={work.id} value={work.id}>{work.title} · {work.creator}</option>
            ))}
          </select>
        </label>
        <label>
          Why it should be featured
          <textarea name="reason" required placeholder="What makes this piece worth featuring." />
        </label>
        <button className="button" type="submit">Nominate</button>
      </form> : null}
    </main>
  );
}
