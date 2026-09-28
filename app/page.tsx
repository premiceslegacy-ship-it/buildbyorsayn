import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { ArrowRight, UserPlus } from "lucide-react";
import { PricingCarousel } from "@/components/PricingCarousel";
import { McpConnectorShowcase } from "@/components/McpConnectorShowcase";
import { AccompanimentFolderCard } from "@/components/AccompanimentFolderCard";
import { BuildMethodHeroAsset } from "@/components/AccompanimentAssets";
import { normalizeProfileTier } from "@/lib/mcpAccess";
import { COFFRE_LABEL, COFFRE_PRICE, FONDATIONS_PRICE, sanitizeStripeCheckoutUrl, STRIPE_FULL_CHECKOUT_LINK, UPGRADE_PRICE, withClientReferenceId } from "@/lib/pricing";

const STRIPE_FULL_URL = STRIPE_FULL_CHECKOUT_LINK;
const STRIPE_BEGINNER_URL = sanitizeStripeCheckoutUrl(process.env.STRIPE_BEGINNER_CHECKOUT_LINK);
const MCP_CONNECTOR_LAUNCHED = process.env.NEXT_PUBLIC_MCP_CONNECTOR_LAUNCHED === "true";
const MCP_CONNECTOR_BETA_VISIBLE = process.env.NEXT_PUBLIC_MCP_CONNECTOR_BETA_VISIBLE === "true";
const MCP_CONNECTOR_VISIBLE = MCP_CONNECTOR_BETA_VISIBLE || MCP_CONNECTOR_LAUNCHED;

const FAQ_ITEMS = [
  {
    question: "C'est un paiement unique ou un abonnement ?",
    answer: "Paiement unique. Aucun abonnement, aucun frais récurrent. Tu payes une fois, l'accès est à vie.",
  },
  {
    question: "Quelle est la différence entre Fondations et LE COFFRE ?",
    answer: `Fondations (${FONDATIONS_PRICE}€) t'aide à partir d'un problème concret et à construire un premier résultat que tu peux proposer. ${COFFRE_LABEL} (${COFFRE_PRICE}€) inclut Fondations et ajoute la méthode complète, les compétences prêtes à l'emploi et le cadre pour répéter ce qui fonctionne.`,
  },
  {
    question: "Je n'ai aucune compétence technique, c'est fait pour moi ?",
    answer: "Oui. Fondations part de zéro et couvre chaque étape concrètement - aucun prérequis technique.",
  },
  {
    question: "Je peux commencer par Fondations puis passer au COFFRE ?",
    answer: `Oui, à tout moment tu peux upgrader vers LE COFFRE en ne payant que le complément (${UPGRADE_PRICE}€).`,
  },
];

/* Bouton CTA principal réutilisable */
function CtaButton({
  href,
  children,
  size = "md",
}: {
  href: string;
  children: React.ReactNode;
  size?: "md" | "lg";
}) {
  const sizeClasses =
    size === "lg"
      ? "rounded-[4px] px-10 py-4 text-base"
      : "rounded-[4px] px-7 py-3.5 text-sm";
  return (
    <a
      href={href}
      className={`inline-flex items-center justify-center gap-2 border border-[#9a7d49] bg-[#c9b48a] font-bold text-[#0a0908] shadow-[0_3px_0_rgba(100,76,36,0.95),0_10px_24px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.5)] transition-[transform,background-color,box-shadow] duration-100 hover:bg-[#e8d5b0] hover:shadow-[0_4px_0_rgba(100,76,36,0.95),0_13px_28px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.55)] active:translate-y-[2px] active:shadow-[0_1px_0_rgba(100,76,36,0.95),0_5px_12px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.45)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e8d5b0] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0e0e0f] ${sizeClasses}`}
    >
      <span className="relative z-10 flex items-center gap-2">
        {children}
        <ArrowRight className={size === "lg" ? "w-5 h-5" : "w-4 h-4"} />
      </span>
    </a>
  );
}

export default async function HomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let currentTier: string | null = null;
  if (user?.id) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("tier")
      .eq("id", user.id)
      .single();
    currentTier = normalizeProfileTier(profile?.tier ?? null);
  }

  const isMember = currentTier === "beginner" || currentTier === "full";

  const beginnerUrl = withClientReferenceId(STRIPE_BEGINNER_URL, user?.id);

  const fullUrl = withClientReferenceId(STRIPE_FULL_URL, user?.id) ?? STRIPE_FULL_URL;

  return (
    <main className="min-h-screen bg-[#0a0908] text-[#f0ede8] flex flex-col relative overflow-hidden">

      {/* Halos ambiants */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[700px] bg-[radial-gradient(ellipse_at_center,rgba(232,213,176,0.07),transparent_65%)] blur-[100px] pointer-events-none" />
      <div className="absolute top-[70vh] right-0 w-[700px] h-[700px] bg-[radial-gradient(ellipse_at_center,rgba(232,213,176,0.025),transparent_70%)] blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[radial-gradient(ellipse_at_center,rgba(180,140,80,0.03),transparent_70%)] blur-[120px] pointer-events-none" />

      {/* ================================================================
          HEADER
      ================================================================ */}
      <header className="flex items-center justify-between px-6 py-6 sm:px-12 sm:py-8 relative z-10">
        <Link href="/" aria-label="Accueil BUILD" className="inline-flex rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e8d5b0] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0e0e0f]">
          <Logo layout="horizontal" />
        </Link>
        {user ? (
          <Link href="/dashboard" className="text-sm text-[#c9b48a] hover:text-[#f0ede8] transition-colors">
            Mon espace
          </Link>
        ) : (
          <Link href="/login" className="text-sm text-[#c9b48a] hover:text-[#f0ede8] transition-colors">
            J&apos;ai déjà un compte
          </Link>
        )}
      </header>

      {/* ================================================================
          HERO - court, deux CTA, preuve immédiate
      ================================================================ */}
      <section className="relative z-10 flex flex-col items-center px-6 pt-14 pb-20 sm:pt-20 sm:pb-24 text-center">
        <p className="text-[11px] font-bold uppercase tracking-[4px] text-[#c9b48a] mb-10">
          BUILD BY ORSAYN
        </p>

        <h1 className="mx-auto mb-6 max-w-5xl text-4xl font-medium leading-[1.02] tracking-[-0.04em] text-[#f0ede8] sm:text-6xl lg:text-7xl">
          Utilise l&apos;IA pour construire une activité que le marché peut payer.
          <br />
          <span className="build-hero-gradient">Pas pour collectionner les outils.</span>
        </h1>

        <p className="text-[#8a8070] text-lg leading-[1.7] max-w-2xl mx-auto mb-10">
          BUILD t&apos;aide à repérer un problème que des personnes paient pour résoudre, à construire une offre autour de ce problème et à la livrer plus vite grâce à l&apos;IA. Tu repars avec des méthodes, des compétences prêtes à l&apos;emploi et un assistant capable de retrouver le bon contenu au bon moment. La formation ne garantit ni clients ni revenus : il faut encore parler au marché, produire, proposer, livrer et apprendre.
        </p>

        {isMember ? (
          <CtaButton href="/dashboard" size="lg">Accéder au système</CtaButton>
        ) : (
          <div className="flex flex-col items-center gap-4">
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <CtaButton href="#pricing" size="lg">Commencer à construire</CtaButton>
              <Link
                href="/login?mode=signup"
                className="inline-flex items-center gap-2 text-sm font-semibold text-[#c9b48a] hover:text-[#f0ede8] border border-[#c9b48a]/25 hover:border-[#c9b48a]/50 rounded-2xl px-7 py-4 transition-colors bg-white/[0.02]"
              >
                <UserPlus className="w-4 h-4" />
                Créer mon compte gratuit
              </Link>
            </div>
            <p className="text-xs text-[#8a8070]">
              194 membres dans BUILD à ce jour · paiement unique · accès à vie
            </p>
            <p className="text-[11px] text-[#6f675a]">
              Repère de communauté, pas une promesse de résultat.
            </p>
          </div>
        )}
      </section>

      <section className="relative z-10 border-t border-white/[0.05] px-6 py-14 sm:py-16">
        <div className="mx-auto max-w-5xl">
          <div className="mx-auto max-w-2xl text-center">
            <p className="mb-4 text-[11px] font-bold uppercase tracking-[3px] text-[#c9b48a]">Ce que tu viens vraiment chercher</p>
            <h2 className="mb-4 text-2xl font-bold leading-tight text-[#f0ede8] sm:text-3xl">Plus de revenus possibles, plus de clarté, moins de travail recommencé.</h2>
            <p className="mx-auto max-w-xl text-base leading-[1.7] text-[#8a8070]">Tu ne viens pas apprendre le nom de quarante outils. Tu viens comprendre quoi vendre, comment le construire et comment utiliser l&apos;IA pour aller plus vite sans perdre la qualité.</p>
          </div>

          <div className="mt-10 grid gap-px overflow-hidden border border-white/[0.08] bg-white/[0.08] md:grid-cols-3">
            <div className="bg-[#11100f] p-6 sm:p-7">
              <p className="mb-4 font-mono text-xs text-[#e8d5b0]/70">01</p>
              <h3 className="mb-3 text-lg font-semibold text-[#f0ede8]">Trouver quoi vendre</h3>
              <p className="text-sm leading-relaxed text-white/60">Partir d&apos;un problème réel, d&apos;un marché accessible et d&apos;une personne qui a une raison de payer maintenant.</p>
            </div>
            <div className="bg-[#11100f] p-6 sm:p-7">
              <p className="mb-4 font-mono text-xs text-[#e8d5b0]/70">02</p>
              <h3 className="mb-3 text-lg font-semibold text-[#f0ede8]">Construire quelque chose de montrable</h3>
              <p className="text-sm leading-relaxed text-white/60">Un site, un audit, un contenu, une automatisation ou un outil métier que tu peux expliquer, proposer et améliorer.</p>
            </div>
            <div className="bg-[#11100f] p-6 sm:p-7">
              <p className="mb-4 font-mono text-xs text-[#e8d5b0]/70">03</p>
              <h3 className="mb-3 text-lg font-semibold text-[#f0ede8]">Livrer sans repartir de zéro</h3>
              <p className="text-sm leading-relaxed text-white/60">Des méthodes et des compétences déjà préparées, puis un assistant qui retrouve le bon contexte au moment où tu en as besoin.</p>
            </div>
          </div>

          <div className="mx-auto mt-8 max-w-3xl border-y border-[#e8d5b0]/20 py-5 text-center text-sm leading-relaxed text-[#c4b89a]">
            Une <strong className="text-[#f0ede8]">compétence prête à l&apos;emploi</strong>, c&apos;est ce que BUILD appelle un skill. Le MCP (<em>Model Context Protocol</em>, un standard de connexion) permet ensuite à un assistant compatible de retrouver les contenus BUILD disponibles dans ton accès et de t&apos;aider à les appliquer à ton projet, avec les permissions prévues.
          </div>
        </div>
      </section>

      {/* ================================================================
          LA MÉTHODE BUILD - en visuel
      ================================================================ */}
      <section className="relative z-10 border-t border-white/[0.05] px-6 py-16 sm:py-20">
        <div className="mx-auto max-w-5xl">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="mb-3 text-2xl font-bold leading-tight text-[#f0ede8] sm:text-3xl">
              L&apos;IA peut devenir rentable lorsqu&apos;elle sert un travail précis.
            </h2>
            <p className="mx-auto mb-12 max-w-xl text-base text-[#8a8070]">
              BUILD t&apos;apprend à partir d&apos;un besoin réel, produire une première preuve, la proposer, puis améliorer ce qui fonctionne jusqu&apos;à pouvoir le refaire avec moins d&apos;effort.
            </p>
          </div>

          <BuildMethodHeroAsset />

          <div className="mx-auto mt-10 grid max-w-4xl gap-8 border-t border-white/[0.08] pt-8 md:grid-cols-2 md:gap-12">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[3px] text-white/35">Sans méthode</p>
              <p className="mt-3 max-w-md text-base leading-7 text-[#8a8070]">
                Tu testes des outils au hasard, tu copies des réponses et tu recommences à chaque projet. Tu apprends peut-être des choses, mais rien ne devient une offre claire que tu peux vendre.
              </p>
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[3px] text-[#e8d5b0]">Avec BUILD</p>
              <p className="mt-3 max-w-md text-base leading-7 text-[#c4b89a]">
                Tu pars d&apos;un problème, d&apos;une offre et d&apos;une preuve. Les méthodes, les compétences déjà préparées et le connecteur de contenu t&apos;aident à construire, vendre et livrer sans tout porter seul.
              </p>
            </div>
          </div>

          <div className="mt-12 text-center">
            <h3 className="mb-6 text-xl font-bold leading-snug text-[#f0ede8] sm:text-2xl">
              La valeur n&apos;est pas dans l&apos;outil.
              <br />
              <span className="build-hero-gradient">Elle est dans le travail que tu peux vendre et refaire.</span>
            </h3>
            {!isMember && <CtaButton href="#pricing">Voir les offres</CtaButton>}
          </div>
        </div>
      </section>

      {/* ================================================================
          PRICING - remonté pour réduire la distance à la conversion
      ================================================================ */}
      <section id="pricing" className="relative z-10 px-6 py-16 sm:py-20 border-t border-white/[0.05]">
        <div className="max-w-xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-[11px] font-bold uppercase tracking-[3px] text-[#c9b48a] mb-5">
              Choisir son point de départ
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#f0ede8] mb-4 leading-tight">
              Le niveau d&apos;aide dont tu as besoin pour travailler vers tes premiers revenus avec l&apos;IA.
            </h2>
            <p className="text-[#8a8070] text-base max-w-md mx-auto leading-[1.7]">
              Fondations t&apos;aide à construire et proposer un premier résultat. {COFFRE_LABEL} ajoute la méthode complète, davantage de compétences prêtes à l&apos;emploi et le cadre pour répéter ce qui fonctionne. Paiement unique, accès à vie. Les résultats dépendent de ton marché, de ton exécution et de tes efforts.
            </p>
          </div>

          {isMember ? (
            <div className="relative overflow-hidden bg-gradient-to-b from-white/[0.05] to-white/[0.02] border border-[#e8d5b0]/20 rounded-2xl p-8 text-center shadow-[0_16px_48px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.06)]">
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#e8d5b0]/25 to-transparent" />
              <p className="text-[#8a8070] text-sm mb-6">Tu as déjà accès à BUILD. Retrouve ton espace.</p>
              <CtaButton href="/dashboard">Mon espace</CtaButton>
            </div>
          ) : (
            <PricingCarousel beginnerUrl={beginnerUrl} fullUrl={fullUrl} />
          )}
        </div>

        {!isMember && MCP_CONNECTOR_VISIBLE ? (
          <div className="max-w-5xl mx-auto">
            <McpConnectorShowcase beta={!MCP_CONNECTOR_LAUNCHED} />
          </div>
        ) : null}

        {!isMember && (
          <>
            <div className="mx-auto mt-12 max-w-3xl border-y border-[#e8d5b0]/15 py-5 text-center text-sm leading-relaxed text-[#c4b89a]">
              Les compétences prêtes à l&apos;emploi sont déjà incluses dans les offres. Tu n&apos;as pas besoin de savoir les configurer avant de commencer.
            </div>
            <div className="max-w-5xl mx-auto">
              <AccompanimentFolderCard />
            </div>
          </>
        )}
      </section>

      {/* ================================================================
          COMPTE GRATUIT - un pied dans le produit
      ================================================================ */}
      {!isMember && (
        <section className="relative z-10 px-6 py-12 sm:py-16 border-t border-white/[0.05]">
          <div className="max-w-xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#f0ede8] mb-4 leading-tight">
              Pas encore décidé ?
              <br />
              <span className="text-[#8a8070] font-normal">Entre d&apos;abord. Regarde de l&apos;intérieur.</span>
            </h2>
            <p className="text-[#8a8070] text-base leading-[1.7] max-w-md mx-auto mb-8">
              Crée ton compte gratuit et découvre comment le système est construit
              avant de sortir la carte.
            </p>
            <Link
              href="/login?mode=signup"
              className="relative overflow-hidden inline-flex items-center justify-center gap-2 bg-white/[0.04] hover:bg-white/[0.07] text-[#e8d5b0] font-bold text-sm px-8 py-4 rounded-xl border border-[#e8d5b0]/25 hover:border-[#e8d5b0]/45 transition-all shadow-[0_8px_24px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.06)]"
            >
              <UserPlus className="w-4 h-4" />
              Créer mon compte gratuit
            </Link>
            <p className="text-xs text-white/25 mt-3">Aucune carte demandée</p>
          </div>
        </section>
      )}

      {/* ================================================================
          FAQ - lever les objections, puis renvoyer au pricing
      ================================================================ */}
      <section className="relative z-10 px-6 py-12 sm:py-16 border-t border-white/[0.05]">
        <div className="max-w-2xl mx-auto">
          <p className="text-[11px] font-bold uppercase tracking-[3px] text-[#c9b48a] mb-7 text-center">
            Questions fréquentes
          </p>
          <div className="flex flex-col gap-3 mb-10">
            {FAQ_ITEMS.map(({ question, answer }) => (
              <div
                key={question}
                className="relative overflow-hidden bg-white/[0.025] border border-white/[0.06] rounded-xl px-5 py-4 shadow-[0_4px_16px_rgba(0,0,0,0.25),inset_0_1px_0_rgba(255,255,255,0.04)]"
              >
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/8 to-transparent" />
                <p className="text-sm font-semibold text-[#f0ede8] mb-1.5">{question}</p>
                <p className="text-sm text-[#8a8070] leading-[1.7]">{answer}</p>
              </div>
            ))}
          </div>
          {!isMember && (
            <div className="text-center">
              <CtaButton href="#pricing">Choisir mon offre</CtaButton>
            </div>
          )}
        </div>
      </section>

      {/* ================================================================
          CTA FINAL
      ================================================================ */}
      <section className="relative z-10 px-6 py-16 sm:py-24 border-t border-white/[0.05] text-center">
        <div className="max-w-xl mx-auto">
          <Logo layout="vertical" className="mx-auto mb-12" />

          <h2 className="text-3xl sm:text-4xl font-bold text-[#f0ede8] mb-5 leading-[1.15]">
            Ne collectionne pas les outils.
            <br />
            <span className="build-hero-gradient">Construis quelque chose que des gens peuvent acheter.</span>
          </h2>

          <p className="text-[#8a8070] text-base leading-[1.75] mb-12">
            BUILD ne promet pas de faire apparaître de l&apos;argent par magie. Il te donne un chemin plus court entre un problème réel, une offre claire, une première livraison et les améliorations qui peuvent rendre cette activité plus rentable.
          </p>

          {isMember ? (
            <CtaButton href="/dashboard" size="lg">Accéder au système</CtaButton>
          ) : (
            <div className="flex flex-col items-center gap-4">
              <CtaButton href="#pricing" size="lg">Commencer à construire</CtaButton>
              <Link
                href="/login?mode=signup"
                className="text-sm text-[#c9b48a]/70 hover:text-[#e8d5b0] transition-colors underline underline-offset-4"
              >
                Ou crée ton compte gratuit pour voir l&apos;intérieur
              </Link>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
