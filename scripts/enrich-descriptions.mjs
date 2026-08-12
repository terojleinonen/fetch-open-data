import fs from "node:fs";

const root = new URL("../", import.meta.url);
const read = name => JSON.parse(fs.readFileSync(new URL(`data/${name}.json`, root), "utf8"));
const works = read("works");
const characters = read("characters");
const appearances = read("character-appearances");
const adaptations = read("adaptations");
const editions = read("editions");
const outPath = new URL("data/descriptions.json", root);
const headers = {"User-Agent":"StephenKingUniverse-ScholarlyPreview/0.1 (local research prototype)"};
const retrievedAt = new Date().toISOString();
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
async function mapLimit(items, limit, worker) {
  let next=0;
  await Promise.all(Array.from({length:Math.min(limit,items.length)},async()=>{
    while(next<items.length){const index=next++;await worker(items[index],index);}
  }));
}

function clean(text) {
  if (!text) return null;
  const plain = String(text).replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  const sentences = plain.match(/[^.!?]+[.!?]+/g)?.slice(0, 2).join(" ").trim() || plain;
  return sentences.length > 620 ? `${sentences.slice(0, 617).replace(/\s+\S*$/, "")}…` : sentences;
}
async function json(url) {
  for(let attempt=0;attempt<3;attempt++){
    try { const r = await fetch(url, {headers}); if(r.ok)return await r.json(); if(r.status===429||r.status>=500)await delay(600*(attempt+1)); else return null; }
    catch { await delay(400*(attempt+1)); }
  }
  return null;
}
async function wikipediaByTitle(title, validator) {
  const result = await json(`https://en.wikipedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(title)}&gsrlimit=4&prop=extracts%7Cinfo&exintro=1&explaintext=1&inprop=url&format=json&origin=*`);
  const pages=Object.values(result?.query?.pages||{}).sort((a,b)=>(a.index||0)-(b.index||0));
  for (const page of pages) {
    if (page?.extract && validator(page.extract, page.title)) return {
      text: clean(page.extract), provider:"Wikipedia", license:"CC BY-SA 4.0",
      sourceUrl: page.fullurl || `https://en.wikipedia.org/wiki/${encodeURIComponent(page.title.replace(/ /g,"_"))}`,
      sourceTitle:page.title, revisionId:page.lastrevid, retrievedAt, adapted:false,
    };
  }
  return null;
}
async function wikipediaFromUrl(url) {
  if (!url) return null;
  const title = decodeURIComponent(new URL(url).pathname.split("/wiki/")[1] || "");
  const result = await json(`https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(title)}&prop=extracts%7Cinfo&exintro=1&explaintext=1&inprop=url&format=json&origin=*`);
  const page=Object.values(result?.query?.pages||{})[0];
  return page?.extract ? {text:clean(page.extract),provider:"Wikipedia",license:"CC BY-SA 4.0",sourceUrl:page.fullurl||url,sourceTitle:page.title,revisionId:page.lastrevid,retrievedAt,adapted:false} : null;
}
async function openLibraryDescription(isbn) {
  const edition = await json(`https://openlibrary.org/isbn/${encodeURIComponent(isbn)}.json`);
  const key = edition?.works?.[0]?.key;
  const work = key ? await json(`https://openlibrary.org${key}.json`) : null;
  const raw = typeof work?.description === "string" ? work.description : work?.description?.value;
  return raw ? {text:clean(raw),provider:"Open Library",license:"CC0 1.0",sourceUrl:`https://openlibrary.org/isbn/${encodeURIComponent(isbn)}`,sourceTitle:work?.title,retrievedAt,adapted:false} : null;
}
async function tvMazeDescription(adaptation) {
  const q = adaptation.title.replace(/\s*\([^)]*(?:TV|series|miniseries)[^)]*\)\s*/gi, "").trim();
  const hits = await json(`https://api.tvmaze.com/search/shows?q=${encodeURIComponent(q)}`);
  const targetYear = adaptation.year;
  const hit = (hits || []).find(x => {
    const year = Number(x.show?.premiered?.slice(0,4));
    const names = [x.show?.name, x.show?.name?.replace(/^Stephen King's\s+/i,"")].filter(Boolean).map(s=>s.toLowerCase());
    return x.show?.summary && names.some(n=>q.toLowerCase().includes(n)||n.includes(q.toLowerCase())) && (!targetYear || !year || Math.abs(year-targetYear)<=2);
  });
  return hit ? {text:clean(hit.show.summary),provider:"TVmaze",license:"CC BY-SA",sourceUrl:hit.show.url,sourceTitle:hit.show.name,retrievedAt,adapted:false} : null;
}

const descriptions = {schemaVersion:1,generatedAt:retrievedAt,policy:{editorialTextExcluded:true,openDescriptionsOnly:true,licenses:["CC0 1.0","CC BY-SA 4.0","CC BY-SA"]},works:{},characters:{},adaptations:{}};
const isbnByWork = new Map(editions.filter(e=>e.isbn13).map(e=>[e.workId,e.isbn13]));

await mapLimit(works,3,async (work,i)=>{
  const isbn = isbnByWork.get(work.id) || work.facts?.isbn;
  let record = isbn ? await openLibraryDescription(isbn.replace(/[^0-9X]/gi,"")) : null;
  if (!record) record = await wikipediaByTitle(`"${work.title}" Stephen King`, (extract,pageTitle) => {
    const escaped=work.title.replace(/[.*+?^${}()|[\]\\]/g,"\\$&");
    const titleMatch=new RegExp(`^${escaped}(?: \\((?:novel|novella|short story|collection|book|poem|play|screenplay)\\))?$`,"i").test(pageTitle);
    return titleMatch && /Stephen King/i.test(extract) && !/film directed|television series|film adaptation/i.test(extract.slice(0,220));
  });
  if (record?.text) descriptions.works[work.id]=record;
  if (i%25===0) await delay(100);
});

const workTitleById = new Map(works.map(w=>[w.id,w.title]));
const linkedTitles = new Map();
for (const a of appearances) { const title=workTitleById.get(a.workId); if(title){const list=linkedTitles.get(a.characterId)||[];list.push(title);linkedTitles.set(a.characterId,list);} }
await mapLimit(characters,3,async (c,i)=>{
  const titles=linkedTitles.get(c.id)||[];
  const record = await wikipediaByTitle(`"${c.name}" Stephen King character`, extract => /Stephen King/i.test(extract) || titles.some(t=>extract.toLowerCase().includes(t.toLowerCase())));
  if (record?.text) descriptions.characters[c.id]=record;
  if (i%25===0) await delay(100);
});

await mapLimit(adaptations,3,async (a,i)=>{
  let record = a.type==="television" ? await tvMazeDescription(a) : null;
  if (!record) record = await wikipediaFromUrl(a.facts?.wikipedia);
  if (record?.text) descriptions.adaptations[a.id]=record;
  if (i%25===0) await delay(100);
});

fs.writeFileSync(outPath, JSON.stringify(descriptions,null,2)+"\n");
console.log(JSON.stringify({works:Object.keys(descriptions.works).length,characters:Object.keys(descriptions.characters).length,adaptations:Object.keys(descriptions.adaptations).length},null,2));
