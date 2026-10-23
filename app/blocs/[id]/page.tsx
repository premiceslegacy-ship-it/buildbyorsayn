import { notFound, redirect } from "next/navigation";
import { parseReaderMode } from "@/components/reader/readerModel";
import { getBlocForCurrentUser } from "@/lib/blocData.server";
import BlocClient from "./BlocClient";

export const dynamic = "force-dynamic";

export default async function BlocPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ mode?: string; chapter?: string }> }) {
  const { id } = await params;
  const query = await searchParams;
  const result = await getBlocForCurrentUser(id);
  if (!result) redirect("/login");
  if (!result.bloc) notFound();
  return <BlocClient bloc={result.bloc} tier={result.tier} checkoutUserId={result.userId} identity={result.identity} initialMode={parseReaderMode(query.mode)} initialChapter={query.chapter} />;
}
