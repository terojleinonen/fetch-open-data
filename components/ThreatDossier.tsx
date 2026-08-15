"use client";
import Link from "next/link";
import { useMemo, useState } from "react";
export type ThreatRecord = {
  id: string;
  name: string;
  href: string;
  works: { title: string; year?: number }[];
  firstYear?: number;
  verified: boolean;
  claimCount: number;
  abstract?: string;
  providers: string[];
  imageUrl?: string;
  visualClass: "human" | "supernatural" | "cosmic" | "object" | "unclassified";
};
const workHref = (title: string) =>
  `/works/${title
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")}`;
export function ThreatDossier({ records }: { records: ThreatRecord[] }) {
  const [query, setQuery] = useState(""),
    [evidence, setEvidence] = useState<"all" | "verified" | "provisional">(
      "all",
    ),
    [order, setOrder] = useState<"reach" | "name">("reach"),
    [activeId, setActiveId] = useState(records[0]?.id || "");
  const visible = useMemo(
      () =>
        records
          .filter(
            (r) =>
              (evidence === "all" ||
                (evidence === "verified") === r.verified) &&
              `${r.name} ${r.works.map((w) => w.title).join(" ")} ${r.abstract || ""} ${r.providers.join(" ")}`
                .toLowerCase()
                .includes(query.toLowerCase()),
          )
          .sort((a, b) =>
            order === "reach"
              ? b.works.length - a.works.length || a.name.localeCompare(b.name)
              : a.name.localeCompare(b.name),
          ),
      [records, query, evidence, order],
    ),
    active = visible.find((r) => r.id === activeId) || visible[0];
  return (
    <section className="threat-dossier">
      <header className="threat-tools">
        <label>
          <span>SEARCH ANTAGONISTIC RECORDS</span>
          <div>
            <i />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Flagg, Pennywise, Misery…"
            />
            {query && <button onClick={() => setQuery("")}>×</button>}
          </div>
        </label>
        <div className="threat-filters">
          <span>EVIDENCE</span>
          {(["all", "verified", "provisional"] as const).map((v) => (
            <button
              className={evidence === v ? "active" : ""}
              onClick={() => setEvidence(v)}
              key={v}
            >
              {v}
            </button>
          ))}
        </div>
        <button
          className="threat-order"
          onClick={() => setOrder(order === "reach" ? "name" : "reach")}
        >
          {order === "reach" ? "BY REACH ↓" : "BY NAME A—Z"}
        </button>
      </header>
      {active ? (
        <div className={"threat-stage threat-" + active.visualClass}>
          <nav aria-label="Antagonist records">
            {visible.map((record, index) => (
              <button
                className={
                  "threat-nav-" +
                  record.visualClass +
                  (active.id === record.id ? " active" : "")
                }
                onMouseEnter={() => setActiveId(record.id)}
                onFocus={() => setActiveId(record.id)}
                onClick={() => setActiveId(record.id)}
                key={record.id}
              >
                <small>{String(index + 1).padStart(2, "0")}</small>
                <span>{record.name}</span>
                <i>{record.works.length}</i>
              </button>
            ))}
          </nav>
          <article
            className={`threat-active threat-${active.visualClass} ${active.imageUrl ? "has-threat-art" : ""}`}
            style={
              active.imageUrl
                ? ({
                    "--threat-art": `url('${active.imageUrl}')`,
                  } as React.CSSProperties)
                : undefined
            }
          >
            {active.imageUrl && (
              <span className="threat-active-art" aria-hidden="true" />
            )}
            <div className="threat-active-register">
              <span>
                ACTIVE FILE /{" "}
                {active.verified ? "SOURCE MATCHED" : "PROPOSED ROLE"}
              </span>
              <b>
                {String(visible.indexOf(active) + 1).padStart(2, "0")} /{" "}
                {visible.length}
              </b>
            </div>
            <h2>{active.name}</h2>
            <p>
              {active.abstract ||
                "No directly matched, licensed description is available. The record remains open rather than being filled with an inferred biography."}
            </p>
            <div className="threat-facts">
              <div>
                <b>{active.works.length}</b>
                <span>linked works</span>
              </div>
              <div>
                <b>{active.firstYear || "—"}</b>
                <span>first record</span>
              </div>
              <div>
                <b>{active.claimCount}</b>
                <span>sourced claims</span>
              </div>
            </div>
            <Link href={active.href}>OPEN FULL DOSSIER →</Link>
          </article>
          <aside className="threat-vector">
            <span>THREAT VECTOR / EDITORIAL</span>
            <div className="vector-orbit">
              <i />
              <i />
              <i />
              <i />
              <b>{active.name[0]}</b>
            </div>
            <div className="vector-axis">
              <span>PERSONAL</span>
              <i
                style={{
                  width: `${Math.min(92, 28 + active.works.length * 10)}%`,
                }}
              />
              <span>EXISTENTIAL</span>
            </div>
            <h3>SPHERE OF INFLUENCE</h3>
            {active.works.slice(0, 6).map((work) => (
              <Link href={workHref(work.title)} key={work.title}>
                <span>{work.title}</span>
                <small>{work.year || "—"}</small>
              </Link>
            ))}
          </aside>
        </div>
      ) : (
        <div className="threat-empty">
          <b>NO RECORDS FOUND</b>
          <button
            onClick={() => {
              setQuery("");
              setEvidence("all");
            }}
          >
            RESET THE DOSSIER
          </button>
        </div>
      )}
      <footer>
        <b>READING THE RECORD</b>
        <p>
          Threat vector and sphere of influence are interface metaphors derived
          from linked-record counts. They are not canonical classifications.
        </p>
      </footer>
    </section>
  );
}
