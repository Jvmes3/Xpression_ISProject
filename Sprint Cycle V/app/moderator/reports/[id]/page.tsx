import { notFound, redirect } from "next/navigation";
import { findCase } from "../../../lib/records";

export const dynamic = "force-dynamic";

export default async function ReportCaseRedirect({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const report = await findCase((await params).id);
  if (!report) notFound();
  redirect(`/moderator/cases/${report.case_id}`);
}
