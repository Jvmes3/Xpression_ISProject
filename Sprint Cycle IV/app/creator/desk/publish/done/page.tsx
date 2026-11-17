import Link from "next/link";
import { readDatabase } from "../../../../lib/store";

export const dynamic = "force-dynamic";

export default async function PublishedPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const { id } = await searchParams;
  const post = readDatabase().posts.find((item) => item.id === id);

  return (
    <main className="page">
      <p className="eyebrow">Creator workspace</p>
      <h1>Published</h1>
      <p className="lede">
        {post ? `${post.title} is on the feed and on your portfolio.` : "Your work is on the feed."}
      </p>
      <p className="task-actions">
        {post ? <Link className="button" href={`/creator/desk/${post.id}`}>Open the work</Link> : null}
        <Link className="button button-quiet" href="/creator/desk">Back to the feed</Link>
      </p>
    </main>
  );
}
