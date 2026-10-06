import Link from "next/link";
import { notFound } from "next/navigation";
import { readDatabase } from "../../../lib/store";

export const dynamic = "force-dynamic";

export default async function WorkDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ notice?: string }>;
}) {
  const { id } = await params;
  const { notice } = await searchParams;
  const post = readDatabase().posts.find((item) => item.id === id && item.status !== "removed");
  if (!post) notFound();

  return (
    <main className="page">
      <p className="eyebrow">{post.media}</p>
      <h1>{post.title}</h1>
      <p className="meta-line">{post.creator}</p>
      <p className="lede">{post.description || "This piece is on the Xpression feed."}</p>
      {post.link ? <p><a href={post.link}>{post.link}</a></p> : null}
      <section className="panel">
        <h2>Comments</h2>
        <p>Luis Ortega: The opening line stays with me.</p>
        <p>Nia Brooks: I would hear this with a quieter second verse.</p>
        {notice ? <p className="note">That button is a placeholder. It will do more in a later sprint.</p> : null}
        <p className="task-actions">
          <Link className="button" href={`/creator/desk/${post.id}?notice=reply`}>Reply</Link>
          <Link className="button button-quiet" href={`/creator/desk/${post.id}?notice=save`}>Save</Link>
          <Link className="button button-quiet" href={`/creator/desk/${post.id}?notice=follow`}>Follow {post.creator}</Link>
        </p>
      </section>
      <p className="more">
        <Link href="/creator/desk">Back to the feed</Link>
      </p>
    </main>
  );
}
