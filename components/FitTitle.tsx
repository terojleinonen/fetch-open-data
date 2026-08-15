"use client";

import {useLayoutEffect,useMemo,useRef} from "react";

type FitTitleProps={title:string;variant?:"hero"|"record";className?:string};

function balancedLines(title:string,maxLines:number){
  const words=title.trim().split(/\s+/).filter(Boolean);
  if(words.length<2)return [title];
  const lineCount=Math.min(maxLines,title.length>31?3:title.length>15?2:1,words.length);
  if(lineCount===1)return [title];
  const lines=Array.from({length:lineCount},()=>"");
  const target=title.length/lineCount;
  let line=0;
  for(const [wordIndex,word] of words.entries()){
    const next=lines[line]?`${lines[line]} ${word}`:word;
    const remainingWords=words.length-wordIndex-1;
    const remainingLines=lineCount-line-1;
    if(line<lineCount-1&&lines[line]&&next.length>target&&remainingWords>=remainingLines){line++;lines[line]=word}
    else lines[line]=next;
  }
  return lines.filter(Boolean);
}

export function FitTitle({title,variant="hero",className=""}:FitTitleProps){
  const frame=useRef<HTMLDivElement>(null),heading=useRef<HTMLHeadingElement>(null);
  const lines=useMemo(()=>balancedLines(title,variant==="hero"?3:2),[title,variant]);
  useLayoutEffect(()=>{
    const container=frame.current,element=heading.current;if(!container||!element)return;
    const fit=()=>{
      let low=variant==="hero"?(innerWidth<760?38:54):36,high=variant==="hero"?260:120,best=low;
      for(let pass=0;pass<10;pass++){
        const size=(low+high)/2;container.style.setProperty("--fit-font",`${size}px`);
        const fits=element.scrollWidth<=container.clientWidth-10&&element.scrollHeight<=container.clientHeight-6;
        if(fits){best=size;low=size}else high=size;
      }
      container.style.setProperty("--fit-font",`${Math.floor(best)}px`);
      element.dataset.fitted="true";
    };
    const observer=new ResizeObserver(fit);observer.observe(container);fit();
    document.fonts?.ready.then(fit);return()=>observer.disconnect();
  },[title,variant,lines.length]);
  return <div ref={frame} className={`fit-title-frame fit-title-${variant} lines-${lines.length} ${className}`}><h1 ref={heading} aria-label={title}>{lines.map((line,index)=><span key={`${line}-${index}`}>{line}</span>)}</h1></div>;
}
