import Link from "next/link";
import { notFound } from "next/navigation";
import { NotReady } from "../../../components/NotReady";
import { readDatabase } from "../../../lib/store";

export const dynamic = "force-dynamic";

export default async function WorkDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
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
        <p className="task-actions">
          <NotReady className="button">Reply</NotReady>
          <NotReady className="button button-quiet">Save</NotReady>
          <NotReady className="button button-quiet">Follow {post.creator}</NotReady>
        </p>
      </section>
      <p className="more">
        <Link href="/creator/desk">Back to the feed</Link>
      </p>
    </main>
  );
}
