import {
  antagonistStatus,
  characterDisplayArt,
  characterResearch,
  characterResearchPaths,
  characterWorks,
  characters,
  classifyThreatVisual,
  slugify,
} from "@/lib/data";
import { ThreatDossier, type ThreatRecord } from "@/components/ThreatDossier";
import type { CSSProperties } from "react";
export const metadata = { title: "Antagonists — The Anatomy of Evil" };
export default function Antagonists() {
  const ids = new Set(
      Object.values(antagonistStatus.characters)
        .filter((item) => item.isAntagonist)
        .map((item) => item.characterId),
    ),
    antagonists = characters.filter((character) => ids.has(character.id)),
    verified = antagonists.filter(
      (character) =>
        characterResearch(character.id)?.editorialStatus ===
        "secondary-verified",
    ).length;
  const records: ThreatRecord[] = antagonists.map((character) => {
    const research = characterResearch(character.id),
      paths = characterResearchPaths(character.id),
      works = characterWorks(character.id),
      description = research?.claims.find(
        (claim) => claim.predicate === "description",
      ),
      visualClass = classifyThreatVisual(
        [
          character.name,
          character.characterType,
          typeof description?.value === "string"
            ? description.value
            : paths?.intro?.text,
        ]
          .filter(Boolean)
          .join(" "),
      );
    return {
      id: character.id,
      name: character.name,
      href: `/characters/${slugify(character.name)}`,
      works: works.map((work) => ({ title: work.title, year: work.year })),
      firstYear: works
        .map((work) => work.year)
        .filter((year): year is number => Boolean(year))
        .sort()[0],
      verified: research?.editorialStatus === "secondary-verified",
      claimCount: research?.claims.length || 0,
      abstract:
        typeof description?.value === "string"
          ? description.value
          : paths?.intro?.text,
      providers: [
        ...new Set(research?.claims.map((claim) => claim.provider) || []),
      ],
      imageUrl: characterDisplayArt(character.name, true, visualClass).url,
      visualClass,
    };
  });
  return (
    <main className="evil-page">
      <section className="evil-sequence">
        <div className="evil-sticky">
          <div className="evil-atmosphere" />
          <div className="evil-silhouette">
            <i />
            <i />
          </div>
          <div className="evil-sequence-copy">
            <span>04 / ANTAGONISTIC RECORDS</span>
            <p>
              EVIL WEARS MANY FACES.
              <br />
              SOMETIMES NONE AT ALL.
            </p>
          </div>
          <h1>
            <span>THE</span>
            <span>ANATOMY</span>
            <span>OF</span>
            <span>EVIL.</span>
          </h1>
          <div className="evil-orbit">
            <i />
            <i />
            <i />
            <i />
            <b>{antagonists.length}</b>
          </div>
          <div className="evil-sequence-foot">
            <span>CINEMATIC TITLE TABLEAU</span>
            <span>THE RECORD OPENS ↓</span>
          </div>
        </div>
      </section>
      <section className="evil-spectrum">
        <div>
          <span>THE ROGUE SPECTRUM</span>
          <h2>
            NOT ONE
            <br />
            <i>KIND OF DARKNESS.</i>
          </h2>
          <p>
            Each included role is explicitly identified by a cited official,
            secondary or fan-documented source. API-only candidates remain
            outside this gallery.
          </p>
        </div>
        <div className="evil-particles">
          {Array.from({ length: 86 }, (_, i) => (
            <i
              style={
                {
                  left: `${(i * 37) % 97}%`,
                  top: `${12 + ((i * 53) % 76)}%`,
                  "--c": i % 5,
                } as CSSProperties
              }
              key={i}
            />
          ))}
        </div>
        <aside>
          <b>{antagonists.length}</b>
          <span>
            ANTAGONISTIC
            <br />
            FORCES DOCUMENTED
          </span>
          <strong>{verified}</strong>
          <small>SECONDARY-VERIFIED PROFILES</small>
        </aside>
      </section>
      <section className="rogue-gallery">
        <header>
          <span>ENTER THE ROGUE GALLERY</span>
          <h2>
            THREAT
            <br />
            <i>DOSSIER.</i>
          </h2>
          <p>
            One line per sourced record. Candidate roles are withheld until
            corroborated.
          </p>
        </header>
        <ThreatDossier records={records} />
      </section>
    </main>
  );
}
