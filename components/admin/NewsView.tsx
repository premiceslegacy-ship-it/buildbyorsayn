import type { ReactNode } from "react";
import { NewsClient } from "./news/NewsClient";

export default function NewsView({ youtubePanel }: { youtubePanel?: ReactNode }) {
  return <NewsClient youtubePanel={youtubePanel} />;
}
