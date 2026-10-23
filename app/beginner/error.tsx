"use client";

import { ReaderError } from "@/components/reader/ReaderState";

export default function BeginnerError({ reset }: { reset: () => void }) {
  return <ReaderError reset={reset} backHref="/programme" />;
}
