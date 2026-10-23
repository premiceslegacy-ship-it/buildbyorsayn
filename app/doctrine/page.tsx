import "server-only";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Ui4Shell, Ui4State } from "@/components/ui4/Ui4Shell";
import { doctrineAccessStatus } from "@/lib/doctrine/access.server";
import { readPublishedDoctrine } from "@/lib/doctrine/storage";
import { navIdentity } from "@/lib/auth/navIdentity.server";
import { DoctrineContent } from "./DoctrineContent";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const metadata = { title: "Doctrine agentique | BUILD", robots: { index: false, follow: false } };

export default async function DoctrinePage({ searchParams }: { searchParams: Promise<{ chapitre?: string | string[] }> }) {
  const status = await doctrineAccessStatus();
  if (status === 401) redirect("/login");
  const identity = await navIdentity();
  if (status !== 200) return <Ui4Shell identity={identity} activeLink="skills"><Ui4State title="Doctrine agentique" detail="Cette bibliothèque est réservée au Coffre." action={{ href: "/checkout", label: "Voir l’accès" }} /></Ui4Shell>;
  let files;
  try {
    files = await readPublishedDoctrine();
  } catch {
    return <Ui4Shell identity={identity} activeLink="skills"><Ui4State title="Doctrine momentanément indisponible" detail="Réessaie plus tard. Aucun contenu non vérifié n’est affiché." action={{ href: "/skills", label: "Retour aux skills" }} /></Ui4Shell>;
  }
  const rawChapter = (await searchParams).chapitre;
  const requestedIndex = Number(Array.isArray(rawChapter) ? rawChapter[0] : rawChapter ?? "1") - 1;
  const selectedIndex = Number.isInteger(requestedIndex) && requestedIndex >= 0 && requestedIndex < files.length ? requestedIndex : 0;
  return <Ui4Shell identity={identity} activeLink="skills">
    <div className="doctrine-wrap">
      <Link href="/skills" className="doctrine-return"><ArrowLeft aria-hidden="true" />Retour aux skills</Link>
      <header className="doctrine-head">
        <h1 className="t-1">Doctrine agentique</h1>
        <p>Le parcours de référence du Coffre, à lire dans l’ordre ou selon ton besoin.</p>
      </header>
      <DoctrineContent files={files} selectedIndex={selectedIndex} />
    </div>
  </Ui4Shell>;
}
