import { RoleHome } from "../components/RoleHome";
import { StaffList } from "../components/StaffList";

export default function AdministratorPage() {
  return (
    <RoleHome
      kicker="Administrator"
      title="Platform overview"
      lede="This sprint shows three Administrator use cases: managing user accounts, approving Mentor and Talent Scout applications, and generating an analytics report."
      cards={[
        {
          title: "Manage users",
          text: "Search accounts and activate, suspend, or ban when needed.",
          action: "Show users",
          href: "/administrator/desk#accounts",
        },
        {
          title: "Approve specialized accounts",
          text: "Accept or reject a Mentor or Talent Scout application.",
          action: "Show applications",
          href: "/administrator/desk#applications",
        },
        {
          title: "Analytics and reports",
          text: "Choose a date range and generate a report of accounts, posts, and open cases.",
          action: "Show reports",
          href: "/administrator/desk#analytics",
        },
      ]}
      rolePage={{ label: "Administrator", href: "/administrator/desk" }}
    >
      <StaffList id="team" title="Our Admin Team" role="administrator" />
    </RoleHome>
  );
}
