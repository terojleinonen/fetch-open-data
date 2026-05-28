// src/app/pages/shorts/page.tsx
"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import styles from "./Shorts.module.css";

import ShortTable from "./ShortTable";
import ShortPanel from "./ShortPanel";

type ShortStory = any;

export default function ShortsPage() {
  const [stories, setStories] = useState<
    ShortStory[]
  >([]);

  const [selected, setSelected] =
    useState<ShortStory | null>(null);

  const [query, setQuery] =
    useState("");

  const [sort, setSort] =
    useState("DATE");

  const [view, setView] = useState<
    "GRID" | "LIST"
  >("GRID");

  const [mobilePanelOpen, setMobilePanelOpen] =
    useState(false);

  const [isCompact, setIsCompact] =
    useState(false);

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
        const records =
          d.shorts || [];

        setStories(records);

        if (records.length > 0) {
          setSelected(records[0]);
        }
      });
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

  const handleSelect = (
    story: ShortStory
  ) => {
    setSelected(story);

    if (isCompact) {
      setMobilePanelOpen(true);
    }
  };

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

          <section
            className={styles.controls}
          >
            <label
              className={styles.search}
            >
              <input
                placeholder="Search fragments..."
                value={query}
                onChange={(e) =>
                  setQuery(
                    e.target.value
                  )
                }
              />

              <span>⌕</span>
            </label>

            <button
              className={
                styles.controlBtn
              }
              onClick={() =>
                setSort((prev) =>
                  prev === "DATE"
                    ? "TITLE"
                    : "DATE"
                )
              }
            >
              Sort:{" "}
              {sort === "DATE"
                ? "Date Found"
                : "Title"}
            </button>

            <div
              className={
                styles.viewSwitch
              }
            >
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

          <div
            className={
              styles.resultCount
            }
          >
            {filtered.length} fragments
            found
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