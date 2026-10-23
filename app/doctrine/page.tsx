import "server-only";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Ui4Shell, Ui4State, ui4Styles as styles } from "@/components/ui4/Ui4Shell";
import { doctrineAccessStatus } from "@/lib/doctrine/access.server";
import { readPublishedDoctrine } from "@/lib/doctrine/storage";
import { navIdentity } from "@/lib/auth/navIdentity.server";
import { DoctrineContent } from "./DoctrineContent";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const metadata = { title: "Doctrine agentique | BUILD", robots: { index: false, follow: false } };

export default async function DoctrinePage() {
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
  return <Ui4Shell identity={identity} activeLink="skills">
    <div className={styles.doctrineWrap}>
      <Link href="/skills" className={styles.backLink}><ArrowLeft aria-hidden="true" />Retour aux skills</Link>
      <header className={styles.doctrineHead}>
        <p className={styles.eyebrow}>Bibliothèque du Coffre</p>
        <h1 className="t-1">Doctrine <span className="mot">agentique.</span></h1>
        <p>Le parcours de référence du Coffre, à lire dans l’ordre ou selon ton besoin.</p>
      </header>
      <DoctrineContent files={files} />
    </div>
  </Ui4Shell>;
}
