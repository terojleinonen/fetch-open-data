"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "./ArchiveControls.module.css";

type FilterOption = {
  label: string;
  value: string;
};

type FilterGroup = {
  key: string;
  options: FilterOption[];
  value: string;
  onChange: (value: string) => void;
};

type Props = {
  query: string;
  onQueryChange: (value: string) => void;

  resultCount?: number;
  totalCount?: number;

  filters?: FilterGroup[];

  onRandom?: () => void;

  // ✅ FIX: add this
  syncToUrl?: boolean;
};

export default function ArchiveControls({
  query,
  onQueryChange,
  resultCount,
  totalCount,
  filters = [],
  onRandom,
  syncToUrl = false,
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [display, setDisplay] = useState("");
  const [cursor, setCursor] = useState(true);

  useEffect(() => {
    let i = 0;
    const text = query;

    const interval = window.setInterval(() => {
      setDisplay(text.slice(0, i));
      i += 1;

      if (i > text.length) {
        window.clearInterval(interval);
      }
    }, 8);

    return () => window.clearInterval(interval);
  }, [query]);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setCursor((current) => !current);
    }, 500);

    return () => window.clearInterval(interval);
  }, []);

  function updateUrl(nextQuery: string) {
    if (!syncToUrl) return;

    const params = new URLSearchParams(searchParams.toString());

    if (nextQuery.trim()) {
      params.set("query", nextQuery);
    } else {
      params.delete("query");
    }

    const queryString = params.toString();

    router.replace(queryString ? `?${queryString}` : "?");
  }

  function handleQueryChange(value: string) {
    onQueryChange(value);
    updateUrl(value);
  }

  function handleFilterChange(group: FilterGroup, value: string) {
    group.onChange(value);

    if (!syncToUrl) return;

    const params = new URLSearchParams(searchParams.toString());

    if (value && value !== "ALL") {
      params.set(group.key, value);
    } else {
      params.delete(group.key);
    }

    const queryString = params.toString();

    router.replace(queryString ? `?${queryString}` : "?");
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.searchWrapper}>
        <input
          className={styles.input}
          value={query}
          onChange={(event) => handleQueryChange(event.target.value)}
          placeholder="Search archive..."
          aria-label="Search archive"
        />

        <div className={styles.overlay}>
          {display}
          {cursor && <span className={styles.cursor}>|</span>}
        </div>
      </div>

      {(resultCount !== undefined || totalCount !== undefined) && (
        <p className={styles.count}>
          {query
            ? `${resultCount ?? 0} records recovered`
            : `${totalCount ?? 0} total records`}
        </p>
      )}

      {filters.length > 0 && (
        <div className={styles.filters}>
          {filters.map((group) => (
            <div key={group.key} className={styles.group} role="group" aria-label={`Filter by ${group.key}`}>
              {group.options.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  className={`${styles.pill} ${
                    group.value === option.value ? styles.active : ""
                  }`}
                  onClick={() => handleFilterChange(group, option.value)}
                  aria-pressed={group.value === option.value}
                >
                  {option.label}
                </button>
              ))}
            </div>
          ))}
        </div>
      )}

      {onRandom && (
        <button
          type="button"
          className={styles.random}
          onClick={onRandom}
          aria-label="Open a random case file dossier"
        >
          OPEN RANDOM FILE
        </button>
      )}
    </div>
  );
}