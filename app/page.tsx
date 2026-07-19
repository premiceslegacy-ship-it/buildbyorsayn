import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { ArrowRight, UserPlus } from "lucide-react";
import { LoveWall } from "@/components/LoveWall";
import { EcosystemMap } from "@/components/EcosystemMap";
import { PricingCarousel } from "@/components/PricingCarousel";
import {
  ChatConsumerMock,
  ClaudeCodeMock,
  CodexMock,
  StripeNotifMock,
} from "@/components/HomeAssets";

const STRIPE_FULL_URL = "https://buy.stripe.com/dRm8wQ8JMgSd7taaqc5AQ0a";
const STRIPE_BEGINNER_URL = process.env.STRIPE_BEGINNER_CHECKOUT_LINK ?? "#";

const TWEETS = [
  {
    handle: "@mxthib_",
    name: "Mathieu",
    avatar: "M",
    text: "Je suis passé de savoir faire à montrer que je sais faire. Premières ventes en 2 semaines. BUILD m'a donné les systèmes que j'aurais mis 6 mois à construire seul.",
  },
  {
    handle: "@julienrouze",
    name: "Julien",
    avatar: "J",
    text: "Le framework ORACLE seul vaut 10x le prix. J'ai livré 3 sites en un mois. Mes clients n'ont aucune idée de la vitesse à laquelle je travaille maintenant.",
  },
  {
    handle: "@ines_digital",
    name: "Inès",
    avatar: "I",
    text: "J'avais des skills IA éparpillées partout. BUILD m'a appris à les distiller en systèmes qui tournent sans moi. Premier client récurrent signé 3 semaines après.",
  },
  {
    handle: "@thomasbld",
    name: "Thomas",
    avatar: "T",
    text: "La différence entre avant et après BUILD : avant je posais des questions à l'IA. Après je lui donne du contexte. Le résultat n'a vraiment rien à voir.",
  },
  {
    handle: "@camille_ops",
    name: "Camille",
    avatar: "C",
    text: "Les skills Deep Research et UX/UI Premium m'ont économisé des dizaines d'heures. Je charge le skill, l'IA arrive briefée. C'est une autre époque.",
  },
  {
    handle: "@raphaelwv",
    name: "Raphaël",
    avatar: "R",
    text: "Samuel explique pas comment utiliser l'IA. Il explique comment construire avec. C'est pas la même chose. BUILD m'a redonné le sens du mot posséder.",
  },
  {
    handle: "@mariecld",
    name: "Marie",
    avatar: "M",
    text: "J'avais peur de ne pas être assez technique. Fondations m'a prouvé le contraire. De zéro à un site en ligne en 4 jours. Payé 900 euros. Premier client signé.",
  },
  {
    handle: "@alex_verticals",
    name: "Alex",
    avatar: "A",
    text: "Le concept de capital organique a changé ma manière de voir l'IA. Je construis plus. Je consomme moins. Et ça se voit sur mon compte en banque.",
  },
  {
    handle: "@sophie_bld",
    name: "Sophie",
    avatar: "S",
    text: "Fondations d'abord. Système complet 3 semaines plus tard. La progression est logique. Le contenu est dense mais actionnable. Et ça marche.",
  },
  {
    handle: "@pierrewx",
    name: "Pierre",
    avatar: "P",
    text: "97 euros pour fondations. J'ai facturé 2400 euros avec ce que j'ai appris le premier mois. Le ROI parle pour lui-même. Pas besoin d'en dire plus.",
  },
];

const TAKES = [
  "Ton prompt n'est pas un actif. Ton système l'est.",
  "90% du contenu IA t'apprend à optimiser une pioche en leasing.",
  "Le locataire numérique croit qu'il construit. Il consomme.",
  "La question n'est pas quel outil utiliser. C'est quoi tu construis avec pendant qu'ils sont là.",
];

const FAQ_ITEMS = [
  {
    question: "C'est un paiement unique ou un abonnement ?",
    answer: "Paiement unique. Aucun abonnement, aucun frais récurrent. Tu payes une fois, l'accès est à vie.",
  },
  {
    question: "Quelle est la différence entre Fondations et Système Complet ?",
    answer: "Fondations (97€) t'emmène de zéro à ton premier site en ligne et facturé. Système Complet (497€) inclut Fondations et ajoute la machine business entière : le framework ORACLE, les 7 blocs, les skills encodés, la logique de vente.",
  },
  {
    question: "Je n'ai aucune compétence technique, c'est fait pour moi ?",
    answer: "Oui. Fondations part de zéro et couvre chaque étape concrètement - aucun prérequis technique.",
  },
  {
    question: "Je peux commencer par Fondations puis passer au Système Complet ?",
    answer: "Oui, à tout moment tu peux upgrader vers le Système Complet en ne payant que le complément.",
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
      ? "text-base px-10 py-4 rounded-2xl"
      : "text-sm px-7 py-3.5 rounded-xl";
  return (
    <a
      href={href}
      className={`relative overflow-hidden inline-flex items-center justify-center gap-2 bg-[#c9b48a] hover:bg-[#e8d5b0] text-[#0a0908] font-bold ${sizeClasses} transition-all duration-[80ms] shadow-[0_4px_0_rgba(100,76,36,0.9),0_10px_24px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.45)] hover:shadow-[0_5px_0_rgba(100,76,36,0.9),0_14px_30px_rgba(0,0,0,0.45)] active:translate-y-[3px] active:shadow-[0_1px_0_rgba(100,76,36,0.9)] before:absolute before:inset-x-0 before:top-0 before:h-1/2 before:bg-gradient-to-b before:from-white/30 before:to-transparent before:pointer-events-none`}
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
    currentTier = profile?.tier ?? null;
  }

  const isMember = Boolean(user && currentTier);

  const beginnerUrl = user?.id
    ? `${STRIPE_BEGINNER_URL}${STRIPE_BEGINNER_URL !== "#" ? "?client_reference_id=" + user.id : ""}`
    : STRIPE_BEGINNER_URL;

  const fullUrl = user?.id
    ? `${STRIPE_FULL_URL}?client_reference_id=${user.id}`
    : STRIPE_FULL_URL;

  return (
    <main className="min-h-screen bg-[#0a0908] text-[#f0ede8] flex flex-col relative overflow-hidden font-sans">

      {/* Halos ambiants */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[700px] bg-[radial-gradient(ellipse_at_center,rgba(232,213,176,0.07),transparent_65%)] blur-[100px] pointer-events-none" />
      <div className="absolute top-[70vh] right-0 w-[700px] h-[700px] bg-[radial-gradient(ellipse_at_center,rgba(232,213,176,0.025),transparent_70%)] blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[radial-gradient(ellipse_at_center,rgba(180,140,80,0.03),transparent_70%)] blur-[120px] pointer-events-none" />

      {/* ================================================================
          HEADER
      ================================================================ */}
      <header className="flex items-center justify-between px-6 py-6 sm:px-12 sm:py-8 relative z-10">
        <Logo layout="horizontal" />
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

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-[1.12] text-[#f0ede8] max-w-4xl mx-auto mb-6">
          Arrête d&apos;utiliser l&apos;IA.
          <br />
          <span className="text-[#c9b48a]">Construis avec, et fais-en de l&apos;argent.</span>
        </h1>

        <p className="text-[#8a8070] text-lg leading-[1.7] max-w-lg mx-auto mb-10">
          La méthode et les skills que j&apos;utilise pour construire mes propres
          systèmes IA. Zéro compétence technique requise.
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
              192 membres construisent déjà - Paiement unique, accès à vie
            </p>
          </div>
        )}
      </section>

      {/* ================================================================
          LE PROBLÈME / LA SITUATION DÉSIRÉE - en visuel
      ================================================================ */}
      <section className="relative z-10 px-6 py-16 sm:py-20 border-t border-white/[0.05]">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-[#f0ede8] mb-3 leading-tight">
            La même IA. Deux résultats opposés.
          </h2>
          <p className="text-[#8a8070] text-base text-center max-w-md mx-auto mb-12">
            La différence ne vient pas de l&apos;outil. Elle vient de ce que tu en fais.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-6 mb-12">
            {/* Aujourd'hui */}
            <div className="flex flex-col gap-4">
              <p className="text-[11px] font-bold uppercase tracking-[3px] text-white/35">
                Aujourd&apos;hui
              </p>
              <ChatConsumerMock />
              <p className="text-sm text-[#8a8070] leading-relaxed">
                Tu poses des questions. Tu copies des réponses.
                Dans six mois, rien ne t&apos;appartient.
              </p>
            </div>

            {/* Avec BUILD */}
            <div className="flex flex-col gap-4">
              <p className="text-[11px] font-bold uppercase tracking-[3px] text-[#e8d5b0]">
                Avec BUILD
              </p>
              <ClaudeCodeMock />
              <StripeNotifMock amount="+ 900,00 €" label="Paiement reçu - Site vitrine client" />
              <p className="text-sm text-[#c4b89a] leading-relaxed">
                Tu diriges des systèmes qui livrent. Et qui encaissent.
              </p>
            </div>
          </div>

          {/* Indépendance des modèles */}
          <div className="max-w-2xl mx-auto mb-12">
            <CodexMock />
            <p className="text-sm text-[#8a8070] leading-relaxed text-center mt-4">
              Un skill que tu crées une fois tourne sur n&apos;importe quel modèle.
              Claude, Codex, ce qui existera dans trois ans.
              <span className="text-[#f0ede8] font-semibold"> C&apos;est ça, posséder.</span>
            </p>
          </div>

          {/* Prises de position - scannables */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-12 max-w-2xl mx-auto">
            {TAKES.map((take) => (
              <div
                key={take}
                className="relative overflow-hidden bg-white/[0.025] border border-white/[0.06] rounded-xl px-4 py-4 shadow-[0_4px_16px_rgba(0,0,0,0.25),inset_0_1px_0_rgba(255,255,255,0.04)]"
              >
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/8 to-transparent" />
                <p className="text-sm text-[#c4b89a] leading-snug">&ldquo;{take}&rdquo;</p>
              </div>
            ))}
          </div>

          <div className="text-center">
            <h3 className="text-xl sm:text-2xl font-bold text-[#f0ede8] mb-6 leading-snug">
              L&apos;écart entre les deux, ce n&apos;est pas le talent.
              <br />
              <span className="text-[#c9b48a]">C&apos;est le système.</span>
            </h3>
            {!isMember && <CtaButton href="#pricing">Combler l&apos;écart</CtaButton>}
          </div>
        </div>
      </section>

      {/* ================================================================
          LOVE WALL + CTA immédiat
      ================================================================ */}
      <section className="relative z-10 py-12 overflow-hidden border-t border-white/[0.05]">
        <p className="text-center text-[11px] uppercase tracking-[2.5px] text-[#8a8070] mb-8">
          Ce qu&apos;ils disent de BUILD
        </p>
        <LoveWall tweets={TWEETS} />

        {!isMember && (
          <div className="flex justify-center mt-10">
            <CtaButton href="#pricing">Faire partie de BUILD</CtaButton>
          </div>
        )}
      </section>

      {/* ================================================================
          PRICING - remonté pour réduire la distance à la conversion
      ================================================================ */}
      <section id="pricing" className="relative z-10 px-6 py-20 sm:py-28 border-t border-white/[0.05]">
        <div className="max-w-xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-[11px] font-bold uppercase tracking-[3px] text-[#c9b48a] mb-5">
              Choisir son point d&apos;entrée
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#f0ede8] mb-4 leading-tight">
              Commence maintenant.
            </h2>
            <p className="text-[#8a8070] text-base max-w-md mx-auto leading-[1.7]">
              192 membres construisent déjà. Accès à vie, aucun abonnement, aucune surprise.
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

          {!isMember && (
            <div className="text-center mt-10">
              <p className="text-sm text-white/40 mb-2">
                Tu veux qu&apos;on construise ça ensemble, en direct ?
              </p>
              <Link
                href="/accompagnement"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#e8d5b0]/80 hover:text-[#e8d5b0] underline underline-offset-4 transition-colors"
              >
                Découvrir l&apos;accompagnement 1:1
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* ================================================================
          COMPTE GRATUIT - un pied dans le produit
      ================================================================ */}
      {!isMember && (
        <section className="relative z-10 px-6 py-16 sm:py-20 border-t border-white/[0.05]">
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
          ÉCOSYSTÈME ORSAYN
      ================================================================ */}
      <section className="relative z-10 px-6 py-16 sm:py-20 border-t border-white/[0.05]">
        <div className="max-w-4xl mx-auto">
          <EcosystemMap variant="homepage" tier={currentTier} />
          {!isMember && (
            <div className="flex justify-center mt-10">
              <CtaButton href="#pricing">Rejoindre BUILD</CtaButton>
            </div>
          )}
        </div>
      </section>

      {/* ================================================================
          FAQ - lever les objections, puis renvoyer au pricing
      ================================================================ */}
      <section className="relative z-10 px-6 py-16 sm:py-20 border-t border-white/[0.05]">
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
      <section className="relative z-10 px-6 py-24 sm:py-32 border-t border-white/[0.05] text-center">
        <div className="max-w-xl mx-auto">
          <Logo layout="vertical" className="mx-auto mb-12" />

          <h2 className="text-3xl sm:text-4xl font-bold text-[#f0ede8] mb-5 leading-[1.15]">
            Pendant que les autres louent leur intelligence,
            <br />
            <span className="text-[#c9b48a]">tu vas la distiller.</span>
          </h2>

          <p className="text-[#8a8070] text-base leading-[1.75] mb-12">
            La fenêtre est ouverte. Elle ne le sera pas toujours.
            Ceux qui construisent maintenant posséderont quelque chose
            que les suivants n&apos;auront jamais.
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
