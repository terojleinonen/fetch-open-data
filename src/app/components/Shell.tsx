"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, FileText, ShieldAlert, Info, Menu, X, Network, Clock3 } from "lucide-react";
import { useState } from "react";
import ThemeToggle from "./ThemeToggle";
import { ArchiveMark } from "./icons";
const items=[{href:"/books",label:"Books",icon:BookOpen},{href:"/short-stories",label:"Short stories",icon:FileText},{href:"/villains",label:"Villains",icon:ShieldAlert},{href:"/#connections",label:"Connections",icon:Network},{href:"/#timeline",label:"Timeline",icon:Clock3},{href:"/about",label:"About",icon:Info}];
export default function Shell({children}:{children:React.ReactNode}){const path=usePathname();const [open,setOpen]=useState(false);return <div className="appShell"><button className="mobileMenu" onClick={()=>setOpen(!open)} aria-label="Toggle archive navigation">{open?<X/>:<Menu/>}</button><aside className={`sideRail ${open?"open":""}`}><Link href="/" className="brand" onClick={()=>setOpen(false)}><span>Stephen King</span><strong>Universe</strong></Link><div className="truthLabel"><span>Recovered archive</span><small>Truth survives in fragments.</small></div><nav>{items.map(({href,label,icon:Icon})=><Link key={label} href={href} className={path===href?"active":""} onClick={()=>setOpen(false)}><Icon size={17}/><span>{label}</span></Link>)}</nav><ThemeToggle/><div className="railFooter"><ArchiveMark/><span>Archive division<br/>S.K.U. v2.0</span></div></aside><div className="contentFrame">{children}</div>{open&&<button className="navBackdrop" onClick={()=>setOpen(false)} aria-label="Close navigation"/>}</div>}
