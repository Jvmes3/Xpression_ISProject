import { RoleHome } from "../components/RoleHome";
import { StaffList } from "../components/StaffList";
import { taskPath } from "../lib/tasks";

export default function AdministratorPage() {
  return (
    <RoleHome
      kicker="Administrator"
      title="Platform overview"
      lede="An Administrator reviews applications, accounts, categories, and platform reports."
      cards={[
        {
          title: "Manage users",
          text: "Search accounts and activate, suspend, or ban when needed.",
          action: "Show users",
          href: taskPath("administrator", "users"),
        },
        {
          title: "Analytics and reports",
          text: "Generate a report of accounts, posts, and open cases.",
          action: "Show reports",
          href: taskPath("administrator", "analytics"),
        },
        {
          title: "Approve specialized accounts",
          text: "Accept or reject Mentor and Talent Scout applications.",
          action: "Review applications",
          href: taskPath("administrator", "applications"),
        },
        {
          title: "Roles and permissions",
          text: "See moderator and administrator accounts created in the terminal.",
          action: "Show roles",
          href: taskPath("administrator", "roles"),
        },
        {
          title: "Creative categories",
          text: "Maintain media types, disciplines, genres, and tags.",
          action: "Show categories",
          href: taskPath("administrator", "categories"),
        },
        {
          title: "Reported activity and settings",
          text: "Read escalated cases and edit platform configuration.",
          action: "Show settings",
          href: taskPath("administrator", "settings"),
        },
      ]}
    >
      <StaffList id="team" title="Our Admin Team" role="administrator" />
    </RoleHome>
  );
}
