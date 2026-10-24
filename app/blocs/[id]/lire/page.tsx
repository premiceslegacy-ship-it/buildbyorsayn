import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { parseReaderMode } from "@/components/reader/readerModel";
import { getBlocForCurrentUser } from "@/lib/blocData.server";
import ReaderClient from "./ReaderClient";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ chapter?: string }> }): Promise<Metadata> {
  const { id } = await params;
  const query = await searchParams;
  const result = await getBlocForCurrentUser(id);
  const section = result?.bloc?.sections.find((item) => item.id === query.chapter);
  const fallback = result?.bloc?.titre?.replace(/^Bloc\s+\d+\s*[:：]\s*/u, "").trim() || "ton parcours";
  return { title: `Bloc ${id}, ${section?.title || fallback} | BUILD`, robots: { index: false, follow: false } };
  return { title: `${section?.title || `Bloc ${id}, ${fallback}`} | BUILD`, robots: { index: false, follow: false } };
}

export default async function BlocReaderPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ mode?: string; chapter?: string }> }) {
  const { id } = await params;
  const query = await searchParams;
  const result = await getBlocForCurrentUser(id);
  if (!result) redirect(`/login?next=${encodeURIComponent(`/blocs/${id}/lire`)}`);
  if (!result.bloc) notFound();
  if (result.bloc.sections.length === 0) redirect(`/blocs/${id}`);
  return <ReaderClient bloc={result.bloc} tier={result.tier} identity={result.identity} initialMode={parseReaderMode(query.mode)} initialChapter={query.chapter} />;
}
