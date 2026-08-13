import { adaptations, screenDetail, slugify } from "@/lib/data";
import {
  ArchiveExplorer,
  type ArchiveExplorerItem,
} from "@/components/ArchiveExplorer";
import type { CSSProperties } from "react";
export const metadata = { title: "Screen Adaptations" };

export default function Adaptations() {
  const items: ArchiveExplorerItem[] = adaptations.map((adaptation) => {
    const detail = screenDetail(adaptation.id),
      year = detail?.year || adaptation.year,
      typeLabel = adaptation.type.replaceAll("-", " ");
    return {
      id: adaptation.id,
      href: `/adaptations/${slugify(adaptation.title)}`,
      title: adaptation.title,
      type: adaptation.type,
      typeLabel,
      year,
      eyebrow: `${typeLabel} · ${year || "announced"}`,
      meta: `Based on ${adaptation.facts?.originalWorkTitle || "source record pending"}`,
      searchText: [
        adaptation.facts?.originalWorkTitle,
        adaptation.facts?.originalWorkType,
        detail?.overview,
        ...(detail?.directors.map((person) => person.name) || []),
        ...(detail?.producers.map((person) => person.name) || []),
        ...(detail?.cast.flatMap((person) => [person.name, person.character]) ||
          []),
        ...(detail?.productionCompanies || []),
        ...(detail?.countries || []),
      ]
        .filter(Boolean)
        .join(" "),
      imageUrl: detail?.posterUrl || undefined,
      imageCredit: detail?.posterUrl ? "Image: TMDB" : undefined,
      description: detail?.overview || undefined,
      variant: "screen",
    };
  });
  const withPosters = items.filter((item) => item.imageUrl).length;
  const decades = [1970, 1980, 1990, 2000, 2010, 2020].map((decade) => ({
    decade,
    count: items.filter(
      (item) => item.year && item.year >= decade && item.year < decade + 10,
    ).length,
  }));
  const programme = items
    .filter((item) => item.imageUrl)
    .slice()
    .sort((a, b) => (a.year || 0) - (b.year || 0))
    .filter((_, index) => index % 11 === 0)
    .slice(0, 6);
  return (
    <main className="screen-page">
      <section className="screen-hero">
        <div className="screen-hero-image" />
        <div className="film-edge left" />
        <div className="film-edge right" />
        <div className="screen-hero-copy">
          <span>05 / THE SCREEN ARCHIVE</span>
          <h1>
            <i>FROM PAGE</i>
            <i>
              TO <b>SCREEN</b>
            </i>
          </h1>
          <p>Every adaptation changes the evidence.</p>
        </div>
        <div className="screen-search-prompt">
          SEARCH FILMS, SERIES,
          <br />
          SOURCE WORKS & PEOPLE ↓
        </div>
        <div className="screen-hero-stats">
          <b>{items.length}</b>
          <span>SCREEN RECORDS</span>
          <b>{withPosters}</b>
          <span>POSTERS CATALOGUED</span>
        </div>
        <div className="screen-hero-rule">
          <span>FILMS / TELEVISION / MINISERIES / STREAMING</span>
          <span>THE ARGUMENT CONTINUES →</span>
        </div>
      </section>
      <section className="adaptation-matrix">
        <header>
          <span>THE ADAPTATION MATRIX</span>
          <p>Publication becomes production. Stories return in another form.</p>
        </header>
        <div className="matrix-decades">
          {decades.map(({ decade, count }) => (
            <div key={decade}>
              <b>{decade}s</b>
              <i style={{ "--density": Math.max(count, 1) } as CSSProperties} />
              <span>{count} records</span>
            </div>
          ))}
        </div>
      </section>
      <section className="screen-programme">
        <header>
          <span>NOW SHOWING / A CURATED CROSS-SECTION</span>
          <h2>
            SIX REELS.
            <br />
            <i>SIX ARGUMENTS.</i>
          </h2>
          <p>
            Selected across decades to expose how the screen keeps returning to
            King.
          </p>
        </header>
        <div>
          {programme.map((item, index) => (
            <a
              href={item.href}
              className={`programme-poster programme-poster-${index + 1}`}
              key={item.id}
            >
              <img src={item.imageUrl} alt={`Poster for ${item.title}`} />
              <small>
                {item.year} / {item.typeLabel}
              </small>
              <h3>{item.title}</h3>
            </a>
          ))}
        </div>
      </section>
      <section className="screen-archive">
        <div className="screen-archive-title">
          <span>BROWSE THE EVIDENCE / 01—{items.length}</span>
          <h2>
            THE
            <br />
            <i>SCREEN</i>
            <br />
            FILES.
          </h2>
          <p>
            Search titles, directors, cast, characters, companies and source
            works.
          </p>
        </div>
        <ArchiveExplorer
          items={items}
          filterLabel="Format"
          dateLabel="screen release"
          placeholder="Kubrick, Pennywise, television…"
        />
      </section>
      <p className="tmdb-notice">
        This product uses the TMDB API but is not endorsed or certified by TMDB.
      </p>
    </main>
  );
}
