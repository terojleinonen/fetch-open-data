import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getWork,
  officialSource,
  slugify,
  workAwards,
  workCover,
  workDescription,
  workEditions,
  works,
} from "@/lib/data";
import { WorkConnections } from "@/components/EntityConnections";
import { FitTitle } from "@/components/FitTitle";
import { ReliableCover } from "@/components/ReliableCover";
import { EditorialWorkPlate } from "@/components/EditorialWorkPlate";

export function generateStaticParams() {
  return works.map((work) => ({ slug: slugify(work.title) }));
}

export default async function WorkDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const work = getWork(slug);
  if (!work) notFound();
  const editions = workEditions(work.id);
  const official = officialSource(work);
  const cover = workCover(work.id);
  const description = workDescription(work.id);
  const awards = workAwards(work.title);

  return (
    <main className="page detail">
      <Link className="back" href="/works">
        ← RETURN TO THE ARCHIVE
      </Link>
      <div className="detail-heading with-cover">
        {cover && (
          <a
            className="book-cover"
            href={cover.recordUrl}
            target="_blank"
            rel="noreferrer"
          >
            <ReliableCover
              src={cover.imageUrl}
              alt={`Cover of ${work.title}`}
              width={460}
              height={690}
              sizes="(max-width: 850px) 120px, 230px"
              sourceSize="L"
              priority
              fallback={
                <EditorialWorkPlate
                  id={work.id}
                  title={work.title}
                  type={work.type}
                  year={work.year}
                  compact
                />
              }
            />
            <span>{cover.attribution} ↗</span>
          </a>
        )}
        {!cover && (
          <div className="book-cover editorial-plate-detail">
            <EditorialWorkPlate
              id={work.id}
              title={work.title}
              type={work.type}
              year={work.year}
              compact
            />
          </div>
        )}
        <div>
          <div className="detail-kicker">
            {work.type.replace("-", " ")} · {work.year}
          </div>
          <FitTitle title={work.title} variant="record" />
        </div>
      </div>
      <div className="detail-grid">
        <div>
          {description && (
            <section className="abstract">
              <span>RESEARCH ABSTRACT</span>
              <p>{description.text}</p>
              <a href={description.sourceUrl} target="_blank" rel="noreferrer">
                {description.provider} · {description.license} ↗
              </a>
            </section>
          )}
          <div className="fact-grid">
            {work.facts?.publisher && (
              <div className="fact">
                <span>Publisher</span>
                <b>{work.facts.publisher}</b>
              </div>
            )}
            {work.facts?.isbn && (
              <div className="fact">
                <span>ISBN</span>
                <b>{work.facts.isbn}</b>
              </div>
            )}
            {work.facts?.pages && (
              <div className="fact">
                <span>Length</span>
                <b>{work.facts.pages} pages</b>
              </div>
            )}
            {work.facts?.originallyPublishedIn && (
              <div className="fact">
                <span>First appeared in</span>
                <b>{work.facts.originallyPublishedIn}</b>
              </div>
            )}
            {work.facts?.collectedIn && (
              <div className="fact">
                <span>Collected in</span>
                <b>{work.facts.collectedIn}</b>
              </div>
            )}
          </div>
          {work.dataNote && (
            <p className="source-note">CURATION NOTE — {work.dataNote}</p>
          )}
          {official && (
            <p className="source-note">
              PRIMARY SOURCE —{" "}
              <a href={official.url} target="_blank" rel="noreferrer">
                StephenKing.com ↗
              </a>
            </p>
          )}
        </div>
        <aside>
          {awards.length > 0 && (
            <div className="relation-block awards-block">
              <h3>Awards & distinctions</h3>
              {awards.map((award) => (
                <a
                  href={award.sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                  key={`${award.award}-${award.year}`}
                >
                  <b>
                    {award.result} · {award.year}
                  </b>
                  {award.award}
                  <small>{award.organization} · StephenKing.com ↗</small>
                </a>
              ))}
            </div>
          )}
          <div className="relation-block">
            <h3>Known editions</h3>
            {editions.length ? (
              editions.map((edition) => (
                <p key={edition.id}>
                  {edition.publisher || edition.title}
                  {edition.pageCount ? ` · ${edition.pageCount} pp.` : ""}
                </p>
              ))
            ) : (
              <p>No edition record.</p>
            )}
          </div>
        </aside>
      </div>
      <WorkConnections workId={work.id} title={work.title} />
    </main>
  );
}
