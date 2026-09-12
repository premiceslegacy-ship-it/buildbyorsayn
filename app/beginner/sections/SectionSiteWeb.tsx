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
  ["Solution", "Ce que l'offre change concrètement pour sortir de cette situation."],
  ["Démonstration", "Le produit en action, une capture annotée ou un avant/après réel."],
  ["Preuve sociale", "Une section dédiée avec cas client, avis autorisé ou résultat vérifiable."],
  ["Offre", "Ce qui est inclus, pour qui, à quelles conditions et avec quelles limites."],
  ["FAQ", "Les vraies questions entendues avant l'achat."],
  ["CTA final", "La prochaine étape, répétée avec une réassurance factuelle."],
  ["Footer", "Contact, pages utiles, mentions légales et chemins de navigation."],
] as const;

const STYLES = [
  ["Minimalisme", "Espace, peu d'éléments, hiérarchie nette."],
  ["Swiss design", "Grille stricte, typographie précise, contrastes francs."],
  ["Éditorial", "Grands titres, rythme de magazine, images légendées."],
  ["Brutalisme", "Structure exposée et composition volontairement rude."],
  ["Néo-brutalisme", "Contours épais, aplats vifs, ombres dures."],
  ["Skeuomorphism", "Contrôles inspirés d'objets physiques."],
  ["Glassmorphism", "Panneaux translucides ponctuels sur un fond stable."],
  ["Liquid Glass", "Verre réactif pour une navigation ou un contrôle superposé."],
  ["Maximalisme", "Couleurs, motifs et typographies guidés par une idée forte."],
  ["Rétro-futurisme", "Chrome, grilles et vision ancienne du futur."],
  ["Dither / ASCII", "Trames, caractères et pixels comme langage graphique."],
] as const;

const TOOL_LOGOS = [
  ["Codex", "/brand-logos/codex.svg", false],
  ["Claude Code", "/brand-logos/claude-code.svg", false],
  ["Antigravity", "/brand-logos/antigravity.svg", false],
  ["GitHub", "/brand-logos/github.svg", true],
  ["Lovable", "/brand-logos/lovable.svg", false],
  ["Bolt", "/brand-logos/bolt-new.svg", false],
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
        <ChapterTitle marker="5">Donner une vraie mission à l&apos;IA</ChapterTitle>
        <p className="mb-6 max-w-3xl text-sm leading-relaxed text-white/65">Un workflow n&apos;est pas une recette à suivre à la lettre. C&apos;est une demande organisée autour d&apos;un résultat. Tu peux commencer par un seul skill, en combiner deux ou en demander davantage si ton outil sait les charger. L&apos;ordre dépend de ton projet, de tes informations et de ce que tu veux obtenir.</p>
        <div className="grid gap-px bg-white/10 md:grid-cols-3">
          <div className="bg-[#161618] p-5"><h4 className="mb-2 font-semibold text-[#f0ede8]">Un seul skill peut suffire</h4><p className="text-sm leading-relaxed text-white/60">Une landing page, un site vitrine, un article, une identité visuelle ou un espace connecté. Plus le résultat attendu est concret, plus l&apos;IA peut vérifier son travail.</p></div>
          <div className="bg-[#161618] p-5"><h4 className="mb-2 font-semibold text-[#f0ede8]">Plusieurs skills si nécessaire</h4><p className="text-sm leading-relaxed text-white/60">Ajoute ton offre, ton client, tes preuves, tes contraintes, les fichiers à lire et le dossier où se trouve ta recherche. Une IA ne devine pas ce qu&apos;elle ne peut pas consulter.</p></div>
          <div className="bg-[#161618] p-5"><h4 className="mb-2 font-semibold text-[#f0ede8]">Workflow complet, si tu le veux</h4><p className="text-sm leading-relaxed text-white/60">Elle peut utiliser plusieurs skills, reprendre une étape après ton retour, produire le code et préparer les contrôles. Tu gardes la main sur le périmètre, les références et la validation.</p></div>
        </div>
        <PlainNote title="Le Protocole Zéro apprend à absorber une méthode"><div className="space-y-3"><p>Dans BUILD, le Protocole Zéro n&apos;est pas une prestation à envoyer ailleurs. C&apos;est la façon d&apos;absorber une compétence quand les fondations ne suffisent plus: partir d&apos;une source, en extraire les principes et les exceptions, vérifier ce que l&apos;on a compris, puis transformer cette méthode en skill, en procédure ou en document réutilisable.</p><p>Tu ne collectionnes donc pas des prompts. Tu fais passer une connaissance dans un vrai projet, tu regardes ce qui fonctionne, puis tu l&apos;améliores. La recherche de marché, le design, le SEO ou le backend peuvent ainsi devenir des briques que l&apos;IA réutilise avec ton contexte.</p></div></PlainNote>
        <div className="mt-8 divide-y divide-white/10 border-y border-white/10">
          <div className="grid gap-2 py-5 md:grid-cols-[12rem_1fr]"><strong className="text-[#e8d5b0]">Comprendre le terrain</strong><p className="text-sm leading-relaxed text-white/60"><Link href="/skills#skill-deep-research-vertical" className="font-mono text-[#e8d5b0] underline underline-offset-4">deep-research-vertical</Link> aide à comprendre une niche: ses clients, leurs mots, leurs douleurs, ses concurrents et les preuves disponibles.</p></div>
          <div className="grid gap-2 py-5 md:grid-cols-[12rem_1fr]"><strong className="text-[#e8d5b0]">Construire et vérifier</strong><p className="text-sm leading-relaxed text-white/60"><Link href="/skills#skill-oracle-site-web" className="font-mono text-[#e8d5b0] underline underline-offset-4">oracle-site-web</Link> transforme ce contexte en pages, textes, SEO technique, documents de projet, performance et contrôles de livraison.</p></div>
          <div className="grid gap-2 py-5 md:grid-cols-[12rem_1fr]"><strong className="text-[#e8d5b0]">Ajouter la bonne expertise</strong><p className="text-sm leading-relaxed text-white/60">Ajoute <Link href="/skills#skill-ux-ui-design" className="font-mono text-[#e8d5b0] underline underline-offset-4">ux-ui-design</Link> si le besoin est visuel. Les <span className="font-mono text-[#e8d5b0]">Skills Apple</span> peuvent pousser les composants, les états et l&apos;accessibilité. Utilise <Link href="/skills#skill-backend-orsayn" className="font-mono text-[#e8d5b0] underline underline-offset-4">backend-orsayn</Link> si le site manipule des comptes, des données ou des paiements, et le skill article <span className="font-mono text-[#e8d5b0]">site-content-engine</span> si le site doit publier un contenu SEO suivi dans le temps.</p></div>
        </div>
        <div className="mt-8"><h4 className="mb-3 font-semibold text-[#f0ede8]">Tout mettre dans le même prompt</h4><p className="mb-4 max-w-3xl text-sm leading-relaxed text-white/60">Tu peux préciser le dossier à consulter, les sites à observer, les images à prendre comme références, les fichiers à créer et les limites à respecter. Voici un exemple de demande, à adapter à ton projet:</p><pre className="overflow-x-auto whitespace-pre-wrap break-words border border-white/10 bg-black/30 px-5 py-4 font-mono text-xs leading-6 text-[#e8d5b0]">{`Travaille sur le site de mon activité.
Lis d'abord la recherche présente dans /projets/mon-site/recherche.
Utilise deep-research-vertical pour en extraire les clients, les objections et les mots du marché.
Puis utilise oracle-site-web pour structurer les pages, écrire le contenu et construire le site.
Ajoute ux-ui-design pour la direction visuelle.
Si ton modèle peut générer des images, propose puis crée les visuels utiles. Sinon, prépare les prompts et indique les fichiers à fournir.
Prends https://exemple.com comme référence de structure et /projets/mon-site/references/image.jpg comme référence visuelle, sans copier.
Travaille dans /projets/mon-site, ne modifie pas les autres dossiers et montre-moi ce que tu as vérifié avant de livrer.`}</pre></div>
        <PlainNote title="Une liberté qui reste réaliste"><p>Le chemin local doit être accessible à l&apos;outil et la génération d&apos;images dépend du modèle ou de l&apos;application utilisée. Si ce n&apos;est pas possible, joins les fichiers ou demande une préparation. Dans tous les cas, tu peux exprimer le résultat, les références et les contraintes dans tes propres mots.</p></PlainNote>
        <div className="mt-8 border-t border-white/10 pt-6">
          <h4 className="mb-3 font-semibold text-[#f0ede8]">Transformer un site validé en template réutilisable</h4>
          <p className="max-w-3xl text-sm leading-relaxed text-white/60">Quand un design system, une architecture et une version globale du site te plaisent, demande à l&apos;IA de produire un <span className="font-mono text-[#e8d5b0]">skill.md</span> du site entier. Ce fichier devient la notice de reproduction de la base validée: il décrit l&apos;identité visuelle, les couleurs, les typographies, les composants, les mises en page, la navigation, le responsive, les interactions, la structure des fichiers, les assets attendus, les règles de contenu, le SEO et les contrôles à refaire.</p>
          <div className="mt-6 grid gap-px bg-white/10 md:grid-cols-3">
            <div className="bg-[#161618] p-5"><h5 className="mb-2 font-semibold text-[#f0ede8]">Capitaliser</h5><p className="text-sm leading-relaxed text-white/60">Le site approuvé devient un savoir réutilisable, avec sa logique visuelle, son architecture et ses règles de qualité, pas seulement une capture d&apos;écran.</p></div>
            <div className="bg-[#161618] p-5"><h5 className="mb-2 font-semibold text-[#f0ede8]">Adapter</h5><p className="text-sm leading-relaxed text-white/60">Pour un autre projet, tu fournis le contexte puis tu changes le copywriting, les textes, les couleurs, le logo, les photos, les illustrations, les preuves, les offres, les URLs et les intégrations qui appartiennent à ce nouveau site.</p></div>
            <div className="bg-[#161618] p-5"><h5 className="mb-2 font-semibold text-[#f0ede8]">Répliquer</h5><p className="text-sm leading-relaxed text-white/60">L&apos;IA recharge le skill, reprend la même base et conserve l&apos;expérience validée. Tu peux demander une nouvelle version pour un client, pour ton activité ou pour un autre domaine sans repartir de zéro.</p></div>
          </div>
          <PlainNote title="Un levier de production pour une agence"><div className="space-y-3"><p>Une galerie interne peut regrouper ces templates sous forme de skills: aperçu du site, design system, architecture, version, contraintes, assets et contrôles déjà validés. Quand un prospect arrive, tu sélectionnes une base, tu donnes le contexte du client et l&apos;IA prépare une maquette ou un site adapté.</p><p>La galerie accélère l&apos;exécution sans imposer des clones impersonnels. La structure et les standards restent stables; tout ce qui est propre au client est réécrit ou remplacé. Une relecture humaine vérifie ensuite le message, les preuves, les assets, l&apos;accessibilité, le responsive, le SEO et le parcours avant livraison.</p></div></PlainNote>
        </div>
        <div className="mt-8 border-t border-white/10 pt-6"><h4 className="mb-4 font-semibold text-[#f0ede8]">Quelques outils possibles</h4><div className="flex flex-wrap gap-x-7 gap-y-4">{TOOL_LOGOS.map(([name, src, invert]) => <ToolLogo key={name} name={name} src={src} invert={invert} />)}</div><p className="mt-4 max-w-3xl text-sm leading-relaxed text-white/60">Codex, Claude Code, ChatGPT, Bolt et les autres sont des portes d&apos;entrée, pas des parcours obligatoires. Certains écrivent surtout du code, d&apos;autres aident à prototyper, à concevoir ou à produire des images. Le bon choix est celui qui peut lire ton contexte et te laisser vérifier le résultat.</p></div>
      </SectionReveal>

      <SectionReveal className="mb-16">
        <ChapterTitle marker="6">Le SEO, expliqué simplement</ChapterTitle>
        <p className="mb-6 max-w-3xl text-sm leading-relaxed text-white/65">Le SEO aide les moteurs de recherche à comprendre quelle page répond à quelle question. Il ne consiste pas à répéter des mots-clés. On commence par une page utile pour une intention réelle, puis on vérifie qu&apos;elle est lisible, accessible, rapide et techniquement découvrable.</p>
        <div className="divide-y divide-white/10 border-y border-white/10">
          <div className="grid gap-2 py-5 md:grid-cols-[13rem_1fr]"><strong className="text-[#e8d5b0]">Une intention par page</strong><p className="text-sm leading-relaxed text-white/60">Une page doit répondre à un besoin précis et apporter quelque chose d&apos;utile. Ne crée pas plusieurs pages presque identiques pour occuper les résultats. Pour une activité locale, une page par zone n&apos;a de sens que si son contenu et ses preuves sont réellement différents.</p></div>
          <div className="grid gap-2 py-5 md:grid-cols-[13rem_1fr]"><strong className="text-[#e8d5b0]">Une page compréhensible</strong><p className="text-sm leading-relaxed text-white/60">Donne à chaque page un titre unique, un H1 clair, des sous-titres logiques, une adresse lisible et une description utile dans les résultats. Écris d&apos;abord pour la personne: vocabulaire précis, réponse directe, exemples et preuves réelles.</p></div>
          <div className="grid gap-2 py-5 md:grid-cols-[13rem_1fr]"><strong className="text-[#e8d5b0]">Des liens qui aident</strong><p className="text-sm leading-relaxed text-white/60">Le maillage interne relie les pages entre elles. Un article peut mener vers une page de service, une réalisation peut expliquer la méthode et chaque lien doit aider le lecteur à poursuivre sa décision. Le cocon sémantique organise ce réseau autour d&apos;un sujet, sans fabriquer des pages pour le simple volume.</p></div>
          <div className="grid gap-2 py-5 md:grid-cols-[13rem_1fr]"><strong className="text-[#e8d5b0]">Être découvrable</strong><p className="text-sm leading-relaxed text-white/60">Un sitemap liste les URLs importantes. Le fichier robots.txt ne doit pas bloquer une page utile. Une URL canonique indique la version principale quand plusieurs adresses se ressemblent. Les données structurées peuvent préciser un type de contenu lorsqu&apos;elles correspondent vraiment à la page.</p></div>
          <div className="grid gap-2 py-5 md:grid-cols-[13rem_1fr]"><strong className="text-[#e8d5b0]">Rester agréable à utiliser</strong><p className="text-sm leading-relaxed text-white/60">Teste le site sur mobile, sécurise-le en HTTPS, compresse les images, réserve leur place pour éviter les déplacements de contenu et ajoute un texte alternatif quand une image apporte une information. La vitesse et l&apos;accessibilité servent d&apos;abord les personnes, puis la visibilité.</p></div>
        </div>
        <PlainNote title="Ce que tu vérifies dans Google Search Console"><div className="space-y-3"><p><strong className="text-white/80">1. La propriété et le sitemap.</strong> Ajoute le domaine, envoie l&apos;adresse du sitemap et vérifie que le fichier est accepté. Le sitemap aide Google à découvrir les pages, mais il ne garantit ni leur indexation ni leur position.</p><p><strong className="text-white/80">2. Les pages importantes.</strong> Avec l&apos;outil d&apos;inspection de l&apos;URL, regarde si une page est connue, si Google peut l&apos;explorer et si une demande d&apos;indexation est pertinente après une nouvelle mise en ligne. Une demande n&apos;est pas une promesse de résultat immédiat.</p><p><strong className="text-white/80">3. Les résultats.</strong> Le rapport sur les performances montre les requêtes, impressions, clics, taux de clic et position moyenne. Le rapport d&apos;indexation aide à comprendre les pages exclues ou les erreurs. Lis ces données pour décider quelle page améliorer, pas pour courir après un chiffre isolé.</p><div className="flex flex-wrap gap-x-5 gap-y-2 pt-2 text-xs"><Link href="https://developers.google.com/search/docs/fundamentals/seo-starter-guide?hl=fr" target="_blank" rel="noreferrer" className="text-[#e8d5b0] underline underline-offset-4">Guide SEO Google ↗</Link><Link href="https://support.google.com/webmasters/answer/9012289?hl=fr" target="_blank" rel="noreferrer" className="text-[#e8d5b0] underline underline-offset-4">Inspection de l&apos;URL ↗</Link><Link href="https://support.google.com/webmasters/answer/7451001?hl=fr" target="_blank" rel="noreferrer" className="text-[#e8d5b0] underline underline-offset-4">Rapport Sitemaps ↗</Link><Link href="https://support.google.com/webmasters/answer/7576553?hl=fr" target="_blank" rel="noreferrer" className="text-[#e8d5b0] underline underline-offset-4">Performances ↗</Link></div></div></PlainNote>
        <PlainNote title="Le rôle d&apos;oracle-site-web et d&apos;IndexNow"><div className="space-y-3"><p><Link href="/skills#skill-oracle-site-web" className="font-mono text-[#e8d5b0] underline underline-offset-4">oracle-site-web</Link> ne se limite pas à remplir des balises. Il peut organiser les métadonnées, les URLs, le sitemap, le fichier robots.txt, les canoniques, les données structurées pertinentes, les contrôles de performance et les vérifications de livraison.</p><p>Quand c&apos;est utile, <strong className="text-[#e8d5b0]">IndexNow</strong> prévient les moteurs qui participent à ce protocole qu&apos;une URL a changé. IndexNow ne couvre pas Google et ne garantit ni l&apos;indexation ni le classement. Pour Google, garde le sitemap et Search Console. Une bonne pratique n&apos;est pas un bouton magique: elle rend le site compréhensible et permet de voir ce qui se passe.</p><Link href="https://www.indexnow.org/documentation" target="_blank" rel="noreferrer" className="inline-block text-xs text-[#e8d5b0] underline underline-offset-4">Documentation IndexNow ↗</Link></div></PlainNote>
        <PlainNote title="Le SEO avancé reste dans BUILD"><div className="space-y-3"><p>Les Fondations t&apos;apprennent le socle pour ne pas avancer à l&apos;aveugle. Si le projet doit aller plus loin, tu ne quittes pas BUILD et tu ne renvoies pas automatiquement le travail vers une prestation extérieure: le <strong className="text-[#e8d5b0]">Protocole Zéro</strong> fait partie du parcours.</p><p>Il sert à absorber une méthode plus poussée, puis à la rendre réutilisable: recherche de requêtes, lecture de la concurrence, architecture éditoriale, mesure dans la durée et décisions fondées sur les données. La recherche est vérifiée, transformée en méthode et testée sur le vrai site. Le niveau avancé est donc une continuité des fondations, pas une rupture de promesse.</p></div></PlainNote>
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
