// src/app/page.tsx
"use client";

import Link from "next/link";
import styles from "./page.module.css";

const portals = [
  { title: "Books", subtitle: "Primary archive", href: "/pages/books" },
  { title: "Short Stories", subtitle: "Fragments & novellas", href: "/pages/shorts" },
  { title: "Villains", subtitle: "Entity dossiers", href: "/pages/villains" },
  { title: "About", subtitle: "Archive orientation", href: "/pages/about" },
];

export default function HomePage() {
  return (
    <main className={styles.page}>
      <div className={styles.background} />
      <div className={styles.overlay} />
      <div className={styles.grain} />

      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <span className={styles.eyebrow}>ARCHIVE NODE 01</span>

          <h1 className={styles.title}>
            STEPHEN
            <br />
            KING
            <br />
            UNIVERSE
          </h1>

          <p className={styles.lead}>
            A cinematic archive exploring books, short stories, entities,
            locations and connected darkness across Stephen King’s worlds.
          </p>

          <div className={styles.actions}>
            <Link href="/pages/books" className={styles.primary}>
              Enter Archive
            </Link>

            <Link href="/pages/about" className={styles.secondary}>
              About Project
            </Link>
          </div>
        </div>

        <aside className={styles.dossier}>
          <span className={styles.dossierLabel}>CURRENT FILE</span>

          <h2>The archive is active.</h2>

          <p>
            Stories connect. Darkness remembers. Every record points somewhere
            else.
          </p>

          <div className={styles.dossierMeta}>
            <span>Books</span>
            <strong>Primary Records</strong>

            <span>Shorts</span>
            <strong>Fragments</strong>

            <span>Villains</span>
            <strong>Entity Dossiers</strong>
          </div>
        </aside>
      </section>

      <section className={styles.portalSection}>
        <div className={styles.sectionHeader}>
          <span>ACTIVE PORTALS</span>
          <span>SWIPE TO EXPLORE</span>
        </div>

        <div className={styles.portalRow}>
          {portals.map((portal) => (
            <Link key={portal.title} href={portal.href} 
            className={`${styles.portal} ${
              portal.title === "Books"
              ? styles.booksPortal
              : portal.title === "Short Stories"
              ? styles.shortsPortal
              : portal.title === "Villains"
              ? styles.villainsPortal
              : styles.aboutPortal
              }`}
            >
              <span>{portal.subtitle}</span>
              <h3>{portal.title}</h3>
              <small>OPEN FILE →</small>
            </Link>
          ))}
        </div>
      </section>

      <section className={styles.timeline}>
        <span>1958</span>
        <i />
        <span>1974</span>
        <i />
        <span>1977</span>
        <i />
        <span>1986</span>
        <i />
        <span>2019</span>
      </section>
    </main>
  );
}