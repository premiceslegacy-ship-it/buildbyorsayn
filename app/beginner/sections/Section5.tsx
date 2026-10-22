import { ArrowRight, Lock } from "lucide-react";
import { SectionReveal } from "@/components/ui/section-reveal";
import { COFFRE_LABEL, COFFRE_PRICE, UPGRADE_PRICE } from "@/lib/pricing";

export function Section5({ upgradeUrl, isFullUser }: { upgradeUrl: string; isFullUser: boolean }) {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-3 mb-8">
        <span className="text-xs font-semibold text-[#e8d5b0]/60 uppercase tracking-widest">11</span>
        <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-[#f0ede8]">Le seuil</h2>
      </div>
      <p className="text-white/60 text-base leading-relaxed mb-6">
        Tu peux maintenant cadrer un problème, préparer le contexte, choisir un outil et mettre un premier site en ligne. Cette base sert à tester une offre, un message et un premier flux réel. Elle ne crée pas de clients par simple application. Le marché, la preuve et la qualité de livraison restent déterminants.
      </p>
      <p className="text-white/60 text-base leading-relaxed mb-10">
        Prends le dernier projet que tu as touché. Si ses briefs, décisions, fichiers sources, accès et procédures vivent seulement dans une conversation, tu dépends encore de l’outil et de ta mémoire. Les Fondations t’aident à lancer une preuve. {COFFRE_LABEL} sert à transformer les apprentissages validés en méthode portable.
      </p>

      {/* Les piliers */}
      <SectionReveal>
        <h3 className="text-base font-semibold text-[#f0ede8] mb-6">Ce qui transforme un projet livré en capital de méthode :</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5 mb-12 items-start">
          {[
            {
              title: "Le framework ORACLE",
              desc: "Une demande floue devient un dossier fondateur, des décisions structurantes, un plan validé et des contrôles. Les documents sont créés selon le risque du projet. Chacun alimente l'étape suivante sans demander à l'IA de deviner le métier.",
            },
            {
              title: "La logique business",
              desc: "Un segment accessible, une friction observée et une offre testable passent avant l'élargissement. Tu choisis une mission ponctuelle ou un suivi régulier selon le besoin réel. Les retours du terrain décident de la suite.",
            },
            {
              title: "L'architecture produit",
              desc: "ORACLE by Orsayn et Backend Orsayn structurent les applications, les logiciels SaaS et les outils métier par couches. Les données, les permissions, les flux, les contrôles et la remise au client deviennent lisibles.",
            },
            {
              title: "L'ingénierie des skills",
              desc: "Un skill est une procédure versionnée avec ses entrées, ses choix, ses limites et sa vérification. Ce que tu apprends sur un projet peut être encodé, testé puis rechargé sans repartir d'une conversation vide.",
            },
            {
              title: "La doctrine agentique",
              desc: "Un métier est décomposé en capacités, tâches bornées et contrôles. Chaque agent reçoit les sources, les outils et l'autorité utiles à sa mission. Une personne garde les décisions sensibles et peut suspendre le flux.",
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
              <h3 className="text-xl font-semibold text-[#f0ede8] mb-4">Continuer avec une méthode complète</h3>
              <p className="text-sm text-white/60 leading-relaxed mb-8">
                Les Fondations t’aident à cadrer et livrer une première preuve. {COFFRE_LABEL} développe la recherche de marché, l’offre, l’architecture, la livraison, les skills et les workflows agentiques. Tu y structures aussi les projets de long terme et les suivis réguliers lorsqu’une demande réelle et une capacité de livraison les justifient. Tes sources, critères, décisions et procédures restent exportables, vérifiables et modifiables. Le contenu ne remplace jamais la vente, la livraison ni les retours du terrain.
              </p>

              <a
                href={upgradeUrl}
                className="inline-flex items-center justify-between w-full p-1 rounded-full bg-white/[0.03] border border-white/10 hover:border-[#e8d5b0]/40 transition-colors group/btn"
              >
                <div className="flex items-center gap-3 pl-4 pr-2">
                  <span className="text-sm font-medium text-[#f0ede8]">{COFFRE_LABEL}</span>
                  <span className="text-xs text-white/40 line-through">{COFFRE_PRICE}€</span>
                </div>
                <div className="flex items-center gap-3 bg-[#e8d5b0] text-[#0e0e0f] px-5 py-2.5 rounded-full text-sm font-semibold">
                  Structurer ma méthode : {UPGRADE_PRICE}€
                  <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-0.5 transition-transform" />
                </div>
              </a>
              <p className="text-xs text-white/30 mt-4 text-center">Complément pour accéder à {COFFRE_LABEL}.</p>
            </div>
          </div>
        ) : (
          <div className="relative overflow-hidden items-center justify-center border border-emerald-500/20 bg-gradient-to-b from-emerald-500/[0.08] to-black/20 rounded-2xl p-8 text-center flex flex-col gap-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.05),inset_0_-24px_40px_-30px_rgba(0,0,0,0.6)]">
            <span className="w-12 h-12 bg-gradient-to-b from-emerald-500/20 to-emerald-500/5 rounded-full flex items-center justify-center font-bold text-emerald-400 text-xl border border-emerald-500/25 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
              ✓
            </span>
            <div>
              <h3 className="text-emerald-400 font-semibold mb-2">Tu as déjà l'accès complet</h3>
              <p className="text-emerald-400/60 text-sm">Tu peux continuer vers l'onglet &quot;La stack&quot;.</p>
            </div>
          </div>
        )}
      </SectionReveal>
    </div>
  );
}
