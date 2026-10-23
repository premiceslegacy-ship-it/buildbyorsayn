"use client";

import { ReaderError } from "@/components/reader/ReaderState";

export default function BlocError({ reset }: { reset: () => void }) {
  return <ReaderError reset={reset} backHref="/programme" />;
}
