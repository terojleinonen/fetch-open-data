import fs from "node:fs";

const token=process.env.TMDB_READ_ACCESS_TOKEN;
if(!token)throw new Error("TMDB_READ_ACCESS_TOKEN is not configured");
const adaptations=JSON.parse(fs.readFileSync("data/adaptations.json","utf8"));
const outputPath="data/screen-details.json";
const prior=fs.existsSync(outputPath)?JSON.parse(fs.readFileSync(outputPath,"utf8")):{schemaVersion:1,records:{}};
const records=prior.records||{};
const retrievedAt=new Date().toISOString();
const headers={Authorization:`Bearer ${token}`,Accept:"application/json","User-Agent":"StephenKingUniverse-ScholarlyPreview/0.4"};
const normalize=(value)=>String(value||"").toLowerCase().normalize("NFKD").replace(/['’]/g,"").replace(/[^a-z0-9]+/g," ").trim();
const searchTitle=(title)=>title.replace(/^['’]/,"").replace(/\s*\((?:\d{4}\s+)?(?:film|tv film|television film|miniseries|tv series|television series|movie)\)\s*$/i,"").trim();
const mediaType=(item)=>/tv film|television film/i.test(item.title)?"movie":item.type==="movie"?"movie":"tv";
async function get(path){for(let attempt=0;attempt<3;attempt++){try{const response=await fetch(`https://api.themoviedb.org/3${path}`,{headers,signal:AbortSignal.timeout(12000)});if(response.ok)return response.json();if(response.status===429)await new Promise(r=>setTimeout(r,1200));}catch{/* Retry transient network and parsing failures. */}}return null}
async function pool(items,worker,size=4){let index=0;await Promise.all(Array.from({length:size},async()=>{while(index<items.length)await worker(items[index++])}))}
const save=()=>fs.writeFileSync(outputPath,JSON.stringify({schemaVersion:1,generatedAt:retrievedAt,licensePolicy:{usage:"TMDB developer API — non-commercial use with attribution",notice:"This product uses the TMDB API but is not endorsed or certified by TMDB.",termsUrl:"https://developer.themoviedb.org/docs/faq"},records},null,2)+"\n");

await pool(adaptations,async(item)=>{
  const type=mediaType(item),query=searchTitle(item.title);
  const search=await get(`/search/${type}?query=${encodeURIComponent(query)}&include_adult=false&language=en-US`);
  const candidates=search?.results||[];
  const target=normalize(query);
  const match=candidates.map(candidate=>{const title=type==="movie"?candidate.title:candidate.name;const date=type==="movie"?candidate.release_date:candidate.first_air_date;const year=Number(String(date||"").slice(0,4))||undefined;const exact=normalize(title)===target;const yearDistance=item.year&&year?Math.abs(item.year-year):0;return{candidate,title,year,score:(exact?100:0)-(yearDistance*20)+(candidate.popularity||0)/100}}).filter(x=>normalize(x.title).includes(target)||target.includes(normalize(x.title))).sort((a,b)=>b.score-a.score)[0];
  if(!match||(!normalize(match.title).includes(target)&&!target.includes(normalize(match.title))))return;
  if(item.year&&match.year&&Math.abs(item.year-match.year)>1)return;
  const detail=await get(`/${type}/${match.candidate.id}?append_to_response=credits,external_ids&language=en-US`);if(!detail)return;
  const crew=detail.credits?.crew||[],cast=detail.credits?.cast||[];
  const directors=[...new Map(crew.filter(person=>person.job==="Director").map(person=>[person.id,{name:person.name,tmdbId:person.id}])).values()];
  const producers=[...new Map(crew.filter(person=>["Producer","Executive Producer"].includes(person.job)).map(person=>[person.id,{name:person.name,role:person.job,tmdbId:person.id}])).values()].slice(0,8);
  records[item.id]={adaptationId:item.id,tmdbId:detail.id,mediaType:type,matchedTitle:type==="movie"?detail.title:detail.name,originalTitle:type==="movie"?detail.original_title:detail.original_name,releaseDate:type==="movie"?detail.release_date:detail.first_air_date,year:Number(String(type==="movie"?detail.release_date:detail.first_air_date).slice(0,4))||item.year,runtime:type==="movie"?detail.runtime:detail.episode_run_time?.[0],overview:detail.overview||null,posterUrl:detail.poster_path?`https://image.tmdb.org/t/p/w500${detail.poster_path}`:null,backdropUrl:detail.backdrop_path?`https://image.tmdb.org/t/p/w1280${detail.backdrop_path}`:null,recordUrl:`https://www.themoviedb.org/${type}/${detail.id}`,directors,producers,cast:cast.slice(0,8).map(person=>({name:person.name,character:person.character,order:person.order,tmdbId:person.id})),productionCompanies:(detail.production_companies||[]).map(company=>company.name),countries:(detail.production_countries||[]).map(country=>country.name),externalIds:detail.external_ids||{},source:{provider:"TMDB",retrievedAt,attribution:"This product uses the TMDB API but is not endorsed or certified by TMDB.",termsUrl:"https://developer.themoviedb.org/docs/faq"}};
  if(Object.keys(records).length%10===0)save();
});
save();
console.log(JSON.stringify({total:adaptations.length,enriched:Object.keys(records).length,withPosters:Object.values(records).filter(record=>record.posterUrl).length,withOverview:Object.values(records).filter(record=>record.overview).length},null,2));
