import type { Account } from "./store";
import type { TaskNeed } from "./tasks";

export function canUseRole(account: Account | null, role: TaskNeed) {
  if (!account || account.status !== "active") return false;
  if (role === "moderator") return account.role === "moderator";
  if (role === "administrator") return account.role === "administrator";
  if (account.role !== "applicant" || account.application?.status !== "approved") return false;
  if (role === "creator") return account.application.role === "Creator";
  if (role === "mentor") return account.application.role === "Creative Mentor";
  return account.application.role === "Talent Scout";
}

export function accountLabel(account: Account) {
  return account.application?.name?.trim() || account.displayName?.trim() || account.email;
}
