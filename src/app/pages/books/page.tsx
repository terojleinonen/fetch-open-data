// src/app/pages/books/page.tsx
"use client";

import { useEffect, useState, Suspense } from "react";
import { AnimatePresence } from "framer-motion";
import styles from "./Books.module.css";
import ArchiveTable from "./ArchiveTable";
import CaseFilePanel from "./CaseFilePanel";
import ArchiveControls from "../../components/archive/ArchiveControls";
import { getPagination } from "../../../lib/getPagination";
import { Book } from "../../../lib/types";

export default function BooksPage() {
  const [page, setPage] = useState(1);
  const [books, setBooks] = useState<Book[]>([]);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("TITLE_ASC");
  const [view, setView] = useState<"GRID" | "LIST">("GRID");
  const [totalBooks, setTotalBooks] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const startRecord = totalBooks === 0 ? 0 : (page - 1) * 12 + 1; 
  const endRecord = Math.min(page * 12, totalBooks);

  /* =========================================================
     FETCH
  ========================================================= */

  useEffect(() => {
    setLoading(true);
    fetch(`/api/books?page=${page}&limit=12&q=${encodeURIComponent(query)}&sort=${sort}`)
      .then((r) => r.json())
      .then((data) => {
        const normalized: Book[] = (data.books || []).map(
          (book: any, index: number) => ({
            ...book,
            stableId: String(
              book.id ||
              book.isbn ||
              `${book.title}-${book.year}-${index}`
            ),
          })
        );
        setBooks(normalized);
        setTotalBooks(data.pagination.total || 0);

        const tPages = data.pagination.totalPages || 1;
        setTotalPages(tPages);

        // Keep page valid if it exceeds total pages after a search
        if (page > tPages) {
          setPage(tPages);
        }

        // Clear selection if selected book is no longer in the list
        if (selectedBook) {
          const stillExists = normalized.find(
            (b) => b.stableId === selectedBook.stableId
          );
          if (!stillExists) {
            setSelectedBook(null);
          }
        }
      })
      .catch((err) => {
        console.error("Failed to fetch books", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [page, query, sort]);

  /* =========================================================
     SEARCH & FILTER HANDLERS
  ========================================================= */

  const handleQueryChange = (q: string) => {
    setQuery(q);
    setPage(1);
  };

  const handleSortChange = (s: string) => {
    setSort(s);
    setPage(1);
  };

  const filters = [
    {
      key: "sort",
      options: [
        { label: "TITLE A–Z", value: "TITLE_ASC" },
        { label: "TITLE Z–A", value: "TITLE_DESC" },
        { label: "YEAR (ASC)", value: "YEAR_ASC" },
        { label: "YEAR (DESC)", value: "YEAR_DESC" },
      ],
      value: sort,
      onChange: handleSortChange,
    },
  ];

  const handleRandom = () => {
    if (books.length > 0) {
      const randIndex = Math.floor(Math.random() * books.length);
      setSelectedBook(books[randIndex]);
    }
  };

  /* =========================================================
     RENDER
  ========================================================= */

  const visiblePages = getPagination(page, totalPages);

  return (
    <main className={styles.page}>
      <div className={styles.background} />

      <section
        className={`${
          styles.layout
        } ${
          selectedBook
            ? styles.panelOpen
            : styles.panelClosed
        }`}
      >
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
                THE ARCHIVE
              </span>
              <h1>
                BOOKS
              </h1>
              <p>
                Explore the
                complete
                collection of
                Stephen
                King&apos;s
                novels and
                novellas.
                Every story is
                connected to
                something
                darker.
              </p>
            </div>
          </header>

          {/* CONTROLS */}
          <section className={styles.controlsSection}>
            <Suspense fallback={<div className={styles.loading}>Loading archive controls...</div>}>
              <ArchiveControls
                query={query}
                onQueryChange={handleQueryChange}
                resultCount={totalBooks}
                totalCount={totalBooks}
                filters={filters}
                onRandom={handleRandom}
              />
            </Suspense>

            <div className={styles.viewToggleRow}>
              <div className={styles.viewButtons}>
                <button
                  className={view === "GRID" ? styles.viewActive : ""}
                  onClick={() => setView("GRID")}
                  aria-label="Switch to grid view"
                >
                  ▣
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
            ARCHIVE CONTAINS {totalBooks} RECORDS ·
            VIEWING {startRecord} – {endRecord}
          </div>

          {/* GRID */}
          {loading ? (
            <div className={styles.loading}>
              Loading...
            </div>
          ) : (
            <ArchiveTable
              books={books}
              selectedBook={selectedBook}
              view={view}
              onSelect={(book) => setSelectedBook(book)}
            />
          )}

          {/* PAGINATION */}
          <div className={styles.pagination}>
            <button
              className={styles.paginationBtn}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              aria-label="Previous page"
            >
              ←
            </button>

            {visiblePages.map((item, index) => {
              if (item === "...") {
                return (
                  <span
                    key={`dots-${index}`}
                    className={styles.paginationDots}
                  >
                    —
                  </span>
                );
              }

              return (
                <button
                  key={item}
                  className={`${styles.paginationBtn} ${
                    page === item ? styles.paginationActive : ""
                  }`}
                  onClick={() => setPage(Number(item))}
                  aria-label={`Go to page ${item}`}
                >
                  {item}
                </button>
              );
            })}

            <button
              className={styles.paginationBtn}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              aria-label="Next page"
            >
              →
            </button>
          </div>
        </section>

        {/* =========================================================
            PANEL
        ========================================================= */}

        <div className={styles.panelColumn}>
          <AnimatePresence mode="wait">
            {selectedBook && (
              <CaseFilePanel
                key={selectedBook.stableId}
                book={selectedBook}
                onClose={() => setSelectedBook(null)}
              />
            )}
          </AnimatePresence>
        </div>
      </section>
    </main>
  );
}
