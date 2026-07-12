"use client";

import VillainCard from "./VillainCard";
import styles from "./Villains.module.css";
import { Villain } from "../../../lib/types";

type Props = {
  villains: Villain[];
  selected: Villain | null;
  onSelect: (villain: Villain) => void;
  view: "GRID" | "LIST";
};

export default function VillainsTable({
  villains,
  selected,
  onSelect,
  view,
}: Props) {
  if (!villains.length) {
    return (
      <div className={styles.empty}>
        <h3>No entities found</h3>
        <p>The archive returned no matching dossiers.</p>
      </div>
    );
  }

  return (
    <section className={view === "GRID" ? styles.grid : styles.listView}>
      {villains.map((villain, index) => (
        <div
          key={villain.id || `${villain.name}-${index}`}
          role="button"
          tabIndex={0}
          className={
            selected?.id === villain.id ? styles.selectedCard : undefined
          }
          onClick={() => onSelect(villain)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              onSelect(villain);
            }
          }}
          aria-label={`Open dossier for ${villain.name}`}
          style={{ cursor: "pointer" }}
        >
          <VillainCard villain={villain} index={index} view={view} />
        </div>
      ))}
    </section>
  );
}
