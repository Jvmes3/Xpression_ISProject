import Link from "next/link";
import { ReportMark } from "../../components/ReportFlag";
import { RoleSignIn } from "../../components/RoleSignIn";
import { SprintNote } from "../../components/SprintNote";
import { accountLabel, canUseRole, reportsPage } from "../../lib/access";
import { listWorks, reportReasonByWork } from "../../lib/records";
import { currentAccount } from "../../lib/session";
export const dynamic = "force-dynamic";
export default async function ContentPage() {
    const account = await currentAccount();
    if (!canUseRole(account, "administrator")) {
        return <RoleSignIn role="administrator" title="Content" next="/administrator/content" signedInAs={account ? accountLabel(account) : undefined}/>;
    }
    const works = await listWorks();
    const reported = await reportReasonByWork();
    return (<main className="page">
 <p className="eyebrow">Administrator</p>
 <h1>Platform content</h1>
 <p className="lede">Posts currently on the feed. Showing, hiding, or removing one from this office is still ahead. A moderator can hide or remove a reported piece from Reported work.</p>  <div className="task-list">
 {works.map((work) => (<article key={work.id} className="panel">
 <p className="flag">{work.media}{work.featured ? " · Featured" : ""}</p>  <h2>
 <Link href={`/creator/desk/${work.id}`}>{work.title}</Link>
 {reported[work.id]?.length ? <ReportMark reasons={reported[work.id]} href={reportsPage("administrator", "work", work.id)}/> : null}
 </h2>
 <p className="meta-line">{work.creator}</p>
 <div className="task-actions">
 <button className="button" type="button" disabled>Show</button>
 <button className="button button-quiet" type="button" disabled>Hide</button>  <button className="button button-quiet" type="button" disabled>Remove</button>  </div>
 </article>))}
 </div>
 <SprintNote label="showing, hiding, or removing a post from this page"/>  </main>);
}
