import { RoleSignIn } from "../../components/RoleSignIn";
import { TicketQueue } from "../../components/TicketQueue";
import { accountLabel, canUseRole } from "../../lib/access";
import { currentAccount } from "../../lib/session";
import { readDatabase } from "../../lib/store";

export const dynamic = "force-dynamic";

export default async function ModeratorTicketsPage({
  searchParams,
}: {
  searchParams: Promise<{ ticket?: string }>;
}) {
  const account = await currentAccount();
  if (!canUseRole(account, "moderator")) {
    return (
      <RoleSignIn
        role="moderator"
        title="Help tickets"
        next="/moderator/tickets"
        signedInAs={account ? accountLabel(account) : undefined}
      />
    );
  }

  const { ticket } = await searchParams;

  return (
    <main className="page">
      <p className="eyebrow">Community Moderator</p>
      <h1>Help tickets</h1>
      <p className="lede">Reply with a specific answer, mark the ticket resolved, set it aside with a reason, or send it to an administrator.</p>
      <TicketQueue tickets={readDatabase().tickets} canEscalate notice={ticket} />
    </main>
  );
}
