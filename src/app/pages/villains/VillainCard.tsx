"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import styles from "./VillainCard.module.css";

type Props = {
  villain: any;
  index?: number;
  view?: "GRID" | "LIST";
};

const evidenceImages = [
  "/villains/evidence-drain.jpeg",
  "/villains/evidence-house.jpeg",
  "/villains/evidence-figure.jpeg",
  "/villains/evidence-note.jpeg",
  "/villains/evidence-license.jpeg",
  "/villains/evidence-forest.jpeg",
  "/villains/evidence-motel.jpeg",
  "/villains/evidence-road.jpeg",
];

export default function VillainCard({ villain, index = 0, view = "GRID" }: Props) {
  const status = String(villain.status || "Unknown").toUpperCase();
  const image = villain.image || evidenceImages[index % evidenceImages.length];

  return (
    <motion.article
      className={`${styles.card} ${view === "LIST" ? styles.list : ""}`}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.22 }}
    >
      <div className={styles.top}>
        <span>ENTITY {String(index + 1).padStart(3, "0")}</span>
        <span className={styles.skulls}>{renderThreat(status)}</span>
      </div>

      <div className={styles.imageWrap}>
        <Image src={image} alt="" className={styles.image} width={600} height={360} />
        <div className={styles.imageShade} />
      </div>

      <div className={styles.body}>
        <span className={styles.location}>
          {villain.location || "Unknown location"}
        </span>

        <h3>{villain.name}</h3>

        <p className={styles.type}>
          {villain.type || villain.category || "Entity / Unknown"}
        </p>

        <div className={styles.meta}>
          <div>
            <span>Known Occurrences</span>
            <strong>
              {(villain.books?.length || 0) + (villain.shorts?.length || 0) || "—"}
            </strong>
          </div>

          <div>
            <span>Status</span>
            <strong className={styles.status}>{status}</strong>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

function renderThreat(status: string) {
  if (status === "RECURRING") return "☠ ☠ ☠ ☠ ☠";
  if (status === "ACTIVE") return "☠ ☠ ☠ ☠";
  if (status === "POTENTIAL") return "☠ ☠ ☠";
  return "☠ ☠";
}