import { FacultyPage } from "../components/RoleHome";
import { StaffList } from "../components/StaffList";
import { canUseRole } from "../lib/access";
import { currentAccount } from "../lib/session";

export const dynamic = "force-dynamic";

export default async function ModeratorPage() {
  const account = await currentAccount();
  const links = [
    { href: "/help", label: "Ask for help" },
    { href: "/#contact", label: "Contact" },
    { href: "/feed", label: "Browse the community" },
  ];
  if (canUseRole(account, "moderator")) {
    links.unshift({ href: "/moderator/desk", label: "Open your workspace" });
  }

  return (
    <FacultyPage
      kicker="Community Moderator"
      title="Moderation on Xpression."
      lede="Moderators keep the community usable. This page introduces the team. Reports, cases, and ticket tools stay in the moderator workspace."
      points={[
        "Members can report a piece that breaks the community standard.",
        "A moderator reads the report and records what happens next.",
        "Help tickets can be answered here, or sent on to an administrator.",
      ]}
      links={links}
    >
      <StaffList id="team" title="Moderation team" role="moderator" />
    </FacultyPage>
  );
}
