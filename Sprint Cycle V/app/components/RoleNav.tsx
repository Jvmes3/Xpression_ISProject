"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function RoleNav({
  label,
  links,
}: {
  label: string;
  links: { href: string; label: string }[];
}) {
  const pathname = usePathname();
  return (
    <nav className="desk-nav" aria-label={label}>
      {links.map((link) => {
        const path = link.href.split("#")[0];
        const current = pathname === path;
        return (
          <Link key={link.href} href={link.href} aria-current={current ? "page" : undefined}>
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
