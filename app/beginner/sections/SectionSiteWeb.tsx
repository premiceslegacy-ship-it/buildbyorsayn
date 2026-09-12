import Link from "next/link";
import { LiquidCard } from "@/components/ui/liquid-glass-card";
import { SectionReveal } from "@/components/ui/section-reveal";
import { MarkdownFilePreview } from "@/components/ui/markdown-file-preview";

const SITE_TYPES = [
  ["Landing page", "Présenter une offre et obtenir une action précise: appel, devis, essai ou achat."],
  ["Site vitrine", "Expliquer une activité, montrer des réalisations et faciliter la prise de contact."],
  ["Portfolio", "Montrer le travail, le rôle joué et les résultats obtenus sur chaque projet."],
  ["Site de contenu", "Répondre à des questions avec des articles, guides ou ressources."],
  ["E-commerce", "Aider à choisir, acheter, puis comprendre la livraison et les retours."],
  ["Site connecté", "Donner accès à un compte, des données privées, un paiement ou un service."],
] as const;

const PAGE_SECTIONS = [
  ["Navbar", "Logo, liens compréhensibles et action principale."],
  ["Hero section", "H1, Sous-titre, CTA principal et, si elle tient en peu de place, une première preuve."],
  ["Problème", "La situation que le client reconnaît avec ses propres mots."],
  ["Solution", "La façon simple dont l&apos;offre résout ce problème."],
  ["Démonstration", "Le produit en action, une capture annotée ou un avant/après réel."],
  ["Preuve sociale", "Une section dédiée avec cas client, avis autorisé ou résultat vérifiable."],
  ["Offre", "Ce qui est inclus, pour qui, à quelles conditions et avec quelles limites."],
  ["FAQ", "Les vraies questions entendues avant l&apos;achat."],
  ["CTA final", "La prochaine étape, répétée avec une réassurance factuelle."],
  ["Footer", "Contact, pages utiles, mentions légales et chemins de navigation."],
] as const;

const STYLES = [
  ["Minimalisme", "Espace, peu d&apos;éléments, hiérarchie nette."],
  ["Swiss design", "Grille stricte, typographie précise, contrastes francs."],
  ["Éditorial", "Grands titres, rythme de magazine, images légendées."],
  ["Brutalisme", "Structure exposée et composition volontairement rude."],
  ["Néo-brutalisme", "Contours épais, aplats vifs, ombres dures."],
  ["Skeuomorphism", "Contrôles inspirés d&apos;objets physiques."],
  ["Glassmorphism", "Panneaux translucides ponctuels sur un fond stable."],
  ["Liquid Glass", "Verre réactif pour une navigation ou un contrôle superposé."],
  ["Maximalisme", "Couleurs, motifs et typographies guidés par une idée forte."],
  ["Rétro-futurisme", "Chrome, grilles et vision ancienne du futur."],
  ["Dither / ASCII", "Trames, caractères et pixels comme langage graphique."],
] as const;

const TOOL_LOGOS = [
  ["Codex", "/brand-logos/codex.svg", true],
  ["Claude Code", "/brand-logos/claude-code.svg", false],
  ["Antigravity", "/brand-logos/antigravity.svg", false],
  ["GitHub", "/brand-logos/github.svg", true],
  ["Lovable", "/brand-logos/lovable.svg", false],
  ["Bolt", "/brand-logos/bolt-new.svg", true],
  ["Cursor", "/brand-logos/cursor.svg", true],
  ["Google AI Studio", "/brand-logos/google-ai-studio.png", false],
  ["Gemini", "/brand-logos/gemini.svg", false],
  ["Figma", "/brand-logos/figma.svg", false],
] as const;

const MEASURE_LOGOS = [
  ["Google Search Console", "/brand-logos/googlesearchconsole.svg", true],
  ["Plausible", "/brand-logos/plausibleanalytics.svg", true],
  ["PostHog", "/brand-logos/posthog.svg", true],
  ["PageSpeed Insights", "/brand-logos/pagespeedinsights.svg", true],
] as const;

function ChapterTitle({ marker, children }: { marker: string; children: React.ReactNode }) {
  return (
    <div className="mb-6 border-b border-white/10 pb-4">
      <p className="mb-2 font-mono text-[11px] tracking-[0.18em] text-[#e8d5b0]/60">09.{marker}</p>
      <h3 className="text-xl font-semibold tracking-tight text-[#f0ede8] md:text-2xl">{children}</h3>
    </div>
  );
}

function PlainNote({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-7 border-l-2 border-[#e8d5b0]/55 bg-[#e8d5b0]/[0.035] px-5 py-4">
      <p className="mb-1 text-sm font-semibold text-[#e8d5b0]">{title}</p>
      <div className="text-sm leading-relaxed text-white/65">{children}</div>
    </div>
  );
}

function ToolLogo({ name, src, invert = false }: { name: string; src: string; invert?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2 text-sm text-white/70">
      <img src={src} alt="" aria-hidden="true" width={24} height={24} loading="lazy" className={`h-6 w-6 object-contain ${invert ? "brightness-0 invert" : ""}`} />
      {name}
    </span>
  );
}

export function SectionSiteWeb() {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 motion-reduce:animate-none">
      <header className="mb-12">
        <div className="mb-6 flex items-center gap-3">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#e8d5b0]/60">09</span>
          <h2 className="text-2xl font-semibold tracking-tight text-[#f0ede8] md:text-3xl">Construire un site web avec l&apos;IA</h2>
        </div>
        <p className="max-w-3xl text-base leading-relaxed text-white/65">Un bon site aide une personne à comprendre ton offre, à vérifier qu&apos;elle est sérieuse et à agir. L&apos;IA accélère la recherche, l&apos;écriture, le design et le code. Elle ne connaît pas ton client, tes preuves ni ta marque si tu ne les lui donnes pas.</p>
      </header>

      <SectionReveal className="mb-16">
        <LiquidCard variant="elevated" className="p-6 md:p-8">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#e8d5b0]/65">Le but business</p>
          <h3 className="mb-3 text-xl font-semibold text-[#f0ede8]">Une page, une personne, une prochaine étape</h3>
          <p className="max-w-3xl text-sm leading-relaxed text-white/65">Complète cette phrase: « Mon client arrive parce que..., il doit comprendre..., puis il peut... ». Si la réponse reste floue, ne commence pas par les couleurs.</p>
        </LiquidCard>
      </SectionReveal>

      <SectionReveal className="mb-16">
        <ChapterTitle marker="1">Quel site faut-il vraiment?</ChapterTitle>
        <p className="mb-6 max-w-3xl text-sm leading-relaxed text-white/65">Le format dépend de l&apos;action attendue. Une landing page peut suffire pour tester une offre. Un site connecté devient utile seulement si la personne doit se connecter, payer ou retrouver ses données.</p>
        <div className="divide-y divide-white/10 border-y border-white/10">
          {SITE_TYPES.map(([name, role]) => <div key={name} className="grid gap-1 py-4 sm:grid-cols-[10rem_1fr] sm:gap-6"><p className="font-medium text-[#e8d5b0]">{name}</p><p className="text-sm leading-relaxed text-white/60">{role}</p></div>)}
        </div>
      </SectionReveal>

      <SectionReveal className="mb-16">
        <ChapterTitle marker="2">La structure d&apos;une page qui vend</ChapterTitle>
        <p className="mb-6 max-w-3xl text-sm leading-relaxed text-white/65">Une page répond aux questions dans l&apos;ordre où elles arrivent. Cette anatomie est complète mais adaptable. Une petite preuve peut vivre dans le hero, puis une section de preuve sociale plus riche peut arriver plus bas.</p>
        <div className="grid gap-8 lg:grid-cols-[0.7fr_1.3fr]">
          <div className="border border-[#e8d5b0]/25 bg-[#111113] lg:sticky lg:top-24 lg:self-start">
            <div className="flex justify-between border-b border-white/10 px-4 py-3 text-xs text-white/60"><strong className="text-white/80">Navbar</strong><span>Logo · Liens · CTA</span></div>
            <div className="px-5 py-8 text-center"><p className="mb-2 text-[10px] uppercase tracking-[0.18em] text-[#e8d5b0]/60">Hero section</p><p className="mx-auto max-w-xs text-xl font-semibold text-white">H1: le résultat compris en quelques secondes</p><p className="mx-auto mt-3 max-w-sm text-xs leading-relaxed text-white/60">Sous-titre: pour qui, comment et avec quelle différence.</p><span className="mt-5 inline-block bg-[#e8d5b0] px-4 py-2 text-xs font-semibold text-[#161618]">CTA principal</span><p className="mt-2 text-[10px] text-white/60">Réponse en 24 h, uniquement si c&apos;est vrai</p></div>
            {PAGE_SECTIONS.slice(2).map(([name]) => <div key={name} className="border-t border-white/10 px-4 py-3 text-xs text-white/60">{name}</div>)}
          </div>
          <div className="divide-y divide-white/10 border-y border-white/10">{PAGE_SECTIONS.map(([name, role], index) => <div key={name} className="grid gap-2 py-4 sm:grid-cols-[2.5rem_9rem_1fr] sm:gap-4"><span className="font-mono text-xs text-[#e8d5b0]/60">{String(index + 1).padStart(2, "0")}</span><strong className="text-sm text-[#f0ede8]">{name}</strong><span className="text-sm leading-relaxed text-white/60">{role}</span></div>)}</div>
        </div>
        <PlainNote title="L&apos;ordre des sections est adaptable"><p>Une personne qui te connaît déjà peut voir l&apos;offre plus tôt. Une personne qui découvre le problème a besoin de contexte. Garde le fil: comprendre, vérifier, décider.</p></PlainNote>
      </SectionReveal>

      <SectionReveal className="mb-16">
        <ChapterTitle marker="3">La proposition de valeur et le copywriting</ChapterTitle>
        <p className="mb-6 max-w-3xl text-sm leading-relaxed text-white/65">La proposition de valeur dit qui tu aides, quel résultat la personne obtient et pourquoi elle peut te croire. Le copywriting aide à rendre la décision claire sans gonfler la promesse.</p>
        <div className="grid gap-px bg-white/10 md:grid-cols-2"><div className="bg-[#161618] p-5"><p className="mb-3 text-xs uppercase tracking-[0.14em] text-white/60">Faible</p><p className="text-lg text-white/65">« Des solutions digitales innovantes pour votre croissance. »</p></div><div className="bg-[#161618] p-5"><p className="mb-3 text-xs uppercase tracking-[0.14em] text-[#e8d5b0]/70">Mieux</p><p className="text-lg text-white/80">« Un site clair pour que les artisans reçoivent des demandes de devis qualifiées. »</p></div></div>
        <div className="mt-8 grid gap-6 md:grid-cols-2"><div className="border-t border-white/10 pt-5"><p className="mb-2 text-xs uppercase tracking-[0.14em] text-white/60">Fonctionnalité</p><p className="text-white/70">« Agenda avec rappels automatiques. »</p></div><div className="border-t border-[#e8d5b0]/30 pt-5"><p className="mb-2 text-xs uppercase tracking-[0.14em] text-[#e8d5b0]/65">Bénéfice</p><p className="text-white/80">« Tes clients se souviennent du rendez-vous, sans relance manuelle. »</p></div></div>
        <div className="mt-8 grid gap-8 md:grid-cols-2"><div><h4 className="mb-3 font-semibold text-[#f0ede8]">Écris avec les mots de tes clients</h4><p className="text-sm leading-relaxed text-white/60">Relis appels, emails, avis et questions de vente. Garde une phrase concrète comme « je perds mes soirées à faire les devis » plutôt que « optimiser les opérations ».</p></div><div><h4 className="mb-3 font-semibold text-[#f0ede8]">Un CTA dit ce que la personne obtient</h4><div className="space-y-2 text-sm text-white/60"><p>Faible: Envoyer, Soumettre, Cliquez ici.</p><p>Mieux: Recevoir mon devis, Voir la démo, Réserver mon appel.</p><p>Garde un CTA principal par écran et une réassurance vraie dessous.</p></div></div></div>
        <PlainNote title="Réduis la friction du formulaire"><div className="space-y-3"><p>Demande seulement ce qui sert à la prochaine étape. Chaque champ garde un libellé visible et indique s&apos;il est obligatoire ou facultatif.</p><p>Affiche un message d&apos;erreur près du champ et explique comment corriger la saisie. Après l&apos;envoi, montre une confirmation claire, vérifie où arrive la demande et qui la traite.</p><p>Près du bouton, explique l&apos;utilisation de ses données et donne accès à la politique de confidentialité.</p></div></PlainNote>
      </SectionReveal>

      <SectionReveal className="mb-16">
        <ChapterTitle marker="4">Construire une vraie identité</ChapterTitle>
        <div className="grid gap-7 lg:grid-cols-[1fr_auto] lg:items-start"><div><p className="text-sm leading-relaxed text-white/65">Le style suit la marque, l&apos;audience et le contexte. Cherche sur Pinterest, constitue un moodboard et regarde au-delà du web: architecture, édition, mode, photographie, packaging, cinéma, objets ou signalétique. Demande quelle âme, quelle esthétique, quelle émotion et quel statut le site doit transmettre.</p><p className="mt-3 text-sm leading-relaxed text-white/60">Une référence ne se copie pas. Nomme ce que tu retiens: contraste, rythme, matière, cadrage ou densité. Liquid Glass vient du langage visuel d&apos;Apple. Cela explique son origine, pas une obligation de donner à chaque marque une apparence Apple.</p></div><ToolLogo name="Pinterest" src="/brand-logos/pinterest.svg" invert /></div>
        <div className="mt-7 grid gap-x-8 border-y border-white/10 sm:grid-cols-2 lg:grid-cols-3">{STYLES.map(([name, look]) => <div key={name} className="grid grid-cols-[8.5rem_1fr] gap-3 border-b border-white/10 py-3 last:border-b-0 sm:grid-cols-1"><strong className="text-sm text-[#f0ede8]">{name}</strong><span className="text-xs leading-relaxed text-white/60">{look}</span></div>)}</div>
        <PlainNote title="Évite le contenu générique produit par l&apos;IA"><div className="grid gap-3 md:grid-cols-2"><p>Ce rendu est parfois appelé AI slop: mêmes gradients, mêmes cartes, mêmes textes et mêmes icônes pour toutes les marques.</p><p>Utilise tes photos, captures, textures, mots et preuves. Ne fabrique jamais d&apos;avis, de logos, de compteurs ou de résultats.</p></div></PlainNote>
        <div className="mt-7"><MarkdownFilePreview filename="DESIGN-SYSTEM.md">{`# DESIGN-SYSTEM.md

Extrait éducatif attribué à Atelier by Orsayn
Source: design-system.md, lui-même extrait de app/styles.css et app/components/AtelierIcons.tsx. En cas de divergence, le code Atelier fait foi.

Thèse visuelle: « Gomme dure sur papier crème. » Des objets physiques, une ombre-socle nette, un double liseré interne et un accent orange utilisé sans dilution.

Couleurs: --paper #F7F4EE; --ink #080807; --surface #EEE8DF; --orange #FF9F1C pour l'action; --green #B4F481 pour la validation; --indigo #6864ED pour une seule carte par grille; --muted #6E6A62; --line rgba(8,8,7,.12).

Typographie: Geist Variable uniquement. H1 clamp(46px, 6.3vw, 90px), tracking -0.07em, line-height .98, poids 600. Corps 16 à 20px, line-height 1.6 à 1.75.

Formes et surfaces: boutons en pilule 999px; grandes cartes 28px; panneaux 16 à 24px. Grille bento asymétrique 7/5 puis 4/4/4. Une grande surface associe ombre-socle ou double liseré, jamais une faible bordure isolée.

États: bouton hover translateY(-1px), active translateY(3px), transition .16s ease. Les cartes de lecture ne bougent pas au survol; seules bordure et ombre changent. Champ focus: bordure orange et halo 0 0 0 3px rgba(255,159,28,.18).

Responsive et accessibilité: marges minimales 24px; ruptures à 1180px et 800px; focus visible orange de 3px; cibles tactiles de 44 à 48px; icônes décoratives aria-hidden; prefers-reduced-motion coupe les animations.

Provenance: police public/fonts/geist-variable.woff2; icônes de marque app/components/AtelierIcons.tsx; icônes fonctionnelles lucide-react; sources de vérité app/styles.css et app/components/AtelierIcons.tsx.`}</MarkdownFilePreview></div>
        <p className="mt-4 text-sm leading-relaxed text-white/60">Le skill <span className="font-mono text-[#e8d5b0]">ux-ui-design</span> produit un système plus complet pour ton propre projet. Tu peux demander à l&apos;IA de capitaliser sur la précision de cet exemple, sans copier Atelier.</p>
      </SectionReveal>

      <SectionReveal className="mb-16">
        <ChapterTitle marker="5">Construire un site avec l&apos;IA en utilisant les skills</ChapterTitle>
        <p className="mb-6 max-w-3xl text-sm leading-relaxed text-white/65">Choisis la profondeur selon le risque et l&apos;ambition du projet. Les skills produisent nativement les documents de projet nécessaires. Tu n&apos;as pas besoin de forcer des noms de fichiers manuels.</p>
        <div className="divide-y divide-white/10 border-y border-white/10">
          <div className="grid gap-2 py-5 md:grid-cols-[12rem_1fr]"><strong className="text-[#e8d5b0]">Un seul skill</strong><p className="text-sm leading-relaxed text-white/60"><Link href="/skills#skill-oracle-site-web" className="font-mono text-[#e8d5b0] underline underline-offset-4">oracle-site-web</Link> seul pour cadrer une offre simple, structurer les pages, écrire, construire et vérifier le site.</p></div>
          <div className="grid gap-2 py-5 md:grid-cols-[12rem_1fr]"><strong className="text-[#e8d5b0]">Plusieurs skills</strong><p className="text-sm leading-relaxed text-white/60"><span className="font-mono text-[#e8d5b0]">oracle-site-web</span> pour le socle, puis <span className="font-mono text-[#e8d5b0]">ux-ui-design</span> et les Skills Apple pour approfondir la direction, les composants, les états, le responsive et l&apos;accessibilité.</p></div>
          <div className="grid gap-2 py-5 md:grid-cols-[12rem_1fr]"><strong className="text-[#e8d5b0]">Workflow complet</strong><p className="text-sm leading-relaxed text-white/60"><span className="font-mono text-[#e8d5b0]">deep-research-vertical</span> pour comprendre le marché, puis <span className="font-mono text-[#e8d5b0]">oracle-site-web</span>, puis le skill adapté: design, <span className="font-mono text-[#e8d5b0]">backend-orsayn</span> ou article selon le besoin.</p></div>
        </div>
        <div className="mt-8 border-t border-white/10 pt-6"><h4 className="mb-4 font-semibold text-[#f0ede8]">Outils possibles</h4><div className="flex flex-wrap gap-x-7 gap-y-4">{TOOL_LOGOS.map(([name, src, invert]) => <ToolLogo key={name} name={name} src={src} invert={invert} />)}</div><p className="mt-4 max-w-3xl text-sm leading-relaxed text-white/60">Ces exemples ne sont pas exhaustifs. Certains outils écrivent du code, d&apos;autres facilitent une première version visuelle ou le travail de design. GitHub conserve les versions. Donne un périmètre précis, puis regarde et teste le résultat.</p></div>
      </SectionReveal>

      <SectionReveal className="mb-16">
        <ChapterTitle marker="6">Le SEO, expliqué simplement</ChapterTitle>
        <p className="mb-6 max-w-3xl text-sm leading-relaxed text-white/65">Le SEO aide un moteur à comprendre à quelle recherche une page répond. Commence par une page utile pour un besoin précis, un titre clair, une adresse lisible, des sous-titres logiques, de vraies preuves et un site rapide sur mobile.</p>
        <div className="grid gap-8 md:grid-cols-2"><div><h4 className="mb-3 font-semibold text-[#f0ede8]">Le maillage interne</h4><p className="text-sm leading-relaxed text-white/60">Ce sont les liens entre tes pages. Une page de service peut mener vers un cas client et un guide, puis ces pages peuvent ramener vers l&apos;offre. Chaque lien doit aider le lecteur à poursuivre une question réelle.</p></div><div><h4 className="mb-3 font-semibold text-[#f0ede8]">Le cocon sémantique</h4><p className="text-sm leading-relaxed text-white/60">C&apos;est un ensemble organisé de pages sur un même sujet: une page centrale répond au besoin principal, des pages proches approfondissent des sous-questions, et leurs liens rendent la relation explicite.</p></div></div>
        <PlainNote title="Jusqu&apos;où va BUILD?"><p>BUILD donne les bases pour ne pas partir à l&apos;aveugle. Pour une stratégie SEO avancée, la recherche de requêtes, la concurrence, l&apos;architecture éditoriale et la mesure dans la durée se délèguent à <strong className="text-[#e8d5b0]">Protocole Zéro</strong>.</p></PlainNote>
      </SectionReveal>

      <SectionReveal className="mb-16">
        <ChapterTitle marker="7">Mesurer ce qui aide le business</ChapterTitle>
        <p className="mb-6 max-w-3xl text-sm leading-relaxed text-white/65">Chaque mesure doit répondre à une question: les bonnes personnes trouvent-elles le site, comprennent-elles l&apos;offre et terminent-elles l&apos;action?</p>
        <div className="mb-7 flex flex-wrap gap-x-7 gap-y-4">{MEASURE_LOGOS.map(([name, src, invert]) => <ToolLogo key={name} name={name} src={src} invert={invert} />)}</div>
        <div className="divide-y divide-white/10 border-y border-white/10"><div className="grid gap-2 py-5 md:grid-cols-[14rem_1fr]"><strong className="text-sm text-[#e8d5b0]">Google Search Console</strong><p className="text-sm leading-relaxed text-white/60">Montre les impressions, les clics, les requêtes, la position moyenne et les problèmes d&apos;indexation.</p></div><div className="grid gap-2 py-5 md:grid-cols-[14rem_1fr]"><strong className="text-sm text-[#e8d5b0]">Plausible ou PostHog</strong><p className="text-sm leading-relaxed text-white/60">Comptent les visiteurs et les actions utiles. PostHog aide aussi à observer un parcours plus complexe.</p></div><div className="grid gap-2 py-5 md:grid-cols-[14rem_1fr]"><strong className="text-sm text-[#e8d5b0]">PageSpeed Insights</strong><p className="text-sm leading-relaxed text-white/60">Repère ce qui ralentit la page ou déplace le contenu, surtout sur mobile.</p></div></div>
        <div className="mt-7 overflow-x-auto border-y border-[#e8d5b0]/25 py-5"><div className="flex min-w-[680px] items-center justify-between gap-3 font-mono text-sm text-[#e8d5b0]"><span>visiteurs</span><span className="text-white/60">→</span><span>CTA</span><span className="text-white/60">→</span><span>formulaire commencé</span><span className="text-white/60">→</span><span>formulaire envoyé</span><span className="text-white/60">→</span><span>client</span></div></div>
      </SectionReveal>

      <SectionReveal>
        <ChapterTitle marker="8">Tester le vrai parcours avant la mise en ligne</ChapterTitle>
        <p className="max-w-3xl text-sm leading-relaxed text-white/65">Ouvre le vrai site sur téléphone et ordinateur. Essaie le parcours principal, la navigation au clavier, le formulaire avec de bonnes et de mauvaises données, les liens et les images. <span className="font-mono text-[#e8d5b0]">oracle-site-web</span> organise et exécute ces contrôles dans son workflow, puis signale ce qui reste à corriger. La mise en ligne appartient au Bloc 10.</p>
      </SectionReveal>
    </div>
  );
}
