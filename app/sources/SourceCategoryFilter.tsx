"use client";

import { useState, type ReactNode } from "react";
import styles from "@/components/ui4/ui4.module.css";
import { filterSourceEntries } from "./filter";

type SourceEntry = {
  id: number;
  category: string;
  content: ReactNode;
};

export function SourceCategoryFilter({
  categories,
  entries,
}: {
  categories: readonly string[];
  entries: SourceEntry[];
}) {
  const [activeCategory, setActiveCategory] = useState(categories[0] ?? "");
  const visibleEntries = filterSourceEntries(entries, activeCategory, categories[0] ?? "");

  return (
    <section className={styles.section} aria-label="Sources par catégorie">
      <div className={styles.filterBar} role="group" aria-label="Filtrer les sources">
        {categories.map((category) => (
          <button
            type="button"
            key={category}
            onClick={() => setActiveCategory(category)}
            className={styles.filterButton}
            aria-pressed={activeCategory === category}
          >
            {category}
          </button>
        ))}
      </div>

      {visibleEntries.length > 0 ? (
        <div className={styles.sourceGrid} aria-live="polite">
          {visibleEntries.map((entry) => (
            <div key={entry.id}>{entry.content}</div>
          ))}
        </div>
      ) : <p className={styles.empty} role="status">Aucune source n’est disponible dans cette catégorie.</p>}
    </section>
  );
}
