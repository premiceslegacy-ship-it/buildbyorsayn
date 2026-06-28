import { LiquidCard } from "@/components/ui/liquid-glass-card";

export function SectionPsychologie() {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-3 mb-8">
        <span className="text-xs font-semibold text-[#e8d5b0]/60 uppercase tracking-widest">02</span>
        <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-[#f0ede8]">Comprendre ce qui fait agir les gens</h2>
      </div>
      <p className="text-white/60 text-base leading-relaxed mb-10">
        On répète qu'il faut "résoudre un problème". C'est vrai, mais c'est incomplet. Les gens n'achètent pas que des solutions. Ils achètent des émotions, une image d'eux-mêmes, une place dans un groupe. Plus tu comprends la nature humaine en profondeur, plus tu vends.
      </p>

      <LiquidCard className="rounded-2xl p-6 md:p-8 mb-6">
        <h3 className="text-base font-semibold text-[#f0ede8] mb-4">Le problème n'est qu'un levier parmi d'autres</h3>
        <p className="text-sm text-white/55 leading-relaxed">
          Un site web premium ne se vend pas parce qu'il règle un souci technique. Il se vend parce qu'il dit quelque chose sur celui qui le possède : "je suis un professionnel sérieux". L'achat est rarement rationnel. Il est émotionnel, puis justifié par la raison après coup. Ton travail, c'est de parler à l'émotion d'abord.
        </p>
      </LiquidCard>

      {/* Les ressorts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {[
          {
            t: "Le rêve et l'espoir",
            d: "Les gens veulent croire au raccourci, au \"bouton magique\", à la solution qui change tout. C'est ce qui fait tourner le casino : la promesse du gain facile est irrésistible. Tu n'as pas à mentir. Tu dois savoir formuler une promesse qui donne envie d'y croire.",
          },
          {
            t: "L'envie d'appartenir",
            d: "Acheter, c'est parfois entrer dans un groupe, une identité. \"Les artisans sérieux utilisent cet outil.\" Ton produit peut devenir le ticket d'entrée dans une catégorie à laquelle le client veut appartenir.",
          },
          {
            t: "L'effet d'imitation",
            d: "Si ses concurrents ont quelque chose, il le veut aussi. Pas par besoin réel, mais pour ne pas se sentir en retard. Voir les autres faire un choix rassure et pousse à faire pareil.",
          },
          {
            t: "Le statut",
            d: "On paie pour être perçu d'une certaine façon : plus crédible, plus haut de gamme, plus avancé que les autres. Le statut est un moteur d'achat énorme, souvent jamais dit à voix haute.",
          },
          {
            t: "La peur de perdre",
            d: "Perdre quelque chose qu'on a fait plus mal que ne pas gagner quelque chose qu'on n'a pas encore. Une nouvelle obligation légale ne se vend pas comme une opportunité, mais comme une protection contre une sanction.",
          },
          {
            t: "Le besoin de sécurité",
            d: "Beaucoup d'achats servent juste à dormir tranquille : ne plus rater une facture, ne plus perdre un client, ne plus paniquer. Vendre la tranquillité d'esprit est souvent plus fort que vendre une fonctionnalité.",
          },
        ].map(({ t, d }) => (
          <LiquidCard key={t} className="rounded-2xl p-5">
            <p className="text-sm font-semibold text-[#e8d5b0] mb-3">{t}</p>
            <p className="text-xs text-white/55 leading-relaxed">{d}</p>
          </LiquidCard>
        ))}
      </div>

      <div className="bg-[#e8d5b0]/5 border border-[#e8d5b0]/15 rounded-2xl px-6 py-5">
        <p className="text-sm text-[#e8d5b0]/85 leading-relaxed">
          Comprendre ces ressorts, ce n'est pas manipuler. C'est parler aux gens là où ils sont vraiment. L'argent récompense ceux qui connaissent la psychologie humaine mieux que les autres.
        </p>
      </div>
    </div>
  );
}
