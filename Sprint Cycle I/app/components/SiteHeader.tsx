"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { signOut } from "../lib/actions";
import { menuItems, roles } from "../lib/nav";

export type HeaderSession = {
  email: string;
  name: string;
  initial: string;
  roleLabel: string;
  kind: "record" | "role";
  workspaceHref: string;
  workspaceLabel: string;
  links: { href: string; label: string }[];
};

export function SiteHeader({ session }: { session: HeaderSession | null }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const row = roles;

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header className="masthead">
      <div className="utility">
        <Link href="/" className="utility-brand">
          <Image src="/logo.svg" alt="" width={32} height={32} />
          <span>Xpression</span>
        </Link>
        <div className="utility-end">
          {session ? (
            <>
              <Link href="/profile" className="signed-in">
                <span className="avatar" aria-hidden="true">{session.initial}</span>
                <span>
                  <strong>{session.name}</strong>
                  <small>{session.roleLabel}</small>
                </span>
              </Link>
              <Link className="utility-workspace" href={session.workspaceHref}>
                {session.workspaceLabel}
              </Link>
            </>
          ) : (
            <Link className="utility-workspace" href="/sign-in">Sign in</Link>
          )}
          <button
            type="button"
            className="hamburger"
            aria-expanded={open}
            aria-controls="feature-menu"
            onClick={() => setOpen((value) => !value)}
          >
            <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
            <span className="bars" aria-hidden="true">
              <span />
              <span />
              <span />
            </span>
          </button>
        </div>
      </div>

      <nav
        id="feature-menu"
        className="drawer"
        aria-label="Other features"
        hidden={!open}
      >
        {session ? <p className="drawer-who">Signed in as {session.name}</p> : null}
        <Link href="/account">Your application</Link>
        {session && session.workspaceHref !== "/account" ? (
          <Link href={session.workspaceHref}>{session.workspaceLabel}</Link>
        ) : null}
        {menuItems
          .filter((item) => !(session && item.href === "/sign-in"))
          .map((item) => (
            <Link key={item.href} href={item.href}>
              {item.label}
            </Link>
          ))}
        {session ? (
          <form action={signOut}>
            <button className="menu-button" type="submit">Sign out</button>
          </form>
        ) : null}
      </nav>

      <p className="site-title">
        <Link href="/">
          Xpression
        </Link>
      </p>

      <nav className="role-row" aria-label="Roles">
        {row.map((role) => (
          <Link
            key={role.href}
            href={role.href}
            aria-current={pathname === role.href ? "page" : undefined}
          >
            {role.label}
          </Link>
        ))}
        <Link
          className="apply"
          href="/apply"
          aria-current={pathname === "/apply" ? "page" : undefined}
        >
          Apply
        </Link>
      </nav>
    </header>
  );
}
