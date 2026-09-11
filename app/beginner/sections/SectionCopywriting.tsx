import { LiquidCard } from "@/components/ui/liquid-glass-card";
import { SectionReveal } from "@/components/ui/section-reveal";

export function SectionCopywriting() {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-3 mb-8">
        <span className="text-xs font-semibold text-[#e8d5b0]/60 uppercase tracking-widest">03</span>
        <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-[#f0ede8]">Écrire pour être lu et pour faire agir</h2>
      </div>
      <p className="text-white/60 text-base leading-relaxed mb-10">
        Le copywriting, c&apos;est l&apos;art d&apos;écrire pour vendre. Pas pour faire joli. Pas pour montrer que tu connais des mots compliqués. Pour qu&apos;une personne lise, ressente, et agisse. C&apos;est une compétence qui ne se démode pas.
      </p>

      {/* On ne lit pas */}
      <SectionReveal>
        <LiquidCard variant="elevated" className="p-6 md:p-8 mb-6">
          <h3 className="text-base font-semibold text-[#f0ede8] mb-4 tracking-tight leading-snug">Les gens ne lisent pas, ils scannent</h3>
          <p className="text-sm text-white/65 leading-relaxed mb-4">
            Personne ne lit un texte mot à mot sur un écran. Les yeux glissent, attrapent les titres, les mots en gras, les phrases courtes. Si ton message est un gros bloc compact, il est mort avant d&apos;être lu.
          </p>
          <p className="text-sm text-white/65 leading-relaxed">
            Écris pour la partie rapide et instinctive du cerveau, celle qui décide en une seconde si ça vaut la peine de continuer. <strong className="text-[#f0ede8]">Des titres clairs, des phrases courtes, des images mentales simples, de l&apos;air entre les lignes.</strong>
          </p>
        </LiquidCard>
      </SectionReveal>

      {/* Douleur puis bénéfice */}
      <SectionReveal>
        <LiquidCard variant="elevated" className="p-6 md:p-8 mb-6">
          <h3 className="text-base font-semibold text-[#f0ede8] mb-4 tracking-tight leading-snug">Parle à la douleur, puis au bénéfice</h3>
          <p className="text-sm text-white/65 leading-relaxed mb-5">
            On commence par nommer le problème mieux que le client ne saurait le dire lui-même. Il se reconnaît, il se sent compris. Ensuite seulement on montre le résultat qu&apos;il peut atteindre. Même sur un bouton : il dit le bénéfice, pas l&apos;action mécanique.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative overflow-hidden border border-red-500/20 bg-gradient-to-b from-red-500/[0.06] to-black/20 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04),inset_0_-16px_28px_-24px_rgba(0,0,0,0.6)]">
              <p className="text-xs font-semibold text-red-400 mb-2">Bouton faible</p>
              <p className="text-xs text-white/50">&quot;Envoyer le formulaire&quot;</p>
            </div>
            <div className="relative overflow-hidden border border-emerald-500/20 bg-gradient-to-b from-emerald-500/[0.06] to-black/20 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04),inset_0_-16px_28px_-24px_rgba(0,0,0,0.6)]">
              <p className="text-xs font-semibold text-emerald-400 mb-2">Bouton qui parle au bénéfice</p>
              <p className="text-xs text-white/50">&quot;Recevoir mon devis gratuit&quot;</p>
            </div>
          </div>
        </LiquidCard>
      </SectionReveal>

      {/* Cialdini */}
      <SectionReveal>
        <LiquidCard variant="elevated" className="p-6 md:p-8 mb-6">
          <h3 className="text-base font-semibold text-[#f0ede8] mb-5">Les grands leviers de persuasion</h3>
          <p className="text-sm text-white/65 leading-relaxed mb-5">
            Le chercheur Robert Cialdini a identifié les ressorts qui poussent un humain à dire oui. Tu les retrouveras partout, dans tes textes comme dans tes ventes.
          </p>
          <ul className="space-y-3">
            {[
              ["La preuve sociale", "On fait ce que les autres font. Des avis, des témoignages, un \"déjà utilisé par 200 artisans\" rassurent plus que n'importe quel argument."],
              ["La rareté", "Ce qui est limité prend de la valeur. Une offre qui se termine, des places comptées, ça pousse à décider maintenant plutôt que plus tard."],
              ["L'autorité", "On suit l'expert. Montrer ton expérience, tes résultats, ta maîtrise donne du poids à ta parole."],
              ["La réciprocité", "Quand tu donnes en premier (un conseil, un audit gratuit, de la valeur), l'autre se sent naturellement enclin à te rendre la pareille."],
              ["L'engagement", "Un petit oui en amène un plus grand. Quelqu'un qui a fait un premier pas avec toi a envie de rester cohérent et de continuer."],
              ["La sympathie", "On achète à ceux qu'on apprécie. Être clair, humain et proche du client compte autant que l'offre elle-même."],
            ].map(([label, desc]) => (
              <li key={label} className="flex gap-2 text-xs md:text-sm text-white/50 leading-relaxed">
                <span className="text-[#e8d5b0] flex-shrink-0 font-medium min-w-[130px]">{label} :</span>
                <span>{desc}</span>
              </li>
            ))}
          </ul>
        </LiquidCard>
      </SectionReveal>

      {/* Écrire avec l'IA */}
      <SectionReveal>
        <LiquidCard variant="elevated" className="p-6 md:p-8 mb-6">
          <h3 className="text-base font-semibold text-[#f0ede8] mb-4 tracking-tight leading-snug">Écrire avec l&apos;IA sans perdre ta voix</h3>
          <p className="text-sm text-white/65 leading-relaxed mb-4">
            Une IA peut produire du texte correct en trois secondes - et c&apos;est exactement le problème : &quot;correct&quot; n&apos;est pas &quot;qui vend&quot;. Sans contexte, elle écrit un copywriting générique qui pourrait appartenir à n&apos;importe quel site. Trois choses à lui donner avant de lui demander d&apos;écrire.
          </p>
          <p className="text-sm text-white/60 leading-relaxed mb-3">
            <span className="text-[#f0ede8] font-medium">La douleur exacte du client.</span> Pas &quot;il veut un site&quot;, mais la phrase qu&apos;il utiliserait lui-même pour décrire son problème.
          </p>
          <p className="text-sm text-white/60 leading-relaxed mb-3">
            <span className="text-[#f0ede8] font-medium">Des exemples de ta propre voix.</span> Colle deux ou trois textes que tu as déjà écrits et validés - l&apos;IA doit s&apos;aligner dessus, pas imposer son propre style par défaut.
          </p>
          <p className="text-sm text-white/60 leading-relaxed">
            <span className="text-[#f0ede8] font-medium">Le bouton et le contexte de la page.</span> Une IA qui ne sait pas ce qui entoure une phrase produit un texte interchangeable, comme un visuel sans référence.
          </p>
        </LiquidCard>
      </SectionReveal>

      <SectionReveal className="bg-[#e8d5b0]/5 border border-[#e8d5b0]/15 px-6 py-5">
        <p className="text-sm text-[#e8d5b0]/85 leading-relaxed">
          Écris simple. Parle à la douleur, montre le bénéfice, glisse un levier de persuasion. Et souviens-toi : on ne lit pas, on scanne.
        </p>
      </SectionReveal>
    </div>
  );
}
