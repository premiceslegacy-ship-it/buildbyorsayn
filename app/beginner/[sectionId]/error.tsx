"use client";

import { ReaderError } from "@/components/reader/ReaderState";

export default function BeginnerChapterError({ reset }: { reset: () => void }) {
  return <ReaderError reset={reset} backHref="/beginner" />;
}
