// src/app/pages/shorts/ShortTable.tsx
"use client";

import ShortCard from "./ShortCard";
import styles from "./Shorts.module.css";

type Props = {
  stories: any[];
  selected: any;
  onSelect: (story: any) => void;
  view: "GRID" | "LIST";
};

export default function ShortTable({
  stories,
  selected,
  onSelect,
  view,
}: Props) {
  return (
    <section
      className={
        view === "GRID"
          ? styles.fragmentGrid
          : styles.fragmentList
      }
    >
      {stories.map((story, index) => (
        <div
          key={story.id || index}
          className={
            selected?.id === story.id
              ? styles.selectedCard
              : ""
          }
          onClick={() => onSelect(story)}
        >
          <ShortCard
            story={story}
            variant={index % 4}
            view={view}
          />
        </div>
      ))}
    </section>
  );
}