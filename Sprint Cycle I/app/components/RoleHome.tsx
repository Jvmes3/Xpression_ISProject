import Link from "next/link";
import { NotReady } from "./NotReady";

export function RoleHome({
  kicker,
  title,
  lede,
  cards,
  rolePage,
  children,
}: {
  kicker: string;
  title: string;
  lede: string;
  cards: { title: string; text: string; action: string; href: string }[];
  rolePage: { label: string; href: string };
  children?: React.ReactNode;
}) {
  return (
    <main className="page">
      <p className="eyebrow">{kicker}</p>
      <h1>{title}</h1>
      <p className="lede">{lede}</p>
      <div className="cards">
        {cards.map((card) => (
          <article key={card.title} className="panel">
            <h2>{card.title}</h2>
            <p>{card.text}</p>
            <p className="card-action">
              <NotReady className="button">{card.action}</NotReady>
            </p>
          </article>
        ))}
      </div>
      {children}
      <p className="role-page-link">
        <Link href={rolePage.href}>{rolePage.label} page &gt;&gt;</Link>
      </p>
    </main>
  );
}

export function InfoPage({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <main className="page">
      <h1>{title}</h1>
      <div className="panel">{children}</div>
    </main>
  );
}
