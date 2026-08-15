import Link from "next/link";
import {notFound} from "next/navigation";
import {getPlace,placeWorks,places} from "@/lib/places";
import {placeResearchPaths,slugify} from "@/lib/data";
import type {CSSProperties} from "react";
import {FitTitle} from "@/components/FitTitle";

export function generateStaticParams(){return places.map(p=>({slug:p.id}))}

export default async function PlaceDetail({params}:{params:Promise<{slug:string}>}){
  const{slug}=await params,p=getPlace(slug);if(!p)notFound();
  const linked=placeWorks(p),research=placeResearchPaths(p.id);
  const reading=p.mapStatus==="exact"?"This marker represents a real-world place. Its literary relationship is documented separately.":p.mapStatus==="unmapped"?"This place is intentionally not pinned to the Maine atlas.":"The marker communicates an approximate narrative region. It is not a canonical coordinate.";
  const record=String(places.findIndex(x=>x.id===p.id)+1).padStart(2,"0");
  const artStyle=p.kind==="fictional"?{"--place-art":`url('/art/places/${p.id}-v1.jpeg')`} as CSSProperties:undefined;
  return <main className={`place-record place-art-${p.id}`} style={artStyle}>
    <section className="place-record-hero"><div className="place-record-image"/><Link className="place-record-back" href="/places">← RETURN TO THE ATLAS</Link><div className="place-record-index"><span>PLACE RECORD</span><b>{record} / {places.length}</b></div><div className={`place-record-heading name-${p.name.length<=12?"short":p.name.length<=23?"medium":"long"}`}><small>{p.kind} / {p.region} / {p.mapStatus}</small><FitTitle title={p.name}/><p>{p.summary}</p></div><div className={`place-record-stamp ${p.mapStatus}`}>{p.mapStatus}<br/>location</div><div className="place-record-rule"><span>THE FICTIONAL GEOGRAPHY</span><span>{p.x!==undefined?`EDITORIAL GRID ${p.x} / ${p.y}`:"COORDINATES WITHHELD"}</span></div></section>
    <section className="place-record-body"><div className="place-dossier"><div className="place-dossier-label"><span>CASE FILE / GEOGRAPHY</span><b>{p.name}</b></div><div className="place-facts"><div><span>Place class</span><b>{p.kind}</b></div><div><span>Map confidence</span><b>{p.mapStatus}</b></div><div><span>Region</span><b>{p.region}</b></div>{p.inspiration&&<div><span>Real-world relationship</span><b>{p.inspiration}</b></div>}</div><blockquote>“A place in the record is not necessarily a place on the earth.”</blockquote></div><aside className="place-reading"><span>MAP READING / EVIDENCE</span><p>{reading}</p><div className="source-note"><b>SOURCE NOTE</b><p>{p.source.note}</p><a href={p.source.url} target="_blank" rel="noreferrer">{p.source.name} ↗</a></div></aside></section>
    <section className="place-works"><header><span>WORKS IN THE RECORD</span><b>{linked.length.toString().padStart(2,"0")}</b></header><div>{linked.map((w,index)=><Link href={`/works/${slugify(w!.title)}`} key={w!.id}><small>{String(index+1).padStart(2,"0")}</small><strong>{w!.title}</strong><span>{w!.year||"UNDATED"}</span><b>OPEN CASE FILE →</b></Link>)}</div></section>
    {research&&<section className="identity-ledger research-paths"><header><span>RESEARCH PATHS</span><h2>BEYOND<br/><i>THE MAP.</i></h2><b>{(research.researchSources.length+1).toString().padStart(2,"0")}</b></header><div><article className="identity-claim"><small>01</small><div><span>CURATED REFERENCE</span><p>{p.source.note}</p></div><aside><span className="status secondary">reviewed link</span><a href={p.source.url} target="_blank" rel="noreferrer">{p.source.name} ↗</a></aside></article>{research.researchSources.map((source,index)=><article className="identity-claim" key={`${source.provider}-${source.url}`}><small>{String(index+2).padStart(2,"0")}</small><div><span>{source.sourceClass.replaceAll("-"," ")}</span><p>{source.sourceTitle}</p><small>{source.note}</small></div><aside><span className="status provisional">{source.verification.replaceAll("-"," ")}</span><a href={source.url} target="_blank" rel="noreferrer">{source.provider} ↗</a>{source.license&&<small>{source.license}</small>}</aside></article>)}</div><div className="identity-gap"><b>MAPS ARE CLAIMS</b><p>The opening summary is an orientation. Follow these records to inspect interpretations, community documentation and unresolved geographic evidence.</p></div></section>}
  </main>;
}
