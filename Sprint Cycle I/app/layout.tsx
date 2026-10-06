import type { Metadata } from "next";
import { Fraunces, Outfit } from "next/font/google";
import { SiteHeader, type HeaderSession } from "./components/SiteHeader";
import { roleHome } from "./lib/application";
import { roleLinks } from "./lib/nav";
import { currentAccount } from "./lib/session";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-serif",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-sans",
});

function headerSession(account: NonNullable<Awaited<ReturnType<typeof currentAccount>>>): HeaderSession {
  const name = account.application?.name?.trim() || account.displayName?.trim() || account.email;
  const kind = account.sessionKind || (account.role === "applicant" ? "record" : "role");
  const approved = account.application?.status === "approved" ? account.application.role : "";
  let roleLabel = "Applicant";
  let workspaceHref = "/account";
  let workspaceLabel = "Your application";
  let links = roleLinks("");

  if (account.role === "moderator") {
    roleLabel = "Moderator";
    workspaceHref = "/moderator/desk";
    workspaceLabel = "Your desk";
    links = roleLinks("moderator");
  } else if (account.role === "administrator") {
    roleLabel = "Administrator";
    workspaceHref = "/administrator/desk";
    workspaceLabel = "Your desk";
    links = roleLinks("administrator");
  } else if (approved) {
    roleLabel = approved;
    workspaceHref = roleHome(approved);
    workspaceLabel = "Your workspace";
    links = roleLinks(approved);
  } else if (account.application?.role) {
    roleLabel = account.application.role;
  }

  return {
    email: account.email,
    name,
    initial: name.slice(0, 1).toUpperCase(),
    roleLabel,
    kind,
    workspaceHref,
    workspaceLabel,
    links,
  };
}

export const metadata: Metadata = {
  title: "Xpression",
  description:
    "A community for publishing, discovering, and organizing creative work.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const account = await currentAccount();
  const session = account ? headerSession(account) : null;

  return (
    <html lang="en" className={`${fraunces.variable} ${outfit.variable}`}>
      <body>
        <SiteHeader session={session} />
        {children}
        <footer className="site-footer">
          <span>Xpression</span>
          <span>Sprint Cycle I</span>
        </footer>
      </body>
    </html>
  );
}
