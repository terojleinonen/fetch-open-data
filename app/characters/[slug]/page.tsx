import Link from "next/link";
import { notFound } from "next/navigation";
import {
  characterResearch,
  characterWorks,
  characters,
  getCharacter,
  slugify,
} from "@/lib/data";
import { CharacterConnections } from "@/components/EntityConnections";
export function generateStaticParams() {
  return characters.map((character) => ({ slug: slugify(character.name) }));
}
const labels: Record<string, string> = {
  identity: "Identity",
  gender: "Gender",
  lifeStatus: "Life status",
  communityCategories: "Community categories",
  narrativeRole: "Narrative role",
  subjects: "Subjects",
};

export default async function Character({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params,
    character = getCharacter(slug);
  if (!character) notFound();
  const research = characterResearch(character.id),
    description = research?.claims.find(
      (claim) => claim.predicate === "description",
    ),
    claims =
      research?.claims.filter(
        (claim) =>
          claim.predicate !== "description" && claim.predicate !== "appearsIn",
      ) || [],
    works = characterWorks(character.id),
    secondary = research?.editorialStatus === "secondary-verified",
    record = String(
      characters.findIndex((item) => item.id === character.id) + 1,
    ).padStart(3, "0"),
    initials = character.name
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0])
      .join("");
  return (
    <main className="identity-page">
      <section className="identity-hero">
        <Link href="/characters" className="identity-back">
          ← RETURN TO THE POPULATION
        </Link>
        <div className="identity-register">
          <span>IDENTITY FILE</span>
          <b>
            {record} / {characters.length}
          </b>
        </div>
        <div className="identity-monogram" aria-hidden="true">
          {initials}
        </div>
        <div
          className={`identity-heading name-${character.name.length <= 14 ? "short" : character.name.length <= 25 ? "medium" : "long"}`}
        >
          <small>
            {secondary ? "SECONDARY VERIFIED" : "PROVISIONAL"} / CLAIM-LEVEL
            RECORD
          </small>
          <h1>{character.name}</h1>
          <p>
            {works.length} known literary connection
            {works.length === 1 ? "" : "s"}
          </p>
        </div>
        <div
          className={`identity-stamp ${secondary ? "secondary" : "provisional"}`}
        >
          {secondary ? "SOURCE\nMATCHED" : "REVIEW\nREQUIRED"}
        </div>
        <div className="identity-rule">
          <span>THE POPULATION / WHO WALKS BETWEEN THE PAGES</span>
          <span>RECORD {record}</span>
        </div>
      </section>
      <section className="identity-body">
        <div className="identity-abstract">
          {description ? (
            <>
              <span>SECONDARY-VERIFIED ABSTRACT</span>
              <p>{description.value}</p>
              <a href={description.url} target="_blank" rel="noreferrer">
                {description.provider} · {description.license}
                {description.revisionId
                  ? ` · revision ${description.revisionId}`
                  : ""}{" "}
                ↗
              </a>
              {description.attribution && (
                <small>
                  {description.attribution} {description.changes}
                </small>
              )}
            </>
          ) : (
            <>
              <span>DESCRIPTION WITHHELD</span>
              <p>
                No directly matched, citable character description has been
                found. An unsourced biography has not been generated.
              </p>
            </>
          )}{" "}
        </div>
        <aside>
          <b>{works.length.toString().padStart(2, "0")}</b>
          <span>
            CONNECTED
            <br />
            WORKS
          </span>
          <p>
            Absence of description is treated as an evidence gap, not permission
            to invent.
          </p>
        </aside>
      </section>
      <section className="identity-ledger">
        <header>
          <span>EVIDENCE LEDGER</span>
          <h2>
            WHAT CAN
            <br />
            <i>BE SAID?</i>
          </h2>
          <b>{claims.length.toString().padStart(2, "0")}</b>
        </header>
        <div>
          {claims.map((claim, index) => (
            <article
              className="identity-claim"
              key={`${claim.predicate}-${index}`}
            >
              <small>{String(index + 1).padStart(2, "0")}</small>
              <div>
                <span>
                  {labels[claim.predicate] || claim.predicate}
                  {claim.spoiler && " · SPOILER"}
                </span>
                <p>
                  {Array.isArray(claim.value)
                    ? claim.value.join(" · ")
                    : claim.value}
                </p>
              </div>
              <aside>
                <span
                  className={`status ${claim.verification === "secondary-verified" ? "secondary" : "provisional"}`}
                >
                  {claim.verification.replace("-", " ")}
                </span>
                <a href={claim.url} target="_blank" rel="noreferrer">
                  {claim.provider} ↗
                </a>
              </aside>
            </article>
          ))}
        </div>
        <div className="identity-gap">
          <b>PRIMARY VERIFICATION NEEDED</b>
          <p>
            A named edition, ISBN and page or chapter locator are required
            before this record can reach Primary verified status.
          </p>
        </div>
      </section>
      <CharacterConnections characterId={character.id} />
    </main>
  );
}
