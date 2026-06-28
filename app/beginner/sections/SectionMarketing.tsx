import { LiquidCard } from "@/components/ui/liquid-glass-card";

export function SectionMarketing() {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-3 mb-8">
        <span className="text-xs font-semibold text-[#e8d5b0]/60 uppercase tracking-widest">05</span>
        <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-[#f0ede8]">Capter l'attention et rester dans les têtes</h2>
      </div>
      <p className="text-white/60 text-base leading-relaxed mb-10">
        Le meilleur produit du monde ne sert à rien si personne ne le connaît. Le marketing, c'est la bataille pour l'attention. Et cette attention est devenue la ressource la plus rare : tu te bats contre des gens qui passent des heures à faire défiler leur écran.
      </p>

      {/* Big idea */}
      <LiquidCard className="rounded-2xl p-6 md:p-8 mb-6">
        <h3 className="text-base font-semibold text-[#f0ede8] mb-4">La grande idée qui te démarque</h3>
        <p className="text-sm text-white/55 leading-relaxed mb-4">
          Pour exister, il te faut une idée forte. Une idée qui intrigue ta niche, qui remet en question sa façon de faire, qui dérange même un peu. Si tout le monde est d'accord avec toi, c'est que tu es invisible.
        </p>
        <p className="text-sm text-white/55 leading-relaxed">
          <strong className="text-[#f0ede8]">Une bonne idée marketing fait réagir : certains adhèrent à fond, d'autres vont presque t'insulter.</strong> C'est bon signe. Une position tranchée attire les bonnes personnes et repousse les autres. Le pire, ce n'est pas d'être critiqué. C'est d'être ignoré.
        </p>
      </LiquidCard>

      {/* Le tunnel */}
      <LiquidCard className="rounded-2xl p-6 md:p-8 mb-6">
        <h3 className="text-base font-semibold text-[#f0ede8] mb-5">Le parcours en trois temps</h3>
        <p className="text-sm text-white/55 leading-relaxed mb-5">
          Un inconnu ne devient pas client d'un coup. Il passe par trois étapes, et ton contenu doit nourrir chacune d'elles.
        </p>
        <div className="space-y-3">
          {[
            ["Faire découvrir", "Du contenu large qui attire des gens qui ne te connaissent pas encore. Le but : créer l'écart entre leur façon de faire aujourd'hui et là où tu veux les emmener."],
            ["Faire considérer", "Du contenu qui prouve que tu sais de quoi tu parles : exemples, méthodes, résultats. La personne commence à te faire confiance et à se projeter."],
            ["Faire passer à l'achat", "Du contenu direct qui lève les derniers doutes et propose de passer à l'action. Témoignages, offre claire, appel à l'action."],
          ].map(([t, d], i) => (
            <div key={t} className="flex gap-4 bg-black/25 border border-white/5 rounded-xl p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
              <span className="w-7 h-7 rounded-full bg-[#e8d5b0]/10 border border-[#e8d5b0]/20 flex items-center justify-center text-xs font-bold text-[#e8d5b0] flex-shrink-0 shadow-[inset_0_1px_0_rgba(255,255,255,0.15)]">
                {i + 1}
              </span>
              <div>
                <p className="text-sm font-semibold text-[#e8d5b0] mb-1">{t}</p>
                <p className="text-xs text-white/55 leading-relaxed">{d}</p>
              </div>
            </div>
          ))}
        </div>
      </LiquidCard>

      {/* Volume puis quali */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {[
          {
            t: "Le hook qui arrête le scroll",
            d: "Les trois premières secondes décident de tout. La première phrase, la première image doit stopper le pouce. Sans accroche, le meilleur contenu ne sera jamais vu.",
          },
          {
            t: "Une idée, plusieurs formats",
            d: "Une vidéo longue ou un article se redécoupe en plusieurs contenus courts, sur plusieurs canaux. Tu produis une fois et tu diffuses dix fois. C'est comme ça qu'on est partout sans s'épuiser.",
          },
          {
            t: "Le mode volume au début",
            d: "Au démarrage, tu fais du volume sans complexe : du contenu chaque jour, des appels et des messages à froid. C'est brutal mais c'est ce qui rentre du cash et qui te fait connaître vite.",
          },
          {
            t: "Puis moins mais mieux",
            d: "Une fois installé dans les têtes, tu peux prendre du recul et viser la qualité. Mais sans disparaître : les gens scrollent en permanence, tu dois rester présent chaque semaine pour ne pas être oublié.",
          },
        ].map(({ t, d }) => (
          <LiquidCard key={t} className="rounded-2xl p-5">
            <p className="text-sm font-semibold text-[#e8d5b0] mb-3">{t}</p>
            <p className="text-xs text-white/55 leading-relaxed">{d}</p>
          </LiquidCard>
        ))}
      </div>

      {/* Capital */}
      <div className="bg-[#e8d5b0]/5 border border-[#e8d5b0]/15 rounded-2xl px-6 py-5">
        <p className="text-sm text-[#e8d5b0]/85 leading-relaxed">
          Le contenu que tu crées et les compétences que tu développes sont du capital. Ça ne disparaît pas le lendemain : ça s'accumule et ça grossit dans le temps. Chaque vidéo, chaque post, chaque client te rend plus fort pour le suivant.
        </p>
      </div>
    </div>
  );
}
