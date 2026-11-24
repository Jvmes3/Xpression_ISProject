import { RoleSignIn } from "../components/RoleSignIn";
import { accountLabel, canUseRole } from "./access";
import { currentAccount } from "./session";
import type { Account } from "./store";
import type { TaskNeed } from "./tasks";

export async function denyUnless(role: TaskNeed, title: string, next: string) {
  const account = await currentAccount();
  if (!canUseRole(account, role)) {
    return {
      account,
      block: (
        <RoleSignIn
          role={role}
          title={title}
          next={next}
          signedInAs={account ? accountLabel(account) : undefined}
        />
      ),
    };
  }
  return { account: account as Account, block: null };
}
