"use client"; 
import { usePathname, useRouter } from "next/navigation"; 
const roots = new Set([ 
 "/", 
 "/creator", 
 "/mentor", 
 "/scout", 
 "/moderator", 
 "/administrator", 
 "/creator/desk", 
 "/mentor/desk", 
 "/scout/desk", 
 "/moderator/desk", 
 "/administrator/desk", 
]); 
const parents: Record<string, string> = { 
 "/saved": "/settings", 
 "/activity": "/settings", 
 "/notifications": "/settings", 
 "/messages": "/settings", 
 "/settings": "/profile", 
 "/profile/edit": "/profile", 
 "/feed": "/", 
 "/opportunities": "/scout/desk", 
}; 
const desks: Record<string, string> = { 
 creator: "/creator/desk", 
 mentor: "/mentor/desk", 
 scout: "/scout/desk", 
 moderator: "/moderator/desk", 
 administrator: "/administrator/desk", 
};
function fallbackPath(pathname: string) { 
 if (parents[pathname]) return parents[pathname]; 
 const parts = pathname.split("/").filter(Boolean); 
 if (parts.length === 2 && desks[parts[0]]) return desks[parts[0]]; 
 if (parts.length <= 1) return "/"; 
 return `/${parts.slice(0, -1).join("/")}`; 
} 
export function BackArrow() { 
 const pathname = usePathname(); 
 const router = useRouter(); 
 if (roots.has(pathname)) return null; 
 return ( 
 <div className="page-back"> 
 <button 
 type="button" 
 aria-label="Go back" 
 onClick={() => { 
 const here = window.location.href; 
 if (window.history.length <= 1) { 
 router.push(fallbackPath(pathname)); 
 return; 
 } 
 let moved = false; 
 const mark = () => { 
 moved = true; 
 }; 
 window.addEventListener("popstate", mark); 
 router.back(); 
 window.setTimeout(() => { 
 window.removeEventListener("popstate", mark); 
 if (!moved || window.location.href === here) router.push(fallbackPath(pathname));  }, 400); 
 }} 
 > 
 <svg viewBox="0 0 24 24" aria-hidden="true"> 
 <path d="M15.5 5 8.5 12l7 7" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="rou  nd" strokeLinejoin="round" />
 </svg>  </button>  </div> 
 ); 
}
