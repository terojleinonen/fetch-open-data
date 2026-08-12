import fs from "node:fs";
const R=n=>JSON.parse(fs.readFileSync(`data/${n}.json`,"utf8"));
const chars=R("characters"),apps=R("character-appearances"),works=R("works"),adaptations=R("adaptations"),d=R("descriptions");
const headers={"User-Agent":"StephenKingUniverse-ScholarlyPreview/0.1 (local research prototype)"},retrievedAt=new Date().toISOString();
const clean=t=>{const s=String(t||"").replace(/<[^>]+>/g," ").replace(/\s+/g," ").trim();return (s.match(/[^.!?]+[.!?]+/g)?.slice(0,2).join(" ")||s).slice(0,620).trim()};
async function get(url){for(let n=0;n<2;n++)try{const r=await fetch(url,{headers,signal:AbortSignal.timeout(8000)});if(r.ok)return r.json();}catch{/* Retry transient network and parsing failures. */}return null}
async function pool(items,fn){let i=0;await Promise.all(Array.from({length:5},async()=>{while(i<items.length){const n=i++;await fn(items[n],n)}}))}
const save=()=>fs.writeFileSync("data/descriptions.json",JSON.stringify({...d,generatedAt:retrievedAt},null,2)+"\n");

// Remove previously accepted literary matches that point to films, collections, or unrelated pages.
const workById=new Map(works.map(w=>[w.id,w]));
for(const [id,x] of Object.entries(d.works)){
 const w=workById.get(id);if(!w)delete d.works[id];else{const esc=w.title.replace(/[.*+?^${}()|[\]\\]/g,"\\$&");const ok=new RegExp(`^${esc}(?: \\((?:King )?(?:novel|novella|short story|poem|play|book)\\))?$`,"i").test(x.sourceTitle||w.title)||x.provider==="Open Library";if(!ok)delete d.works[id];}
}
save();

const titleByWork=new Map(works.map(w=>[w.id,w.title])),linked=new Map();for(const a of apps){const t=titleByWork.get(a.workId);if(t)(linked.get(a.characterId)||linked.set(a.characterId,[]).get(a.characterId)).push(t)}
await pool(chars,async c=>{const q=`"${c.name}" Stephen King character`;const u=`https://en.wikipedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(q)}&gsrlimit=4&prop=extracts%7Cinfo&exintro=1&explaintext=1&inprop=url&format=json&origin=*`;const j=await get(u),pages=Object.values(j?.query?.pages||{}).sort((a,b)=>(a.index||0)-(b.index||0));const titles=linked.get(c.id)||[];const p=pages.find(p=>p.extract&&(/Stephen King/i.test(p.extract)||titles.some(t=>p.extract.toLowerCase().includes(t.toLowerCase()))));if(p)d.characters[c.id]={text:clean(p.extract),provider:"Wikipedia",license:"CC BY-SA 4.0",sourceUrl:p.fullurl,sourceTitle:p.title,revisionId:p.lastrevid,retrievedAt,adapted:false}});save();

await pool(adaptations,async a=>{if(d.adaptations[a.id])return;const url=a.facts?.wikipedia;if(!url)return;const title=decodeURIComponent(new URL(url).pathname.split("/wiki/")[1]||"");const u=`https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(title)}&prop=extracts%7Cinfo&exintro=1&explaintext=1&inprop=url&format=json&origin=*`;const j=await get(u),p=Object.values(j?.query?.pages||{})[0];if(p?.extract)d.adaptations[a.id]={text:clean(p.extract),provider:"Wikipedia",license:"CC BY-SA 4.0",sourceUrl:p.fullurl||url,sourceTitle:p.title,revisionId:p.lastrevid,retrievedAt,adapted:false}});save();
console.log(JSON.stringify({works:Object.keys(d.works).length,characters:Object.keys(d.characters).length,adaptations:Object.keys(d.adaptations).length},null,2));
