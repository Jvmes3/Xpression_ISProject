import { RoleHome } from "../components/RoleHome";
import { StaffList } from "../components/StaffList";
import { taskPath } from "../lib/tasks";

export default function ModeratorPage() {
  return (
    <RoleHome
      kicker="Community Moderator"
      title="Keep the feedback constructive."
      lede="A Moderator reviews reported work, comments, and accounts, and decides which nominations belong in the featured feed."
      cards={[
        {
          title: "Reported creative work",
          text: "Keep, hide, or remove writing, art, or music that was reported.",
          action: "Show reports",
          href: taskPath("moderator", "reports"),
        },
        {
          title: "Featured nominations",
          text: "Approve or decline work a Mentor nominated for the feed.",
          action: "Show nominations",
          href: taskPath("moderator", "nominations"),
        },
        {
          title: "Comments and GIFs",
          text: "Review replies reported as abusive, spam, or off-topic.",
          action: "Show comments",
          href: taskPath("moderator", "comments"),
        },
        {
          title: "Reported users",
          text: "Read behavior reports and record a moderation decision.",
          action: "Show reports",
          href: taskPath("moderator", "users"),
        },
        {
          title: "Warn or restrict",
          text: "Issue a warning or a temporary restriction. Bans go to an Administrator.",
          action: "Open warnings",
          href: taskPath("moderator", "warn"),
        },
        {
          title: "Escalate",
          text: "Send safety, copyright, or account issues to an Administrator.",
          action: "Show cases",
          href: taskPath("moderator", "escalate"),
        },
      ]}
    >
      <StaffList id="team" title="Our Moderator Team" role="moderator" />
    </RoleHome>
  );
}
