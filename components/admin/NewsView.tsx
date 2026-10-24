import type { ReactNode } from "react";
import Link from "next/link";
import { listPendingRequests } from "@/lib/adminAgent";
import { NewsClient } from "./news/NewsClient";

export default async function NewsView({ youtubePanel }: { youtubePanel?: ReactNode }) {
  const requests = await listPendingRequests();
  const hasPendingNews = requests.some((request) => request.kind === "nouveaute");
  return <NewsClient youtubePanel={youtubePanel} hasPendingNewsRequest={hasPendingNews ? <p className="rounded-2xl border border-white/10 bg-white/[.04] p-4 text-sm text-white/70">Ton agent peut les préparer pour toi. Une nouveauté attend ta validation. <Link className="underline underline-offset-4" href="/admin#agent">Ouvre Agent pour la valider.</Link></p> : null} />;
}
