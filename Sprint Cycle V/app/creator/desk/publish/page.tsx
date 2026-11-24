import Link from "next/link";
import { currentAccount } from "../../../lib/session";
import { PublishForm } from "./PublishForm";

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
      <p className="lede">Choose Entertaining, Educational, Personal, or Experimental. Writing needs a description or a document. Visual art needs a picture. Music needs a link.</p>
      <PublishForm error={error} />
      <p className="more">
        <Link href="/creator/desk">Back to the feed</Link>
      </p>
    </main>
  );
}
