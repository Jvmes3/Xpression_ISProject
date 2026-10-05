import { RoleHome } from "../components/RoleHome";
import { taskPath } from "../lib/tasks";

export default function CreatorPage() {
  return (
    <RoleHome
      kicker="Creator"
      title="Publish and explore."
      lede="A Creator posts writing, visual art, or music, keeps a portfolio, and takes part in the community feed."
      cards={[
        {
          title: "Explore creative work",
          text: "Browse recent work and filter it by writing, visual art, or music.",
          action: "Show the feed",
          href: "/feed",
        },
        {
          title: "Publish work",
          text: "Post a piece, including a SoundCloud link when the work is music.",
          action: "Publish",
          href: taskPath("creator", "publish"),
        },
        {
          title: "My portfolio",
          text: "Feature, archive, edit, or remove work on your profile.",
          action: "Open portfolio",
          href: taskPath("creator", "portfolio"),
        },
        {
          title: "Feedback on my work",
          text: "Read comments and mentor reviews, then respond.",
          action: "Show feedback",
          href: taskPath("creator", "feedback"),
        },
        {
          title: "Following and saved",
          text: "Return to creators you follow and works you bookmarked.",
          action: "Show saved",
          href: taskPath("creator", "saved"),
        },
        {
          title: "Messages and reports",
          text: "Read messages and report content that should be reviewed.",
          action: "Show messages",
          href: taskPath("creator", "messages"),
        },
      ]}
    />
  );
}
