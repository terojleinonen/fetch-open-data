"use client";

import { useEffect, useMemo, useState, Suspense } from "react";
import VillainsTable from "./VillainsTable";
import VillainPanel from "./VillainPanel";
import styles from "./Villains.module.css";
import ArchiveControls from "../../components/archive/ArchiveControls";
import { getPagination } from "../../../lib/getPagination";
import { Villain } from "../../../lib/types";

const PAGE_SIZE = 8;

export default function VillainsPage() {
  const [villains, setVillains] = useState<Villain[]>([]);
  const [selected, setSelected] = useState<Villain | null>(null);

  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("ALL");
  const [sort, setSort] = useState<"NAME" | "THREAT">("NAME");
  const [view, setView] = useState<"GRID" | "LIST">("GRID");
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
      .catch((err) => console.error("Failed to fetch villains", err))
      .finally(() => setLoading(false));
  }, []);

  /* =========================================================
     FILTERING & SORTING
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

  // Keep page valid after search/filter changes
  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const handleQueryChange = (q: string) => {
    setQuery(q);
    setPage(1);
  };

  const handleStatusChange = (st: string) => {
    setStatus(st);
    setPage(1);
  };

  const handleSortChange = (so: string) => {
    setSort(so as "NAME" | "THREAT");
    setPage(1);
  };

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
     HANDLERS FOR CONTROLS
  ========================================================= */

  const filters = [
    {
      key: "status",
      options: [
        { label: "ALL STATUS", value: "ALL" },
        { label: "ALIVE", value: "ALIVE" },
        { label: "DECEASED", value: "DECEASED" },
        { label: "UNKNOWN", value: "UNKNOWN" },
      ],
      value: status,
      onChange: handleStatusChange,
    },
    {
      key: "sort",
      options: [
        { label: "SORT BY NAME", value: "NAME" },
        { label: "SORT BY THREAT", value: "THREAT" },
      ],
      value: sort,
      onChange: handleSortChange,
    },
  ];

  const handleRandom = () => {
    if (filtered.length > 0) {
      const randIndex = Math.floor(Math.random() * filtered.length);
      setSelected(filtered[randIndex]);
    }
  };

  const visiblePages = getPagination(page, totalPages);

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
          <section className={styles.controlsSection || styles.controls}>
            <Suspense fallback={<div className={styles.loading}>Loading archive controls...</div>}>
              <ArchiveControls
                query={query}
                onQueryChange={handleQueryChange}
                resultCount={filtered.length}
                totalCount={villains.length}
                filters={filters}
                onRandom={handleRandom}
              />
            </Suspense>

            <div className={styles.viewToggleRow || ""}>
              <div className={styles.viewButtons}>
                <button
                  className={view === "GRID" ? styles.viewActive : ""}
                  onClick={() => setView("GRID")}
                  aria-label="Switch to grid view"
                >
                  ▦
                </button>

                <button
                  className={view === "LIST" ? styles.viewActive : ""}
                  onClick={() => setView("LIST")}
                  aria-label="Switch to list view"
                >
                  ☰
                </button>
              </div>
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
              onClick={() => setPage(1)}
              aria-label="First page"
            >
              «
            </button>

            <button
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              aria-label="Previous page"
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
                  onClick={() => setPage(Number(item))}
                  className={page === item ? styles.pageActive : ""}
                  aria-label={`Go to page ${item}`}
                >
                  {item}
                </button>
              );
            })}

            <button
              disabled={page === totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              aria-label="Next page"
            >
              ›
            </button>

            <button
              disabled={page === totalPages}
              onClick={() => setPage(totalPages)}
              aria-label="Last page"
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

function getThreatScore(villain: Villain) {
  const status = String(
    villain.status || ""
  ).toUpperCase();

  if (status === "RECURRING") return 5;
  if (status === "ACTIVE") return 4;
  if (status === "POTENTIAL") return 3;
  if (status === "UNKNOWN") return 2;

  return 1;
}
