"use client";

import { ReaderError } from "@/components/reader/ReaderState";

export default function HermesLearningError({ reset }: { reset: () => void }) {
  return <ReaderError reset={reset} backHref="/videos/tutos" />;
}
