import Link from "next/link";
import { slugify, works, workCharacters, workCover } from "@/lib/data";
import {
  ArchiveExplorer,
  type ArchiveExplorerItem,
} from "@/components/ArchiveExplorer";
import { EditorialHero } from "@/components/EditorialHero";
export const metadata = { title: "Works" };
export default function Works() {
  const items: ArchiveExplorerItem[] = works.map((work) => {
    const cover = workCover(work.id),
      linked = workCharacters(work.id),
      typeLabel = work.type.replaceAll("-", " ");
    return {
      id: work.id,
      href: `/works/${slugify(work.title)}`,
      title: work.title,
      type: work.type,
      typeLabel,
      year: work.year,
      eyebrow: `${typeLabel} · ${work.year || "undated"}`,
      meta: `${linked.length} character links · ${work.status}`,
      searchText: [
        work.facts?.publisher,
        work.facts?.originallyPublishedIn,
        work.facts?.collectedIn,
        ...(work.facts?.categories || []),
        ...(work.facts?.subjects || []),
        ...(work.facts?.villains || []),
        ...linked.map((character) => character.name),
        work.status,
      ]
        .filter(Boolean)
        .join(" "),
      imageUrl: cover?.imageUrl,
      imageCredit: cover ? "Cover via Open Library" : undefined,
      variant: "work",
    };
  });
  const featured = ["Carrie", "The Shining", "It", "Misery", "The Green Mile"]
    .map((title) => items.find((item) => item.title === title))
    .filter(Boolean) as ArchiveExplorerItem[];
  return (
    <main className="works-editorial">
      <EditorialHero
        eyebrow="THE ARCHIVE / LITERARY WORKS"
        lines={["The literary", "landscape"]}
        accentLine={1}
        description={`${works.length} reconciled records. Search titles, subjects, publishers, characters and publication data.`}
        primary={{ label: "Explore the archive", href: "#archive" }}
        variant="landscape"
        stats={[
          { value: works.length, label: "documented works" },
          {
            value: new Set(works.map((work) => work.type)).size,
            label: "work types",
          },
        ]}
      />
      <section className="bookshop-window">
        <header>
          <span>THE READER&apos;S TABLE / 001</span>
          <h2>
            FIVE DOORS
            <br />
            INTO THE <i>ARCHIVE.</i>
          </h2>
          <p>
            A rotating editorial selection—not a ranking. Covers are edition
            records supplied by Open Library.
          </p>
        </header>
        <div className="bookshop-shelf">
          {featured.map((item, index) => (
            <Link
              href={item.href}
              key={item.id}
              className={`shop-book shop-book-${index + 1}`}
            >
              {item.imageUrl ? (
                <img src={item.imageUrl} alt={`Cover of ${item.title}`} />
              ) : (
                <div className="shop-cover-placeholder">{item.title}</div>
              )}
              <small>
                {String(index + 1).padStart(2, "0")} / {item.year}
              </small>
              <h3>{item.title}</h3>
              <span>ENTER THE RECORD ↗</span>
            </Link>
          ))}
        </div>
        <aside>
          <b>CURATOR&apos;S NOTE</b>
          <p>
            Begin with a threshold. Follow a town, a character, or a recurring
            shadow into the wider universe.
          </p>
        </aside>
      </section>
      <div className="page works-archive" id="archive">
        <div className="bookshop-catalogue-title">
          <span>THE COMPLETE CATALOGUE / {items.length} RECORDS</span>
          <h2>
            BROWSE
            <br />
            <i>THE STACKS.</i>
          </h2>
          <p>
            Search like a reader. Filter like a bookseller. Open a record like
            an archivist.
          </p>
        </div>
        <ArchiveExplorer
          items={items}
          placeholder="Try ‘Castle Rock’, ‘vampire’, or ‘novel 1986’"
        />
      </div>
    </main>
  );
}
