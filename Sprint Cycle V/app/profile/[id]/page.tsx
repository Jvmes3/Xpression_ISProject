import { notFound } from "next/navigation";
import { PortfolioView } from "../../components/PortfolioView";
import { ProfileTools } from "../../components/ProfileTools";
import { creatorPortfolio } from "../../lib/records";
import { currentAccount } from "../../lib/session";
import { readDatabase } from "../../lib/store";
import { readAccountByEmail, readCreatorProfile } from "../../lib/writes";

export const dynamic = "force-dynamic";

const roleLabels: Record<string, string> = {
  moderator: "Community Moderator",
  administrator: "Administrator",
  Creator: "Creator",
  Mentor: "Creative Mentor",
  "Talent Scout": "Talent Scout",
  Moderator: "Community Moderator",
  Administrator: "Administrator",
};

function profileTab(value: string | undefined) {
  return value === "about" || value === "followers" || value === "following" ? value : "work";
}

export default async function PublicProfilePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ tab?: string; media?: string }>;
}) {
  const { id } = await params;
  if (!/^[A-Za-z0-9_-]{1,80}$/.test(id)) notFound();
  const query = await searchParams;
  const tab = profileTab(query.tab);
  const viewer = await currentAccount();

  if (/^\d+$/.test(id)) {
    const portfolio = await creatorPortfolio(id);
    if (!portfolio) notFound();
    const profile = await readCreatorProfile(Number(id));
    const mine = Boolean(
      viewer &&
        (viewer.application?.xpressionEmail?.toLowerCase() === portfolio.person.email.toLowerCase() ||
          viewer.email.toLowerCase() === portfolio.person.email.toLowerCase()),
    );
    const shown = profile?.name || portfolio.person.name;
    return (
      <PortfolioView
        name={shown}
        initial={shown.slice(0, 1).toUpperCase()}
        discipline={profile?.discipline || portfolio.person.discipline || ""}
        bio={profile?.bio || ""}
        website={profile?.website_url || ""}
        music={profile?.music_url || ""}
        practices={profile?.practices || ""}
        photoUrl={profile?.avatar_url || ""}
        openToCommissions={profile ? Boolean(profile.open_to_commissions) : Boolean(portfolio.person.open_to_commissions)}
        status={portfolio.person.status}
        works={portfolio.works}
        creatorId={id}
        mine={mine}
        tab={tab}
        media={query.media || ""}
      />
    );
  }

  const person = readDatabase().accounts.find((account) => account.id === id);
  if (!person || person.status === "banned" || person.status === "deactivated") notFound();

  const record = await readAccountByEmail(person.email);
  const name = record?.name || person.displayName?.trim() || person.email;
  const role = roleLabels[record?.role || person.role] || person.role;
  const mine = Boolean(
    viewer &&
      (viewer.email.toLowerCase() === person.email.toLowerCase() ||
        viewer.application?.xpressionEmail?.toLowerCase() === person.email.toLowerCase()),
  );

  if (record?.role === "Creator") {
    const portfolio = await creatorPortfolio(String(record.account_id));
    if (portfolio) {
      return (
        <PortfolioView
          name={name}
          initial={name.slice(0, 1).toUpperCase()}
          discipline={record.discipline || portfolio.person.discipline || role}
          bio={record.bio || person.background || ""}
          website={record.website_url || ""}
          music={record.music_url || ""}
          practices={record.practices || ""}
          photoUrl={record.avatar_url || ""}
          openToCommissions={Boolean(record.open_to_commissions)}
          status={role}
          works={portfolio.works}
          creatorId={String(record.account_id)}
          mine={mine}
          tab={tab}
          media={query.media || ""}
        />
      );
    }
  }

  return (
    <main className="page">
      <section className="portfolio-head">
        <div className="portfolio-avatar" aria-hidden="true">
          {record?.avatar_url ? <img src={record.avatar_url} alt="" /> : name.slice(0, 1).toUpperCase()}
        </div>
        <div className="portfolio-id">
          <div className="portfolio-name-row">
            <h1>{name}</h1>
            {mine ? <ProfileTools editHref="/profile/edit" /> : null}
          </div>
          <p className="portfolio-fullname">{role}</p>
          <p className="portfolio-bio">{record?.bio || person.background?.trim() || "Background has not been added for this account."}</p>
          {record?.website_url ? (
            <p className="meta-line"><a href={record.website_url}>{record.website_url.replace(/^https?:\/\//, "")}</a></p>
          ) : null}
          <p className="meta-line">{person.email}</p>
        </div>
      </section>
    </main>
  );
}
