import { notFound, redirect } from "next/navigation";
import { getBlocForCurrentUser } from "@/lib/blocData.server";
import BlocClient from "./BlocClient";

export const dynamic = "force-dynamic";

export default async function BlocPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const result = await getBlocForCurrentUser(id);
  if (!result) redirect("/login");
  if (!result.bloc) notFound();
  return <BlocClient bloc={result.bloc} tier={result.tier} checkoutUserId={result.userId} />;
}