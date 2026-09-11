import { LiquidCard } from "@/components/ui/liquid-glass-card";
import { SectionReveal } from "@/components/ui/section-reveal";

const LEVERS = [
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
];

export function SectionPsychologie() {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-3 mb-8">
        <span className="text-xs font-semibold text-[#e8d5b0]/60 uppercase tracking-widest">02</span>
        <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-[#f0ede8]">Comprendre ce qui fait agir les gens</h2>
      </div>
      <p className="text-white/60 text-base leading-relaxed mb-10">
        On répète qu&apos;il faut &quot;résoudre un problème&quot;. C&apos;est vrai, mais c&apos;est incomplet. Les gens n&apos;achètent pas que des solutions. Ils achètent des émotions, une image d&apos;eux-mêmes, une place dans un groupe. Plus tu comprends la nature humaine en profondeur, plus tu vends - et plus tu sais orienter une IA pour écrire un message qui parle vraiment à quelqu&apos;un.
      </p>

      <SectionReveal>
        <LiquidCard variant="elevated" className="p-6 md:p-8 mb-6">
          <h3 className="text-base font-semibold text-[#f0ede8] mb-4 tracking-tight leading-snug">Le problème n&apos;est qu&apos;un levier parmi d&apos;autres</h3>
          <p className="text-sm text-white/65 leading-relaxed">
            Un site web premium ne se vend pas parce qu&apos;il règle un souci technique. Il se vend parce qu&apos;il dit quelque chose sur celui qui le possède : &quot;je suis un professionnel sérieux&quot;. L&apos;achat est rarement rationnel. Il est émotionnel, puis justifié par la raison après coup. Ton travail, c&apos;est de parler à l&apos;émotion d&apos;abord.
          </p>
        </LiquidCard>
      </SectionReveal>

      {/* Les ressorts */}
      <SectionReveal className="mb-6">
        <h3 className="text-base font-semibold text-[#f0ede8] mb-2">Six ressorts psychologiques</h3>
        <p className="text-sm text-white/45 leading-relaxed mb-5 max-w-2xl">
          Chacun répond à un besoin différent - un bon message en active souvent plusieurs à la fois.
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
          Comprendre ces ressorts, ce n&apos;est pas manipuler. C&apos;est parler aux gens là où ils sont vraiment. L&apos;argent récompense ceux qui connaissent la psychologie humaine mieux que les autres.
        </p>
      </SectionReveal>
    </div>
  );
}
