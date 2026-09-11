import Link from "next/link";
import { ArrowRight, Lock } from "lucide-react";
import { SectionReveal } from "@/components/ui/section-reveal";
import { COFFRE_LABEL, COFFRE_PRICE, UPGRADE_PRICE } from "@/lib/pricing";

export function Section5({ upgradeUrl, isFullUser }: { upgradeUrl: string; isFullUser: boolean }) {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-3 mb-8">
        <span className="text-xs font-semibold text-[#e8d5b0]/60 uppercase tracking-widest">10</span>
        <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-[#f0ede8]">Le seuil</h2>
      </div>
      <p className="text-white/60 text-base leading-relaxed mb-6">
        Tu as les Fondations entre les mains. C'est déjà plus que la majorité des gens. Avec ce que tu viens d'apprendre, le volume marketing, l'acquisition client, le grind brut, tu as tout pour décrocher tes premiers clients et tes premiers cashflows. Applique-le à la lettre et le cash rentre.
      </p>
      <p className="text-white/60 text-base leading-relaxed mb-10">
        Mais regarde la vérité en face. Tant que tu construis au feeling, tu restes locataire de tes propres outils. Une mise à jour de l'IA, un modèle qui change, une plateforme qui ferme, et tu repars de zéro. Les Fondations te font entrer dans le game. {COFFRE_LABEL}, c'est ce qui te fait sortir de la dépendance pour de bon.
      </p>

      {/* Les 5 piliers */}
      <SectionReveal>
        <h3 className="text-base font-semibold text-[#f0ede8] mb-6">Ce qui te fait passer de premier cash à capital qui tient :</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5 mb-12 items-start">
          {[
            {
              title: "Le framework ORACLE",
              desc: "La méthode pour construire un projet de A à Z avec l'IA, celle qu'on utilise pour bâtir nos propres lignes comme Atelier. Une structure de documents (brief, identité, design, fonctionnalités, parcours) où chacun nourrit le suivant. Le résultat n'a rien à voir avec un « crée-moi un site » lancé au hasard.",
            },
            {
              title: "La logique business",
              desc: "Trouver la bonne idée, dans la bonne niche, celle que tu peux atteindre et qui a l'argent. Choisir entre le projet qui lock et le one-shot à gros ticket. Vendre avant de construire. La technique, c'est 10% de l'équation. Le reste, c'est ce qui te fait vraiment gagner ta vie.",
            },
            {
              title: "L'architecture produit",
              desc: "ORACLE by Orsayn + Expert Backend : la méthode pour construire des apps, SaaS et outils métier qui tiennent. Pas juste un site. Un produit en couches, avec une logique de délégation, une base backend durcie et une livraison client-ready.",
            },
            {
              title: "L'ingénierie des Skills",
              desc: "Comment encoder ton savoir-faire dans des systèmes réutilisables que tu charges en un clic. C'est ça, ton capital : ce que tu construis une fois et qui travaille pour toi sur tous tes projets suivants.",
            },
            {
              title: "La doctrine agentique",
              desc: "Tu as vu la différence entre un assistant et un agent (section 07). LE COFFRE va au bout : comment décomposer un métier en agents, borner leur autorité et rendre une entreprise entière AI-first - pas juste un prompt, une organisation qui capitalise sur sa connaissance et ses process.",
            },
          ].map(({ title, desc }) => (
            <div key={title} className="relative border border-[#c9b48a]/25 bg-gradient-to-b from-white/[0.045] to-white/[0.012] p-5">
              <div aria-hidden="true" className="pointer-events-none absolute inset-[5px] border border-[#c9b48a]/10" />
              <div className="relative z-10">
                <p className="text-sm font-semibold text-[#e8d5b0] mb-2 tracking-tight leading-snug">{title}</p>
                <p className="text-[13px] text-white/65 leading-[1.65]">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </SectionReveal>

      {/* CTA Upgrade */}
      <SectionReveal>
        {!isFullUser ? (
          <div className="bg-[#1c1c1f] border border-[#e8d5b0]/20 rounded-2xl p-8 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-[#e8d5b0]/5 to-transparent pointer-events-none" />
            <div className="relative z-10 text-center max-w-lg mx-auto">
              <div className="w-12 h-12 bg-[#e8d5b0]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Lock className="w-5 h-5 text-[#e8d5b0]" />
              </div>
              <h3 className="text-xl font-semibold text-[#f0ede8] mb-4">La suite logique</h3>
              <p className="text-sm text-white/60 leading-relaxed mb-8">
                Les Fondations t&apos;amènent tes premiers clients. {COFFRE_LABEL} t&apos;amène ailleurs : des projets long terme, des lignes verticales qui génèrent du revenu chaque mois, et ta propre expertise distillée dans des systèmes qui t&apos;appartiennent. Tu ne crains plus une mise à jour de l&apos;IA. Les 7 blocs, les sources et les méthodes exactes t&apos;attendent.
              </p>

              <Link
                href={upgradeUrl}
                className="inline-flex items-center justify-between w-full p-1 rounded-full bg-white/[0.03] border border-white/10 hover:border-[#e8d5b0]/40 transition-colors group/btn"
              >
                <div className="flex items-center gap-3 pl-4 pr-2">
                  <span className="text-sm font-medium text-[#f0ede8]">{COFFRE_LABEL}</span>
                  <span className="text-xs text-white/40 line-through">{COFFRE_PRICE}€</span>
                </div>
                <div className="flex items-center gap-3 bg-[#e8d5b0] text-[#0e0e0f] px-5 py-2.5 rounded-full text-sm font-semibold">
                  Passer au complet - {UPGRADE_PRICE}€
                  <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-0.5 transition-transform" />
                </div>
              </Link>
              <p className="text-xs text-white/30 mt-4 text-center">Complément pour passer à {COFFRE_LABEL}.</p>
            </div>
          </div>
        ) : (
          <div className="relative overflow-hidden items-center justify-center border border-emerald-500/20 bg-gradient-to-b from-emerald-500/[0.08] to-black/20 rounded-2xl p-8 text-center flex flex-col gap-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.05),inset_0_-24px_40px_-30px_rgba(0,0,0,0.6)]">
            <span className="w-12 h-12 bg-gradient-to-b from-emerald-500/20 to-emerald-500/5 rounded-full flex items-center justify-center font-bold text-emerald-400 text-xl border border-emerald-500/25 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
              ✓
            </span>
            <div>
              <h3 className="text-emerald-400 font-semibold mb-2">Tu as déjà l&apos;accès complet</h3>
              <p className="text-emerald-400/60 text-sm">Tu peux naviguer vers l&apos;onglet &quot;La stack&quot;.</p>
            </div>
          </div>
        )}
      </SectionReveal>
    </div>
  );
}
