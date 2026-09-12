import Link from "next/link";
import { LiquidCard } from "@/components/ui/liquid-glass-card";
import { SectionReveal } from "@/components/ui/section-reveal";
import { MarkdownFilePreview } from "@/components/ui/markdown-file-preview";

const SITE_TYPES = [
  ["Landing page", "Présenter une offre et obtenir une action précise: appel, devis, essai ou achat."],
  ["Site vitrine", "Expliquer une activité, montrer des réalisations et faciliter la prise de contact."],
  ["Portfolio", "Faire voir le travail, le rôle joué et les résultats obtenus sur chaque projet."],
  ["Site de contenu", "Répondre à des questions utiles avec des articles, guides ou ressources."],
  ["E-commerce", "Aider à choisir un produit, acheter, puis comprendre la livraison et les retours."],
  ["Site connecté", "Donner accès à un compte, des données privées, un paiement ou un service en ligne."],
] as const;

const PAGE_SECTIONS = [
  ["Navbar", "Le logo, quelques liens compréhensibles et une action principale."],
  ["Hero section", "Le premier écran. Il contient le H1, le Sous-titre, le CTA principal et une première preuve."],
  ["Problème", "La situation que le client reconnaît, avec ses mots et sans dramatisation inventée."],
  ["Solution", "La façon simple dont l’offre résout ce problème."],
  ["Démonstration", "Le produit en action, un exemple, une capture annotée ou un avant/après réel."],
  ["Preuve sociale", "Un cas client, un avis autorisé, un résultat vérifiable ou une expertise démontrée."],
  ["Offre", "Ce qui est inclus, pour qui, à quelles conditions et ce qui ne l’est pas."],
  ["FAQ", "Les vraies questions entendues avant l’achat: prix, délai, engagement, fonctionnement."],
  ["CTA final", "La même prochaine étape que plus haut, avec une réassurance factuelle."],
  ["Footer", "Le contact, les pages utiles, les mentions légales et une seconde chance de s’orienter."],
] as const;

const STYLES = [
  ["Minimalisme", "Beaucoup d’espace, peu d’éléments, une hiérarchie très nette.", "Une offre simple avec de bonnes photos."],
  ["Swiss design", "Grille visible, typographie précise, alignements stricts, contraste rouge/noir possible.", "Une marque qui veut paraître méthodique et directe."],
  ["Éditorial", "Grands titres, rythme de magazine, images légendées, lecture en colonnes.", "Un studio, un média ou une marque avec une histoire forte."],
  ["Brutalisme", "Structure exposée, contrastes francs, composition volontairement rude.", "Une audience culturelle qui comprend ce choix radical."],
  ["Néo-brutalisme", "Contours épais, aplats vifs, ombres dures et contrôles très lisibles.", "Une marque jeune et énergique, si la lisibilité reste intacte."],
  ["Skeuomorphism", "Les contrôles ressemblent à des objets physiques: bouton, molette, carnet.", "Un outil où cette ressemblance aide à comprendre l’action."],
  ["Glassmorphism", "Panneau translucide et flou posé sur un fond stable.", "Une couche flottante ponctuelle, pas toutes les sections."],
  ["Liquid Glass", "Surface transparente qui réagit à ce qui passe derrière elle.", "Une navigation ou un contrôle superposé, avec contraste vérifié."],
  ["Maximalisme", "Couleurs, motifs et typographies abondants, mais organisés par une idée forte.", "Une marque expressive avec assez d’assets propriétaires."],
  ["Rétro-futurisme", "Vision ancienne du futur: chrome, grilles, cadrans, couleurs spatiales.", "Un univers culturel ou produit qui rend cette référence pertinente."],
  ["Dither / ASCII", "Images tramées, caractères et pixels limités comme langage graphique.", "Une signature numérique assumée, sans dégrader les logos ni le texte."],
] as const;

const SKILL_STEPS = [
  ["1. Comprendre le marché", "deep-research-vertical", "Cherche les concurrents, les objections et les mots employés par les clients. Tu pars de sources, pas d’idées inventées."],
  ["2. Préparer le site", "oracle-site-web", "Remplace une grande partie du travail manuel de classification, sitemap, structure, copy, SEO, performance et plan de livraison."],
  ["3. Définir l’expérience", "ux-ui-design", "Transforme le brief et tes références en direction visuelle, composants, responsive et règles concrètes."],
  ["4. Vérifier l’usage", "Skills Apple", "Aident à contrôler la hiérarchie, les états, le clavier, l’accessibilité et les petits écrans sans copier le style Apple."],
  ["5. Sécuriser ce qui est connecté", "backend-orsayn", "À utiliser s’il y a comptes, données privées, paiement, base de données, API ou automatisations sensibles."],
] as const;

const TOOL_LOGOS = [
  ["Codex", "/brand-logos/codex.svg"],
  ["Claude Code", "/brand-logos/claude-code.svg"],
  ["Antigravity", "/brand-logos/antigravity.svg"],
  ["GitHub", "/brand-logos/github.svg"],
] as const;

const MEASURE_LOGOS = [
  ["Google Search Console", "/brand-logos/googlesearchconsole.svg"],
  ["Plausible", "/brand-logos/plausibleanalytics.svg"],
  ["PostHog", "/brand-logos/posthog.svg"],
  ["PageSpeed Insights", "/brand-logos/pagespeedinsights.svg"],
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
    <div className="border-l-2 border-[#e8d5b0]/55 bg-[#e8d5b0]/[0.035] px-5 py-4">
      <p className="mb-1 text-sm font-semibold text-[#e8d5b0]">{title}</p>
      <div className="text-sm leading-relaxed text-white/60">{children}</div>
    </div>
  );
}

function ToolLogo({ name, src }: { name: string; src: string }) {
  return (
    <span className="inline-flex items-center gap-2 text-sm text-white/70">
      <span className="flex h-9 w-9 items-center justify-center border border-white/10 bg-white/[0.03]">
        <img src={src} alt="" aria-hidden="true" width={22} height={22} loading="lazy" className="h-[22px] w-[22px] object-contain" />
      </span>
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
        <p className="max-w-3xl text-base leading-relaxed text-white/65">
          Un bon site aide une personne à comprendre une offre, à vérifier qu&apos;elle est sérieuse et à passer à l&apos;étape suivante. L&apos;IA accélère la recherche, l&apos;écriture et le code. Elle ne connaît pas ton client, tes preuves ni ta marque si tu ne les lui donnes pas.
        </p>
      </header>

      <SectionReveal className="mb-16">
        <LiquidCard variant="elevated" className="p-6 md:p-8">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#e8d5b0]/65">Le but business</p>
          <h3 className="mb-3 text-xl font-semibold text-[#f0ede8]">Une page, une personne, une prochaine étape</h3>
          <p className="max-w-3xl text-sm leading-relaxed text-white/60">
            Avant de choisir les couleurs, complète cette phrase: « Mon client arrive parce que..., il doit comprendre..., puis il peut... ». Si tu ne peux pas la finir simplement, ne demande pas encore à l&apos;IA de construire la page.
          </p>
        </LiquidCard>
      </SectionReveal>

      <SectionReveal className="mb-16">
        <ChapterTitle marker="1">Quel site faut-il vraiment?</ChapterTitle>
        <p className="mb-6 max-w-3xl text-sm leading-relaxed text-white/60">
          Le format dépend de ce que le visiteur doit accomplir. Une petite landing page peut suffire pour tester une offre. Un site connecté devient nécessaire seulement si la personne doit se connecter, payer ou retrouver ses données.
        </p>
        <div className="divide-y divide-white/10 border-y border-white/10">
          {SITE_TYPES.map(([name, role]) => (
            <div key={name} className="grid gap-1 py-4 sm:grid-cols-[10rem_1fr] sm:gap-6">
              <p className="font-medium text-[#e8d5b0]">{name}</p>
              <p className="text-sm leading-relaxed text-white/55">{role}</p>
            </div>
          ))}
        </div>
      </SectionReveal>

      <SectionReveal className="mb-16">
        <ChapterTitle marker="2">La structure d&apos;une page qui vend</ChapterTitle>
        <p className="mb-6 max-w-3xl text-sm leading-relaxed text-white/60">
          Une page de vente répond aux questions dans l&apos;ordre où elles arrivent. Voici une base complète. Ce n&apos;est pas un modèle rigide: retire ce qui n&apos;aide pas, ajoute une section quand une objection réelle le demande.
        </p>
        <div className="grid gap-8 lg:grid-cols-[0.7fr_1.3fr]">
          <div className="lg:sticky lg:top-24 lg:self-start">
            <div className="border border-[#e8d5b0]/25 bg-[#111113]">
              <div className="flex items-center justify-between border-b border-white/10 px-4 py-3 text-xs text-white/50">
                <span className="font-semibold text-white/80">Navbar</span><span>Logo · Liens · CTA</span>
              </div>
              <div className="px-5 py-8 text-center">
                <p className="mb-2 text-[10px] uppercase tracking-[0.18em] text-[#e8d5b0]/60">Hero section</p>
                <p className="mx-auto max-w-xs text-xl font-semibold text-white">H1: le résultat compris en quelques secondes</p>
                <p className="mx-auto mt-3 max-w-sm text-xs leading-relaxed text-white/55">Sous-titre: pour qui, comment et sans quelle difficulté.</p>
                <span className="mt-5 inline-block bg-[#e8d5b0] px-4 py-2 text-xs font-semibold text-[#161618]">CTA principal</span>
                <p className="mt-2 text-[10px] text-white/55">Réponse en 24 h, uniquement si c&apos;est vrai</p>
              </div>
              {PAGE_SECTIONS.slice(2, 9).map(([name]) => (
                <div key={name} className="border-t border-white/10 px-4 py-3 text-xs text-white/55">{name}</div>
              ))}
              <div className="border-t border-white/10 bg-white/[0.025] px-4 py-5 text-xs text-white/55">Footer · Contact · Légal · Liens utiles</div>
            </div>
          </div>
          <div className="divide-y divide-white/10 border-y border-white/10">
            {PAGE_SECTIONS.map(([name, role], index) => (
              <div key={name} className="grid gap-2 py-4 sm:grid-cols-[2.5rem_9rem_1fr] sm:gap-4">
                <span className="font-mono text-xs text-[#e8d5b0]/60">{String(index + 1).padStart(2, "0")}</span>
                <strong className="text-sm text-[#f0ede8]">{name}</strong>
                <span className="text-sm leading-relaxed text-white/50">{role}</span>
              </div>
            ))}
          </div>
        </div>
        <PlainNote title="L&apos;ordre des sections est adaptable">
          <p>Une personne qui te connaît déjà peut voir l&apos;offre plus tôt. Une personne qui découvre le problème a besoin d&apos;abord de le reconnaître. Garde toujours un fil simple: comprendre, vérifier, décider.</p>
        </PlainNote>
      </SectionReveal>

      <SectionReveal className="mb-16">
        <ChapterTitle marker="3">La proposition de valeur et le copywriting</ChapterTitle>
        <p className="mb-6 max-w-3xl text-sm leading-relaxed text-white/60">
          La proposition de valeur dit qui tu aides, quel résultat la personne obtient et pourquoi elle peut te croire. Le copywriting, ou l&apos;écriture qui aide à vendre, rend cette décision claire. Il ne sert pas à gonfler une promesse.
        </p>
        <div className="grid gap-px bg-white/10 md:grid-cols-2">
          <div className="bg-[#161618] p-5">
            <p className="mb-3 text-xs uppercase tracking-[0.14em] text-white/55">Faible</p>
            <p className="text-lg text-white/60">« Des solutions digitales innovantes pour votre croissance. »</p>
            <p className="mt-3 text-sm leading-relaxed text-white/55">On ne sait ni pour qui, ni quel résultat, ni ce qui est vendu.</p>
          </div>
          <div className="bg-[#161618] p-5">
            <p className="mb-3 text-xs uppercase tracking-[0.14em] text-[#e8d5b0]/70">Mieux</p>
            <p className="text-lg text-white/80">« Un site clair pour que les artisans reçoivent des demandes de devis qualifiées. »</p>
            <p className="mt-3 text-sm leading-relaxed text-white/50">La cible, l&apos;outil et le résultat sont visibles. Il reste à ajouter une preuve réelle.</p>
          </div>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <div className="border-t border-white/10 pt-5">
            <p className="mb-2 text-xs uppercase tracking-[0.14em] text-white/55">Fonctionnalité</p>
            <p className="text-white/70">« Agenda avec rappels automatiques. »</p>
          </div>
          <div className="border-t border-[#e8d5b0]/30 pt-5">
            <p className="mb-2 text-xs uppercase tracking-[0.14em] text-[#e8d5b0]/65">Bénéfice</p>
            <p className="text-white/80">« Tes clients se souviennent du rendez-vous, sans que tu les relances un par un. »</p>
          </div>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          <div>
            <h4 className="mb-3 font-semibold text-[#f0ede8]">Écris avec les mots de tes clients</h4>
            <p className="text-sm leading-relaxed text-white/55">
              Relis les appels, emails, avis et questions de vente. Si les clients disent « je perds mes soirées à faire les devis », garde ces mots. Ne remplace pas une phrase concrète par « optimiser les opérations ».
            </p>
          </div>
          <div>
            <h4 className="mb-3 font-semibold text-[#f0ede8]">Un CTA dit ce que la personne obtient</h4>
            <ul className="space-y-2 text-sm text-white/55">
              <li><span className="text-white/55">Faible:</span> Envoyer, Soumettre, Cliquez ici.</li>
              <li><span className="text-[#e8d5b0]">Mieux:</span> Recevoir mon devis, Voir la démo, Réserver mon appel.</li>
              <li>Garde un seul CTA principal par écran et une réassurance vraie juste dessous.</li>
            </ul>
          </div>
        </div>

        <PlainNote title="Réduis la friction du formulaire">
          <div className="space-y-3">
            <p>Demande seulement les informations nécessaires pour la prochaine étape. Pour rappeler un prospect, un nom, un moyen de contact et une question utile peuvent suffire. Chaque champ supplémentaire demande un effort et doit avoir une raison claire.</p>
            <p>Chaque champ garde un libellé visible. Indique s&apos;il est obligatoire ou facultatif et choisis le bon format, par exemple email pour une adresse email et téléphone pour un numéro. Si une saisie ne convient pas, affiche un message d&apos;erreur près du champ et explique comment la corriger.</p>
            <p>Après l&apos;envoi, montre une confirmation claire et annonce la suite. Teste aussi où arrive la demande, qui la reçoit et sous quel délai elle sera traitée. Une courte phrase près du bouton doit expliquer au visiteur l&apos;utilisation de ses données et mener vers la politique de confidentialité.</p>
          </div>
        </PlainNote>

        <div className="mt-7">
          <MarkdownFilePreview filename="COPY-DECK.md">
{`# COPY-DECK.md

Client: [personne précise]
Problème, dans ses mots: [citation ou note de recherche]
Résultat attendu: [simple et concret]
Preuve disponible: [source réelle]
H1: [une promesse claire]
Sous-titre: [cible + méthode + limite utile]
CTA principal: [ce que la personne obtient]
Réassurance: [fait vérifié]
Questions de la FAQ: [objections entendues]`}
          </MarkdownFilePreview>
        </div>
      </SectionReveal>

      <SectionReveal className="mb-16">
        <ChapterTitle marker="4">Construire une vraie identité</ChapterTitle>
        <p className="mb-6 max-w-3xl text-sm leading-relaxed text-white/60">
          Le style suit la marque et l&apos;audience. Un cabinet juridique, un festival et un logiciel médical ne doivent pas recevoir la même page. Commence par des références choisies, puis utilise tes propres photos, captures, illustrations, textures, icônes et mots.
        </p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {STYLES.map(([name, look, use], index) => (
            <div
              key={name}
              className={`min-h-48 border p-5 ${index % 4 === 0 ? "border-[#e8d5b0]/35 bg-[#e8d5b0]/[0.025]" : index % 4 === 1 ? "border-white/20 bg-white/[0.015]" : index % 4 === 2 ? "border-dashed border-white/20 bg-[#111113]" : "border-white/10 bg-[#1b1b1d]"}`}
            >
              <p className={`${index % 3 === 0 ? "font-serif text-2xl" : index % 3 === 1 ? "font-mono text-lg uppercase tracking-tight" : "text-xl font-black"} text-[#f0ede8]`}>{name}</p>
              <div className={`my-4 h-px ${index % 2 ? "bg-white/20" : "bg-[#e8d5b0]/45"}`} />
              <p className="text-sm leading-relaxed text-white/55">{look}</p>
              <p className="mt-3 text-xs leading-relaxed text-[#e8d5b0]/60">Utile pour: {use}</p>
            </div>
          ))}
        </div>

        <LiquidCard className="mt-8 p-6">
          <h4 className="mb-3 font-semibold text-[#f0ede8]">Évite le contenu générique produit par l&apos;IA</h4>
          <p className="mb-4 text-sm leading-relaxed text-white/55">Ce rendu sans personnalité est parfois appelé AI slop. Il apparaît quand l&apos;IA applique les mêmes textes et les mêmes effets à tous les projets.</p>
          <ul className="grid gap-3 text-sm leading-relaxed text-white/55 md:grid-cols-2">
            <li>• Pas de gradient violet, verre ou grille de cartes par défaut.</li>
            <li>• Pas de faux avis, faux logos, faux compteurs ou faux résultats.</li>
            <li>• Pas de texte qui pourrait vendre n&apos;importe quelle entreprise.</li>
            <li>• Pas d&apos;icône décorative devant chaque titre.</li>
            <li>• Utilise des références nommées et explique ce que tu en retiens.</li>
            <li>• Crée des compositions variées selon le contenu, pas selon un template.</li>
            <li>• Donne à l&apos;IA tes assets propriétaires et leurs droits d&apos;usage.</li>
            <li>• Si tu n&apos;as pas encore de preuve, montre une démo honnête et dis ce qui manque.</li>
          </ul>
        </LiquidCard>

        <div className="mt-7">
          <MarkdownFilePreview filename="DESIGN-SYSTEM.md">
{`# DESIGN-SYSTEM.md

Marque: [ce qu'elle doit faire ressentir]
Audience: [personnes et contexte]
Références: [liens + élément observé]
À éviter: [styles qui contredisent la marque]
Typographies: [rôle de chaque police]
Couleurs: [rôle de chaque couleur]
Images: [photos, captures, illustrations, droits]
Compositions: [règles pour varier sans perdre la cohérence]
Mobile: [ce qui change sur petit écran]`}
          </MarkdownFilePreview>
        </div>
      </SectionReveal>

      <SectionReveal className="mb-16">
        <ChapterTitle marker="5">Le workflow avec les skills</ChapterTitle>
        <p className="mb-6 max-w-3xl text-sm leading-relaxed text-white/60">
          Les skills évitent de tout expliquer à nouveau dans chaque prompt. Chacun prend une partie du travail. Tu vérifies les faits, les choix de marque, les droits et l&apos;action finale.
        </p>
        <div className="divide-y divide-white/10 border-y border-white/10">
          {SKILL_STEPS.map(([step, skill, detail]) => (
            <div key={skill} className="grid gap-2 py-5 md:grid-cols-[12rem_12rem_1fr] md:gap-6">
              <p className="text-sm font-medium text-white/80">{step}</p>
              {skill === "oracle-site-web" ? (
                <Link href="/skills#skill-oracle-site-web" className="text-sm font-semibold text-[#e8d5b0] underline decoration-[#e8d5b0]/30 underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#e8d5b0]">
                  {skill}
                </Link>
              ) : (
                <p className="font-mono text-sm text-[#e8d5b0]">{skill}</p>
              )}
              <p className="text-sm leading-relaxed text-white/50">{detail}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 border-t border-white/10 pt-6">
          <h4 className="mb-4 font-semibold text-[#f0ede8]">Outils qui peuvent exécuter le travail</h4>
          <div className="flex flex-wrap gap-x-7 gap-y-4">
            {TOOL_LOGOS.map(([name, src]) => <ToolLogo key={name} name={name} src={src} />)}
          </div>
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-white/50">
            Codex, Claude Code ou Antigravity peuvent lire les documents et modifier le projet. GitHub conserve les versions et permet de relire chaque changement. Donne toujours un lot précis: une section, un formulaire ou un contrôle, puis teste avant de continuer.
          </p>
        </div>
      </SectionReveal>

      <SectionReveal className="mb-16">
        <ChapterTitle marker="6">Les fichiers qui empêchent l&apos;IA d&apos;inventer</ChapterTitle>
        <div className="grid gap-6 lg:grid-cols-2">
          <MarkdownFilePreview filename="SITEMAP.md">
{`# SITEMAP.md

/               Accueil
/services       Choisir un service
/realisations   Voir des preuves
/a-propos       Comprendre qui intervient
/contact        Demander un échange
/mentions-legales
/confidentialite

Pour chaque page:
- question principale
- action attendue
- page qui mène ici
- page suivante`}
          </MarkdownFilePreview>
          <MarkdownFilePreview filename="PAGE-BLUEPRINT.md">
{`# PAGE-BLUEPRINT.md

Page: Accueil
Visiteur: [qui arrive]
But: [ce qu'il doit comprendre]
Action: [une seule]

Ordre proposé:
1. Hero
2. Problème
3. Solution
4. Démonstration
5. Preuves
6. Offre
7. FAQ
8. CTA final

Chaque section: message, contenu, preuve, état mobile.`}
          </MarkdownFilePreview>
        </div>
        <p className="mt-6 text-sm leading-relaxed text-white/55">
          Ajoute le COPY-DECK.md pour les textes, le DESIGN-SYSTEM.md pour l&apos;identité et le QA-REPORT.md pour noter ce qui a réellement été testé. Ces fichiers peuvent être courts. Leur rôle est de garder les décisions stables pendant que l&apos;IA travaille.
        </p>
      </SectionReveal>

      <SectionReveal className="mb-16">
        <ChapterTitle marker="7">Le SEO, expliqué simplement</ChapterTitle>
        <p className="mb-6 max-w-3xl text-sm leading-relaxed text-white/60">
          Le SEO aide un moteur de recherche à comprendre quelle question ta page résout. Commence par écrire une page utile pour une intention précise. Donne-lui un titre clair, une adresse lisible, des sous-titres logiques et des liens depuis d&apos;autres pages du site.
        </p>
        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <h4 className="mb-3 font-semibold text-[#f0ede8]">Ce que tu fais</h4>
            <ul className="space-y-3 text-sm leading-relaxed text-white/55">
              <li>1. Une question ou un besoin principal par page.</li>
              <li>2. Un titre qui dit clairement le sujet.</li>
              <li>3. Une réponse utile avec tes exemples, sources et preuves.</li>
              <li>4. Des liens qui aident à poursuivre le parcours.</li>
              <li>5. Une page rapide, lisible sur mobile et accessible.</li>
            </ul>
          </div>
          <div className="border-l border-white/10 pl-5">
            <p className="mb-3 text-xs uppercase tracking-[0.14em] text-[#e8d5b0]/65">Deuxième couche: les noms techniques</p>
            <dl className="space-y-3 text-sm leading-relaxed">
              <div><dt className="text-white/75">Title et description</dt><dd className="text-white/55">Le titre et le résumé vus dans les résultats.</dd></div>
              <div><dt className="text-white/75">Sitemap</dt><dd className="text-white/55">La liste des pages que le moteur peut découvrir.</dd></div>
              <div><dt className="text-white/75">Canonical</dt><dd className="text-white/55">L&apos;adresse officielle d&apos;une page.</dd></div>
              <div><dt className="text-white/75">Indexation</dt><dd className="text-white/55">Le fait qu&apos;une page puisse entrer dans l&apos;index du moteur.</dd></div>
            </dl>
          </div>
        </div>
      </SectionReveal>

      <SectionReveal className="mb-16">
        <ChapterTitle marker="8">Mesurer ce qui aide le business</ChapterTitle>
        <p className="mb-6 max-w-3xl text-sm leading-relaxed text-white/60">
          Ne pose pas des outils pour collectionner des graphiques. Chaque mesure doit répondre à une question: les bonnes personnes trouvent-elles le site, comprennent-elles l&apos;offre et terminent-elles l&apos;action?
        </p>
        <div className="mb-7 flex flex-wrap gap-x-7 gap-y-4">
          {MEASURE_LOGOS.map(([name, src]) => <ToolLogo key={name} name={name} src={src} />)}
        </div>
        <div className="divide-y divide-white/10 border-y border-white/10">
          <div className="grid gap-2 py-5 md:grid-cols-[14rem_1fr] md:gap-6">
            <strong className="text-sm text-[#e8d5b0]">Google Search Console</strong>
            <p className="text-sm leading-relaxed text-white/55">Montre les impressions, les clics, les requêtes, la position moyenne et les problèmes d&apos;indexation. Tu vois comment Google trouve tes pages.</p>
          </div>
          <div className="grid gap-2 py-5 md:grid-cols-[14rem_1fr] md:gap-6">
            <strong className="text-sm text-[#e8d5b0]">Plausible ou PostHog</strong>
            <p className="text-sm leading-relaxed text-white/55">Comptent les visiteurs et les événements utiles: clic sur le CTA, formulaire commencé, formulaire envoyé. PostHog peut aussi aider à observer un parcours plus complexe.</p>
          </div>
          <div className="grid gap-2 py-5 md:grid-cols-[14rem_1fr] md:gap-6">
            <strong className="text-sm text-[#e8d5b0]">PageSpeed Insights</strong>
            <p className="text-sm leading-relaxed text-white/55">Repère ce qui ralentit la page ou fait bouger le contenu. Teste surtout le mobile et corrige les causes indiquées, pas seulement la note.</p>
          </div>
        </div>
        <div className="mt-7 overflow-x-auto border-y border-[#e8d5b0]/25 py-5">
          <div className="flex min-w-[680px] items-center justify-between gap-3 font-mono text-sm text-[#e8d5b0]">
            <span>visiteurs</span><span className="text-white/55">→</span><span>CTA</span><span className="text-white/55">→</span><span>formulaire commencé</span><span className="text-white/55">→</span><span>formulaire envoyé</span><span className="text-white/55">→</span><span>client</span>
          </div>
        </div>
        <p className="mt-4 text-sm leading-relaxed text-white/50">
          Ce tunnel simple montre l&apos;endroit où les personnes s&apos;arrêtent. Un chiffre seul ne dit pas pourquoi. Complète-le avec des messages clients, quelques tests utilisateurs et les questions entendues en vente.
        </p>
      </SectionReveal>

      <SectionReveal>
        <ChapterTitle marker="9">Vérifier, puis passer au Bloc 10</ChapterTitle>
        <p className="mb-6 max-w-3xl text-sm leading-relaxed text-white/60">
          Ouvre le vrai site sur téléphone et ordinateur. Lis-le sans les images, navigue au clavier, envoie le formulaire avec de bonnes et de mauvaises données, vérifie les messages d&apos;erreur, puis contrôle les liens et le poids des images. La mise en ligne elle-même appartient au Bloc 10.
        </p>
        <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
          <div className="border-y border-white/10 py-5">
            <h4 className="mb-3 font-semibold text-[#f0ede8]">Avant de transmettre</h4>
            <ul className="space-y-3 text-sm leading-relaxed text-white/55">
              <li>• L&apos;offre et l&apos;action sont comprises sans explication orale.</li>
              <li>• Toutes les preuves ont une source et un droit d&apos;usage.</li>
              <li>• Le formulaire confirme le succès et explique les erreurs.</li>
              <li>• Aucun contenu ne déborde sur petit écran.</li>
              <li>• Le clavier, le focus et le mouvement réduit fonctionnent.</li>
              <li>• Les mesures correspondent au tunnel réellement utilisé.</li>
            </ul>
          </div>
          <MarkdownFilePreview filename="QA-REPORT.md">
{`# QA-REPORT.md

Version testée: [commit]
Écrans: 375, 430, 768, 1024, 1440
Navigateurs: [liste réelle]

Parcours principal: PASS / FAIL / BLOQUÉ
Formulaire: PASS / FAIL / BLOQUÉ
Clavier et focus: PASS / FAIL / BLOQUÉ
Responsive: PASS / FAIL / BLOQUÉ
Performance: PASS / FAIL / BLOQUÉ
SEO: PASS / FAIL / BLOQUÉ

Preuves: [captures, tests, URLs]
Défauts ouverts: [liste]
Décision: prêt ou à corriger`}
          </MarkdownFilePreview>
        </div>
      </SectionReveal>
    </div>
  );
}
