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
  { role: "creator", slug: "portfolio", title: "My portfolio", action: "Open portfolio", href: "/creator/desk#portfolio" },
  { role: "creator", slug: "feedback", title: "Feedback on my work", action: "Show feedback", href: "/creator/desk#feedback" },
  { role: "creator", slug: "saved", title: "Following and saved", action: "Show saved", href: "/creator/desk#saved" },
  { role: "creator", slug: "messages", title: "Messages and reports", action: "Show messages", href: "/creator/desk#messages" },
  { role: "mentor", slug: "requests", title: "Review requests", action: "Show requests", href: "/mentor/desk#requests" },
  { role: "mentor", slug: "feedback", title: "Structured feedback", action: "Write feedback", href: "/mentor/desk#feedback" },
  { role: "mentor", slug: "discover", title: "Discover work", action: "Search work", href: "/mentor/desk#discover" },
  { role: "mentor", slug: "nominate", title: "Nominate featured work", action: "Nominate", href: "/mentor/desk#nominate" },
  { role: "mentor", slug: "history", title: "Review history", action: "Show history", href: "/mentor/desk#history" },
  { role: "mentor", slug: "messages", title: "Messages", action: "Show messages", href: "/mentor/desk#messages" },
  { role: "scout", slug: "search", title: "Search creators", action: "Search", href: "/scout/desk#search" },
  { role: "scout", slug: "portfolio", title: "Review a portfolio", action: "Open portfolio", href: "/scout/desk#portfolio" },
  { role: "scout", slug: "contact", title: "Contact a creator", action: "Send a message", href: "/scout/desk#contact" },
  { role: "scout", slug: "invite", title: "Invite to an opportunity", action: "Send an invite", href: "/scout/desk#invite" },
  { role: "scout", slug: "saved", title: "Saved candidates", action: "Show saved", href: "/scout/desk#saved" },
  { role: "scout", slug: "responses", title: "Track responses", action: "Show responses", href: "/scout/desk#responses" },
  { role: "moderator", slug: "reports", title: "Reported creative work", action: "Show reports", href: "/moderator/desk#work" },
  { role: "moderator", slug: "nominations", title: "Featured nominations", action: "Show nominations", href: "/moderator/desk#nominations" },
  { role: "moderator", slug: "comments", title: "Comments and GIFs", action: "Show comments", href: "/moderator/desk#comments" },
  { role: "moderator", slug: "users", title: "Reported users", action: "Show reports", href: "/moderator/desk#users" },
  { role: "moderator", slug: "warn", title: "Warn or restrict", action: "Open warnings", href: "/moderator/desk#users" },
  { role: "moderator", slug: "escalate", title: "Escalate", action: "Show cases", href: "/moderator/desk#cases" },
  { role: "administrator", slug: "users", title: "Manage users", action: "Show users", href: "/administrator/desk#accounts" },
  { role: "administrator", slug: "analytics", title: "Analytics and reports", action: "Show reports", href: "/administrator/desk#analytics" },
  { role: "administrator", slug: "applications", title: "Approve specialized accounts", action: "Review applications", href: "/administrator/desk#applications" },
  { role: "administrator", slug: "roles", title: "Roles and permissions", action: "Show roles", href: "/administrator/desk#roles" },
  { role: "administrator", slug: "categories", title: "Creative categories", action: "Show categories", href: "/administrator/desk#categories" },
  { role: "administrator", slug: "settings", title: "Reported activity and settings", action: "Show settings", href: "/administrator/desk#settings" },
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
