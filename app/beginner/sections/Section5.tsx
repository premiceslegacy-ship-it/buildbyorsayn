import Link from "next/link";
import { ArrowRight, Lock } from "lucide-react";
import { SectionReveal } from "@/components/ui/section-reveal";
import { COFFRE_LABEL, COFFRE_PRICE, UPGRADE_PRICE } from "@/lib/pricing";

export function Section5({ upgradeUrl, isFullUser }: { upgradeUrl: string | null; isFullUser: boolean }) {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-3 mb-8">
        <span className="text-xs font-semibold text-[#e8d5b0]/60 uppercase tracking-widest">11</span>
        <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-[#f0ede8]">Le seuil</h2>
      </div>
      <p className="text-white/60 text-base leading-relaxed mb-6">
        Tu as les Fondations entre les mains. C'est déjà une base solide pour commencer à tester une offre, un message et un premier flux de travail. Mais aucune méthode ne garantit des clients par simple application. Le marché, la preuve, la qualité d'exécution et la capacité à apprendre du terrain restent déterminants.
      </p>
      <p className="text-white/60 text-base leading-relaxed mb-10">
        Mais regarde la dépendance en face. Si tu construis au feeling, sans garder tes briefs, tes décisions, tes exports et tes procédures, un changement de modèle ou de plateforme peut te faire perdre du temps. Les Fondations te donnent un premier socle. {COFFRE_LABEL} t'aide à transformer ce socle en méthode réutilisable et portable.
      </p>

      {/* Les 5 piliers */}
      <SectionReveal>
        <h3 className="text-base font-semibold text-[#f0ede8] mb-6">Ce qui peut transformer un premier projet en capital qui tient :</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5 mb-12 items-start">
          {[
            {
              title: "Le framework ORACLE",
              desc: "La méthode pour construire un projet de A à Z avec l'IA. Une structure de documents (brief, identité, design, fonctionnalités, parcours) où chacun nourrit le suivant. Le résultat n'a rien à voir avec un « crée-moi un site » lancé au hasard.",
            },
            {
              title: "La logique business",
              desc: "Trouver une idée dans un segment que tu peux atteindre et dont tu peux comprendre les contraintes. Choisir entre une mission ponctuelle et un suivi régulier quand le besoin le justifie. Valider avant d'élargir. La technique est une partie de l'équation ; le reste sert à construire une activité que le marché peut réellement soutenir.",
            },
            {
              title: "L'architecture produit",
              desc: "ORACLE by Orsayn + Backend Orsayn : la méthode pour construire des apps, des logiciels SaaS et des outils métier qui tiennent. Pas seulement un site. Un produit en couches, avec une logique de délégation, une base serveur durcie et une livraison prête pour le client.",
            },
            {
              title: "L'ingénierie des Skills",
              desc: "Comment encoder ton savoir-faire dans des systèmes réutilisables que tu peux charger quand le contexte le demande. C'est un capital de méthode : ce que tu formalises une fois peut réduire le temps de préparation sur les projets suivants, sous ton contrôle.",
            },
            {
              title: "La doctrine agentique",
              desc: "Tu as vu la différence entre un assistant et un agent (section 07). LE COFFRE va au bout : comment décomposer un métier en agents, borner leur autorité et organiser un travail autour de l'IA, pas seulement autour d'un prompt.",
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
                Les Fondations t'aident à préparer un problème, une offre et un premier flux de travail. {COFFRE_LABEL} va plus loin : structurer des projets de long terme, des suivis qui peuvent être facturés régulièrement quand une demande réelle existe, et ta propre expertise dans des systèmes que tu peux exporter, vérifier et faire évoluer. Aucun contenu ne supprime le besoin de vendre, livrer et apprendre du terrain. Les 7 blocs, les sources et les méthodes exactes t'attendent.
              </p>

              {upgradeUrl ? (
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
              ) : (
                <p role="status" className="rounded-full border border-white/10 bg-white/[0.03] px-5 py-3 text-sm text-white/45">
                  Le paiement de l'upgrade n'est pas encore activé.
                </p>
              )}
              <p className="text-xs text-white/30 mt-4 text-center">Complément pour passer à {COFFRE_LABEL}.</p>
            </div>
          </div>
        ) : (
          <div className="relative overflow-hidden items-center justify-center border border-emerald-500/20 bg-gradient-to-b from-emerald-500/[0.08] to-black/20 rounded-2xl p-8 text-center flex flex-col gap-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.05),inset_0_-24px_40px_-30px_rgba(0,0,0,0.6)]">
            <span className="w-12 h-12 bg-gradient-to-b from-emerald-500/20 to-emerald-500/5 rounded-full flex items-center justify-center font-bold text-emerald-400 text-xl border border-emerald-500/25 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
              ✓
            </span>
            <div>
              <h3 className="text-emerald-400 font-semibold mb-2">Tu as déjà l'accès complet</h3>
              <p className="text-emerald-400/60 text-sm">Tu peux naviguer vers l'onglet &quot;La stack&quot;.</p>
            </div>
          </div>
        )}
      </SectionReveal>
    </div>
  );
}
