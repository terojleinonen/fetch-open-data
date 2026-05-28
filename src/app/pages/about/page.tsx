// src/app/pages/about/page.tsx
import styles from "./About.module.css";

const archiveModules = [
  {
    title: "Books",
    description:
      "Explore the complete archive of novels and collections with enriched metadata and connected references.",
  },
  {
    title: "Short Stories",
    description:
      "Discover short fiction, anthologies and rare pieces from across the archive.",
  },
  {
    title: "Villains",
    description:
      "Investigate iconic and forgotten adversaries that shape the darkness.",
  },
];

const dataSources = [
  {
    title: "Stephen King API",
    label: "Primary Data Source",
    href: "https://stephen-king-api.onrender.com/",
    description:
      "The unofficial Stephen King API provides structured archive data for books, characters, short stories and more.",
  },
  {
    title: "Google Books API",
    label: "Metadata Enrichment",
    href: "https://developers.google.com/books",
    description:
      "Provides book metadata, covers, publishers, descriptions and additional bibliographic information.",
  },
  {
    title: "Official Website",
    label: "Authoritative Reference",
    href: "https://stephenking.com/",
    description:
      "The official Stephen King website is used as a reference for accurate and official information.",
  },
  {
    title: "Wikipedia",
    label: "Knowledge Base",
    href: "https://en.wikipedia.org/wiki/Stephen_King",
    description:
      "Wikipedia provides additional context, history and reference material for the archive.",
  },
];

const lockedModules = [
  "Characters Archive",
  "Places Archive",
  "Timeline System",
  "The Institute Dossier",
  "Case Files System",
  "Multiverse Index",
];

export default function AboutPage() {
  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroImage} />
        <div className={styles.heroOverlay} />

        <div className={styles.heroContent}>
          <span className={styles.eyebrow}>Archive Orientation</span>

          <h1 className={styles.title}>About</h1>

          <p className={styles.lead}>
            An unofficial cinematic archive exploring the worlds, locations,
            entities and stories connected across the Stephen King Universe.
          </p>

          <div className={styles.smallRule} />

          <span className={styles.command}>Explore. Connect. Understand.</span>
        </div>
      </section>

      <section className={styles.projectSection}>
        <div className={styles.sectionImage} />

        <div className={styles.sectionCopy}>
          <span className={styles.sectionNumber}>01</span>
          <span className={styles.sectionKicker}>The Project</span>

          <h2>What is this archive?</h2>

          <p>
            Stephen King Universe is an experimental cinematic archive interface
            exploring how narrative worlds can be experienced through
            environmental storytelling, connected data and atmospheric interface
            design.
          </p>
        </div>

        <div className={styles.moduleList}>
          {archiveModules.map((item) => (
            <article key={item.title} className={styles.moduleItem}>
              <span className={styles.moduleIcon}>▧</span>

              <div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.kingSection}>
        <div className={styles.kingCopy}>
          <span className={styles.sectionNumber}>02</span>
          <span className={styles.sectionKicker}>Stephen King</span>

          <h2>The storyteller behind the worlds</h2>

          <p>
            Stephen King’s work has shaped generations with interconnected
            worlds, recurring themes and unforgettable characters.
          </p>

          <p>
            From small towns to cosmic horror, his universe is vast, intricate
            and deeply human.
          </p>
        </div>

        <div className={styles.connectionPanel}>
          <span className={styles.sectionKicker}>A universe of connections</span>

          <div className={styles.connectionGrid}>
            <div>Castle Rock</div>
            <div>Derry</div>
            <div>The Dark Tower</div>
            <div>The Institute</div>
          </div>

          <blockquote>
            “Monsters are real, and ghosts are real too. They live inside us,
            and sometimes, they win.”
          </blockquote>
        </div>
      </section>

      <section className={styles.flowSection}>
        <div className={styles.flowCopy}>
          <span className={styles.sectionNumber}>03</span>
          <span className={styles.sectionKicker}>How the archive works</span>

          <p>
            Data flows from trusted sources into a connected system that reveals
            relationships, patterns and deeper narrative connections.
          </p>
        </div>

        <div className={styles.flow}>
          {["Sources", "Enrichment", "Relationships", "Archive", "Experience"].map(
            (item, index) => (
              <div key={item} className={styles.flowItem}>
                <span>{index + 1}</span>
                <strong>{item}</strong>
              </div>
            )
          )}
        </div>
      </section>

      <section className={styles.sourcesSection}>
        <div className={styles.sectionHeading}>
          <span className={styles.sectionNumber}>04</span>
          <span className={styles.sectionKicker}>Data Sources</span>
          <h2>Classified reference index</h2>
        </div>

        <div className={styles.sourceGrid}>
          {dataSources.map((source) => (
            <a
              key={source.title}
              href={source.href}
              target="_blank"
              rel="noreferrer"
              className={styles.sourceCard}
            >
              <span className={styles.sourceLabel}>{source.label}</span>
              <h3>{source.title}</h3>
              <p>{source.description}</p>
              <span className={styles.openLink}>Open source ↗</span>
            </a>
          ))}
        </div>
      </section>

      <section className={styles.creatorSection}>
        <div>
          <span className={styles.sectionNumber}>05</span>
          <span className={styles.sectionKicker}>The Creator</span>

          <h2>Designing Systems. Building Worlds.</h2>

          <p>
            This project is designed and developed as an exploration of cinematic
            interfaces, narrative systems and atmospheric data visualization.
          </p>

          <p>
            The goal is to create digital experiences that feel alive — where
            information becomes immersion and data becomes discovery.
          </p>
        </div>

        <div className={styles.creatorPanel}>
          <span>Focus Areas</span>
          <ul>
            <li>Cinematic UI / UX Design</li>
            <li>Narrative Driven Interfaces</li>
            <li>Data Visualization</li>
            <li>World Building Systems</li>
            <li>Immersive Interactions</li>
          </ul>
        </div>
      </section>

      <section className={styles.lockedSection}>
        <div className={styles.sectionHeading}>
          <span className={styles.sectionNumber}>06</span>
          <span className={styles.sectionKicker}>Future Archive Expansion</span>
          <h2>Locked modules</h2>
        </div>

        <div className={styles.lockedGrid}>
          {lockedModules.map((module) => (
            <article key={module} className={styles.lockedCard}>
              <span>⌁</span>
              <h3>{module}</h3>
              <p>Access restricted</p>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.disclaimer}>
        <div>
          <span className={styles.sectionNumber}>07</span>
          <span className={styles.sectionKicker}>Disclaimer</span>
        </div>

        <p>
          This is an unofficial fan-made archive created for educational,
          artistic and experimental purposes only. Stephen King, his works and
          all related characters are the property of their respective owners. No
          copyright infringement is intended.
        </p>

        <div className={styles.stamp}>Unofficial Archive Fan Project</div>
      </section>
    </main>
  );
}