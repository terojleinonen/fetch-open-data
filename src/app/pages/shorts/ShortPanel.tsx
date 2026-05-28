// src/app/pages/shorts/ShortPanel.tsx
"use client";

import styles from "./ShortPanel.module.css";

export default function ShortPanel({
  story,
}: any) {
  return (
    <aside className={styles.panel}>
      <div className={styles.inner}>
        <header className={styles.header}>
          <span>
            Selected Fragment
          </span>
        </header>

        <section className={styles.top}>
          <div className={styles.sketch}>
            <div className={styles.shadowFigure} />
          </div>

          <div>
            <span className={styles.unpublished}>
              {story.originallyPublishedIn ||
                "UNPUBLISHED"}
            </span>

            <h2>{story.title}</h2>

            <p className={styles.year}>
              {story.year || "----"}
            </p>

            <blockquote className={styles.quote}>
              “Don’t look under the bed.
              It looks back.”
            </blockquote>
          </div>
        </section>

        <section className={styles.iconGrid}>
          <div>
            <span>Type</span>
            <strong>
              {story.type || "Novel"}
            </strong>
          </div>

          <div>
            <span>Collected In</span>
            <strong>{story.collectedIn}</strong>
          </div>

          <div>
            <span>Originally Published In</span>
            <strong>
              {story.originallyPublishedIn || "UNPUBLISHED"}
            </strong>
          </div>

          <div>
            <span>Connections</span>
            <strong>{story.villains?.length || 0} Entities</strong>
          </div>
        </section>
        <section className={styles.iconGrid}>
          <p>
            <span>Notes</span>
            {story.notes ||
              "Recovered archive fragment discovered among handwritten manuscripts."}
          </p>
          <p>
            <span>Entities</span>
              {story.villains?.length > 0 && (
                <section className={styles.section}>
                  <div className={styles.tags}>
                    {story.villains.slice(0, 8).map((v: any, index: number) => (
                      <span key={v.id || `${v.name}-${index}`}>{v.name}</span>
                    ))}
                  </div>
                </section>
             )}
          </p>
        </section>
      </div>
    </aside>
  );
}