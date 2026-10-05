import Link from "next/link";
import { DiscoverBar } from "./components/DiscoverBar";
import { currentAccount } from "./lib/session";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const account = await currentAccount();
  return (
    <main className="page">
      <DiscoverBar />
      <h1>A home for creative work.</h1>
      <p className="lede">
        Publish writing, visual art, and music in one place. Discover what
        other people are making, give constructive feedback, and keep a
        portfolio of your own work.
      </p>
      {account ? (
        <p className="lede">
          You are signed in. Your name stays in the dark bar, and the links under the title return to your pages.
        </p>
      ) : (
        <p className="lede">
          Choose a role above to open that role&apos;s home. Apply is for a new
          Creator, Mentor, or Talent Scout account. Sign in is in the dark bar.
        </p>
      )}

      <section className="band" aria-label="Creative media">
        <article>
          <h2>Writing</h2>
          <p>Poems, essays, stories, and drafts that stay with the creator&apos;s portfolio.</p>
        </article>
        <article>
          <h2>Visual art</h2>
          <p>Studies, illustrations, and finished pieces shared for response, not just display.</p>
        </article>
        <article>
          <h2>Music</h2>
          <p>Tracks that can point to a SoundCloud permalink and play as embedded audio.</p>
        </article>
      </section>

      <section id="about" className="panel">
        <h2>About</h2>
        <p>
          Xpression is a community for writing, visual art, and music. Members
          publish work, ask for feedback, and keep a portfolio.
        </p>
      </section>

      <section id="help" className="panel">
        <h2>Help</h2>
        <p>
          If something on the site is in your way, send a ticket with a title
          and a description. You can come back with the same email to see
          whether a moderator replied, resolved it, or set it aside.
        </p>
        <p>
          <Link className="button" href="/help">Open a help ticket</Link>
        </p>
      </section>

      <section id="contact" className="panel">
        <h2>Contact</h2>
        <p>Contact our moderator and administrator team.</p>
        <p className="hero-actions">
          <Link className="button" href="/moderator#team">Our Moderator Team</Link>
          <Link className="button button-quiet" href="/administrator#team">Our Admin Team</Link>
        </p>
      </section>
    </main>
  );
}
