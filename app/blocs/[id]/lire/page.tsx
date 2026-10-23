import { notFound, redirect } from "next/navigation";
import { parseReaderMode } from "@/components/reader/readerModel";
import { blockDiagramsForSection } from "@/components/schemas/blocks.server";
import { getBlocForCurrentUser } from "@/lib/blocData.server";
import ReaderClient from "./ReaderClient";

export const dynamic = "force-dynamic";

export default async function BlocReaderPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ mode?: string; chapter?: string }> }) {
  const { id } = await params;
  const query = await searchParams;
  const result = await getBlocForCurrentUser(id);
  if (!result) redirect(`/login?next=${encodeURIComponent(`/blocs/${id}/lire`)}`);
  if (!result.bloc) notFound();
  if (result.bloc.sections.length === 0) redirect(`/blocs/${id}`);
  const diagrams = Object.fromEntries(result.bloc.sections.flatMap((section) => {
    const diagram = blockDiagramsForSection(section.id);
    return diagram ? [[section.id, diagram]] : [];
  }));
  return <ReaderClient bloc={result.bloc} diagrams={diagrams} tier={result.tier} identity={result.identity} initialMode={parseReaderMode(query.mode)} initialChapter={query.chapter} />;
}
