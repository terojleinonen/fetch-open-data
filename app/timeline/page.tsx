import {
  TimelineExplorer,
  type TimelineEvent,
} from "@/components/TimelineExplorer";
import {
  adaptations,
  awards,
  screenDetail,
  slugify,
  workCover,
  works,
} from "@/lib/data";

export const metadata = { title: "Timeline" };

export default function Timeline() {
  const literary: TimelineEvent[] = works
    .filter((work) => work.year)
    .map((work) => ({
      id: `work-${work.id}`,
      title: work.title,
      year: work.year!,
      kind: "work",
      subtype: work.type,
      href: `/works/${slugify(work.title)}`,
      note: "First publication",
      searchText: `${work.title} ${work.type} literary publication`,
      imageUrl: workCover(work.id)?.imageUrl,
    }));
  const screen: TimelineEvent[] = adaptations
    .map((adaptation) => {
      const detail = screenDetail(adaptation.id);
      const year = detail?.year ?? adaptation.year;
      return year
        ? {
            id: `screen-${adaptation.id}`,
            title: adaptation.title,
            year,
            kind: "screen" as const,
            subtype: adaptation.type,
            href: `/screen/${slugify(adaptation.title)}`,
            note: adaptation.facts?.originalWorkTitle
              ? `From ${adaptation.facts.originalWorkTitle}`
              : "Screen release",
            searchText: `${adaptation.title} ${adaptation.type} ${adaptation.facts?.originalWorkTitle ?? ""} adaptation screen release`,
            imageUrl: detail?.posterUrl ?? undefined,
          }
        : null;
    })
    .filter(Boolean) as TimelineEvent[];
  const awardEvents: TimelineEvent[] = awards.map((award, index) => {
    const work = works.find(
      (item) => item.title.toLowerCase() === award.workTitle.toLowerCase(),
    );
    return {
      id: `award-${index}`,
      title: award.workTitle,
      year: award.year,
      kind: "award",
      subtype: award.result,
      href: work ? `/works/${slugify(work.title)}` : award.sourceUrl,
      note: `${award.award} · ${award.organization}`,
      searchText: `${award.workTitle} ${award.award} ${award.organization} ${award.result}`,
      imageUrl: work ? workCover(work.id)?.imageUrl : undefined,
      featured: true,
    };
  });
  const firstBook = Math.min(
    ...literary
      .filter((item) => item.subtype === "book")
      .map((item) => item.year),
  );
  const firstFilm = Math.min(
    ...screen
      .filter((item) => item.subtype === "movie")
      .map((item) => item.year),
  );
  const firstTv = Math.min(
    ...screen
      .filter((item) => item.subtype !== "movie")
      .map((item) => item.year),
  );
  const events = [
    ...literary.map((item) => ({ ...item, featured: item.year === firstBook })),
    ...screen.map((item) => ({
      ...item,
      featured: item.year === firstFilm || item.year === firstTv,
    })),
    ...awardEvents,
  ];
  const years = events.map((event) => event.year),
    first = Math.min(...years),
    last = Math.max(...years);
  const decades = [
    ...new Set(years.map((year) => Math.floor(year / 10) * 10)),
  ].sort((a, b) => a - b);
  const maxDensity = Math.max(
    ...decades.map(
      (decade) =>
        events.filter((event) => Math.floor(event.year / 10) * 10 === decade)
          .length,
    ),
  );
  return (
    <main className="chronology-page">
      <section className="chronology-hero">
        <div className="chronology-kicker">06 / TEMPORAL RECORD</div>
        <p className="chronology-declaration">
          Time is evidence.
          <br />
          These dates are not promises.
        </p>
        <h1>
          <span>THE CHRONOLOGY</span>
          <span>OF AN UNSTABLE</span>
          <em>UNIVERSE.</em>
        </h1>
        <div className="chronology-range" aria-label={`${first} to ${last}`}>
          <b>{String(first).slice(0, 2)}</b>
          <b>{String(first).slice(2)}</b>
          <i>—</i>
          <b>{String(last).slice(0, 2)}</b>
          <b>{String(last).slice(2)}</b>
        </div>
        <p className="chronology-intro">
          A sourced chronology of publication and screen release dates.
          Story-internal time remains outside the record unless it can be
          verified.
        </p>
        <div
          className="chronology-density"
          aria-label="Record density by decade"
        >
          {decades.map((decade) => {
            const count = events.filter(
              (event) => Math.floor(event.year / 10) * 10 === decade,
            ).length;
            return (
              <div key={decade}>
                <span
                  style={{
                    height: `${Math.max(8, (count / maxDensity) * 100)}%`,
                  }}
                />
                <small>{String(decade).slice(2)}s</small>
              </div>
            );
          })}
        </div>
        <div className="chronology-totals">
          <span>
            <b>{literary.length}</b> publications
          </span>
          <span>
            <b>{screen.length}</b> screen releases
          </span>
          <span>
            <b>{awardEvents.length}</b> verified awards
          </span>
        </div>
      </section>
      <TimelineExplorer events={events} />
    </main>
  );
}
