"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

export type ArchiveExplorerItem = {
  id: string;
  href: string;
  title: string;
  type: string;
  typeLabel: string;
  year?: number;
  eyebrow: string;
  meta: string;
  searchText: string;
  imageUrl?: string;
  imageCredit?: string;
  description?: string;
  footer?: string;
  status?: "secondary" | "provisional";
  variant: "work" | "character" | "screen";
};

const normalize = (value: string) => value.toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, " ").trim();

function relevance(item: ArchiveExplorerItem, query: string) {
  const terms = normalize(query).split(" ").filter(Boolean);
  if (!terms.length) return 0;
  const title = normalize(item.title);
  const type = normalize(`${item.type} ${item.typeLabel} ${item.year || ""}`);
  const body = normalize(item.searchText);
  if (!terms.every((term) => title.includes(term) || type.includes(term) || body.includes(term))) return -1;
  return terms.reduce((score, term) => score + (title === term ? 100 : title.startsWith(term) ? 45 : title.includes(term) ? 25 : type.includes(term) ? 12 : 4), 0);
}

export function ArchiveExplorer({items, filterLabel = "Type", dateLabel = "publication date", placeholder}: {items: ArchiveExplorerItem[]; filterLabel?: string; dateLabel?: string; placeholder: string}) {
  const [query, setQuery] = useState("");
  const [type, setType] = useState("all");
  const [order, setOrder] = useState<"newest" | "oldest">("newest");
  const [view, setView] = useState<"covers" | "list">("covers");
  const types = useMemo(() => [...new Map(items.map((item) => [item.type, item.typeLabel])).entries()].sort((a, b) => a[1].localeCompare(b[1])), [items]);
  const visible = useMemo(() => items.map((item) => ({item, score: relevance(item, query)})).filter(({item, score}) => (type === "all" || item.type === type) && score >= 0).sort((a, b) => {
    if (query.trim() && b.score !== a.score) return b.score - a.score;
    const years = order === "newest" ? (b.item.year || 0) - (a.item.year || 0) : (a.item.year || Number.MAX_SAFE_INTEGER) - (b.item.year || Number.MAX_SAFE_INTEGER);
    return years || a.item.title.localeCompare(b.item.title);
  }).map(({item}) => item), [items, order, query, type]);

  return <section className="archive-explorer" aria-label="Archive search and filters">
    <div className="archive-tools">
      <label className="archive-search"><span>SEARCH THE ARCHIVE</span><div><i aria-hidden="true"/><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder={placeholder}/>{query && <button type="button" onClick={() => setQuery("")} aria-label="Clear search">×</button>}</div></label>
      <div className="archive-sort"><span>SORT BY {dateLabel.toUpperCase()}</span><button type="button" onClick={() => setOrder(order === "newest" ? "oldest" : "newest")} aria-pressed={order === "oldest"}>{order === "newest" ? "Newest first ↓" : "Oldest first ↑"}</button></div>
    </div>
    <div className="archive-filter-row"><div className="archive-type-filters" aria-label={`${filterLabel} filters`}><button className={type === "all" ? "active" : ""} onClick={() => setType("all")}>All</button>{types.map(([value, label]) => <button className={type === value ? "active" : ""} onClick={() => setType(value)} key={value}>{label}</button>)}</div><div className="archive-view-meta"><p><b>{visible.length}</b> of {items.length} records</p><div className="archive-view-toggle" aria-label="Archive view"><button className={view === "covers" ? "active" : ""} onClick={() => setView("covers")} aria-pressed={view === "covers"}><i className="cover-icon" aria-hidden="true"/> Covers</button><button className={view === "list" ? "active" : ""} onClick={() => setView("list")} aria-pressed={view === "list"}><i className="list-icon" aria-hidden="true"/> List</button></div></div></div>
    {visible.length ? view === "covers" ? <div className={`archive-grid ${items[0]?.variant === "screen" ? "screen-grid" : ""}`}>{visible.map((item) => <ArchiveResult item={item} key={item.id}/>)}</div> : <div className="archive-list" role="list">{visible.map((item) => <ArchiveListResult item={item} key={item.id}/>)}</div> : <div className="archive-empty"><span>NO MATCHING RECORDS</span><h2>The trail goes cold.</h2><p>Try a title, person, subject, role, year, or a broader type.</p><button onClick={() => { setQuery(""); setType("all"); }}>Reset the archive</button></div>}
  </section>;
}

function ArchiveListResult({item}: {item: ArchiveExplorerItem}) {
  return <Link className="archive-list-row" href={item.href} role="listitem"><div className={`archive-list-thumb ${item.imageUrl ? "has-image" : ""}`}>{item.imageUrl ? <img src={item.imageUrl} alt=""/> : <span>{item.variant === "character" ? item.title.charAt(0) : "◆"}</span>}</div><small>{item.typeLabel}</small><h2>{item.title}</h2><p>{item.meta}</p><time>{item.year || "—"}</time><b aria-hidden="true">↗</b></Link>;
}

function ArchiveResult({item}: {item: ArchiveExplorerItem}) {
  if (item.variant === "work") return <Link className="archive-card has-cover" href={item.href}>{item.imageUrl ? <div className="archive-cover"><img src={item.imageUrl} alt={`Cover of ${item.title}`}/><span>{item.imageCredit}</span></div> : <div className="archive-cover cover-placeholder" aria-label="No standalone cover record"><i/><b>{item.typeLabel}</b><span>No standalone cover</span></div>}<div className="archive-copy"><small>{item.eyebrow}</small><h2>{item.title}</h2><p>{item.meta}</p></div></Link>;
  if (item.variant === "screen") return <Link className={item.imageUrl ? "archive-card screen-card has-poster" : "archive-card screen-card"} href={item.href}>{item.imageUrl && <div className="screen-poster"><img src={item.imageUrl} alt={`Poster for ${item.title}`}/><span>{item.imageCredit}</span></div>}<div className="screen-copy"><small>{item.eyebrow}</small><h2>{item.title}</h2>{item.description && <p className="card-abstract">{item.description}</p>}<div><p>{item.meta}</p><b>{item.footer || "OPEN DOSSIER ↗"}</b></div></div></Link>;
  return <Link className="archive-card character-card" href={item.href}><small className={`status ${item.status}`}>{item.eyebrow}</small><h2>{item.title}</h2><p>{item.meta}</p></Link>;
}
