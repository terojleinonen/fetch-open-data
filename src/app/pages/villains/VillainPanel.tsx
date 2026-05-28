"use client";

import styles from "./VillainPanel.module.css";
import Image from "next/image";

type Props = {
  villain: any;
};

export default function VillainPanel({ villain }: Props) {
  const appearances = [
    ...(villain.books || []).map((b: any) => ({
      title: b.title,
      type: "Book",
      year: b.year,
    })),
    ...(villain.shorts || []).map((s: any) => ({
      title: s.title,
      type: "Short",
      year: s.year,
    })),
  ];

  return (
    <aside className={styles.panel}>
      <div className={styles.inner}>
        <header className={styles.header}>
          <span>Active Dossier</span>
        </header>

        <section className={styles.identity}>
          <div>
            <span className={styles.entityId}>ENTITY 001</span>

            <h2>{villain.name}</h2>

            <p>{villain.type || villain.category || "Ancient Entity"}</p>
          </div>

          <div className={styles.threat}>
            <span>Threat Level</span>
            <strong>☠ ☠ ☠ ☠ ☠</strong>
          </div>
        </section>

        <section className={styles.evidence}>
          <div className={styles.evidenceImage}>
            <Image
              src={villain.image || "/villains/evidence-drain.jpeg"}
              alt={villain.name || "villain image"}
              width={400}
              height={300}
              className={styles.evidenceImg}
            />
          </div>

          <div className={styles.facts}>
            <div>
              <span>Status</span>
              <strong>{villain.status || "Unknown"}</strong>
            </div>

            <div>
              <span>Gender</span>
              <strong>{villain.gender || "Unknown"}</strong>
            </div>

            <div>
              <span>Name</span>
              <strong>{villain.name || "Unknown"}</strong>
            </div>

            <div>
              <span>Archive ID</span>
              <strong>{villain.id || "SKV-ENTITY"}</strong>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <h3>Notes</h3>
          <div className={styles.tags}>
          {villain.notes?.slice(0, 8).map((note: any, index: number) => (
            <span
              key={`${note}-${index}`}
            >
              {String(note)}
            </span>
            ))}
          </div>
        </section> 

        <section className={styles.section}>
          <h3>Known Appearances</h3>

          {appearances.length > 0 ? (
            <div className={styles.timeline}>
              {appearances.slice(0, 6).map((item, index) => (
                <div key={`${item.title}-${index}`} className={styles.timelineItem}>
                  <span>{item.year || "----"}</span>
                  <strong>{item.title}</strong>
                  <small>{item.type}</small>
                </div>
              ))}
            </div>
          ) : (
            <p>No known appearances recorded.</p>
          )}
        </section>
        <footer className={styles.classified}>
          <span>Classified Archive</span>
        </footer>
      </div>
    </aside>
  );
}