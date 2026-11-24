import { FacultyPage } from "../components/RoleHome";
import { canUseRole } from "../lib/access";
import { currentAccount } from "../lib/session";

export const dynamic = "force-dynamic";

export default async function MentorPage() {
  const account = await currentAccount();
  const links = [
    { href: "/feed", label: "Browse the community" },
    { href: "/apply", label: "Apply to mentor" },
    { href: "/help", label: "Help" },
  ];
  if (canUseRole(account, "mentor")) {
    links.unshift({ href: "/mentor/desk", label: "Open your workspace" });
  }

  return (
    <FacultyPage
      kicker="Creative Mentor"
      title="Mentors on Xpression."
      lede="Mentors read creative work and leave structured feedback. This page explains the role. Review tools, nominations, and mentor-to-mentor notes stay in the mentor workspace."
      points={[
        "A mentor looks through writing, visual art, and music that is ready for a review.",
        "Feedback names what is working, what could change, and a recommendation.",
        "Mentors can also nominate a piece for the featured feed and talk with other mentors about a post.",
      ]}
      links={links}
    />
  );
}
