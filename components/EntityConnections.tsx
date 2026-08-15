import Link from "next/link";
import {
  Adaptation,
  adaptationCharacters,
  characterAdaptations,
  characterWorks,
  relatedWorks,
  slugify,
  workAdaptations,
  workByTitle,
  workCharacters,
} from "@/lib/data";
import { workPlaces } from "@/lib/places";

const Empty = () => (
  <p className="connection-empty">No verified connections yet.</p>
);

export function WorkConnections({
  workId,
  title,
}: {
  workId: string;
  title: string;
}) {
  const characters = workCharacters(workId),
    adaptations = workAdaptations(title),
    related = relatedWorks(workId),
    locations = workPlaces(title);
  return (
    <section className="entity-connections">
      <div className="connection-label">
        <span>CONNECTIONS</span>
        <small>Relationships attached to this work</small>
      </div>
      <div className="connection-groups four">
        <div>
          <h3>
            Characters <b>{characters.length}</b>
          </h3>
          {characters.length ? (
            characters.slice(0, 12).map((character) => (
              <Link
                href={`/characters/${slugify(character.name)}`}
                key={character.id}
              >
                <span>{character.name}</span>
                <small>appears in this work</small>
              </Link>
            ))
          ) : (
            <Empty />
          )}
        </div>
        <div>
          <h3>
            Places <b>{locations.length}</b>
          </h3>
          {locations.length ? (
            locations.map((place) => (
              <Link href={`/places/${place.id}`} key={place.id}>
                <span>{place.name}</span>
                <small>
                  {place.kind} · {place.region}
                </small>
              </Link>
            ))
          ) : (
            <Empty />
          )}
        </div>
        <div>
          <h3>
            Screen adaptations <b>{adaptations.length}</b>
          </h3>
          {adaptations.length ? (
            adaptations.map((adaptation) => (
              <Link
                href={`/adaptations/${slugify(adaptation.title)}`}
                key={adaptation.id}
              >
                <span>{adaptation.title}</span>
                <small>
                  {adaptation.type} · {adaptation.year || "announced"}
                </small>
              </Link>
            ))
          ) : (
            <Empty />
          )}
        </div>
        <div>
          <h3>
            Related works <b>{related.length}</b>
          </h3>
          {related.length ? (
            related.slice(0, 8).map(({ work, shared }) => (
              <Link href={`/works/${slugify(work.title)}`} key={work.id}>
                <span>{work.title}</span>
                <small>
                  via {shared.map((character) => character.name).join(" · ")}
                </small>
              </Link>
            ))
          ) : (
            <Empty />
          )}
        </div>
      </div>
    </section>
  );
}

export function CharacterConnections({ characterId }: { characterId: string }) {
  const works = characterWorks(characterId),
    adaptations = characterAdaptations(characterId);
  return (
    <section className="entity-connections">
      <div className="connection-label">
        <span>CONNECTIONS</span>
        <small>Known appearances and derivatives</small>
      </div>
      <div className="connection-groups two">
        <div>
          <h3>
            Written works <b>{works.length}</b>
          </h3>
          {works.length ? (
            works.map((work) => (
              <Link href={`/works/${slugify(work.title)}`} key={work.id}>
                <span>{work.title}</span>
                <small>
                  {work.type.replace("-", " ")} · {work.year}
                </small>
              </Link>
            ))
          ) : (
            <Empty />
          )}
        </div>
        <div>
          <h3>
            Related adaptations <b>{adaptations.length}</b>
          </h3>
          {adaptations.length ? (
            adaptations.map((adaptation) => (
              <Link
                href={`/adaptations/${slugify(adaptation.title)}`}
                key={adaptation.id}
              >
                <span>{adaptation.title}</span>
                <small>through {adaptation.facts?.originalWorkTitle}</small>
              </Link>
            ))
          ) : (
            <Empty />
          )}
        </div>
      </div>
    </section>
  );
}

export function AdaptationConnections({
  adaptation,
}: {
  adaptation: Adaptation;
}) {
  const work = workByTitle(adaptation.facts?.originalWorkTitle),
    characters = adaptationCharacters(adaptation);
  return (
    <section className="entity-connections">
      <div className="connection-label">
        <span>CONNECTIONS</span>
        <small>Source text and literary cast</small>
      </div>
      <div className="connection-groups two">
        <div>
          <h3>
            Source work <b>{work ? 1 : 0}</b>
          </h3>
          {work ? (
            <Link href={`/works/${slugify(work.title)}`}>
              <span>{work.title}</span>
              <small>
                {work.type.replace("-", " ")} · {work.year}
              </small>
            </Link>
          ) : (
            <Empty />
          )}
        </div>
        <div>
          <h3>
            Source characters <b>{characters.length}</b>
          </h3>
          {characters.length ? (
            characters.slice(0, 12).map((character) => (
              <Link
                href={`/characters/${slugify(character.name)}`}
                key={character.id}
              >
                <span>{character.name}</span>
                <small>linked through {work?.title}</small>
              </Link>
            ))
          ) : (
            <Empty />
          )}
        </div>
      </div>
    </section>
  );
}
