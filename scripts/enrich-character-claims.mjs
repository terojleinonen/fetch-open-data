import fs from "node:fs";

const read = (name) => JSON.parse(fs.readFileSync(`data/${name}.json`, "utf8"));
const characters = read("characters");
const works = read("works");
const appearances = read("character-appearances");
const headers = { "User-Agent": "StephenKingUniverse-ScholarlyPreview/0.2 (local research prototype)" };
const retrievedAt = new Date().toISOString();
const wikipediaTitles = new Map([
  ["Annie Wilkes", "Annie Wilkes"],
  ["Crimson King", "Crimson King"],
  ["It (Creature)", "Pennywise"],
  ["Jack Torrance", "Jack Torrance"],
  ["Margaret White", "Margaret White (Carrie)"],
  ["Randall Flagg", "Randall Flagg"],
  ["Rose the Hat", "Rose the Hat"],
]);
const workById = new Map(works.map((work) => [work.id, work]));
const linkedWorks = new Map();
for (const appearance of appearances) {
  const work = workById.get(appearance.workId);
  if (!work) continue;
  const list = linkedWorks.get(appearance.characterId) || [];
  list.push({ id: work.id, title: work.title });
  linkedWorks.set(appearance.characterId, list);
}

async function json(url) {
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const response = await fetch(url, { headers, signal: AbortSignal.timeout(10000) });
      if (response.ok) return response.json();
    } catch {
      // Retry transient network and parsing failures.
    }
  }
  return null;
}

async function pool(items, worker, concurrency = 5) {
  let index = 0;
  await Promise.all(Array.from({ length: concurrency }, async () => {
    while (index < items.length) await worker(items[index++]);
  }));
}

const apiResponse = await json("https://stephen-king-api.onrender.com/api/villains");
const apiVillains = new Map((apiResponse?.data || []).map((item) => [item.name.toLowerCase(), item]));
const records = {};

const researchOrder = [...characters].sort((a, b) => Number(wikipediaTitles.has(b.name)) - Number(wikipediaTitles.has(a.name)));
await pool(researchOrder, async (character) => {
  const api = apiVillains.get(character.name.toLowerCase());
  const record = {
    characterId: character.id,
    displayName: character.name,
    editorialStatus: "provisional",
    claims: [],
    primaryVerificationNeeded: true,
  };

  const apiUrl = api ? `https://stephen-king-api.onrender.com/api/villain/${api.id}` : "https://stephen-king-api.onrender.com/api/villains";
  const apiSource = {
    provider: "Free Stephen King API",
    url: apiUrl,
    sourceClass: "community-dataset",
    verification: "provisional",
    retrievedAt,
    sourceNote: "The API describes its data only as publicly sourced and provides no record-level original citations.",
  };

  record.claims.push({ predicate: "identity", value: character.name, ...apiSource });
  if (api?.gender) record.claims.push({ predicate: "gender", value: api.gender, ...apiSource });
  if (api?.status) record.claims.push({ predicate: "lifeStatus", value: api.status, ...apiSource, spoiler: true });
  if (api?.notes?.length) record.claims.push({ predicate: "communityCategories", value: api.notes, ...apiSource });
  for (const work of linkedWorks.get(character.id) || []) record.claims.push({ predicate: "appearsIn", value: work.title, workId: work.id, ...apiSource });

  const exactTitle = wikipediaTitles.get(character.name);
  const query = `"${character.name}" "Stephen King" character`;
  const endpoint = exactTitle
    ? `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(exactTitle)}&prop=extracts%7Cinfo&exintro=1&explaintext=1&inprop=url&format=json&origin=*`
    : `https://en.wikipedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(query)}&gsrlimit=6&prop=extracts%7Cinfo&exintro=1&explaintext=1&inprop=url&format=json&origin=*`;
  const wiki = await json(endpoint);
  const pages = Object.values(wiki?.query?.pages || {}).sort((a, b) => (a.index || 0) - (b.index || 0));
  const normalizedName = character.name.replace(/\s*\([^)]*\)\s*/g, "").toLowerCase();
  const page = pages.find((candidate) => {
    const extract = candidate.extract || "";
    const title = (candidate.title || "").toLowerCase();
    const titleMatch = exactTitle ? title === exactTitle.toLowerCase() : title.includes(normalizedName);
    return titleMatch && /Stephen King/i.test(extract) && /fictional character|character in|antagonist|protagonist/i.test(extract);
  });
  if (page) {
    const sentences = (page.extract.match(/[^.!?]+[.!?]+/g) || [page.extract]).slice(0, 3).join(" ").replace(/\s+/g, " ").trim().slice(0, 900);
    record.claims.push({
      predicate: "description",
      value: sentences,
      provider: "Wikipedia",
      url: page.fullurl,
      sourceTitle: page.title,
      revisionId: page.lastrevid,
      license: "CC BY-SA 4.0",
      sourceClass: "secondary-reference",
      verification: "secondary-verified",
      retrievedAt,
      sourceNote: "Direct character article matched by character name and Stephen King context; primary-text verification remains desirable.",
    });
    record.editorialStatus = "secondary-verified";
  }
  records[character.id] = record;
});

const output = {
  schemaVersion: 1,
  generatedAt: retrievedAt,
  methodology: {
    levels: {
      "primary-verified": "Checked against a named edition of Stephen King's text with a chapter or page locator.",
      "secondary-verified": "Supported by a directly matched reference source, but not yet checked against the primary text.",
      provisional: "Imported from a community dataset whose original record-level sources are undocumented.",
    },
    aiPolicy: "Automated tools may locate and structure evidence, but are not treated as a source. No unsourced generated biography is published.",
  },
  characters: records,
};
fs.writeFileSync("data/character-claims.json", `${JSON.stringify(output, null, 2)}\n`);
console.log(JSON.stringify({ total: characters.length, secondaryVerified: Object.values(records).filter((record) => record.editorialStatus === "secondary-verified").length, provisional: Object.values(records).filter((record) => record.editorialStatus === "provisional").length }, null, 2));
