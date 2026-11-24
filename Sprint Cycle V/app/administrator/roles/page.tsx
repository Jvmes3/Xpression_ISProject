import { RoleSignIn } from "../../components/RoleSignIn";
import { SprintNote } from "../../components/SprintNote";
import { accountLabel, canUseRole } from "../../lib/access";
import { currentAccount } from "../../lib/session";

export const dynamic = "force-dynamic";

export default async function RolesPage() {
  const account = await currentAccount();
  if (!canUseRole(account, "administrator")) {
    return <RoleSignIn role="administrator" title="Roles" next="/administrator/roles" signedInAs={account ? accountLabel(account) : undefined} />;
  }
  return (
    <main className="page">
      <p className="eyebrow">Administrator</p>
      <h1>Roles and permissions</h1>
      <p className="lede">Moderator and administrator accounts are created in the terminal. Creators, mentors, and talent scouts come from Apply.</p>
      <SprintNote label="role changes" />
    </main>
  );
}
