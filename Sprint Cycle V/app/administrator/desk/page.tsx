import { RoleHome } from "../../components/RoleHome";
import { RoleGate } from "../../components/RoleGate";
import { currentAccount } from "../../lib/session";

export const dynamic = "force-dynamic";

export default async function AdministratorDeskPage() {
  const account = await currentAccount();
  return (
    <RoleGate role="administrator" title="Administrator workspace" next="/administrator/desk">
      <RoleHome
        kicker={account?.email || "Administrator"}
        title="Administrator workspace"
        lede="Accounts, applications, and platform settings each have their own page."
        cards={[
          {
            title: "Accounts",
            text: "Search people, then activate or deactivate an account.",
            action: "Show accounts",
            href: "/administrator/accounts",
          },
          {
            title: "Applications",
            text: "Approve or reject a creator, mentor, or talent scout application.",
            action: "Review applications",
            href: "/administrator/applications",
          },
          {
            title: "Roles",
            text: "How moderator and administrator accounts are created.",
            action: "Show roles",
            href: "/administrator/roles",
          },
          {
            title: "Categories",
            text: "Writing, visual art, music, and any category you add later.",
            action: "Show categories",
            href: "/administrator/categories",
          },
          {
            title: "Content",
            text: "Show, hide, or remove a post from the platform.",
            action: "Show content",
            href: "/administrator/content",
          },
          {
            title: "Reported activity",
            text: "Cases a moderator has sent up.",
            action: "Show reports",
            href: "/administrator/activity",
          },
          {
            title: "Help tickets",
            text: "Tickets a moderator escalated.",
            action: "Show tickets",
            href: "/administrator/tickets",
          },
          {
            title: "Analytics",
            text: "A report of accounts, posts, and open cases.",
            action: "Show analytics",
            href: "/administrator/analytics",
          },
          {
            title: "Settings",
            text: "Comments, GIFs, uploads, and the moderation rule.",
            action: "Show settings",
            href: "/administrator/settings",
          },
        ]}
      />
    </RoleGate>
  );
}
