import Link from "next/link";

export function EditorialHero({
  eyebrow,
  lines,
  accentLine,
  description,
  primary,
  secondary,
  variant = "landscape",
  stats,
}: {
  eyebrow: string;
  lines: string[];
  accentLine?: number;
  description: string;
  primary?: { label: string; href: string };
  secondary?: { label: string; href: string };
  variant?: "collage" | "landscape";
  stats?: { value: string | number; label: string }[];
}) {
  return (
    <section className={`editorial-hero editorial-${variant}`}>
      <div className="editorial-image" aria-hidden="true" />
      <div className="editorial-map" aria-hidden="true" />
      <div className="editorial-content">
        <span className="editorial-eyebrow">{eyebrow}</span>
        <h1 className="editorial-title" aria-label={lines.join(" ")}>
          {lines.map((line, index) => (
            <span className={accentLine === index ? "accent" : ""} key={line}>
              {line}
            </span>
          ))}
        </h1>
        <div className="editorial-deck">
          <p>{description}</p>
          {(primary || secondary) && (
            <div>
              {primary && (
                <Link href={primary.href}>
                  {primary.label} <b>→</b>
                </Link>
              )}
              {secondary && (
                <Link href={secondary.href}>{secondary.label}</Link>
              )}
            </div>
          )}
        </div>
      </div>
      <aside className="editorial-note">
        <span>FIELD NOTE / MAINE</span>
        <p>
          Stories leave coordinates.
          <br />
          Evidence leaves a trail.
        </p>
      </aside>
      {stats && (
        <div className="editorial-stats">
          {stats.map((stat) => (
            <div key={stat.label}>
              <b>{stat.value}</b>
              <span>{stat.label}</span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
