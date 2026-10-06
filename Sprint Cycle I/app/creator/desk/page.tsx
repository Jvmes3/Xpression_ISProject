import Link from "next/link";
import { RoleSignIn } from "../../components/RoleSignIn";
import { SprintNote } from "../../components/SprintNote";
import { accountLabel, canUseRole } from "../../lib/access";
import { currentAccount } from "../../lib/session";
import { readDatabase } from "../../lib/store";

export const dynamic = "force-dynamic";

const MEDIA = ["Writing", "Visual art", "Music"];

export default async function CreatorDeskPage({
  searchParams,
}: {
  searchParams: Promise<{ media?: string }>;
}) {
  const account = await currentAccount();
  if (!canUseRole(account, "creator")) {
    return (
      <RoleSignIn
        role="creator"
        title="Creator workspace"
        next="/creator/desk"
        signedInAs={account ? accountLabel(account) : undefined}
      />
    );
  }

  const { media } = await searchParams;
  const selected = MEDIA.includes(media || "") ? media || "" : "";
  const posts = readDatabase().posts.filter(
    (post) => post.status === "visible" && (!selected || post.media === selected),
  );

  return (
    <main className="page">
      <p className="eyebrow">Creator workspace</p>
      <h1>Explore creative work</h1>
      <p className="lede">Browse writing, visual art, and music, then open a piece.</p>
      <nav className="desk-nav" aria-label="Creator tasks">
        <a href="/creator/desk">All</a>
        {MEDIA.map((item) => (
          <a key={item} href={`/creator/desk?media=${encodeURIComponent(item)}`}>{item}</a>
        ))}
        <a href="/creator/desk/publish">Publish work</a>
        <a href="#portfolio">Portfolio</a>
        <a href="#feedback">Feedback</a>
        <a href="#saved">Saved</a>
        <a href="#messages">Messages</a>
      </nav>
      <div className="task-list">
        {posts.length === 0 ? <p>No work in this filter yet.</p> : null}
        {posts.map((post) => (
          <article key={post.id} className="panel">
            <p className="flag">{post.media}</p>
            <h2>{post.title}</h2>
            <p className="meta-line">{post.creator}</p>
            <p>{post.description || "Open the piece to read the work and the comments."}</p>
            <p><Link href={`/creator/desk/${post.id}`}>Open work</Link></p>
          </article>
        ))}
      </div>

      <section id="portfolio" className="panel">
        <h2>My portfolio</h2>
        <p>Feature, archive, edit, or remove work on your profile.</p>
        <SprintNote label="portfolio tools" />
      </section>
      <section id="feedback" className="panel">
        <h2>Feedback on my work</h2>
        <p>Read comments and mentor reviews, then respond.</p>
        <SprintNote label="feedback" />
      </section>
      <section id="saved" className="panel">
        <h2>Following and saved</h2>
        <p>Return to creators you follow and works you bookmarked.</p>
        <SprintNote label="saved work" />
      </section>
      <section id="messages" className="panel">
        <h2>Messages and reports</h2>
        <p>Read messages and report content that should be reviewed.</p>
        <SprintNote label="messages" />
      </section>
    </main>
  );
}
