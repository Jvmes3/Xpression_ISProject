import { RoleHome } from "../../components/RoleHome";
import { RoleGate } from "../../components/RoleGate";
import { currentAccount } from "../../lib/session";

export const dynamic = "force-dynamic";

export default async function MentorDeskPage() {
  const account = await currentAccount();
  return (
    <RoleGate role="mentor" title="Mentor workspace" next="/mentor/desk">
      <RoleHome
        kicker={account?.email || "Creative Mentor"}
        title="Mentor workspace"
        lede="Discover work, write feedback, and keep a record of reviews. Each of those is its own page."
        cards={[
          {
            title: "Discover work",
            text: "Search the feed with All, Writing, Visual art, and Music, then open a piece.",
            action: "Discover",
            href: "/mentor/discover",
          },
          {
            title: "Write feedback",
            text: "Leave structured feedback when you already know which piece you are reviewing.",
            action: "Write feedback",
            href: "/mentor/feedback",
          },
          {
            title: "Other mentors",
            text: "Find another mentor, ask their opinion, or share a post with them.",
            action: "Find mentors",
            href: "/mentor/mentors",
          },
          {
            title: "Nominate featured work",
            text: "Choose a piece you've interacted with and say why it belongs on the featured feed. A moderator decides later.",
            action: "Nominate",
            href: "/mentor/nominate",
          },
          {
            title: "Review history",
            text: "Feedback you have already written.",
            action: "Show history",
            href: "/mentor/history",
          },
          {
            title: "Review requests",
            text: "Pieces creators have asked you to look at.",
            action: "Show requests",
            href: "/mentor/requests",
          },
        ]}
      />
    </RoleGate>
  );
}
