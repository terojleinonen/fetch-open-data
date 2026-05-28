// src/app/pages/shorts/ShortCard.tsx
"use client";

import styles from "./ShortCard.module.css";

export default function ShortCard({
  story,
  variant = 0,
  view = "GRID",
}: any) {
  const variants = [
    styles.manuscript,
    styles.blackCard,
    styles.noteCard,
    styles.clipping,
  ];

  return (
    <article
      className={`${styles.card} ${
        variants[variant]
      } ${
        view === "LIST"
          ? styles.list
          : ""
      }`}
    >
      <span className={styles.label}>
        {story.originallyPublishedIn ||
          "UNPUBLISHED"}
      </span>

      <h3>{story.title}</h3>

      <footer className={styles.meta}>
        <span>
          {story.year || "----"}
        </span>
      </footer>
    </article>
  );
}