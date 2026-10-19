import { RoleHome } from "../components/RoleHome";
import { StaffList } from "../components/StaffList";

export default function ModeratorPage() {
  return (
    <RoleHome
      kicker="Community Moderator"
      title="Keep the feedback constructive."
      lede="This sprint shows three Moderator use cases: deciding reported work, deciding featured nominations, and acting on a reported user."
      cards={[
        {
          title: "Reported creative work",
          text: "Keep, hide, or remove writing, art, or music that was reported, and record the case.",
          action: "Show reports",
          href: "/moderator/desk#work",
        },
        {
          title: "Featured nominations",
          text: "Approve or decline work a Mentor nominated for the feed.",
          action: "Show nominations",
          href: "/moderator/desk#nominations",
        },
        {
          title: "Reported users",
          text: "Warn an account or apply a temporary restriction. Bans go to an Administrator.",
          action: "Show user reports",
          href: "/moderator/desk#users",
        },
      ]}
      rolePage={{ label: "Moderator", href: "/moderator/desk" }}
    >
      <StaffList id="team" title="Our Moderator Team" role="moderator" />
    </RoleHome>
  );
}
