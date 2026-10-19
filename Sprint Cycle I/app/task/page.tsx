import { redirect } from "next/navigation";
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
  redirect(item.href);
}
