import type { CSSProperties } from "react";

type EditorialWorkPlateProps = {
  id: string;
  title: string;
  type: string;
  year?: number;
  compact?: boolean;
};

const typeDesign: Record<
  string,
  { label: string; code: string; archetype: string; image: string }
> = {
  book: {
    label: "BOOK / LONG FORM",
    code: "BK",
    archetype: "threshold",
    image: "/art/work-plates/threshold-v1.jpg",
  },
  novella: {
    label: "NOVELLA",
    code: "NV",
    archetype: "terrain",
    image: "/art/work-plates/terrain-v1.jpg",
  },
  "short-story": {
    label: "SHORT STORY",
    code: "SS",
    archetype: "manuscript",
    image: "/art/work-plates/manuscript-v1.jpg",
  },
  poem: {
    label: "POEM",
    code: "PM",
    archetype: "signal",
    image: "/art/work-plates/signal-v1.jpg",
  },
  play: {
    label: "PLAY",
    code: "PL",
    archetype: "relic",
    image: "/art/work-plates/relic-v1.jpg",
  },
  screenplay: {
    label: "SCREENPLAY",
    code: "SC",
    archetype: "redacted",
    image: "/art/work-plates/redacted-v1.jpg",
  },
  teleplay: {
    label: "TELEPLAY",
    code: "TV",
    archetype: "signal",
    image: "/art/work-plates/signal-v1.jpg",
  },
};

function stableHash(value: string) {
  let hash = 2166136261;
  for (const character of value) {
    hash ^= character.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

export function EditorialWorkPlate({
  id,
  title,
  type,
  year,
  compact = false,
}: EditorialWorkPlateProps) {
  const design = typeDesign[type] || {
    label: type.replaceAll("-", " ").toUpperCase(),
    code: "AR",
    archetype: "redacted",
    image: "/art/work-plates/redacted-v1.jpg",
  };
  const hash = stableHash(`${id}:${title}`),
    layout = hash % 3,
    crop = (hash >>> 4) % 4,
    serial = String(hash % 1000).padStart(3, "0");
  const style = { "--plate-image": `url('${design.image}')` } as CSSProperties;
  return (
    <div
      className={`editorial-work-plate plate-${design.archetype} plate-layout-${layout} plate-crop-${crop} ${compact ? "compact" : ""}`}
      style={style}
      aria-label={`${design.label} editorial archive plate for ${title}`}
    >
      <span className="plate-image" aria-hidden="true" />
      <span className="plate-grid" aria-hidden="true" />
      <header>
        <b>
          SK–{design.code}–{serial}
        </b>
        <time>{year || "DATE / ?"}</time>
      </header>
      <strong>{design.label}</strong>
      <svg viewBox="0 0 100 100" aria-hidden="true">
        <circle cx="50" cy="50" r="31" />
        <circle cx="50" cy="50" r="17" />
        <path d="M5 50h90M50 5v90" />
        <circle className="plate-dot" cx="50" cy="50" r="3" />
      </svg>
      <footer>
        <small>EDITORIAL ARCHIVE PLATE</small>
        <em>NOT A PUBLISHED EDITION</em>
      </footer>
    </div>
  );
}
