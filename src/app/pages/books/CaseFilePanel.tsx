"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import styles from "./CaseFilePanel.module.css";

export default function CaseFilePanel({ book, onClose }: any) {
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    setExpanded(false);
  }, [book?.id]);

  const cover =
    book.cover?.thumbnail ||
    book.cover ||
    "/fallback-cover/fallback-cover.jpeg";

  return (
    <motion.aside
      initial={{
        opacity: 0,
        x: 40,
      }}
      animate={{
        opacity: 1,
        x: 0,
      }}
      exit={{
        opacity: 0,
        x: 20,
     }}
    >
      <motion.div className={styles.inner}>
        <div className={styles.header}>
          <span>Selected Record</span>

          {onClose && (
            <button onClick={onClose} aria-label="Close selected record">
              ×
            </button>
          )}
        </div>

        <section className={styles.top}>
          <img src={cover} alt={book.title}/>

          <div>
            <h2>{book.title}</h2>

            <p className={styles.year}>
              {book.year || "Unknown"}
              {book.categories?.[0] && <span>{book.categories[0]}</span>}
            </p>

            <p className={styles.quoteLine}>
              “Every file points toward something else.”
            </p>
          </div>
        </section>

        <section className={styles.section}>
          <h3>Overview</h3>

          <div
            className={`${styles.description} ${
              expanded ? styles.expanded : ""
            }`}
          >
            {book.description || "No description available."}
          </div>

          {book.description && (
            <button
              className={styles.expandBtn}
              onClick={() => setExpanded((value) => !value)}
            >
              {expanded ? "Collapse File" : "Read Full File"}
            </button>
          )}
        </section>

        <section className={styles.metaGrid}>
          <div>
            <span>Publisher</span>
            <strong>{book.publisher || "—"}</strong>
          </div>

          <div>
            <span>Pages</span>
            <strong>{book.pageCount || "—"}</strong>
          </div>

          <div>
            <span>ISBN</span>
            <strong>{book.isbn || "—"}</strong>
          </div>

          <div>
            <span>Status</span>
            <strong>Published</strong>
          </div>
        </section>

        {book.villains?.length > 0 && (
          <section className={styles.section}>
            <h3>Related Entities</h3>

            <div className={styles.tags}>
              {book.villains.map((v: any, index: number) => (
                <span key={v.id || `${v.name}-${index}`}>{v.name}</span>
              ))}
            </div>
          </section>
        )}

        <footer className={styles.footerQuote}>
          “Monsters are real, and ghosts are real too. They live inside us, and
          sometimes, they win.”
        </footer>
      </motion.div>
    </motion.aside>
  );
}