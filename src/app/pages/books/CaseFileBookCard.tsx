"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import styles from "./CaseFileBookCard.module.css";
import { Book } from "../../../lib/types";

type Props = {
  book: Book;
  view?: "GRID" | "LIST";
};

export default function CaseFileBookCard({ book, view = "GRID" }: Props) {
  if (!book) return null;

  const cover =
    book.cover?.thumbnail ||
    book.cover ||
    "/fallback-cover/fallback-cover.jpeg";

  const category = book.categories?.[0] || "Fiction";

  return (
    <motion.article
      className={`${styles.card} ${view === "LIST" ? styles.list : ""}`}
      whileHover={{ y: -5, rotate: -0.25 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
    >
      <div className={styles.coverWrap}>
        <Image src={cover} alt={book.title} className={styles.cover} loading="lazy" width={300} height={450}  />

        <div className={styles.coverShade} />
        <div className={styles.coverNoise} />

        <span className={styles.year}>{book.year || "----"}</span>
        <span className={styles.badge}>{category}</span>
      </div>

      <div className={styles.body}>
        <span className={styles.label}>Primary Archive</span>

        <h3>{book.title}</h3>

        <div className={styles.meta}>
          <span>{book.publisher || "Unknown"}</span>
          <strong>{book.pageCount || "—"} pages</strong>
        </div>
      </div>
    </motion.article>
  );
}
