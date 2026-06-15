import Link from "next/link";
import { ArrowRight, Lock } from "lucide-react";

export function Section5({ upgradeUrl, isFullUser }: { upgradeUrl: string; isFullUser: boolean }) {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-3 mb-8">
        <span className="text-xs font-semibold text-[#e8d5b0]/60 uppercase tracking-widest">10</span>
        <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-[#f0ede8]">L'angle mort</h2>
      </div>
      <p className="text-white/60 text-base leading-relaxed mb-6">
        Tu sais maintenant mettre un site en ligne. C'est déjà plus que la majorité des gens. Mais regarde la vérité en face : tu ne sais pas encore s'il convertit, s'il tiendra la charge le jour où le trafic arrive, ni s'il répond à un vrai marché qui peut payer.
      </p>
      <p className="text-white/60 text-base leading-relaxed mb-10">
        Tant que tu construis au feeling, tu restes locataire de tes propres compétences. L'IA, c'est l'avenir, et la vraie opportunité n'est pas de faire un joli site jetable. C'est d'en faire un actif qui rapporte, mois après mois. Voilà ce qui transforme l'un en l'autre.
      </p>

      {/* Les 4 piliers */}
      <h3 className="text-base font-semibold text-[#f0ede8] mb-6">Ce qui sépare une vitrine d'un vrai système :</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
        {[
          {
            title: "Le framework ORACLE",
            desc: "La méthode pour construire un projet de A à Z avec l'IA, celle qu'on utilise pour bâtir nos propres lignes comme Atelier. Une structure de documents (brief, identité, design, fonctionnalités, parcours) où chacun nourrit le suivant. Le résultat n'a rien à voir avec un « crée-moi un site » lancé au hasard.",
          },
          {
            title: "La logique business",
            desc: "Choisir une niche, te positionner, vendre avant de construire, t'ajuster avec le terrain. La technique, c'est 10% de l'équation. Le vrai défi, celui qui te fait gagner ta vie, c'est de vendre et de faire de l'argent.",
          },
          {
            title: "L'identité visuelle forte",
            desc: "La différence entre un site qu'on oublie en dix secondes et un site qui installe une vraie marque dans la tête du client. Ce n'est pas une question de budget. C'est une question de système.",
          },
          {
            title: "L'ingénierie des Skills",
            desc: "Comment encoder ton savoir-faire dans des systèmes réutilisables que tu charges en un clic. C'est ça, ton capital : ce que tu construis une fois et qui travaille pour toi sur tous tes projets suivants.",
          },
        ].map(({ title, desc }) => (
          <div key={title} className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-5">
            <p className="text-sm font-semibold text-[#e8d5b0] mb-3">{title}</p>
            <p className="text-xs text-white/55 leading-relaxed">{desc}</p>
          </div>
        ))}
      </div>

      {/* CTA Upgrade */}
      {!isFullUser ? (
        <div className="bg-[#1c1c1f] border border-[#e8d5b0]/20 rounded-2xl p-8 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-[#e8d5b0]/5 to-transparent pointer-events-none" />
          <div className="relative z-10 text-center max-w-lg mx-auto">
            <div className="w-12 h-12 bg-[#e8d5b0]/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Lock className="w-5 h-5 text-[#e8d5b0]" />
            </div>
            <h3 className="text-xl font-semibold text-[#f0ede8] mb-4">La suite logique</h3>
            <p className="text-sm text-white/60 leading-relaxed mb-8">
              Tu as les fondations. Maintenant l'écart à combler, c'est tout ce qui transforme un site en système qui rapporte. Le système complet - les 7 blocs, les sources et les méthodes exactes pour construire des lignes verticales IA qui génèrent du revenu chaque mois - t'attend.
            </p>

            <Link
              href={upgradeUrl}
              className="inline-flex items-center justify-between w-full p-1 rounded-full bg-white/[0.03] border border-white/10 hover:border-[#e8d5b0]/40 transition-colors group/btn"
            >
              <div className="flex items-center gap-3 pl-4 pr-2">
                <span className="text-sm font-medium text-[#f0ede8]">Système complet</span>
                <span className="text-xs text-white/40 line-through">497€</span>
              </div>
              <div className="flex items-center gap-3 bg-[#e8d5b0] text-[#0e0e0f] px-5 py-2.5 rounded-full text-sm font-semibold">
                Passer au complet - 400€
                <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-0.5 transition-transform" />
              </div>
            </Link>
            <p className="text-xs text-white/30 mt-4 text-center">Complément pour passer au système complet.</p>
          </div>
        </div>
      ) : (
        <div className="bg-emerald-500/5 items-center justify-center border border-emerald-500/15 rounded-2xl p-8 text-center flex flex-col gap-4">
          <span className="w-12 h-12 bg-emerald-500/10 rounded-full flex items-center justify-center font-bold text-emerald-400 text-xl border border-emerald-500/20">
            ✓
          </span>
          <div>
            <h3 className="text-emerald-400 font-semibold mb-2">Tu as déjà l'accès complet</h3>
            <p className="text-emerald-400/60 text-sm">Tu peux naviguer vers l'onglet "La stack".</p>
          </div>
        </div>
      )}
    </div>
  );
}
