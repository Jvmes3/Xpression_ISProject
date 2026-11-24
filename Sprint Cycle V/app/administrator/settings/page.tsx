import { RoleSignIn } from "../../components/RoleSignIn";
import { SprintNote } from "../../components/SprintNote";
import { accountLabel, canUseRole } from "../../lib/access";
import { currentAccount } from "../../lib/session";
export const dynamic = "force-dynamic";
export default async function SettingsPage() {
    const account = await currentAccount();
    if (!canUseRole(account, "administrator")) {
        return <RoleSignIn role="administrator" title="Settings" next="/administrator/settings" signedInAs={account ? accountLabel(account) : undefined}/>;
    }
    return (<main className="page">
 <p className="eyebrow">Administrator</p>
 <h1>System configuration</h1>
 <p className="lede">Comments, GIFs, uploads, and the moderation rule.</p>
 <SprintNote label="settings changes"/>
 <form className="form panel">
 <label>
 Comments
 <select name="commentsOpen" disabled defaultValue="yes">
 <option value="yes">Open</option>
 <option value="no">Closed</option>
 </select>
 </label>
 <label>
 GIFs on comments
 <select name="gifsAllowed" disabled defaultValue="yes">
 <option value="yes">Allowed</option>
 <option value="no">Not allowed</option>
 </select>
 </label>
 <label>
 Upload note
 <textarea name="uploadNote" disabled placeholder="What members should know before uploading."/>
 </label>
 <label>
 Moderation rule
 <textarea name="moderationRule" disabled placeholder="How reported work is handled."/>  </label>
 <button className="button" type="button" disabled>Save settings</button>  </form>
 </main>);
}
