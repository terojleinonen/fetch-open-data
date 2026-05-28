"use client";

import { useEffect, useMemo, useState } from "react";
import VillainsTable from "./VillainsTable";
import VillainPanel from "./VillainPanel";
import styles from "./Villains.module.css";

type Villain = any;

const PAGE_SIZE = 8;

export default function VillainsPage() {
  const [villains, setVillains] = useState<Villain[]>([]);
  const [selected, setSelected] = useState<Villain | null>(null);

  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("ALL");

  const [sort, setSort] =
    useState<"NAME" | "THREAT">("NAME");

  const [view, setView] =
    useState<"GRID" | "LIST">("GRID");

  const [page, setPage] = useState(1);

  const [loading, setLoading] = useState(true);

  /* =========================================================
     FETCH
  ========================================================= */

  useEffect(() => {
    fetch("/api/villains")
      .then((r) => r.json())
      .then((d) => {
        const records = d.villains || [];

        setVillains(records);

        if (records.length > 0) {
          setSelected(records[0]);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  /* =========================================================
     FILTERING
  ========================================================= */

  const filtered = useMemo(() => {
    let result = [...villains];

    if (query.trim()) {
      const q = query.toLowerCase();

      result = result.filter((v) =>
        v.name?.toLowerCase().includes(q)
      );
    }

    if (status !== "ALL") {
      result = result.filter(
        (v) =>
          String(v.status || "").toUpperCase() ===
          status
      );
    }

    result.sort((a, b) => {
      if (sort === "THREAT") {
        return getThreatScore(b) - getThreatScore(a);
      }

      return String(a.name || "").localeCompare(
        String(b.name || "")
      );
    });

    return result;
  }, [villains, query, status, sort]);

  /* =========================================================
     PAGINATION
  ========================================================= */

  const totalPages = Math.max(
    1,
    Math.ceil(filtered.length / PAGE_SIZE)
  );

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  useEffect(() => {
    setPage(1);
  }, [query, status, sort]);

  const paginated = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;

    return filtered.slice(
      start,
      start + PAGE_SIZE
    );
  }, [filtered, page]);

  /* =========================================================
     KEEP SELECTED VALID
  ========================================================= */

  useEffect(() => {
    if (!selected && paginated.length > 0) {
      setSelected(paginated[0]);
      return;
    }

    const stillExists = filtered.find(
      (v) => v.id === selected?.id
    );

    if (!stillExists) {
      setSelected(paginated[0] || null);
    }
  }, [filtered, paginated, selected]);

  /* =========================================================
     LOADING
  ========================================================= */

  if (loading) {
    return (
      <main className={styles.loading}>
        <span>Loading entity dossiers…</span>
      </main>
    );
  }

  /* =========================================================
     PAGINATION BUTTONS
  ========================================================= */

  const visiblePages = getVisiblePages(
    page,
    totalPages
  );

  return (
    <main className={styles.page}>
      <div className={styles.background} />

      <section className={styles.layout}>
        {/* =========================================================
            MAIN
        ========================================================= */}

        <section className={styles.mainColumn}>
          {/* HERO */}

          <header className={styles.hero}>
            <div className={styles.heroImage} />
            <div className={styles.heroShade} />

            <div className={styles.heroCopy}>
              <span className={styles.kicker}>
                Classified Archive
              </span>

              <h1>Villains</h1>

              <p>
                Recurring entities.
                Manifestations of darkness
                that bleed across stories,
                places and generations.
              </p>

              <div className={styles.stamp}>
                Confidential
              </div>
            </div>
          </header>

          {/* CONTROLS */}

          <section className={styles.controls}>
            <label className={styles.searchBox}>
              <input
                value={query}
                onChange={(e) =>
                  setQuery(e.target.value)
                }
                placeholder="Search entities..."
              />

              <span>⌕</span>
            </label>

            <select
              value={status}
              onChange={(e) =>
                setStatus(e.target.value)
              }
              className={styles.controlSelect}
            >
              <option value="ALL">
                All Status
              </option>

              <option value="ALIVE">
                Alive
              </option>

              <option value="DECEASED">
                Deceased
              </option>

              <option value="UNKNOWN">
                Unknown
              </option>
            </select>

            <button
              className={styles.controlButton}
              onClick={() =>
                setSort((prev) =>
                  prev === "NAME"
                    ? "THREAT"
                    : "NAME"
                )
              }
            >
              Sort:{" "}
              {sort === "NAME"
                ? "Name"
                : "Threat"}
            </button>

            <div className={styles.viewButtons}>
              <button
                className={
                  view === "GRID"
                    ? styles.viewActive
                    : ""
                }
                onClick={() =>
                  setView("GRID")
                }
              >
                ▦
              </button>

              <button
                className={
                  view === "LIST"
                    ? styles.viewActive
                    : ""
                }
                onClick={() =>
                  setView("LIST")
                }
              >
                ☰
              </button>
            </div>
          </section>

          {/* RESULTS */}

          <div className={styles.resultCount}>
            {filtered.length} entity dossiers found
          </div>

          {/* TABLE */}

          <VillainsTable
            villains={paginated}
            selected={selected}
            onSelect={setSelected}
            view={view}
          />

          {/* =========================================================
              PAGINATION
          ========================================================= */}

          <nav className={styles.pagination}>
            <button
              disabled={page === 1}
              onClick={() =>
                setPage(1)
              }
            >
              «
            </button>

            <button
              disabled={page === 1}
              onClick={() =>
                setPage((p) =>
                  Math.max(1, p - 1)
                )
              }
            >
              ‹
            </button>

            {visiblePages.map((item, index) => {
              if (item === "...") {
                return (
                  <span
                    key={`dots-${index}`}
                    className={styles.dots}
                  >
                    ...
                  </span>
                );
              }

              return (
                <button
                  key={item}
                  onClick={() =>
                    setPage(Number(item))
                  }
                  className={
                    page === item
                      ? styles.pageActive
                      : ""
                  }
                >
                  {item}
                </button>
              );
            })}

            <button
              disabled={page === totalPages}
              onClick={() =>
                setPage((p) =>
                  Math.min(
                    totalPages,
                    p + 1
                  )
                )
              }
            >
              ›
            </button>

            <button
              disabled={page === totalPages}
              onClick={() =>
                setPage(totalPages)
              }
            >
              »
            </button>
          </nav>
        </section>

        {/* =========================================================
            PANEL
        ========================================================= */}

        <aside className={styles.panelColumn}>
          {selected && (
            <VillainPanel
              villain={selected}
            />
          )}
        </aside>
      </section>
    </main>
  );
}

/* =========================================================
   THREAT SCORE
========================================================= */

function getThreatScore(villain: any) {
  const status = String(
    villain.status || ""
  ).toUpperCase();

  if (status === "RECURRING") return 5;
  if (status === "ACTIVE") return 4;
  if (status === "POTENTIAL") return 3;
  if (status === "UNKNOWN") return 2;

  return 1;
}

/* =========================================================
   DYNAMIC PAGINATION
========================================================= */

function getVisiblePages(
  current: number,
  total: number
) {
  const pages: (number | string)[] = [];

  if (total <= 7) {
    return Array.from(
      { length: total },
      (_, i) => i + 1
    );
  }

  pages.push(1);

  if (current > 3) {
    pages.push("...");
  }

  const start = Math.max(2, current - 1);
  const end = Math.min(
    total - 1,
    current + 1
  );

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  if (current < total - 2) {
    pages.push("...");
  }

  pages.push(total);

  return pages;
}