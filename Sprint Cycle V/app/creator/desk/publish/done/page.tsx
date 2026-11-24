import Link from "next/link";
import { findWork } from "../../../../lib/records";

export const dynamic = "force-dynamic";

export default async function PublishedPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const { id } = await searchParams;
  const post = id ? await findWork(id) : null;

  return (
    <main className="page">
      <p className="eyebrow">Creator workspace</p>
      <h1>Published</h1>
      <p className="lede">
        {post
          ? `${post.title} by ${post.creator} is stored in creative_work and is on the feed.`
          : "That piece is not on the feed."}
      </p>
      <p className="task-actions">
        {post ? <Link className="button" href={`/creator/desk/${post.id}`}>Open the work</Link> : null}
        <Link className="button button-quiet" href="/creator/desk">Back to the feed</Link>
      </p>
    </main>
  );
}
