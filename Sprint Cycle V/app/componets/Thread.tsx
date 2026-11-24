"use client"; 
import Link from "next/link"; 
import { useRouter } from "next/navigation"; 
import { useEffect, useRef, useState } from "react"; 
import { commentAsMentorFeedback, editMentorFeedbackPost, unsendMentorFeedbackPost } from "../lib/actions"; import { addComment, removeComment, setReaction, toggleGifReaction } from "../lib/comment-actions"; import { readExpression, type Expression } from "../lib/expressions"; 
import type { CommentCard } from "../lib/records"; 
import { formatWhen } from "../lib/when"; 
import { ExpressionPicker } from "./ExpressionPicker"; 
import { OctopusSprite } from "./OctopusSprite"; 
import { FlagLink, ReportFlag, ReportMark } from "./ReportFlag"; 
function CommentItem({ 
 comment, 
 comments, 
 workId, 
 canComment, 
 creator, 
 talk, 
 viewerId, 
 moderator, 
 reportQueue, 
}: { 
 comment: CommentCard; 
 comments: CommentCard[]; 
 workId: string; 
 canComment: boolean; 
 creator: string; 
 talk: "comments" | "feedbacks"; 
 viewerId: number; 
 moderator: boolean; 
 reportQueue: "" | "moderator" | "administrator"; 
}) { 
 const [open, setOpen] = useState(false); 
 const [editing, setEditing] = useState(false);
 const mine = talk === "feedbacks" && comment.mentorPost && comment.authorId === viewerId;  const canReport = viewerId > 0 && comment.authorId !== viewerId; 
 const [vote, setVote] = useState<"" | "like" | "dislike">(""); 
 const [likes, setLikes] = useState(comment.likes); 
 const [dislikes, setDislikes] = useState(comment.dislikes); 
 const replies = comment.parentId == null ? repliesUnder(comment.id, comments) : [];  const parent = comment.parentId == null ? null : comments.find((item) => item.id === comment.parentId);  const back = talk === "feedbacks" ? `/creator/desk/${workId}?talk=feedbacks` : `/creator/desk/${workId}`;  const signIn = `/sign-in?returnTo=${encodeURIComponent(back)}`; 
 useEffect(() => { 
 const saved = window.localStorage.getItem(`xpression-vote-${comment.id}`); 
 setVote(saved === "like" || saved === "dislike" ? saved : ""); 
 setLikes(comment.likes); 
 setDislikes(comment.dislikes); 
 }, [comment.id, comment.likes, comment.dislikes]); 
 async function choose(next: "like" | "dislike") { 
 const previous = vote; 
 const chosen = previous === next ? "" : next; 
 const likeDelta = (chosen === "like" ? 1 : 0) - (previous === "like" ? 1 : 0);  const dislikeDelta = (chosen === "dislike" ? 1 : 0) - (previous === "dislike" ? 1 : 0);  setVote(chosen); 
 setLikes((count) => count + likeDelta); 
 setDislikes((count) => count + dislikeDelta); 
 if (chosen) window.localStorage.setItem(`xpression-vote-${comment.id}`, chosen);  else window.localStorage.removeItem(`xpression-vote-${comment.id}`); 
 try { 
 await setReaction(comment.id, likeDelta, dislikeDelta, workId, chosen); 
 } catch { 
 setVote(previous); 
 setLikes((count) => count - likeDelta); 
 setDislikes((count) => count - dislikeDelta); 
 if (previous) window.localStorage.setItem(`xpression-vote-${comment.id}`, previous);  else window.localStorage.removeItem(`xpression-vote-${comment.id}`); 
 } 
 } 
 return (
 <article className="comment"> 
 <p className="comment-by"> 
 <strong className={comment.mentorPost ? "mentor-name" : undefined}>{comment.author}</strong>  {reportQueue ? ( 
 <ReportMark 
 reasons={comment.reportReasons} 
 href={reportQueue === "administrator" 
 ? `/administrator/activity?comment=${comment.id}` 
 : `/moderator/users?comment=${comment.id}`} 
 /> 
 ) : null} 
 {comment.author === creator ? <span className="op-tag">OP</span> : null} 
 {formatWhen(comment.when) ? <span>{formatWhen(comment.when)}</span> : null}  </p> 
 {editing ? ( 
 <form className="comment-form" action={editMentorFeedbackPost}> 
 <input type="hidden" name="workId" value={workId} /> 
 <input type="hidden" name="commentId" value={comment.id} /> 
 <textarea name="body" rows={4} required defaultValue={comment.body} /> 
 <div className="compose-actions"> 
 <button className="button" type="submit">Save</button> 
 <button className="button button-quiet" type="button" onClick={() => setEditing(false)}>Cancel</b  utton> 
 </div> 
 </form> 
 ) : comment.body ? ( 
 <p className="comment-body"> 
 {parent ? <span className="mention">@{parent.author} </span> : null} 
 {shownBody(comment.body, parent?.author || "")} 
 </p> 
 ) : null} 
 {comment.parentId != null && readExpression(comment.gif) ? null : <CommentMedia gif={comment.gif} />}  <GifReactions commentId={comment.id} comments={comments} viewerId={viewerId} workId={workId} signIn={si  gnIn} /> 
 <div className="comment-actions"> 
 <button className={vote === "like" ? "comment-action is-on" : "comment-action"} type="button" aria-pr  essed={vote === "like"} onClick={() => choose("like")}> 
 Like {likes} 
 </button>
 <button className={vote === "dislike" ? "comment-action is-down is-on" : "comment-action"} type="butt  on" aria-pressed={vote === "dislike"} onClick={() => choose("dislike")}> 
 Dislike {dislikes} 
 </button> 
 {canComment ? ( 
 <button className="comment-action" type="button" onClick={() => setOpen((value) => !value)}>  {open ? "Cancel" : "Reply"} 
 </button> 
 ) : ( 
 <Link className="comment-action" href={signIn}>Reply</Link> 
 )} 
 {canReport ? ( 
 <ReportFlag workId={workId} commentId={comment.id} talk={talk} /> 
 ) : viewerId === 0 ? ( 
 <FlagLink href={signIn} label="Report this comment" /> 
 ) : null} 
 {mine ? ( 
 <button className="comment-action" type="button" onClick={() => { setEditing((value) => !value); se  tOpen(false); }}> 
 {editing ? "Cancel" : "Edit"} 
 </button> 
 ) : null} 
 {mine ? ( 
 <form action={unsendMentorFeedbackPost}> 
 <input type="hidden" name="workId" value={workId} /> 
 <input type="hidden" name="commentId" value={comment.id} /> 
 <button className="comment-action" type="submit">Unsend</button> 
 </form> 
 ) : null} 
 {moderator ? ( 
 <form action={removeComment}> 
 <input type="hidden" name="workId" value={workId} /> 
 <input type="hidden" name="commentId" value={comment.id} /> 
 <input type="hidden" name="talk" value={talk} /> 
 <button className="comment-action" type="submit">Remove</button> 
 </form> 
 ) : null} 
 {moderator ? ( 
 <Link className="comment-action" href={`/moderator/users?account=${comment.authorId}`}>Warn</Link>
 ) : null} 
 </div> 
 {open ? ( 
 <CommentComposer 
 workId={workId} 
 parentId={comment.id} 
 talk={talk} 
 placeholder={`Reply to ${comment.author}`} 
 submitLabel="Reply" 
 /> 
 ) : null} 
 {replies.length > 0 ? ( 
 <div className="comment-replies"> 
 {replies.map((reply) => ( 
 <CommentItem key={reply.id} comment={reply} comments={comments} workId={workId} canComment={canCo  mment} creator={creator} talk={talk} viewerId={viewerId} moderator={moderator} reportQueue={repor  tQueue} /> 
 ))} 
 </div> 
 ) : null} 
 </article> 
 ); 
} 
function repliesUnder(rootId: number, comments: CommentCard[]) { 
 const byId = new Map(comments.map((item) => [item.id, item])); 
 function rootOf(item: CommentCard) { 
 let current = item; 
 const seen = new Set<number>(); 
 while (current.parentId != null) { 
 if (seen.has(current.id)) return null; 
 seen.add(current.id); 
 const parent = byId.get(current.parentId); 
 if (!parent || parent.parentId == null) return current.parentId; 
 current = parent; 
 } 
 return null; 
 } 
 return comments.filter((item) => item.parentId != null && rootOf(item) === rootId && !gifOnly(item));
} 
function gifOnly(item: CommentCard) { 
 return Boolean(readExpression(item.gif)) && !item.body.trim(); 
} 
function GifReactions({ 
 commentId, 
 comments, 
 viewerId, 
 workId, 
 signIn, 
}: { 
 commentId: number; 
 comments: CommentCard[]; 
 viewerId: number; 
 workId: string; 
 signIn: string; 
}) { 
 const router = useRouter(); 
 const [pending, setPending] = useState(""); 
 const groups = new Map<string, { item: Expression; people: { id: number; name: string }[] }>();  for (const item of comments) { 
 if (item.parentId !== commentId) continue; 
 const expression = readExpression(item.gif); 
 if (!expression) continue; 
 const group = groups.get(expression.item.id) || { item: expression.item, people: [] };  if (!group.people.some((person) => person.id === item.authorId)) { 
 group.people.push({ id: item.authorId, name: item.author }); 
 } 
 groups.set(expression.item.id, group); 
 } 
 if (groups.size === 0) return null; 
 async function toggle(gifId: string) { 
 if (pending) return; 
 setPending(gifId); 
 try { 
 await toggleGifReaction(Number(workId), commentId, gifId);
 router.refresh(); 
 } finally { 
 setPending(""); 
 } 
 } 
 return ( 
 <div className="gif-reactions"> 
 {[...groups.values()].map((group) => { 
 const mine = group.people.some((person) => person.id === viewerId); 
 const names = group.people.map((person) => (person.id === viewerId ? "You" : person.name)).join(", ")  ; 
 const label = `${group.item.name}, ${group.people.length}. ${names}`; 
 if (viewerId === 0) { 
 return ( 
 <Link key={group.item.id} className="gif-reaction" href={signIn} title={names} aria-label={label}  > 
 <OctopusSprite mood={group.item.mood} size="react" label={group.item.name} />  <span>{group.people.length}</span> 
 </Link> 
 ); 
 } 
 return ( 
 <button 
 key={group.item.id} 
 className={mine ? "gif-reaction is-mine" : "gif-reaction"} 
 type="button" 
 title={names} 
 aria-pressed={mine} 
 aria-label={label} 
 disabled={pending === group.item.id} 
 onClick={() => toggle(group.item.id)} 
 > 
 <OctopusSprite mood={group.item.mood} size="react" label={group.item.name} />  <span>{group.people.length}</span> 
 </button> 
 ); 
 })} 
 </div>
 ); 
} 
function shownBody(body: string, name: string) { 
 if (!name) return body; 
 const prefix = `@${name}`; 
 if (body.slice(0, prefix.length).toLowerCase() !== prefix.toLowerCase()) return body;  return body.slice(prefix.length).replace(/^\s+/, ""); 
} 
function CommentMedia({ gif }: { gif: string }) { 
 const expression = readExpression(gif); 
 if (expression) { 
 return ( 
 <OctopusSprite 
 mood={expression.item.mood} 
 size="gif" 
 label={expression.item.name} 
 /> 
 ); 
 } 
 if (!gif) return null; 
 return <p><a href={gif}>{gif}</a></p>; 
} 
function CommentComposer({ 
 workId, 
 parentId, 
 talk, 
 placeholder, 
 submitLabel, 
}: { 
 workId: string; 
 parentId?: number; 
 talk: "comments" | "feedbacks"; 
 placeholder: string; 
 submitLabel: string; 
}) { 
 const feedback = talk === "feedbacks" && parentId == null;
 const textRef = useRef<HTMLTextAreaElement>(null); 
 const [gifId, setGifId] = useState(""); 
 const attached = readExpression(gifId ? `xpression-gif:${gifId}` : ""); 
 function insertEmoji(symbol: string) { 
 const field = textRef.current; 
 if (!field) return; 
 const start = field.selectionStart ?? field.value.length; 
 const end = field.selectionEnd ?? start; 
 field.value = field.value.slice(0, start) + symbol + field.value.slice(end); 
 const caret = start + symbol.length; 
 field.setSelectionRange(caret, caret); 
 field.focus(); 
 } 
 return ( 
 <form className={parentId == null ? "comment-form comment-compose" : "comment-form"} action={feedback ? c  ommentAsMentorFeedback : addComment}> 
 <input type="hidden" name="workId" value={workId} /> 
 {parentId != null ? <input type="hidden" name="parentId" value={parentId} /> : null}  <input type="hidden" name="media" value={gifId ? `xpression-gif:${gifId}` : ""} />  {parentId == null ? <span className="composer-label">{feedback ? "Add feedback" : "Add a comment"}</spa  n> : null} 
 {attached ? ( 
 <div className="gif-draft"> 
 <OctopusSprite mood={attached.item.mood} size="picker" label={attached.item.name} />  <button className="comment-action" type="button" onClick={() => setGifId("")}>Remove GIF</button>  {parentId != null ? <p className="meta-line">This GIF sits on the comment you are replying to.</p>   : null} 
 </div> 
 ) : null} 
 <textarea ref={textRef} name="body" rows={3} placeholder={placeholder} required={feedback} />  {feedback ? <p className="meta-line">A comment on this tab is saved as mentor feedback.</p> : null}  <div className="compose-actions"> 
 {feedback ? null : ( 
 <ExpressionPicker onGif={setGifId} onEmoji={insertEmoji} /> 
 )} 
 <button className="button" type="submit">{submitLabel}</button> 
 </div>
 </form> 
 ); 
} 
export function CommentThread({ 
 workId, 
 comments, 
 canComment, 
 notice, 
 creator, 
 showHeading = true, 
 talk = "comments", 
 allowRoot = true, 
 saved = false, 
 viewerId = 0, 
 moderator = false, 
 reportQueue = "", 
}: { 
 workId: string; 
 comments: CommentCard[]; 
 canComment: boolean; 
 notice?: string; 
 creator: string; 
 showHeading?: boolean; 
 talk?: "comments" | "feedbacks"; 
 allowRoot?: boolean; 
 saved?: boolean; 
 viewerId?: number; 
 moderator?: boolean; 
 reportQueue?: "" | "moderator" | "administrator"; 
}) { 
 const roots = comments.filter((comment) => comment.parentId == null || !comments.some((item) => item.id ===  comment.parentId)); 
 const note = notice === "empty" 
 ? "Write a comment before posting." 
 : notice === "account" 
 ? talk === "feedbacks" 
 ? "This sign-in is not a Mentor account in the database, so it cannot leave feedback."  : "This sign-in is not a role account yet, so it cannot comment."
 : notice === "mentor" 
 ? "Only a mentor can start a comment on this tab." 
 : notice === "work" 
 ? "That piece is not available for feedback." 
 : notice === "owner" 
 ? "You can only edit or unsend feedback you wrote." 
 : notice === "report" 
 ? "Write what a moderator should know before sending the report." 
 : notice === "already" 
 ? "You already reported this." 
 : notice === "self" 
 ? "You cannot report your own post or comment." 
 : ""; 
 const signIn = `/sign-in?returnTo=${encodeURIComponent(talk === "feedbacks" ? `/creator/desk/${workId}?talk  =feedbacks` : `/creator/desk/${workId}`)}`; 
 return ( 
 <section className="thread"> 
 {showHeading ? <h2>Comments</h2> : null} 
 {saved ? <p className="note">This comment is saved as mentor feedback.</p> : null}  {note ? <p className="note">{note}</p> : null} 
 {canComment && allowRoot ? ( 
 <CommentComposer workId={workId} talk={talk} placeholder="Write your own comment" submitLabel={talk =  == "feedbacks" ? "Save feedback" : "Comment"} /> 
 ) : null} 
 {!canComment && talk === "comments" ? <p><Link href={signIn}>Sign in to comment</Link></p> : null}  {roots.length === 0 ? <p className="meta-line">{talk === "feedbacks" ? "No mentor feedback yet." : "No   comments yet."}</p> : null} 
 {roots.map((comment) => ( 
 <CommentItem key={comment.id} comment={comment} comments={comments} workId={workId} canComment={canCo  mment} creator={creator} talk={talk} viewerId={viewerId} moderator={moderator} reportQueue={reportQue  ue} /> 
 ))} 
 </section> 
 ); 
}
