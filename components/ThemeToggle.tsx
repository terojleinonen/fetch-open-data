"use client";

import {useEffect,useState} from "react";

export function ThemeToggle(){
  const [theme,setTheme]=useState<"noir"|"ivory">("noir");
  useEffect(()=>{const frame=requestAnimationFrame(()=>{const saved=localStorage.getItem("sku-theme")==="ivory"?"ivory":"noir";setTheme(saved);document.documentElement.dataset.theme=saved});return()=>cancelAnimationFrame(frame)},[]);
  const change=()=>{const next=theme==="noir"?"ivory":"noir";setTheme(next);document.documentElement.dataset.theme=next;localStorage.setItem("sku-theme",next)};
  return <button className="theme-toggle" type="button" onClick={change} aria-label={`Switch to ${theme==="noir"?"Ivory Light":"Maine Noir"} theme`}><i aria-hidden="true"/><span>{theme==="noir"?"IVORY LIGHT":"MAINE NOIR"}</span></button>;
}
