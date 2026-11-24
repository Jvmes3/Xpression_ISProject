import { RoleHome } from "../../components/RoleHome";
import { RoleGate } from "../../components/RoleGate";
import { currentAccount } from "../../lib/session";

export const dynamic = "force-dynamic";

export default async function CreatorDeskPage() {
  const account = await currentAccount();
  return (
    <RoleGate role="creator" title="Creator workspace" next="/creator/desk">
      <RoleHome
        kicker={account?.email || "Creator"}
        title="Creator workspace"
        lede="Each part of a creator’s work has its own page. Start here, then open the one you need."
        cards={[
          {
            title: "Browse",
            text: "The community feed, with All, Writing, Visual art, and Music across the top.",
            action: "Browse",
            href: "/feed",
          },
          {
            title: "Publish",
            text: "Post a new piece of writing, visual art, or music.",
            action: "Publish",
            href: "/creator/desk/publish",
          },
          {
            title: "Profile",
            text: "Your posts, bio, and the pieces you choose to feature.",
            action: "Open profile",
            href: "/profile",
          },
          {
            title: "Feedback",
            text: "Reviews mentors have left on your work.",
            action: "Show feedback",
            href: "/creator/feedback",
          },
          {
            title: "Request feedback",
            text: "Search for a mentor and ask them to review one of your pieces.",
            action: "Request feedback",
            href: "/creator/request",
          },
          {
            title: "Saved",
            text: "Creators you follow and pieces you bookmarked.",
            action: "Show saved",
            href: "/saved",
          },
        ]}
      />
    </RoleGate>
  );
}
