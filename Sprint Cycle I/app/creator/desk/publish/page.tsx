import Link from "next/link";
import { NotReady, NotReadyForm } from "../../../components/NotReady";

export const dynamic = "force-dynamic";

export default async function PublishPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <main className="page">
      <p className="eyebrow">Creator workspace</p>
      <h1>Publish work</h1>
      <p className="lede">Post a piece of writing, visual art, or music. A sample link can be left blank.</p>
      <NotReadyForm className="form panel">
        <label>
          Title
          <input name="title" placeholder="Night bus" />
        </label>
        <label>
          Kind of work
          <select name="media" defaultValue="Writing">
            <option>Writing</option>
            <option>Visual art</option>
            <option>Music</option>
          </select>
        </label>
        <label>
          Filter
          <select name="tone" defaultValue="entertaining">
            <option value="entertaining">Entertaining</option>
            <option value="educational">Educational</option>
            <option value="personal">Personal</option>
            <option value="experimental">Experimental</option>
          </select>
        </label>
        <label>
          Description
          <textarea name="description" placeholder="What should people know about this piece?" />
        </label>
        <label>
          Sample page or link (optional)
          <input name="link" placeholder="https://soundcloud.com/you/track" />
        </label>
        {error ? <p className="note">Add a title and a description before publishing.</p> : null}
        <NotReady className="button">Publish</NotReady>
      </NotReadyForm>
      <p className="more">
        <Link href="/creator/desk">Back to the feed</Link>
      </p>
    </main>
  );
}
