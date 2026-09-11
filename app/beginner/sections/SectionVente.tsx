import { LiquidCard } from "@/components/ui/liquid-glass-card";
import { SectionReveal } from "@/components/ui/section-reveal";

const STEPS = [
  {
    t: "Comprendre en profondeur",
    d: "Avant de parler de ton offre, creuse. Depuis quand le problème existe ? Combien il lui coûte en temps, en argent, en stress ? Qu'a-t-il déjà essayé ? Tu ne peux pas vendre une solution à un problème que tu n'as pas compris à fond.",
  },
  {
    t: "Mettre face aux contradictions",
    d: "Avec tact, fais ressortir l'écart entre ce que le client dit vouloir et ce qu'il fait. \"Vous dites que c'est urgent, mais vous repoussez depuis six mois.\" Sans agresser. Juste pour qu'il prenne conscience lui-même qu'il est temps d'agir.",
  },
  {
    t: "Défendre le prix par la valeur",
    d: "On ne baisse pas le prix dès qu'on hésite. On rappelle ce que le problème lui coûte aujourd'hui, et ce que la solution lui rapporte. Si la valeur est claire, le prix paraît petit. La remise est un aveu que tu n'as pas montré la valeur.",
  },
  {
    t: "Les mêmes leviers de persuasion",
    d: "La preuve sociale, la rareté, l'autorité fonctionnent aussi à l'oral. Un client rassuré par tes résultats et conscient qu'il ne peut pas attendre éternellement décide plus vite et plus sereinement.",
  },
];

export function SectionVente() {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-3 mb-8">
        <span className="text-xs font-semibold text-[#e8d5b0]/60 uppercase tracking-widest">04</span>
        <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-[#f0ede8]">Vendre, c&apos;est de la psychologie appliquée</h2>
      </div>
      <p className="text-white/60 text-base leading-relaxed mb-10">
        La vente fait peur parce qu&apos;on l&apos;imagine comme du baratin de marchand de tapis. C&apos;est l&apos;inverse. Bien vendre, c&apos;est comprendre quelqu&apos;un mieux qu&apos;il ne se comprend, puis lui montrer le bon chemin. C&apos;est la compétence qui te fait gagner ta vie, peu importe le produit.
      </p>

      {/* Position médecin */}
      <SectionReveal>
        <LiquidCard variant="elevated" className="p-6 md:p-8 mb-6">
          <h3 className="text-base font-semibold text-[#f0ede8] mb-4 tracking-tight leading-snug">Prends la position du médecin</h3>
          <p className="text-sm text-white/65 leading-relaxed mb-4">
            Un bon médecin ne te vend pas un médicament dès que tu entres. Il pose des questions, il écoute, il diagnostique. Ensuite il prescrit, et tu lui fais confiance. Fais pareil. Tu n&apos;es pas un vendeur qui supplie. Tu es un expert qui diagnostique un problème.
          </p>
          <p className="text-sm text-white/65 leading-relaxed">
            <strong className="text-[#f0ede8]">Pose des questions ouvertes, écoute deux fois plus que tu ne parles.</strong> Plus le client se livre, plus tu comprends sa vraie douleur, et plus ta proposition tombe juste. Ta posture et ta voix doivent rester calmes et posées. La personne la plus sereine dans la conversation est celle qui mène.
          </p>
        </LiquidCard>
      </SectionReveal>

      {/* Le déroulé, en séquence */}
      <SectionReveal className="mb-6">
        <h3 className="text-base font-semibold text-[#f0ede8] mb-2">Le déroulé d&apos;une vente, dans l&apos;ordre</h3>
        <p className="text-sm text-white/45 leading-relaxed mb-5 max-w-2xl">
          Ce n&apos;est pas une liste au choix - chaque étape prépare la suivante.
        </p>
        <div className="flex flex-col gap-3">
          {STEPS.map(({ t, d }, i) => (
            <div key={t} className="relative flex gap-4 border border-[#c9b48a]/25 bg-gradient-to-b from-white/[0.045] to-white/[0.012] p-5">
              <div aria-hidden="true" className="pointer-events-none absolute inset-[5px] border border-[#c9b48a]/10" />
              <span className="relative z-10 shrink-0 flex items-center justify-center w-7 h-7 border border-[#e8d5b0]/30 text-xs font-bold text-[#e8d5b0]">
                {i + 1}
              </span>
              <div className="relative z-10">
                <p className="text-sm font-semibold text-[#e8d5b0] mb-1.5 tracking-tight leading-snug">{t}</p>
                <p className="text-[13px] text-white/65 leading-[1.65]">{d}</p>
              </div>
            </div>
          ))}
        </div>
      </SectionReveal>

      {/* Objection IA */}
      <SectionReveal>
        <LiquidCard variant="elevated" className="p-6 md:p-8 mb-6">
          <h3 className="text-base font-semibold text-[#f0ede8] mb-4 tracking-tight leading-snug">&quot;Pourquoi je te paierais, je peux demander à ChatGPT&quot;</h3>
          <p className="text-sm text-white/65 leading-relaxed mb-4">
            Cette objection va revenir, et de plus en plus souvent. Ne la fuis pas, retourne-la : oui, il peut demander à une IA. Ce qu&apos;il ne peut pas s&apos;acheter en trois secondes, c&apos;est le contexte, la méthode et le temps que ça lui économise.
          </p>
          <p className="text-sm text-white/65 leading-relaxed">
            <strong className="text-[#f0ede8]">Tu ne vends pas l&apos;accès à un outil, tu vends le résultat déjà cadré, testé et livré.</strong> Un client qui pourrait techniquement le faire lui-même paie quand même pour ne pas avoir à apprendre, arbitrer et corriger ses propres erreurs.
          </p>
        </LiquidCard>
      </SectionReveal>

      <SectionReveal className="bg-[#e8d5b0]/5 border border-[#e8d5b0]/15 px-6 py-5">
        <p className="text-sm text-[#e8d5b0]/85 leading-relaxed">
          Vendre, c&apos;est écouter, diagnostiquer, puis prescrire. Pose plus de questions que tu ne fais de promesses. Le calme et la compréhension vendent mieux que la pression.
        </p>
      </SectionReveal>
    </div>
  );
}
