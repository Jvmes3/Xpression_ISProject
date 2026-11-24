import { RoleSignIn } from "../../components/RoleSignIn";
import { TicketQueue } from "../../components/TicketQueue";
import { accountLabel, canUseRole } from "../../lib/access";
import { currentAccount } from "../../lib/session";
import { readDatabase } from "../../lib/store";
export const dynamic = "force-dynamic";
export default async function AdminTicketsPage({ searchParams, }: {
    searchParams: Promise<{
        ticket?: string;
    }>;
}) {
    const account = await currentAccount();
    if (!canUseRole(account, "administrator")) {
        return <RoleSignIn role="administrator" title="Help tickets" next="/administrator/tickets" signedInAs={account ? accountLabel(account) : undefined}/>;
    }
    const ticket = (await searchParams).ticket;
    const tickets = readDatabase().tickets.filter((item) => item.status === "escalated");
    return (<main className="page">
 <p className="eyebrow">Administrator</p>
 <h1>Escalated help tickets</h1>
 <p className="lede">These tickets were sent by a moderator. Reply, mark one resolved, or set it aside with a reason.</p>
 <TicketQueue tickets={tickets} canEscalate={false} notice={ticket}/>
 </main>);
}
