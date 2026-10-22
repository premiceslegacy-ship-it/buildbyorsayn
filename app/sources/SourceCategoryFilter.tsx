"use client";

import { useState, type ReactNode } from "react";

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
  const visibleEntries = entries.filter(
    (entry) => activeCategory === categories[0] || entry.category === activeCategory,
  );

  return (
    <>
      <div className="flex flex-wrap justify-center gap-3 max-w-3xl mx-auto">
        {categories.map((category) => (
          <button
            type="button"
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${activeCategory === category
              ? "bg-[#e8d5b0] text-[#0e0e0f] shadow-[0_0_15px_rgba(232,213,176,0.4)]"
              : "bg-white/5 text-white/60 border border-white/10 hover:bg-white/10 hover:text-white/90"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-8 pb-24 mt-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {visibleEntries.map((entry) => (
            <div key={entry.id} className="h-full">{entry.content}</div>
          ))}
        </div>
      </div>
    </>
  );
}
