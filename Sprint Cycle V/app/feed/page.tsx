import Link from "next/link";
import { DiscoverBar, feedFilters } from "../components/DiscoverBar";
import { ReportMark } from "../components/ReportFlag";
import { reportQueue, reportsPage } from "../lib/access";
import { piecePreview } from "../lib/pieces";
import { listWorks, reportReasonByWork } from "../lib/records";
import { currentAccount } from "../lib/session";

export const dynamic = "force-dynamic";

const mediaNames = ["Writing", "Visual art", "Music"];

export default async function FeedPage({
  searchParams,
}: {
  searchParams: Promise<{ media?: string; q?: string; filter?: string; back?: string }>;
}) {
  const { media = "", q = "", filter = "", back = "" } = await searchParams;
  const selectedMedia = mediaNames.includes(media) ? media : "";
  const selectedFilter = feedFilters.some((item) => item.value === filter) ? filter : "recent";
  const query = q.trim().toLowerCase();
  const posts = await listWorks(selectedMedia, query, selectedFilter === "recent" ? "" : selectedFilter);
  const queue = reportQueue(await currentAccount());
  const reported = queue ? await reportReasonByWork() : {};

  const heading = selectedMedia || "All work";
  const filterLabel = feedFilters.find((item) => item.value === selectedFilter)?.label || "Recent";

  return (
    <main className="page">
      <p className="eyebrow">Feed</p>
      <h1>{heading}</h1>
      <p className="lede">
        {selectedFilter === "recent"
          ? "The newest posts are first."
          : `Showing ${filterLabel.toLowerCase()} posts.`}
      </p>
      <DiscoverBar q={q} media={selectedMedia} filter={selectedFilter === "recent" ? "" : selectedFilter} back={back} allSelected={!selectedMedia} />
      <div className="task-list">
        {posts.length === 0 ? <p>{selectedFilter === "recent" ? "No posts match that search." : `No ${filterLabel.toLowerCase()} posts match.`}</p> : null}
        {posts.map((post) => (
          <article key={post.id} className="panel">
            <p className="flag">{post.media}{post.tone ? ` · ${post.tone}` : ""}{post.featured ? " · Featured" : ""}</p>
            <h2>
              <Link href={`/creator/desk/${post.id}`}>{post.title}</Link>
              {queue && reported[post.id]?.length ? <ReportMark reasons={reported[post.id]} href={reportsPage(queue, "work", post.id)} /> : null}
            </h2>
            <p className="meta-line">{post.creatorId ? <Link href={`/profile/${post.creatorId}`}>{post.creator}</Link> : post.creator}</p>
            <p>{piecePreview(post.id, post.description) || "Open the piece to read it."}</p>
            <p><Link href={`/creator/desk/${post.id}`}>Open work</Link></p>
          </article>
        ))}
      </div>
    </main>
  );
}
