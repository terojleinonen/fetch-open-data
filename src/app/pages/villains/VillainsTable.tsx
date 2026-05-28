"use client";

import VillainCard from "./VillainCard";
import styles from "./Villains.module.css";

type Props = {
  villains: any[];
  selected: any;
  onSelect: (villain: any) => void;
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
          className={
            selected?.id === villain.id ? styles.selectedCard : undefined
          }
          onClick={() => onSelect(villain)}
        >
          <VillainCard villain={villain} index={index} view={view} />
        </div>
      ))}
    </section>
  );
}