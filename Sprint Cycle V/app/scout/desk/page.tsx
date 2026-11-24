import { RoleHome } from "../../components/RoleHome";
import { RoleGate } from "../../components/RoleGate";
import { currentAccount } from "../../lib/session";

export const dynamic = "force-dynamic";

export default async function ScoutDeskPage() {
  const account = await currentAccount();
  return (
    <RoleGate role="scout" title="Scout workspace" next="/scout/desk">
      <RoleHome
        kicker={account?.email || "Talent Scout"}
        title="Scout workspace"
        lede="Search, profiles, and opportunities are separate pages. Start here and open the one you need."
        cards={[
          {
            title: "Search creators",
            text: "Find a creator, then open their profile.",
            action: "Search",
            href: "/scout/search",
          },
          {
            title: "Opportunities",
            text: "Create a commission, audition, collaboration, or call.",
            action: "Open opportunities",
            href: "/opportunities",
          },
          {
            title: "Responses",
            text: "See who has been invited and how they answered.",
            action: "Show responses",
            href: "/scout/responses",
          },
          {
            title: "Saved",
            text: "Creators and pieces you want to come back to.",
            action: "Show saved",
            href: "/saved",
          },
        ]}
      />
    </RoleGate>
  );
}
