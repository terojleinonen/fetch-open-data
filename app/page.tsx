import Link from "next/link";
import { adaptations, characters, works } from "@/lib/data";
import { places } from "@/lib/places";
import { EditorialHero } from "@/components/EditorialHero";

const portals = [
  {
    title: "Literary works",
    copy: "The library of worlds",
    href: "/works",
    className: "books",
  },
  {
    title: "Characters",
    copy: "Faces in the dark",
    href: "/characters",
    className: "characters",
  },
  {
    title: "Places",
    copy: "The fictional geography",
    href: "/places",
    className: "places",
  },
  {
    title: "From page to screen",
    copy: "Every adaptation argues",
    href: "/adaptations",
    className: "screen",
  },
  {
    title: "Timeline",
    copy: "The story that runs",
    href: "/timeline",
    className: "timeline",
  },
];
const timeline = ["The Long Walk", "Carrie", "It", "The Green Mile", "11/22/63"]
  .map((title) => works.find((work) => work.title === title))
  .filter(Boolean);
const derry = places.find((place) => place.id === "derry");

export default function Home() {
  return (
    <main className="editorial-home">
      <EditorialHero
        eyebrow="THE CONSTANT READER'S FIELD GUIDE"
        lines={["Stephen", "King", "Universe"]}
        accentLine={2}
        description="An exhibition of works, places, people and patterns from the world of Stephen King."
        primary={{ label: "Enter the universe", href: "/works" }}
        secondary={{ label: "Open the atlas", href: "/places" }}
        variant="collage"
        stats={[
          { value: works.length, label: "curated works" },
          { value: characters.length, label: "character records" },
          { value: adaptations.length, label: "screen adaptations" },
          { value: places.length, label: "mapped places" },
        ]}
      />
      <section className="editorial-portals">
        <div className="section-register">
          <span>01 / EXPLORE PORTALS</span>
          <p>Follow the evidence through the archive.</p>
        </div>
        <div className="portal-grid">
          {portals.map((portal, index) => (
            <Link
              className={`editorial-portal ${portal.className}`}
              href={portal.href}
              key={portal.href}
            >
              <small>0{index + 1}</small>
              <div>
                <h2>{portal.title}</h2>
                <p>{portal.copy}</p>
              </div>
              <b>ENTER →</b>
            </Link>
          ))}
          <aside className="collage-note">
            <span>FIELD OBSERVATION / 01</span>
            <p>
              Some places exist.
              <br />
              Others insist.
            </p>
            <i>— THE SCHOLAR&apos;S DESK</i>
          </aside>
        </div>
        <div className="evidence-collage">
          <Link href="/places/derry" className="latest-case">
            <small>LATEST PLACE FILE</small>
            <h2>Derry</h2>
            <p>{derry?.summary}</p>
            <b>{derry?.workTitles.length} LINKED WORKS →</b>
          </Link>
          <div className="universe-numbers">
            <span>UNIVERSE BY THE NUMBERS</span>
            <div>
              <b>{works.length}</b>
              <small>works</small>
              <b>{characters.length}</b>
              <small>characters</small>
              <b>{places.length}</b>
              <small>places</small>
            </div>
            <Link href="/sources">EXPLORE THE DATA →</Link>
          </div>
          <div className="home-timeline">
            <span>PUBLICATION TRAIL</span>
            <div>
              {timeline.map((work) => (
                <Link
                  href={`/works/${work!.title
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, "-")
                    .replace(/^-|-$/g, "")}`}
                  key={work!.id}
                >
                  <b>{work!.year}</b>
                  <small>{work!.title}</small>
                  <i />
                </Link>
              ))}
            </div>
            <Link href="/timeline">VIEW THE FULL TIMELINE →</Link>
          </div>
        </div>
      </section>
      <section className="editorial-manifesto">
        <span>THE SCHOLAR&apos;S DESK IS ALWAYS OPEN.</span>
        <h2>
          Built on facts.
          <br />
          <i>Honest about uncertainty.</i>
        </h2>
        <p>
          Publication data is reconciled against named sources. Community
          records and interpretive geography remain visibly marked until
          independently verified.
        </p>
        <Link href="/sources">Enter the research archive →</Link>
      </section>
    </main>
  );
}
