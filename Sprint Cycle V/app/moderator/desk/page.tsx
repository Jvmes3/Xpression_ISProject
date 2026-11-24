import { RoleHome } from "../../components/RoleHome";
import { RoleGate } from "../../components/RoleGate";
import { currentAccount } from "../../lib/session";

export const dynamic = "force-dynamic";

export default async function ModeratorDeskPage() {
  const account = await currentAccount();
  return (
    <RoleGate role="moderator" title="Moderator workspace" next="/moderator/desk">
      <RoleHome
        kicker={account?.email || "Community Moderator"}
        title="Moderator workspace"
        lede="Reports, users, nominations, and tickets each have their own page."
        cards={[
          {
            title: "Reported work",
            text: "Open a reported piece. The decision is written on the case page.",
            action: "Show reports",
            href: "/moderator/reports",
          },
          {
            title: "Reported users",
            text: "Warn an account, restrict it, or send the case to an administrator.",
            action: "Show users",
            href: "/moderator/users",
          },
          {
            title: "Featured nominations",
            text: "Pieces mentors have asked to feature.",
            action: "Show nominations",
            href: "/moderator/nominations",
          },
          {
            title: "Help tickets",
            text: "Reply, resolve, set aside, or escalate a ticket.",
            action: "Show tickets",
            href: "/moderator/tickets",
          },
        ]}
      />
    </RoleGate>
  );
}
