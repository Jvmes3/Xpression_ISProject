import { FacultyPage } from "../components/RoleHome";
import { canUseRole } from "../lib/access";
import { currentAccount } from "../lib/session";

export const dynamic = "force-dynamic";

export default async function ScoutPage() {
  const account = await currentAccount();
  const links = [
    { href: "/feed", label: "Browse the community" },
    { href: "/apply", label: "Apply as a talent scout" },
    { href: "/help", label: "Help" },
  ];
  if (canUseRole(account, "scout")) {
    links.unshift({ href: "/scout/desk", label: "Open your workspace" });
  }

  return (
    <FacultyPage
      kicker="Talent Scout"
      title="Talent scouts on Xpression."
      lede="Talent scouts look for creators and open the door to work outside the feed. This page is the public introduction. Search, profiles, and opportunities live in the scout workspace."
      points={[
        "A scout reviews a creator’s profile before reaching out.",
        "Opportunities include commissions, auditions, collaborations, and open calls.",
        "Creators choose whether they are open to that kind of invitation.",
      ]}
      links={links}
    />
  );
}
