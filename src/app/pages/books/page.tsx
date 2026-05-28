// src/app/pages/books/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence } from "framer-motion";

import styles from "./Books.module.css";

import ArchiveTable from "./ArchiveTable";
import CaseFilePanel from "./CaseFilePanel";

type Book = any;

const ITEMS_PER_PAGE = 12;

export default function BooksPage() {
  const [books, setBooks] = useState<Book[]>([]);

  const [selectedBook, setSelectedBook] =
    useState<Book | null>(null);

  /**
   * Prevent reopening first book
   * after user manually closes panel
   */

  const [hasUserClosedPanel, setHasUserClosedPanel] =
    useState(false);

  const [query, setQuery] = useState("");

  const [sort, setSort] =
    useState("TITLE_ASC");

  const [view, setView] =
    useState<"GRID" | "LIST">("GRID");

  const [page, setPage] = useState(1);

  /* =========================================================
     FETCH
  ========================================================= */

  useEffect(() => {
    fetch("/api/books")
      .then((r) => r.json())
      .then((data) => {
        const normalized = (
          data.books || []
        ).map(
          (
            book: any,
            index: number
          ) => ({
            ...book,

            stableId:
              book.id ||
              book.isbn ||
              `${book.title}-${book.year}-${index}`,
          })
        );

        setBooks(normalized);
      });
  }, []);

  /* =========================================================
     FILTER + SORT
  ========================================================= */

  const filteredBooks = useMemo(() => {
    const q = query
      .trim()
      .toLowerCase();

    let result = books.filter((book) =>
      String(book.title || "")
        .toLowerCase()
        .includes(q)
    );

    switch (sort) {
      case "TITLE_ASC":
        result.sort((a, b) =>
          String(a.title).localeCompare(
            String(b.title)
          )
        );
        break;

      case "TITLE_DESC":
        result.sort((a, b) =>
          String(b.title).localeCompare(
            String(a.title)
          )
        );
        break;

      case "YEAR_ASC":
        result.sort(
          (a, b) =>
            Number(a.year || 0) -
            Number(b.year || 0)
        );
        break;

      case "YEAR_DESC":
        result.sort(
          (a, b) =>
            Number(b.year || 0) -
            Number(a.year || 0)
        );
        break;
    }

    return result;
  }, [books, query, sort]);

  /* =========================================================
     PAGINATION
  ========================================================= */

  const totalPages = Math.max(
    1,
    Math.ceil(
      filteredBooks.length /
        ITEMS_PER_PAGE
    )
  );

  const paginatedBooks = useMemo(() => {
    const start =
      (page - 1) *
      ITEMS_PER_PAGE;

    return filteredBooks.slice(
      start,
      start + ITEMS_PER_PAGE
    );
  }, [filteredBooks, page]);

  /* =========================================================
     RESET PAGE ON FILTERING
  ========================================================= */

  useEffect(() => {
    setPage(1);

    /**
     * Re-enable auto-open
     * after changing filters
     */

    setHasUserClosedPanel(false);
  }, [query, sort]);

  /* =========================================================
     KEEP PAGE VALID
  ========================================================= */

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  /* =========================================================
     AUTO SELECT FIRST BOOK
  ========================================================= */

  useEffect(() => {
    if (
      paginatedBooks.length &&
      !selectedBook &&
      !hasUserClosedPanel
    ) {
      setSelectedBook(
        paginatedBooks[0]
      );
    }
  }, [
    paginatedBooks,
    selectedBook,
    hasUserClosedPanel,
  ]);

  /* =========================================================
     CLEAR INVALID SELECTION
  ========================================================= */

  useEffect(() => {
    if (!selectedBook) return;

    const stillExists =
      filteredBooks.find(
        (book) =>
          book.stableId ===
          selectedBook.stableId
      );

    if (!stillExists) {
      setSelectedBook(null);
    }
  }, [
    filteredBooks,
    selectedBook,
  ]);

  /* =========================================================
     PAGINATION UI
  ========================================================= */

  const getPagination = () => {
    const pages: (
      | number
      | string
    )[] = [];

    const start = Math.max(
      1,
      page - 2
    );

    const end = Math.min(
      totalPages,
      page + 2
    );

    if (page > 1) {
      pages.push("prev");
    }

    if (start > 1) {
      pages.push(1);

      if (start > 2) {
        pages.push(
          "dots-start"
        );
      }
    }

    for (
      let i = start;
      i <= end;
      i++
    ) {
      pages.push(i);
    }

    if (end < totalPages) {
      if (
        end <
        totalPages - 1
      ) {
        pages.push(
          "dots-end"
        );
      }

      pages.push(totalPages);
    }

    if (page < totalPages) {
      pages.push("next");
    }

    return pages;
  };

  /* =========================================================
     RENDER
  ========================================================= */

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
          <section  className={styles.controls}>
            <label  className={styles.searchBox}>
              <input
                placeholder="Search the archive..."
                value={query}
                onChange={(e) =>
                  setQuery(
                    e.target.value
                  )
                }
              />

              <span>⌕</span>
            </label>

            <button className={styles.controlButton}
              onClick={() =>
                setSort(
                  (
                    prev
                  ) =>
                    prev ===
                    "TITLE_ASC"
                      ? "TITLE_DESC"
                      : "TITLE_ASC"
                )
              }
            >
              SORT:{" "}
              {sort ===
              "TITLE_ASC"
                ? "TITLE A–Z"
                : "TITLE Z–A"}
            </button>

            <div className={styles.viewButtons}
            >
              <button
                className={
                  view ===
                  "GRID"
                    ? styles.viewActive
                    : ""
                }
                onClick={() =>
                  setView(
                    "GRID"
                  )
                }
              >
                ▣
              </button>

              <button
                className={
                  view ===
                  "LIST"
                    ? styles.viewActive
                    : ""
                }
                onClick={() =>
                  setView(
                    "LIST"
                  )
                }
              >
                ☰
              </button>
            </div>
          </section>

          {/* RESULTS */}

          <div
            className={
              styles.resultCount
            }
          >
            {
              filteredBooks.length
            }{" "}
            TITLES FOUND
          </div>

          {/* GRID */}

          <ArchiveTable
            books={
              paginatedBooks
            }
            selectedBook={
              selectedBook
            }
            view={view}
            onSelect={(
              book
            ) => {
              setSelectedBook(
                book
              );

              /**
               * Re-enable
               * panel state
               */

              setHasUserClosedPanel(
                false
              );
            }}
          />

          {/* PAGINATION */}

          <div
            className={
              styles.pagination
            }
          >
            {getPagination().map(
              (
                item,
                index
              ) => {
                if (
                  item ===
                    "dots-start" ||
                  item ===
                    "dots-end"
                ) {
                  return (
                    <span
                      key={`${item}-${index}`}
                      className={
                        styles.paginationDots
                      }
                    >
                      —
                    </span>
                  );
                }

                if (
                  item ===
                  "prev"
                ) {
                  return (
                    <button
                      key="prev"
                      className={
                        styles.paginationBtn
                      }
                      onClick={() =>
                        setPage(
                          (
                            p
                          ) =>
                            Math.max(
                              1,
                              p -
                                1
                            )
                        )
                      }
                    >
                      ←
                    </button>
                  );
                }

                if (
                  item ===
                  "next"
                ) {
                  return (
                    <button
                      key="next"
                      className={
                        styles.paginationBtn
                      }
                      onClick={() =>
                        setPage(
                          (
                            p
                          ) =>
                            Math.min(
                              totalPages,
                              p +
                                1
                            )
                        )
                      }
                    >
                      →
                    </button>
                  );
                }

                return (
                  <button
                    key={
                      item
                    }
                    className={`${styles.paginationBtn} ${
                      page ===
                      item
                        ? styles.paginationActive
                        : ""
                    }`}
                    onClick={() =>
                      setPage(
                        Number(
                          item
                        )
                      )
                    }
                  >
                    {item}
                  </button>
                );
              }
            )}
          </div>
        </section>

        {/* =========================================================
            PANEL
        ========================================================= */}

        <div
          className={
            styles.panelColumn
          }
        >
          <AnimatePresence mode="wait">
            {selectedBook && (
              <CaseFilePanel
                key={
                  selectedBook.stableId
                }
                book={
                  selectedBook
                }
                onClose={() => {
                  setSelectedBook(
                    null
                  );

                  /**
                   * Prevent
                   * immediate
                   * reopen
                   */

                  setHasUserClosedPanel(
                    true
                  );
                }}
              />
            )}
          </AnimatePresence>
        </div>
      </section>
    </main>
  );
}