// src/app/pages/shorts/page.tsx
"use client";

import { useEffect, useMemo, useState, Suspense } from "react";
import styles from "./Shorts.module.css";
import ShortTable from "./ShortTable";
import ShortPanel from "./ShortPanel";
import ArchiveControls from "../../components/archive/ArchiveControls";
import { Short } from "../../../lib/types";

export default function ShortsPage() {
  const [stories, setStories] = useState<Short[]>([]);
  const [selected, setSelected] = useState<Short | null>(null);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("DATE");
  const [view, setView] = useState<"GRID" | "LIST">("GRID");
  const [mobilePanelOpen, setMobilePanelOpen] = useState(false);
  const [isCompact, setIsCompact] = useState(false);

  /* ======================================
     RESPONSIVE DETECTION
  ====================================== */

  useEffect(() => {
    const check = () => {
      setIsCompact(
        window.innerWidth <= 1280
      );
    };

    check();

    window.addEventListener(
      "resize",
      check
    );

    return () =>
      window.removeEventListener(
        "resize",
        check
      );
  }, []);

  /* ======================================
     FETCH
  ====================================== */

  useEffect(() => {
    fetch("/api/shorts")
      .then((r) => r.json())
      .then((d) => {
        const records = d.shorts || [];
        setStories(records);
        if (records.length > 0) {
          setSelected(records[0]);
        }
      })
      .catch((err) => console.error("Failed to fetch shorts", err));
  }, []);

  /* ======================================
     FILTERING
  ====================================== */

  const filtered = useMemo(() => {
    const q = query.toLowerCase();

    let result = stories.filter(
      (story) =>
        story.title
          ?.toLowerCase()
          .includes(q)
    );

    if (sort === "DATE") {
      result = [...result].sort(
        (a, b) =>
          Number(a.year || 0) -
          Number(b.year || 0)
      );
    }

    if (sort === "TITLE") {
      result = [...result].sort(
        (a, b) =>
          String(a.title).localeCompare(
            String(b.title)
          )
      );
    }

    return result;
  }, [stories, query, sort]);

  /* ======================================
     SELECT
  ====================================== */

  const handleSelect = (story: Short) => {
    setSelected(story);

    if (isCompact) {
      setMobilePanelOpen(true);
    }
  };

  const handleQueryChange = (q: string) => {
    setQuery(q);
  };

  const handleSortChange = (s: string) => {
    setSort(s);
  };

  const handleRandom = () => {
    if (filtered.length > 0) {
      const randIndex = Math.floor(Math.random() * filtered.length);
      handleSelect(filtered[randIndex]);
    }
  };

  const filters = [
    {
      key: "sort",
      options: [
        { label: "DATE FOUND", value: "DATE" },
        { label: "TITLE", value: "TITLE" },
      ],
      value: sort,
      onChange: handleSortChange,
    },
  ];

  return (
    <main className={styles.page}>
      {/* ATMOSPHERE */}
      <div className={styles.background} />

      <section className={styles.layout}>
        {/* ======================================
            MAIN
        ====================================== */}

        <section className={styles.main}>
          {/* HERO */}

          <header className={styles.hero}>
            <div
              className={styles.heroImage}
            />

            <div
              className={styles.heroShade}
            />

            <div
              className={
                styles.heroContent
              }
            >
              <span
                className={styles.kicker}
              >
                THE FRAGMENTS
              </span>

              <h1>
                SHORT STORIES
              </h1>

              <p>
                Recovered pieces.
                Forgotten voices.
                Moments pulled from
                the darkness.
              </p>
            </div>
          </header>

          {/* CONTROLS */}

          <section className={styles.controlsSection || styles.controls}>
            <Suspense fallback={<div className={styles.loading}>Loading archive controls...</div>}>
              <ArchiveControls
                query={query}
                onQueryChange={handleQueryChange}
                resultCount={filtered.length}
                totalCount={stories.length}
                filters={filters}
                onRandom={handleRandom}
              />
            </Suspense>

            <div className={styles.viewToggleRow || ""}>
              <div className={styles.viewSwitch || styles.viewButtons}>
                <button
                  className={
                    view === "GRID"
                      ? styles.viewActive
                      : ""
                  }
                  onClick={() => setView("GRID")}
                  aria-label="Switch to grid view"
                >
                  ▦
                </button>

                <button
                  className={
                    view === "LIST"
                      ? styles.viewActive
                      : ""
                  }
                  onClick={() => setView("LIST")}
                  aria-label="Switch to list view"
                >
                  ☰
                </button>
              </div>
            </div>
          </section>

          <div
            className={
              styles.resultCount
            }
          >
            {filtered.length} fragments found
          </div>

          {/* GRID */}

          <ShortTable
            stories={filtered}
            view={view}
            selected={selected}
            onSelect={handleSelect}
          />
        </section>

        {/* ======================================
            DESKTOP PANEL
        ====================================== */}

        {!isCompact && (
          <aside
            className={
              styles.panelColumn
            }
          >
            {selected && (
              <ShortPanel
                story={selected}
              />
            )}
          </aside>
        )}
      </section>

      {/* ======================================
          MOBILE / TABLET OVERLAY
      ====================================== */}

      {isCompact &&
        mobilePanelOpen &&
        selected && (
          <div
            className={
              styles.mobileOverlay
            }
          >
            <div
              className={
                styles.mobileOverlayHeader
              }
            >
              <button
                className={
                  styles.closeButton
                }
                onClick={() =>
                  setMobilePanelOpen(
                    false
                  )
                }
                aria-label="Close selected fragment dossier"
              >
                ← Close dossier
              </button>
            </div>

            <div
              className={
                styles.mobilePanelContent
              }
            >
              <ShortPanel
                story={selected}
              />
            </div>
          </div>
        )}
    </main>
  );
}
