import { SectionReveal } from "@/components/ui/section-reveal";
import { FoundationChapter } from "../FoundationChapter";

const LEVERS = [
  {
    t: "Le progrès espéré",
    d: "Les personnes cherchent souvent une situation meilleure : moins de retard, plus de clarté, moins d'erreurs ou une décision plus simple. Décris ce progrès avec précision, sans promettre un raccourci magique ni un résultat que tu ne peux pas contrôler.",
  },
  {
    t: "L'identité que l'on veut confirmer",
    d: "Une offre peut aider quelqu'un à se sentir plus professionnel, plus autonome ou plus organisé. Parle de cette identité sans fabriquer de honte et sans présenter un outil comme le ticket d'entrée obligatoire dans une catégorie.",
  },
  {
    t: "La preuve par l'observation",
    d: "Voir une méthode utilisée par d'autres peut rassurer, mais une preuve sociale ne remplace pas l'adéquation au contexte. Distingue toujours ce qui est observé, ce qui est mesuré et ce qui reste à vérifier pour la personne en face.",
  },
  {
    t: "La crédibilité visible",
    d: "Une présentation claire, une réponse rapide et un processus lisible peuvent renforcer la confiance. Ne confonds pas apparence premium et preuve de qualité : montre aussi les limites, les conditions et ce qui sera réellement livré.",
  },
  {
    t: "Le coût de l'inaction",
    d: "Une décision peut être motivée par un coût déjà visible : relances oubliées, informations dispersées, erreurs répétées ou temps perdu. N'utilise ce ressort que si le coût est réel, documentable et présenté sans exagération ni menace.",
  },
  {
    t: "Le besoin de sécurité",
    d: "Beaucoup d'achats servent à réduire l'incertitude : ne plus rater une facture, perdre une information ou bloquer sur une étape. Explique le périmètre, les accès, les sauvegardes, les contrôles et la marche arrière au lieu de vendre une tranquillité abstraite.",
  },
];

export function SectionPsychologie() {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-3 mb-8">
        <span className="text-xs font-semibold text-[#e8d5b0]/60 uppercase tracking-widest">02</span>
        <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-[#f0ede8]">Comprendre ce qui fait agir les gens</h2>
      </div>
      <p className="text-white/60 text-base leading-relaxed mb-10">
        On répète qu'il faut &quot;résoudre un problème&quot;. C'est vrai, mais c'est incomplet. Une décision mêle faits, émotions, habitudes, identité et perception du risque. Comprendre ces ressorts sert d'abord à mieux qualifier une situation et à écrire un message honnête, pas à exploiter une vulnérabilité ni à promettre un résultat automatique.
      </p>

      <FoundationChapter eyebrow="Chapitre 1" title="Le problème est aussi une situation humaine">
        <p>
          Un site web premium ne se vend pas seulement parce qu'il règle un souci technique. Il peut aider son propriétaire à paraître plus clair, plus fiable ou plus simple à contacter. Observe donc la situation complète : ce que la personne ressent, ce qu'elle doit prouver, ce qu'elle craint et ce qu'elle peut réellement décider.
        </p>
        <p>
          Commence par nommer la situation humaine, puis apporte les faits qui permettent de décider : périmètre, preuve, coût, délai, risques et prochaine étape. L'intuition ouvre l'attention ; la clarté permet un consentement informé.
        </p>
      </FoundationChapter>

      {/* Les ressorts */}
      <SectionReveal className="mb-6">
        <h3 className="text-base font-semibold text-[#f0ede8] mb-2">Six ressorts psychologiques</h3>
        <p className="text-sm text-white/45 leading-relaxed mb-5 max-w-2xl">
          Chacun répond à un besoin différent. Un bon message reste précis, vérifiable et proportionné au contexte au lieu d'activer artificiellement la peur ou l'urgence.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {LEVERS.map(({ t, d }) => (
            <div key={t} className="relative border border-[#c9b48a]/25 bg-gradient-to-b from-white/[0.045] to-white/[0.012] p-5">
              <div aria-hidden="true" className="pointer-events-none absolute inset-[5px] border border-[#c9b48a]/10" />
              <div className="relative z-10">
                <p className="text-sm font-semibold text-[#e8d5b0] mb-2 tracking-tight leading-snug">{t}</p>
                <p className="text-[13px] text-white/65 leading-[1.65]">{d}</p>
              </div>
            </div>
          ))}
        </div>
      </SectionReveal>

      <SectionReveal className="bg-[#e8d5b0]/5 border border-[#e8d5b0]/15 px-6 py-5">
        <p className="text-sm text-[#e8d5b0]/85 leading-relaxed">
          Comprendre ces ressorts, ce n'est pas manipuler. C'est relier une situation réelle, une preuve utile et une décision libre. La qualité commerciale vient de cette compréhension, de la confiance construite et de la valeur livrée, pas d'une pression mieux cachée.
        </p>
      </SectionReveal>
    </div>
  );
}
