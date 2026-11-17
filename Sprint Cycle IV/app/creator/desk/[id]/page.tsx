import Link from "next/link";
import { notFound } from "next/navigation";
import { CommentThread } from "../../../components/CommentThread";
import { PieceBody } from "../../../components/PieceBody";
import { pieceFor } from "../../../lib/pieces";
import { findWork, listComments } from "../../../lib/records";
import { currentAccount } from "../../../lib/session";
import { formatWhen } from "../../../lib/when";

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
  const post = await findWork(id);
  if (!post) notFound();
  const piece = pieceFor(post.id);
  const comments = await listComments(id);
  const account = await currentAccount();

  return (
    <main className="page">
      <article className="piece">
        <p className="flag">{post.media}{post.featured ? " · Featured" : ""}</p>
        <h1>{post.title}</h1>
        <p className="meta-line">{post.creator}{post.publishedAt ? ` · ${formatWhen(post.publishedAt)}` : ""}</p>
        {piece ? <PieceBody piece={piece} /> : <p>{post.description}</p>}
        {post.link ? <p><a href={post.link}>{post.link}</a></p> : null}
      </article>
      <CommentThread
        workId={post.id}
        comments={comments}
        canComment={Boolean(account && account.status === "active")}
        notice={notice}
        creator={post.creator}
      />
      <p className="more">
        <Link href="/creator/desk">Back to the feed</Link>
      </p>
    </main>
  );
}
