export type TaskNeed = "creator" | "mentor" | "scout" | "moderator" | "administrator";

export type RoleTask = {
  role: TaskNeed;
  slug: string;
  title: string;
  action: string;
  href: string;
};

export const roleTasks: RoleTask[] = [
  { role: "creator", slug: "publish", title: "Publish work", action: "Publish", href: "/creator/desk/publish" },
  { role: "creator", slug: "portfolio", title: "My profile", action: "Open profile", href: "/profile" },
  { role: "creator", slug: "feedback", title: "Feedback on my work", action: "Show feedback", href: "/creator/feedback" },
  { role: "creator", slug: "request", title: "Request feedback", action: "Request feedback", href: "/creator/request" },
  { role: "creator", slug: "saved", title: "Following and saved", action: "Show saved", href: "/saved" },
  { role: "creator", slug: "messages", title: "Messages and reports", action: "Show messages", href: "/messages" },
  { role: "mentor", slug: "requests", title: "Review requests", action: "Show requests", href: "/mentor/requests" },
  { role: "mentor", slug: "feedback", title: "Written feedback", action: "Show feedback", href: "/mentor/feedback" },
  { role: "mentor", slug: "discover", title: "Discover work", action: "Search work", href: "/mentor/discover" },
  { role: "mentor", slug: "nominate", title: "Nominate featured work", action: "Nominate", href: "/mentor/nominate" },
  { role: "mentor", slug: "history", title: "Review history", action: "Show history", href: "/mentor/history" },
  { role: "mentor", slug: "messages", title: "Messages", action: "Show messages", href: "/messages" },
  { role: "scout", slug: "search", title: "Search creators", action: "Search", href: "/scout/search" },
  { role: "scout", slug: "portfolio", title: "Review a profile", action: "Open profile", href: "/scout/search" },
  { role: "scout", slug: "contact", title: "Contact a creator", action: "Send a message", href: "/messages" },
  { role: "scout", slug: "invite", title: "Invite to an opportunity", action: "Open opportunities", href: "/opportunities" },
  { role: "scout", slug: "saved", title: "Saved candidates", action: "Show saved", href: "/saved" },
  { role: "scout", slug: "responses", title: "Track responses", action: "Show responses", href: "/scout/responses" },
  { role: "moderator", slug: "reports", title: "Reported creative work", action: "Show reports", href: "/moderator/reports" },
  { role: "moderator", slug: "nominations", title: "Featured nominations", action: "Show nominations", href: "/moderator/nominations" },
  { role: "moderator", slug: "comments", title: "Reported users", action: "Show users", href: "/moderator/users" },
  { role: "moderator", slug: "users", title: "Reported users", action: "Show reports", href: "/moderator/users" },
  { role: "moderator", slug: "warn", title: "Warn or restrict", action: "Open warnings", href: "/moderator/users" },
  { role: "moderator", slug: "escalate", title: "Reported work", action: "Show reports", href: "/moderator/reports" },
  { role: "administrator", slug: "users", title: "Manage users", action: "Show users", href: "/administrator/accounts" },
  { role: "administrator", slug: "analytics", title: "Analytics and reports", action: "Show reports", href: "/administrator/analytics" },
  { role: "administrator", slug: "applications", title: "Approve specialized accounts", action: "Review applications", href: "/administrator/applications" },
  { role: "administrator", slug: "roles", title: "Roles and permissions", action: "Show roles", href: "/administrator/roles" },
  { role: "administrator", slug: "categories", title: "Creative categories", action: "Show categories", href: "/administrator/categories" },
  { role: "administrator", slug: "settings", title: "Reported activity and settings", action: "Show settings", href: "/administrator/settings" },
];

export function taskPath(role: TaskNeed, slug: string) {
  return `/task?role=${role}&task=${slug}`;
}

export function findTask(role: string, slug: string) {
  return roleTasks.find((item) => item.role === role && item.slug === slug);
}

export const rolePage: Record<TaskNeed, string> = {
  creator: "/creator",
  mentor: "/mentor",
  scout: "/scout",
  moderator: "/moderator",
  administrator: "/administrator",
};

export const roleSignInLabel: Record<TaskNeed, string> = {
  creator: "Creator",
  mentor: "Creative Mentor",
  scout: "Talent Scout",
  moderator: "Moderator",
  administrator: "Administrator",
};
