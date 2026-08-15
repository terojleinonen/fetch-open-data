import rawWorks from "@/data/works.json";
import rawCharacters from "@/data/characters.json";
import rawAppearances from "@/data/character-appearances.json";
import rawAdaptations from "@/data/adaptations.json";
import rawEditions from "@/data/editions.json";
import rawDescriptions from "@/data/descriptions.json";
import rawCharacterClaims from "@/data/character-claims.json";
import rawAwards from "@/data/awards.json";
import rawScreenDetails from "@/data/screen-details.json";
import rawResearchIndex from "@/data/research-index.json";
import rawAntagonistStatus from "@/data/antagonist-status.json";

export type Source = { name: string; url?: string; confidence?: number; status?: string };
export type Facts = { publisher?: string; isbn?: string; pages?: number; type?: string; originallyPublishedIn?: string; collectedIn?: string; categories?: string[]; subjects?: string[]; villains?: string[] };
export type Work = { id: string; type: string; title: string; year?: number; status: string; facts?: Facts; sources?: Source[]; dataNote?: string };
export type Character = { id: string; name: string; status: string; characterType: string; sources?: Source[] };
export type Appearance = { characterId: string; workId: string; confidence: number };
export type Adaptation = { id: string; type: string; title: string; year?: number; facts?: { originalWorkTitle?: string; originalWorkType?: string; wikipedia?: string } };
export type Cover = { provider: "Open Library"; imageUrl: string; recordUrl: string; isbn13: string; attribution: string };
export type Edition = { id: string; workId: string; title: string; publisher?: string; isbn13?: string; pageCount?: number; cover?: Cover | null };
export type DescriptionRecord = { text: string; provider: string; license: string; sourceUrl: string; sourceTitle: string; retrievedAt: string; revisionId?: number; adapted?: boolean };
type DescriptionIndex = { works: Record<string, DescriptionRecord>; characters: Record<string, DescriptionRecord>; adaptations: Record<string, DescriptionRecord> };
export type VerificationLevel = "primary-verified" | "secondary-verified" | "provisional";
export type CharacterClaim = { predicate: string; value: string | string[]; provider: string; url: string; sourceClass: string; verification: VerificationLevel; retrievedAt: string; sourceTitle?: string; revisionId?: number; license?: string; licenseUrl?: string; attribution?: string; changes?: string; sourceNote?: string; workId?: string; spoiler?: boolean };
export type CharacterResearch = { characterId: string; displayName: string; editorialStatus: VerificationLevel; claims: CharacterClaim[]; primaryVerificationNeeded: boolean };
type CharacterClaimIndex = { characters: Record<string, CharacterResearch> };
export type ResearchSource = { provider: string; url: string; sourceTitle: string; sourceClass: string; verification: string; retrievedAt: string; note: string; license?: string; licenseUrl?: string };
export type ResearchRecord = { entityType: "character"; entityId: string; displayName: string; intro: { text: string; provider: string; url: string; status: string; license?: string; attribution?: string; changes?: string; adapted?: boolean } | null; sourceStatus: string; officialMatches: { workTitle: string; url: string; description: string }[]; researchSources: ResearchSource[]; primaryVerificationNeeded: boolean };
type ResearchIndex = { characters: Record<string, ResearchRecord>; places: Record<string, { entityType: "place"; entityId: string; displayName: string; sourceStatus: string; researchSources: ResearchSource[]; primaryVerificationNeeded: boolean }> };
export type Award = { workTitle: string; organization: string; award: string; result: string; year: number; sourceUrl: string; source: string };
export type ScreenPerson = { name: string; tmdbId: number; character?: string; role?: string; order?: number };
export type ScreenDetail = { adaptationId: string; tmdbId: number; mediaType: "movie" | "tv"; matchedTitle: string; originalTitle?: string; releaseDate?: string; year?: number; runtime?: number; overview?: string | null; posterUrl?: string | null; backdropUrl?: string | null; recordUrl: string; directors: ScreenPerson[]; producers: ScreenPerson[]; cast: ScreenPerson[]; productionCompanies: string[]; countries: string[]; externalIds?: Record<string, string | null>; source: { provider: "TMDB"; retrievedAt: string; attribution: string; termsUrl: string } };
type ScreenDetailIndex = { records: Record<string, ScreenDetail> };

const correctedYears: Record<string, number> = {
  "Beachworld": 1985, "General": 1997, "The Eyes of the Dragon": 1987,
  "The Mist": 1980, "The Reach": 1985, "The Talisman": 1984,
  "The Pit and the Pendulum": 1961, "The Undead": 1963,
};

export const slugify = (s: string) => s.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const illustratedCharacterSlugs = new Set(["annie-wilkes", "randall-flagg", "it-creature", "jack-torrance", "margaret-white", "leland-gaunt", "kurt-barlow", "cujo", "christine-car", "rose-the-hat", "crimson-king", "lester-lowe"]);
export const characterArt = (name: string) => { const slug = slugify(name); return illustratedCharacterSlugs.has(slug) ? `/art/characters/${slug}-v1.jpeg` : undefined };
const characterPlaceholderArt = [
  "/art/entity-placeholders/character-rain-glass-v1.jpg", "/art/entity-placeholders/character-night-street-v1.jpg",
  "/art/entity-placeholders/character-forest-threshold-v1.jpg", "/art/entity-placeholders/character-corridor-door-v1.jpg",
  "/art/entity-placeholders/character-archive-desk-v1.jpg", "/art/entity-placeholders/character-coastal-bus-stop-v1.jpg",
];
const antagonistPlaceholderArt = [
  "/art/entity-placeholders/antagonist-redacted-form-v1.jpg", "/art/entity-placeholders/antagonist-void-v1.jpg",
  "/art/entity-placeholders/antagonist-fractured-portrait-v1.jpg", "/art/entity-placeholders/antagonist-spreading-shadow-v1.jpg",
  "/art/entity-placeholders/antagonist-corrupted-object-v1.jpg", "/art/entity-placeholders/antagonist-cosmic-static-v1.jpg",
];
export type ThreatVisualClass = "human" | "supernatural" | "cosmic" | "object" | "unclassified";
export const classifyThreatVisual = (text: string): ThreatVisualClass => {
  const value = text.toLowerCase();
  if (/car|automobile|object|hotel|house|machine|vehicle/.test(value)) return "object";
  if (/cosmic|dimension|universe|entity|crimson king|todash/.test(value)) return "cosmic";
  if (/demon|vampire|werewolf|ghost|supernatural|creature|monster|shapeshift|undead/.test(value)) return "supernatural";
  if (/human|manipulat|murder|killer|woman|man|psycholog/.test(value)) return "human";
  return "unclassified";
};
const antagonistClassArt: Record<ThreatVisualClass, string> = { human: antagonistPlaceholderArt[2], supernatural: antagonistPlaceholderArt[3], cosmic: antagonistPlaceholderArt[5], object: antagonistPlaceholderArt[4], unclassified: antagonistPlaceholderArt[1] };
const stableArtIndex = (name: string, length: number) => {
  let hash = 2166136261;
  for (const character of slugify(name)) { hash ^= character.charCodeAt(0); hash = Math.imul(hash, 16777619) }
  return (hash >>> 0) % length;
};
export const characterDisplayArt = (name: string, isAntagonist = false, visualClass?: ThreatVisualClass) => {
  const individual = characterArt(name);
  if (individual) return { url: individual, individual: true, credit: "Editorial interpretation" };
  const variants = isAntagonist ? antagonistPlaceholderArt : characterPlaceholderArt;
  const index = stableArtIndex(name, variants.length);
  const url = isAntagonist && visualClass ? antagonistClassArt[visualClass] : variants[index];
  return { url, individual: false, credit: "Non-canonical archive study" };
};

const merged = new Map<string, Work>();
for (const original of rawWorks as Work[]) {
  const item = { ...original, year: correctedYears[original.title] ?? original.year };
  const key = item.title.toLowerCase();
  const prior = merged.get(key);
  if (!prior || item.status === "approved") merged.set(key, { ...item, dataNote: correctedYears[item.title] ? "Release year reconciled against the official Stephen King bibliography." : undefined });
}
export const works = [...merged.values()].sort((a, b) => a.title.localeCompare(b.title));
export const characters = rawCharacters as Character[];
export const appearances = rawAppearances as Appearance[];
export const adaptations = rawAdaptations as Adaptation[];
export const editions = rawEditions as Edition[];
export const descriptions = rawDescriptions as DescriptionIndex;
export const characterClaims = rawCharacterClaims as CharacterClaimIndex;
export const awards = rawAwards as Award[];
export const screenDetails = rawScreenDetails as unknown as ScreenDetailIndex;
export const researchIndex = rawResearchIndex as ResearchIndex;
export const antagonistStatus = rawAntagonistStatus as { characters: Record<string, { characterId: string; displayName: string; status: string; isAntagonist: boolean; evidence: { provider: string; url: string; note: string }; retrievedAt: string }> };

export const getWork = (slug: string) => works.find(w => slugify(w.title) === slug);
export const getCharacter = (slug: string) => characters.find(c => slugify(c.name) === slug);
export const getAdaptation = (slug: string) => adaptations.find(a => slugify(a.title) === slug);
export const workById = new Map(works.map(w => [w.id, w]));
export const characterById = new Map(characters.map(c => [c.id, c]));
export const workCharacters = (id: string) => appearances.filter(a => a.workId === id).map(a => characterById.get(a.characterId)).filter(Boolean) as Character[];
export const characterWorks = (id: string) => appearances.filter(a => a.characterId === id).map(a => workById.get(a.workId)).filter(Boolean) as Work[];
export const workEditions = (id: string) => editions.filter(e => e.workId === id);
export const workCover = (id: string) => workEditions(id).find(e => e.cover)?.cover;
export const workAdaptations = (title: string) => adaptations.filter(a => a.facts?.originalWorkTitle?.toLowerCase() === title.toLowerCase());
export const officialSource = (w: Work) => w.sources?.find(s => s.name === "StephenKing.com");
export const workDescription = (id: string) => descriptions.works[id];
export const characterDescription = (id: string) => descriptions.characters[id];
export const adaptationDescription = (id: string) => descriptions.adaptations[id];
export const characterResearch = (id: string) => characterClaims.characters[id];
export const characterResearchPaths = (id: string) => researchIndex.characters[id];
export const placeResearchPaths = (id: string) => researchIndex.places[id];
export const workAwards = (title: string) => awards.filter((award) => award.workTitle.toLowerCase() === title.toLowerCase());
export const screenDetail = (id: string) => screenDetails.records[id];
export const workByTitle = (title?: string) => title ? works.find(work => work.title.toLowerCase() === title.toLowerCase()) : undefined;
export const relatedWorks = (id: string) => {
  const characterIds = new Set(appearances.filter(appearance => appearance.workId === id).map(appearance => appearance.characterId));
  const related = new Map<string, { work: Work; shared: Character[] }>();
  for (const appearance of appearances) {
    if (!characterIds.has(appearance.characterId) || appearance.workId === id) continue;
    const work = workById.get(appearance.workId), character = characterById.get(appearance.characterId);
    if (!work || !character) continue;
    const item = related.get(work.id) || { work, shared: [] };
    if (!item.shared.some(entry => entry.id === character.id)) item.shared.push(character);
    related.set(work.id, item);
  }
  return [...related.values()].sort((a, b) => b.shared.length - a.shared.length || a.work.title.localeCompare(b.work.title));
};
export const characterAdaptations = (id: string) => {
  const titles = new Set(characterWorks(id).map(work => work.title.toLowerCase()));
  return adaptations.filter(adaptation => adaptation.facts?.originalWorkTitle && titles.has(adaptation.facts.originalWorkTitle.toLowerCase()));
};
export const adaptationCharacters = (adaptation: Adaptation) => {
  const work = workByTitle(adaptation.facts?.originalWorkTitle);
  return work ? workCharacters(work.id) : [];
};
