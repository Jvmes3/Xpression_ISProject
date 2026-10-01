import Link from 'next/link';
import { demoUsers } from '../../lib/demo-users';
export default async function Preview({ searchParams }: { searchParams: Promise<{ role?: string }> }) {
  const { role } = await searchParams;
  const user = demoUsers.find(user => user.id === role);
  if (!user) return <section className="preview"><h1>Choose an example user.</h1><p>Visit the login screen to preview one of the five roles.</p><Link href="/login" className="button primary">Back to login ↗</Link></section>;
  return <section className="preview"><div className="preview-top"><p className="eyebrow">{user.role} / My space</p><Link href="/login" className="text-link">Change example user ↗</Link></div><h1>Welcome, {user.name.split(' ')[0]}<span className="brand-dot">.</span></h1><p className="intro">{user.description}</p><div className="notice">Role landing screen mockup · Public demo preview. Navigation represents proposed features.</div><div className="role-grid">{user.actions.map((action, index) => <article key={action} className="role-card"><span className="medium-number">0{index + 1} /</span><h2>{action}</h2><p>{user.cases.some(selected => selected === action) ? 'Selected use case for Sprint Cycle I design.' : 'Planned navigation for a future sprint.'}</p><span className="small-label">DESIGN PLACEHOLDER ↗</span></article>)}</div><p className="muted">Use-case screen specifications and the submission checklist are stored in sprints/cycle-01.</p></section>;
}
