import {
  ExternalLink, Search, Terminal, Database, BookOpen,
  Video, PlaySquare, Briefcase, Code, Bot, Brain, Sparkles,
  Wand2, Pen, Smartphone, Palette, Box, GitBranch, Zap, Layers,
  CreditCard, Mail, Bug, BarChart2, FileText, LayoutList, Shield,
  BookMarked, Globe, Monitor, Plug,
} from "lucide-react";
import { ToolLogo } from "@/components/ToolLogo";
import { Ui4Shell } from "@/components/ui4/Ui4Shell";
import { requirePageAccess } from "@/lib/auth/paidPageAccess.server";
import { TOOL_LOGOS } from "@/lib/tools/registry";
import { SourceCategoryFilter } from "./SourceCategoryFilter";
import styles from "./sources.module.css";

const CATEGORIES = ["Tous", "IA & Automatisation", "Design & UI", "Outils & Infra", "Vente & Business"];

const SOURCES = [
  // IA & Automatisation
  {
    id: 1,
    name: "Perplexity",
    description: "Moteur de recherche IA conversationnel pour des réponses précises et sourcées en temps réel.",
    icon: Search,
    type: "IA & Automatisation",
    url: "https://www.perplexity.ai",
  },
  {
    id: 2,
    name: "Cursor",
    description: "L'IDE pensé pour l'IA. Accélère drastiquement l'écriture et la refactorisation de code.",
    icon: Terminal,
    type: "IA & Automatisation",
    url: "https://www.cursor.com",
  },
  {
    id: 3,
    name: "Antigravity",
    description: "L'alternative gratuite à Cursor. Un environnement de développement avec IA intégrée nativement.",
    icon: Bot,
    type: "IA & Automatisation",
    url: "https://antigravity.ai",
  },
  {
    id: 4,
    name: "Claude (Anthropic)",
    description: "Le LLM principal pour le code et la rédaction. Meilleur niveau de qualité sur le backend et les architectures complexes.",
    icon: Brain,
    type: "IA & Automatisation",
    url: "https://claude.ai",
  },
  {
    id: 5,
    name: "Google AI Studio",
    description: "Pour les sessions longues et complexes. Fenêtre de contexte très large, idéal pour affiner des designs et générer des MVPs.",
    icon: Sparkles,
    type: "IA & Automatisation",
    url: "https://aistudio.google.com",
  },
  {
    id: 6,
    name: "NotebookLM",
    description: "L'outil le plus sous-utilisé de la stack. Construit une base de connaissance interrogeable depuis tes sources hétérogènes.",
    icon: BookOpen,
    type: "IA & Automatisation",
    url: "https://notebooklm.google.com",
  },
  {
    id: 7,
    name: "Automatisation de flux de travail",
    description: "Ressources sur l'automatisation de flux de travail et l'intégration de modèles d'IA.",
    icon: PlaySquare,
    type: "IA & Automatisation",
    url: "",
  },
  {
    id: 8,
    name: "Développement SaaS et architecture",
    description: "Ressources pour le développement SaaS, l'architecture et les bonnes pratiques.",
    icon: Code,
    type: "IA & Automatisation",
    url: "",
  },

  // Design & UI
  {
    id: 9,
    name: "Google Stitch",
    description: "Génère des designs d'interface complets à partir d'un brief textuel. Tous les écrans, tous les états. Intégrable dans Figma.",
    icon: Wand2,
    type: "Design & UI",
    url: "https://stitch.withgoogle.com",
  },
  {
    id: 10,
    name: "Figma",
    description: "Pour les specs détaillées et le handoff client. L'outil de référence pour valider visuellement avant le développement.",
    icon: Pen,
    type: "Design & UI",
    url: "https://figma.com",
  },
  {
    id: 11,
    name: "Mobbin",
    description: "Analyse des patterns d'interface qui fonctionnent dans des apps réelles en production. La référence UX.",
    icon: Smartphone,
    type: "Design & UI",
    url: "https://mobbin.com",
  },
  {
    id: 12,
    name: "Dribbble",
    description: "Pour l'inspiration visuelle, les directions esthétiques, les palettes et les traitements typographiques.",
    icon: Palette,
    type: "Design & UI",
    url: "https://dribbble.com",
  },
  {
    id: 13,
    name: "21st.dev",
    description: "Les composants React premium modernes dans l'écosystème Tailwind. Le meilleur endroit pour les UI components.",
    icon: Box,
    type: "Design & UI",
    url: "https://21st.dev",
  },

  // Outils & Infra
  {
    id: 14,
    name: "Supabase",
    description: "L'alternative open-source à Firebase. PostgreSQL avec auth intégrée et Row Level Security native.",
    icon: Database,
    type: "Outils & Infra",
    url: "https://supabase.com",
  },
  {
    id: 15,
    name: "GitHub",
    description: "Le versioning n'est jamais optionnel. Chaque modification tracée, chaque version récupérable.",
    icon: GitBranch,
    type: "Outils & Infra",
    url: "https://github.com",
  },
  {
    id: 16,
    name: "Vercel",
    description: "Connecté à GitHub. Chaque push génère une URL de preview unique. Déploiement en production en un clic.",
    icon: Zap,
    type: "Outils & Infra",
    url: "https://vercel.com",
  },
  {
    id: 17,
    name: "shadcn/ui",
    description: "Des composants que tu copies dans ton projet et que tu possèdes. Accessibles, responsives, stylisables avec Tailwind.",
    icon: Layers,
    type: "Outils & Infra",
    url: "https://ui.shadcn.com",
  },
  {
    id: 18,
    name: "Stripe",
    description: "Le standard mondial pour le paiement. API stable, documentation excellente. Pour les abonnements et les webhooks.",
    icon: CreditCard,
    type: "Outils & Infra",
    url: "https://stripe.com",
  },
  {
    id: 19,
    name: "Resend",
    description: "Pour les emails transactionnels. Intégration Next.js native et délivrabilité excellente.",
    icon: Mail,
    type: "Outils & Infra",
    url: "https://resend.com",
  },
  {
    id: 20,
    name: "Sentry",
    description: "Le monitoring des erreurs en production. Chaque erreur tracée avec son contexte complet.",
    icon: Bug,
    type: "Outils & Infra",
    url: "https://sentry.io",
  },
  {
    id: 21,
    name: "PostHog",
    description: "Analytics comportementales, A/B testing, feature flags et session recordings dans un seul outil open source.",
    icon: BarChart2,
    type: "Outils & Infra",
    url: "https://posthog.com",
  },
  {
    id: 22,
    name: "Notion",
    description: "La base de connaissance centrale : briefs clients, SOPs, documentation des décisions, index des Skills.",
    icon: FileText,
    type: "Outils & Infra",
    url: "https://notion.so",
  },
  {
    id: 23,
    name: "Linear",
    description: "La gestion de projet produit. Issues, bugs, cycles de développement. S'intègre avec GitHub pour lier les issues aux commits.",
    icon: LayoutList,
    type: "Outils & Infra",
    url: "https://linear.app",
  },
  {
    id: 24,
    name: "OWASP",
    description: "La référence sécurité pour le développement web. La checklist incontournable pour tout projet sérieux.",
    icon: Shield,
    type: "Outils & Infra",
    url: "https://owasp.org",
  },

  // Vente & Business
  {
    id: 25,
    name: "Acquisition et création d'offres",
    description: "Cadres de travail pour l'acquisition, la création d'offres et la croissance business.",
    icon: Video,
    type: "Vente & Business",
    url: "",
  },
  {
    id: 26,
    name: "Vente B2B et prospection",
    description: "Ressources sur la vente B2B, la prospection et le closing pour transformer un produit en revenus.",
    icon: Briefcase,
    type: "Vente & Business",
    url: "",
  },
  {
    id: 27,
    name: "Influence & Manipulation",
    description: "Les biais universels : réciprocité, preuve sociale, autorité, rareté et sympathie.",
    icon: BookMarked,
    type: "Vente & Business",
    url: "https://www.amazon.fr/s?k=influence+et+manipulation",
  },
  {
    id: 28,
    name: "Firecrawl",
    description: "Transforme n'importe quel site web en données structurées prêtes pour l'IA. Scraping et crawling propre en une API.",
    icon: Globe,
    type: "IA & Automatisation",
    url: "https://firecrawl.dev",
  },
  {
    id: 29,
    name: "minimal.gallery",
    description: "Galerie d'inspiration design minimaliste. Les meilleures interfaces épurées pour affiner ton sens esthétique.",
    icon: Monitor,
    type: "Design & UI",
    url: "https://minimal.gallery",
  },
  {
    id: 30,
    name: "RapidAPI",
    description: "Le marketplace des APIs. Trouve, teste et connecte des milliers d'APIs externes en quelques minutes.",
    icon: Plug,
    type: "Outils & Infra",
    url: "https://rapidapi.com",
  },
  {
    id: 31,
    name: "Pinterest",
    description: "Pour capter un univers, une émotion, une matière ou une lumière, même lorsque la référence n'est pas un site web.",
    icon: Palette,
    type: "Design & UI",
    url: "https://www.pinterest.com",
  },
  {
    id: 32,
    name: "Refero",
    description: "Bibliothèque d'écrans et de parcours réels pour analyser structure, hiérarchie, composants et détails d'interface.",
    icon: LayoutList,
    type: "Design & UI",
    url: "https://refero.design",
  },
  {
    id: 33,
    name: "Mintlify",
    description: "Référence de précision documentaire pour étudier la profondeur d'un design system, pas une identité à recopier.",
    icon: BookOpen,
    type: "Design & UI",
    url: "https://mintlify.com",
  },
  {
    id: 34,
    name: "Rare UI",
    description: "Collection émergente de composants peu vus. À surveiller comme source de mécanismes, jamais comme bibliothèque à cloner.",
    icon: Box,
    type: "Design & UI",
    url: "https://rareui.com",
  },
];

export const dynamic = "force-dynamic";
export const metadata = { title: "La stack du builder | BUILD", robots: { index: false, follow: false } };

export default async function SourcesPage() {
  const identity = await requirePageAccess("beginner", "/sources");

  return (
    <Ui4Shell identity={identity} activeLink="sources">
      <header className={styles.header}><h1>La stack du builder</h1><p>Les outils et les cerveaux qui font tourner le système.</p></header>
      <div className={styles.content}>
        <SourceCategoryFilter
          categories={CATEGORIES}
          entries={SOURCES.map((source) => {
          const Icon = source.icon;
          const hasRenderedLogo = Boolean(TOOL_LOGOS[source.name]);
          const card = (
            <>
              <span className={styles.top}>
                {hasRenderedLogo ? <span className={styles.brand}><ToolLogo name={source.name} size={168} /></span> : <span className={styles.lineIcon}><Icon aria-hidden="true" /></span>}
                {source.url ? <ExternalLink aria-hidden="true" /> : null}
              </span>
              <span className={styles.copy}>
                <h3>{source.name}</h3>
                <p>{source.description}</p>
              </span>
            </>
          );
          return {
            id: source.id,
            category: source.type,
            content: source.url ? (
              <a href={source.url} target="_blank" rel="noopener noreferrer" className={styles.card}>
                {card}
              </a>
            ) : (
              <article className={styles.card}>{card}</article>
            ),
          };
        })}
        />
      </div>
    </Ui4Shell>
  );
}
