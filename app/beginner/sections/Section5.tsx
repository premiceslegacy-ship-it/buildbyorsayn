import { ArrowRight, Lock } from "lucide-react";
import { SectionReveal } from "@/components/ui/section-reveal";
import { COFFRE_LABEL, COFFRE_PRICE, UPGRADE_PRICE } from "@/lib/pricing";
import styles from "./section5.module.css";

export function Section5({ upgradeUrl, isFullUser }: { upgradeUrl: string; isFullUser: boolean }) {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 motion-reduce:animate-none">
      <div className="flex items-center gap-3 mb-8">
        <span className="text-xs font-semibold text-[var(--em)]">11</span>
        <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-[var(--encre)]">Le seuil</h2>
      </div>
      <p className="text-[var(--t2)] text-base leading-relaxed mb-6">
        Tu peux maintenant cadrer un problème, préparer le contexte, choisir un outil et mettre un premier site en ligne. Cette base sert à tester une offre, un message et un premier flux réel. Elle ne crée pas de clients par simple application. Le marché, la preuve et la qualité de livraison restent déterminants. Elle s’applique à des sites pour restaurants, à des automatisations pour cabinets de kiné ou de comptabilité, ou à ton propre commerce.
      </p>
      <p className="text-[var(--t2)] text-base leading-relaxed mb-10">
        Prends le dernier projet que tu as touché. Si ses briefs, décisions, fichiers sources, accès et procédures vivent seulement dans une conversation, tu dépends encore de l’outil et de ta mémoire. Les Fondations t’aident à lancer une preuve. {COFFRE_LABEL} sert à transformer les apprentissages validés en méthode portable. À faire ce soir : sors ce projet de la conversation et range son brief, ses décisions et ses accès dans un dossier. Compte 30 minutes. Tu repars avec un dossier projet que n’importe quel outil peut relire.
      </p>

      {/* Les piliers */}
      <SectionReveal>
        <h3 className="text-base font-semibold text-[var(--encre)] mb-6">Ce qui transforme un projet livré en capital de méthode :</h3>
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
            <div key={title} className="rounded-[var(--r-m)] bg-[var(--carte)] p-5">
              <div>
                <p className="text-sm font-semibold text-[var(--menthe)] mb-2 tracking-tight leading-snug">{title}</p>
                <p className="text-sm text-[var(--t2)] leading-[1.65]">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </SectionReveal>

      {/* CTA Upgrade */}
      <SectionReveal>
        {!isFullUser ? (
          <div className="rounded-[var(--r-l)] bg-[var(--carte)] p-6 sm:p-8">
            <div className="mx-auto max-w-lg text-center">
              <div className="mx-auto mb-6 flex size-12 items-center justify-center rounded-full bg-[rgba(34,217,110,.14)]">
                <Lock className="size-5 text-[var(--em)]" />
              </div>
              <h3 className="text-xl font-semibold text-[var(--encre)] mb-4">Continuer avec une méthode complète</h3>
              <p className="text-sm text-[var(--t2)] leading-relaxed mb-8">
                Les Fondations t’aident à cadrer et livrer une première preuve. {COFFRE_LABEL} développe la recherche de marché, l’offre, l’architecture, la livraison, les skills et les workflows agentiques. Tu y structures aussi les projets de long terme et les suivis réguliers lorsqu’une demande réelle et une capacité de livraison les justifient. Tes sources, critères, décisions et procédures restent exportables, vérifiables et modifiables. Le contenu ne remplace jamais la vente, la livraison ni les retours du terrain.
              </p>

              <a
                href={upgradeUrl}
                className={`${styles.cta} inline-flex min-h-12 w-full items-center justify-between gap-4 rounded-full bg-[var(--encre)] px-5 py-3`}
              >
                <div className="flex min-w-0 items-center gap-3">
                  <span className="whitespace-nowrap text-sm font-medium">{COFFRE_LABEL}</span>
                  <span className="whitespace-nowrap text-xs opacity-[.55] line-through">{COFFRE_PRICE}€</span>
                </div>
                <div className="flex min-w-0 items-center gap-2 text-right text-sm font-semibold">
                  Structurer ma méthode : {UPGRADE_PRICE}€
                  <ArrowRight className="size-4 shrink-0" />
                </div>
              </a>
              <p className="text-xs text-[var(--t3)] mt-4 text-center">Complément pour accéder à {COFFRE_LABEL}.</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-4 rounded-[var(--r-l)] bg-[var(--carte)] p-8 text-center">
            <span className="flex size-12 items-center justify-center rounded-full bg-[rgba(34,217,110,.14)] text-xl font-bold text-[var(--em)]">
              ✓
            </span>
            <div>
              <h3 className="mb-2 font-semibold text-[var(--encre)]">Tu as déjà l'accès complet</h3>
              <p className="text-sm text-[var(--t2)]">Tu peux continuer vers l'onglet &quot;La stack&quot;.</p>
            </div>
          </div>
        )}
      </SectionReveal>
    </div>
  );
}
