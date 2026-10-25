import type { ReactNode } from "react";
import Link from "next/link";
import { listPendingRequests } from "@/lib/adminAgent";
import { NewsClient } from "./news/NewsClient";

export default async function NewsView({ youtubePanel }: { youtubePanel?: ReactNode }) {
  const requests = await listPendingRequests();
  const hasPendingNews = requests.some((request) => request.kind === "nouveaute");
  return <NewsClient youtubePanel={youtubePanel} hasPendingNewsRequest={hasPendingNews ? <p className="admin-news-pending">Une nouveauté attend ta validation. <Link className="underline underline-offset-4" href="/admin#agent">Ouvre Agent.</Link></p> : null} />;
}
