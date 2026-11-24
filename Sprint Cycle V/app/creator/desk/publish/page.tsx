import Link from "next/link";
import { SampleLinkField } from "../../../components/SampleLinkField";
import { publishWork } from "../../../lib/actions";
import { currentAccount } from "../../../lib/session";

export const dynamic = "force-dynamic";

export default async function PublishPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const account = await currentAccount();
  const isCreator = account?.status === "active" && account.role === "applicant" && account.application?.status === "approved" && account.application.role === "Creator";
  if (!isCreator) {
    return (
      <main className="page">
        <p className="eyebrow">Creator</p>
        <h1>Publish work</h1>
        <p className="lede">Sign in with a Creator account to publish.</p>
        <p><Link className="button" href="/sign-in?returnTo=%2Fcreator%2Fdesk%2Fpublish">Sign in</Link></p>
      </main>
    );
  }

  return (
    <main className="page">
      <p className="eyebrow">Creator workspace</p>
      <h1>Publish work</h1>
      <p className="lede">Post a piece of writing, visual art, or music. A sample link can be left blank.</p>
      <form className="form panel" action={publishWork}>
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
          Description
          <textarea name="description" placeholder="What should people know about this piece?" />
        </label>
        <SampleLinkField
          label="Sample page or link (optional)"
          name="link"
          placeholder="https://soundcloud.com/you/track"
        />
        {error === "required" ? <p className="note">Add a title and a description before publishing.</p> : null}
        {error === "music" ? <p className="note">A music piece needs a sample link before it can be saved.</p> : null}
        {error === "account" ? <p className="note">This sign-in is not a Creator row in the database. Approve a creator application, then sign in with the role email.</p> : null}
        <button className="button" type="submit">Publish</button>
      </form>
      <p className="more">
        <Link href="/creator/desk">Back to the feed</Link>
      </p>
    </main>
  );
}
