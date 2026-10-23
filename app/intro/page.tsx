import Image from "next/image";
import Link from "next/link";
import { Ui4Shell } from "@/components/ui4/Ui4Shell";
import { requirePageAccess } from "@/lib/auth/paidPageAccess.server";
import styles from "./intro.module.css";

const PHASES = [
  {
    number: "01",
    title: "Les fondations",
    label: "Comprendre et vendre",
    blocs: "Blocs 1 et 2",
    description: "Comprends le système. Clarifie l’offre. Trouve le besoin.",
  },
  {
    number: "02",
    title: "La construction",
    label: "Passer à l’action",
    blocs: "Blocs 3 et 4",
    description: "Prépare. Construis. Mets en ligne.",
  },
  {
    number: "03",
    title: "L’amélioration",
    label: "Garder ce qui marche",
    blocs: "Blocs 5, 6 et 7",
    description: "Choisis mieux. Réutilise. Itère.",
  },
];

const MANIFESTO_POINTS = [
  { title: "La base", description: "Ce système est une base. Pas une fin en soi." },
  { title: "Le focus", description: "La règle numéro un : le focus paie. La dispersion tue." },
  { title: "L’avantage compétitif", description: "Le vrai avantage dans le business IA, c’est la curiosité et la profondeur." },
];

const CORE_SKILLS = [
  { image: "/da/objets/livraison.png", title: "L’exécution", description: "L’idée ne vaut rien. Seule l’exécution compte. Déploie vite et itère." },
  { image: "/da/objets/bloc.png", title: "La curiosité", description: "Comprends les modèles, teste les limites et cherche l’optimisation en continu." },
  { image: "/da/objets/offre.png", title: "La résilience", description: "Accepte l’échec comme une donnée. Corrige le tir et recommence sans relâche." },
  { image: "/da/objets/vente.png", title: "La vélocité", description: "Livre vite, mesure et corrige. La vitesse est ton meilleur levier." },
];

export const dynamic = "force-dynamic";
export const metadata = { title: "Avant de commencer | BUILD", robots: { index: false, follow: false } };

export default async function IntroPage() {
  const identity = await requirePageAccess("full", "/intro");

  return (
    <Ui4Shell identity={identity}>
      <header className={styles.header}>
        <h1>Avant de commencer</h1>
        <p>Ce système vient de projets livrés et d’erreurs corrigées. Tout ce que tu trouves ici doit finir dans le réel.</p>
      </header>

      <div className={styles.content}>
        <section className={styles.section} aria-labelledby="intro-phases">
          <div className={styles.sectionHead}><h2 id="intro-phases">Tu es sur quelle phase ?</h2><p>Les blocs BUILD correspondent à chaque étape du chemin.</p></div>
          <div className={styles.rows}>
            {PHASES.map((phase) => (
              <article className={styles.row} key={phase.number}>
                <span className={styles.number}>{phase.number}</span>
                <div className={styles.rowBody}>
                  <h3>{phase.title}</h3>
                  <p>{phase.label}. {phase.description} {phase.blocs}.</p>
                </div>
              </article>
            ))}
          </div>
        </section>
        <section className={styles.section} aria-labelledby="intro-rules">
          <div className={styles.sectionHead}><h2 id="intro-rules">Construire pour durer, déployer pour itérer</h2></div>
          <div className={styles.rows}>
            {MANIFESTO_POINTS.map((point, index) => (
              <article className={styles.row} key={point.title}>
                <span className={styles.number}>{String(index + 1).padStart(2, "0")}</span>
                <div className={styles.rowBody}><h3>{point.title}</h3><p>{point.description}</p></div>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.section} aria-labelledby="intro-mindset">
          <div className={styles.sectionHead}><h2 id="intro-mindset">L’état d’esprit pour réussir</h2><p>Quatre repères à garder pendant tout le parcours.</p></div>
          <div className={styles.skills}>
            {CORE_SKILLS.map(({ image, title, description }) => (
              <article className={styles.skill} key={title}>
                <Image src={image} alt="" width={224} height={224} />
                <div className={styles.skillCopy}><h3>{title}</h3><p>{description}</p></div>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.action} aria-labelledby="intro-action">
          <div className={styles.actionCopy}><h2 id="intro-action">Passe au premier bloc</h2><p>Avance dans l’ordre, applique, puis reviens corriger ce qui doit l’être.</p></div>
          <Link className="btn btn--p" href="/programme">Voir le programme</Link>
        </section>
      </div>
    </Ui4Shell>
  );
}
