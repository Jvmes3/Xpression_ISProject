"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export type ToggleItem = {
  href: string;
  label: string;
  active?: boolean;
  offHref?: string;
};

export function ToggleNav({ label, links }: { label: string; links: ToggleItem[] }) {
  const pathname = usePathname();
  const [hash, setHash] = useState("");

  useEffect(() => {
    const read = () => setHash(window.location.hash);
    read();
    window.addEventListener("hashchange", read);
    return () => window.removeEventListener("hashchange", read);
  }, [pathname]);

  return (
    <nav className="desk-nav" aria-label={label}>
      {links.map((link) => {
        const hashLink = link.href.startsWith("#");
        const pathActive = link.active === undefined && !hashLink && !link.href.includes("?") && (pathname === link.href || pathname.startsWith(`${link.href}/`));
        const active = hashLink ? hash === link.href : link.active === undefined ? pathActive : link.active;
        const href = active ? (link.offHref || (hashLink ? pathname : "/")) : link.href;
        return (
          <a
            key={link.label}
            href={href}
            aria-current={active ? "page" : undefined}
            onClick={(event) => {
              if (!active || !hashLink) return;
              event.preventDefault();
              window.history.pushState(null, "", pathname + window.location.search);
              setHash("");
              window.scrollTo({ top: 0 });
            }}
          >
            {link.label}
          </a>
        );
      })}
    </nav>
  );
}
