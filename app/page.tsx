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
    answer: "Paiement unique. Pas d'abonnement ni de frais récurrents. L'accès est à vie.",
  },
  {
    question: "Quelle est la différence entre Fondations et LE COFFRE ?",
    answer: `Fondations (${FONDATIONS_PRICE}€) t'aide à construire et proposer un premier résultat. ${COFFRE_LABEL} (${COFFRE_PRICE}€) ajoute la méthode complète pour structurer et répéter.`,
  },
  {
    question: "Je n'ai aucune compétence technique, c'est fait pour moi ?",
    answer: "Oui pour commencer. Tu n'as pas besoin de savoir coder, mais tu dois accepter de choisir un problème, produire et tester.",
  },
  {
    question: "Je peux commencer par Fondations puis passer au COFFRE ?",
    answer: `Oui, à tout moment tu peux upgrader vers LE COFFRE en ne payant que le complément (${UPGRADE_PRICE}€).`,
  },
  {
    question: "BUILD garantit-il des clients ou des revenus ?",
    answer: "Non. BUILD fournit un cadre, des méthodes et des compétences pour construire et proposer. Le marché, la vente, la livraison et ton exécution restent déterminants.",
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
          HERO - reconnaissance de la douleur, CTA unique
      ================================================================ */}
      <section className="relative z-10 flex flex-col items-center px-6 pt-14 pb-20 sm:pt-20 sm:pb-24 text-center">
        <p className="text-[11px] font-bold uppercase tracking-[3px] text-[#c9b48a] mb-8">
          Pour celles et ceux qui veulent faire quelque chose de leurs essais avec l&apos;IA
        </p>

        <h1 className="mx-auto mb-6 max-w-[1000px] text-4xl font-medium leading-[1.04] tracking-[-0.04em] text-[#f0ede8] sm:text-6xl lg:text-7xl">
          Construis avec l&apos;IA des projets
          <br className="hidden sm:block" />
          <span className="build-hero-gradient"> qu&apos;un client peut acheter.</span>
        </h1>

        <p className="text-[#8a8070] text-lg leading-[1.6] max-w-xl mx-auto mb-10">
          Un SaaS, un site web, une automatisation ou un contenu : pars d&apos;un problème réel, construis une première version montrable, puis apprends à la proposer et à la livrer.
        </p>

        {isMember ? (
          <CtaButton href="/dashboard" size="lg">Accéder au système</CtaButton>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <CtaButton href="#pricing" size="lg">Choisir mon point de départ</CtaButton>
            <p className="text-xs text-[#c4b89a]">196 membres dans BUILD au 28 septembre 2026</p>

            <p className="text-[11px] text-[#8a8070]">Paiement unique · accès à vie</p>
            <Link
              href="/login?mode=signup"
              className="mt-2 inline-flex min-h-11 items-center gap-2 rounded-sm px-3 py-2 text-sm font-semibold text-[#c9b48a] underline decoration-[#c9b48a]/35 underline-offset-4 hover:text-[#f0ede8] hover:decoration-[#e8d5b0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e8d5b0] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0e0e0f] transition-colors"
            >
              <UserPlus className="w-4 h-4" />
              Voir l&apos;intérieur gratuitement
            </Link>
          </div>
        )}
      </section>

      <section className="relative z-10 border-t border-white/[0.05] px-6 py-14 sm:py-16">
        <div className="mx-auto max-w-5xl">
          <div className="mx-auto max-w-2xl text-center">
            <p className="mb-4 text-[11px] font-bold uppercase tracking-[3px] text-[#c9b48a]">Le vrai blocage</p>
            <h2 className="mb-4 text-2xl font-bold leading-tight text-[#f0ede8] sm:text-3xl">Une idée de SaaS, de site web ou d&apos;automatisation ne devient pas une offre toute seule.</h2>
            <p className="mx-auto max-w-xl text-base leading-[1.65] text-[#8a8070]">Il faut encore choisir le bon problème, montrer une première réponse crédible et savoir l&apos;expliquer à quelqu&apos;un qui pourrait l&apos;acheter.</p>
          </div>

          <div className="mt-10 grid gap-px overflow-hidden border border-[#e8d5b0]/20 bg-[#e8d5b0]/10 md:grid-cols-3">
            <div className="relative bg-[#11100f] p-6 sm:p-7">
              <div className="relative">
                <div className="mb-8">
                  <p className="font-mono text-xs text-[#e8d5b0]/70">01</p>

                </div>
                <h3 className="mb-3 text-lg font-semibold text-[#f0ede8]">Les outils s&apos;empilent</h3>
                <p className="text-sm leading-relaxed text-white/60">Tu passes d&apos;un SaaS à un autre, d&apos;un prompt à un nouveau modèle, sans savoir quel projet mérite ton temps.</p>
              </div>
            </div>
            <div className="relative bg-[#11100f] p-6 sm:p-7">
              <div className="relative">
                <div className="mb-8">
                  <p className="font-mono text-xs text-[#e8d5b0]/70">02</p>

                </div>
                <h3 className="mb-3 text-lg font-semibold text-[#f0ede8]">Le projet part avant le besoin</h3>
                <p className="text-sm leading-relaxed text-white/60">Tu construis une page, une démo ou une automatisation avant d&apos;avoir clarifié pour qui elle compte et ce qu&apos;elle doit changer.</p>
              </div>
            </div>
            <div className="relative bg-[#11100f] p-6 sm:p-7">
              <div className="relative">
                <div className="mb-8">
                  <p className="font-mono text-xs text-[#e8d5b0]/70">03</p>

                </div>
                <h3 className="mb-3 text-lg font-semibold text-[#f0ede8]">Chaque livraison recommence</h3>
                <p className="text-sm leading-relaxed text-white/60">Le cadrage, les fichiers et les décisions restent dispersés. Le projet suivant repart presque de zéro.</p>
              </div>
            </div>
          </div>

          <div className="mx-auto mt-8 max-w-3xl border-y border-[#e8d5b0]/20 py-5 text-center text-sm leading-relaxed text-[#c4b89a]">
            BUILD te donne un cadre pour cadrer le problème, construire une première preuve et garder ce qui te sert pour la suite. Le jugement, les échanges avec le marché et la livraison restent les tiens.
          </div>
        </div>
      </section>

      {/* ================================================================
          LA MÉTHODE BUILD - en visuel
      ================================================================ */}
      <section className="relative z-10 border-t border-white/[0.05] px-6 py-16 sm:py-20">
        <div className="mx-auto max-w-5xl">
          <div className="mx-auto max-w-2xl text-center">
            <p className="mb-4 text-[11px] font-bold uppercase tracking-[3px] text-[#c9b48a]">Le chemin BUILD</p>
            <h2 className="mb-3 text-2xl font-bold leading-tight text-[#f0ede8] sm:text-3xl">
              Tu pars d&apos;un besoin réel, tu construis une première preuve et tu gardes ce qui fonctionne pour la prochaine livraison.
            </h2>
            <p className="mx-auto mb-12 max-w-xl text-base text-[#8a8070]">Le point de départ n&apos;est pas l&apos;outil choisi, mais le problème que tu veux résoudre.</p>
          </div>

          <BuildMethodHeroAsset />

          <div className="mx-auto mt-10 grid max-w-4xl gap-px overflow-hidden border border-white/[0.08] bg-white/[0.08] md:grid-cols-3">
            <div>
              <div className="h-full bg-[#11100f] p-6">
                <p className="text-[11px] font-bold uppercase tracking-[3px] text-[#c9b48a]">01 · Clarifier</p>
                <p className="mt-3 text-sm leading-relaxed text-[#8a8070]">Choisir un problème réel, une cible et une offre compréhensible.</p>
              </div>
            </div>
            <div>
              <div className="h-full bg-[#11100f] p-6">
                <p className="text-[11px] font-bold uppercase tracking-[3px] text-[#c9b48a]">02 · Construire</p>
                <p className="mt-3 text-sm leading-relaxed text-[#8a8070]">Produire un premier résultat montrable, puis le proposer au marché.</p>
              </div>
            </div>
            <div>
              <div className="h-full bg-[#11100f] p-6">
                <p className="text-[11px] font-bold uppercase tracking-[3px] text-[#c9b48a]">03 · Réutiliser</p>
                <p className="mt-3 text-sm leading-relaxed text-[#8a8070]">Garder le contexte et les méthodes pour améliorer la livraison suivante.</p>
              </div>
            </div>
          </div>

          <div className="mt-12 text-center">
            <p className="mb-6 text-base leading-relaxed text-[#c4b89a]">Les outils changent. Une méthode et un contexte réutilisables restent utiles.</p>
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
              Commencer par le bon niveau
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#f0ede8] mb-4 leading-tight">
              Choisis le niveau d&apos;aide qu&apos;il te faut maintenant.
            </h2>
            <p className="text-[#8a8070] text-base max-w-md mx-auto leading-[1.7]">
              Fondations t&apos;aide à construire et proposer un premier résultat. {COFFRE_LABEL} ajoute la méthode complète pour structurer et répéter. Paiement unique, accès à vie. Les résultats dépendent de ton marché et de ton exécution.
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
          <div className="mx-auto max-w-6xl">
            <McpConnectorShowcase />
          </div>
        ) : null}

        {!isMember && (
          <>
            <div className="mx-auto mt-12 max-w-3xl border-y border-[#e8d5b0]/15 py-5 text-center text-sm leading-relaxed text-[#c4b89a]">
              Les compétences sont déjà préparées. Tu n&apos;as pas besoin de savoir les configurer pour commencer.
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
              Tu veux regarder avant de choisir ?
            </h2>
            <p className="text-[#8a8070] text-base leading-[1.7] max-w-md mx-auto mb-8">
              Crée ton compte gratuit et regarde l&apos;intérieur. Aucune carte demandée.
            </p>
            <Link
              href="/login?mode=signup"
              className="relative overflow-hidden inline-flex items-center justify-center gap-2 bg-white/[0.04] hover:bg-white/[0.07] text-[#e8d5b0] font-bold text-sm px-8 py-4 rounded-xl border border-[#e8d5b0]/25 hover:border-[#e8d5b0]/45 transition-all shadow-[0_8px_24px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.06)]"
            >
              <UserPlus className="w-4 h-4" />
              Voir l&apos;intérieur gratuitement
            </Link>
          </div>
        </section>
      )}

      {/* ================================================================
          FAQ - lever les objections, puis renvoyer au pricing
      ================================================================ */}
      <section className="relative z-10 px-6 py-12 sm:py-16 border-t border-white/[0.05]">
        <div className="max-w-2xl mx-auto">
          <p className="text-[11px] font-bold uppercase tracking-[3px] text-[#c9b48a] mb-7 text-center">
            Avant de choisir
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
            Arrête de collectionner les outils.
            <br />
            <span className="build-hero-gradient">Construis du travail vendable.</span>
          </h2>

          <p className="text-[#8a8070] text-base leading-[1.7] mb-12">Commence par un problème réel, construis une preuve, puis apprends à refaire une livraison utile.</p>

          {isMember ? (
            <CtaButton href="/dashboard" size="lg">Accéder au système</CtaButton>
          ) : (
            <div className="flex flex-col items-center gap-4">
              <CtaButton href="#pricing" size="lg">Choisir mon point de départ</CtaButton>
              <Link
                href="/login?mode=signup"
                className="text-sm text-[#c9b48a]/70 hover:text-[#e8d5b0] transition-colors underline underline-offset-4"
              >
                Ou voir l&apos;intérieur gratuitement
              </Link>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
