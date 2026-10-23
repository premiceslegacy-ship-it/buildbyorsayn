import Link from "next/link";
import { Brain, Shield, Target, Zap } from "lucide-react";
import { Ui4Header, Ui4SectionHeading, Ui4Shell, ui4Styles as styles } from "@/components/ui4/Ui4Shell";
import { requirePageAccess } from "@/lib/auth/paidPageAccess.server";

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
  { icon: Target, title: "L’exécution", description: "L’idée ne vaut rien. Seule l’exécution compte. Déploie vite et itère." },
  { icon: Brain, title: "La curiosité", description: "Comprends les modèles, teste les limites et cherche l’optimisation en continu." },
  { icon: Shield, title: "La résilience", description: "Accepte l’échec comme une donnée. Corrige le tir et recommence sans relâche." },
  { icon: Zap, title: "La vélocité", description: "Livre vite, mesure et corrige. La vitesse est ton meilleur levier." },
];

export const dynamic = "force-dynamic";
export const metadata = { title: "Avant de commencer | BUILD", robots: { index: false, follow: false } };

export default async function IntroPage() {
  const identity = await requirePageAccess("full", "/intro");

  return (
    <Ui4Shell identity={identity}>
      <div className={`${styles.content} ${styles.introOpening}`}>
        <section className={styles.section} aria-labelledby="intro-phases">
          <Ui4SectionHeading
            eyebrow="Le Protocole Zéro"
            id="intro-phases"
            title="Tu es sur quelle phase ?"
            lead="Les blocs BUILD correspondent à chaque étape du chemin."
          />
          <div className={styles.rowList}>
            {PHASES.map((phase) => (
              <article className={styles.row} key={phase.number}>
                <span className={styles.rowNumber}>{phase.number}</span>
                <div className={styles.rowBody}>
                  <h3>{phase.title}</h3>
                  <p>{phase.label}. {phase.description} {phase.blocs}.</p>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>

      <Ui4Header
        eyebrow="Le Protocole Zéro"
        title={<>Avant de <span className="mot">commencer.</span></>}
        lead="Ce système a été construit à partir d’une pratique réelle, des projets livrés, des erreurs corrigées. Tout ce qui est ici est actionnable."
      />

      <div className={styles.content}>
        <section className={styles.section} aria-labelledby="intro-rules">
          <Ui4SectionHeading eyebrow="Les règles du jeu" id="intro-rules" title="Construire pour durer, déployer pour itérer." />
          <div className={styles.rowList}>
            {MANIFESTO_POINTS.map((point, index) => (
              <article className={styles.row} key={point.title}>
                <span className={styles.rowNumber}>{String(index + 1).padStart(2, "0")}</span>
                <div className={styles.rowBody}><h3>{point.title}</h3><p>{point.description}</p></div>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.section} aria-labelledby="intro-mindset">
          <Ui4SectionHeading eyebrow="Mindset" id="intro-mindset" title="L’état d’esprit pour réussir." />
          <div className={styles.cardGrid}>
            {CORE_SKILLS.map(({ icon: Icon, title, description }) => (
              <article className={styles.card} key={title}>
                <span className={styles.cardIcon}><Icon aria-hidden="true" /></span>
                <h3>{title}</h3>
                <p>{description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.cta} aria-labelledby="intro-progress">
          <h2 className="t-2" id="intro-progress">Ta progression globale.</h2>
          <p>Coche chaque bloc au fur et à mesure que tu avances. Sois honnête avec toi-même : cocher sans avoir appliqué ne sert à rien.</p>
          <Link className="btn btn--p" href="/dashboard">Accéder au dashboard</Link>
        </section>
      </div>
    </Ui4Shell>
  );
}
