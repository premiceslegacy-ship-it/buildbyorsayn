"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight, GraduationCap, ShieldCheck } from "lucide-react";
import { Logo } from "@/components/Logo";
import { createClient } from "@/lib/supabase/client";
import { getCheckoutUrls } from "@/app/actions/getCheckoutUrls";


const SECTIONS = [
  { id: "penser", label: "1. Penser avant de construire" },
  { id: "environnement", label: "2. Comprendre l'environnement" },
  { id: "visuels", label: "3. Générer des visuels pro" },
  { id: "flow", label: "4. Le flow : de l'idée à l'URL" },
  { id: "angle-mort", label: "5. L'angle mort" },
];

export default function BeginnerPage() {
  const router = useRouter();
  const [tier, setTier] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [upgradeUrl, setUpgradeUrl] = useState<string>("#");
  const [displayEmail, setDisplayEmail] = useState<string>("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("penser");

  useEffect(() => {
    const fetchUser = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/login"); return; }
      setUserId(user.id);
      setDisplayEmail(user.email ?? "");

      const { data: profile } = await supabase
        .from("profiles")
        .select("tier")
        .eq("id", user.id)
        .single();
      const userTier = profile?.tier ?? null;
      setTier(userTier);

      const urls = await getCheckoutUrls();
      const base = urls.upgrade ?? "#";
      setUpgradeUrl(base !== "#" ? `${base}?client_reference_id=${user.id}` : base);
    };
    fetchUser();
  }, [router]);


  const isFullUser = tier === "full";

  return (
    <main className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#1c1c1f] via-[#0e0e0f] to-[#0e0e0f] text-[#f0ede8] font-sans relative">
      {/* Halos */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 bg-[#e8d5b0] opacity-5 blur-[120px] w-[600px] h-[300px] rounded-full pointer-events-none z-0" />

      {/* Navigation */}
      <nav className="w-full max-w-7xl mx-auto flex items-center justify-between py-6 px-6 md:px-12 relative z-20">
        <Logo layout="horizontal" className="h-6" hideText={false} />
        <div className="flex items-center gap-6 text-sm">
          <Link href="/dashboard" className="text-white/40 hover:text-white/80 transition-colors">
            Tableau de bord
          </Link>
          <Link href="/beginner" className="text-[#f0ede8] font-medium flex items-center gap-1.5">
            <GraduationCap className="w-3.5 h-3.5" /> Fondations
          </Link>
          {tier === "full" && (
            <Link href="/sources" className="text-white/40 hover:text-white/80 transition-colors">
              La stack
            </Link>
          )}
          {displayEmail === "mbebourasam@gmail.com" && (
            <Link href="/admin" className="text-white/30 hover:text-[#e8d5b0] transition-colors">
              <ShieldCheck className="w-4 h-4" />
            </Link>
          )}
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center text-xs font-medium text-[#e8d5b0] border border-white/10 cursor-pointer hover:bg-white/20 transition-colors"
            >
              {displayEmail ? displayEmail.substring(0, 2).toUpperCase() : "?"}
            </button>
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 bg-[#161618] border border-white/10 shadow-2xl rounded-xl p-2 w-48 z-50">
                <div className="px-2 pb-2 mb-2 text-xs text-white/40 border-b border-white/10">
                  {displayEmail}
                </div>
                <button
                  className="w-full text-left px-2 py-1.5 text-sm text-[#f87171] hover:bg-white/5 rounded-md transition-colors"
                  onClick={async () => {
                    const supabase = createClient();
                    await supabase.auth.signOut();
                    router.push("/login");
                  }}
                >
                  Se déconnecter
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 md:px-12 pb-32 relative z-10">
        {/* En-tête */}
        <header className="max-w-3xl pt-8 mb-16">
          <p className="text-xs uppercase tracking-[0.15em] text-[#e8d5b0]/60 font-semibold mb-4">Fondations</p>
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-[#f0ede8] leading-tight mb-6">
            De zéro à un site en ligne,<br />avec méthode.
          </h1>
          <p className="text-lg text-white/50 leading-relaxed">
            Avant de toucher un seul outil, tu comprends ce que tu construis, pourquoi, et pour qui. C'est la base que la plupart des gens sautent.
          </p>
        </header>

        {/* Navigation de sections */}
        <div className="flex flex-wrap gap-2 mb-16 border-b border-white/8 pb-8">
          {SECTIONS.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              onClick={() => setActiveSection(s.id)}
              className={`text-xs font-medium px-4 py-2 rounded-full transition-all duration-200 ${
                activeSection === s.id
                  ? "bg-[#e8d5b0] text-[#0e0e0f]"
                  : "bg-white/5 text-white/50 border border-white/10 hover:bg-white/10 hover:text-white/80"
              }`}
            >
              {s.label}
            </a>
          ))}
        </div>

        {/* ── Section 1 : Penser avant de construire ── */}
        <section id="penser" className="mb-24 scroll-mt-8">
          <div className="flex items-center gap-3 mb-8">
            <span className="text-xs font-semibold text-[#e8d5b0]/60 uppercase tracking-widest">01</span>
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-[#f0ede8]">Penser avant de construire</h2>
          </div>
          <p className="text-white/60 text-base leading-relaxed mb-10 max-w-2xl">
            Avant de toucher un seul outil, je pose le cadre. C'est l'étape que tout le monde saute et qui explique pourquoi la plupart des projets partent dans tous les sens.
          </p>

          {/* Les questions vitales */}
          <div className="mb-10">
            <h3 className="text-lg font-semibold text-[#f0ede8] mb-6">Les questions vitales</h3>
            <p className="text-white/55 text-sm leading-relaxed mb-8 max-w-2xl">
              Chaque fois que je commence un projet — site vitrine, app ou outil interne — je réponds à ces questions avant d'ouvrir quoi que ce soit.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  q: "Qui est l'utilisateur ? Quel comportement je veux qu'il ait ?",
                  a: "Pas «tout le monde». Une personne précise, avec un contexte précis. Un artisan de 45 ans qui ne sait pas ce qu'est GitHub. Un directeur marketing qui consulte depuis son téléphone entre deux réunions. Cette personne détermine tout : le design, le niveau de complexité, les mots qu'on utilise, le CTA principal.",
                },
                {
                  q: "Quel problème je résous ?",
                  a: "Pas «je veux faire un site web». Quel est le problème concret de l'utilisateur que ce projet résout ? Il perd du temps à répondre aux mêmes questions par email ? Il n'a pas de vitrine crédible pour convaincre ses prospects ? Le problème se formule toujours depuis le point de vue de l'utilisateur.",
                },
                {
                  q: "Quelles API vont entrer en jeu ?",
                  a: "Une API, c'est une connexion entre deux services. Si le site doit envoyer un email quand un formulaire est rempli, c'est une API. Si l'app doit se connecter à Stripe pour un paiement, c'est une API. Je liste toutes ces connexions dès le départ car elles influencent directement la stack technique.",
                },
                {
                  q: "Quel backend ?",
                  a: "Pour un site vitrine simple, il n'y a pas besoin de backend. Pour un site avec un espace membre, une BDD, des abonnements, c'est une autre histoire. Je décide ici si j'ai besoin de Supabase, de serverless functions, ou de rien du tout.",
                },
                {
                  q: "Quel CTA principal ?",
                  a: "Un seul. Pas cinq. L'utilisateur qui arrive sur le site, quelle est l'action unique que je veux qu'il fasse ? Prendre un rendez-vous, s'inscrire, acheter, télécharger. Je ne construis pas une page avant d'avoir répondu à cette question.",
                },
                {
                  q: "Quel design ?",
                  a: "Je ne parle pas de couleurs. Je parle de registre. Sobre et premium ? Chaleureux et artisanal ? Tech et dense ? Ce registre doit correspondre à l'utilisateur cible. Un site pour un fonds d'investissement et un site pour un boulanger local n'ont pas le même registre.",
                },
                {
                  q: "Quelles fonctionnalités, dans quel ordre ?",
                  a: "Je liste toutes les fonctionnalités envisagées, puis je les classe : P1 (obligatoire pour lancer) et P2 (peut venir après). La règle : P1 complet avant tout P2. Un site avec 5 fonctionnalités à 80% vaut moins qu'un site avec 2 fonctionnalités à 100%.",
                },
                {
                  q: "Quel objectif à 90 jours ?",
                  a: "Pas «avoir un beau site». Un chiffre, une action, une métrique. 10 demandes de contact par mois. 500 visiteurs uniques. 3 clients signés. Cet objectif conditionne les décisions techniques : si l'objectif est de générer des leads, le SEO et le CTA sont prioritaires.",
                },
              ].map(({ q, a }) => (
                <div key={q} className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-5">
                  <p className="text-sm font-semibold text-[#e8d5b0] mb-3">{q}</p>
                  <p className="text-xs text-white/55 leading-relaxed">{a}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Pourquoi une IA seule ne suffit pas */}
          <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-6 md:p-8 mb-6">
            <h3 className="text-base font-semibold text-[#f0ede8] mb-4">Pourquoi une IA seule ne suffit pas</h3>
            <p className="text-sm text-white/55 leading-relaxed mb-4">
              Beaucoup de gens pensent qu'il suffit de demander à ChatGPT ou Claude "crée-moi un site pour un plombier" pour avoir un résultat professionnel. En théorie c'est possible. En pratique, le résultat sera générique, sans personnalité, sans compréhension du vrai problème du client.
            </p>
            <p className="text-sm text-white/55 leading-relaxed mb-4">
              L'IA est un outil d'exécution extraordinaire. Mais elle a besoin d'un chef de projet qui sait ce qu'il veut. Mon rôle, ce n'est pas d'écrire du code. Mon rôle est de comprendre le problème, prendre les bonnes décisions de structure, et donner à l'IA un contexte suffisamment précis pour qu'elle produise quelque chose qui tient. <strong className="text-[#f0ede8]">L'IA fait l'exécution. Moi je fais le jugement.</strong>
            </p>
            <p className="text-sm text-white/55 leading-relaxed">
              C'est pour ça que j'utilise des <strong className="text-[#f0ede8]">skills</strong> : des fichiers de contexte chargés dans mon environnement IA pour qu'elle arrive déjà briefée. Elle ne repart pas de zéro à chaque session. Le détail des skills, c'est dans le système complet.
            </p>
          </div>

          {/* Automatisations */}
          <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-6 md:p-8 mb-6">
            <h3 className="text-base font-semibold text-[#f0ede8] mb-4">Les automatisations, c'est du code en langage naturel</h3>
            <p className="text-sm text-white/55 leading-relaxed mb-4">
              Quand un formulaire de contact envoie automatiquement un mail et crée une ligne dans un CRM, c'est de la logique de code. Il y a une condition, une action, un résultat. Mais aujourd'hui, cette logique peut se décrire en langage naturel à une IA, et elle produit le code correspondant.
            </p>
            <div className="bg-black/30 border border-white/5 rounded-xl p-4 mb-4">
              <p className="text-xs text-[#e8d5b0]/80 font-mono leading-relaxed">
                "Quand ce formulaire est soumis, envoie un email de confirmation à l'utilisateur et ajoute son contact dans HubSpot."
              </p>
            </div>
            <p className="text-sm text-white/55 leading-relaxed">
              C'est une instruction que je peux donner à Claude ou Cursor, et obtenir le code fonctionnel en retour. La condition : je comprenne ce que je veux. Si je ne sais pas articuler la logique de ce que je construis, l'IA ne peut pas la deviner.
            </p>
          </div>

          {/* Fichiers .md */}
          <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-6 md:p-8">
            <h3 className="text-base font-semibold text-[#f0ede8] mb-4">Les fichiers .md de contexte projet</h3>
            <p className="text-sm text-white/55 leading-relaxed mb-4">
              Avant de lancer quoi que ce soit dans un IDE ou un outil IA, je crée un dossier <code className="text-[#e8d5b0] bg-white/5 px-1.5 py-0.5 rounded text-xs">/docs</code> dans mon projet avec des fichiers Markdown :
            </p>
            <ul className="space-y-2 mb-4">
              {[
                { file: "BRIEF.md", desc: "résume le projet et ses objectifs" },
                { file: "PRD.md", desc: "liste les fonctionnalités et les critères d'acceptation" },
                { file: "PROMPT-SYSTEM.md", desc: "dit à l'IA comment se comporter sur ce projet spécifique" },
              ].map(({ file, desc }) => (
                <li key={file} className="flex items-start gap-3 text-sm text-white/55">
                  <code className="text-[#e8d5b0] bg-white/5 px-1.5 py-0.5 rounded text-xs flex-shrink-0 mt-0.5">{file}</code>
                  <span>{desc}</span>
                </li>
              ))}
            </ul>
            <p className="text-sm text-white/55 leading-relaxed">
              Sans ces fichiers, l'IA avance en aveugle. Elle génère du code générique qui ne correspond pas à la réalité du projet. Avec ces fichiers, chaque session part du bon endroit.
            </p>
          </div>
        </section>

        {/* ── Section 2 : Comprendre l'environnement ── */}
        <section id="environnement" className="mb-24 scroll-mt-8">
          <div className="flex items-center gap-3 mb-8">
            <span className="text-xs font-semibold text-[#e8d5b0]/60 uppercase tracking-widest">02</span>
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-[#f0ede8]">Comprendre l'environnement</h2>
          </div>
          <p className="text-white/60 text-base leading-relaxed mb-10 max-w-2xl">
            Pas besoin d'être développeur pour comprendre comment fonctionnent les outils qu'on utilise. Mais comprendre les bases change radicalement la qualité des résultats qu'on obtient.
          </p>

          {/* LLM */}
          <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-6 md:p-8 mb-6">
            <h3 className="text-base font-semibold text-[#f0ede8] mb-4">Démystifier le LLM</h3>
            <p className="text-sm text-white/55 leading-relaxed mb-6">
              Un LLM (Large Language Model), c'est le moteur derrière Claude, ChatGPT, Gemini. Il prédit le prochain mot le plus probable en fonction de tout ce qu'il a appris pendant son entraînement, et du contexte qu'on lui donne. Ce n'est pas une base de données. Il génère une réponse probable.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-black/20 border border-white/5 rounded-xl p-4">
                <p className="text-xs font-semibold text-[#e8d5b0] mb-2">Les tokens</p>
                <p className="text-xs text-white/50 leading-relaxed">
                  L'IA ne lit pas des mots, elle lit des tokens. Un token ≈ 0,75 mot. Chaque modèle a une limite de tokens par conversation (la fenêtre de contexte). Quand cette fenêtre est pleine, le modèle commence à "oublier" ce qui a été dit au début. C'est pour ça qu'une longue conversation finit par produire des résultats incohérents.
                </p>
              </div>
              <div className="bg-black/20 border border-white/5 rounded-xl p-4">
                <p className="text-xs font-semibold text-[#e8d5b0] mb-2">Pourquoi un projet Claude change tout</p>
                <p className="text-xs text-white/50 leading-relaxed">
                  Un projet Claude, c'est une conversation permanente avec un contexte chargé une fois pour toutes. J'y mets des fichiers de connaissances, des instructions permanentes. À chaque nouvelle session, l'IA sait déjà qui est le client, ce qu'on construit, quel est le registre visuel. Je ne répète rien.
                </p>
              </div>
            </div>
          </div>

          {/* API */}
          <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-6 md:p-8 mb-6">
            <h3 className="text-base font-semibold text-[#f0ede8] mb-4">L'analogie de l'API</h3>
            <p className="text-sm text-white/55 leading-relaxed mb-4">
              Une API, c'est comme un serveur dans un restaurant. Je suis attablé, je veux une pizza. Je ne vais pas en cuisine. Je passe ma commande au serveur, qui transmet à la cuisine, qui prépare, qui renvoie.
            </p>
            <div className="bg-black/20 border border-white/5 rounded-xl p-4 mb-4">
              <div className="flex items-center gap-2 text-xs text-white/40 flex-wrap">
                <span className="text-[#e8d5b0]">Mon app</span>
                <ArrowRight className="w-3 h-3" />
                <span>API</span>
                <ArrowRight className="w-3 h-3" />
                <span>Service externe (Stripe, Mailchimp, OpenAI)</span>
                <ArrowRight className="w-3 h-3" />
                <span>API</span>
                <ArrowRight className="w-3 h-3" />
                <span className="text-[#e8d5b0]">Mon app</span>
              </div>
            </div>
            <p className="text-sm text-white/55 leading-relaxed">
              Quand je dis à Claude "intègre Stripe pour que l'utilisateur puisse payer 30 euros", je sais ce que je demande. Je comprends qu'il faut une clé API (un mot de passe spécial), qu'il faut la garder secrète côté serveur, et qu'il faut gérer le cas où le paiement échoue. Sans cette compréhension, l'IA produirait du code que je ne saurais pas évaluer.
            </p>
          </div>

          {/* Prompt structuré */}
          <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-6 md:p-8">
            <h3 className="text-base font-semibold text-[#f0ede8] mb-4">Le prompt structuré</h3>
            <p className="text-sm text-white/55 leading-relaxed mb-6">Même outil, même modèle, deux résultats radicalement différents.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="bg-red-500/5 border border-red-500/15 rounded-xl p-4">
                <p className="text-xs font-semibold text-red-400 mb-2">Prompt nul</p>
                <p className="text-xs text-white/50 font-mono">"Fais-moi un site pour un plombier."</p>
                <p className="text-xs text-white/35 mt-2">Résultat : générique, sans personnalité, indistinguable de 10 000 autres sites.</p>
              </div>
              <div className="bg-emerald-500/5 border border-emerald-500/15 rounded-xl p-4">
                <p className="text-xs font-semibold text-emerald-400 mb-2">Prompt structuré</p>
                <p className="text-xs text-white/50 font-mono leading-relaxed">
                  "Tu es un designer web senior spécialisé dans les sites pour artisans locaux. Contexte : Marc Dupont, plombier à Bordeaux depuis 18 ans. Clientèle : propriétaires 35-60 ans, urgences et rénovations. Problème : ils ne savent pas s'il est disponible avant d'appeler. Objectif : générer des demandes de devis..."
                </p>
              </div>
            </div>
            <div className="bg-black/20 border border-white/5 rounded-xl p-4">
              <p className="text-xs font-semibold text-[#e8d5b0] mb-3">Les composantes d'un bon prompt</p>
              <ul className="space-y-2">
                {[
                  ["Le rôle", "\"Tu es un développeur Next.js senior\", \"Tu es un copywriter spécialisé en B2B\". Plus le rôle est précis, plus le registre est calibré."],
                  ["Le contexte", "Qui est le client, quel est le problème, qui est l'utilisateur final. Sans ce contexte, l'IA généralise."],
                  ["La tâche précise", "\"Génère le texte de la section hero\", pas \"génère quelque chose pour la page d'accueil\"."],
                  ["Les contraintes", "\"Pas de jargon technique\", \"maximum 80 caractères par titre\", \"respecte les couleurs #e8d5b0 et #0e0e0f\"."],
                  ["Le format de sortie", "Markdown, JSON, code React ou tableau ? Le préciser évite d'obtenir un bloc de texte quand tu voulais un fichier structuré."],
                ].map(([label, desc]) => (
                  <li key={label as string} className="flex gap-2 text-xs text-white/50">
                    <span className="text-[#e8d5b0] flex-shrink-0 font-medium">{label}</span>
                    <span>{desc}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ── Section 3 : Visuels ── */}
        <section id="visuels" className="mb-24 scroll-mt-8">
          <div className="flex items-center gap-3 mb-8">
            <span className="text-xs font-semibold text-[#e8d5b0]/60 uppercase tracking-widest">03</span>
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-[#f0ede8]">Générer des visuels pro</h2>
          </div>
          <p className="text-white/60 text-base leading-relaxed mb-10 max-w-2xl">
            Cette section s'adresse particulièrement à ceux qui construisent des sites e-commerce ou des vitrines où l'image est centrale. Mais les principes s'appliquent à n'importe quel projet. Va puiser de l'inspiration sur Pinterest ou sites similaires.
          </p>

          {/* Outils */}
          <div className="mb-8">
            <h3 className="text-base font-semibold text-[#f0ede8] mb-6">Les outils et leurs usages</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  name: "Nano Banana",
                  tag: "Images",
                  desc: "Mon outil de prédilection pour la création d'images. Tu génères des visuels de produits ou des ambiances qui s'intègrent parfaitement à ton design, sans passer des heures sur Photoshop ou payer un photographe.",
                },
                {
                  name: "Kling",
                  tag: "Vidéo",
                  desc: "Ton moteur pour la vidéo. Au lieu d'un site statique, Kling te donne le pouvoir d'animer tes produits ou de créer de courtes séquences immersives. Tu captes l'attention dès la première seconde.",
                },
                {
                  name: "Midjourney",
                  tag: "Portraits",
                  desc: "Particulièrement impressionnant si tu as besoin de créer des visages ultra-réalistes ou des portraits très poussés. Maîtrise totale de la cohérence visuelle et du photoréalisme.",
                },
                {
                  name: "Higgsfield",
                  tag: "Tout-en-un",
                  desc: "Ces \"wrappers d'IA\" regroupent tout un tas d'outils de pointe au même endroit. Confort absolu et gain de temps : tu centralises toute ta création visuelle sans jongler entre cinquante abonnements.",
                },
              ].map(({ name, tag, desc }) => (
                <div key={name} className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-sm font-semibold text-[#f0ede8]">{name}</span>
                    <span className="text-[10px] font-medium text-[#e8d5b0]/70 bg-[#e8d5b0]/10 border border-[#e8d5b0]/20 rounded-full px-2 py-0.5">{tag}</span>
                  </div>
                  <p className="text-xs text-white/50 leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Penser comme un photographe */}
          <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-6 md:p-8 mb-6">
            <h3 className="text-base font-semibold text-[#f0ede8] mb-4">Penser comme un photographe professionnel</h3>
            <p className="text-sm text-white/55 leading-relaxed mb-6">
              La plupart des gens décrivent ce qu'ils veulent voir. Un photographe professionnel décrit comment il veut le capturer. Un prompt image se construit comme un brief photo.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
              {[
                { el: "Sujet", ex: "Un homme d'affaires en costume gris, la cinquantaine, devant une fenêtre panoramique sur Paris." },
                { el: "Style", ex: "Éditorial, commercial, lifestyle, reportage, packshot. Chaque style a ses codes de lumière." },
                { el: "Objectif", ex: "85mm pour un portrait naturel avec bokeh. 35mm pour une image plus large et contextualisée." },
                { el: "Lumière", ex: "Naturelle ou artificielle, directionnelle ou diffuse, chaude ou froide." },
                { el: "Colorimétrie", ex: "La signature visuelle. Palette désaturée, dominante bleue-grise dans les ombres." },
                { el: "Fond", ex: "Fond blanc pour packshot, bureau en bois naturel légèrement flouté, extérieur urbain." },
                { el: "Composition", ex: "Sujet en légère plongée, cadré en plan américain, espace négatif à droite." },
                { el: "Format", ex: "16:9 pour les héros, 4:5 pour les cards, 1:1 pour les portraits. Décider en amont." },
              ].map(({ el, ex }) => (
                <div key={el} className="bg-black/20 border border-white/5 rounded-xl p-3">
                  <p className="text-xs font-semibold text-[#e8d5b0] mb-1.5">{el}</p>
                  <p className="text-[11px] text-white/40 leading-relaxed">{ex}</p>
                </div>
              ))}
            </div>
            <div className="bg-black/30 border border-white/5 rounded-xl p-4">
              <p className="text-[10px] font-semibold text-white/30 uppercase tracking-widest mb-2">Exemple de prompt complet</p>
              <p className="text-xs text-[#e8d5b0]/70 font-mono leading-relaxed">
                Commercial product photography of a minimalist ceramic coffee mug, matte black, placed on a white oak surface. Shot with 50mm lens, f/2.8, soft side lighting from the left creating subtle shadows. Background: blurred modern kitchen, warm neutral tones. Color grading: desaturated, Scandinavian editorial style. No reflections on the mug surface. --ar 4:5
              </p>
            </div>
          </div>

          {/* Prompt JSON */}
          <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-6 md:p-8 mb-6">
            <h3 className="text-base font-semibold text-[#f0ede8] mb-4">Le prompt JSON pour des séries cohérentes</h3>
            <p className="text-sm text-white/55 leading-relaxed mb-4">
              Pour un projet qui nécessite plusieurs images cohérentes (série de produits, portraits d'équipe, visuels pour chaque section), j'utilise une approche que j'appelle le "prompt JSON". Je crée un Projet Claude dédié uniquement à la génération de prompts JSON d'images pour ce projet.
            </p>
            <p className="text-sm text-white/55 leading-relaxed mb-4">
              J'y charge le <code className="text-[#e8d5b0] bg-white/5 px-1.5 py-0.5 rounded text-xs">BRAND-SYSTEM.md</code> qui décrit l'identité visuelle et la palette. Ensuite je décris en langage naturel ce que je veux, et le projet sort un prompt image formaté, optimisé, prêt à coller dans Nano Banana.
            </p>
            <div className="bg-black/30 border border-white/5 rounded-xl p-4">
              <p className="text-[10px] font-semibold text-white/30 uppercase tracking-widest mb-2">Output type du projet Claude</p>
              <pre className="text-xs text-[#e8d5b0]/70 font-mono leading-relaxed overflow-x-auto">{`{
  "prompt": "Artisan plumber in his 40s, focused expression,
  working on copper pipe installation in a bright modern
  bathroom. Natural light from window, warm tones. Shot
  at 35mm, documentary photography style.",
  "negative_prompt": "generic, stock photo, plastic tools, dark",
  "aspect_ratio": "16:9",
  "style": "commercial photography, editorial"
}`}</pre>
            </div>
          </div>

          {/* Cohérence visuelle */}
          <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-6 md:p-8">
            <h3 className="text-base font-semibold text-[#f0ede8] mb-4">Cohérence visuelle : éviter l'effet patchwork</h3>
            <p className="text-sm text-white/55 leading-relaxed mb-4">
              L'effet patchwork, c'est quand une page ressemble à un collage de sources différentes sans fil conducteur : une image Midjourney hyperréaliste à côté d'une illustration vectorielle plate, à côté d'une photo de stock des années 2010.
            </p>
            <ul className="space-y-3">
              {[
                ["Décider d'un style, s'y tenir partout", "Avant de générer la moindre image, définis le style visuel dans le DESIGN-SYSTEM.md. Pas les deux : \"Photographie commerciale, tons chauds\" ou \"Illustration vectorielle flat design\"."],
                ["Conserver les paramètres d'un prompt réussi", "Quand une image te plaît, enregistre le prompt complet. Les paramètres de lumière, l'objectif, la colorimétrie. Réutilise-les comme base pour toutes les images suivantes."],
                ["Utiliser le même modèle pour une série", "Chaque modèle a ses propres artefacts visuels. Si tu mélanges les modèles sur un même projet, ça se voit."],
                ["Calibrer les formats avant de commencer", "16:9 pour les héros, 4:5 pour les cards, 1:1 pour les portraits. Décide en amont et génère avec les bons ratios. Recadrer après coup dégrade la composition."],
              ].map(([title, desc]) => (
                <li key={title as string} className="flex gap-3">
                  <span className="w-1 h-1 rounded-full bg-[#e8d5b0]/50 flex-shrink-0 mt-2" />
                  <div>
                    <span className="text-sm font-medium text-[#f0ede8]">{title}</span>
                    <p className="text-xs text-white/50 leading-relaxed mt-1">{desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ── Section 4 : Le flow ── */}
        <section id="flow" className="mb-24 scroll-mt-8">
          <div className="flex items-center gap-3 mb-8">
            <span className="text-xs font-semibold text-[#e8d5b0]/60 uppercase tracking-widest">04</span>
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-[#f0ede8]">Le flow : de l'idée à l'URL en ligne</h2>
          </div>
          <div className="bg-[#e8d5b0]/5 border border-[#e8d5b0]/15 rounded-2xl px-6 py-4 mb-10">
            <p className="text-sm text-[#e8d5b0]/80">
              C'est la section la plus concrète de cet onglet. À la fin, tu sais mettre un site en ligne de A à Z.
            </p>
          </div>

          {/* Étapes */}
          <div className="space-y-6">
            {/* Étape 1 */}
            <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-6 md:p-8">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-7 h-7 rounded-full bg-[#e8d5b0]/10 border border-[#e8d5b0]/20 flex items-center justify-center text-xs font-bold text-[#e8d5b0]">1</span>
                <h3 className="text-base font-semibold text-[#f0ede8]">Génération no-code : le premier jet</h3>
              </div>
              <p className="text-sm text-white/55 leading-relaxed mb-4">
                Je commence toujours par un premier jet visuel rapide avant de toucher un IDE. Les outils comme <strong className="text-[#f0ede8]">Lovable</strong>, <strong className="text-[#f0ede8]">AI Studio (Google)</strong> ou <strong className="text-[#f0ede8]">Bolt.new</strong> me permettent d'avoir une version explorable en quelques minutes.
              </p>
              <p className="text-sm text-white/55 leading-relaxed mb-4">
                Je décris mon projet en langage naturel. L'outil génère une première version. Ce n'est jamais parfait — c'est normal. Ce premier jet me sert à deux choses : valider la structure globale avant d'investir du temps, et avoir une base de code à affiner.
              </p>
              <div className="bg-black/20 border border-white/5 rounded-xl p-4">
                <p className="text-xs font-semibold text-[#e8d5b0]/60 mb-2">Leurs limites</p>
                <p className="text-xs text-white/45 leading-relaxed">
                  Excellents pour démarrer vite. Quand la logique devient complexe (authentification, base de données, paiement, logique conditionnelle poussée), ils atteignent leurs limites. C'est là qu'on passe à un IDE avec Claude Code ou Cursor.
                </p>
              </div>
            </div>

            {/* Étape 2 */}
            <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-6 md:p-8">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-7 h-7 rounded-full bg-[#e8d5b0]/10 border border-[#e8d5b0]/20 flex items-center justify-center text-xs font-bold text-[#e8d5b0]">2</span>
                <h3 className="text-base font-semibold text-[#f0ede8]">Le cœur du projet : GitHub</h3>
              </div>
              <p className="text-sm text-white/55 leading-relaxed mb-4">
                Une fois un premier jet satisfaisant, je le connecte à GitHub. La plupart de ces outils ont une connexion native. En un clic, le code est dans un repository.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  ["Versioning", "Chaque modification est enregistrée avec un message. Je reviens à n'importe quelle version antérieure en deux clics."],
                  ["Collaboration", "Si je travaille avec quelqu'un, il accède au repo. Pas besoin d'envoyer des fichiers par email."],
                  ["Déploiement automatique", "Vercel se connecte au repo et redéploie automatiquement à chaque push. Le repo est le déclencheur de tout le pipeline."],
                  ["Sauvegarde permanente", "Mon ordinateur peut tomber en panne. GitHub garde tout."],
                ].map(([title, desc]) => (
                  <div key={title as string} className="bg-black/20 border border-white/5 rounded-xl p-3">
                    <p className="text-xs font-semibold text-[#e8d5b0] mb-1">{title}</p>
                    <p className="text-[11px] text-white/40 leading-relaxed">{desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Étape 3 */}
            <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-6 md:p-8">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-7 h-7 rounded-full bg-[#e8d5b0]/10 border border-[#e8d5b0]/20 flex items-center justify-center text-xs font-bold text-[#e8d5b0]">3</span>
                <h3 className="text-base font-semibold text-[#f0ede8]">L'ajustement final dans l'IDE</h3>
              </div>
              <p className="text-sm text-white/55 leading-relaxed mb-4">
                Le premier jet no-code donne une base. L'IDE donne la précision. Je clone le repo sur mon ordinateur :
              </p>
              <div className="bg-black/30 border border-white/5 rounded-xl p-4 mb-4">
                <code className="text-xs text-[#e8d5b0]/80 font-mono">git clone https://github.com/mon-compte/mon-projet.git</code>
              </div>
              <p className="text-sm text-white/55 leading-relaxed mb-4">
                <strong className="text-[#f0ede8]">Antigravity</strong> est mon IDE recommandé pour les débutants. Il a une IA intégrée (Gemini + Claude via API, connexions MCP) qui comprend l'intégralité du codebase et peut modifier plusieurs fichiers en même temps.
              </p>
              <div className="bg-black/20 border border-white/5 rounded-xl p-4 mb-4">
                <p className="text-[10px] font-semibold text-white/30 uppercase tracking-widest mb-2">Premier message à envoyer dans l'IDE</p>
                <p className="text-xs text-[#e8d5b0]/70 font-mono leading-relaxed">
                  "Charge et lis /docs/PROMPT-SYSTEM.md entièrement avant de produire quoi que ce soit. Confirme que tu as bien compris le projet, la stack et les règles."
                </p>
              </div>
              <div className="bg-black/20 border border-white/5 rounded-xl p-4">
                <p className="text-[10px] font-semibold text-white/30 uppercase tracking-widest mb-2">Règle de sécurité fondamentale</p>
                <p className="text-xs text-white/45 leading-relaxed">
                  Tout ce qui est clé API est à mettre dans un fichier <code className="text-[#e8d5b0] bg-white/5 px-1 rounded">.env</code> local (dans gitignore). Puis dans tes paramètres Vercel sous "Environment Variables". Un repo GitHub peut devenir public. Une clé Stripe dans le code d'un repo public, c'est un compte compromis.
                </p>
              </div>
            </div>

            {/* Étape 4 */}
            <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-6 md:p-8">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-7 h-7 rounded-full bg-[#e8d5b0]/10 border border-[#e8d5b0]/20 flex items-center justify-center text-xs font-bold text-[#e8d5b0]">4</span>
                <h3 className="text-base font-semibold text-[#f0ede8]">Vercel : mise en ligne</h3>
              </div>
              <p className="text-sm text-white/55 leading-relaxed mb-4">
                Vercel est la plateforme de déploiement. C'est là que mon site devient accessible à n'importe qui dans le monde via une URL. Je crée un compte sur vercel.com (gratuit pour les projets personnels), clique sur "Import Project", j'autorise l'accès à GitHub, je sélectionne mon repo. Premier déploiement : 2 à 3 minutes.
              </p>
              <div className="bg-black/20 border border-white/5 rounded-xl p-4 mb-4">
                <p className="text-[10px] font-semibold text-white/30 uppercase tracking-widest mb-2">Le déploiement continu</p>
                <pre className="text-xs text-[#e8d5b0]/70 font-mono leading-relaxed">{`git add .
git commit -m "Ajout section témoignages"
git push`}</pre>
                <p className="text-xs text-white/35 mt-2">Vercel détecte automatiquement le push. Relance un build. En 60 secondes, la modification est en ligne.</p>
              </div>
              <p className="text-sm text-white/55 leading-relaxed font-medium">
                Pas de FTP, pas d'upload manuel, pas de serveur à gérer. Code, push, en ligne. C'est ça le flow.
              </p>
            </div>
          </div>
        </section>

        {/* ── Section 5 : L'angle mort ── */}
        <section id="angle-mort" className="mb-24 scroll-mt-8">
          <div className="flex items-center gap-3 mb-8">
            <span className="text-xs font-semibold text-[#e8d5b0]/60 uppercase tracking-widest">05</span>
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-[#f0ede8]">L'angle mort : la différence entre une vitrine et un système</h2>
          </div>

          <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-6 md:p-8 mb-6">
            <p className="text-sm text-white/60 leading-relaxed mb-6">
              Tu arrives à la fin de cet onglet fondations. Tu sais faire quelque chose que la majorité des gens ne savent pas faire. Mais voici ce qui manque.
            </p>
            <div className="space-y-4">
              {[
                "Tu ne sais pas si les décisions de design que tu as prises sont les bonnes pour l'audience cible. Tu as choisi des couleurs qui te plaisaient. Est-ce qu'elles convertissent ? Est-ce qu'elles inspirent confiance à un dirigeant de 50 ans qui cherche un partenaire sérieux ?",
                "Tu ne sais pas si l'architecture est scalable. Ton site fonctionne avec 10 visiteurs par jour. Et si tu veux ajouter un espace membre dans 6 mois, est-ce que la base technique actuelle le permet sans tout refaire ?",
                "Tu n'as pas de logique business derrière ce que tu as construit. Est-ce que ce site répond au vrai problème du vrai utilisateur ? Est-ce qu'il est positionné pour convertir dans un marché spécifique ?",
              ].map((text, i) => (
                <div key={i} className="flex gap-4 bg-black/20 border border-white/5 rounded-xl p-4">
                  <span className="text-white/20 text-2xl font-bold leading-none mt-0.5 flex-shrink-0">—</span>
                  <p className="text-sm text-white/50 leading-relaxed">{text}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-6 md:p-8">
            <h3 className="text-base font-semibold text-[#f0ede8] mb-6">Ce qui t'attend dans les blocs 1 à 7</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  title: "Le framework ORACLE",
                  desc: "Ma méthode pour construire un projet de A à Z avec l'IA. Il remplace le prompt hasardeux par une structure de documents (BRIEF, BRAND-SYSTEM, DESIGN-SYSTEM, PRD, PARCOURS-UTILISATEURS, PROMPT-SYSTEM) qui permettent à l'IA d'avoir un contexte extrêmement précis.",
                },
                {
                  title: "Les skills",
                  desc: "Mes collaborateurs spécialisés permanents. Un skill dédié au design premium (ux-ui-design), un skill dédié à l'architecture backend et la sécurité (expert-backend), des skills pour le SEO. Quand je lance un projet, ces skills sont chargés et l'IA arrive déjà briefée.",
                },
                {
                  title: "La logique business",
                  desc: "Comment choisir une niche, se positionner, vendre avant de construire, itérer sur le feedback terrain. La technique c'est que 10% de l'équation. Le plus dur, c'est de vendre et faire de l'argent.",
                },
                {
                  title: "L'identité visuelle forte",
                  desc: "La différence entre un site qu'on oublie 10 secondes après l'avoir vu et un site qui installe une perception de marque. Ce n'est pas une question de budget, c'est une question de système.",
                },
              ].map(({ title, desc }) => (
                <div key={title} className="bg-black/20 border border-white/5 rounded-xl p-4">
                  <p className="text-sm font-semibold text-[#e8d5b0] mb-2">{title}</p>
                  <p className="text-xs text-white/50 leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
            <p className="text-sm text-white/55 leading-relaxed mt-6">
              Si tu es arrivé jusqu'ici, tu as les bases. Tu comprends l'environnement. Tu sais générer des visuels. Tu sais mettre un site en ligne. La suite : apprendre à le faire de manière <strong className="text-[#f0ede8]">systématique, reproductible, vendable</strong>. Avec un framework. Avec des standards. Avec une logique business derrière chaque décision technique.
            </p>
          </div>
        </section>

        {/* ── CTA Upgrade ── */}
        {!isFullUser && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-gradient-to-b from-[#e8d5b0]/8 to-[#e8d5b0]/3 border border-[#e8d5b0]/20 rounded-3xl p-8 md:p-10 text-center">
              <p className="text-xs uppercase tracking-[0.15em] text-[#e8d5b0]/60 font-semibold mb-4">Passer au niveau supérieur</p>
              <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-[#f0ede8] mb-4">
                Accéder au contenu complet de BUILD
              </h2>
              <p className="text-white/50 text-sm leading-relaxed mb-3">
                Les 30 euros que tu as investis ici sont déduits. Tu paies 70 euros, pas 100.
              </p>
              <div className="flex items-baseline justify-center gap-1 mb-8">
                <span className="text-4xl font-bold text-[#f0ede8]">70€</span>
                <span className="text-white/40 text-sm">TTC</span>
              </div>
              <a
                href={upgradeUrl}
                className="group inline-flex items-center justify-center gap-2 w-full md:w-auto px-10 py-4 rounded-xl font-semibold text-[#0e0e0f] bg-[#e8d5b0] hover:bg-[#f0dfc0] transition-all duration-200 shadow-[0_0_32px_rgba(232,213,176,0.3)] hover:shadow-[0_0_48px_rgba(232,213,176,0.45)] text-base"
              >
                Débloquer les 7 blocs
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
              </a>
              <p className="text-center text-xs text-white/25 mt-5">Paiement sécurisé via Stripe · Satisfait ou remboursé 30 jours</p>
            </div>
          </div>
        )}

        {/* Message pour les full users */}
        {isFullUser && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-emerald-500/5 border border-emerald-500/15 rounded-2xl p-6 text-center">
              <p className="text-sm text-emerald-400/80">Tu as accès à l'ensemble du système Build.</p>
              <Link href="/dashboard" className="inline-flex items-center gap-1.5 text-sm text-[#e8d5b0] mt-3 hover:underline">
                Retour au tableau de bord <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
