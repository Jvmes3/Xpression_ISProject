import Link from "next/link";
import { RoleSignIn } from "../../components/RoleSignIn";
import { SprintNote } from "../../components/SprintNote";
import { accountLabel, canUseRole } from "../../lib/access";
import { currentAccount } from "../../lib/session";

export const dynamic = "force-dynamic";

export default async function ContactCreatorPage() {
  const account = await currentAccount();
  if (!canUseRole(account, "scout")) {
    return (
      <RoleSignIn role="scout" title="Contact a creator" next="/scout/contact" signedInAs={account ? accountLabel(account) : undefined} />
    );
  }

  return (
    <main className="page">
      <p className="eyebrow">Talent Scout</p>
      <h1>Contact a creator</h1>
      <p className="lede">A private note about a commission or collaboration.</p>
      <form className="form panel">
        <label>
          Message
          <textarea name="message" disabled placeholder="What you want to talk about." />
        </label>
        <button className="button" type="button" disabled>Send message</button>
      </form>
      <SprintNote label="messages" />
      <p className="more"><Link href="/scout">Back to talent scout</Link></p>
    </main>
  );
}
