import { LiquidCard } from "@/components/ui/liquid-glass-card";
import { ToolCard } from "@/components/ui/tool-card";
import { SectionReveal } from "@/components/ui/section-reveal";
import { MarkdownFilePreview } from "@/components/ui/markdown-file-preview";

const REFERENCE_TOOLS = [
  {
    name: "Pinterest",
    logoSrc: "/brand-logos/pinterest.svg",
    description: "Moteur de recherche visuel. Sert à capter un univers, une émotion, une matière ou une lumière - même quand la référence n'est pas un site web.",
    href: "https://www.pinterest.com",
  },
  {
    name: "Refero",
    logoSrc: "/brand-logos/refero.png",
    description: "Bibliothèque d'écrans et de parcours réels d'applications qui existent vraiment. Sert à analyser une structure, une hiérarchie, des composants, du détail d'interface.",
    href: "https://refero.design",
  },
  {
    name: "Mintlify",
    logoSrc: "/brand-logos/mintlify.svg",
    description: "Plateforme de documentation - étudiée ici pour la précision de son design system, pas comme une identité à recopier telle quelle.",
    href: "https://mintlify.com",
  },
  {
    name: "Rare UI",
    logoSrc: "/brand-logos/rare-ui.svg",
    description: "Galerie de composants peu vus. Sert de réservoir de mécanismes d'interaction à surveiller - jamais une bibliothèque à cloner intégralement.",
    href: "https://rareui.com",
  },
];

const SLOP_PATTERNS = [
  {
    name: "Le halo violet/bleu",
    detail: "Un dégradé flou en fond de hero, peu importe le secteur du site.",
  },
  {
    name: "Le titre en dégradé",
    detail: "Texte transparent sur fond coloré : accentue au hasard, sans rapport avec ce que dit la phrase.",
  },
  {
    name: "Le hero interchangeable",
    detail: "Badge, titre centré, deux boutons, faux dashboard - change le logo et le nom, le message reste vendable pour n'importe quel produit.",
  },
];

const GENERATION_TOOLS = [
  {
    name: "Nano Banana",
    logoSrc: "/brand-logos/nano-banana.svg",
    description: "Génération d'ambiances qui s'intègrent au design sans repasser par un logiciel de retouche.",
  },
  {
    name: "GPT Image 2.5",
    logoSrc: "/brand-logos/openai.svg",
    description: "Visuels propres à partir d'un brief précis : images de hero, variations d'ambiance, assets éditoriaux.",
  },
  {
    name: "Kling",
    logoSrc: "/brand-logos/kling.svg",
    description: "Génération vidéo - anime un produit ou construit une courte séquence immersive plutôt qu'un site statique.",
  },
  {
    name: "Midjourney",
    logoSrc: "/brand-logos/midjourney.svg",
    description: "Portraits très poussés, avec une maîtrise forte de la cohérence visuelle et du photoréalisme.",
  },
  {
    name: "Higgsfield",
    logoSrc: "/brand-logos/higgsfield.svg",
    description: "Regroupe plusieurs moteurs de génération au même endroit - confort de centraliser, mais nécessite du budget.",
  },
  {
    name: "Figma",
    logoSrc: "/brand-logos/figma.svg",
    description: "Compose et valide une direction avant production. Un SVG ou un asset HTML reste souvent plus juste qu'une image pour du responsive, des états ou du texte accessible.",
  },
];

export function Section3() {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-3 mb-8">
        <span className="text-xs font-semibold text-[#e8d5b0]/60 uppercase tracking-widest">08</span>
        <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-[#f0ede8]">Générer des visuels pro</h2>
      </div>
      <p className="text-white/60 text-base leading-relaxed mb-10">
        Cette section sert surtout à construire de meilleurs sites web : landing pages, sites vitrines, pages d'offre, portfolios ou pages produit. L'objectif n'est pas de générer de jolies images au hasard, mais de créer une direction visuelle cohérente avec le message, la conversion et le design system.
      </p>

      {/* Le danger de l'AI Slop */}
      <SectionReveal className="relative overflow-hidden border border-red-500/25 bg-gradient-to-b from-red-500/[0.07] to-red-950/[0.15] p-6 md:p-8 mb-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.04),inset_0_-20px_40px_-30px_rgba(0,0,0,0.6)]">
        <div aria-hidden="true" className="pointer-events-none absolute inset-[5px] border border-red-500/10" />
        <div className="relative z-10">
          <h3 className="text-base font-semibold text-red-400 mb-4">Éviter le &quot;AI slop&quot;</h3>
          <p className="text-sm text-white/60 leading-relaxed mb-4">
            Le &quot;AI slop&quot;, c&apos;est ce rendu générique, lisse, sur-saturé et artificiel que produisent les IA par défaut. Un utilisateur le repère en une fraction de seconde, et ça détruit instantanément la crédibilité de ton site.
          </p>
          <div className="relative overflow-hidden border border-white/10 bg-gradient-to-b from-white/[0.03] to-black/20 p-4 mb-4">
            <p className="text-xs font-semibold text-[#e8d5b0] mb-1.5 uppercase tracking-wide">Le test qui ne trompe pas</p>
            <p className="text-sm text-white/65 leading-relaxed">
              Retire le logo, la marque et la couleur d&apos;accent de ta page : comprend-on encore l&apos;activité, la tâche et les objets du produit ? Si remplacer juste les noms suffit à vendre n&apos;importe quel autre SaaS avec la même page, le problème est dans la structure et le contenu - pas dans un détail visuel à ajuster.
            </p>
          </div>
          <p className="text-sm text-white/60 leading-relaxed mb-4">
            Trois signatures reconnaissables à l&apos;œil, par réflexe plutôt que par choix :
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
            {SLOP_PATTERNS.map((p) => (
              <div key={p.name} className="relative overflow-hidden border border-red-500/20 bg-gradient-to-b from-red-500/[0.05] to-black/30 p-3.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]">
                <p className="text-xs font-semibold text-red-300/90 mb-1.5">{p.name}</p>
                <p className="text-[11px] text-white/45 leading-relaxed">{p.detail}</p>
              </div>
            ))}
          </div>
          <p className="text-sm text-white/60 leading-relaxed">
            <strong className="text-white">La solution : le contexte visuel et la décomposition.</strong> Ne demande jamais à une IA de &quot;faire un beau design&quot;. Donne-lui des références, chacune avec un rôle précis, puis extrais-en la structure, la typographie, la matière et les comportements avant de construire ta propre direction.
          </p>
        </div>
      </SectionReveal>

      {/* Les références et leur rôle */}
      <SectionReveal className="mb-8">
        <h3 className="text-base font-semibold text-[#f0ede8] mb-2">Les références, et leur rôle précis</h3>
        <p className="text-sm text-white/45 leading-relaxed mb-5 max-w-2xl">
          Chaque référence répond à une question différente. Aucune ne donne, seule, une direction complète.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {REFERENCE_TOOLS.map((tool) => (
            <ToolCard key={tool.name} {...tool} />
          ))}
        </div>
      </SectionReveal>

      {/* Outils de génération */}
      <SectionReveal className="mb-8">
        <h3 className="text-base font-semibold text-[#f0ede8] mb-2">Les outils de génération et leurs usages</h3>
        <p className="text-sm text-white/45 leading-relaxed mb-5 max-w-2xl">
          Une fois la direction fixée à partir des références, ces outils produisent les assets.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {GENERATION_TOOLS.map((tool) => (
            <ToolCard key={tool.name} {...tool} />
          ))}
        </div>
      </SectionReveal>

      {/* Penser comme un photographe */}
      <SectionReveal>
        <LiquidCard variant="elevated" className="p-6 md:p-8 mb-6">
          <h3 className="text-base font-semibold text-[#f0ede8] mb-4 tracking-tight leading-snug">Penser comme un photographe</h3>
          <p className="text-sm text-white/65 leading-relaxed mb-6">
            Un prompt image se construit comme un brief photo. Ne décris pas ce que tu veux voir, décris <em>comment</em> tu veux le capturer.
          </p>
          <div className="grid grid-cols-2 gap-3 mb-6">
            {[
              { el: "Sujet", ex: "Un homme d'affaires en costume gris." },
              { el: "Style", ex: "Éditorial, commercial, lifestyle." },
              { el: "Lumière", ex: "Directionnelle, naturelle basse." },
              { el: "Couleurs", ex: "Palette désaturée, bleutée." },
            ].map(({ el, ex }) => (
              <div key={el} className="bg-black/20 border border-white/5 p-3">
                <p className="text-xs font-semibold text-[#e8d5b0] mb-1.5">{el}</p>
                <p className="text-[11px] text-white/40 leading-relaxed">{ex}</p>
              </div>
            ))}
          </div>
          <div className="bg-black/30 border border-white/5 p-4">
            <p className="text-xs text-[#e8d5b0]/70 font-mono leading-relaxed">
              &quot;Commercial product photography of a minimalist ceramic mug, matte black. Shot with 50mm, f/2.8, soft side lighting...&quot;
            </p>
          </div>
        </LiquidCard>
      </SectionReveal>

      {/* Cohérence visuelle */}
      <SectionReveal>
        <LiquidCard variant="elevated" className="p-6 md:p-8">
          <h3 className="text-base font-semibold text-[#f0ede8] mb-4 tracking-tight leading-snug">La règle de la cohérence visuelle</h3>
          <p className="text-sm text-white/65 leading-relaxed mb-4">
            &quot;Sois un designer Apple&quot; ne produit rien de sérieux : l&apos;IA ne connaît ni les tokens réels d&apos;Apple, ni son process, ni ce qu&apos;un designer chez eux exécute concrètement. Un prompt de style ne remplace jamais un <code className="text-[#e8d5b0] bg-white/5 px-1.5 py-0.5 text-[11px] font-mono">DESIGN-SYSTEM.md</code> : un vrai design system, digne d&apos;un Mintlify ou d&apos;un Linear, ne tient pas en une phrase de style. Il sépare des primitifs (une palette de couleurs brutes, des familles de polices, une échelle d&apos;espacement) et des rôles qui les consomment : fond, surface, texte, bordure, action, état. Chaque token porte un statut - exact quand la variable source est identifiée, mesuré quand il vient d&apos;un état réellement calculé, inféré quand il reconstruit une capture, proposé quand c&apos;est une décision nouvelle qui reste à valider. Une valeur proposée ne se fait jamais passer pour une valeur mesurée.
          </p>
          <p className="text-sm text-white/60 leading-relaxed mb-2">
            Avant de livrer, on calibre sur une fixture réelle - titre long, corps de texte, contrôle, état vide, état d&apos;erreur - avec les vraies polices autorisées, pas un Lorem Ipsum dans un rectangle vide. Le statique reste la source canonique avant tout dérivé (image-to-video, animation légère). C&apos;est cette discipline de process, pas un adjectif de style, qui donne un vrai output identique à chaque génération. Voici à quoi ressemble un extrait réel d&apos;un <code className="text-[#e8d5b0] bg-white/5 px-1.5 py-0.5 text-[11px] font-mono">DESIGN-SYSTEM.md</code> écrit avec cette rigueur :
          </p>
          <MarkdownFilePreview filename="Mintlify - Style Reference.md">
{`# Mintlify - Style Reference

status: observed-style-reference
role: landing-page-and-documentation-product-reference

## Statut et rôle
Système visuel suffisamment riche pour servir de référence de
conception - ce n'est pas la documentation officielle complète de
Mintlify. Ses mécanismes doivent être traduits dans le contexte, la
niche et la marque du produit cible, jamais copiés comme une peau.

## Thèse visuelle
"Cloud garden over a glass desk." Un hero illustré et expressif porte
le seul moment de collision entre couleur et concept. Tout le reste
revient à une discipline presque monochrome : canvas blanc, texte
noir, vert fonctionnel, surfaces calmes, géométrie plutôt carrée.

## Tokens de couleur
| Nom | Valeur | Rôle |
|---|---|---|
| Mint Green | #0c8c5e | liens de marque, état actif, accents rares |
| Ink Black | #08090a | titres, icônes, bouton rempli |
| True Black | #000000 | texte courant, traits d'icônes |
| Paper White | #ffffff | canvas, surfaces de cartes |
| Mist Gray | #f2f2f2 | diviseurs subtils, hover discret |
| Cloud Gray | #dddddd | bordures de champs |

Le vert Mintlify est une ponctuation fonctionnelle. Il ne devient
jamais un grand fond, un bouton principal ou un second système de
surfaces.

## Typographie (Inter, seule famille visible)
| Rôle | Taille | Ligne | Tracking |
|---|---:|---:|---:|
| body | 16px | 1.5 | -0.16px |
| heading | 40px | 1.15 | -0.4px |
| display | 57px | 1.1 | -1.14px |

## Rayons - refuse explicitement les pills et le 9999px
- Boutons / inputs / tags : 4px
- Cartes : 16px
- Grands conteneurs : 24px

## Iconographie
- Famille : tracé linéaire simple, sans plaque arrondie automatique.
- Grille d'usage : 16px pour les actions denses, 20px pour la navigation,
  24px pour une fonction mise en avant.
- Épaisseur de départ proposée : 1.5px, à calibrer avec la police réelle.
- Chaque icône possède un nom accessible lorsqu'elle agit seule.
- Les logos externes restent des marques officielles, jamais redessinées.

## Composants et états
Tout contrôle applicable spécifie repos, survol, focus-visible, pressé,
indisponible, chargement, succès et erreur. Pendant le chargement, le
libellé explique l'action en cours et le double envoi est bloqué. Une erreur
conserve la saisie et donne une action de récupération. Une couleur ou un
spinner seuls ne suffisent pas.

## Assets et illustrations
Les captures produit prouvent le mécanisme. Les illustrations de features
possèdent un rôle, une source, des droits, un cadrage desktop et mobile, un
poids cible, un alt et un fallback. Un asset conçu dans Figma ou dérivé d'un
motion design conserve son fichier source et une version statique. Aucun
gradient, halo ou faux écran n'est ajouté uniquement pour remplir une carte.

## Responsive
Le hero, la navigation, les exemples de code et les preuves sont recomposés
aux largeurs compactes. L'ordre de lecture et l'action principale restent
complets. Les titres longs, les erreurs, le zoom et l'absence d'image sont
testés, pas seulement la maquette idéale.

## Do
- Utiliser Inter partout, une seule couleur d'accent fonctionnelle.
- Réserver le hero au moment expressif, produit réel comme preuve.
- Préférer les séparations fines aux ombres visibles.

## Don't
- Ne pas ajouter de pills ni de rayon 9999px.
- Ne pas transformer le vert en fond de bouton ou grande surface.
- Ne pas ajouter de glassmorphism ou de gradient décoratif.

## Motion
Non vérifié en runtime : pas de trigger, durée ou easing observés.
Aucune animation ne doit être inventée à partir de la seule impression
visuelle. Chaque mouvement observé ou proposé documente son déclencheur,
l'objet, la propriété, la durée, l'easing, l'état final, l'interruption et
l'alternative reduced motion. Un travail After Effects peut fournir une
référence ou un asset exporté, mais le comportement web reste spécifié et
testé dans le navigateur.`}
          </MarkdownFilePreview>
          <p className="text-sm text-white/60 leading-relaxed">
            Remarque la différence avec un prompt de style : chaque token a une valeur, un rôle, parfois une limite assumée ("non vérifié en runtime" plutôt qu'une animation inventée). C&apos;est ce niveau de précision - <span className="text-[#f0ede8]">exactement ce que le skill design formalisé de BUILD applique</span> - qui distingue un design system qui tient dans le temps d&apos;un simple moodboard.
          </p>
        </LiquidCard>
      </SectionReveal>
    </div>
  );
}
