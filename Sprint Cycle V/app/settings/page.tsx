import Link from "next/link";
import { currentAccount } from "../lib/session";

export const dynamic = "force-dynamic";

const items = [
  { href: "/saved", label: "Saved", text: "Posts you saved." },
  { href: "/activity", label: "Your activity", text: "Comments, feedback, and opportunities from this account." },
  { href: "/notifications", label: "Notifications", text: "Posts, comments, and reports that involve you." },
  { href: "/messages", label: "Messages", text: "Your inbox." },
  { href: "/profile/edit", label: "Edit profile", text: "Name, bio, photo, and the rest of your public profile." },
];

export default async function SettingsPage() {
  const account = await currentAccount();
  if (!account) {
    return (
      <main className="page">
        <h1>Settings and activity</h1>
        <p className="lede">Sign in to open your settings.</p>
        <p><Link className="button" href="/sign-in?returnTo=%2Fsettings">Sign in</Link></p>
      </main>
    );
  }

  return (
    <main className="page">
      <p className="eyebrow">Profile</p>
      <h1>Settings and activity</h1>
      <div className="settings-list">
        {items.map((item) => (
          <Link key={item.href} href={item.href}>
            <strong>{item.label}</strong>
            <span>{item.text}</span>
          </Link>
        ))}
      </div>
    </main>
  );
}
