import Link from "next/link";
import { ArrowRight, Lock } from "lucide-react";

export function Section5({ upgradeUrl, isFullUser }: { upgradeUrl: string; isFullUser: boolean }) {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-3 mb-8">
        <span className="text-xs font-semibold text-[#e8d5b0]/60 uppercase tracking-widest">05</span>
        <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-[#f0ede8]">L'angle mort</h2>
      </div>
      <p className="text-white/60 text-base leading-relaxed mb-10">
        Jusqu'ici, on a vu 20% du travail. Ça suffit pour faire un "beau site". Ça ne suffit pas pour créer de vrais systèmes.
      </p>

      {/* Les 4 piliers */}
      <h3 className="text-base font-semibold text-[#f0ede8] mb-6">Ce qu'il manque pour un vrai produit :</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
        {[
          {
            title: "Le framework ORACLE",
            desc: "Ma méthode pour construire un projet de A à Z avec l'IA. Il remplace le prompt hasardeux par une structure de documents (BRIEF, BRAND-SYSTEM, DESIGN-SYSTEM, PRD, PARCOURS-UTILISATEURS, PROMPT-SYSTEM) qui permettent à l'IA d'avoir un contexte extrêmement précis. Chaque document nourrit le suivant. Le résultat final n'a rien à voir avec ce que tu obtiens en tapant « crée-moi un site » dans Lovable.",
          },
          {
            title: "La logique business",
            desc: "Comment choisir une niche, se positionner, vendre avant de construire, itérer sur le feedback terrain. La technique c’est que 10% de l’équation, le plus dur c’est de vendre et faire de l’argent.",
          },
          {
            title: "L'identité visuelle forte",
            desc: "La différence entre un site qu'on oublie 10 secondes après l'avoir vu et un site qui installe une perception de marque. Ce n'est pas une question de budget, c'est une question de système.",
          },
          {
            title: "L'ingénierie des Skills",
            desc: "Au-delà d'un prompt basique, comment on construit un système complet de skills qu'on charge en un clic ?",
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
              Tu as les fondations. Le système complet - les 7 blocs, les sources et les méthodes pour construire des lignes verticales IA qui rapportent - t'attend.
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
