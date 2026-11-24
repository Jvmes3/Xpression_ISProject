import Link from "next/link"; 
import { reportQueue, reportsPage } from "../lib/access"; import { reportReasonByWork, type WorkCard } from "../lib/records"; import { currentAccount } from "../lib/session"; 
import { ProfileTools } from "./ProfileTools"; 
import { ReportMark } from "./ReportFlag"; 
import { SprintNote } from "./SprintNote"; 
const postKinds = ["Writing", "Visual art", "Music"] as const; 
export async function PortfolioView({ 
 name, 
 initial, 
 discipline, 
 bio, 
 website = "", 
 music = "", 
 practices = "", 
 photoUrl = "", 
 openToCommissions, 
 status, 
 works, 
 creatorId, 
 mine = false, 
 tab = "work", 
 media = "", 
 saved = false, 
}: { 
 name: string; 
 initial: string; 
 discipline: string; 
 bio: string; 
 website?: string; 
 music?: string; 
 practices?: string; 
 photoUrl?: string; 
 openToCommissions: boolean;
 status: string; 
 works: WorkCard[]; 
 creatorId: string; 
 mine?: boolean; 
 tab?: "work" | "about" | "followers" | "following"; 
 media?: string; 
 saved?: boolean; 
}) { 
 const base = mine ? "/profile" : `/profile/${creatorId}`; 
 const selectedMedia = postKinds.includes(media as (typeof postKinds)[number]) ? media : "";  const shown = selectedMedia ? works.filter((work) => work.media === selectedMedia) : works;  const queue = reportQueue(await currentAccount()); 
 const reported = queue ? await reportReasonByWork() : {}; 
 const practiceLine = practices || discipline; 
 function hrefFor(next: "work" | "about" | "followers" | "following") { 
 if (next === "work") return base; 
 return `${base}?tab=${next}`; 
 } 
 function mediaHref(value: string) { 
 if (!value || value === selectedMedia) return base; 
 return `${base}?media=${encodeURIComponent(value)}`; 
 } 
 return ( 
 <main className="page"> 
 <section className="portfolio-head"> 
 <div className="portfolio-avatar" aria-hidden="true"> 
 {photoUrl ? <img src={photoUrl} alt="" /> : initial} 
 </div> 
 <div className="portfolio-id"> 
 <div className="portfolio-name-row"> 
 <h1>{name}</h1> 
 {mine ? <ProfileTools editHref="/profile/edit" /> : null} 
 </div> 
 <p className="portfolio-stats"> 
 <Link href={hrefFor("work")}><strong>{works.length}</strong> posts</Link>  <Link href={hrefFor("followers")} aria-current={tab === "followers" ? "page" : undefined}><strong
 >0</strong> followers</Link> 
 <Link href={hrefFor("following")} aria-current={tab === "following" ? "page" : undefined}><strong  >0</strong> following</Link> 
 </p> 
 <p className="portfolio-fullname">{practiceLine || "Creator"}{openToCommissions ? " · Open to commi  ssions" : ""}</p> 
 <p className="portfolio-bio">{bio || "No bio yet."}</p> 
 {website ? <p className="meta-line"><a href={website}>{website.replace(/^https?:\/\//, "")}</a></p>  : null} 
 {music ? <p className="meta-line"><a href={music}>{music.replace(/^https?:\/\//, "")}</a></p> : nul  l} 
 <p className="meta-line">{status}</p> 
 </div> 
 </section> 
 {saved ? <p className="note">Profile saved.</p> : null} 
 {tab === "followers" || tab === "following" ? ( 
 <section className="panel people-list"> 
 <h2>{tab === "followers" ? "Followers" : "Following"}</h2> 
 <p className="people-empty"> 
 {tab === "followers" 
 ? "When people follow this profile, they will be listed here." 
 : "Profiles this creator follows will be listed here."} 
 </p> 
 <SprintNote label={tab === "followers" ? "followers" : "following"} /> 
 </section> 
 ) : tab === "about" ? ( 
 <section className="panel"> 
 <h2>About</h2> 
 <p>{bio || "This creator has not added a bio yet."}</p> 
 <p className="meta-line">{practiceLine || "No discipline listed"}</p> 
 </section> 
 ) : ( 
 <> 
 <nav className="post-switch" aria-label="Post types"> 
 <Link href={mediaHref("")} aria-current={selectedMedia ? undefined : "page"} aria-label="All post  s" title="All"> 
 <GridIcon />
 </Link> 
 <Link href={mediaHref("Writing")} aria-current={selectedMedia === "Writing" ? "page" : undefined}  aria-label="Writing" title="Writing"> 
 <WritingIcon /> 
 </Link> 
 <Link href={mediaHref("Visual art")} aria-current={selectedMedia === "Visual art" ? "page" : unde  fined} aria-label="Visual art" title="Visual art"> 
 <VisualIcon /> 
 </Link> 
 <Link href={mediaHref("Music")} aria-current={selectedMedia === "Music" ? "page" : undefined} ari  a-label="Music" title="Music"> 
 <MusicIcon /> 
 </Link> 
 </nav> 
 <div className="post-grid"> 
 {shown.length === 0 ? <p className="post-empty">{selectedMedia ? `No ${selectedMedia.toLowerCase(  )} posts yet.` : "No posts yet."}</p> : null} 
 {shown.map((work) => ( 
 <div key={work.id} className="post-slot"> 
 <Link className="post-cell" href={`/creator/desk/${work.id}`} data-media={work.media}>  <span>{work.media}</span> 
 <strong>{work.title}</strong> 
 </Link> 
 {queue && reported[work.id]?.length ? ( 
 <ReportMark reasons={reported[work.id]} href={reportsPage(queue, "work", work.id)} />  ) : null} 
 </div> 
 ))} 
 </div> 
 {mine ? <SprintNote label="featuring and archiving posts" /> : null} 
 </> 
 )} 
 </main> 
 ); 
} 
function GridIcon() { 
 return ( 
 <svg viewBox="0 0 24 24" aria-hidden="true">
