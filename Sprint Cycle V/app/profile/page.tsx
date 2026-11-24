import Link from "next/link";
import { PortfolioView } from "../components/PortfolioView";
import { ProfileTools } from "../components/ProfileTools";
import { canUseRole } from "../lib/access";
import { roleHome } from "../lib/application";
import { creatorPortfolio } from "../lib/records";
import { currentAccount } from "../lib/session";
import { accountForSession, readAccountByEmail, readCreatorProfile } from "../lib/writes";

export const dynamic = "force-dynamic";

export default async function ProfilePage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string; media?: string; saved?: string }>;
}) {
  const account = await currentAccount();
  if (!account) {
    return (
      <main className="page">
        <h1>Profile</h1>
        <p className="lede">Sign in to see the account you are using.</p>
        <p><Link className="button" href="/sign-in?returnTo=%2Fprofile">Sign in</Link></p>
      </main>
    );
  }

  const params = await searchParams;
  const name = account.application?.name?.trim() || account.displayName?.trim() || account.email;
  const approved = account.application?.status === "approved" ? account.application.role : "";
  const roleLabel =
    account.role === "moderator"
      ? "Moderator"
      : account.role === "administrator"
        ? "Administrator"
        : approved || account.application?.role || "Applicant";
  const record = await accountForSession(account);
  const creator = canUseRole(account, "creator") ? await accountForSession(account, "Creator") : null;
  const portfolio = creator ? await creatorPortfolio(String(creator.account_id)) : null;

  if (creator && portfolio) {
    const tab = params.tab === "about" || params.tab === "followers" || params.tab === "following" ? params.tab : "work";
    const profile = await readCreatorProfile(creator.account_id);
    const bio = profile?.bio?.trim() || account.application?.reason?.trim() || account.application?.experience?.trim() || "";
    return (
      <PortfolioView
        name={profile?.name || portfolio.person.name}
        initial={(profile?.name || portfolio.person.name).slice(0, 1).toUpperCase()}
        discipline={profile?.discipline || portfolio.person.discipline || account.application?.areas?.[0]?.label || ""}
        bio={bio}
        website={profile?.website_url || ""}
        music={profile?.music_url || ""}
        practices={profile?.practices || ""}
        photoUrl={profile?.avatar_url || ""}
        openToCommissions={profile ? Boolean(profile.open_to_commissions) : Boolean(portfolio.person.open_to_commissions)}
        status={portfolio.person.status}
        works={portfolio.works}
        creatorId={String(creator.account_id)}
        mine
        tab={tab}
        media={params.media || ""}
        saved={params.saved === "1"}
      />
    );
  }

  const profile = record ? await readAccountByEmail(record.email) : null;
  const shownName = profile?.name || name;
  const bio = profile?.bio?.trim() || account.application?.reason?.trim() || account.application?.experience?.trim() || "No bio yet.";
  const workspace =
    account.role === "moderator"
      ? "/moderator/desk"
      : account.role === "administrator"
        ? "/administrator/desk"
        : approved
          ? roleHome(approved)
          : "/account";

  return (
    <main className="page">
      <section className="portfolio-head">
        <div className="portfolio-avatar" aria-hidden="true">
          {profile?.avatar_url ? <img src={profile.avatar_url} alt="" /> : shownName.slice(0, 1).toUpperCase()}
        </div>
        <div className="portfolio-id">
          <p className="eyebrow">Profile</p>
          <div className="portfolio-name-row">
            <h1>{shownName}</h1>
            <ProfileTools editHref="/profile/edit" />
          </div>
          <p className="lede portfolio-discipline">{roleLabel}</p>
          <p className="meta-line">{account.email}</p>
        </div>
      </section>
      {params.saved === "1" ? <p className="note">Profile saved.</p> : null}
      <section className="panel">
        <h2>About</h2>
        <p>{bio}</p>
        {profile?.website_url ? (
          <p className="meta-line"><a href={profile.website_url}>{profile.website_url.replace(/^https?:\/\//, "")}</a></p>
        ) : null}
        <p className="task-actions">
          <Link className="button button-quiet" href={workspace}>Open your pages</Link>
        </p>
      </section>
    </main>
  );
}
