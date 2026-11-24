import { redirect } from "next/navigation";

export default async function PublicPortfolioRedirect({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { id } = await params;
  const query = await searchParams;
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (typeof value === "string") search.set(key, value);
  }
  const suffix = search.toString();
  redirect(suffix ? `/profile/${id}?${suffix}` : `/profile/${id}`);
}
