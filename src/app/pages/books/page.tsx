// src/app/pages/books/page.tsx
"use client";

import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import styles from "./Books.module.css";
import ArchiveTable from "./ArchiveTable";
import CaseFilePanel from "./CaseFilePanel";
type Book = any;

export default function BooksPage() {
  const [page, setPage] = useState(1);
  const [books, setBooks] = useState<Book[]>([]);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("TITLE_ASC");
  const [view, setView] = useState<"GRID" | "LIST">("GRID");
  const [totalBooks, setTotalBooks] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const startRecord = totalBooks === 0 ? 0 : (page - 1) * 12 + 1; 
  const endRecord = Math.min(page * 12, totalBooks);
  const [loading, setLoading] =  useState(true);

  /* =========================================================
     FETCH
  ========================================================= */

  useEffect(() => {
    setLoading(true);
    fetch(`/api/books?page=${page}&limit=12&q=${encodeURIComponent(query)}&sort=${sort}`)
      .then((r) => r.json())
      .then((data) => {
        const normalized =
          (data.books || []).map(
            (book: any, index: number) => ({
              ...book,
              stableId:
                book.id ||
                book.isbn ||
                `${book.title}-${book.year}-${index}`,
            })
        ) ;
        setBooks(normalized);
        setTotalBooks(data.pagination.total);
        setTotalPages(data.pagination.totalPages);    
      })
      .finally(() => {
        setLoading(false);
      });
  }, [page, query, sort]);  

  /* =========================================================
     RESET PAGE ON FILTERING
  ========================================================= */

  useEffect(() => {
    setPage(1);
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
     CLEAR INVALID SELECTION
  ========================================================= */

  useEffect(() => {
    if (!selectedBook) return;

    const stillExists =
      books.find(
        (book) =>
          book.stableId ===
          selectedBook.stableId
      );

    if (!stillExists) {
      setSelectedBook(null);
    }
  }, [
    books,
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
              books={
                books
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
            }}
          />
          )}

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
                }}
              />
            )}
          </AnimatePresence>
        </div>
      </section>
    </main>
  );
}