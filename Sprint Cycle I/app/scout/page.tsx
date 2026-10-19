import { RoleHome } from "../components/RoleHome";

export default function ScoutPage() {
  return (
    <RoleHome
      kicker="Talent Scout / Commissioner"
      title="Find the right people."
      lede="This sprint shows three Talent Scout use cases: searching creators who are open to work, contacting one of them, and inviting creators to an opportunity."
      cards={[
        {
          title: "Search creators",
          text: "Filter by discipline, media type, and whether a creator is open to commissions, then open that portfolio.",
          action: "Search",
          href: "/scout/desk#search",
        },
        {
          title: "Contact a creator",
          text: "Send a private message about a commission or collaboration.",
          action: "Send a message",
          href: "/scout/desk#contact",
        },
        {
          title: "Invite to an opportunity",
          text: "Create a call with dates and invite selected creators.",
          action: "Send an invite",
          href: "/scout/desk#invite",
        },
      ]}
      rolePage={{ label: "Talent Scout", href: "/scout/desk" }}
    />
  );
}
