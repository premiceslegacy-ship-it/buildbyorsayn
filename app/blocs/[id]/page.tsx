import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { getBlocForCurrentUser, getBlocVideos } from "@/lib/blocData.server";
import BlocClient from "./BlocClient";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const result = await getBlocForCurrentUser(id);
  const label = result?.bloc?.titre?.replace(/^Bloc\s+\d+\s*[:：]\s*/u, "").trim();
  const title = result?.bloc ? `Bloc ${result.bloc.displayNumber}, ${label || "ton parcours"} | BUILD` : "BUILD";
  return { title, robots: { index: false, follow: false } };
}

export default async function BlocPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ mode?: string; chapter?: string; video?: string }> }) {
  const { id } = await params;
  const query = await searchParams;
  if (query.mode || query.chapter) {
    const next = new URLSearchParams();
    if (query.chapter) next.set("chapter", query.chapter);
    redirect(`/blocs/${id}/lire?${next.toString()}`);
  }
  const result = await getBlocForCurrentUser(id);
  if (!result) redirect("/login");
  if (!result.bloc) notFound();
  const videos = await getBlocVideos(result.bloc.id, result.tier);
  const initialVideoPosition = query.video ? Number(query.video) : undefined;
  return <BlocClient bloc={result.bloc} tier={result.tier} checkoutUserId={result.userId} identity={result.identity} videos={videos} initialVideoPosition={Number.isSafeInteger(initialVideoPosition) ? initialVideoPosition : undefined} />;
}
