import Link from "next/link";
import { notFound } from "next/navigation";
import { CommentThread } from "../../../components/CommentThread";
import { PieceBody } from "../../../components/PieceBody";
import { FlagLink, ReportFlag, ReportMark } from "../../../components/ReportFlag";
import { canUseRole, reportQueue, reportsPage } from "../../../lib/access";
import { toggleSavedWork } from "../../../lib/actions";
import { pieceFor } from "../../../lib/pieces";
import { findWork, isWorkSaved, listComments, reportsForWork } from "../../../lib/records";
import { currentAccount } from "../../../lib/session";
import { accountForSession } from "../../../lib/writes";
import { formatWhen } from "../../../lib/when";

export const dynamic = "force-dynamic";

export default async function WorkDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ notice?: string; review?: string; talk?: string }>;
}) {
  const { id } = await params;
  const { notice, review, talk: rawTalk } = await searchParams;
  const talk = rawTalk === "feedbacks" ? "feedbacks" : "comments";
  const account = await currentAccount();
  const mentor = canUseRole(account, "mentor");
  const moderator = canUseRole(account, "moderator");
  const queue = reportQueue(account);
  const post = await findWork(id, { includeArchived: moderator });
  if (!post) notFound();
  const piece = pieceFor(post.id);
  const viewer = account && account.status === "active" ? await accountForSession(account) : null;
  const savedPost = viewer ? await isWorkSaved(viewer.account_id, id) : false;
  const comments = (await listComments(id, talk)).map((comment) => (
    queue ? comment : { ...comment, reportReasons: [] }
  ));
  const reports = queue ? await reportsForWork(id) : [];
  const openReport = reports.find((item) => item.caseId && item.status !== "closed")
    || reports.find((item) => item.caseId)
    || reports[0];
  const canComment = Boolean(account && account.status === "active");
  const ownPost = Boolean(viewer && Number(post.creatorId) === viewer.account_id);
  const signIn = `/sign-in?returnTo=${encodeURIComponent(`/creator/desk/${post.id}`)}`;
  const decisionHref = (action: string) => {
    const query = `action=${encodeURIComponent(action)}`;
    if (openReport?.caseId) return `/moderator/cases/${openReport.caseId}?${query}`;
    if (openReport) return `/moderator/cases/new?report=${openReport.reportId}&${query}`;
    return `/moderator/cases/new?work=${post.id}&${query}`;
  };

  return (
    <main className="page">
      <article className="piece">
        <p className="flag">{post.media}{post.tone ? ` · ${post.tone}` : ""}{post.featured ? " · Featured" : ""}</p>
        <div className="portfolio-name-row">
          <h1>
            {post.title}
            {queue && reports.length > 0 ? (
              <ReportMark reasons={reports.map((item) => item.reason)} href={reportsPage(queue, "work", post.id)} />
            ) : null}
          </h1>
          <div className="piece-tools">
            {viewer ? (
              <form action={toggleSavedWork}>
                <input type="hidden" name="workId" value={post.id} />
                <button className="button button-quiet" type="submit">{savedPost ? "Saved" : "Save"}</button>
              </form>
            ) : (
              <Link className="button button-quiet" href={signIn}>Save</Link>
            )}
            {viewer && !ownPost ? <ReportFlag workId={post.id} talk={talk} /> : null}
            {!viewer ? <FlagLink href={signIn} label="Report this post" /> : null}
          </div>
        </div>
        <p className="meta-line">{post.creator}{post.publishedAt ? ` · ${formatWhen(post.publishedAt)}` : ""}</p>
        {piece ? <PieceBody piece={piece} /> : <p>{post.description}</p>}
        {post.link ? <p><a href={post.link}>{post.link}</a></p> : null}
      </article>
      {talk === "feedbacks" && review === "edited" ? <p className="note">Your feedback is updated.</p> : null}
      {talk === "feedbacks" && review === "unsent" ? <p className="note">That feedback is removed.</p> : null}
      {review === "reported" ? <p className="note">The report is in. A moderator can review it.</p> : null}
      {review === "removed" ? <p className="note">That comment is removed.</p> : null}
      {moderator ? (
        <section className="mod-bar" aria-label="Moderator actions">
          <div className="task-actions">
            <Link className="button button-quiet" href={decisionHref("removed")}>Remove</Link>
            <Link className="button button-quiet" href={decisionHref("hidden")}>Hide</Link>
            <Link className="button button-quiet" href={decisionHref("kept available")}>Keep</Link>
            <Link className="button button-quiet" href={post.creatorId ? `/moderator/users?account=${post.creatorId}` : "/moderator/users"}>Warn</Link>
          </div>
        </section>
      ) : null}
      <nav className="talk-switch media-links" aria-label="Under this post">
        <a href={`/creator/desk/${post.id}`} aria-current={talk === "comments" ? "page" : undefined}>Comments</a>
        <a href={`/creator/desk/${post.id}?talk=feedbacks`} aria-current={talk === "feedbacks" ? "page" : undefined}>Feedbacks</a>
      </nav>
      <CommentThread
        workId={post.id}
        comments={comments}
        canComment={canComment}
        notice={notice}
        creator={post.creator}
        showHeading={false}
        talk={talk}
        allowRoot={talk === "comments" || mentor}
        saved={talk === "feedbacks" && review === "saved"}
        viewerId={viewer?.account_id || 0}
        moderator={moderator}
        reportQueue={queue}
      />
      <p className="more">
        {mentor ? <Link href="/mentor/discover">Back to discover</Link> : null}
        {moderator ? <Link href="/moderator/reports">Back to reported work</Link> : null}
        {!mentor && !moderator ? <Link href="/feed">Back to the feed</Link> : null}
      </p>
    </main>
  );
}
