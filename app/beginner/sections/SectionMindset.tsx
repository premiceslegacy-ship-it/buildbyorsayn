import { SectionReveal } from "@/components/ui/section-reveal";
import { FoundationChapter } from "../FoundationChapter";

const RULES = [
  {
    t: "Remplacer les croyances par des tests",
    d: "Une phrase comme \"le marché est saturé\" décrit une croyance, pas une observation. Transforme-la en hypothèse : \"les cabinets de cette ville répondent déjà à ce besoin\". Choisis ensuite un test limité et un signal observable. Le terrain te donnera une information que la réflexion seule ne peut pas produire.",
  },
  {
    t: "Chercher une valeur qui peut se répéter",
    d: "Après une mission, repère ce qui revient vraiment : maintenance, veille, suivi, amélioration ou support. Formalise ce travail et son résultat. Propose une continuité seulement quand elle correspond à un besoin régulier et à une charge réelle. Un abonnement sans travail utile finit par dégrader la confiance.",
  },
  {
    t: "Valider avant d'élargir",
    d: "Une conversation polie ne valide rien. Cherche un engagement proportionné : un problème raconté avec précision, l'accès à un document, une demande de devis, un essai encadré ou un paiement quand le périmètre est clair. Livre ensuite et vérifie la valeur avant d'ajouter des fonctions ou une nouvelle cible.",
  },
  {
    t: "Construire un capital portable",
    d: "Garde les briefs, données, décisions, procédures, exports et code dans des formats lisibles. Note aussi le contexte dans lequel une méthode a fonctionné. Ce capital reste exploitable quand un outil change et t'évite de recommencer chaque projet depuis une page blanche.",
  },
];

export function SectionMindset() {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-3 mb-8">
        <span className="text-xs font-semibold text-[#e8d5b0]/60 uppercase tracking-widest">01</span>
        <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-[#f0ede8]">L'état d'esprit pour transformer l'idée en test</h2>
      </div>
      <p className="text-white/60 text-base leading-relaxed mb-10">
        Ton premier avantage vient de ta manière de décider. Une intuition devient utile quand tu la transformes en hypothèse, en test limité et en observation écrite. Cette méthode ne promet ni client ni revenu. Elle réduit seulement le temps passé à construire sur des suppositions.
      </p>

      {/* Exécution */}
      <FoundationChapter eyebrow="Chapitre 1" title="Exécuter pour apprendre">
        <p>
          Lire prépare une décision. Le terrain la corrige. Écris ce que tu crois vrai, choisis la plus petite action capable de contredire cette croyance, puis définis le signal que tu observeras. Une boucle d'apprentissage contient cinq éléments : hypothèse, test, signal, décision et trace écrite.
        </p>
        <div className="grid gap-2 border-y border-white/10 py-4 sm:grid-cols-5">
          {["Hypothèse", "Test limité", "Signal", "Décision", "Trace"].map((step, index) => (
            <div key={step} className="flex items-center gap-2 text-sm text-white/60">
              <span className="font-mono text-xs text-[#e8d5b0]/60">{index + 1})</span>
              <span>{step}</span>
            </div>
          ))}
        </div>
        <p>
          Exemple : tu penses que les restaurateurs ont besoin d'un nouveau site. Avant de produire une maquette complète, parle avec quelques responsables et demande comment arrivent les réservations aujourd'hui. S'ils citent surtout les appels manqués, ton premier service devra peut-être traiter ce flux plutôt que refaire la vitrine.
        </p>
        <p>
          <strong className="text-[#f0ede8]">Une version limitée, livrée puis observée, t'apprend davantage qu'un grand projet gardé en préparation.</strong> La vitesse est utile quand la décision reste réversible, le coût du test est borné et les observations sont conservées.
        </p>
        <div className="border-y border-white/10 py-5">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#e8d5b0]/70">Version pour l'IA</p>
          <p className="text-sm leading-relaxed text-white/60">
            Donne à ton IA l'hypothèse, la cible, les faits déjà observés, la contrainte de temps et les actions autorisées. Demande-lui plusieurs tests réversibles, le signal attendu et ce que chaque résultat permettrait de décider. Tu gardes le choix du test et tu notes le résultat réel.
          </p>
        </div>
      </FoundationChapter>

      {/* Volume & abondance */}
      <FoundationChapter eyebrow="Chapitre 2" title="Le volume comme instrument, pas comme garantie">
        <p>
          « Il n'y a pas assez de clients » reste une hypothèse tant que tu n'as pas séparé la cible, le problème, le moment, le canal et l'offre. Le besoin peut exister avec une mauvaise formulation. Il peut aussi être faible, déjà couvert ou trop coûteux à servir. Le test doit pouvoir révéler chacune de ces réponses.
        </p>
        <p>
          Commence par un groupe cohérent qui partage une situation observable. Utilise le même message assez longtemps pour comprendre les réactions, puis change une seule variable. Si tu modifies en même temps la cible, l'offre et le canal, tu obtiens du mouvement sans savoir ce qui a produit le résultat.
        </p>
        <p>
          Exemple fictif : tu envoies le même message à 30 salons de coiffure de ta ville sur deux semaines. Tu obtiens 3 réponses et 1 appel. Pour le test suivant, tu changes une seule chose, par exemple la première phrase, et tu gardes la cible et le canal.
        </p>
        <div className="border-y border-white/10 py-4">
          <p className="text-[#e8d5b0]/90">
            Quelques silences ne prouvent pas l'absence de marché. Ils demandent un diagnostic : la bonne personne a-t-elle reçu le message, au bon moment, avec une situation et une prochaine étape compréhensibles ? Note les réponses, les objections et les absences de réponse avant d'élargir.
          </p>
        </div>
      </FoundationChapter>

      {/* Quatre règles */}
      <SectionReveal className="mb-6">
        <h3 className="text-base font-semibold text-[#f0ede8] mb-2">Quatre règles, dans l'ordre où elles comptent</h3>
        <p className="text-sm text-white/45 leading-relaxed mb-5 max-w-2xl">
          L'ordre protège ton temps : vérifier une croyance, identifier une valeur répétable, valider la livraison, puis conserver ce que tu as appris.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {RULES.map(({ t, d }, i) => (
            <div key={t} className="relative border border-[#c9b48a]/25 bg-gradient-to-b from-white/[0.045] to-white/[0.012] p-5">
              <div aria-hidden="true" className="pointer-events-none absolute inset-[5px] border border-[#c9b48a]/10" />
              <div className="relative z-10">
                <span className="inline-flex items-center justify-center w-6 h-6 border border-[#e8d5b0]/30 text-[11px] font-bold text-[#e8d5b0] mb-3">
                  {i + 1}
                </span>
                <p className="text-sm font-semibold text-[#e8d5b0] mb-2 tracking-tight leading-snug">{t}</p>
                <p className="text-[13px] text-white/65 leading-[1.65]">{d}</p>
              </div>
            </div>
          ))}
        </div>
      </SectionReveal>

      {/* Synthèse */}
      <SectionReveal className="bg-[#e8d5b0]/5 border border-[#e8d5b0]/15 px-6 py-5">
        <p className="text-sm text-[#e8d5b0]/85 leading-relaxed">
          À faire maintenant : écris une croyance qui bloque ton projet. Reformule-la en une phrase vérifiable. Choisis un test que tu peux arrêter facilement, un signal observable et une date de décision. Après le test, conserve la conclusion, les faits et la prochaine action dans ton dossier de projet. Compte 20 minutes ce soir. Tu repars avec une hypothèse, un test et une date.
        </p>
      </SectionReveal>
    </div>
  );
}
