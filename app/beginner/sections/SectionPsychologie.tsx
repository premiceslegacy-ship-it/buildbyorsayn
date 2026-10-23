import { SectionReveal } from "@/components/ui/section-reveal";
import { FoundationChapter } from "../FoundationChapter";

const LEVERS = [
  {
    t: "Le progrès espéré",
    d: "Une personne cherche une situation meilleure : moins de retard, une décision plus simple ou moins d'erreurs à reprendre. Décris ce progrès par un changement visible dans son travail. Garde les conditions et les limites près de la proposition, car tu ne contrôles jamais seul le résultat final.",
  },
  {
    t: "L'identité que l'on veut confirmer",
    d: "Un achat peut soutenir l'image que la personne veut avoir d'elle-même : professionnelle, autonome, fiable ou organisée. Montre comment l'offre l'aide à agir ainsi. Évite la honte, le statut inventé et l'idée qu'un outil serait obligatoire pour appartenir au bon groupe.",
  },
  {
    t: "La preuve par l'observation",
    d: "Voir une méthode, un livrable ou un cas comparable réduit une partie de l'incertitude. Précise ce qui a été observé, dans quel contexte et ce qui reste à vérifier. Par exemple, un artisan montre le devis anonymisé d'un chantier comparable, avec ses postes et ses délais. Le comportement d'autres personnes ne suffit jamais à prouver que l'offre convient au cas présent.",
  },
  {
    t: "La crédibilité visible",
    d: "Une réponse précise, un devis lisible et un processus expliqué donnent des indices sur la manière de travailler. Ces indices ne prouvent pas tout. Ajoute le périmètre, les responsabilités, les limites et un exemple du livrable pour que la confiance repose sur des éléments inspectables.",
  },
  {
    t: "Le coût de l'inaction",
    d: "L'inaction a parfois un coût déjà visible : relances oubliées, temps de ressaisie, erreurs répétées ou demande laissée sans réponse. Exemple fictif : un plombier compte 6 demandes rappelées trop tard sur un mois, dont 4 parties chez un concurrent. Fais-le décrire par la personne et distingue le fait du calcul estimé. Une peur amplifiée ou un scénario catastrophe ne produit pas une décision saine.",
  },
  {
    t: "Le besoin de sécurité",
    d: "Acheter peut servir à réduire une incertitude : savoir qui répond, retrouver une information ou pouvoir revenir en arrière. Explique les accès, validations, sauvegardes, dépendances et conditions de sortie. Une procédure visible rassure davantage qu'une promesse générale de tranquillité.",
  },
];

export function SectionPsychologie() {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 motion-reduce:animate-none">
      <div className="flex items-center gap-3 mb-8">
        <span className="text-xs font-semibold text-[var(--em)]">02</span>
        <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-[var(--encre)]">Comprendre ce qui fait agir les gens</h2>
      </div>
      <p className="text-[var(--t2)] text-base leading-relaxed mb-10">
        Une décision mélange faits, émotions, habitudes, identité et perception du risque. La psychologie appliquée consiste à comprendre ces ressorts pour mieux qualifier une situation. Elle ne donne aucune permission d'exploiter une vulnérabilité, de cacher une condition ou de promettre un résultat automatique.
      </p>

      <FoundationChapter eyebrow="Chapitre 1" title="Le problème est aussi une situation humaine">
        <p>
          Une personne ne demande pas toujours un site pour une raison technique. Elle peut vouloir rassurer un prospect après une recommandation, présenter ses réalisations sans fouiller dans son téléphone ou recevoir des demandes plus faciles à traiter. Le livrable prend son sens dans cette situation humaine.
        </p>
        <p>
          Observe quatre couches. La scène décrit ce qui vient de se passer. L'émotion indique ce qui compte pour la personne. Le risque nomme ce qu'elle veut éviter. Les faits permettent ensuite de juger l'offre : périmètre, preuve, coût, délai, responsabilités et prochaine étape.
        </p>
        <p>
          Exemple : une dirigeante dit qu'elle veut « un site premium ». Demande ce qui a déclenché la demande. Elle explique qu'après chaque recommandation, elle renvoie manuellement les mêmes photos et références. Tu peux maintenant discuter d'un parcours précis au lieu d'interpréter le mot « premium » à sa place.
        </p>
        <div className="border-y border-[var(--trait)] py-5">
          <p className="mb-2 text-xs font-semibold text-[var(--t3)]">Version pour l'IA</p>
          <p className="text-sm leading-relaxed text-[var(--t2)]">
            Fournis une retranscription anonymisée et demande à l'IA de séparer les faits, émotions exprimées, risques nommés, alternatives actuelles et informations manquantes. Exige une citation interne pour chaque observation. Relis ensuite la source : le modèle propose un classement, il ne lit pas l'intention de la personne.
          </p>
        </div>
      </FoundationChapter>

      {/* Les ressorts */}
      <SectionReveal className="mb-6">
        <h3 className="text-base font-semibold text-[var(--encre)] mb-2">Six ressorts psychologiques</h3>
        <p className="text-sm text-[var(--t3)] leading-relaxed mb-5 max-w-2xl">
          Chaque ressort répond à une incertitude différente. Utilise seulement ceux que la situation rend visibles et laisse toujours le refus accessible.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {LEVERS.map(({ t, d }) => (
            <div key={t} className="rounded-[var(--r-m)] bg-[var(--carte)] p-5">
              <div>
                <p className="text-sm font-semibold text-[var(--menthe)] mb-2 tracking-tight leading-snug">{t}</p>
                <p className="text-sm text-[var(--t2)] leading-[1.65]">{d}</p>
              </div>
            </div>
          ))}
        </div>
      </SectionReveal>

      <SectionReveal className="rounded-[var(--r-m)] bg-[var(--carte)] px-6 py-5">
        <p className="text-sm text-[var(--menthe)] leading-relaxed">
          À faire maintenant : reprends une demande réelle et écris la scène, le progrès recherché, le risque perçu et la preuve disponible. Marque chaque interprétation comme une hypothèse. Prépare ensuite une question ouverte pour vérifier ce qui manque, sans suggérer la réponse. Compte 25 minutes. Tu repars avec une fiche de quatre lignes et une question prête à poser.
        </p>
      </SectionReveal>
    </div>
  );
}
