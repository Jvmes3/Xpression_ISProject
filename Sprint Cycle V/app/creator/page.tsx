import { FacultyPage } from "../components/RoleHome";
import { canUseRole } from "../lib/access";
import { currentAccount } from "../lib/session";

export const dynamic = "force-dynamic";

export default async function CreatorPage() {
  const account = await currentAccount();
  const links = [
    { href: "/feed", label: "Browse the community" },
    { href: "/apply", label: "Apply as a creator" },
    { href: "/help", label: "Help" },
  ];
  if (canUseRole(account, "creator")) {
    links.unshift({ href: "/creator/desk", label: "Open your workspace" });
  }

  return (
    <FacultyPage
      kicker="Creator"
      title="Creators on Xpression."
      lede="Creators are the people who publish writing, visual art, and music. This page is the public introduction. The tools for posting and managing a profile live in a creator workspace."
      points={[
        "A creator keeps a profile of posts and can be open to commissions.",
        "Anyone can browse the community feed and open a piece.",
        "Mentors may review a piece. Talent scouts may invite a creator to an opportunity.",
      ]}
      links={links}
    />
  );
}
