import Link from "next/link";
import { notFound } from "next/navigation";
import { getPlace, placeWorks, places } from "@/lib/places";
import { slugify } from "@/lib/data";

export function generateStaticParams() {
  return places.map((p) => ({ slug: p.id }));
}

export default async function PlaceDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params,
    p = getPlace(slug);
  if (!p) notFound();
  const linked = placeWorks(p);
  const reading =
    p.mapStatus === "exact"
      ? "This marker represents a real-world place. Its literary relationship is documented separately."
      : p.mapStatus === "unmapped"
        ? "This place is intentionally not pinned to the Maine atlas."
        : "The marker communicates an approximate narrative region. It is not a canonical coordinate.";
  const record = String(places.findIndex((x) => x.id === p.id) + 1).padStart(
    2,
    "0",
  );
  return (
    <main className="place-record">
      <section className="place-record-hero">
        <div className="place-record-image" />
        <Link className="place-record-back" href="/places">
          ← RETURN TO THE ATLAS
        </Link>
        <div className="place-record-index">
          <span>PLACE RECORD</span>
          <b>
            {record} / {places.length}
          </b>
        </div>
        <div
          className={`place-record-heading name-${p.name.length <= 12 ? "short" : p.name.length <= 23 ? "medium" : "long"}`}
        >
          <small>
            {p.kind} / {p.region} / {p.mapStatus}
          </small>
          <h1>{p.name}</h1>
          <p>{p.summary}</p>
        </div>
        <div className={`place-record-stamp ${p.mapStatus}`}>
          {p.mapStatus}
          <br />
          location
        </div>
        <div className="place-record-rule">
          <span>THE FICTIONAL GEOGRAPHY</span>
          <span>
            {p.x !== undefined
              ? `EDITORIAL GRID ${p.x} / ${p.y}`
              : "COORDINATES WITHHELD"}
          </span>
        </div>
      </section>
      <section className="place-record-body">
        <div className="place-dossier">
          <div className="place-dossier-label">
            <span>CASE FILE / GEOGRAPHY</span>
            <b>{p.name}</b>
          </div>
          <div className="place-facts">
            <div>
              <span>Place class</span>
              <b>{p.kind}</b>
            </div>
            <div>
              <span>Map confidence</span>
              <b>{p.mapStatus}</b>
            </div>
            <div>
              <span>Region</span>
              <b>{p.region}</b>
            </div>
            {p.inspiration && (
              <div>
                <span>Real-world relationship</span>
                <b>{p.inspiration}</b>
              </div>
            )}
          </div>
          <blockquote>
            “A place in the record is not necessarily a place on the earth.”
          </blockquote>
        </div>
        <aside className="place-reading">
          <span>MAP READING / EVIDENCE</span>
          <p>{reading}</p>
          <div className="source-note">
            <b>SOURCE NOTE</b>
            <p>{p.source.note}</p>
            <a href={p.source.url} target="_blank" rel="noreferrer">
              {p.source.name} ↗
            </a>
          </div>
        </aside>
      </section>
      <section className="place-works">
        <header>
          <span>WORKS IN THE RECORD</span>
          <b>{linked.length.toString().padStart(2, "0")}</b>
        </header>
        <div>
          {linked.map((w, index) => (
            <Link href={`/works/${slugify(w!.title)}`} key={w!.id}>
              <small>{String(index + 1).padStart(2, "0")}</small>
              <strong>{w!.title}</strong>
              <span>{w!.year || "UNDATED"}</span>
              <b>OPEN CASE FILE →</b>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
