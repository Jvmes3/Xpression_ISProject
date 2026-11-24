import Link from "next/link";
import { SprintNote } from "../components/SprintNote";
import { currentAccount } from "../lib/session";

export const dynamic = "force-dynamic";

export default async function MessagesPage() {
  const account = await currentAccount();
  if (!account) {
    return (
      <main className="page">
        <h1>Messages</h1>
        <p className="lede">Sign in to open your messages.</p>
        <p><Link className="button" href="/sign-in?returnTo=%2Fmessages">Sign in</Link></p>
      </main>
    );
  }

  const name = account.application?.name?.trim() || account.displayName?.trim() || account.email;

  return (
    <main className="page">
      <section className="ig-inbox" aria-label="Messages">
        <aside className="ig-side">
          <header className="ig-side-head">
            <h1>{name}</h1>
          </header>
          <input className="ig-search" type="search" placeholder="Search" aria-label="Search messages" disabled />
          <p className="ig-side-label">Messages</p>
          <p className="ig-empty-list">No messages yet.</p>
        </aside>
        <section className="ig-thread">
          <div className="ig-thread-empty">
            <span className="ig-mark" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="44" height="44" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="M21 12.5 12 17 3 12.5" />
                <path d="M3 7.5 12 3l9 4.5-9 4.5-9-4.5Z" />
                <path d="M12 12v5" />
              </svg>
            </span>
            <h2>Your messages</h2>
            <p>Send private messages to people on Xpression.</p>
            <SprintNote label="messages" />
          </div>
        </section>
      </section>
    </main>
  );
}
