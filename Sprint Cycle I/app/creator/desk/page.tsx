import { NotReady } from "../../components/NotReady";
import { SprintNote } from "../../components/SprintNote";

export const dynamic = "force-dynamic";

export default function CreatorDeskPage() {
  return (
    <main className="page">
      <p className="eyebrow">Creator workspace</p>
      <h1>Creator desk</h1>
      <p className="lede">Publish a piece, manage it on your portfolio, and read feedback written on your work.</p>
      <nav className="desk-nav" aria-label="Creator tasks">
        <a href="#publish">Publish work</a>
        <a href="#portfolio">My portfolio</a>
        <a href="#feedback">Feedback on my work</a>
      </nav>

      <section id="publish" className="panel">
        <h2>Publish work</h2>
        <p>Post writing, an image, or a music piece. Music includes a SoundCloud link.</p>
        <form className="form">
          <label>
            Title
            <input name="title" disabled placeholder="Name of the piece" />
          </label>
          <label>
            Media
            <select name="media" disabled defaultValue="Writing">
              <option>Writing</option>
              <option>Visual art</option>
              <option>Music</option>
            </select>
          </label>
          <label>
            Description
            <textarea name="description" disabled placeholder="What this piece is." />
          </label>
          <label>
            SoundCloud link
            <input name="soundcloud" disabled placeholder="Only for music" />
          </label>
          <NotReady className="button">Publish</NotReady>
        </form>
      </section>

      <section id="portfolio" className="panel">
        <h2>My portfolio</h2>
        <p>Feature a piece on your profile, archive it, edit it, or remove it.</p>
        <SprintNote label="portfolio pieces" />
        <form className="task-actions">
          <NotReady className="button">Feature</NotReady>
          <NotReady className="button button-quiet">Archive</NotReady>
          <NotReady className="button button-quiet">Edit</NotReady>
          <NotReady className="button button-quiet">Remove</NotReady>
        </form>
      </section>

      <section id="feedback" className="panel">
        <h2>Feedback on my work</h2>
        <p>Read the strengths, improvements, and recommendation a mentor wrote, then reply.</p>
        <SprintNote label="mentor reviews" />
        <form className="form">
          <label>
            Reply
            <textarea name="reply" disabled placeholder="Your response to the review." />
          </label>
          <NotReady className="button">Send reply</NotReady>
        </form>
      </section>
    </main>
  );
}
