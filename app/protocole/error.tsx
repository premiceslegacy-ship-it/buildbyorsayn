"use client";

import { ReaderError } from "@/components/reader/ReaderState";

export default function ProtocoleError({ reset }: { reset: () => void }) {
  return <ReaderError reset={reset} backHref="/programme" />;
}
