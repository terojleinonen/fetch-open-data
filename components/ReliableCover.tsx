"use client";

import Image from "next/image";
import type {ReactNode} from "react";
import {useState} from "react";

type ReliableCoverProps = {
  src:string;
  alt:string;
  width:number;
  height:number;
  sizes:string;
  fallback:ReactNode;
  priority?:boolean;
  sourceSize?:"M"|"L";
};

function sizedOpenLibraryUrl(src:string,size:"M"|"L"){
  if(!src.startsWith("https://covers.openlibrary.org/"))return src;
  return src.replace(/-[SML]\.jpg(?=\?|$)/,`-${size}.jpg`);
}

export function ReliableCover({src,alt,width,height,sizes,fallback,priority=false,sourceSize="M"}:ReliableCoverProps){
  const [failed,setFailed]=useState(false);
  if(failed)return <>{fallback}</>;
  return <Image src={sizedOpenLibraryUrl(src,sourceSize)} alt={alt} width={width} height={height} sizes={sizes} priority={priority} onError={()=>setFailed(true)}/>;
}
