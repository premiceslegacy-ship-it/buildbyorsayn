import "server-only";
import Link from "next/link";
import { redirect } from "next/navigation";
import { doctrineAccessStatus } from "@/lib/doctrine/access.server";
import { readPublishedDoctrine } from "@/lib/doctrine/storage";
import { DoctrineContent } from "./DoctrineContent";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const metadata = { title: "Doctrine agentique | BUILD", robots: { index: false, follow: false } };

export default async function DoctrinePage() {
  const status = await doctrineAccessStatus();
  if (status === 401) redirect("/login");
  if (status !== 200) return <main className="mx-auto max-w-3xl px-6 py-12 text-white">
    <Link href="/skills" className="underline">Retour aux skills</Link>
    <h1 className="mt-8 text-3xl font-semibold">Doctrine agentique</h1>
    <p className="mt-4">Cette bibliothèque est réservée au Coffre.</p>
  </main>;
  let files;
  try {
    files = await readPublishedDoctrine();
  } catch {
    return <main className="mx-auto max-w-3xl px-6 py-12 text-white">
      <Link href="/skills" className="underline">Retour aux skills</Link>
      <h1 className="mt-8 text-3xl font-semibold">Doctrine momentanément indisponible</h1>
      <p className="mt-4">Réessaie plus tard. Aucun contenu non vérifié ne sera affiché.</p>
    </main>;
  }
  return <main className="min-h-screen bg-[#0e0e0f] text-[#f0ede8]">
    <div className="mx-auto max-w-3xl px-6 py-12">
      <Link href="/skills" className="text-sm underline underline-offset-4 focus-visible:outline-2">Retour aux skills</Link>
      <h1 className="mt-8 text-3xl font-semibold">Doctrine agentique</h1>
      <p className="mt-3 text-white/70">Le parcours de référence du Coffre, à lire dans l’ordre ou selon ton besoin.</p>
      <DoctrineContent files={files} />
    </div>
  </main>;
}
