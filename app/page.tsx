import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { ArrowRight, Check, Lock, Zap, GraduationCap, Layers, Play } from "lucide-react";
import { LoveWall } from "@/components/LoveWall";
import { EcosystemMap } from "@/components/EcosystemMap";

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

const FONDATIONS_ITEMS = [
  { label: "De zéro à un site en ligne - les vraies étapes", icon: GraduationCap },
  { label: "L'environnement IA complet (LLM, tokens, contexte)", icon: Zap },
  { label: "Générer des visuels pro sans designer ni budget", icon: Layers },
  { label: "GitHub + Vercel : déployer en 60 secondes", icon: GraduationCap },
  { label: "Skills Deep Research + UX/UI Premium inclus", icon: Zap },
  { label: "Le Protocole Zéro : de locataire à antifragile", icon: Check },
  { label: "Vidéos tutos techniques (outils, configs, méthodes)", icon: Play },
];

const SYSTEME_ITEMS = [
  { label: "Framework ORACLE : construire avec l'IA comme un pro", icon: Zap },
  { label: "7 blocs de système actionnables et directs", icon: Layers },
  { label: "Skills encodés prêts à copier-coller", icon: GraduationCap },
  { label: "Logique business : choisir une niche, vendre d'abord", icon: Zap },
  { label: "Identité visuelle forte : le système que j'utilise", icon: Layers },
  { label: "Sources et ressources exclusives", icon: GraduationCap },
  { label: "Vidéos tutos techniques (outils, configs, méthodes)", icon: Play },
  { label: "Fondations incluses", icon: Check },
];

const FAQ_ITEMS = [
  {
    question: "C'est un paiement unique ou un abonnement ?",
    answer: "Paiement unique. Aucun abonnement, aucun frais récurrent. Tu payes une fois, l'accès est à vie.",
  },
  {
    question: "Quelle est la différence entre Fondations et Système Complet ?",
    answer: "Fondations (97€) t'emmène de zéro à ton premier site en ligne : environnement IA, visuels, déploiement, Protocole Zéro. Système Complet (497€) inclut Fondations et ajoute les 7 blocs du framework ORACLE, les skills encodés, et la logique business complète.",
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
          HERO
      ================================================================ */}
      <section className="relative z-10 flex flex-col items-center px-6 pt-14 pb-24 sm:pt-20 sm:pb-32 text-center">
        <p className="text-[11px] font-bold uppercase tracking-[4px] text-[#c9b48a] mb-10">
          BUILD BY ORSAYN
        </p>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-[1.12] text-[#f0ede8] max-w-4xl mx-auto mb-6">
          Passe de locataire numérique
          <br />
          <span className="text-[#c9b48a]">à propriétaire de ton infrastructure IA.</span>
        </h1>

        <p className="text-[#8a8070] text-lg leading-[1.75] max-w-xl mx-auto mb-12">
          Passe de « je pose des questions à l&apos;IA » à « je construis des systèmes qui génèrent
          de l&apos;argent » - grâce à la méthode, les frameworks et les skills que j&apos;utilise
          pour construire mes propres lignes verticales IA. Zéro compétence technique requise.
        </p>

        {user && currentTier ? (
          <Link
            href="/dashboard"
            className="relative overflow-hidden inline-flex items-center justify-center gap-2 bg-[#c9b48a] hover:bg-[#e8d5b0] text-[#0a0908] font-bold text-base px-10 py-4 rounded-2xl transition-all duration-[80ms] shadow-[0_5px_0_rgba(100,76,36,0.9),0_12px_28px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.45)] hover:shadow-[0_6px_0_rgba(100,76,36,0.9),0_16px_34px_rgba(0,0,0,0.45)] active:translate-y-[4px] active:shadow-[0_1px_0_rgba(100,76,36,0.9),0_4px_12px_rgba(0,0,0,0.3)] before:absolute before:inset-x-0 before:top-0 before:h-1/2 before:bg-gradient-to-b before:from-white/30 before:to-transparent before:pointer-events-none"
          >
            <span className="relative z-10 flex items-center gap-2">Accéder au système <ArrowRight className="w-5 h-5" /></span>
          </Link>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <a
              href="#pricing"
              className="relative overflow-hidden inline-flex items-center justify-center gap-2 bg-[#c9b48a] hover:bg-[#e8d5b0] text-[#0a0908] font-bold text-base px-10 py-4 rounded-2xl transition-all duration-[80ms] shadow-[0_5px_0_rgba(100,76,36,0.9),0_12px_28px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.45)] hover:shadow-[0_6px_0_rgba(100,76,36,0.9),0_16px_34px_rgba(0,0,0,0.45)] active:translate-y-[4px] active:shadow-[0_1px_0_rgba(100,76,36,0.9),0_4px_12px_rgba(0,0,0,0.3)] before:absolute before:inset-x-0 before:top-0 before:h-1/2 before:bg-gradient-to-b before:from-white/30 before:to-transparent before:pointer-events-none"
            >
              <span className="relative z-10 flex items-center gap-2">Commencer à construire <ArrowRight className="w-5 h-5" /></span>
            </a>
            <p className="text-xs text-[#8a8070]">Accès à vie - Paiement sécurisé via Stripe</p>
          </div>
        )}
      </section>

      {/* ================================================================
          LOVE WALL - défilement animé
      ================================================================ */}
      <section className="relative z-10 py-8 overflow-hidden">
        <p className="text-center text-[11px] uppercase tracking-[2.5px] text-[#8a8070] mb-8">
          Ce qu&apos;ils disent de BUILD
        </p>
        <LoveWall tweets={TWEETS} />

        {!(user && currentTier) && (
          <div className="flex justify-center mt-10">
            <a
              href="#pricing"
              className="relative overflow-hidden inline-flex items-center gap-2 text-sm font-bold text-[#0a0908] bg-[#c9b48a] hover:bg-[#e8d5b0] px-7 py-3.5 rounded-xl transition-all duration-[80ms] shadow-[0_3px_0_rgba(100,76,36,0.9),0_6px_16px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.4)] active:translate-y-[2px] active:shadow-[0_1px_0_rgba(100,76,36,0.9)] before:absolute before:inset-x-0 before:top-0 before:h-1/2 before:bg-gradient-to-b before:from-white/25 before:to-transparent before:pointer-events-none"
            >
              <span className="relative z-10 flex items-center gap-2">
                Faire partie de BUILD
                <ArrowRight className="w-4 h-4" />
              </span>
            </a>
          </div>
        )}
      </section>

      {/* ================================================================
          ÉCOSYSTÈME ORSAYN — juste après la social proof
      ================================================================ */}
      <section className="relative z-10 px-6 py-16 sm:py-20 border-t border-white/[0.05]">
        <div className="max-w-4xl mx-auto">
          <EcosystemMap variant="homepage" tier={currentTier} />
        </div>
      </section>

      {/* ================================================================
          MANIFESTE - Storytelling + mécanisme unique
      ================================================================ */}
      <section className="relative z-10 px-6 py-28 sm:py-36">
        <div className="max-w-2xl mx-auto">

          {/* Acte 1 - La douleur */}
          <div className="mb-20">
            <p className="text-[11px] font-bold uppercase tracking-[3px] text-[#c9b48a] mb-7">
              Le problème
            </p>
            <h2 className="text-2xl sm:text-3xl lg:text-[38px] font-bold leading-[1.15] text-[#f0ede8] mb-8">
              Tu utilises l&apos;IA depuis des mois.
              <br />
              Et tu n&apos;as toujours rien à toi.
            </h2>
            <div className="flex flex-col gap-5 text-[#8a8070] text-base sm:text-[17px] leading-[1.8]">
              <p>
                Tu ouvres Claude ou ChatGPT chaque matin. Tu poses une question,
                tu copies la réponse, tu fermes l&apos;onglet.
                Tu as l&apos;impression de travailler. Tu as en réalité loué
                de l&apos;intelligence pendant dix minutes.
              </p>
              <p>
                Demain tu recommences. Dans six mois tu es exactement au même endroit.
                Pas parce que t&apos;es mauvais. Parce que
                <span className="text-[#f0ede8] font-semibold"> utiliser l&apos;IA et construire avec l&apos;IA,
                c&apos;est deux jeux complètement différents.</span>
              </p>
              <p>
                L&apos;un te laisse locataire numérique.
                L&apos;autre te rend propriétaire de ce que tu produis.
              </p>
            </div>
          </div>

          {/* Acte 2 - La fenêtre asymétrique */}
          <div className="mb-20 relative">
            {/* Barre latérale skeuomorphique */}
            <div className="absolute -left-1 top-0 bottom-0 w-[3px] rounded-full bg-gradient-to-b from-[#c9b48a] via-[#e8d5b0] to-[#c9b48a] shadow-[0_0_8px_rgba(232,213,176,0.3)]" />
            <div className="pl-7">
              <p className="text-[11px] font-bold uppercase tracking-[3px] text-[#c9b48a] mb-7">
                La fenêtre
              </p>
              <h3 className="text-2xl sm:text-3xl font-bold leading-[1.2] text-[#f0ede8] mb-8">
                On est dans une période asymétrique.
                <br />
                Elle ne durera pas.
              </h3>
              <div className="flex flex-col gap-5 text-[#8a8070] text-base sm:text-[17px] leading-[1.8]">
                <p>
                  Les modèles les plus puissants de l&apos;histoire sont disponibles,
                  bon marché, accessibles à n&apos;importe qui avec une connexion internet.
                  C&apos;est sans précédent. Et ça va changer - ça change déjà.
                </p>

                {/* Exemple concret US */}
                <div className="relative overflow-hidden bg-white/[0.03] border border-white/[0.07] rounded-2xl p-5 my-2 shadow-[0_8px_32px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.05)]">
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                  <p className="text-sm text-[#c4b89a] leading-relaxed">
                    <span className="font-semibold text-[#e8d5b0]">Exemple concret.</span>{" "}
                    Les États-Unis viennent de restreindre l&apos;accès à Claude Mythos et Fable 5
                    pour plusieurs pays. Du jour au lendemain. Sans préavis.
                    Les modèles chinois deviennent de plus en plus performants,
                    et la guerre technologique redessinera les règles d&apos;accès
                    encore et encore dans les prochaines années.
                  </p>
                </div>

                <p>
                  Si ton business repose sur un accès à un modèle précis, tu es fragile.
                  Le but, c&apos;est que tu sois capable d&apos;opérer avec
                  <span className="text-[#f0ede8] font-semibold"> n&apos;importe quel modèle</span>,
                  de ne dépendre de rien, et d&apos;être la personne
                  qui <span className="text-[#f0ede8] font-semibold">dirige l&apos;IA avec compétence</span> -
                  pas celle qui subit ses décisions.
                </p>
                <p>
                  Ceux qui utilisent cette fenêtre pour construire du capital organique
                  sortiront indépendants. Ceux qui l&apos;utilisent pour louer
                  de l&apos;intelligence sortiront dépendants.
                </p>
              </div>
            </div>
          </div>

          {/* Acte 3 - Le mécanisme unique */}
          <div className="mb-16">
            <p className="text-[11px] font-bold uppercase tracking-[3px] text-[#c9b48a] mb-7">
              Le mécanisme unique
            </p>
            <h3 className="text-2xl sm:text-3xl font-bold leading-[1.2] text-[#f0ede8] mb-8">
              La distillation.
              <br />
              <span className="text-[#8a8070] font-normal">Pas utiliser l&apos;IA. Se distiller dedans.</span>
            </h3>
            <div className="flex flex-col gap-5 text-[#8a8070] text-base sm:text-[17px] leading-[1.8]">
              <p>
                Distiller, c&apos;est encoder ce que tu sais faire - ton expertise, tes process,
                tes systèmes, ta façon de penser - dans une infrastructure IA que tu possèdes vraiment.
                Un skill que tu crées une fois tourne sur n&apos;importe quel modèle.
                Claude, open source, ce qui existera dans trois ans. Parce que ce qui est distillé
                t&apos;appartient. La pioche change, toi tu restes.
              </p>
              <p>
                C&apos;est la différence entre apprendre à conduire une voiture de location
                et construire ta propre voiture. La voiture de location disparaît.
                La tienne reste.
              </p>
            </div>
          </div>

          {/* Prises de position */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-12">
            {[
              "Ton prompt n'est pas un actif. Ton système l'est.",
              "90% du contenu IA t'apprend à optimiser une pioche en leasing.",
              "Le locataire numérique croit qu'il construit. Il consomme.",
              "La vraie question n'est pas quel outil utiliser. C'est quoi tu construis avec pendant qu'ils sont là.",
            ].map((take) => (
              <div
                key={take}
                className="relative overflow-hidden bg-white/[0.025] border border-white/[0.06] rounded-xl px-4 py-4 shadow-[0_4px_16px_rgba(0,0,0,0.25),inset_0_1px_0_rgba(255,255,255,0.04)]"
              >
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/8 to-transparent" />
                <p className="text-sm text-[#c4b89a] leading-snug">&ldquo;{take}&rdquo;</p>
              </div>
            ))}
          </div>

          {!(user && currentTier) && (
            <a
              href="#pricing"
              className="relative overflow-hidden inline-flex items-center gap-2 text-sm font-bold text-[#0a0908] bg-[#c9b48a] hover:bg-[#e8d5b0] px-7 py-3.5 rounded-xl transition-all duration-[80ms] shadow-[0_3px_0_rgba(100,76,36,0.9),0_6px_16px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.4)] active:translate-y-[2px] active:shadow-[0_1px_0_rgba(100,76,36,0.9)] before:absolute before:inset-x-0 before:top-0 before:h-1/2 before:bg-gradient-to-b before:from-white/25 before:to-transparent before:pointer-events-none"
            >
              <span className="relative z-10 flex items-center gap-2">
                Arrêter de louer, commencer à posséder
                <ArrowRight className="w-4 h-4" />
              </span>
            </a>
          )}
        </div>
      </section>

      {/* ================================================================
          BLOC 0 GRATUIT - Aperçu + vidéo
      ================================================================ */}
      <section className="relative z-10 px-6 py-20 sm:py-24 border-t border-white/[0.05]">
        <div className="max-w-2xl mx-auto">

          <div className="flex items-center gap-3 mb-8">
            <div className="inline-flex items-center gap-2 bg-[#e8d5b0]/10 border border-[#e8d5b0]/20 rounded-full px-4 py-1.5 shadow-[0_2px_8px_rgba(232,213,176,0.08),inset_0_1px_0_rgba(255,255,255,0.08)]">
              <Play className="w-3.5 h-3.5 text-[#e8d5b0]" />
              <span className="text-xs font-bold text-[#e8d5b0] uppercase tracking-wider">Gratuit - Bloc 1</span>
            </div>
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold text-[#f0ede8] mb-4 leading-tight">
            Regarde comment le système fonctionne.
            <br />
            <span className="text-[#8a8070] font-normal">Avant d&apos;acheter quoi que ce soit.</span>
          </h2>
          <p className="text-[#8a8070] text-base leading-[1.75] mb-8">
            Ce premier bloc est offert. Il couvre la logique du système entier :
            pourquoi le marché IA fabrique des locataires numériques, ce que la distillation
            change concrètement, et comment le capital organique se construit.
            Si après ça tu ne comprends pas pourquoi BUILD est différent,
            c&apos;est que ce n&apos;est pas fait pour toi.
          </p>

          {/* Vidéo embed */}
          <div className="relative rounded-2xl overflow-hidden border border-white/[0.08] shadow-[0_20px_60px_rgba(0,0,0,0.55),0_0_0_1px_rgba(255,255,255,0.03),inset_0_1px_0_rgba(255,255,255,0.06)] mb-8 bg-black">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent z-10" />
            <div className="aspect-video">
              <iframe
                src="https://www.youtube-nocookie.com/embed/uhp4L3y_Jco"
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title="BUILD - Bloc 1 : La logique du système"
              />
            </div>
          </div>

          {/* CTA vers pricing après la vidéo */}
          {!(user && currentTier) && (
            <div className="relative overflow-hidden bg-gradient-to-b from-white/[0.04] to-white/[0.02] border border-[#e8d5b0]/15 rounded-2xl p-6 shadow-[0_8px_32px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.05)]">
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#e8d5b0]/20 to-transparent" />
              <p className="text-sm text-[#c4b89a] leading-relaxed mb-4">
                Ce que tu viens de voir, c&apos;est 1 bloc sur 7 dans le système complet.
                Les fondations couvrent en plus : l&apos;environnement IA, les visuels pro,
                GitHub, Vercel, et les deux premiers skills encodés.
              </p>
              <a
                href="#pricing"
                className="relative overflow-hidden inline-flex items-center gap-2 text-sm font-bold text-[#0a0908] bg-[#c9b48a] hover:bg-[#e8d5b0] px-6 py-3 rounded-xl transition-all duration-[80ms] shadow-[0_3px_0_rgba(100,76,36,0.9),0_6px_16px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.4)] active:translate-y-[2px] active:shadow-[0_1px_0_rgba(100,76,36,0.9)] before:absolute before:inset-x-0 before:top-0 before:h-1/2 before:bg-gradient-to-b before:from-white/25 before:to-transparent before:pointer-events-none"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Accéder à BUILD
                  <ArrowRight className="w-4 h-4" />
                </span>
              </a>
            </div>
          )}
        </div>
      </section>

      {/* ================================================================
          TEASER FONDATIONS
      ================================================================ */}
      <section className="relative z-10 px-6 py-20 sm:py-24 border-t border-white/[0.05]">
        <div className="max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-[#e8d5b0]/10 border border-[#e8d5b0]/20 rounded-full px-4 py-1.5 mb-8 shadow-[0_2px_8px_rgba(232,213,176,0.08),inset_0_1px_0_rgba(255,255,255,0.08)]">
            <GraduationCap className="w-3.5 h-3.5 text-[#e8d5b0]" strokeWidth={1.5} />
            <span className="text-xs font-bold text-[#e8d5b0] uppercase tracking-wider">Fondations - 97 €</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold text-[#f0ede8] mb-4 leading-tight">
            De zéro à ton premier client.
            <br />
            <span className="text-[#8a8070] font-normal">Sans avoir jamais touché à du code avant.</span>
          </h2>

          <p className="text-[#8a8070] text-base leading-[1.75] mb-3">
            La plupart des gens passent des mois à regarder des tutoriels sans jamais rien livrer.
            Fondations, c&apos;est cinq modules qui te font passer du côté de ceux qui font vraiment.
          </p>
          <p className="text-[#8a8070] text-base leading-[1.75] mb-10">
            À la fin, tu comprends l&apos;environnement IA pour de vrai - pas les buzzwords,
            la mécanique. Tu sais déployer. Tu sais livrer. Tu sais facturer.
          </p>

          <ul className="flex flex-col gap-3 mb-10">
            {FONDATIONS_ITEMS.map(({ label, icon: Icon }) => (
              <li key={label} className="flex items-center gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-xl bg-gradient-to-b from-[#e8d5b0]/15 to-[#e8d5b0]/8 border border-[#e8d5b0]/20 flex items-center justify-center shadow-[0_2px_8px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.1)]">
                  <Icon className="w-3.5 h-3.5 text-[#e8d5b0]" strokeWidth={1.5} />
                </div>
                <span className="text-sm text-[rgba(240,237,232,0.75)]">{label}</span>
              </li>
            ))}
            <li className="flex items-center gap-3 opacity-30">
              <div className="flex-shrink-0 w-8 h-8 rounded-xl bg-white/5 border border-white/8 flex items-center justify-center">
                <Lock className="w-3.5 h-3.5 text-white/30" strokeWidth={1.5} />
              </div>
              <span className="text-sm text-white/40">7 blocs système - Framework ORACLE (non inclus)</span>
            </li>
          </ul>

          <div className="relative overflow-hidden bg-gradient-to-b from-[#1a1510] to-[#141008] border border-[#c9b48a]/15 rounded-2xl p-5 shadow-[0_8px_32px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.04)]">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#c9b48a]/20 to-transparent" />
            <p className="text-sm text-[#c4b89a] italic leading-relaxed">
              &ldquo;J&apos;avais peur de ne pas être assez technique. Fondations m&apos;a prouvé le contraire.
              De zéro à un site en ligne en 4 jours. Payé 900 euros. Premier client.&rdquo;
            </p>
            <p className="text-xs text-[#8a8070] mt-2.5">Marie - Membre BUILD</p>
          </div>

          {!(user && currentTier) && (
            <div className="mt-8">
              <a
                href={beginnerUrl}
                className="relative overflow-hidden inline-flex items-center gap-2 text-sm font-bold text-[#0a0908] bg-[#c9b48a] hover:bg-[#e8d5b0] px-7 py-3.5 rounded-xl transition-all duration-[80ms] shadow-[0_3px_0_rgba(100,76,36,0.9),0_6px_16px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.4)] active:translate-y-[2px] active:shadow-[0_1px_0_rgba(100,76,36,0.9)] before:absolute before:inset-x-0 before:top-0 before:h-1/2 before:bg-gradient-to-b before:from-white/25 before:to-transparent before:pointer-events-none"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Démarrer avec Fondations - 97€
                  <ArrowRight className="w-4 h-4" />
                </span>
              </a>
              <p className="text-xs text-[#8a8070] mt-3">Accès à vie - paiement unique</p>
            </div>
          )}
        </div>
      </section>

      {/* ================================================================
          TEASER SYSTÈME COMPLET
      ================================================================ */}
      <section className="relative z-10 px-6 py-20 sm:py-24 border-t border-white/[0.05]">
        <div className="max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-[#e8d5b0]/10 border border-[#e8d5b0]/20 rounded-full px-4 py-1.5 mb-8 shadow-[0_2px_8px_rgba(232,213,176,0.08),inset_0_1px_0_rgba(255,255,255,0.08)]">
            <Zap className="w-3.5 h-3.5 text-[#e8d5b0]" strokeWidth={1.5} />
            <span className="text-xs font-bold text-[#e8d5b0] uppercase tracking-wider">Système Complet - 497 €</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold text-[#f0ede8] mb-4 leading-tight">
            Distille ton expertise.
            <br />
            Construis ce que personne ne peut te retirer.
            <br />
            <span className="text-[#8a8070] font-normal">C&apos;est ça, le capital organique.</span>
          </h2>

          <p className="text-[#8a8070] text-base leading-[1.75] mb-3">
            Le système complet, c&apos;est ce que j&apos;utilise pour construire Orsayn.
            Pas une formation. Pas des slides. Des assets copiables, des frameworks opérationnels,
            des skills encodés que tu charges dans ton environnement et qui tournent immédiatement.
          </p>
          <p className="text-[#8a8070] text-base leading-[1.75] mb-10">
            Le framework ORACLE seul change ta relation avec l&apos;IA pour toujours.
            Au lieu de poser des questions, tu donnes du contexte. Au lieu de copier des réponses,
            tu construis des systèmes. C&apos;est l&apos;écart entre ceux qui utilisent et ceux qui possèdent.
          </p>

          <ul className="flex flex-col gap-3 mb-10">
            {SYSTEME_ITEMS.map(({ label, icon: Icon }) => (
              <li key={label} className="flex items-center gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-xl bg-gradient-to-b from-[#e8d5b0]/15 to-[#e8d5b0]/8 border border-[#e8d5b0]/20 flex items-center justify-center shadow-[0_2px_8px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.1)]">
                  <Icon className="w-3.5 h-3.5 text-[#e8d5b0]" strokeWidth={1.5} />
                </div>
                <span className="text-sm text-[rgba(240,237,232,0.75)]">{label}</span>
              </li>
            ))}
          </ul>

          <div className="relative overflow-hidden bg-gradient-to-b from-[#1a1510] to-[#141008] border border-[#c9b48a]/15 rounded-2xl p-5 shadow-[0_8px_32px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.04)]">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#c9b48a]/20 to-transparent" />
            <p className="text-sm text-[#c4b89a] italic leading-relaxed">
              &ldquo;Le framework ORACLE seul vaut 10x le prix.
              J&apos;ai livré 3 sites en un mois avec.
              Mes clients n&apos;ont aucune idée de la vitesse à laquelle je travaille maintenant.&rdquo;
            </p>
            <p className="text-xs text-[#8a8070] mt-2.5">Julien - Membre BUILD</p>
          </div>

          {!(user && currentTier) && (
            <div className="mt-8">
              <a
                href={fullUrl}
                className="relative overflow-hidden inline-flex items-center gap-2 text-sm font-bold text-[#0a0908] bg-[#e8d5b0] hover:bg-[#f0dfc0] px-7 py-3.5 rounded-xl transition-all duration-[80ms] shadow-[0_3px_0_rgba(100,76,36,0.9),0_6px_20px_rgba(0,0,0,0.35),0_0_24px_rgba(232,213,176,0.15),inset_0_1px_0_rgba(255,255,255,0.5)] hover:shadow-[0_4px_0_rgba(100,76,36,0.9),0_8px_24px_rgba(0,0,0,0.4),0_0_32px_rgba(232,213,176,0.2)] active:translate-y-[2px] active:shadow-[0_1px_0_rgba(100,76,36,0.9)] before:absolute before:inset-x-0 before:top-0 before:h-1/2 before:bg-gradient-to-b before:from-white/30 before:to-transparent before:pointer-events-none"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Prendre le système complet - 497€
                  <ArrowRight className="w-4 h-4" />
                </span>
              </a>
              <p className="text-xs text-[#8a8070] mt-3">Accès à vie - paiement unique</p>
            </div>
          )}
        </div>
      </section>

      {/* ================================================================
          FAQ - Lever les objections avant le pricing
      ================================================================ */}
      <section className="relative z-10 px-6 py-20 sm:py-24 border-t border-white/[0.05]">
        <div className="max-w-2xl mx-auto">
          <p className="text-[11px] font-bold uppercase tracking-[3px] text-[#c9b48a] mb-7 text-center">
            Questions fréquentes
          </p>
          <div className="flex flex-col gap-3">
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
        </div>
      </section>

      {/* ================================================================
          PRICING - Payer directement ici
      ================================================================ */}
      <section id="pricing" className="relative z-10 px-6 py-28 sm:py-36 border-t border-white/[0.05]">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-[11px] font-bold uppercase tracking-[3px] text-[#c9b48a] mb-5">
              Choisir son point d&apos;entrée
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#f0ede8] mb-4 leading-tight">
              Commence maintenant.
              <br />
              <span className="text-[#8a8070] font-normal">Le compte vient après le paiement.</span>
            </h2>
            <p className="text-[#8a8070] text-base max-w-md mx-auto leading-[1.7]">
              Accès à vie. Aucun abonnement. Aucune surprise.
            </p>
          </div>

          {user && currentTier ? (
            <div className="relative overflow-hidden bg-gradient-to-b from-white/[0.05] to-white/[0.02] border border-[#e8d5b0]/20 rounded-2xl p-8 text-center shadow-[0_16px_48px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.06)]">
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#e8d5b0]/25 to-transparent" />
              <p className="text-[#8a8070] text-sm mb-6">Tu as déjà accès à BUILD. Retrouve ton espace.</p>
              <Link
                href="/dashboard"
                className="relative overflow-hidden inline-flex items-center gap-2 bg-[#c9b48a] hover:bg-[#e8d5b0] text-[#0a0908] font-bold text-sm px-8 py-4 rounded-xl transition-all duration-[80ms] shadow-[0_4px_0_rgba(100,76,36,0.9),0_8px_20px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.45)] active:translate-y-[3px] active:shadow-[0_1px_0_rgba(100,76,36,0.9)] before:absolute before:inset-x-0 before:top-0 before:h-1/2 before:bg-gradient-to-b before:from-white/30 before:to-transparent before:pointer-events-none"
              >
                <span className="relative z-10 flex items-center gap-2">Mon espace <ArrowRight className="w-4 h-4" /></span>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              {/* Fondations */}
              <div className="relative overflow-hidden bg-gradient-to-b from-white/[0.04] to-white/[0.01] border border-white/[0.09] rounded-2xl p-6 flex flex-col shadow-[0_16px_48px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.06)]">
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

                <div className="mb-6">
                  <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#e8d5b0] bg-[#e8d5b0]/10 border border-[#e8d5b0]/20 rounded-full px-3 py-1 mb-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
                    <GraduationCap className="w-3 h-3" /> Fondations
                  </div>
                  <div className="flex items-baseline gap-1.5 mb-1">
                    <span className="text-4xl font-bold text-[#f0ede8]">97</span>
                    <span className="text-xl font-bold text-[#f0ede8]">€</span>
                    <span className="text-white/35 text-sm ml-1">TTC</span>
                  </div>
                  <span className="text-white/35 text-xs">Accès à vie - paiement unique</span>
                </div>

                <ul className="flex flex-col gap-2.5 mb-6 flex-1">
                  {FONDATIONS_ITEMS.map(({ label, icon: Icon }) => (
                    <li key={label} className="flex items-center gap-2.5">
                      <Icon className="w-3.5 h-3.5 text-[#e8d5b0] flex-shrink-0" strokeWidth={1.5} />
                      <span className="text-xs text-[rgba(240,237,232,0.65)]">{label}</span>
                    </li>
                  ))}
                  <li className="flex items-center gap-2.5 opacity-28 mt-1">
                    <Lock className="w-3.5 h-3.5 text-white/30 flex-shrink-0" strokeWidth={1.5} />
                    <span className="text-xs text-white/40">7 blocs système (non inclus)</span>
                  </li>
                </ul>

                <a
                  href={beginnerUrl}
                  className="relative overflow-hidden group flex items-center justify-center gap-2 w-full py-3.5 px-5 rounded-xl font-bold text-[#0a0908] bg-[#e8d5b0]/80 hover:bg-[#e8d5b0] transition-all duration-[80ms] text-sm shadow-[0_3px_0_rgba(100,76,36,0.85),0_6px_16px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.4)] active:translate-y-[2px] active:shadow-[0_1px_0_rgba(100,76,36,0.85)] before:absolute before:inset-x-0 before:top-0 before:h-1/2 before:bg-gradient-to-b before:from-white/25 before:to-transparent before:pointer-events-none"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Commencer pour 97€
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform duration-150" />
                  </span>
                </a>
                <p className="text-center text-xs text-white/20 mt-3">
                  Accès à vie - paiement unique
                </p>
              </div>

              {/* Système Complet */}
              <div className="relative bg-gradient-to-b from-white/[0.05] to-white/[0.02] border border-[#e8d5b0]/25 rounded-2xl p-6 pt-9 flex flex-col shadow-[0_16px_48px_rgba(0,0,0,0.4),0_0_0_1px_rgba(232,213,176,0.05),inset_0_1px_0_rgba(255,255,255,0.08)]">
                <div className="absolute inset-x-0 top-0 h-px rounded-t-2xl bg-gradient-to-r from-transparent via-[#e8d5b0]/30 to-transparent pointer-events-none" />

                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="relative overflow-hidden inline-flex text-xs font-bold text-[#0a0908] bg-[#e8d5b0] rounded-full px-4 py-1.5 shadow-[0_2px_0_rgba(100,76,36,0.8),0_4px_12px_rgba(232,213,176,0.25),inset_0_1px_0_rgba(255,255,255,0.5)] before:absolute before:inset-x-0 before:top-0 before:h-1/2 before:bg-gradient-to-b before:from-white/30 before:to-transparent before:pointer-events-none whitespace-nowrap">
                    <span className="relative z-10">Recommandé</span>
                  </span>
                </div>

                <div className="mb-6">
                  <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#e8d5b0] bg-[#e8d5b0]/10 border border-[#e8d5b0]/20 rounded-full px-3 py-1 mb-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
                    <Zap className="w-3 h-3" /> Système Complet
                  </div>
                  <div className="flex items-baseline gap-1.5 mb-1">
                    <span className="text-4xl font-bold text-[#f0ede8]">497</span>
                    <span className="text-xl font-bold text-[#f0ede8]">€</span>
                    <span className="text-white/35 text-sm ml-1">TTC</span>
                  </div>
                  <span className="text-white/35 text-xs">Accès à vie - paiement unique</span>
                </div>

                <ul className="flex flex-col gap-2.5 mb-6 flex-1">
                  {SYSTEME_ITEMS.map(({ label, icon: Icon }) => (
                    <li key={label} className="flex items-center gap-2.5">
                      <Icon className="w-3.5 h-3.5 text-[#e8d5b0] flex-shrink-0" strokeWidth={1.5} />
                      <span className="text-xs text-[rgba(240,237,232,0.65)]">{label}</span>
                    </li>
                  ))}
                </ul>

                <a
                  href={fullUrl}
                  className="relative overflow-hidden group flex items-center justify-center gap-2 w-full py-3.5 px-5 rounded-xl font-bold text-[#0a0908] bg-[#e8d5b0] hover:bg-[#f0dfc0] transition-all duration-[80ms] text-sm shadow-[0_3px_0_rgba(100,76,36,0.9),0_6px_20px_rgba(0,0,0,0.35),0_0_28px_rgba(232,213,176,0.15),inset_0_1px_0_rgba(255,255,255,0.5)] hover:shadow-[0_4px_0_rgba(100,76,36,0.9),0_8px_24px_rgba(0,0,0,0.4),0_0_36px_rgba(232,213,176,0.2)] active:translate-y-[2px] active:shadow-[0_1px_0_rgba(100,76,36,0.9)] before:absolute before:inset-x-0 before:top-0 before:h-1/2 before:bg-gradient-to-b before:from-white/30 before:to-transparent before:pointer-events-none"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Prendre le système - 497€
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform duration-150" />
                  </span>
                </a>
                <p className="text-center text-xs text-white/20 mt-3">
                  Accès à vie - paiement unique
                </p>
              </div>
            </div>
          )}

          <p className="text-center text-xs text-white/15 mt-8">
            Paiement sécurisé via Stripe - Satisfait ou remboursé 30 jours
          </p>
        </div>
      </section>

      {/* ================================================================
          CTA FINAL
      ================================================================ */}
      <section className="relative z-10 px-6 py-28 sm:py-36 border-t border-white/[0.05] text-center">
        <div className="max-w-xl mx-auto">
          <Logo layout="vertical" className="mx-auto mb-14" />

          <h2 className="text-3xl sm:text-4xl font-bold text-[#f0ede8] mb-5 leading-[1.15]">
            Pendant que les autres louent leur intelligence,
            <br />
            <span className="text-[#c9b48a]">tu vas la distiller.</span>
          </h2>

          <p className="text-[#8a8070] text-base leading-[1.75] mb-4">
            La fenêtre est ouverte. Elle ne le sera pas toujours.
          </p>
          <p className="text-[#8a8070] text-base leading-[1.75] mb-14">
            Les premiers à construire du capital organique dans cette fenêtre
            ne seront pas concurrencés par ceux qui arriveront après.
            Pas parce qu&apos;ils auront été plus rapides. Parce qu&apos;ils auront possédé
            quelque chose que les autres n&apos;auront jamais.
          </p>

          {!(user && currentTier) && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10 text-left">
              <div className="relative overflow-hidden bg-white/[0.03] border border-white/[0.07] rounded-xl p-5">
                <p className="text-xs font-bold uppercase tracking-wider text-[#e8d5b0] mb-1">Fondations - 97€</p>
                <p className="text-xs text-white/40">De zéro à ton premier client, accès à vie, paiement unique.</p>
              </div>
              <div className="relative overflow-hidden bg-white/[0.03] border border-[#e8d5b0]/20 rounded-xl p-5">
                <p className="text-xs font-bold uppercase tracking-wider text-[#e8d5b0] mb-1">Système Complet - 497€</p>
                <p className="text-xs text-white/40">Framework ORACLE, 7 blocs, skills encodés, Fondations incluses.</p>
              </div>
            </div>
          )}

          {user && currentTier ? (
            <Link
              href="/dashboard"
              className="relative overflow-hidden inline-flex items-center gap-2 bg-[#c9b48a] hover:bg-[#e8d5b0] text-[#0a0908] font-bold text-base px-10 py-4 rounded-2xl transition-all duration-[80ms] shadow-[0_5px_0_rgba(100,76,36,0.9),0_12px_28px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.45)] active:translate-y-[4px] active:shadow-[0_1px_0_rgba(100,76,36,0.9)] before:absolute before:inset-x-0 before:top-0 before:h-1/2 before:bg-gradient-to-b before:from-white/30 before:to-transparent before:pointer-events-none"
            >
              <span className="relative z-10 flex items-center gap-2">Accéder au système <ArrowRight className="w-5 h-5" /></span>
            </Link>
          ) : (
            <a
              href="#pricing"
              className="relative overflow-hidden inline-flex items-center gap-2 bg-[#c9b48a] hover:bg-[#e8d5b0] text-[#0a0908] font-bold text-base px-10 py-4 rounded-2xl transition-all duration-[80ms] shadow-[0_5px_0_rgba(100,76,36,0.9),0_12px_28px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.45)] active:translate-y-[4px] active:shadow-[0_1px_0_rgba(100,76,36,0.9)] before:absolute before:inset-x-0 before:top-0 before:h-1/2 before:bg-gradient-to-b before:from-white/30 before:to-transparent before:pointer-events-none"
            >
              <span className="relative z-10 flex items-center gap-2">Commencer à construire <ArrowRight className="w-5 h-5" /></span>
            </a>
          )}
        </div>
      </section>
    </main>
  );
}
