import { notFound, redirect } from "next/navigation";
import { parseReaderMode, readerModeQuery } from "@/components/reader/readerModel";
import { getBlocForCurrentUser } from "@/lib/blocData.server";
import BlocClient from "./BlocClient";

export const dynamic = "force-dynamic";
export const metadata = { title: "Bloc | BUILD", robots: { index: false, follow: false } };

export default async function BlocPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ mode?: string; chapter?: string }> }) {
  const { id } = await params;
  const query = await searchParams;
  const legacyMode = parseReaderMode(query.mode);
  if (legacyMode || query.chapter) {
    const next = new URLSearchParams();
    if (query.chapter) next.set("chapter", query.chapter);
    if (legacyMode) next.set("mode", readerModeQuery(legacyMode));
    redirect(`/blocs/${id}/lire?${next.toString()}`);
  }
  const result = await getBlocForCurrentUser(id);
  if (!result) redirect("/login");
  if (!result.bloc) notFound();
  return <BlocClient bloc={result.bloc} tier={result.tier} checkoutUserId={result.userId} identity={result.identity} />;
}
