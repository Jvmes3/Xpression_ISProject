import { DiscoverBar } from "./components/DiscoverBar";
import { NotReady } from "./components/NotReady";
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
          Choose a role above to read that role. At the bottom of the role page,
          open that role&apos;s own page. Sign-in is in the dark bar as a screen only.
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
          <NotReady className="button">Open a help ticket</NotReady>
        </p>
      </section>

      <section id="contact" className="panel">
        <h2>Contact</h2>
        <p>Contact our moderator and administrator team.</p>
        <p className="hero-actions">
          <NotReady className="button">Our Moderator Team</NotReady>
          <NotReady className="button button-quiet">Our Admin Team</NotReady>
        </p>
      </section>
    </main>
  );
}
