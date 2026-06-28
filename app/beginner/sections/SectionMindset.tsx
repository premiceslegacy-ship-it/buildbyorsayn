import { LiquidCard } from "@/components/ui/liquid-glass-card";

export function SectionMindset() {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-3 mb-8">
        <span className="text-xs font-semibold text-[#e8d5b0]/60 uppercase tracking-widest">01</span>
        <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-[#f0ede8]">L'état d'esprit qui fait l'argent</h2>
      </div>
      <p className="text-white/60 text-base leading-relaxed mb-10">
        Avant la technique, avant les outils, il y a la tête. Ces principes ne changent pas dans le temps. Ils marchent pour un site web, une boutique, un service, n'importe quel business. Ce n'est pas de la motivation. C'est de la mécanique.
      </p>

      {/* Exécution */}
      <LiquidCard className="rounded-2xl p-6 md:p-8 mb-6">
        <h3 className="text-base font-semibold text-[#f0ede8] mb-4">Exécuter au lieu de réfléchir sans fin</h3>
        <p className="text-sm text-white/55 leading-relaxed mb-4">
          Les gens qui passent des semaines à "valider leur idée", qui lisent vingt livres avant d'envoyer un seul message, ne gagnent presque jamais d'argent. Ceux qui lancent un truc simple, qui contactent cent personnes, qui prennent des non et ajustent, eux ils en gagnent.
        </p>
        <p className="text-sm text-white/55 leading-relaxed">
          Ce n'est pas une question d'intelligence. C'est une question d'action. <strong className="text-[#f0ede8]">Le plan parfait qui reste dans ta tête vaut zéro. Le truc imparfait que tu as livré et qu'on t'a payé vaut quelque chose.</strong> La vraie intelligence dans le business, c'est de bouger vite et d'apprendre sur le terrain.
        </p>
      </LiquidCard>

      {/* Volume & abondance */}
      <LiquidCard className="rounded-2xl p-6 md:p-8 mb-6">
        <h3 className="text-base font-semibold text-[#f0ede8] mb-4">Le volume et l'abondance</h3>
        <p className="text-sm text-white/55 leading-relaxed mb-4">
          "Il n'y a pas assez de clients" est une croyance, pas une réalité. Il y a des millions d'artisans, de commerçants, de petites entreprises qui ont besoin d'un site, d'un outil, d'un système. Le problème n'est jamais le manque de clients. C'est toujours le manque de volume ou le mauvais message.
        </p>
        <div className="bg-black/25 border border-white/5 rounded-xl p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
          <p className="text-sm text-[#e8d5b0]/90 leading-relaxed">
            Quand tu envoies dix messages sans réponse, tu n'as pas prouvé que personne ne veut de toi. Tu as juste envoyé dix messages. Cent messages te donnent de la donnée. Mille te donnent une mécanique.
          </p>
        </div>
      </LiquidCard>

      {/* Trois règles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {[
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
        ].map(({ t, d }) => (
          <LiquidCard key={t} className="rounded-2xl p-5">
            <p className="text-sm font-semibold text-[#e8d5b0] mb-3">{t}</p>
            <p className="text-xs text-white/55 leading-relaxed">{d}</p>
          </LiquidCard>
        ))}
      </div>

      {/* Synthèse */}
      <div className="bg-[#e8d5b0]/5 border border-[#e8d5b0]/15 rounded-2xl px-6 py-5">
        <p className="text-sm text-[#e8d5b0]/85 leading-relaxed">
          Retiens ça : exécute d'abord, affine ensuite. Envoie cent messages avant de juger. Construis du récurrent. Vends avant de construire. Le reste, c'est de la technique.
        </p>
      </div>
    </div>
  );
}
