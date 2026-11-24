import { RoleSignIn } from "../../components/RoleSignIn";
import { SprintNote } from "../../components/SprintNote";
import { accountLabel, canUseRole } from "../../lib/access";
import { currentAccount } from "../../lib/session";

export const dynamic = "force-dynamic";

export default async function CategoriesPage() {
  const account = await currentAccount();
  if (!canUseRole(account, "administrator")) {
    return <RoleSignIn role="administrator" title="Categories" next="/administrator/categories" signedInAs={account ? accountLabel(account) : undefined} />;
  }
  return (
    <main className="page">
      <p className="eyebrow">Administrator</p>
      <h1>Creative categories</h1>
      <p className="lede">Writing, visual art, and music stay available. Add another category, rename one, or mark it inactive.</p>
      <SprintNote label="category changes" />
      <form className="task-actions">
        <label>
          New category
          <input name="name" disabled placeholder="For example, film or performance" />
        </label>
        <button className="button" type="button" disabled>Add category</button>
      </form>
    </main>
  );
}
