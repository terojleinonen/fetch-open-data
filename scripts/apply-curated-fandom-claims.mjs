import fs from "node:fs";

const path = "data/character-claims.json";
const data = JSON.parse(fs.readFileSync(path, "utf8"));
const retrievedAt = new Date().toISOString();
const license = "CC BY-SA 3.0";
const licenseUrl = "https://creativecommons.org/licenses/by-sa/3.0/";
const entries = {
  "Blaine the Mono": { url:"https://stephenking.fandom.com/wiki/Blaine_the_Mono", text:"Blaine is an artificial-intelligence monorail operating between Lud and Topeka in All-World. The surviving Imperium machine serves as an antagonist in The Waste Lands and at the opening of Wizard and Glass.", role:"Antagonist", subjects:["Artificial intelligence","Monorail","The Dark Tower"] },
  "Christine (car)": { url:"https://stephenking.fandom.com/wiki/Christine_%28car%29", text:"Christine is the possessed 1958 Plymouth Fury bought and restored by Arnie Cunningham. The car exerts an obsessive influence over its owner and is capable of acting and repairing itself independently.", role:"Antagonist", subjects:["Possessed vehicle","Christine"] },
  "Cujo": { url:"https://stephenking.fandom.com/wiki/Cujo", text:"Cujo is the Camber family's Saint Bernard and the title character of Cujo. After contracting rabies, the formerly friendly dog becomes the central physical threat of the story.", role:"Tragic antagonist", subjects:["Dog","Rabies","Castle Rock"] },
  "Greg Stillson": { url:"https://stephenking.fandom.com/wiki/Greg_Stillson", text:"Greg Stillson is a politician and the principal antagonist of The Dead Zone. Johnny Smith's vision connects Stillson's future rise to the presidency with a catastrophic nuclear conflict.", role:"Main antagonist", subjects:["Politician","The Dead Zone"] },
  "John Rainbird": { url:"https://stephenking.fandom.com/wiki/John_Rainbird", text:"John Rainbird is an operative and assassin employed by the Shop in Firestarter. A scarred Vietnam veteran, he becomes fixated on Charlie McGee while participating in her captivity.", role:"Antagonist", subjects:["The Shop","Firestarter"] },
  "Kurt Barlow": { url:"https://stephenking.fandom.com/wiki/Kurt_Barlow", text:"Kurt Barlow is the vampire antagonist of 'Salem's Lot. He comes to Jerusalem's Lot with Richard Straker and begins turning the town's residents into vampires.", role:"Main antagonist", subjects:["Vampire","Jerusalem's Lot"] },
  "Leland Gaunt": { url:"https://stephenking.fandom.com/wiki/Leland_Gaunt", text:"Leland Gaunt is the supernatural proprietor of the shop Needful Things and the novel's principal antagonist. He offers customers objects they intensely desire while manipulating them into acts that spread violence through Castle Rock.", role:"Main antagonist", subjects:["Demon","Shopkeeper","Castle Rock"] },
  "Percy Wetmore": { url:"https://stephenking.fandom.com/wiki/Percy_Wetmore", text:"Percy Wetmore is a prison guard and supporting antagonist in The Green Mile. His political connections protect him at Cold Mountain Penitentiary despite his cruelty toward prisoners and conflict with the other guards.", role:"Supporting antagonist", subjects:["Prison guard","The Green Mile"] },
};

for (const record of Object.values(data.characters)) {
  const entry = entries[record.displayName];
  if (!entry) continue;
  record.claims = record.claims.filter((claim) => !(claim.provider === "Stephen King Wiki / Fandom"));
  const common = {
    provider:"Stephen King Wiki / Fandom", url:entry.url, license, licenseUrl,
    sourceClass:"community-reference", verification:"secondary-verified", retrievedAt,
    attribution:`Adapted from “${record.displayName}” on Stephen King Wiki (Fandom).`,
    changes:"Condensed, paraphrased and edited for this site.",
    sourceNote:"Community-authored reference text; useful corroboration, but primary-text verification remains required.",
  };
  record.claims.push({ predicate:"description", value:entry.text, ...common });
  record.claims.push({ predicate:"narrativeRole", value:entry.role, ...common });
  record.claims.push({ predicate:"subjects", value:entry.subjects, ...common });
  record.editorialStatus = "secondary-verified";
}
data.generatedAt = retrievedAt;
data.methodology.fandomPolicy = "Adapted Fandom text is attributed, linked, marked as modified, and distributed under CC BY-SA 3.0. Images are excluded unless separately licensed.";
fs.writeFileSync(path, `${JSON.stringify(data, null, 2)}\n`);
console.log(JSON.stringify({ fandomProfiles:Object.keys(entries).length, secondaryVerified:Object.values(data.characters).filter((record) => record.editorialStatus === "secondary-verified").length }, null, 2));
