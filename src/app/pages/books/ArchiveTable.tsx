// src/app/pages/books/ArchiveTable.tsx
"use client";

import { motion } from "framer-motion";
import styles from "./Books.module.css";
import CaseFileBookCard from "./CaseFileBookCard";
import { Book } from "../../../lib/types";

type Props = {
  books: Book[];
  selectedBook: Book | null;
  onSelect: (book: Book) => void;
  view?: "GRID" | "LIST";
};

export default function ArchiveTable({
  books,
  selectedBook,
  onSelect,
  view = "GRID",
}: Props) {
  if (!books?.length) {
    return (
      <div className={styles.emptyState}>
        <span>ARCHIVE EMPTY</span>

        <h3>No records found</h3>

        <p>
          The archive could not locate files matching your search.
        </p>
      </div>
    );
  }

  return (
    <motion.section
      layout
      className={
        view === "LIST"
          ? styles.archiveList
          : styles.archiveGrid
      }
      transition={{
        layout: {
          duration: 0.42,
          ease: [0.22, 1, 0.36, 1],
        },
      }}
    >
      {books.map((book, index) => {
        /**
         * Stable identity
         */

        const stableId =
          book.id ||
          book.isbn ||
          `${book.title}-${book.year}-${index}`;

        const normalizedBook: Book = {
          ...book,
          stableId: String(stableId),
        };

        return (
          <motion.div
            key={stableId}
            layout
            initial={{
              opacity: 0,
              y: 18,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.26,
              ease: [0.22, 1, 0.36, 1],
            }}
            className={
              selectedBook?.stableId === stableId
                ? styles.selectedCard
                : ""
            }
          >
            <div
              role="button"
              tabIndex={0}
              className={styles.cardButton}
              onClick={() => onSelect(normalizedBook)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onSelect(normalizedBook);
                }
              }}
              aria-label={`Open case file for ${book.title}`}
            >
              <CaseFileBookCard
                book={normalizedBook}
                view={view}
              />
            </div>
          </motion.div>
        );
      })}
    </motion.section>
  );
}
