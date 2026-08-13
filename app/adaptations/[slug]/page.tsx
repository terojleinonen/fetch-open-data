import Link from "next/link";
import { notFound } from "next/navigation";
import { adaptations, getAdaptation, screenDetail, slugify } from "@/lib/data";
import { AdaptationConnections } from "@/components/EntityConnections";
export function generateStaticParams() {
  return adaptations.map((adaptation) => ({ slug: slugify(adaptation.title) }));
}
export default async function AdaptationDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params,
    adaptation = getAdaptation(slug);
  if (!adaptation) notFound();
  const detail = screenDetail(adaptation.id),
    imdbId = detail?.externalIds?.imdb_id;
  return (
    <main className="page detail screen-detail">
      <Link className="back" href="/adaptations">
        ← RETURN TO SCREEN ARCHIVE
      </Link>
      <div
        className={
          detail?.posterUrl ? "screen-heading with-poster" : "screen-heading"
        }
      >
        {detail?.posterUrl && (
          <a
            className="detail-poster"
            href={detail.recordUrl}
            target="_blank"
            rel="noreferrer"
          >
            <img
              src={detail.posterUrl}
              alt={`Poster for ${adaptation.title}`}
            />
            <span>Poster image via TMDB ↗</span>
          </a>
        )}
        <div>
          <div className="detail-kicker">
            {adaptation.type} ·{" "}
            {detail?.releaseDate || adaptation.year || "Release pending"}
          </div>
          <h1>{adaptation.title}</h1>
          {detail?.overview ? (
            <p className="screen-overview">{detail.overview}</p>
          ) : (
            <p className="screen-overview withheld">
              No confidently matched, licensed plot summary is available.
            </p>
          )}
        </div>
      </div>
      <div className="detail-grid">
        <div>
          {detail && (
            <>
              <div className="fact-grid">
                <div className="fact">
                  <span>Release</span>
                  <b>{detail.releaseDate || detail.year}</b>
                </div>
                {detail.runtime && (
                  <div className="fact">
                    <span>Runtime</span>
                    <b>{detail.runtime} minutes</b>
                  </div>
                )}
                {detail.directors.length > 0 && (
                  <div className="fact">
                    <span>
                      Director{detail.directors.length > 1 ? "s" : ""}
                    </span>
                    <b>
                      {detail.directors
                        .map((person) => person.name)
                        .join(" · ")}
                    </b>
                  </div>
                )}
                {detail.productionCompanies.length > 0 && (
                  <div className="fact">
                    <span>Production</span>
                    <b>{detail.productionCompanies.join(" · ")}</b>
                  </div>
                )}
              </div>
              <section className="credit-section">
                <span>PRINCIPAL CAST</span>
                <div className="cast-grid">
                  {detail.cast.map((person) => (
                    <div key={person.tmdbId}>
                      <b>{person.name}</b>
                      <small>{person.character || "Role not listed"}</small>
                    </div>
                  ))}
                </div>
              </section>
              <section className="credit-section">
                <span>PRODUCERS</span>
                <div className="producer-list">
                  {detail.producers.length ? (
                    detail.producers.map((person) => (
                      <p key={`${person.tmdbId}-${person.role}`}>
                        {person.name} <small>{person.role}</small>
                      </p>
                    ))
                  ) : (
                    <p>No producer credits returned.</p>
                  )}
                </div>
              </section>
            </>
          )}
          <div className="source-note tmdb-source">
            TMDB SOURCE —{" "}
            <a
              href={detail?.recordUrl || "https://www.themoviedb.org"}
              target="_blank"
              rel="noreferrer"
            >
              Open TMDB record ↗
            </a>
            <br />
            This product uses the TMDB API but is not endorsed or certified by
            TMDB.
          </div>
        </div>
        <aside>
          {detail && (
            <>
              <div className="relation-block">
                <h3>Countries</h3>
                <p>{detail.countries.join(" · ") || "Not listed"}</p>
              </div>
              <div className="relation-block">
                <h3>External records</h3>
                {imdbId && (
                  <a
                    href={`https://www.imdb.com/title/${imdbId}/`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    IMDb ↗
                  </a>
                )}
                <a href={detail.recordUrl} target="_blank" rel="noreferrer">
                  TMDB ↗
                </a>
              </div>
            </>
          )}
        </aside>
      </div>
      <AdaptationConnections adaptation={adaptation} />
    </main>
  );
}
