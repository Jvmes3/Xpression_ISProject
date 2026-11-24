import type { ReactNode } from "react";
import { accountLabel, canUseRole } from "../lib/access";
import { currentAccount } from "../lib/session";
import type { TaskNeed } from "../lib/tasks";
import { RoleSignIn } from "./RoleSignIn";

export async function RoleGate({
  role,
  title,
  next,
  children,
}: {
  role: TaskNeed;
  title: string;
  next: string;
  children: ReactNode;
}) {
  const account = await currentAccount();
  if (!canUseRole(account, role)) {
    return (
      <RoleSignIn
        role={role}
        title={title}
        next={next}
        signedInAs={account ? accountLabel(account) : undefined}
      />
    );
  }
  return children;
}
