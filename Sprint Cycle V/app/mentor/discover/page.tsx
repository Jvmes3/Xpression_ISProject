import Link from "next/link";
import { DiscoverBar, feedFilters } from "../../components/DiscoverBar";
import { RoleSignIn } from "../../components/RoleSignIn";
import { accountLabel, canUseRole } from "../../lib/access";
import { piecePreview } from "../../lib/pieces";
import { listWorks } from "../../lib/records";
import { currentAccount } from "../../lib/session";

export const dynamic = "force-dynamic";

const mediaNames = ["Writing", "Visual art", "Music"];

export default async function MentorDiscoverPage({
  searchParams,
}: {
  searchParams: Promise<{ media?: string; q?: string; filter?: string; back?: string }>;
}) {
  const account = await currentAccount();
  if (!canUseRole(account, "mentor")) {
    return (
      <RoleSignIn
        role="mentor"
        title="Discover work"
        next="/mentor/discover"
        signedInAs={account ? accountLabel(account) : undefined}
      />
    );
  }

  const { media = "", q = "", filter = "", back = "" } = await searchParams;
  const selectedMedia = mediaNames.includes(media) ? media : "";
  const selectedFilter = feedFilters.some((item) => item.value === filter) ? filter : "recent";
  const posts = await listWorks(selectedMedia, q.trim().toLowerCase(), selectedFilter === "recent" ? "" : selectedFilter);
  const heading = selectedMedia || "All work";

  return (
    <main className="page">
      <p className="eyebrow">Creative Mentor</p>
      <h1>{heading}</h1>
      <p className="lede">Search from the top of the page, then open a piece and leave structured feedback on it.</p>
      <DiscoverBar
        path="/mentor/discover"
        q={q}
        media={selectedMedia}
        filter={selectedFilter === "recent" ? "" : selectedFilter}
        back={back || "/mentor/desk"}
        allSelected={!selectedMedia}
      />
      <div className="task-list">
        {posts.length === 0 ? <p>{selectedFilter === "recent" ? "No posts match that search." : `No ${feedFilters.find((item) => item.value === selectedFilter)?.label.toLowerCase()} posts match.`}</p> : null}
        {posts.map((post) => (
          <article key={post.id} className="panel">
            <p className="flag">{post.media}{post.tone ? ` · ${post.tone}` : ""}{post.featured ? " · Featured" : ""}</p>
            <h2><Link href={`/creator/desk/${post.id}?talk=feedbacks`}>{post.title}</Link></h2>
            <p className="meta-line">{post.creatorId ? <Link href={`/profile/${post.creatorId}`}>{post.creator}</Link> : post.creator}</p>
            <p>{piecePreview(post.id, post.description) || "Open the piece to read it."}</p>
            <p><Link className="button" href={`/creator/desk/${post.id}?talk=feedbacks`}>Open feedback</Link></p>
          </article>
        ))}
      </div>
    </main>
  );
}
