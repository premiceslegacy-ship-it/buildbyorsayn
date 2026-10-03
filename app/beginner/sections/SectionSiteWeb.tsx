import Image from "next/image";
import Link from "next/link";
import { SectionReveal } from "@/components/ui/section-reveal";
import { MarkdownFilePreview } from "@/components/ui/markdown-file-preview";
import { FoundationEditorialNote } from "../FoundationEditorialNote";

const SITE_TYPES = [
  ["Landing page", "Présenter une offre et obtenir une action précise: appel, devis, essai ou achat."],
  ["Site vitrine", "Expliquer une activité, montrer des réalisations et faciliter la prise de contact."],
  ["Portfolio", "Montrer le travail, le rôle joué et les résultats obtenus sur chaque projet."],
  ["Site de contenu", "Répondre à des questions avec des articles, guides ou ressources."],
  ["E-commerce", "Aider à choisir, acheter, puis comprendre la livraison et les retours."],
  ["Site connecté", "Donner accès à un compte, des données privées, un paiement ou un service."],
] as const;

const PAGE_ARCHITECTURES = [
  {
    name: "Page de découverte",
    fit: "Trafic froid, problème encore mal formulé.",
    sequence: "Situation → coût concret → mécanisme → preuve → offre → FAQ → action",
  },
  {
    name: "Page d'offre",
    fit: "Personne déjà consciente du problème ou de la catégorie.",
    sequence: "Promesse → critères de choix → démonstration → preuve → conditions → achat",
  },
  {
    name: "Page produit",
    fit: "Produit ou service que la personne compare déjà.",
    sequence: "Scène d'usage → capacité → démonstration → limites → comparaison → action",
  },
  {
    name: "Page de capture",
    fit: "Une prochaine conversation vaut mieux qu'une vente immédiate.",
    sequence: "Contexte → progrès promis → preuve de pertinence → formulaire court → suite claire",
  },
] as const;

const PAGE_MODULES = [
  ["Situation", "Le moment réel qui amène la personne sur la page."],
  ["Progrès", "Ce qui devient possible, avec son horizon et ses conditions."],
  ["Mécanisme", "Comment l'offre agit concrètement, sans nom magique."],
  ["Démonstration", "Un artefact, une capture, un exemple ou une étape visible."],
  ["Preuve", "L'élément qui répond à l'objection présente à cet endroit."],
  ["Adéquation", "Pour qui c'est utile, pour qui ce n'est pas le bon choix."],
  ["Offre", "Périmètre, prix, effort, modalités et responsabilités."],
  ["Action", "Une prochaine étape compréhensible, volontaire et réversible."],
  ["Suite", "Ce qui se passe après le clic, l'envoi ou le paiement."],
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

const INSPIRATION_LOGOS = [
  ["Pinterest", "/brand-logos/pinterest.svg", true],
  ["Mobbin", "/brand-logos/mobbin-mark.png", false],
  ["Refero", "/brand-logos/refero.png", false],
  ["Dribbble", "/brand-logos/dribbble.svg", false],
  ["Figma", "/brand-logos/figma.svg", false],
] as const;

const SITE_REFERENCE_VIDEOS = [
  ["Web design pour startup IA", "https://www.youtube.com/watch?v=raUcRcrfgoE"],
  ["Site animé avec outils gratuits", "https://www.youtube.com/watch?v=0Uk-CavIjqk"],
  ["Site Awwwards avec Claude Design", "https://www.youtube.com/watch?v=cNZvyzObZx8"],
  ["Vendre des sites award-winning", "https://www.youtube.com/watch?v=sEWuM6mkIbQ"],
  ["Sites 3D animés avec IA", "https://www.youtube.com/watch?v=IeR5ZMKssSc"],
] as const;

const BUILD_LOGOS = [
  ["Lovable", "/brand-logos/lovable.svg", false],
  ["Bolt", "/brand-logos/bolt-new.svg", false],
  ["Antigravity", "/brand-logos/antigravity.svg", false],
  ["Claude Code", "/brand-logos/claude-code.svg", false],
  ["Codex", "/brand-logos/codex.svg", false],
  ["Cursor", "/brand-logos/cursor.svg", true],
] as const;

const VISUAL_LOGOS = [
  ["Higgsfield", "/brand-logos/higgsfield.svg", false],
  ["Kie.ai", "/brand-logos/kie-ai.png", false],
  ["fal.ai", "/brand-logos/fal-ai.ico", false],
] as const;

const DELIVERY_LOGOS = [
  ["Cloudflare", "/brand-logos/cloudflare.svg", false],
  ["Vercel", "/brand-logos/vercel.svg", false],
  ["Netlify", "/brand-logos/netlify.svg", false],
  ["Railway", "/brand-logos/railway.svg", true],
  ["Supabase", "/brand-logos/supabase.svg", false],
  ["Neon", "/brand-logos/neon.svg", false],
  ["Tailscale", "/brand-logos/tailscale.svg", false],
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
    <FoundationEditorialNote label={title}>{children}</FoundationEditorialNote>
  );
}

function ToolLogo({ name, src, invert = false }: { name: string; src: string; invert?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2 text-sm text-white/70">
      <Image src={src} alt="" aria-hidden="true" width={24} height={24} loading="lazy" className={`h-6 w-6 object-contain ${invert ? "brightness-0 invert" : ""}`} />
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
          <h2 className="text-2xl font-semibold tracking-tight text-[#f0ede8] md:text-3xl">Construire un site web avec l'IA</h2>
        </div>
        <p className="max-w-3xl text-base leading-relaxed text-white/65">Un bon site aide une personne à comprendre ton offre, à vérifier qu'elle est sérieuse et à agir. L'IA accélère la recherche, l'écriture, le design et le code. Elle ne connaît pas ton client, tes preuves ni ta marque si tu ne les lui donnes pas.</p>
      </header>

      <SectionReveal className="mb-16 border-y border-white/10 py-6">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#e8d5b0]/65">Le but business</p>
        <h3 className="mb-3 text-xl font-semibold text-[#f0ede8]">Une page, une personne, une prochaine étape</h3>
        <p className="max-w-3xl text-sm leading-relaxed text-white/65">Complète cette phrase: « Mon client arrive parce que..., il doit comprendre..., puis il peut... ». Si la réponse reste floue, ne commence pas par les couleurs.</p>
      </SectionReveal>

      <SectionReveal className="mb-16">
        <ChapterTitle marker="1">Quel site faut-il vraiment?</ChapterTitle>
        <p className="mb-6 max-w-3xl text-sm leading-relaxed text-white/65">Le format dépend de l'action attendue. Une landing page peut suffire pour tester une offre. Un site connecté devient utile seulement si la personne doit se connecter, payer ou retrouver ses données.</p>
        <div className="divide-y divide-white/10 border-y border-white/10">
          {SITE_TYPES.map(([name, role]) => <div key={name} className="grid gap-1 py-4 sm:grid-cols-[10rem_1fr] sm:gap-6"><p className="font-medium text-[#e8d5b0]">{name}</p><p className="text-sm leading-relaxed text-white/60">{role}</p></div>)}
        </div>
      </SectionReveal>

      <SectionReveal className="mb-16">
        <ChapterTitle marker="2">La structure d'une page qui vend</ChapterTitle>
        <p className="mb-6 max-w-3xl text-sm leading-relaxed text-white/65">Oui, cette structure se modifie. Une page n'est pas une suite obligatoire de sections: c'est un trajet de décision. Tu choisis les modules selon la maturité du lecteur, la source du trafic, la preuve disponible et l'action attendue. Garde seulement les blocs qui répondent à une question réelle.</p>
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="border border-[#e8d5b0]/25 bg-[#111113] lg:sticky lg:top-24 lg:self-start">
            <div className="border-b border-white/10 px-4 py-3"><p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#e8d5b0]/60">Architecture choisie</p><p className="mt-1 text-xs text-white/55">La bonne page dépend de la décision à faire avancer.</p></div>
            <div className="space-y-3 p-4">
              {PAGE_ARCHITECTURES.map(({ name, fit, sequence }, index) => (
                <div key={name} className={`border p-4 ${index === 0 ? "border-[#e8d5b0]/35 bg-[#e8d5b0]/[0.06]" : "border-white/10 bg-white/[0.02]"}`}>
                  <div className="flex items-start justify-between gap-3"><strong className="text-sm text-white/85">{name}</strong><span className="font-mono text-[10px] text-[#e8d5b0]/60">0{index + 1}</span></div>
                  <p className="mt-2 text-xs leading-relaxed text-white/50">{fit}</p>
                  <p className="mt-3 text-xs leading-relaxed text-[#e8d5b0]/80">{sequence}</p>
                </div>
              ))}
            </div>
          </div>
          <div>
            <div className="mb-5 divide-y divide-white/10 border-y border-white/10">
              {PAGE_MODULES.map(([name, role], index) => (
                <div key={name} className="grid gap-2 py-4 sm:grid-cols-[2.5rem_9rem_1fr] sm:gap-4"><span className="font-mono text-xs text-[#e8d5b0]/60">{String(index + 1).padStart(2, "0")}</span><strong className="text-sm text-[#f0ede8]">{name}</strong><span className="text-sm leading-relaxed text-white/60">{role}</span></div>
              ))}
            </div>
            <div className="border border-white/10 bg-white/[0.02] p-5">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-[#e8d5b0]/75">Réassurance sous le CTA</p>
              <p className="mb-4 text-sm leading-relaxed text-white/60">« Réponse en 24 h » n'est qu'une option, et seulement si ce délai est réel, tenu et utile à la décision. Tu peux la remplacer par une autre réduction d'incertitude.</p>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="border-t border-white/10 pt-3"><p className="text-xs font-semibold text-white/75">Preuve sociale</p><p className="mt-1 text-xs leading-relaxed text-white/50">« Déjà utilisé par 194 membres » peut convenir si le nombre est exact, défini, daté et réellement comparable au lecteur.</p></div>
                <div className="border-t border-white/10 pt-3"><p className="text-xs font-semibold text-white/75">Clarté opérationnelle</p><p className="mt-1 text-xs leading-relaxed text-white/50">« Accès immédiat », « paiement unique » ou « aucun appel nécessaire » réduisent une autre objection, uniquement si c'est vrai.</p></div>
                <div className="border-t border-white/10 pt-3"><p className="text-xs font-semibold text-white/75">Preuve de capacité</p><p className="mt-1 text-xs leading-relaxed text-white/50">Un aperçu, un livrable ou une démonstration peut être plus utile qu'un compteur si la personne doute de la réalité du contenu.</p></div>
                <div className="border-t border-white/10 pt-3"><p className="text-xs font-semibold text-white/75">Limite assumée</p><p className="mt-1 text-xs leading-relaxed text-white/50">Dire pour qui l'offre n'est pas faite peut rassurer davantage qu'une promesse plus large.</p></div>
              </div>
            </div>
          </div>
        </div>
        <PlainNote title="Le test de structure"><p>Avant d'ajouter un bloc, écris la question à laquelle il répond. Si deux blocs répondent à la même question, fusionne-les. Si la page attire mais produit des demandes mal orientées, revois la promesse, la preuve et l'adéquation avant de modifier le bouton.</p></PlainNote>
      </SectionReveal>

      <SectionReveal className="mb-16">
        <ChapterTitle marker="3">Écrire pour que la personne comprenne</ChapterTitle>
        <p className="mb-6 max-w-3xl text-sm leading-relaxed text-white/65">Avant de parler de ton site, montre le moment que ton client vit. Il doit pouvoir se dire : « Oui, c'est exactement ça. » Puis explique simplement ce qui peut changer et ce qu'il peut faire maintenant.</p>
        <div className="grid gap-px bg-white/10 md:grid-cols-2"><div className="bg-[#161618] p-5"><p className="mb-3 text-xs uppercase tracking-[0.14em] text-white/60">On ne comprend pas</p><p className="text-lg text-white/65">« Nous créons des solutions digitales pour faire grandir votre entreprise. »</p></div><div className="bg-[#161618] p-5"><p className="mb-3 text-xs uppercase tracking-[0.14em] text-[#e8d5b0]/70">On voit la scène</p><p className="text-lg text-white/80">« Vos demandes de devis arrivent par téléphone et WhatsApp. Le site les rassemble pour que vous sachiez qui rappeler. »</p></div></div>
        <div className="mt-8 grid gap-6 md:grid-cols-2"><div className="border-t border-white/10 pt-5"><p className="mb-2 text-xs uppercase tracking-[0.14em] text-white/60">Nommer l'objet</p><p className="text-white/70">« Un agenda avec des rappels automatiques. »</p></div><div className="border-t border-[#e8d5b0]/30 pt-5"><p className="mb-2 text-xs uppercase tracking-[0.14em] text-[#e8d5b0]/65">Dire ce qui change</p><p className="text-white/80">« Les clients reçoivent le rappel avant le rendez-vous. Tu n'as plus besoin de les appeler un par un. »</p></div></div>
        <div className="mt-8 grid gap-8 md:grid-cols-2"><div><h4 className="mb-3 font-semibold text-[#f0ede8]">Utilise leurs vrais mots</h4><p className="text-sm leading-relaxed text-white/60">Relis les appels, emails, avis et questions. Garde une phrase comme « je perds mes soirées à refaire les devis » plutôt que « optimiser les opérations ».</p></div><div><h4 className="mb-3 font-semibold text-[#f0ede8]">Le bouton dit ce qui se passe ensuite</h4><div className="space-y-2 text-sm text-white/60"><p>Flou : Envoyer, Soumettre, Cliquez ici.</p><p>Clair : Recevoir mon devis, Voir la démo, Réserver mon appel.</p><p>Garde un bouton principal par écran et une vraie explication juste dessous.</p></div></div></div>
        <PlainNote title="Avant de publier"><p>Lis la page à voix haute. Si un enfant de 10 ans ne voit pas qui est concerné, ce qui bloque, ce qui change et ce qu'il doit faire, simplifie encore. Ne promets pas un résultat que tu ne peux pas montrer.</p></PlainNote>
        <PlainNote title="Réduis la friction du formulaire"><div className="space-y-3"><p>Demande seulement ce qui sert à la prochaine étape. Chaque champ garde un libellé visible et indique s'il est obligatoire ou facultatif.</p><p>Affiche un message d'erreur près du champ et explique comment corriger la saisie. Après l'envoi, montre une confirmation claire, vérifie où arrive la demande et qui la traite.</p><p>Près du bouton, explique l'utilisation de ses données et donne accès à la politique de confidentialité.</p></div></PlainNote>
      </SectionReveal>

      <SectionReveal className="mb-16">
        <ChapterTitle marker="4">Construire une vraie identité</ChapterTitle>
        <div className="grid gap-7 lg:grid-cols-[1fr_auto] lg:items-start"><div><p className="text-sm leading-relaxed text-white/65">Le style suit la marque, l'audience et le contexte. Cherche sur Pinterest, constitue un moodboard et regarde au-delà du web: architecture, édition, mode, photographie, packaging, cinéma, objets ou signalétique. Demande quelle âme, quelle esthétique, quelle émotion et quel statut le site doit transmettre.</p><p className="mt-3 text-sm leading-relaxed text-white/60">Une référence ne se copie pas. Nomme ce que tu retiens: contraste, rythme, matière, cadrage ou densité. Liquid Glass vient du langage visuel d'Apple. Cela explique son origine, pas une obligation de donner à chaque marque une apparence Apple.</p></div><ToolLogo name="Pinterest" src="/brand-logos/pinterest.svg" invert /></div>
        <div className="mt-7 grid gap-x-8 border-y border-white/10 sm:grid-cols-2 lg:grid-cols-3">{STYLES.map(([name, look]) => <div key={name} className="grid grid-cols-[8.5rem_1fr] gap-3 border-b border-white/10 py-3 last:border-b-0 sm:grid-cols-1"><strong className="text-sm text-[#f0ede8]">{name}</strong><span className="text-xs leading-relaxed text-white/60">{look}</span></div>)}</div>
        <PlainNote title="Évite le contenu générique produit par l'IA"><div className="grid gap-3 md:grid-cols-2"><p>Ce rendu est parfois appelé AI slop: mêmes gradients, mêmes cartes, mêmes textes et mêmes icônes pour toutes les marques.</p><p>Utilise tes photos, captures, textures, mots et preuves. Ne fabrique jamais d'avis, de logos, de compteurs ou de résultats.</p></div></PlainNote>
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
        <p className="mt-4 text-sm leading-relaxed text-white/60">Le skill <span className="font-mono text-[#e8d5b0]">ux-ui-design</span> produit un système plus complet pour ton propre projet. Tu peux demander à l'IA de capitaliser sur la précision de cet exemple, sans copier Atelier.</p>
      </SectionReveal>

      <SectionReveal className="mb-16">
        <ChapterTitle marker="5">Donner une vraie mission à l'IA</ChapterTitle>
        <p className="mb-6 max-w-3xl text-sm leading-relaxed text-white/65">Un workflow n'est pas une recette à suivre à la lettre. C'est une demande organisée autour d'un résultat. Tu peux commencer par un seul skill, en combiner deux ou en demander davantage si ton outil sait les charger. L'ordre dépend de ton projet, de tes informations et de ce que tu veux obtenir.</p>
        <div className="grid gap-px bg-white/10 md:grid-cols-3">
          <div className="bg-[#161618] p-5"><h4 className="mb-2 font-semibold text-[#f0ede8]">Un seul skill peut suffire</h4><p className="text-sm leading-relaxed text-white/60">Une landing page, un site vitrine, un article, une identité visuelle ou un espace connecté. Plus le résultat attendu est concret, plus l'IA peut vérifier son travail.</p></div>
          <div className="bg-[#161618] p-5"><h4 className="mb-2 font-semibold text-[#f0ede8]">Plusieurs skills si nécessaire</h4><p className="text-sm leading-relaxed text-white/60">Ajoute ton offre, ton client, tes preuves, tes contraintes, les fichiers à lire et le dossier où se trouve ta recherche. Une IA ne devine pas ce qu'elle ne peut pas consulter.</p></div>
          <div className="bg-[#161618] p-5"><h4 className="mb-2 font-semibold text-[#f0ede8]">Workflow complet, si tu le veux</h4><p className="text-sm leading-relaxed text-white/60">Elle peut utiliser plusieurs skills, reprendre une étape après ton retour, produire le code et préparer les contrôles. Tu gardes la main sur le périmètre, les références et la validation.</p></div>
        </div>
        <PlainNote title="Le Protocole Zéro relie les compétences du projet"><div className="space-y-3"><p>Dans BUILD, le Protocole Zéro n'est ni une prestation à envoyer ailleurs ni un skill réservé au SEO. C'est une méthode de travail pour intégrer n'importe quelle compétence dont un projet a besoin. Pour un site, on part du résultat à obtenir, on repère les métiers et les compétences nécessaires, puis on demande à l'IA d'absorber ce qui manque: recherche de marché, stratégie, UX/UI, copywriting, design, développement, backend, SEO, contenu, mesure ou déploiement.</p><p>L'absorption suit toujours le même mouvement: partir de sources fiables ou d'un savoir-faire existant, en extraire les règles, les exemples et les exceptions, les relier au contexte du site, les appliquer sur le vrai projet, vérifier le résultat, puis garder ce qui fonctionne dans un skill, une procédure ou un document réutilisable. Le Protocole Zéro relie donc les métiers et les skills; il ne remplace pas les skills spécialisés. Il leur donne le contexte, les sources et les règles dont ils ont besoin pour travailler ensemble.</p><p>La méthode ne s'arrête pas au site: elle fonctionne pour une compétence métier, créative, technique, commerciale ou opérationnelle. Ce qui change, c'est la source étudiée et le résultat attendu; le mouvement d'absorption reste le même.</p></div></PlainNote>
        <div className="mt-8 divide-y divide-white/10 border-y border-white/10">
          <div className="grid gap-2 py-5 md:grid-cols-[12rem_1fr]"><strong className="text-[#e8d5b0]">Comprendre le terrain</strong><p className="text-sm leading-relaxed text-white/60"><Link href="/skills#skill-deep-research-vertical" className="font-mono text-[#e8d5b0] underline underline-offset-4">deep-research-vertical</Link> aide à comprendre une niche: ses clients, leurs mots, leurs douleurs, ses concurrents et les preuves disponibles.</p></div>
          <div className="grid gap-2 py-5 md:grid-cols-[12rem_1fr]"><strong className="text-[#e8d5b0]">Construire et vérifier</strong><p className="text-sm leading-relaxed text-white/60"><Link href="/skills#skill-oracle-site-web" className="font-mono text-[#e8d5b0] underline underline-offset-4">oracle-site-web</Link> transforme ce contexte en pages, textes, SEO technique, documents de projet, performance et contrôles de livraison.</p></div>
          <div className="grid gap-2 py-5 md:grid-cols-[12rem_1fr]"><strong className="text-[#e8d5b0]">Ajouter la bonne expertise</strong><p className="text-sm leading-relaxed text-white/60">Ajoute <Link href="/skills#skill-ux-ui-design" className="font-mono text-[#e8d5b0] underline underline-offset-4">ux-ui-design</Link> si le besoin est visuel. Les <span className="font-mono text-[#e8d5b0]">Skills Apple</span> peuvent pousser les composants, les états et l'accessibilité. Utilise <Link href="/skills#skill-backend-orsayn" className="font-mono text-[#e8d5b0] underline underline-offset-4">backend-orsayn</Link> si le site manipule des comptes, des données ou des paiements. Pour les articles et le SEO éditorial, <span className="font-mono text-[#e8d5b0]">oracle-site-web</span> s'appuie sur la compétence <span className="font-mono text-[#e8d5b0]">site-content-engine</span>: elle fait partie du workflow du site et organise les sujets, les liens internes, les articles et leur suivi.</p></div>
        </div>
        <div className="mt-8"><h4 className="mb-3 font-semibold text-[#f0ede8]">Tout mettre dans le même prompt</h4><p className="mb-4 max-w-3xl text-sm leading-relaxed text-white/60">Tu peux préciser le dossier à consulter, les sites à observer, les images à prendre comme références, les fichiers à créer et les limites à respecter. Voici un exemple de demande, à adapter à ton projet:</p><pre className="overflow-x-auto whitespace-pre-wrap break-words border border-white/10 bg-black/30 px-5 py-4 font-mono text-xs leading-6 text-[#e8d5b0]">{`Travaille sur le site de mon activité.
Lis d'abord la recherche présente dans /projets/mon-site/recherche.
Utilise deep-research-vertical pour en extraire les clients, les objections et les mots du marché.
Puis utilise oracle-site-web pour structurer les pages, écrire le contenu et construire le site.
Ajoute ux-ui-design pour la direction visuelle.
Si ton modèle peut générer des images, propose puis crée les visuels utiles. Sinon, prépare les prompts et indique les fichiers à fournir.
Prends https://exemple.com comme référence de structure et /projets/mon-site/references/image.jpg comme référence visuelle, sans copier.
Travaille dans /projets/mon-site, ne modifie pas les autres dossiers et montre-moi ce que tu as vérifié avant de livrer.`}</pre></div>
        <PlainNote title="Une liberté qui reste réaliste"><p>Le chemin local doit être accessible à l'outil et la génération d'images dépend du modèle ou de l'application utilisée. Si ce n'est pas possible, joins les fichiers ou demande une préparation. Dans tous les cas, tu peux exprimer le résultat, les références et les contraintes dans tes propres mots.</p></PlainNote>
        <div className="mt-8 border-t border-white/10 pt-6">
          <h4 className="mb-3 font-semibold text-[#f0ede8]">Transformer un site validé en template réutilisable</h4>
          <p className="max-w-3xl text-sm leading-relaxed text-white/60">Quand un design system, une architecture et une version globale du site te plaisent, demande à l'IA de produire un <span className="font-mono text-[#e8d5b0]">skill.md</span> du site entier. Ce fichier devient la notice de reproduction de la base validée: il décrit l'identité visuelle, les couleurs, les typographies, les composants, les mises en page, la navigation, le responsive, les interactions, la structure des fichiers, les assets attendus, les règles de contenu, le SEO et les contrôles à refaire.</p>
          <div className="mt-6 grid gap-px bg-white/10 md:grid-cols-3">
            <div className="bg-[#161618] p-5"><h5 className="mb-2 font-semibold text-[#f0ede8]">Capitaliser</h5><p className="text-sm leading-relaxed text-white/60">Le site approuvé devient un savoir réutilisable, avec sa logique visuelle, son architecture et ses règles de qualité, pas seulement une capture d'écran.</p></div>
            <div className="bg-[#161618] p-5"><h5 className="mb-2 font-semibold text-[#f0ede8]">Adapter</h5><p className="text-sm leading-relaxed text-white/60">Pour un autre projet, tu fournis le contexte puis tu changes le copywriting, les textes, les couleurs, le logo, les photos, les illustrations, les preuves, les offres, les URLs et les intégrations qui appartiennent à ce nouveau site.</p></div>
            <div className="bg-[#161618] p-5"><h5 className="mb-2 font-semibold text-[#f0ede8]">Répliquer</h5><p className="text-sm leading-relaxed text-white/60">L'IA recharge le skill, reprend la même base et conserve l'expérience validée. Tu peux demander une nouvelle version pour un client, pour ton activité ou pour un autre domaine sans repartir de zéro.</p></div>
          </div>
          <PlainNote title="Un levier de production pour une agence"><div className="space-y-3"><p>Une galerie interne peut regrouper ces templates sous forme de skills: aperçu du site, design system, architecture, version, contraintes, assets et contrôles déjà validés. Quand un prospect arrive, tu sélectionnes une base, tu donnes le contexte du client et l'IA prépare une maquette ou un site adapté.</p><p>La galerie accélère l'exécution sans imposer des clones impersonnels. La structure et les standards restent stables; tout ce qui est propre au client est réécrit ou remplacé. Une relecture humaine vérifie ensuite le message, les preuves, les assets, l'accessibilité, le responsive, le SEO et le parcours avant livraison.</p></div></PlainNote>
        </div>
        <div className="mt-8 border-t border-white/10 pt-6"><h4 className="mb-4 font-semibold text-[#f0ede8]">Quelques outils possibles</h4><div className="flex flex-wrap gap-x-7 gap-y-4">{TOOL_LOGOS.map(([name, src, invert]) => <ToolLogo key={name} name={name} src={src} invert={invert} />)}</div><p className="mt-4 max-w-3xl text-sm leading-relaxed text-white/60">Codex, Claude Code, ChatGPT, Bolt et les autres sont des portes d'entrée, pas des parcours obligatoires. Certains écrivent surtout du code, d'autres aident à prototyper, à concevoir ou à produire des images. Le bon choix est celui qui peut lire ton contexte et te laisser vérifier le résultat.</p></div>
      </SectionReveal>

      <SectionReveal className="mb-16">
        <ChapterTitle marker="5 bis">Du tableau d'inspiration au site qui fonctionne</ChapterTitle>
        <p className="mb-6 max-w-3xl text-sm leading-relaxed text-white/65">Les démonstrations disponibles et les méthodes de designers web plus anciennes convergent sur un point : le site ne commence pas par un prompt de génération. Il commence par une collecte de références, un tri, une direction visuelle, une architecture de contenu et une vérification progressive. L'IA accélère chaque étape, mais elle ne décide pas à ta place ce qui est pertinent pour ton marché.</p>
        <PlainNote title="Ce que la vidéo transcrite permet de vérifier"><div className="space-y-3"><p>Dans l'exemple étudié, le travail commence par une référence visuelle et une première zone limitée : navigation, titre et hero. Le reste de la page arrive ensuite, une fois la direction et le cadrage plus stables.</p><p>Le créateur sépare aussi les tâches : un outil produit ou anime un asset, puis l'outil de construction l'intègre et reçoit des demandes ciblées sur le cadrage, le point focal, le responsive, les boutons et le menu mobile.</p><p>La méthode BUILD n'en déduit pas une recette à recopier. Elle en retient une règle testable : référence précise, tâche bornée, retour visuel, correction locale, puis extension et contrôle du vrai parcours.</p></div></PlainNote>
        <div className="mb-8 flex flex-wrap items-center gap-x-7 gap-y-4 border-y border-white/10 py-5">
          <ToolLogo name="YouTube" src="/brand-logos/youtube.svg" invert />
          <ToolLogo name="Pinterest" src="/brand-logos/pinterest.svg" invert />
          <ToolLogo name="Mobbin" src="/brand-logos/mobbin-mark.png" />
          <ToolLogo name="Refero" src="/brand-logos/refero.png" />
          <ToolLogo name="Dribbble" src="/brand-logos/dribbble.svg" />
          <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs">
            {SITE_REFERENCE_VIDEOS.map(([title, href]) => (
              <Link key={href} href={href} target="_blank" rel="noreferrer" className="text-[#e8d5b0] underline underline-offset-4">{title} ↗</Link>
            ))}
          </div>
        </div>
        <div className="divide-y divide-white/10 border-y border-white/10">
          <div className="grid gap-2 py-5 md:grid-cols-[2rem_11rem_1fr]"><span className="font-mono text-xs text-[#e8d5b0]/60">1)</span><strong className="text-sm text-[#f0ede8]">Collecter</strong><p className="text-sm leading-relaxed text-white/60">Rassemble des références de structure, de rythme, de typographie, de photographie, de navigation et de matière. Ne garde pas seulement des captures jolies : note ce que chaque référence résout.</p></div>
          <div className="grid gap-2 py-5 md:grid-cols-[2rem_11rem_1fr]"><span className="font-mono text-xs text-[#e8d5b0]/60">2)</span><strong className="text-sm text-[#f0ede8]">Trier</strong><p className="text-sm leading-relaxed text-white/60">Sépare inspiration, contrainte et copie. Regroupe les références par mécanisme : hero, preuve, formulaire, tableau, navigation, interaction ou conversion.</p></div>
          <div className="grid gap-2 py-5 md:grid-cols-[2rem_11rem_1fr]"><span className="font-mono text-xs text-[#e8d5b0]/60">3)</span><strong className="text-sm text-[#f0ede8]">Formuler</strong><p className="text-sm leading-relaxed text-white/60">Écris une direction visuelle avec des décisions visibles : grille, densité, typographies, couleurs, images, rayons, bordures, ombres, états et mouvement. Trois adjectifs ne suffisent pas.</p></div>
          <div className="grid gap-2 py-5 md:grid-cols-[2rem_11rem_1fr]"><span className="font-mono text-xs text-[#e8d5b0]/60">4)</span><strong className="text-sm text-[#f0ede8]">Prototyper</strong><p className="text-sm leading-relaxed text-white/60">Commence par la page la plus importante et un parcours complet. Utilise une maquette, un prototype ou un premier écran de code pour tester le message avant de produire vingt pages.</p></div>
          <div className="grid gap-2 py-5 md:grid-cols-[2rem_11rem_1fr]"><span className="font-mono text-xs text-[#e8d5b0]/60">5)</span><strong className="text-sm text-[#f0ede8]">Construire</strong><p className="text-sm leading-relaxed text-white/60">Donne à l'outil les fichiers de contexte, les assets, les limites et les critères d'acceptation. Demande une tâche bornée, regarde les fichiers touchés et ouvre le résultat réel.</p></div>
          <div className="grid gap-2 py-5 md:grid-cols-[2rem_11rem_1fr]"><span className="font-mono text-xs text-[#e8d5b0]/60">6)</span><strong className="text-sm text-[#f0ede8]">Vérifier</strong><p className="text-sm leading-relaxed text-white/60">Teste le copy, les liens, le mobile, le clavier, les erreurs, les formulaires, les images, la vitesse, les événements et la remise des accès. Un écran réussi n'est pas une livraison réussie.</p></div>
        </div>
        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          <div>
            <h4 className="mb-3 font-semibold text-[#f0ede8]">Les outils sont des alternatives, pas des étapes obligatoires</h4>
            <p className="mb-4 text-sm leading-relaxed text-white/60">Pour l'inspiration et la direction : Pinterest, Mobbin, Refero, Dribbble et Figma. Pour prototyper ou coder : Lovable, Bolt, Antigravity, Claude Code, Codex et Cursor. Choisis selon ton niveau, le contrôle du code, le besoin de collaboration et la possibilité de sortir du fournisseur.</p>
            <div className="flex flex-wrap gap-x-6 gap-y-4">{INSPIRATION_LOGOS.map(([name, src, invert]) => <ToolLogo key={name} name={name} src={src} invert={invert} />)}</div>
            <div className="mt-5 flex flex-wrap gap-x-6 gap-y-4">{BUILD_LOGOS.map(([name, src, invert]) => <ToolLogo key={name} name={name} src={src} invert={invert} />)}</div>
          </div>
          <div>
            <h4 className="mb-3 font-semibold text-[#f0ede8]">Images, vidéo et assets</h4>
            <p className="mb-4 text-sm leading-relaxed text-white/60">Higgsfield, Kie.ai et fal.ai peuvent servir de portes d'entrée pour des visuels ou des séquences. Une API directe du fournisseur peut être préférable si tu dois contrôler le modèle, le coût, les fichiers ou la confidentialité. Dans tous les cas, garde une direction visuelle et vérifie les licences, les visages, les marques et les droits d'usage.</p>
            <div className="flex flex-wrap gap-x-6 gap-y-4">{VISUAL_LOGOS.map(([name, src, invert]) => <ToolLogo key={name} name={name} src={src} invert={invert} />)}</div>
          </div>
        </div>
        <PlainNote title="Le protocole d'adaptation"><div className="space-y-3"><p>Si tu changes de secteur, ne conserve pas automatiquement la référence, le ton ou le CTA. Repars de la situation client, du niveau de décision, de la preuve disponible et de la contrainte de production.</p><p>Si tu changes d'outil, conserve le résultat attendu et les critères de vérification. Une interface plus rapide n'est pas forcément un meilleur choix si elle enferme le code, le contenu ou les données.</p></div></PlainNote>
      </SectionReveal>

      <SectionReveal className="mb-16">
        <ChapterTitle marker="5 ter">Choisir la connexion et l'hébergement selon la stack</ChapterTitle>
        <p className="mb-6 max-w-3xl text-sm leading-relaxed text-white/65">La publication n'est pas une préférence de marque. Elle dépend du type de site, des données, du besoin de serveur, du budget, de la capacité du client à reprendre la main et du niveau de sécurité attendu.</p>
        <div className="mb-6 flex flex-wrap gap-x-7 gap-y-4 border-y border-white/10 py-5">{DELIVERY_LOGOS.map(([name, src, invert]) => <ToolLogo key={name} name={name} src={src} invert={invert} />)}</div>
        <div className="divide-y divide-white/10 border-y border-white/10">
          <div className="grid gap-2 py-5 md:grid-cols-[12rem_1fr]"><strong className="text-[#e8d5b0]">Site statique ou Next.js</strong><p className="text-sm leading-relaxed text-white/60">Vercel, Cloudflare ou Netlify peuvent convenir selon le framework, les fonctions serveur, le cache et le contrôle DNS. Compare le coût réel, les limites et la manière dont le client récupère ses accès.</p></div>
          <div className="grid gap-2 py-5 md:grid-cols-[12rem_1fr]"><strong className="text-[#e8d5b0]">Backend et données</strong><p className="text-sm leading-relaxed text-white/60">Railway, Supabase ou Neon peuvent répondre à des besoins différents. Choisis d'abord le modèle de données, les permissions, les sauvegardes et la responsabilité, puis la marque de l'hébergeur.</p></div>
          <div className="grid gap-2 py-5 md:grid-cols-[12rem_1fr]"><strong className="text-[#e8d5b0]">VPS privé</strong><p className="text-sm leading-relaxed text-white/60">Un VPS peut héberger Hermes ou un service personnalisé, mais il ajoute les mises à jour, les sauvegardes, la supervision, la rotation des secrets et la réponse aux incidents. Un réseau privé comme Tailscale réduit l'exposition de l'administration, sans remplacer les mises à jour, le pare-feu, les comptes séparés et les contrôles de l'application.</p></div>
        </div>
        <PlainNote title="La règle de livraison"><p>Le client doit récupérer le dépôt, le domaine, l'hébergeur, les bases, les variables, les comptes d'analyse et la documentation. Une URL publique ne suffit pas à prouver qu'il peut continuer sans toi.</p></PlainNote>
      </SectionReveal>

      <SectionReveal className="mb-16">
        <ChapterTitle marker="6">Le SEO, expliqué simplement</ChapterTitle>
        <p className="mb-6 max-w-3xl text-sm leading-relaxed text-white/65">Le SEO aide les moteurs de recherche à comprendre quelle page répond à quelle question. Il ne consiste pas à répéter des mots-clés. On commence par une page utile pour une intention réelle, puis on vérifie qu'elle est lisible, accessible, rapide et techniquement découvrable.</p>
        <div className="divide-y divide-white/10 border-y border-white/10">
          <div className="grid gap-2 py-5 md:grid-cols-[13rem_1fr]"><strong className="text-[#e8d5b0]">Une intention par page</strong><p className="text-sm leading-relaxed text-white/60">Une page doit répondre à un besoin précis et apporter quelque chose d'utile. Ne crée pas plusieurs pages presque identiques pour occuper les résultats. Pour une activité locale, une page par zone n'a de sens que si son contenu et ses preuves sont réellement différents.</p></div>
          <div className="grid gap-2 py-5 md:grid-cols-[13rem_1fr]"><strong className="text-[#e8d5b0]">Une page compréhensible</strong><p className="text-sm leading-relaxed text-white/60">Donne à chaque page un titre unique, un H1 clair, des sous-titres logiques, une adresse lisible et une description utile dans les résultats. Écris d'abord pour la personne: vocabulaire précis, réponse directe, exemples et preuves réelles.</p></div>
          <div className="grid gap-2 py-5 md:grid-cols-[13rem_1fr]"><strong className="text-[#e8d5b0]">Des liens qui aident</strong><p className="text-sm leading-relaxed text-white/60">Le maillage interne relie les pages entre elles. Un article peut mener vers une page de service, une réalisation peut expliquer la méthode et chaque lien doit aider le lecteur à poursuivre sa décision. Le cocon sémantique organise ce réseau autour d'un sujet, sans fabriquer des pages pour le simple volume.</p></div>
          <div className="grid gap-2 py-5 md:grid-cols-[13rem_1fr]"><strong className="text-[#e8d5b0]">Être découvrable</strong><p className="text-sm leading-relaxed text-white/60">Un sitemap liste les URLs importantes. Le fichier robots.txt ne doit pas bloquer une page utile. Une URL canonique indique la version principale quand plusieurs adresses se ressemblent. Les données structurées peuvent préciser un type de contenu lorsqu'elles correspondent vraiment à la page.</p></div>
          <div className="grid gap-2 py-5 md:grid-cols-[13rem_1fr]"><strong className="text-[#e8d5b0]">Rester agréable à utiliser</strong><p className="text-sm leading-relaxed text-white/60">Teste le site sur mobile, sécurise-le en HTTPS, compresse les images, réserve leur place pour éviter les déplacements de contenu et ajoute un texte alternatif quand une image apporte une information. La vitesse et l'accessibilité servent d'abord les personnes, puis la visibilité.</p></div>
        </div>
        <PlainNote title="Ce que tu vérifies dans Google Search Console"><div className="space-y-3"><p><strong className="text-white/80">1. La propriété et le sitemap.</strong> Ajoute le domaine, envoie l'adresse du sitemap et vérifie que le fichier est accepté. Le sitemap aide Google à découvrir les pages, mais il ne garantit ni leur indexation ni leur position.</p><p><strong className="text-white/80">2. Les pages importantes.</strong> Avec l'outil d'inspection de l'URL, regarde si une page est connue, si Google peut l'explorer et si une demande d'indexation est pertinente après une nouvelle mise en ligne. Une demande n'est pas une promesse de résultat immédiat.</p><p><strong className="text-white/80">3. Les résultats.</strong> Le rapport sur les performances montre les requêtes, impressions, clics, taux de clic et position moyenne. Le rapport d'indexation aide à comprendre les pages exclues ou les erreurs. Lis ces données pour décider quelle page améliorer, pas pour courir après un chiffre isolé.</p><div className="flex flex-wrap gap-x-5 gap-y-2 pt-2 text-xs"><Link href="https://developers.google.com/search/docs/fundamentals/seo-starter-guide?hl=fr" target="_blank" rel="noreferrer" className="text-[#e8d5b0] underline underline-offset-4">Guide SEO Google ↗</Link><Link href="https://support.google.com/webmasters/answer/9012289?hl=fr" target="_blank" rel="noreferrer" className="text-[#e8d5b0] underline underline-offset-4">Inspection de l'URL ↗</Link><Link href="https://support.google.com/webmasters/answer/7451001?hl=fr" target="_blank" rel="noreferrer" className="text-[#e8d5b0] underline underline-offset-4">Rapport Sitemaps ↗</Link><Link href="https://support.google.com/webmasters/answer/7576553?hl=fr" target="_blank" rel="noreferrer" className="text-[#e8d5b0] underline underline-offset-4">Performances ↗</Link></div></div></PlainNote>
        <PlainNote title="Le rôle d'oracle-site-web et d'IndexNow"><div className="space-y-3"><p><Link href="/skills#skill-oracle-site-web" className="font-mono text-[#e8d5b0] underline underline-offset-4">oracle-site-web</Link> ne se limite pas à remplir des balises. Il peut organiser les métadonnées, les URLs, le sitemap, le fichier robots.txt, les canoniques, les données structurées pertinentes, les contrôles de performance et les vérifications de livraison.</p><p>Quand c'est utile, <strong className="text-[#e8d5b0]">IndexNow</strong> prévient les moteurs qui participent à ce protocole qu'une URL a changé. IndexNow ne couvre pas Google et ne garantit ni l'indexation ni le classement. Pour Google, garde le sitemap et Search Console. Une bonne pratique n'est pas un bouton magique: elle rend le site compréhensible et permet de voir ce qui se passe.</p><Link href="https://www.indexnow.org/documentation" target="_blank" rel="noreferrer" className="inline-block text-xs text-[#e8d5b0] underline underline-offset-4">Documentation IndexNow ↗</Link></div></PlainNote>
        <PlainNote title="Le SEO avancé reste dans BUILD"><div className="space-y-3"><p>Les Fondations t'apprennent le socle pour ne pas avancer à l'aveugle. Le Protocole Zéro intervient quand il faut approfondir une compétence et l'intégrer au projet, pas quand il faut quitter BUILD.</p><p>Pour le SEO, cela veut dire partir des besoins du site, absorber les méthodes utiles sur la recherche de requêtes, la concurrence, l'architecture éditoriale et la mesure dans la durée, puis les faire appliquer par le workflow de <Link href="/skills#skill-oracle-site-web" className="font-mono text-[#e8d5b0] underline underline-offset-4">oracle-site-web</Link>. Ce workflow porte la structure et le SEO technique. Quand le site doit publier des articles, il s'appuie sur sa compétence éditoriale <span className="font-mono text-[#e8d5b0]">site-content-engine</span>, qui organise les sujets, les liens internes, les articles et leur suivi. Search Console et les données réelles permettent de vérifier. Ce travail devient ensuite une procédure ou un skill réutilisable.</p><p>Pour le design, le copywriting, le backend ou un autre métier, le lien est le même: le Protocole Zéro apprend la compétence, la relie aux éléments du site, la fait exécuter au bon skill, puis vérifie et capitalise. Les Fondations posent le socle; le Protocole Zéro absorbe ce qui manque et l'ajoute au même système.</p></div></PlainNote>
      </SectionReveal>

      <SectionReveal className="mb-16">
        <ChapterTitle marker="7">Mesurer ce qui aide le business</ChapterTitle>
        <p className="mb-6 max-w-3xl text-sm leading-relaxed text-white/65">Chaque mesure doit répondre à une question: les bonnes personnes trouvent-elles le site, comprennent-elles l'offre et terminent-elles l'action?</p>
        <div className="mb-7 flex flex-wrap gap-x-7 gap-y-4">{MEASURE_LOGOS.map(([name, src, invert]) => <ToolLogo key={name} name={name} src={src} invert={invert} />)}</div>
        <div className="divide-y divide-white/10 border-y border-white/10"><div className="grid gap-2 py-5 md:grid-cols-[14rem_1fr]"><strong className="text-sm text-[#e8d5b0]">Google Search Console</strong><p className="text-sm leading-relaxed text-white/60">Montre les impressions, les clics, les requêtes, la position moyenne et les problèmes d'indexation.</p></div><div className="grid gap-2 py-5 md:grid-cols-[14rem_1fr]"><strong className="text-sm text-[#e8d5b0]">Plausible ou PostHog</strong><p className="text-sm leading-relaxed text-white/60">Comptent les visiteurs et les actions utiles. PostHog aide aussi à observer un parcours plus complexe.</p></div><div className="grid gap-2 py-5 md:grid-cols-[14rem_1fr]"><strong className="text-sm text-[#e8d5b0]">PageSpeed Insights</strong><p className="text-sm leading-relaxed text-white/60">Repère ce qui ralentit la page ou déplace le contenu, surtout sur mobile.</p></div></div>
        <div className="mt-7 overflow-x-auto border-y border-[#e8d5b0]/25 py-5"><div className="flex min-w-[680px] items-center justify-between gap-3 font-mono text-sm text-[#e8d5b0]"><span>visiteurs</span><span className="text-white/60">→</span><span>CTA</span><span className="text-white/60">→</span><span>formulaire commencé</span><span className="text-white/60">→</span><span>formulaire envoyé</span><span className="text-white/60">→</span><span>client</span></div></div>
      </SectionReveal>

      <SectionReveal>
        <ChapterTitle marker="8">Tester le vrai parcours avant la mise en ligne</ChapterTitle>
        <p className="max-w-3xl text-sm leading-relaxed text-white/65">Ouvre le vrai site sur téléphone et ordinateur. Essaie le parcours principal, la navigation au clavier, le formulaire avec de bonnes et de mauvaises données, les liens et les images. <span className="font-mono text-[#e8d5b0]">oracle-site-web</span> organise et exécute ces contrôles dans son workflow, puis signale ce qui reste à corriger. La mise en ligne appartient à la section 10.</p>
      </SectionReveal>
    </div>
  );
}
