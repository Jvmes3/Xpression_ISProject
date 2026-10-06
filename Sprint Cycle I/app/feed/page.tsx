import Link from "next/link";
import { DiscoverBar, feedFilters } from "../components/DiscoverBar";
import { LaterSprint } from "../components/LaterSprint";
import { hasSprintData, readDatabase } from "../lib/store";

export const dynamic = "force-dynamic";

const mediaNames = ["Writing", "Visual art", "Music"];

export default async function FeedPage({
  searchParams,
}: {
  searchParams: Promise<{ media?: string; q?: string; filter?: string }>;
}) {
  if (!hasSprintData()) return <LaterSprint title="Explore creative work" />;

  const { media = "", q = "", filter = "" } = await searchParams;
  const selectedMedia = mediaNames.includes(media) ? media : "";
  const selectedFilter = feedFilters.some((item) => item.value === filter) ? filter : "recent";
  const query = q.trim().toLowerCase();
  const posts = readDatabase()
    .posts.filter((post) => post.status === "visible")
    .filter((post) => !selectedMedia || post.media === selectedMedia)
    .filter((post) => !query || post.title.toLowerCase().includes(query))
    .filter((post) => selectedFilter === "recent" || post.tone === selectedFilter)
    .sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""));

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
      <DiscoverBar q={q} media={selectedMedia} filter={selectedFilter === "recent" ? "" : selectedFilter} />
      <div className="task-list">
        {posts.length === 0 ? <p>No posts match that search.</p> : null}
        {posts.map((post) => (
          <article key={post.id} className="panel">
            <p className="flag">{post.media}{post.tone ? ` · ${post.tone}` : ""}</p>
            <h2>{post.title}</h2>
            <p className="meta-line">{post.creator}</p>
            <p>{post.description || "Open the piece to read it."}</p>
            <p><Link href={`/creator/desk/${post.id}`}>Open work</Link></p>
          </article>
        ))}
      </div>
    </main>
  );
}
