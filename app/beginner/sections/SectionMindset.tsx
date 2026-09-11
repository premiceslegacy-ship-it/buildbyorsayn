import { LiquidCard } from "@/components/ui/liquid-glass-card";
import { SectionReveal } from "@/components/ui/section-reveal";

const RULES = [
  {
    t: "Zéro croyance limitante",
    d: "\"C'est trop compliqué\", \"ce n'est pas fait pour moi\", \"le marché est saturé\" : ce sont des phrases de gens qui ont décidé de perdre avant de commencer. La vitesse est un avantage. Un produit livré à 80% bat un produit parfait qui n'existe pas.",
  },
  {
    t: "Le récurrent bat le one-shot",
    d: "Un client qui te paie une fois est un projet. Un client qui te paie chaque mois est un actif. Dès que tu peux, ajoute une part d'abonnement (maintenance, suivi, hébergement). Le récurrent te donne du temps, et le temps améliore ton produit.",
  },
  {
    t: "Vends avant de construire",
    d: "La plupart construisent, puis cherchent à vendre. C'est le chemin le plus long et le plus risqué. Un seul client qui dit oui et te paie avant que le produit existe vaut plus que six mois de travail dans ton coin.",
  },
  {
    t: "Tu n'es pas un locataire",
    d: "Chaque chose que tu apprends et que tu encodes en système reste à toi. C'est ton capital. Tu ne loues pas ta compétence à une plateforme, tu construis la tienne, qui grossit dans le temps.",
  },
];

export function SectionMindset() {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-3 mb-8">
        <span className="text-xs font-semibold text-[#e8d5b0]/60 uppercase tracking-widest">01</span>
        <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-[#f0ede8]">L&apos;état d&apos;esprit qui fait l&apos;argent</h2>
      </div>
      <p className="text-white/60 text-base leading-relaxed mb-10">
        Avant la technique, avant les outils, il y a la tête. Ces principes ne changent pas dans le temps. Ils marchent pour un site web, une boutique, un service, n&apos;importe quel business. Ce n&apos;est pas de la motivation. C&apos;est de la mécanique - et avec l&apos;IA, cette mécanique tourne plus vite : ce qui prenait des semaines à construire se livre maintenant en jours.
      </p>

      {/* Exécution */}
      <SectionReveal>
        <LiquidCard variant="elevated" className="p-6 md:p-8 mb-6">
          <h3 className="text-base font-semibold text-[#f0ede8] mb-4 tracking-tight leading-snug">Exécuter au lieu de réfléchir sans fin</h3>
          <p className="text-sm text-white/65 leading-relaxed mb-4">
            Les gens qui passent des semaines à &quot;valider leur idée&quot;, qui lisent vingt livres avant d&apos;envoyer un seul message, ne gagnent presque jamais d&apos;argent. Ceux qui lancent un truc simple, qui contactent cent personnes, qui prennent des non et ajustent, eux ils en gagnent.
          </p>
          <p className="text-sm text-white/65 leading-relaxed">
            Ce n&apos;est pas une question d&apos;intelligence. C&apos;est une question d&apos;action. <strong className="text-[#f0ede8]">Le plan parfait qui reste dans ta tête vaut zéro. Le truc imparfait que tu as livré et qu&apos;on t&apos;a payé vaut quelque chose.</strong> La vraie intelligence dans le business, c&apos;est de bouger vite et d&apos;apprendre sur le terrain.
          </p>
        </LiquidCard>
      </SectionReveal>

      {/* Volume & abondance */}
      <SectionReveal>
        <LiquidCard variant="elevated" className="p-6 md:p-8 mb-6">
          <h3 className="text-base font-semibold text-[#f0ede8] mb-4 tracking-tight leading-snug">Le volume et l&apos;abondance</h3>
          <p className="text-sm text-white/65 leading-relaxed mb-4">
            &quot;Il n&apos;y a pas assez de clients&quot; est une croyance, pas une réalité. Il y a des millions d&apos;artisans, de commerçants, de petites entreprises qui ont besoin d&apos;un site, d&apos;un outil, d&apos;un système. Le problème n&apos;est jamais le manque de clients. C&apos;est toujours le manque de volume ou le mauvais message.
          </p>
          <div className="bg-black/25 border border-white/5 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
            <p className="text-sm text-[#e8d5b0]/90 leading-relaxed">
              Quand tu envoies dix messages sans réponse, tu n&apos;as pas prouvé que personne ne veut de toi. Tu as juste envoyé dix messages. Cent messages te donnent de la donnée. Mille te donnent une mécanique.
            </p>
          </div>
        </LiquidCard>
      </SectionReveal>

      {/* Quatre règles */}
      <SectionReveal className="mb-6">
        <h3 className="text-base font-semibold text-[#f0ede8] mb-2">Quatre règles, dans l&apos;ordre où elles comptent</h3>
        <p className="text-sm text-white/45 leading-relaxed mb-5 max-w-2xl">
          Pas quatre idées interchangeables : un ordre de priorité, de la posture mentale jusqu&apos;à la propriété de ce que tu construis.
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
          Retiens ça : exécute d&apos;abord, affine ensuite. Envoie cent messages avant de juger. Construis du récurrent. Vends avant de construire. Le reste, c&apos;est de la technique.
        </p>
      </SectionReveal>
    </div>
  );
}
