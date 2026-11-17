"use client"; 
import Image from "next/image"; 
import Link from "next/link"; 
import { usePathname, useRouter } from "next/navigation"; 
import { useEffect, useState, type ReactNode } from "react"; 
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
function navTarget(href: string, pathname: string, hash: string) { 
const hashAt = href.indexOf("#"); 
if (hashAt >= 0) { 
const path = href.slice(0, hashAt) || "/"; 
const frag = href.slice(hashAt); 
const active = pathname === path && hash === frag; 
return { href: active ? path : href, active, clearHash: active }; 
} 
const active = href !== "/" && (pathname === href || pathname.startsWith(`${href}/`)); return { href: active ? "/" : href, active, clearHash: false }; 
} 
function NavLink({ 
href, 
pathname, 
hash, 
setHash, 
className,
children, 
}: { 
href: string; 
pathname: string; 
hash: string; 
setHash: (value: string) => void; 
className?: string; 
children: ReactNode; 
}) { 
const router = useRouter(); 
const target = navTarget(href, pathname, hash); 
return ( 
<Link 
className={className} 
href={target.href} 
aria-current={target.active ? "page" : undefined} 
onClick={(event) => { 
if (!target.active) return; 
event.preventDefault(); 
if (target.clearHash) { 
window.history.pushState(null, "", pathname + window.location.search); 
setHash(""); 
window.scrollTo({ top: 0 }); 
return; 
} 
router.push(target.href); 
}} 
> 
{children} 
</Link> 
); 
} 
export function SiteHeader({ session }: { session: HeaderSession | null }) { const pathname = usePathname(); 
const [open, setOpen] = useState(false); 
const [hash, setHash] = useState(""); 
const row = roles; 
useEffect(() => { 
setOpen(false); 
const read = () => setHash(window.location.hash); 
read(); 
window.addEventListener("hashchange", read); 
return () => window.removeEventListener("hashchange", read); 
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
<NavLink className="signed-in" href="/profile" pathname={pathname} hash={hash} setHash= {setHash}> 
<span className="avatar" aria-hidden="true">{session.initial}</span>
<span> 
<strong>{session.name}</strong> 
<small>{session.roleLabel}</small> 
</span> 
</NavLink> 
<NavLink className="utility-workspace" href={session.workspaceHref} pathname={pathname} hash= {hash} setHash={setHash}> 
{session.workspaceLabel} 
</NavLink> 
</> 
) : ( 
<NavLink className="utility-workspace" href="/sign-in" pathname={pathname} hash={hash} setHash= {setHash}>Sign in</NavLink> 
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
<NavLink href="/account" pathname={pathname} hash={hash} setHash={setHash}>Your application</NavLink> {session && session.workspaceHref !== "/account" ? ( 
<NavLink href={session.workspaceHref} pathname={pathname} hash={hash} setHash={setHash}> {session.workspaceLabel} 
</NavLink> 
) : null} 
{menuItems 
.filter((item) => !(session && item.href === "/sign-in")) 
.map((item) => ( 
<NavLink key={item.href} href={item.href} pathname={pathname} hash={hash} setHash={setHash}> {item.label} 
</NavLink> 
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
<NavLink key={role.href} href={role.href} pathname={pathname} hash={hash} setHash={setHash}> {role.label} 
</NavLink> 
))} 
<NavLink className="apply" href="/apply" pathname={pathname} hash={hash} setHash={setHash}> Apply 
</NavLink> 
</nav> 
</header> 
); 
} 
