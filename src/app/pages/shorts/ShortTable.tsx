// src/app/pages/shorts/ShortTable.tsx
"use client";

import ShortCard from "./ShortCard";
import styles from "./Shorts.module.css";
import { Short } from "../../../lib/types";

type Props = {
  stories: Short[];
  selected: Short | null;
  onSelect: (story: Short) => void;
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
          role="button"
          tabIndex={0}
          className={
            selected?.id === story.id
              ? styles.selectedCard
              : ""
          }
          onClick={() => onSelect(story)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              onSelect(story);
            }
          }}
          aria-label={`Open details for ${story.title}`}
          style={{ cursor: "pointer" }}
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
