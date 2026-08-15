"use client";
import Link from "next/link";
import {useMemo,useState} from "react";
import type {Place,PlaceKind} from "@/lib/places";
import type {CSSProperties} from "react";

const shape="M383 277L389 240L386 237L385 137L380 63L322 21L290 38L256 49L238 30L240 14L233 11L222 7L211 15L181 53L146 100L121 165L111 173L98 191L94 199L100 207L93 218L94 221L92 232L100 237L95 247L80 260L82 270L56 287L45 306L55 317L52 323L42 318L32 321L31 338L25 345L20 332L11 328L2 334L5 377L9 452L12 534L14 577L17 605L13 622L15 632L23 640L32 648L32 658L46 674L57 688L71 674L87 633L165 578L235 559L294 539L350 491L408 473L451 447L486 416L457 355L427 350L427 322L424 305L404 287Z";

// Editorial coordinates use the map's fixed 500 × 700 coordinate system.
// Exact real places follow their geographic relationship; fictional places are
// intentionally approximate and are kept away from the coastline unless the
// source describes an island or coastal setting.
const corrected:Record<string,[number,number]>={
  derry:[252,432],"castle-rock":[91,566],"jerusalems-lot":[137,534],
  chamberlain:[112,602],ludlow:[225,414],haven:[167,477],
  "chesters-mill":[72,542],"little-tall-island":[372,548],
  "tarkers-mills":[102,502],harlow:[152,493],bridgton:[63,617],
  bangor:[252,445],durham:[84,640],portland:[72,661]
};
const point=(place:Place)=>corrected[place.id]??(place.x!==undefined&&place.y!==undefined?[place.x,place.y]:undefined);

export function PlacesExplorer({places}:{places:Place[]}){
  const[kind,setKind]=useState<"all"|PlaceKind>("all");
  const[query,setQuery]=useState("");
  const[selected,setSelected]=useState("derry");
  const visible=useMemo(()=>places.filter(p=>(kind==="all"||p.kind===kind)&&`${p.name} ${p.region} ${p.summary} ${p.workTitles.join(" ")} ${p.inspiration||""}`.toLowerCase().includes(query.toLowerCase())),[kind,query,places]);
  const active=places.find(p=>p.id===selected);
  return <>
    <section className="atlas">
      <div className="atlas-copy"><span>THE FICTIONAL GEOGRAPHY</span><h2>THE MAINE<br/><i>THAT ISN&apos;T.</i></h2><p>Markers distinguish real places from King&apos;s fictional geography. Dashed rings indicate approximate placement—not canonical coordinates.</p><div className="map-legend"><b><i/> Fictional</b><b><i className="real"/> Real</b><b><i className="inspired"/> Inspiration</b></div>{active&&<Link className="map-selection" href={`/places/${active.id}`}><small>{active.mapStatus} · {active.region}</small><strong>{active.name}</strong><p>{active.summary}</p><b>OPEN PLACE RECORD ↗</b></Link>}</div>
      <div className="maine-map"><svg viewBox="-28 -8 556 716" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Map of Maine with literary locations"><path className="maine-shape" d={shape}/>{places.map(p=>{const pos=point(p);if(!pos)return null;const[x,y]=pos,west=x>330;return <g className={`map-marker marker-${p.id} ${p.kind} ${p.mapStatus} ${selected===p.id?"active":""}`} transform={`translate(${x} ${y})`} onClick={()=>setSelected(p.id)} role="button" tabIndex={0} onKeyDown={e=>{if(e.key==="Enter"||e.key===" ")setSelected(p.id)}} aria-label={`${p.name}, ${p.mapStatus}`} key={p.id}><circle r="8"/><circle r="16"/><text x={west?-13:13} y="-10" textAnchor={west?"end":"start"}>{p.name}</text></g>})}</svg><small>BOUNDARY: U.S. CENSUS BUREAU CARTOGRAPHIC DATA · FICTIONAL PLACEMENTS ARE EDITORIAL</small></div>
    </section>
    <section className="places-directory"><header className="directory-mast"><span>THE ATLAS / {places.length} RECORDS</span><h2>PLACES<br/><i>THAT REMEMBER.</i></h2><p>Search the evidence.<br/>Filter the territory.<br/>Enter the record.</p></header><div className="places-tools"><label><span>TYPE TO LOCATE A PLACE, WORK OR REGION</span><div className="search-paper"><b>⌕</b><input type="search" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Derry, Colorado, The Stand…"/><small>SEARCH THE ATLAS</small></div></label><div className="filter-index"><span>REALITY STATUS</span>{(["all","fictional","real","screen"] as const).map((v,index)=><button className={kind===v?"active":""} onClick={()=>setKind(v)} key={v}><small>0{index+1}</small>{v}<b>{v==="all"?places.length:places.filter(p=>p.kind===v).length}</b></button>)}</div></div><div className="directory-register"><p><b>{visible.length}</b> records match the observation</p><span>BY PLACE / BY EVIDENCE / BY MEMORY</span></div><div className="places-list">{visible.map((p,index)=>{const illustrated=p.kind==="fictional",style=illustrated?{"--row-art":`url('/art/places/${p.id}-v1.jpeg')`} as CSSProperties:undefined;return <Link href={`/places/${p.id}`} style={style} className={`place-row ${illustrated?"place-row-illustrated":""} ${index%7===0?"place-row-feature":""}`} key={p.id}>{illustrated&&<span className="place-row-art" aria-hidden="true"/>}<span className="place-number">{String(index+1).padStart(2,"0")}</span><span className={`place-kind ${p.kind}`}>{p.kind}</span><h3>{p.name}</h3><p>{p.region}</p><small>{p.workTitles.length} linked work{p.workTitles.length===1?"":"s"}</small><b>{p.mapStatus} ↗</b>{index%7===0&&<i>OPEN<br/>CASE FILE</i>}</Link>})}</div></section>
  </>;
}
