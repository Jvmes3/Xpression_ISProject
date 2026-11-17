import { RoleHome } from "../components/RoleHome";
import { taskPath } from "../lib/tasks";

export default function ScoutPage() {
  return (
    <RoleHome
      kicker="Talent Scout / Commissioner"
      title="Find the right people."
      lede="A Talent Scout searches portfolios, contacts creators, and invites them to commissions, calls, or performances."
      cards={[
        {
          title: "Search creators",
          text: "Filter by discipline, media type, and portfolio content.",
          action: "Search",
          href: taskPath("scout", "search"),
        },
        {
          title: "Review a portfolio",
          text: "Open a creator profile and read the work published there.",
          action: "Open portfolio",
          href: taskPath("scout", "portfolio"),
        },
        {
          title: "Contact a creator",
          text: "Send a private message about a commission or collaboration.",
          action: "Send a message",
          href: taskPath("scout", "contact"),
        },
        {
          title: "Invite to an opportunity",
          text: "Create a call with dates and invite selected creators.",
          action: "Send an invite",
          href: taskPath("scout", "invite"),
        },
        {
          title: "Saved candidates",
          text: "Organize bookmarked creators and individual works.",
          action: "Show saved",
          href: taskPath("scout", "saved"),
        },
        {
          title: "Track responses",
          text: "See who was invited and how they replied.",
          action: "Show responses",
          href: taskPath("scout", "responses"),
        },
      ]}
    />
  );
}
