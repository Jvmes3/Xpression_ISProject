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
      { href: "/creator/desk", label: "Explore" },
      { href: "/creator/desk/publish", label: "Publish" },
    ];
  }
  if (role === "Creative Mentor") {
    return [
      { href: "/mentor/desk", label: "Requests" },
      { href: "/mentor/desk/req-1/feedback", label: "Feedback" },
    ];
  }
  if (role === "Talent Scout") {
    return [
      { href: "/scout/desk", label: "Search" },
      { href: "/scout/desk/luis-ortega", label: "Portfolios" },
    ];
  }
  if (role === "moderator") {
    return [
      { href: "/moderator/desk", label: "Your desk" },
      { href: "/moderator/desk#work", label: "Reports" },
      { href: "/moderator/desk#users", label: "Users" },
      { href: "/moderator/desk#nominations", label: "Nominations" },
      { href: "/moderator/desk#tickets", label: "Help tickets" },
    ];
  }
  if (role === "administrator") {
    return [
      { href: "/administrator/desk", label: "Your desk" },
      { href: "/administrator/desk#applications", label: "Applications" },
      { href: "/administrator/desk#accounts", label: "Accounts" },
      { href: "/administrator/desk#content", label: "Content" },
    ];
  }
  return [];
}

export const menuItems = [
  { href: "/sign-in", label: "Sign in", later: false },
  { href: "/#about", label: "About", later: false },
  { href: "/help", label: "Help", later: true },
  { href: "/#contact", label: "Contact", later: false },
  { href: "/profile", label: "Profile", later: true },
  { href: "/notifications", label: "Notifications", later: true },
  { href: "/messages", label: "Messages", later: true },
] as const;
