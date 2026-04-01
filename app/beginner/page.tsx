import { createClient } from "@/lib/supabase/server";
import { Logo } from "@/components/Logo";
import Link from "next/link";
import {
    ArrowRight, BookOpen, Cpu, Image, Rocket, Compass,
    ChevronRight, Zap, Code2
} from "lucide-react";

const MODULES = [
    {
        id: 1,
        icon: Compass,
        tag: "Module 1",
        title: "Penser avant de construire",
        duration: "15 min",
        description:
            "Avant d'écrire le premier prompt, tu dois savoir ce que tu construis. Ce module te donne un framework de 5 questions que tout builder doit se poser : ton utilisateur, le problème résolu, les connexions externes, le backend, le CTA.",
        sections: [
            {
                subtitle: "Introduction aux skills",
                content:
                    "Un skill, c'est ta capacité à donner à l'IA le bon contexte, les bonnes contraintes, et le bon objectif. Une IA sans skill, c'est un employé sans brief. Ce module est l'un des éléments que tu retrouveras de façon approfondie dans les Blocs de Build.",
            },
            {
                subtitle: "Les automatisations, c'est du code",
                content:
                    "Formulaire qui remplit un CRM Notion, email automatique post-achat, notif Slack quand un client paie — tout ça c'est du code. Bonne nouvelle : avec l'IA, tu le demandes en langage naturel. Pense dès maintenant aux automatisations de ton projet (ex : formulaire → CRM, paiement → email, action utilisateur → webhook). Tu n'as pas besoin de savoir les coder, tu as besoin de savoir les identifier.",
            },
            {
                subtitle: "Les 5 questions",
                content:
                    "1. Qui est mon utilisateur cible ? 2. Quel problème précis je résous ? 3. Quelles connexions externes (API, CRM, paiement, SEO) ? 4. Ai-je besoin d'un backend / base de données ? 5. Quel est le CTA principal de mon site ?",
            },
        ],
        cta: null,
    },
    {
        id: 2,
        icon: Cpu,
        tag: "Module 2",
        title: "L'environnement : LLM, API, prompt structuré",
        duration: "10 min",
        description:
            "Comprendre son environnement de travail, c'est le minimum pour ne pas construire à l'aveugle. Pas de cours universitaire — juste ce qui compte.",
        sections: [
            {
                subtitle: "Ce qu'est un LLM (en 3 phrases)",
                content:
                    "Un LLM est un modèle entraîné sur des milliards de textes. Il prédit le token suivant le plus probable à partir de ton prompt. Il n'a pas de mémoire entre les sessions — c'est pourquoi les projets Claude / Gems Gemini sont puissants : ils gardent le contexte de ton projet.",
            },
            {
                subtitle: "Une API, c'est quoi ?",
                content:
                    "Imagine un serveur de restaurant. Tu (le client) passes une commande au serveur (l'API), le serveur transmet à la cuisine (le service), et te rapporte la réponse. C'est exactement le rôle d'une API : une interface standardisée entre deux systèmes. Stripe, Notion, OpenAI, Supabase — tout ça expose des APIs.",
            },
            {
                subtitle: "Prompt basique vs prompt structuré",
                content:
                    "❌ Basique : \"Fais-moi un site e-commerce\"\n✅ Structuré : \"Tu es un expert Next.js. Génère la page d'accueil d'un site e-commerce pour sneakers de luxe. Hero avec texte centré, grille de 3 produits, palette sombre, police moderne. Pas de Tailwind, vanilla CSS uniquement.\"\n\nLe delta de résultat est massif. La précision de ton prompt = la précision de l'output.",
            },
            {
                subtitle: "Créer un projet dédié (Claude / Gem Gemini)",
                content:
                    "Crée un espace projet dans Claude ou Gemini spécifiquement pour ton projet. Mets-y ton brief, ta stack, tes contraintes, tes exemples. C'est la mémoire persistante de ton projet — l'IA retrouvera ce contexte à chaque conversation.",
            },
        ],
        cta: null,
    },
    {
        id: 3,
        icon: Image,
        tag: "Module 3",
        title: "Générer des visuels pro pour ton site",
        duration: "10 min",
        description:
            "Pour un site e-com ou vitrine, les images font 60% du travail. Ce module te montre comment prompter des outils comme Midjourney, Flux ou Ideogram pour obtenir des visuels qui convertissent.",
        sections: [
            {
                subtitle: "Les bons outils",
                content:
                    "Midjourney (Discord) : meilleur pour les ambiances et portraits.\nFlux / Ideogram : excellent pour le texte dans les images et les mockups produits.\nAdobe Firefly : bon pour les fonds et les compositions e-com.\nDans tous les cas : prompt en anglais, sois précis sur le style, l'éclairage, le fond.",
            },
            {
                subtitle: "Structure d'un bon prompt image",
                content:
                    "[Sujet] + [Style] + [Éclairage] + [Fond] + [Ratio]\n\nExemple : \"A luxury sneaker product shot, editorial style, soft studio lighting, pure white background, 4:3 ratio, ultra detailed, no shadows\"\n\nPour l'e-com : fond blanc ou neutre, éclairage doux, pas d'ombre dure. Pour un site vitrine : ambiance cohérente avec ta palette couleur.",
            },
            {
                subtitle: "Éditer et adapter",
                content:
                    "Une fois ton image générée, tu peux l'éditer avec Canva (suppression de fond, resize), Adobe Express ou Photoshop IA (generative fill). L'objectif : avoir des visuels cohérents sur tout ton site — pas un patchwork de styles.",
            },
        ],
        cta: null,
    },
    {
        id: 4,
        icon: Rocket,
        tag: "Module 4",
        title: "De l'idée au site en ligne",
        duration: "20 min",
        description:
            "Le module le plus concret. Tu suis le flow complet : Lovable (ou AI Studio) → GitHub → IDE → Vercel. À la fin, tu as un site avec une vraie URL.",
        sections: [
            {
                subtitle: "Générer avec Lovable / AI Studio",
                content:
                    "Lovable et Google AI Studio permettent de générer une app web complète à partir d'un prompt en langage naturel. Décris ce que tu veux (cf. Module 1), itère sur les résultats, valide la version qui te convient. Tu n'écris pas de code — tu diriges.",
            },
            {
                subtitle: "Connecter à GitHub",
                content:
                    "Ces outils s'intègrent nativement avec GitHub. Crée un repo depuis l'outil, donne-lui un nom clair (ex: mon-site-portfolio). Le repo c'est le cœur de ton projet — tout ton code versionné, sauvegardé, traçable.",
            },
            {
                subtitle: "Ouvrir et ajuster dans l'IDE",
                content:
                    "Clone le repo dans Cursor ou Antigravity (ton IDE IA). 2 actions de base : ouvrir le projet, le faire tourner en local (npm run dev). Depuis l'IDE, demande à l'IA des ajustements précis (couleurs, textes, composants). C'est là que tu prends le contrôle précis.",
            },
            {
                subtitle: "Déployer sur Vercel",
                content:
                    "Connecte ton repo GitHub à Vercel (vercel.com → Import project). En 2 minutes, ton site est en ligne sur une vraie URL. Chaque fois que tu fais un push sur GitHub, Vercel redéploie automatiquement. C'est le moment \"wow\" : tu modifies un fichier, tu pushes, et ton site se met à jour en direct.",
            },
        ],
        cta: {
            label: "💡 Dans la partie complète de Build, tu verras comment architecturer tout ça pour que ça tienne, que ça scale, et que ça convertisse.",
        },
    },
    {
        id: 5,
        icon: BookOpen,
        tag: "Module 5",
        title: "Et maintenant ? Ce que tu ne sais pas encore faire",
        duration: "5 min",
        description:
            "Tu sais faire un site. Mais tu fais ça à l'aveugle. Voici ce qui manque pour que ton site se vende, dure, et convertisse.",
        sections: [
            {
                subtitle: "Ce que tu ne sais pas encore",
                content:
                    "✗ Penser ton projet avec un framework avant de construire\n✗ Créer une identité visuelle qui reste\n✗ Structurer un site qui convertit (pas juste qui est beau)\n✗ Architecture backend qui tient dans le temps\n✗ SEO/GEO pour être trouvé\n✗ Logique business derrière les choix techniques",
            },
            {
                subtitle: "C'est exactement ce que les Blocs 1 à 7 apportent",
                content:
                    "Build n'est pas un cours de code. C'est un système pour construire des projets qui ont une logique, une identité, une architecture. Les Blocs 1 à 7 te donnent le framework de thinking que tu n'as pas encore — et sans lequel tu continueras à construire à l'aveugle.",
            },
        ],
        cta: {
            label: "Passe au système complet — 70€ de complément",
            href: "/checkout",
        },
    },
];

export default async function BeginnerPage() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    let displayName = "Builder";
    if (user) {
        const firstName =
            (user.user_metadata?.first_name as string) ||
            (user.user_metadata?.full_name as string)?.split(" ")[0] ||
            user.email?.split("@")[0] ||
            "Builder";
        displayName = firstName;
    }

    return (
        <main className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#1c1c1f] via-[#0e0e0f] to-[#0e0e0f] text-[#f0ede8] font-sans relative overflow-hidden">
            {/* Halos */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-[#e8d5b0] opacity-5 blur-[120px] w-[600px] h-[300px] rounded-full pointer-events-none" />
            <div className="absolute bottom-0 left-0 bg-blue-500 opacity-5 blur-[120px] w-[400px] h-[400px] rounded-full pointer-events-none" />

            {/* Nav */}
            <nav className="w-full max-w-4xl mx-auto flex items-center justify-between py-6 px-6 relative z-20">
                <Logo layout="horizontal" className="h-6" hideText={false} />
                <Link href="/dashboard" className="flex items-center gap-1.5 text-sm text-white/40 hover:text-white/80 transition-colors">
                    ← Le hub
                </Link>
            </nav>

            <div className="max-w-4xl mx-auto px-6 pb-24 relative z-10">
                {/* Header */}
                <header className="pt-8 mb-16">
                    <span className="inline-flex items-center gap-2 text-xs font-medium text-[#e8d5b0] bg-[#e8d5b0]/10 border border-[#e8d5b0]/20 rounded-full px-3 py-1 mb-6">
                        <Zap className="w-3 h-3" /> Build Débutant
                    </span>
                    <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-[#f0ede8] mb-4">
                        Les bases pour construire
                    </h1>
                    <p className="text-[rgba(240,237,232,0.55)] text-lg leading-relaxed max-w-2xl">
                        5 modules pour passer de zéro à un site en ligne — et comprendre ce dont tu as besoin pour aller plus loin.
                    </p>

                    {/* Progress bar placeholder */}
                    <div className="flex items-center gap-3 mt-8">
                        <div className="flex gap-1.5">
                            {MODULES.map((m) => (
                                <div key={m.id} className="w-8 h-1 rounded-full bg-white/10" />
                            ))}
                        </div>
                        <span className="text-xs text-white/30">5 modules · ~1h</span>
                    </div>
                </header>

                {/* Modules */}
                <div className="space-y-8">
                    {MODULES.map((module) => {
                        const Icon = module.icon;
                        return (
                            <div
                                key={module.id}
                                className="bg-white/[0.03] border border-white/[0.07] rounded-2xl overflow-hidden"
                            >
                                {/* Module header */}
                                <div className="px-8 pt-8 pb-6 border-b border-white/[0.06]">
                                    <div className="flex items-start gap-5">
                                        <div className="flex-shrink-0 w-12 h-12 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center">
                                            <Icon className="w-6 h-6 text-[#e8d5b0]" strokeWidth={1.5} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-3 mb-2">
                                                <span className="text-xs text-white/30 font-medium uppercase tracking-wider">{module.tag}</span>
                                                <span className="text-xs text-white/20">·</span>
                                                <span className="text-xs text-white/30">{module.duration}</span>
                                            </div>
                                            <h2 className="text-xl font-semibold text-[#f0ede8] tracking-tight">{module.title}</h2>
                                            <p className="text-sm text-white/50 mt-2 leading-relaxed">{module.description}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Sections */}
                                <div className="divide-y divide-white/[0.05]">
                                    {module.sections.map((section, idx) => (
                                        <div key={idx} className="px-8 py-6">
                                            <h3 className="text-sm font-semibold text-[#e8d5b0] mb-3 flex items-center gap-2">
                                                <ChevronRight className="w-3.5 h-3.5" />
                                                {section.subtitle}
                                            </h3>
                                            <p className="text-sm text-white/55 leading-relaxed whitespace-pre-line pl-5">
                                                {section.content}
                                            </p>
                                        </div>
                                    ))}
                                </div>

                                {/* Video placeholder (for Module 4) */}
                                {module.id === 4 && (
                                    <div className="px-8 pb-8">
                                        <div className="bg-white/[0.02] border border-white/[0.06] border-dashed rounded-xl h-52 flex flex-col items-center justify-center gap-3">
                                            <Code2 className="w-8 h-8 text-white/15" strokeWidth={1} />
                                            <p className="text-sm text-white/25">Vidéo démo — bientôt disponible</p>
                                            <p className="text-xs text-white/15">Lovable → GitHub → Cursor → Vercel</p>
                                        </div>
                                    </div>
                                )}

                                {/* CTA */}
                                {module.cta && (
                                    <div className={`px-8 pb-8 ${module.cta.href ? "" : "pt-2"}`}>
                                        {module.cta.href ? (
                                            <Link
                                                href={module.cta.href}
                                                className="group flex items-center justify-between w-full bg-[#e8d5b0]/10 hover:bg-[#e8d5b0]/15 border border-[#e8d5b0]/20 hover:border-[#e8d5b0]/35 rounded-xl px-6 py-4 transition-all duration-200"
                                            >
                                                <span className="text-sm font-medium text-[#e8d5b0]">{module.cta.label}</span>
                                                <ArrowRight className="w-4 h-4 text-[#e8d5b0] group-hover:translate-x-1 transition-transform duration-200 flex-shrink-0 ml-3" />
                                            </Link>
                                        ) : (
                                            <div className="bg-white/[0.03] border border-white/[0.07] rounded-xl px-6 py-4">
                                                <p className="text-xs text-white/40 leading-relaxed">{module.cta.label}</p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Final CTA */}
                <div className="mt-16 text-center">
                    <p className="text-white/30 text-sm mb-6">Tu as terminé le contenu débutant.</p>
                    <Link
                        href="/checkout"
                        className="group inline-flex items-center gap-2 py-4 px-8 rounded-xl font-semibold text-[#0e0e0f] bg-[#e8d5b0] hover:bg-[#f0dfc0] transition-all duration-200 shadow-[0_0_24px_rgba(232,213,176,0.25)] hover:shadow-[0_0_32px_rgba(232,213,176,0.4)]"
                    >
                        Passer au système complet — 70€
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                    </Link>
                    <p className="text-white/20 text-xs mt-4">Blocs 1–7 · Sources · Communauté Telegram</p>
                </div>
            </div>
        </main>
    );
}
