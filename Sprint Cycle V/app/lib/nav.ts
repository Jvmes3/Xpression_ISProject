export const roles = [
  { href: "/creator", label: "Creator" },
  { href: "/mentor", label: "Mentor" },
  { href: "/scout", label: "Talent Scout" },
  { href: "/moderator", label: "Moderator" },
  { href: "/administrator", label: "Administrator" },
] as const;

export function roleLinks(role: string) {
  if (role === "Creator") {
    return [
      { href: "/creator/desk", label: "Workspace" },
      { href: "/feed", label: "Browse" },
      { href: "/profile", label: "Profile" },
    ];
  }
  if (role === "Creative Mentor") {
    return [
      { href: "/mentor/desk", label: "Workspace" },
      { href: "/mentor/discover", label: "Discover" },
      { href: "/mentor/feedback", label: "Feedback" },
    ];
  }
  if (role === "Talent Scout") {
    return [
      { href: "/scout/desk", label: "Workspace" },
      { href: "/scout/search", label: "Search" },
      { href: "/opportunities", label: "Opportunities" },
    ];
  }
  if (role === "moderator") {
    return [
      { href: "/moderator/desk", label: "Workspace" },
      { href: "/moderator/reports", label: "Reports" },
      { href: "/moderator/tickets", label: "Help tickets" },
    ];
  }
  if (role === "administrator") {
    return [
      { href: "/administrator/desk", label: "Workspace" },
      { href: "/administrator/applications", label: "Applications" },
      { href: "/administrator/accounts", label: "Accounts" },
    ];
  }
  return [];
}

export const menuItems = [
  { href: "/sign-in", label: "Sign in" },
  { href: "/#about", label: "About" },
  { href: "/help", label: "Help" },
  { href: "/#contact", label: "Contact" },
  { href: "/profile", label: "Profile" },
  { href: "/notifications", label: "Notifications" },
  { href: "/messages", label: "Messages" },
] as const;
