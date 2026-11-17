"use client"; 
import { useRouter } from "next/navigation"; 
import { useEffect, useRef, useState } from "react"; 
import { SampleLinkField } from "../components/SampleLinkField"; import { 
APPLICANT_ROLES, 
MEDIA, 
type ApplicantRole, 
type Application, 
type AreaAnswer, 
type DraftInput, 
type MediaKind, 
isMedia, 
mediaPrompt, 
missingFields, 
questionsFor, 
} from "../lib/application"; 
function newArea(media: MediaKind): AreaAnswer { 
return { id: crypto.randomUUID(), media, label: "", detail: "", sample: "" }; } 
function withSelection(selected: MediaKind[], areas: AreaAnswer[]) { const kept = areas.filter((area) => selected.includes(area.media)); if (selected.length === 0) return []; 
if (selected.length === 1) { 
const media = selected[0]; 
const existing = kept.find((area) => area.media === media) ?? newArea(media); return [{ ...existing, label: existing.label || media }]; 
} 
const next = [...kept]; 
for (const media of selected) { 
if (!next.some((area) => area.media === media)) next.push(newArea(media)); } 
return next; 
} 
export function ApplicationForm({ 
initial, 
}: {
initial: { 
role: Application["role"]; 
name: string; 
age: string; 
reason: string; 
credentials: string; 
experience: string; 
selectedMedia: MediaKind[]; 
areas: AreaAnswer[]; 
organization: string; 
proof: string; 
}; 
}) { 
const router = useRouter(); 
const [role, setRole] = useState<ApplicantRole | "">(initial.role); 
const [name, setName] = useState(initial.name); 
const [age, setAge] = useState(initial.age); 
const [reason, setReason] = useState(initial.reason); 
const [credentials, setCredentials] = useState(initial.credentials); 
const [experience, setExperience] = useState(initial.experience); 
const [selected, setSelected] = useState<MediaKind[]>(initial.selectedMedia); 
const [areas, setAreas] = useState<AreaAnswer[]>(() => withSelection(initial.selectedMedia, initial.areas)); const [organization, setOrganization] = useState(initial.organization); 
const [proof, setProof] = useState(initial.proof); 
const [message, setMessage] = useState(""); 
const [busy, setBusy] = useState(false); 
const skipSave = useRef(false); 
const payload = useRef<DraftInput | null>(null); 
const draft = (): DraftInput => ({ 
role, 
name, 
age, 
reason, 
credentials, 
experience, 
selectedMedia: selected, 
areas, 
organization, 
opportunities: "", 
proof, 
}); 
payload.current = draft(); 
useEffect(() => { 
const sendDraft = () => { 
if (skipSave.current || !payload.current) return; 
const body = new Blob([JSON.stringify(payload.current)], { type: "application/json" }); navigator.sendBeacon("/api/application/draft", body); 
}; 
const onClick = (event: MouseEvent) => { 
const target = event.target; 
if (!(target instanceof Element)) return; 
const anchor = target.closest("a"); 
if (!anchor) return; 
const href = anchor.getAttribute("href"); 
if (!href || href.startsWith("#") || anchor.getAttribute("target") === "_blank") return; if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || skipSave.current) return; event.preventDefault();
event.stopPropagation(); 
void fetch("/api/application/draft", { 
method: "POST", 
headers: { "Content-Type": "application/json" }, 
body: JSON.stringify(payload.current), 
keepalive: true, 
}).finally(() => { 
window.location.assign(anchor.href); 
}); 
}; 
document.addEventListener("click", onClick, true); 
window.addEventListener("pagehide", sendDraft); 
return () => { 
document.removeEventListener("click", onClick, true); 
window.removeEventListener("pagehide", sendDraft); 
}; 
}, []); 
function chooseRole(next: ApplicantRole) { 
setRole(next); 
setMessage(""); 
} 
function toggleMedia(media: MediaKind) { 
const next = selected.includes(media) 
? selected.filter((item) => item !== media) 
: [...selected, media]; 
const ordered = MEDIA.filter((item) => next.includes(item)); 
setSelected(ordered); 
setAreas((current) => withSelection(ordered, current)); 
} 
function updateArea(id: string, patch: Partial<AreaAnswer>) { 
setAreas((current) => current.map((area) => (area.id === id ? { ...area, ...patch } : area))); } 
function addLine() { 
const media = selected[0]; 
if (!media) return; 
setAreas((current) => [...current, newArea(media)]); 
} 
function removeLine(id: string) { 
const next = areas.filter((area) => area.id !== id); 
const still = MEDIA.filter((media) => next.some((area) => area.media === media)); setSelected(still); 
setAreas(withSelection(still, next)); 
} 
async function submit(kind: "draft" | "submit") { 
const payload = draft(); 
if (kind === "submit") { 
const missing = missingFields(payload); 
if (missing) { 
setMessage(missing); 
return; 
} 
} 
setBusy(true); 
setMessage("");
