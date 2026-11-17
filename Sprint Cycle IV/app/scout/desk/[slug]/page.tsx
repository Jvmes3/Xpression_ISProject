import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { RoleSignIn } from "../../../components/RoleSignIn";
import { accountLabel, canUseRole } from "../../../lib/access";
import { piecePreview } from "../../../lib/pieces";
import { creatorPortfolio } from "../../../lib/records";
import { currentAccount } from "../../../lib/session";

export const dynamic = "force-dynamic";

export default async function ScoutPortfolioPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (!/^\d+$/.test(slug)) redirect("/scout/desk#portfolio");

  const account = await currentAccount();
  if (!canUseRole(account, "scout")) {
    return (
      <RoleSignIn
        role="scout"
        title="Creator portfolio"
        next={`/scout/desk/${slug}`}
        signedInAs={account ? accountLabel(account) : undefined}
      />
    );
  }

  const portfolio = await creatorPortfolio(slug);
  if (!portfolio) notFound();
  const { person, works } = portfolio;

  return (
    <main className="page">
      <p className="eyebrow">Portfolio</p>
      <h1>{person.name}</h1>
      <p className="lede">
        {person.discipline || "No discipline listed"}
        {person.open_to_commissions ? " · Open to commissions" : ""}
        {" · "}
        {person.status}
      </p>
      <div className="task-list">
        {works.length === 0 ? <p>This creator has no published pieces.</p> : null}
        {works.map((work) => (
          <article key={work.id} className="panel">
            <p className="flag">{work.media}{work.featured ? " · Featured" : ""}</p>
            <h2>{work.title}</h2>
            <p>{piecePreview(work.id, work.description)}</p>
            <p><Link href={`/creator/desk/${work.id}`}>Open work</Link></p>
            {work.link ? <p><a href={work.link}>{work.link}</a></p> : null}
          </article>
        ))}
      </div>
      <p className="more"><Link href="/scout/desk#search">Back to creators</Link></p>
    </main>
  );
}
