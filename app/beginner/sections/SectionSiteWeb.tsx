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
          <h2 className="text-2xl font-semibold tracking-tight text-[#f0ede8] md:text-3xl">Construire un site web avec l&apos;IA</h2>
        </div>
        <p className="max-w-3xl text-base leading-relaxed text-white/65">Un site utile fait avancer une décision réelle. L&apos;IA peut accélérer la recherche, le texte, le design et le code lorsque tu lui donnes le terrain, les preuves et les critères de sortie.</p>
      </header>

      <SectionReveal className="mb-16 border-y border-white/10 py-6">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-[#e8d5b0]/65">Le chemin complet</p>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-sm text-[#e8d5b0]">
          <span>comprendre</span><span className="text-white/35">→</span>
          <span>positionner</span><span className="text-white/35">→</span>
          <span>structurer</span><span className="text-white/35">→</span>
          <span>designer</span><span className="text-white/35">→</span>
          <span>développer</span><span className="text-white/35">→</span>
          <span>vérifier</span>
        </div>
        <p className="mt-4 max-w-3xl text-sm leading-relaxed text-white/65">Chaque étape produit un document ou un résultat observable. Tu avances seulement quand la porte de sortie est franchie. Cette règle évite de demander à un outil de dessiner une page dont personne ne connaît encore le rôle.</p>
      </SectionReveal>

      <SectionReveal className="mb-16">
        <ChapterTitle marker="1">Comprendre le besoin avant d&apos;ouvrir l&apos;éditeur</ChapterTitle>
        <p className="mb-6 max-w-3xl text-sm leading-relaxed text-white/65">Commence par la situation qui déclenche la visite. Identifie la personne, ce qu&apos;elle cherche, ce qu&apos;elle sait déjà, les preuves disponibles et l&apos;action qui doit suivre. Le type de site découle de ce diagnostic.</p>
        <div className="divide-y divide-white/10 border-y border-white/10">
          {SITE_TYPES.map(([name, role]) => <div key={name} className="grid gap-1 py-4 sm:grid-cols-[10rem_1fr] sm:gap-6"><p className="font-medium text-[#e8d5b0]">{name}</p><p className="text-sm leading-relaxed text-white/60">{role}</p></div>)}
        </div>
        <div className="mt-8 grid gap-px bg-white/10 md:grid-cols-3">
          <div className="bg-[#161618] p-5"><h4 className="mb-2 font-semibold text-[#f0ede8]">Entrée</h4><p className="text-sm leading-relaxed text-white/60">Appels, emails, avis, demandes, recherches, offres existantes, preuves autorisées, contraintes de délai et de reprise.</p></div>
          <div className="bg-[#161618] p-5"><h4 className="mb-2 font-semibold text-[#f0ede8]">Décisions</h4><p className="text-sm leading-relaxed text-white/60">Public prioritaire, problème reconnu, niveau de conscience, promesse bornée, type de site et action principale.</p></div>
          <div className="bg-[#161618] p-5"><h4 className="mb-2 font-semibold text-[#f0ede8]">Sortie</h4><p className="text-sm leading-relaxed text-white/60">Un brief court que tu peux expliquer sans jargon, accompagné des inconnues qui demandent encore un entretien ou un test.</p></div>
        </div>
        <PlainNote title="Exemple concret"><p>Un artisan reçoit des demandes par téléphone et messagerie. Le site doit expliquer son périmètre, montrer des réalisations vérifiables et regrouper les informations nécessaires au devis. Un espace connecté devient utile si le client doit retrouver des données privées ou suivre un dossier.</p></PlainNote>
        <PlainNote title="Process humain"><div className="space-y-3"><p>1) Reprends plusieurs conversations récentes et relève les mots, les objections et la prochaine action demandée.</p><p>2) Classe le site, choisis une action principale et liste les preuves réellement disponibles.</p><p>3) Écris les contraintes : pages, contenus, données, intégrations, responsables et date de décision.</p><p>4) Fais relire le brief par une personne qui connaît le terrain. Chaque hypothèse reste nommée comme telle.</p></div></PlainNote>
        <PlainNote title="Process avec l&apos;IA"><div className="space-y-3"><p>Donne les documents autorisés, demande une synthèse séparant faits, mots du marché, décisions et inconnues. Exige un tableau qui relie chaque recommandation à une entrée précise.</p><p>Teste la sortie sur un cas typique et un cas limite. Si l&apos;outil invente un client, une preuve ou une capacité, corrige l&apos;instruction avant de continuer.</p></div></PlainNote>
        <div className="mt-6 border border-[#e8d5b0]/25 bg-[#e8d5b0]/[0.04] p-5"><p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#e8d5b0]/75">Porte de sortie</p><p className="mt-2 text-sm leading-relaxed text-white/65">Complète sans hésiter : « Cette personne arrive pour [raison]. Elle doit comprendre [idée]. La preuve disponible est [preuve]. Puis elle peut [action]. »</p></div>
      </SectionReveal>

      <SectionReveal className="mb-16">
        <ChapterTitle marker="2">Positionner l&apos;offre avec les mots du terrain</ChapterTitle>
        <p className="mb-6 max-w-3xl text-sm leading-relaxed text-white/65">Le positionnement choisit la place que la page doit occuper dans la tête du lecteur. Il précise pour qui l&apos;offre est utile, dans quelle situation, par quel mécanisme et avec quelle limite. La page ne peut pas réparer une offre floue.</p>
        <div className="grid gap-px bg-white/10 md:grid-cols-2">
          <div className="bg-[#161618] p-5"><p className="mb-3 text-xs uppercase tracking-[0.14em] text-white/60">Formulation vague</p><p className="text-lg text-white/65">« Nous créons des solutions digitales pour faire grandir votre entreprise. »</p></div>
          <div className="bg-[#161618] p-5"><p className="mb-3 text-xs uppercase tracking-[0.14em] text-[#e8d5b0]/70">Scène et mécanisme</p><p className="text-lg text-white/80">« Vos demandes de devis arrivent par téléphone et messagerie. Le site les regroupe pour que vous sachiez qui rappeler. »</p></div>
        </div>
        <div className="mt-8 grid gap-8 md:grid-cols-2">
          <div><h4 className="mb-3 font-semibold text-[#f0ede8]">Utilise leurs vrais mots</h4><p className="text-sm leading-relaxed text-white/60">Relis les appels, les emails, les avis et les questions. « Je refais mes devis le soir » décrit une scène. « Optimiser les opérations » cache cette scène.</p></div>
          <div><h4 className="mb-3 font-semibold text-[#f0ede8]">Donne un statut à chaque affirmation</h4><p className="text-sm leading-relaxed text-white/60">Une affirmation peut être prouvée, calculée, observée ou encore hypothétique. Place la preuve près de ce qu&apos;elle soutient et retire tout chiffre sans source, portée et date.</p></div>
          <div><h4 className="mb-3 font-semibold text-[#f0ede8]">Définis l&apos;adéquation</h4><p className="text-sm leading-relaxed text-white/60">Écris pour qui l&apos;offre convient, ce qu&apos;elle demande et les cas où une autre route est préférable. Cette précision réduit les demandes mal orientées.</p></div>
          <div><h4 className="mb-3 font-semibold text-[#f0ede8]">Annonce la suite</h4><p className="text-sm leading-relaxed text-white/60">Le bouton nomme l&apos;action et son résultat immédiat : recevoir un devis, voir une démonstration ou préparer un échange. Un seul geste principal suffit par écran.</p></div>
        </div>
        <PlainNote title="Process humain"><div className="space-y-3"><p>1) Écris la situation, le coût concret, le progrès attendu, le mécanisme, la preuve, la limite et la prochaine action.</p><p>2) Choisis une seule idée directrice et vérifie que chaque bloc futur la sert.</p><p>3) Lis le texte à voix haute. Remplace les mots internes par le vocabulaire entendu sur le terrain.</p><p>4) Fais tester le message sans expliquer l&apos;offre. La personne doit reformuler correctement pour qui elle est faite et ce qui se passe ensuite.</p></div></PlainNote>
        <PlainNote title="Process avec l&apos;IA"><div className="space-y-3"><p>Fournis la carte de recherche, l&apos;offre, les preuves et les interdits. Demande trois positionnements réellement distincts, puis une critique fondée uniquement sur les documents transmis.</p><p>Le test compare la reformulation d&apos;un lecteur humain au sens voulu. Une phrase plus élégante qui change la promesse est rejetée.</p></div></PlainNote>
        <PlainNote title="Formulaire et confiance"><div className="space-y-3"><p>Demande seulement les informations nécessaires à la prochaine étape. Chaque champ garde un libellé visible, des instructions utiles et un statut obligatoire ou facultatif.</p><p>Une erreur apparaît près du champ et explique comment la corriger. Après l&apos;envoi, une confirmation indique ce qui a été conservé, qui traite la demande et quelle suite attendre.</p><p>Explique l&apos;usage des données près de l&apos;action et donne accès à la politique applicable.</p></div></PlainNote>
      </SectionReveal>

      <SectionReveal className="mb-16">
        <ChapterTitle marker="3">Structurer le trajet de décision</ChapterTitle>
        <p className="mb-6 max-w-3xl text-sm leading-relaxed text-white/65">Une page est un trajet de décision. Son ordre dépend de la maturité du lecteur, de la source du trafic, de la preuve disponible et de l&apos;action attendue. Garde les blocs qui répondent à une question réelle. Le H1 est le titre principal de la page, celui que lecteurs et moteurs lisent en premier. Le trafic froid désigne des visiteurs qui ne te connaissent pas encore. Prends la page d&apos;un serrurier : la personne bloquée dehors veut le numéro et le délai tout en haut, alors que celle qui compare trois devis cherche les tarifs pratiqués, les garanties et les avis.</p>
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="border border-[#e8d5b0]/25 bg-[#111113] lg:sticky lg:top-24 lg:self-start">
            <div className="border-b border-white/10 px-4 py-3"><p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#e8d5b0]/60">Architecture choisie</p><p className="mt-1 text-xs text-white/55">Le niveau de décision donne l&apos;ordre de départ.</p></div>
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
          <div className="divide-y divide-white/10 border-y border-white/10">
            {PAGE_MODULES.map(([name, role], index) => (
              <div key={name} className="grid gap-2 py-4 sm:grid-cols-[2.5rem_9rem_1fr] sm:gap-4"><span className="font-mono text-xs text-[#e8d5b0]/60">{String(index + 1).padStart(2, "0")}</span><strong className="text-sm text-[#f0ede8]">{name}</strong><span className="text-sm leading-relaxed text-white/60">{role}</span></div>
            ))}
          </div>
        </div>
        <PlainNote title="Le test de structure"><p>Écris la question traitée au-dessus de chaque bloc. Fusionne les doublons. Déplace la preuve à l&apos;endroit où le doute apparaît. Si la page attire des demandes mal orientées, reprends la promesse, la preuve et l&apos;adéquation avant le bouton.</p></PlainNote>
        <div className="mt-8 grid gap-px bg-white/10 md:grid-cols-2">
          <div className="bg-[#161618] p-5"><h4 className="mb-2 font-semibold text-[#f0ede8]">Arborescence</h4><p className="text-sm leading-relaxed text-white/60">Une intention utile par page, des adresses lisibles et des liens qui permettent d&apos;aller de la question vers la preuve, l&apos;offre ou la suite logique.</p></div>
          <div className="bg-[#161618] p-5"><h4 className="mb-2 font-semibold text-[#f0ede8]">Plan de contenu</h4><p className="text-sm leading-relaxed text-white/60">Titre unique, H1 clair, sous-titres ordonnés, contenus propriétaires, images utiles, métadonnées et source de vérité pour chaque information.</p></div>
        </div>
        <PlainNote title="Process humain et IA"><div className="space-y-3"><p>L&apos;humain dessine d&apos;abord l&apos;arborescence et le parcours principal avec les questions du lecteur. L&apos;IA peut proposer des variantes, repérer les trous et signaler les blocs sans preuve.</p><p>Teste la structure avec une personne qui découvre le problème et une personne qui compare déjà des offres. Dans les deux cas, note le chemin suivi et les questions restées ouvertes.</p></div></PlainNote>
      </SectionReveal>

      <SectionReveal className="mb-16">
        <ChapterTitle marker="4">Designer une identité qui sert le message</ChapterTitle>
        <p className="mb-6 max-w-3xl text-sm leading-relaxed text-white/65">Le style suit la marque, le public et le contexte. Décide d&apos;abord l&apos;émotion et le statut que le site doit transmettre, puis cherche des références, des anti-références et une sensation cible qui servent cette décision. Cherche dans le web, l&apos;architecture, l&apos;édition, la photographie, le packaging, le cinéma et les objets. Pour chaque référence, nomme le mécanisme retenu : contraste, rythme, matière, cadrage, densité ou interaction. Pour une boulangerie de quartier, la direction peut partir du papier kraft des sachets, de la lumière du four au petit matin et de l&apos;ardoise écrite à la craie.</p>
        <div className="mb-7 flex flex-wrap items-center gap-x-7 gap-y-4 border-y border-white/10 py-5">
          {INSPIRATION_LOGOS.map(([name, src, invert]) => <ToolLogo key={name} name={name} src={src} invert={invert} />)}
          <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs">
            {SITE_REFERENCE_VIDEOS.map(([title, href]) => (
              <Link key={href} href={href} target="_blank" rel="noreferrer" className="text-[#e8d5b0] underline underline-offset-4">{title} ↗</Link>
            ))}
          </div>
        </div>
        <div className="divide-y divide-white/10 border-y border-white/10">
          <div className="grid gap-2 py-5 md:grid-cols-[2rem_11rem_1fr]"><span className="font-mono text-xs text-[#e8d5b0]/60">1)</span><strong className="text-sm text-[#f0ede8]">Collecter</strong><p className="text-sm leading-relaxed text-white/60">Rassemble des références de structure, de typographie, d&apos;images, de navigation, de matière et de mouvement. Note le problème résolu par chacune.</p></div>
          <div className="grid gap-2 py-5 md:grid-cols-[2rem_11rem_1fr]"><span className="font-mono text-xs text-[#e8d5b0]/60">2)</span><strong className="text-sm text-[#f0ede8]">Trier</strong><p className="text-sm leading-relaxed text-white/60">Sépare observation, mécanisme, adaptation et rejet. Une référence guide une décision; elle ne fournit ni identité ni page à copier.</p></div>
          <div className="grid gap-2 py-5 md:grid-cols-[2rem_11rem_1fr]"><span className="font-mono text-xs text-[#e8d5b0]/60">3)</span><strong className="text-sm text-[#f0ede8]">Explorer</strong><p className="text-sm leading-relaxed text-white/60">Produis plusieurs directions visuelles distinctes sur un écran réel. Commence par la navigation, le titre, le hero et l&apos;action principale.</p></div>
          <div className="grid gap-2 py-5 md:grid-cols-[2rem_11rem_1fr]"><span className="font-mono text-xs text-[#e8d5b0]/60">4)</span><strong className="text-sm text-[#f0ede8]">Valider</strong><p className="text-sm leading-relaxed text-white/60">Observe le rendu sur mobile et ordinateur. Vérifie la hiérarchie, les contrastes, les états, le point focal, la lisibilité et le mouvement réduit.</p></div>
          <div className="grid gap-2 py-5 md:grid-cols-[2rem_11rem_1fr]"><span className="font-mono text-xs text-[#e8d5b0]/60">5)</span><strong className="text-sm text-[#f0ede8]">Systématiser</strong><p className="text-sm leading-relaxed text-white/60">Après validation, documente couleurs, typographies, espacements, grille, composants, états, assets, motion, responsive et règles de contenu.</p></div>
        </div>
        <div className="mt-7 grid gap-x-8 border-y border-white/10 sm:grid-cols-2 lg:grid-cols-3">{STYLES.map(([name, look]) => <div key={name} className="grid grid-cols-[8.5rem_1fr] gap-3 border-b border-white/10 py-3 last:border-b-0 sm:grid-cols-1"><strong className="text-sm text-[#f0ede8]">{name}</strong><span className="text-xs leading-relaxed text-white/60">{look}</span></div>)}</div>
        <PlainNote title="Évite le rendu générique"><div className="space-y-3"><p>Des gradients, des cartes, des icônes et du verre répétés sans fonction rendent les marques interchangeables. Chaque effet doit soutenir la hiérarchie, l&apos;état ou le geste.</p><p>Utilise tes photos, captures, textures, mots et preuves. Un avis, un logo, un compteur ou un résultat fabriqué est rejeté.</p></div></PlainNote>
        <div className="mt-7"><MarkdownFilePreview filename="DESIGN-SYSTEM.md">{`# DESIGN-SYSTEM.md

Thèse visuelle: une phrase décrit la sensation et le mécanisme, puis chaque choix la rend visible.

Fondations: couleurs, typographies, espacements, grille, densité, formes, surfaces et élévation.

Composants: anatomie, variantes, contenu, interaction, chargement, vide, erreur, succès et focus.

Images et icônes: rôle, source, cadrage, ratio, texte alternatif, variantes et usages interdits.

Mouvement: déclencheur, durée, propriété, état de départ, état d'arrivée et alternative reduced motion.

Responsive et accessibilité: ordre de lecture, clavier, contraste, cibles tactiles, zoom et comportement sans animation.

Handoff: fichiers sources, tokens, assets, exemples, critères d'acceptation et contrôles à rejouer.`}</MarkdownFilePreview></div>
        <p className="mt-4 text-sm leading-relaxed text-white/60">Un design system devient exploitable quand un humain ou un agent peut créer un nouvel écran sans inventer une règle absente. Des jetons de design portables peuvent compléter la documentation, mais leur format doit être vérifié contre la spécification en vigueur au moment du projet.</p>
        <PlainNote title="Process avec l&apos;IA"><div className="space-y-3"><p>Donne le brief, les références classées, les contenus réels et les contraintes. Demande une seule zone à la fois, puis compare le rendu à la direction choisie.</p><p>Après validation humaine, fais extraire le système depuis les fichiers réels. Le test demande une variante et un état d&apos;erreur nouveaux. Si l&apos;agent invente des valeurs ou casse la famille visuelle, la documentation reste incomplète.</p></div></PlainNote>
      </SectionReveal>

      <SectionReveal className="mb-16">
        <ChapterTitle marker="5">Développer par tranches vérifiables</ChapterTitle>
        <p className="mb-6 max-w-3xl text-sm leading-relaxed text-white/65">Construis d&apos;abord la page la plus importante et son parcours complet. Chaque tranche reçoit les fichiers de contexte, les assets, les limites et des critères d&apos;acceptation. Ouvre le résultat réel avant d&apos;étendre le site. Pour un menuisier, la première tranche est la page d&apos;accueil avec le formulaire de devis, testée jusqu&apos;à la réception de la demande. Un webhook est un message automatique qu&apos;un service envoie à un autre quand un événement se produit, par exemple un paiement reçu.</p>
        <div className="grid gap-px bg-white/10 md:grid-cols-3">
          <div className="bg-[#161618] p-5"><h4 className="mb-2 font-semibold text-[#f0ede8]">Mission bornée</h4><p className="text-sm leading-relaxed text-white/60">Un écran, un parcours ou un problème à la fois. La sortie attendue et les fichiers autorisés sont explicites.</p></div>
          <div className="bg-[#161618] p-5"><h4 className="mb-2 font-semibold text-[#f0ede8]">Contexte accessible</h4><p className="text-sm leading-relaxed text-white/60">Brief, carte de message, design system, contenus, preuves, assets, stack, contraintes et emplacement du travail.</p></div>
          <div className="bg-[#161618] p-5"><h4 className="mb-2 font-semibold text-[#f0ede8]">Contrôle humain</h4><p className="text-sm leading-relaxed text-white/60">Regarde les fichiers touchés, ouvre la vraie page, exerce les états et refuse une livraison décrite sans preuve d&apos;exécution.</p></div>
        </div>
        <PlainNote title="Le Protocole Zéro relie les compétences"><div className="space-y-3"><p>Pars du résultat, puis repère les compétences manquantes : marché, stratégie, UX, copywriting, design, développement, backend, SEO, contenu, mesure ou déploiement.</p><p>Absorbe juste assez pour agir proprement. Relie ensuite les règles au contexte du site, exécute une tranche, mesure le résultat et distille ce qui résiste au terrain. Une fiche provisoire ne devient pas une méthode validée avant cette boucle.</p></div></PlainNote>
        <div className="mt-8 divide-y divide-white/10 border-y border-white/10">
          <div className="grid gap-2 py-5 md:grid-cols-[12rem_1fr]"><strong className="text-[#e8d5b0]">Comprendre le terrain</strong><p className="text-sm leading-relaxed text-white/60"><Link href="/skills#skill-deep-research-vertical" className="font-mono text-[#e8d5b0] underline underline-offset-4">deep-research-vertical</Link> organise la niche, les situations, les mots, les concurrents, les preuves et les inconnues.</p></div>
          <div className="grid gap-2 py-5 md:grid-cols-[12rem_1fr]"><strong className="text-[#e8d5b0]">Construire et contrôler</strong><p className="text-sm leading-relaxed text-white/60"><Link href="/skills#skill-oracle-site-web" className="font-mono text-[#e8d5b0] underline underline-offset-4">oracle-site-web</Link> relie le cadrage, le copy, la structure, le code, le SEO, la performance et la livraison.</p></div>
          <div className="grid gap-2 py-5 md:grid-cols-[12rem_1fr]"><strong className="text-[#e8d5b0]">Ajouter une spécialité</strong><p className="text-sm leading-relaxed text-white/60">Ajoute <Link href="/skills#skill-ux-ui-design" className="font-mono text-[#e8d5b0] underline underline-offset-4">ux-ui-design</Link> pour la direction visuelle et <Link href="/skills#skill-backend-orsayn" className="font-mono text-[#e8d5b0] underline underline-offset-4">backend-orsayn</Link> pour les comptes, les données, les paiements ou les webhooks. Pour un site éditorial, <span className="font-mono text-[#e8d5b0]">site-content-engine</span> organise les sujets, les liens internes, les articles et leur suivi.</p></div>
        </div>
        <div className="mt-8"><h4 className="mb-3 font-semibold text-[#f0ede8]">Un brief d&apos;exécution testable</h4><pre className="overflow-x-auto whitespace-pre-wrap break-words border border-white/10 bg-black/30 px-5 py-4 font-mono text-xs leading-6 text-[#e8d5b0]">{`Travaille dans /projets/mon-site.
Lis le brief, la carte de message et le design system avant de modifier un fichier.
Construis uniquement le parcours principal de la page d'accueil.
Utilise les contenus et les preuves présents dans /contenus. Signale tout manque au lieu de l'inventer.
Conserve la stack, les composants et les conventions déjà en place.
Vérifie le mobile, le clavier, le formulaire, les états, les liens, les images et le mouvement réduit.
Rends la liste des fichiers touchés, les contrôles exécutés, leurs résultats et les écarts restants.`}</pre></div>
        <div className="mt-8 border-t border-white/10 pt-6">
          <h4 className="mb-4 font-semibold text-[#f0ede8]">Les outils restent des alternatives</h4>
          <div className="flex flex-wrap gap-x-7 gap-y-4">{TOOL_LOGOS.map(([name, src, invert]) => <ToolLogo key={name} name={name} src={src} invert={invert} />)}</div>
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-white/60">Choisis selon la lecture du contexte, le contrôle du code, la collaboration, la portabilité et la possibilité de vérifier le résultat. La génération d&apos;images dépend du modèle et du service disponibles. Si elle manque, prépare les briefs et les fichiers attendus au lieu d&apos;annoncer un asset absent.</p><p className="mt-3 max-w-3xl text-sm leading-relaxed text-white/60">Sépare les rôles. Un outil produit ou anime l&apos;asset, puis l&apos;outil de construction l&apos;intègre avec des demandes ciblées : cadrage, point focal, responsive, boutons et menu mobile. Tu contrôles ensuite le rendu en local. Passe par l&apos;API directe du fournisseur, c&apos;est-à-dire son accès programmable sans intermédiaire, quand tu dois contrôler le modèle, le coût, les fichiers ou la confidentialité.</p>
          <div className="mt-5 flex flex-wrap gap-x-7 gap-y-4">{BUILD_LOGOS.map(([name, src, invert]) => <ToolLogo key={name} name={name} src={src} invert={invert} />)}</div>
          <div className="mt-5 flex flex-wrap gap-x-7 gap-y-4">{VISUAL_LOGOS.map(([name, src, invert]) => <ToolLogo key={name} name={name} src={src} invert={invert} />)}</div>
        </div>
        <div className="mt-8 border-t border-white/10 pt-6">
          <h4 className="mb-3 font-semibold text-[#f0ede8]">Choisir l&apos;hébergement par besoin</h4>
          <div className="mb-6 flex flex-wrap gap-x-7 gap-y-4">{DELIVERY_LOGOS.map(([name, src, invert]) => <ToolLogo key={name} name={name} src={src} invert={invert} />)}</div>
          <div className="divide-y divide-white/10 border-y border-white/10">
            <div className="grid gap-2 py-5 md:grid-cols-[12rem_1fr]"><strong className="text-[#e8d5b0]">Site public</strong><p className="text-sm leading-relaxed text-white/60">Compare la compatibilité avec la stack, les fonctions serveur, le cache, le DNS, le coût réel et la reprise des accès.</p></div>
            <div className="grid gap-2 py-5 md:grid-cols-[12rem_1fr]"><strong className="text-[#e8d5b0]">Backend et données</strong><p className="text-sm leading-relaxed text-white/60">Décide le modèle de données, les permissions, les sauvegardes, la restauration et les responsabilités avant de choisir un fournisseur.</p></div>
            <div className="grid gap-2 py-5 md:grid-cols-[12rem_1fr]"><strong className="text-[#e8d5b0]">Serveur privé</strong><p className="text-sm leading-relaxed text-white/60">Prévois mises à jour, sauvegardes, supervision, rotation des secrets, pare-feu, comptes séparés et réponse aux incidents. Un réseau privé réduit l&apos;exposition de l&apos;administration sans remplacer ces contrôles.</p></div>
          </div>
        </div>
        <PlainNote title="Capitaliser sans cloner"><div className="space-y-3"><p>Après validation, transforme l&apos;architecture, le système visuel, les composants, les règles de contenu et les contrôles en template ou en skill versionné.</p><p>Pour un nouveau projet, garde les standards qui ont une preuve et remplace tout ce qui appartient au client précédent : offre, mots, preuves, couleurs, logo, photos, illustrations, adresses et intégrations.</p><p>Une galerie interne peut réunir ces bases avec leur aperçu, leur version, leurs limites et leurs tests. Elle accélère la production sans présenter un clone comme un travail adapté.</p></div></PlainNote>
        <PlainNote title="La remise des clés"><p>La livraison comprend le dépôt, le domaine, l&apos;hébergeur, les bases, les variables, les comptes de mesure, les assets sources, la documentation et la procédure de reprise. Une adresse publique seule ne prouve pas que le client peut continuer sans toi.</p></PlainNote>
      </SectionReveal>

      <SectionReveal>
        <ChapterTitle marker="6">Vérifier le vrai parcours et sa mesure</ChapterTitle>
        <p className="mb-6 max-w-3xl text-sm leading-relaxed text-white/65">Une capture réussie ne clôture pas un site. Vérifie le message, les interactions, les erreurs, la découvrabilité, la vitesse, la mesure et la propriété des accès sur la version réellement livrée.</p>
        <div className="divide-y divide-white/10 border-y border-white/10">
          <div className="grid gap-2 py-5 md:grid-cols-[11rem_1fr]"><strong className="text-[#e8d5b0]">Compréhension</strong><p className="text-sm leading-relaxed text-white/60">Un lecteur visé reformule l&apos;offre, son mécanisme, ses limites et la prochaine action sans aide.</p></div>
          <div className="grid gap-2 py-5 md:grid-cols-[11rem_1fr]"><strong className="text-[#e8d5b0]">Parcours</strong><p className="text-sm leading-relaxed text-white/60">Teste téléphone, ordinateur, clavier, zoom, navigation, boutons, liens, formulaires, succès, erreurs et reprise après interruption.</p></div>
          <div className="grid gap-2 py-5 md:grid-cols-[11rem_1fr]"><strong className="text-[#e8d5b0]">Contenu</strong><p className="text-sm leading-relaxed text-white/60">Contrôle titres, preuves, dates, images, textes alternatifs, coordonnées, politiques, pages manquantes et contenu visible sans script lorsque nécessaire.</p></div>
          <div className="grid gap-2 py-5 md:grid-cols-[11rem_1fr]"><strong className="text-[#e8d5b0]">Technique</strong><p className="text-sm leading-relaxed text-white/60">Contrôle statuts HTTP, HTTPS, redirections, erreurs console, secrets, permissions, sauvegardes et restauration. Le sitemap liste les adresses importantes. Le fichier robots.txt ne bloque aucune page utile. L&apos;URL canonique désigne la version principale d&apos;une page. Les données structurées, ce balisage qui décrit la page aux moteurs, correspondent au contenu visible.</p></div>
          <div className="grid gap-2 py-5 md:grid-cols-[11rem_1fr]"><strong className="text-[#e8d5b0]">Performance</strong><p className="text-sm leading-relaxed text-white/60">Mesure chargement, interactivité et stabilité visuelle en laboratoire, puis avec des données réelles quand le trafic le permet. Compresse les images et réserve leur place pour éviter que la page saute au chargement. Les seuils viennent de la documentation officielle en vigueur.</p></div>
          <div className="grid gap-2 py-5 md:grid-cols-[11rem_1fr]"><strong className="text-[#e8d5b0]">Livraison</strong><p className="text-sm leading-relaxed text-white/60">Vérifie que les accès, les sources, les variables, les sauvegardes, les instructions et le propriétaire de chaque service ont été remis.</p></div>
        </div>
        <div className="mt-8">
          <h4 className="mb-4 font-semibold text-[#f0ede8]">SEO et découverte</h4>
          <p className="mb-5 max-w-3xl text-sm leading-relaxed text-white/60">Le SEO aide les moteurs à comprendre quelle page répond à quelle question. Il ne consiste pas à répéter des mots-clés. Commence par un contenu original et utile, puis vérifie que les pages importantes sont reliées, accessibles et techniquement découvrables. Ne crée pas plusieurs pages presque identiques pour occuper les résultats. Pour une activité locale, une page par zone a du sens seulement si son contenu et ses preuves changent vraiment.</p>
          <div className="grid gap-px bg-white/10 md:grid-cols-2">
            <div className="bg-[#161618] p-5"><h5 className="mb-2 font-semibold text-[#f0ede8]">Search Console</h5><p className="text-sm leading-relaxed text-white/60">Vérifie la propriété, le sitemap, l&apos;inspection des pages importantes, les requêtes, les clics et les problèmes signalés. Une demande d&apos;indexation ne promet ni présence ni classement.</p></div>
            <div className="bg-[#161618] p-5"><h5 className="mb-2 font-semibold text-[#f0ede8]">IndexNow</h5><p className="text-sm leading-relaxed text-white/60">Le protocole peut notifier ses moteurs participants lorsqu&apos;une adresse change. La réception de la notification ne prouve pas l&apos;indexation. Pour les autres moteurs, garde leurs outils et ton sitemap.</p></div>
          </div>
        </div>
        <div className="mt-8">
          <h4 className="mb-4 font-semibold text-[#f0ede8]">Mesurer une question business</h4>
          <div className="mb-7 flex flex-wrap gap-x-7 gap-y-4">{MEASURE_LOGOS.map(([name, src, invert]) => <ToolLogo key={name} name={name} src={src} invert={invert} />)}</div>
          <p className="mb-5 max-w-3xl text-sm leading-relaxed text-white/60">Chaque outil répond à une question. Search Console montre les requêtes, les impressions, les clics, la position moyenne et les problèmes d&apos;indexation. Plausible ou PostHog comptent les visiteurs et les actions utiles sur le site. PageSpeed Insights repère les ralentissements et les déplacements de contenu. Par exemple, chiffres fictifs : sur 40 visites, 6 personnes commencent le formulaire et 2 l&apos;envoient. Le travail porte alors sur les 4 qui abandonnent en route.</p>
          <div className="divide-y divide-white/10 border-y border-white/10">
            <div className="grid gap-2 py-5 md:grid-cols-[14rem_1fr]"><strong className="text-sm text-[#e8d5b0]">Visibilité</strong><p className="text-sm leading-relaxed text-white/60">Quelles personnes arrivent, par quelle requête ou campagne, sur quelle page et avec quelle intention probable ?</p></div>
            <div className="grid gap-2 py-5 md:grid-cols-[14rem_1fr]"><strong className="text-sm text-[#e8d5b0]">Compréhension</strong><p className="text-sm leading-relaxed text-white/60">Voient-elles la preuve, utilisent-elles la navigation utile et atteignent-elles l&apos;action principale ?</p></div>
            <div className="grid gap-2 py-5 md:grid-cols-[14rem_1fr]"><strong className="text-sm text-[#e8d5b0]">Complétion</strong><p className="text-sm leading-relaxed text-white/60">Où le parcours s&apos;arrête-t-il entre le premier geste, le formulaire, la confirmation et la suite commerciale réelle ?</p></div>
          </div>
          <div className="mt-7 overflow-x-auto border-y border-[#e8d5b0]/25 py-5"><div className="flex min-w-[680px] items-center justify-between gap-3 font-mono text-sm text-[#e8d5b0]"><span>visite utile</span><span className="text-white/60">→</span><span>action</span><span className="text-white/60">→</span><span>formulaire commencé</span><span className="text-white/60">→</span><span>confirmation</span><span className="text-white/60">→</span><span>suite traitée</span></div></div>
        </div>
        <PlainNote title="Process humain"><div className="space-y-3"><p>Prépare une liste de contrôle avant la mise en ligne. Exécute le parcours principal avec de bonnes données, de mauvaises données et une interruption réseau.</p><p>Note chaque résultat avec une preuve : capture, journal, rapport ou observation datée. Un blocage critique empêche la livraison. Un écart mineur garde un propriétaire et une date de revue.</p></div></PlainNote>
        <PlainNote title="Process avec l&apos;IA"><div className="space-y-3"><p>Donne le brief, les critères d&apos;acceptation et l&apos;adresse ou le projet autorisé. Demande à l&apos;agent de préparer les scénarios, d&apos;exécuter uniquement les contrôles accessibles et de distinguer réussi, échoué et non testé.</p><p>Compare son rapport à un passage manuel du parcours. Une sortie sans artefact ni commande réellement exécutée reste une proposition de test, jamais une preuve.</p></div></PlainNote>
        <div className="mt-8 border border-[#e8d5b0]/25 bg-[#e8d5b0]/[0.04] p-5"><p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#e8d5b0]/75">À faire maintenant</p><p className="mt-2 text-sm leading-relaxed text-white/65">Choisis un projet. Remplis la phrase de cadrage, rassemble les preuves et produis le brief de compréhension. Ne passe au positionnement qu&apos;après une reformulation correcte par une autre personne. Compte une heure. Tu repars avec un brief de compréhension relu.</p></div>
      </SectionReveal>
    </div>
  );
}
