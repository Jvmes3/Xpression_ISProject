import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';
export const metadata: Metadata = { title: 'Xpression — A space for your creative voice', description: 'Discover writing, art, and music. Share your work and find your creative community.' };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><header className="site-header"><Link href="/" className="brand"><span className="brand-icon" aria-hidden="true">✳</span>xpression<span className="brand-dot">.</span></Link><nav aria-label="Main navigation"><Link href="/#community">Our community</Link><Link href="/#about">About</Link><Link href="/login" className="nav-login">Log in <span aria-hidden="true">↗</span></Link></nav></header><main>{children}</main><footer><Link href="/" className="brand">xpression.</Link><span>A little space. A lot of possibility.</span><span>Sprint Cycle I · UI prototype</span></footer></body></html>;
}
