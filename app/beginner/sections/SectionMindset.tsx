import { SectionReveal } from "@/components/ui/section-reveal";
import { FoundationChapter } from "../FoundationChapter";

const RULES = [
  {
    t: "Remplacer les croyances par des tests",
    d: "\"C'est trop compliqué\", \"ce n'est pas fait pour moi\", \"le marché est saturé\" : aucune de ces phrases ne remplace une observation. Formule une hypothèse, choisis un test limité, puis regarde ce que le terrain te répond. Un résultat incomplet mais vérifiable t'apprend plus qu'un plan parfait jamais confronté au réel.",
  },
  {
    t: "Chercher une valeur qui peut se répéter",
    d: "Une mission ponctuelle peut devenir un point de départ. Si un suivi, une maintenance, une veille ou une amélioration répond à un besoin régulier, formalise-le et fais-le payer clairement. Ne force pas l'abonnement : le récurrent doit correspondre à un travail réel et à une valeur observable.",
  },
  {
    t: "Valider avant d'élargir",
    d: "Avant plusieurs mois de construction, confronte l'offre à des conversations et à une demande observable. Le signal peut être une demande de devis, un accord sur un prototype ou un paiement quand le périmètre est clair. Un oui ne remplace jamais la livraison et la vérification de la valeur.",
  },
  {
    t: "Construire un capital portable",
    d: "Chaque méthode que tu comprends et que tu formalises peut rester utile au-delà d'un outil. Garde tes briefs, tes données, tes exports, tes procédures et ton code dans des formats lisibles. Tu réduis ainsi la dépendance à une plateforme et tu peux changer de stack quand le contexte l'exige.",
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
        Avant la technique, avant les outils, il y a la manière de décider. Ces principes aident à passer d'une intuition à une preuve, pour un site web, une boutique ou un service. Ils ne garantissent ni clients ni revenus : ils réduisent le temps passé à supposer et augmentent la qualité des tests que tu mènes.
      </p>

      {/* Exécution */}
      <FoundationChapter eyebrow="Chapitre 1" title="Exécuter pour apprendre">
        <p>
          Lire et réfléchir peuvent préparer une décision, mais ils ne remplacent pas la rencontre avec le terrain. Construis une première version limitée, montre-la à des personnes concernées, recueille leurs objections, puis ajuste. Le test doit être assez petit pour être lancé et assez concret pour produire un signal utile.
        </p>
        <p>
          Ce n'est pas une question d'intelligence. C'est une question de boucle d'apprentissage. <strong className="text-[#f0ede8]">Un résultat imparfait mais livré et observé t'apporte plus d'information qu'un projet parfait qui reste dans ta tête.</strong> La vitesse compte surtout quand elle accélère une décision réversible et documentée.
        </p>
      </FoundationChapter>

      {/* Volume & abondance */}
      <FoundationChapter eyebrow="Chapitre 2" title="Le volume comme instrument, pas comme garantie">
        <p>
          &quot;Il n'y a pas assez de clients&quot; est une hypothèse à tester, pas une conclusion. Selon le secteur, le besoin peut exister mais être mal ciblé, mal formulé, trop cher, trop complexe ou déjà couvert par une autre solution. Le travail consiste à choisir un segment, comprendre sa situation et vérifier si ton offre mérite une place.
        </p>
        <div className="border-y border-white/10 py-4">
          <p className="text-[#e8d5b0]/90">
            Quelques messages sans réponse ne prouvent pas que personne ne veut de ton offre. Ils indiquent seulement qu'il faut examiner la cible, le moment, le canal et la formulation. Commence par un petit lot cohérent, observe les réponses et élargis uniquement quand tu comprends ce que tu mesures.
          </p>
        </div>
      </FoundationChapter>

      {/* Quatre règles */}
      <SectionReveal className="mb-6">
        <h3 className="text-base font-semibold text-[#f0ede8] mb-2">Quatre règles, dans l'ordre où elles comptent</h3>
        <p className="text-sm text-white/45 leading-relaxed mb-5 max-w-2xl">
          Pas quatre idées interchangeables : un ordre de priorité, de la posture mentale jusqu'à la propriété de ce que tu construis.
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
          Retiens ça : choisis un problème, formule une hypothèse, lance un test limité, mesure une réaction, puis formalise ce qui fonctionne. Les outils viennent ensuite pour rendre cette boucle plus rapide, plus sûre et plus portable.
        </p>
      </SectionReveal>
    </div>
  );
}
