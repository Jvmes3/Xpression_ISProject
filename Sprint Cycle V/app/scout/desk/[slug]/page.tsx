import { redirect } from "next/navigation";

export default async function ScoutPortfolioRedirect({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (!/^\d+$/.test(slug)) redirect("/scout/desk");
  redirect(`/profile/${slug}`);
}
