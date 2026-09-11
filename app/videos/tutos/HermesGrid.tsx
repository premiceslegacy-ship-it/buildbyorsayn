"use client";

import { useState, type ReactNode } from "react";
import { HermesChapterCard } from "./HermesChapter";

export type HermesGridItem = {
  key: string;
  title: string;
  summary?: string;
  body: ReactNode;
};

export function HermesGrid({ items }: { items: HermesGridItem[] }) {
  const [openKey, setOpenKey] = useState<string | null>(null);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 items-start">
      {items.map((item) => (
        <HermesChapterCard
          key={item.key}
          title={item.title}
          summary={item.summary}
          isOpen={openKey === item.key}
          onToggle={() => setOpenKey((k) => (k === item.key ? null : item.key))}
        >
          {item.body}
        </HermesChapterCard>
      ))}
    </div>
  );
}
