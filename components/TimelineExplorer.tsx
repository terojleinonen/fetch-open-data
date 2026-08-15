"use client";
import Link from "next/link";
import { useMemo, useState } from "react";
import { EditorialWorkPlate } from "@/components/EditorialWorkPlate";
import { ReliableCover } from "@/components/ReliableCover";

export type TimelineEvent = {
  id: string;
  title: string;
  year: number;
  kind: "work" | "screen" | "award";
  subtype: string;
  href: string;
  note: string;
  searchText: string;
  imageUrl?: string;
  workType?: string;
  featured?: boolean;
};

export function TimelineExplorer({ events }: { events: TimelineEvent[] }) {
  const [query, setQuery] = useState("");
  const [kind, setKind] = useState<"all" | "work" | "screen" | "award">("all");
  const [ascending, setAscending] = useState(true);
  const filtered = useMemo(
    () =>
      events
        .filter(
          (event) =>
            (kind === "all" || event.kind === kind) &&
            `${event.searchText} ${event.year}`
              .toLowerCase()
              .includes(query.trim().toLowerCase()),
        )
        .sort(
          (a, b) =>
            (a.year - b.year) * (ascending ? 1 : -1) ||
            a.title.localeCompare(b.title),
        ),
    [events, query, kind, ascending],
  );
  const decades = useMemo(() => {
    const map = new Map<number, TimelineEvent[]>();
    for (const event of filtered) {
      const decade = Math.floor(event.year / 10) * 10;
      map.set(decade, [...(map.get(decade) || []), event]);
    }
    return [...map.entries()].sort(
      (a, b) => (a[0] - b[0]) * (ascending ? 1 : -1),
    );
  }, [filtered, ascending]);
  return (
    <section className="timeline-explorer" id="record">
      <header className="timeline-console">
        <div>
          <span>SEARCH THE TEMPORAL RECORD</span>
          <label>
            <span className="sr-only">Search timeline</span>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="A title, year, format, source work…"
            />
          </label>
        </div>
        <div className="timeline-filters" aria-label="Timeline filters">
          {(["all", "work", "screen", "award"] as const).map((value) => (
            <button
              key={value}
              className={kind === value ? "active" : ""}
              onClick={() => setKind(value)}
            >
              {value === "all"
                ? "All"
                : value === "work"
                  ? "Books"
                  : value === "screen"
                    ? "Screen"
                    : "Awards"}
            </button>
          ))}
        </div>
        <button
          className="timeline-order"
          onClick={() => setAscending((value) => !value)}
        >
          <span>DIRECTION OF TIME</span>
          <b>{ascending ? "EARLIEST → LATEST" : "LATEST → EARLIEST"}</b>
        </button>
        <p>
          <b>{filtered.length}</b> records visible
        </p>
      </header>
      <div className="timeline-record">
        {decades.map(([decade, items], index) => (
          <section className="timeline-decade" key={decade}>
            <header>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h2>
                {decade}
                <sup>s</sup>
              </h2>
              <p>{items.length} surviving records</p>
            </header>
            <div className="timeline-events">
              {[...new Set(items.map((item) => item.year))].map((year) => (
                <div className="timeline-year" key={year}>
                  <div
                    className={`timeline-year-number ${items.some((item) => item.year === year && item.featured) ? "featured" : ""}`}
                  >
                    {year}
                  </div>
                  <div className="timeline-year-events">
                    {items
                      .filter((item) => item.year === year)
                      .map((item) => (
                        <Link
                          href={item.href}
                          key={item.id}
                          className={`timeline-event ${item.kind} ${item.featured ? "featured" : ""} ${item.imageUrl ? "has-image" : ""}`}
                        >
                          {item.imageUrl &&
                            (item.kind === "screen" ? (
                              <img src={item.imageUrl} alt="" loading="lazy" />
                            ) : (
                              <ReliableCover
                                src={item.imageUrl}
                                alt=""
                                width={360}
                                height={540}
                                sizes="(max-width: 560px) 100vw, (max-width: 900px) 34vw, 220px"
                                sourceSize="M"
                                fallback={
                                  <span className="timeline-cover-fallback">
                                    <EditorialWorkPlate
                                      id={item.id}
                                      title={item.title}
                                      type={item.workType || "book"}
                                      year={item.year}
                                      compact
                                    />
                                  </span>
                                }
                              />
                            ))}
                          <span className="timeline-mark" />
                          <small>
                            {item.kind === "work"
                              ? "PUBLICATION"
                              : item.kind === "screen"
                                ? "SCREEN RELEASE"
                                : "AWARD / HONOUR"}{" "}
                            / {item.subtype}
                          </small>
                          <strong>{item.title}</strong>
                          <em>{item.note}</em>
                          <i>OPEN RECORD ↗</i>
                        </Link>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
        {!filtered.length && (
          <div className="timeline-empty">
            <b>NO TRACE FOUND.</b>
            <span>Try another title, date, or record type.</span>
          </div>
        )}
      </div>
    </section>
  );
}
