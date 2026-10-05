import { redirect } from "next/navigation";
import { RoleSignIn } from "../components/RoleSignIn";
import { accountLabel, canUseRole } from "../lib/access";
import { currentAccount } from "../lib/session";
import { findTask } from "../lib/tasks";

export const dynamic = "force-dynamic";

export default async function TaskPage({
  searchParams,
}: {
  searchParams: Promise<{ role?: string; task?: string }>;
}) {
  const { role = "", task = "" } = await searchParams;
  const item = findTask(role, task);
  if (!item) redirect("/");

  const account = await currentAccount();
  if (canUseRole(account, item.role)) redirect(item.href);

  const next = `/task?role=${item.role}&task=${item.slug}`;
  return (
    <RoleSignIn
      role={item.role}
      title={item.title}
      next={next}
      signedInAs={account ? accountLabel(account) : undefined}
    />
  );
}
