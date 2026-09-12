import { LiquidCard } from "@/components/ui/liquid-glass-card";
import { SectionReveal } from "@/components/ui/section-reveal";
import { MarkdownFilePreview } from "@/components/ui/markdown-file-preview";

const SITE_TYPES = [
  ["Validation ou waitlist", "Vérifier qu'une promesse intéresse", "Rejoindre la liste", "Demandes et réponses réelles", "Ultra Lean"],
  ["Landing page", "Convaincre autour d'une offre", "Acheter, réserver ou essayer", "Démo, résultat ou témoignage réel", "Lean"],
  ["Site vitrine", "Expliquer une activité et rassurer", "Contacter ou prendre rendez-vous", "Réalisations, équipe, méthode", "Standard"],
  ["Portfolio", "Faire juger la qualité d'un travail", "Voir un cas puis contacter", "Cas, rôle, contraintes, résultat", "Standard"],
  ["Site de contenu", "Répondre à une demande récurrente", "Lire ou s'abonner", "Sources, auteur, date de revue", "Éditorial"],
  ["Page produit ou SaaS", "Relier une promesse à un produit", "Voir la démo, essayer ou acheter", "Produit en action, limites, tarifs", "Standard ou écosystème"],
  ["E-commerce", "Aider à choisir puis acheter", "Ajouter au panier et payer", "Photos, livraison, retours, avis vérifiés", "Connecté"],
  ["Espace membre", "Fournir un service privé", "Se connecter et accomplir une tâche", "États réels et sécurité", "Connecté"],
] as const;

const PAGE_ANATOMY = [
  ["En-tête", "Où suis-je et où puis-je aller?", "Identité, navigation courte, action prioritaire"],
  ["Premier écran", "Est-ce pour moi et pourquoi rester?", "Promesse, cible, mécanisme, CTA, première preuve"],
  ["Développement", "Comment cela répond à ma situation?", "Problème, solution, démonstration, bénéfices"],
  ["Preuves", "Pourquoi vous croire?", "Faits, cas, démo et témoignages autorisés"],
  ["Offre", "Qu'est-ce que j'obtiens?", "Contenu, conditions, limites et prochaine étape"],
  ["Objections", "Qu'est-ce qui me bloque encore?", "Réponses directes, sans cacher l'essentiel dans une FAQ"],
  ["Pied de page", "Que faire si je cherche autre chose?", "Contact, légal et navigation secondaire"],
] as const;

const STYLE_FAMILIES = [
  ["Éditorial", "Récit, titres expressifs, légendes et images dirigées", "Préserver le scan, le mobile et l'action"],
  ["Brutalisme", "Structure exposée, contrastes durs, géométrie franche", "Garder focus, ordre, contraste et cibles complets"],
  ["Skeuomorphism", "Indices d'un objet physique pour rendre un contrôle évident", "Ne pas imiter une matière si elle brouille la fonction"],
  ["Glassmorphism", "Transparence, flou et profondeur par couches", "Le réserver à un panneau superposé sur un fond stable"],
  ["Liquid Glass", "Matériau translucide réactif à la couche ou au mouvement", "Prévoir contraste variable, coût et reduced motion"],
  ["Dither, ASCII ou terminal", "Trame et raster réduit comme signature", "Ne jamais remplacer le contenu accessible ni dégrader un logo"],
] as const;

const SKILLS = [
  ["deep-research-vertical", "Niche et hypothèses", "Marché sourcé, concurrents, voix client, angles observés", "Ne choisit pas seul la direction artistique"],
  ["oracle-site-web", "Recherche, offre, objectifs et contraintes", "Classification, sitemap, page blueprint, copy, SEO, performance", "N'invente ni recherche ni identité visuelle"],
  ["ux-ui-design", "Brief, copy, références et marque", "Thèse visuelle, tokens, composants, assets et responsive", "N'impose pas une esthétique unique"],
  ["Skills Apple", "Travail utilisateur et composants envisagés", "Hiérarchie, états, clavier, accessibilité et stress tests", "N'imite pas l'apparence d'Apple"],
  ["backend-orsayn", "Flux, données, rôles et intégrations", "Validation, auth, autorisations, BDD, webhooks et sécurité", "Ne sur-ingénierie pas un site statique"],
] as const;

const WORKFLOW = [
  ["Classer", "Quel site, pour qui, quelle action?", "Fiche de classification", "Un type, un objectif, un niveau"],
  ["Chercher", "Que savons-nous vraiment?", "Dossier de recherche", "Faits, sources et hypothèses séparés"],
  ["Cadrer", "Que vend ou montre le site?", "Brief", "Promesse, objection, preuve et limites"],
  ["Organiser", "Quelles pages et quel chemin?", "Sitemap et parcours", "Une intention et une action par page"],
  ["Écrire", "Que doit comprendre la personne?", "Blueprint et copy deck", "Clarté sans image et faits non inventés"],
  ["Diriger", "Quelle perception et quels mécanismes?", "Moodboard, thèse et tokens", "Décisions validées ou marquées comme hypothèses"],
  ["Spécifier", "Quels composants, états et assets?", "Inventaires et contrats", "Mobile, clavier, erreurs et droits couverts"],
  ["Construire", "Quel lot borné exécuter?", "Implémentation", "Chaque lot testé avant le suivant"],
  ["Vérifier", "Qu'est-ce qui fonctionne réellement?", "Rapport de QA", "Aucun défaut critique ouvert"],
  ["Mesurer", "Où le parcours fuit-il?", "Synthèse des signaux", "Une hypothèse prioritaire"],
] as const;

const QA_GATES = [
  ["Vérité", "Sources, droits et promesses relus", "Faux avis, chiffre inventé, asset sans droit"],
  ["Compréhension", "Une personne cible explique l'offre et la prochaine action", "Hero interchangeable ou CTA concurrents"],
  ["Parcours", "Action principale testée de bout en bout", "Formulaire ou paiement non confirmé"],
  ["États", "Focus, pressé, chargement, erreur et succès exercés", "Double envoi ou erreur sans récupération"],
  ["Accessibilité", "Clavier, noms accessibles, contraste, zoom et reduced motion", "Contrôle inaccessible ou sens porté par la couleur seule"],
  ["Responsive", "375, 430, 768, 1024, 1280 et 1440 px", "Contenu masqué ou ordre mobile incohérent"],
  ["Performance", "Mesures mobile et desktop, poids des images et scripts", "Contenu principal retardé ou layout instable"],
  ["SEO et GEO", "Title, description, canonical, sitemap, robots, schema et sources", "Page utile non indexable"],
  ["Sécurité", "Entrées serveur validées, secrets hors code et protections proportionnées", "Secret exposé ou écriture non autorisée"],
  ["Identité", "Test anti-clone et audit anti-slop", "Page interchangeable ou effet sans rôle"],
] as const;

function ChapterTitle({ marker, children }: { marker: string; children: React.ReactNode }) {
  return (
    <div className="mb-5 border-b border-white/10 pb-4">
      <p className="mb-2 font-mono text-[11px] tracking-[0.18em] text-[#e8d5b0]/60">09.{marker}</p>
      <h3 className="text-xl font-semibold tracking-tight text-[#f0ede8] md:text-2xl">{children}</h3>
    </div>
  );
}

function DecisionTable({
  caption,
  headers,
  rows,
}: {
  caption: string;
  headers: readonly string[];
  rows: readonly (readonly string[])[];
}) {
  return (
    <div className="overflow-x-auto border-y border-white/10">
      <table className="w-full min-w-[720px] border-collapse text-left text-sm">
        <caption className="sr-only">{caption}</caption>
        <thead>
          <tr className="border-b border-white/10 text-[#e8d5b0]">
            {headers.map((header) => (
              <th key={header} scope="col" className="px-3 py-3 font-medium first:pl-0">{header}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-white/[0.07]">
          {rows.map((row) => (
            <tr key={row[0]} className="align-top">
              {row.map((cell, index) => (
                <td key={`${row[0]}-${index}`} className={`px-3 py-3 leading-relaxed text-white/55 first:pl-0 ${index === 0 ? "font-medium text-[#f0ede8]" : ""}`}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Checkpoint({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-6 border-l-2 border-[#e8d5b0]/55 bg-[#e8d5b0]/[0.04] px-5 py-4">
      <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#e8d5b0]/70">Décision terminée quand</p>
      <p className="text-sm leading-relaxed text-white/65">{children}</p>
    </div>
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
          Un site n&apos;est pas une affiche. C&apos;est un bâtiment dans lequel une personne entre avec une question, cherche des repères, vérifie qu&apos;elle peut faire confiance, puis choisit une porte. L&apos;IA peut monter les murs vite. Elle ne choisit ni le terrain, ni le plan, ni la bonne porte à ta place.
        </p>
      </header>

      <SectionReveal className="mb-16">
        <LiquidCard variant="elevated" className="p-6 md:p-8">
          <h3 className="mb-3 text-lg font-semibold text-[#f0ede8]">Ce que tu vas construire</h3>
          <p className="mb-6 max-w-3xl text-sm leading-relaxed text-white/60">
            Pas un prompt magique, mais un dossier qu&apos;une autre personne ou un agent peut suivre sans inventer le contexte. Tu vas choisir, organiser, convaincre, diriger, systématiser, déléguer, vérifier puis améliorer.
          </p>
          <div className="grid gap-px bg-white/10 md:grid-cols-3">
            {[
              ["Comprendre", "Le type de site, son visiteur et son action utile."],
              ["Produire", "Une arborescence, un plan de page, une copy, une direction et des contrats."],
              ["Vérifier", "Le rendu réel, les états, les preuves et les mesures."],
            ].map(([title, detail]) => (
              <div key={title} className="bg-[#161618] p-4">
                <p className="mb-1 text-sm font-semibold text-[#e8d5b0]">{title}</p>
                <p className="text-xs leading-relaxed text-white/50">{detail}</p>
              </div>
            ))}
          </div>
        </LiquidCard>
      </SectionReveal>

      <SectionReveal className="mb-16">
        <ChapterTitle marker="1">Choisir le bon type de site</ChapterTitle>
        <p className="mb-6 max-w-3xl text-sm leading-relaxed text-white/60">
          Le type vient du travail du visiteur et de l&apos;action finale, jamais d&apos;un style. Termine cette phrase: « Cette personne arrive ici pour..., et la prochaine étape utile est... ». Trois objectifs concurrents signalent un cadrage incomplet.
        </p>
        <DecisionTable
          caption="Types de sites selon le travail du visiteur"
          headers={["Type", "Travail principal", "Action dominante", "Preuve", "Complexité"]}
          rows={SITE_TYPES}
        />
        <Checkpoint>Tu peux nommer un seul type principal, une audience, une action et le niveau de complexité sans parler de couleur ou d&apos;animation.</Checkpoint>
      </SectionReveal>

      <SectionReveal className="mb-16">
        <ChapterTitle marker="2">Anatomie et arborescence</ChapterTitle>
        <p className="mb-6 max-w-3xl text-sm leading-relaxed text-white/60">
          La page est une pièce. L&apos;arborescence est le plan du bâtiment. Chaque zone répond à une question, mais aucune n&apos;est obligatoire par tradition. Une page contact n&apos;a pas besoin de la même démonstration qu&apos;une landing froide.
        </p>
        <DecisionTable caption="Anatomie fonctionnelle d'une page" headers={["Zone", "Question du visiteur", "Rôle"]} rows={PAGE_ANATOMY} />
        <div className="mt-8 grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <h4 className="mb-3 font-semibold text-[#f0ede8]">Règles d&apos;arborescence</h4>
            <ol className="space-y-2 text-sm leading-relaxed text-white/55">
              <li>1. Une page importante reste accessible en trois clics maximum.</li>
              <li>2. Les libellés reprennent les mots du visiteur.</li>
              <li>3. Une intention principale correspond à une page.</li>
              <li>4. Les URLs restent courtes, lisibles et stables.</li>
              <li>5. Contact, mentions, confidentialité et 404 existent.</li>
            </ol>
          </div>
          <MarkdownFilePreview filename="SITEMAP.md">
{`# SITEMAP.md

## /
Intention: orienter vers le bon service
Action: voir un service
Preuve: réalisations sélectionnées

- /services
  - /audit-site-web
  - /creation-site-vitrine
- /realisations
  - /realisations/[cas]
- /journal
- /a-propos
- /contact
- /mentions-legales
- /politique-confidentialite`}
          </MarkdownFilePreview>
        </div>
        <div className="mt-6">
          <MarkdownFilePreview filename="PAGE-BLUEPRINT.md">
{`# PAGE-BLUEPRINT.md

Page: /creation-site-vitrine
Audience: [à valider]
Intention: comprendre l'offre et décider si un échange est utile
Action principale: demander un échange
Preuves disponibles: [faits vérifiés seulement]
Sections: promesse, mécanisme, démonstration, offre, objections
Liens entrants: /, /services
Liens sortants: /realisations, /contact`}
          </MarkdownFilePreview>
        </div>
      </SectionReveal>

      <SectionReveal className="mb-16">
        <ChapterTitle marker="3">Faire avancer sans manipuler</ChapterTitle>
        <p className="mb-5 max-w-3xl text-sm leading-relaxed text-white/60">
          La conversion consiste à retirer les doutes qui bloquent une personne déjà concernée. L&apos;ordre de départ est simple: promesse, tension réelle, mécanisme, démonstration, preuve, offre, objections, action. Adapte-le au niveau de conscience du visiteur au lieu d&apos;appliquer un framework mécaniquement.
        </p>
        <div className="mb-6 border-y border-white/10 py-5 font-mono text-sm leading-7 text-[#e8d5b0]">
          Promesse -&gt; mécanisme -&gt; démonstration -&gt; preuve -&gt; offre -&gt; objections -&gt; action
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <p className="mb-2 text-xs uppercase tracking-wider text-white/35">Formulation vague</p>
            <p className="border-t border-white/10 pt-3 text-sm text-white/50">Des solutions digitales innovantes pour votre croissance.</p>
          </div>
          <div>
            <p className="mb-2 text-xs uppercase tracking-wider text-[#e8d5b0]/70">Hypothèse plus claire</p>
            <p className="border-t border-[#e8d5b0]/25 pt-3 text-sm text-white/70">Une page centrée sur une offre, une preuve disponible et une prochaine action.</p>
          </div>
        </div>
        <p className="mt-5 text-sm leading-relaxed text-white/55">
          Le second texte reste une hypothèse tant qu&apos;aucun résultat n&apos;est mesuré. N&apos;invente jamais de témoignage, logo, compteur, délai ou garantie. Un formulaire demande seulement ce qui est nécessaire, garde des labels visibles, explique les erreurs et empêche le double envoi.
        </p>
        <div className="mt-6">
          <MarkdownFilePreview filename="COPY-DECK.md">
{`# COPY-DECK.md

Audience: [segment validé]
Niveau de conscience: [problème / solution / produit / décision]
Promesse: [hypothèse ou fait sourcé]
Mécanisme: [explication compréhensible]
Preuves autorisées: [source et droit d'usage]
Objections: [mots réels du public]
CTA: [action réellement disponible]
Réassurance: [condition factuelle uniquement]`}
          </MarkdownFilePreview>
        </div>
      </SectionReveal>

      <SectionReveal className="mb-16">
        <ChapterTitle marker="4">Du moodboard aux règles</ChapterTitle>
        <p className="mb-6 max-w-3xl text-sm leading-relaxed text-white/60">
          Une direction artistique n&apos;est pas une humeur. Donne un rôle à chaque référence: composition, typographie, matière, imagerie, interaction ou anti-référence. Note chaque observation comme exacte, mesurée, inférée ou proposée. Ensuite, écris une thèse visuelle et traduis-la en tokens sémantiques.
        </p>
        <div className="mb-7 border-y border-white/10 py-5 font-mono text-sm leading-7 text-[#e8d5b0]">
          Contexte -&gt; références -&gt; observations -&gt; thèse -&gt; tokens -&gt; composants -&gt; fixture -&gt; validation
        </div>
        <h4 className="mb-3 font-semibold text-[#f0ede8]">Familles réelles, mécanismes précis</h4>
        <DecisionTable caption="Familles stylistiques et garde-fous" headers={["Famille", "Mécanisme", "Garde-fou"]} rows={STYLE_FAMILIES} />
        <p className="mt-5 text-sm leading-relaxed text-white/55">
          Les familles peuvent cohabiter si leurs rôles ne se battent pas. Une structure éditoriale peut porter la lecture, un header en Liquid Glass signaler une couche persistante et un asset Dither signer le projet. La hiérarchie doit rester compréhensible sans ces effets.
        </p>
        <div className="mt-7">
          <MarkdownFilePreview filename="DESIGN-SYSTEM.md">
{`# DESIGN-SYSTEM.md

## Thèse visuelle
Perception visée: [à valider]
Mécanisme de composition: [règle]
Anti-références: [risque évité]

## Tokens sémantiques
- canvas: #0e0e0f (existant)
- surface-raised: #1c1c1f (existant)
- text-primary: #f0ede8 (existant)
- action-primary: #e8d5b0 (existant)
- focus-ring: [proposé, à mesurer]
- state-error: rgba(248,113,113,.80) + message textuel

## Contrats
Typographie: rôles, taille, ligne, graisse, mesure
Espace: rythme, largeur de lecture, recomposition mobile
Géométrie: rayon par rôle, bordures, séparateurs
Motion: déclencheur, fonction, durée, easing, état final, réduction
Fixture: titre long, contrôle, vide, erreur, succès`}
          </MarkdownFilePreview>
        </div>
        <Checkpoint>Chaque effet a un rôle, chaque référence une provenance et chaque valeur un statut. « Premium » seul n&apos;est pas une spécification.</Checkpoint>
      </SectionReveal>

      <SectionReveal className="mb-16">
        <ChapterTitle marker="5">Icônes, images, motion et états</ChapterTitle>
        <p className="mb-6 max-w-3xl text-sm leading-relaxed text-white/60">
          Chaque élément doit aider à comprendre, reconnaître, prouver ou agir. Une icône n&apos;est pas obligatoire devant un titre. Valide d&apos;abord trois glyphes avec une grille, une taille, une épaisseur et un poids optique communs.
        </p>
        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <h4 className="mb-3 font-semibold text-[#f0ede8]">Force de preuve des assets</h4>
            <ol className="space-y-3 border-l border-white/10 pl-5 text-sm text-white/55">
              <li><strong className="text-white/80">Produit en action</strong><br />Montre la tâche réelle.</li>
              <li><strong className="text-white/80">Résultat réel</strong><br />Nomme la source et le contexte.</li>
              <li><strong className="text-white/80">Photo métier</strong><br />Documente une situation utile.</li>
              <li><strong className="text-white/80">Illustration explicative</strong><br />Clarifie une relation invisible.</li>
              <li><strong className="text-white/80">Ambiance ou stock</strong><br />Faible preuve, usage secondaire.</li>
            </ol>
          </div>
          <div>
            <h4 className="mb-3 font-semibold text-[#f0ede8]">Contrats avant production</h4>
            <dl className="space-y-3 text-sm leading-relaxed">
              <div><dt className="text-[#e8d5b0]">Asset</dt><dd className="text-white/55">Rôle, source, droits, cadrage, format, poids, variante mobile et texte alternatif.</dd></div>
              <div><dt className="text-[#e8d5b0]">Motion</dt><dd className="text-white/55">Déclencheur, fonction, amplitude, durée, easing, fréquence, état final et reduced motion.</dd></div>
              <div><dt className="text-[#e8d5b0]">État</dt><dd className="text-white/55">Repos, focus, pressé, chargement, vide, erreur, succès, indisponible et permission selon le cas.</dd></div>
            </dl>
          </div>
        </div>
        <Checkpoint>Le contenu reste compréhensible sans image, sans couleur et sans animation. Chaque erreur explique une récupération possible.</Checkpoint>
      </SectionReveal>

      <SectionReveal className="mb-16">
        <ChapterTitle marker="6">Réutiliser sans cloner</ChapterTitle>
        <p className="mb-6 max-w-3xl text-sm leading-relaxed text-white/60">
          Réutiliser une cuisine professionnelle ne signifie pas servir le même plat. Garde le noyau éprouvé, puis requalifie le thème de marque et le contenu métier.
        </p>
        <div className="divide-y divide-white/10 border-y border-white/10">
          {[
            ["Noyau éprouvé", "Accessibilité, focus, formulaires, grilles, responsive et contrats d'états", "Plateforme et contraintes réelles"],
            ["Thème de marque", "Architecture des tokens et mécanisme de thème", "Typographie, couleurs, géométrie, matière et iconographie"],
            ["Contenu métier", "Modèles de données et gabarits de cas", "Mots, preuves, offres, images, navigation et objets métier"],
          ].map(([layer, reused, changed]) => (
            <div key={layer} className="grid gap-2 py-5 md:grid-cols-[0.6fr_1.2fr_1.2fr] md:gap-6">
              <p className="font-semibold text-[#e8d5b0]">{layer}</p>
              <p className="text-sm leading-relaxed text-white/55"><span className="text-white/35">Réutilisé: </span>{reused}</p>
              <p className="text-sm leading-relaxed text-white/55"><span className="text-white/35">Requalifié: </span>{changed}</p>
            </div>
          ))}
        </div>
        <Checkpoint>Retire le logo et l&apos;accent. Si structure, objets, mots, preuves et imagerie peuvent servir à un autre client sans changement, le site reste un template maquillé.</Checkpoint>
      </SectionReveal>

      <SectionReveal className="mb-16">
        <ChapterTitle marker="7">Des skills spécialistes, pas cinq boutons « fais tout »</ChapterTitle>
        <p className="mb-6 max-w-3xl text-sm leading-relaxed text-white/60">
          Un skill reçoit un livrable validé, produit une sortie bornée et la transmet au suivant. Si le produit a déjà été cadré avec oracle-by-orsayn, le site récupère ces documents au lieu de réinventer une identité.
        </p>
        <DecisionTable caption="Rôle exact des skills" headers={["Skill", "Entrée", "Sortie", "Limite"]} rows={SKILLS} />
        <p className="mt-5 text-sm leading-relaxed text-white/55">
          Le backend devient nécessaire avec authentification, données privées, paiement, API mutante, webhook ou automatisation critique. Un formulaire simple demande une couche proportionnée: validation serveur, anti-spam, limitation de débit, envoi et messages d&apos;état.
        </p>
      </SectionReveal>

      <SectionReveal className="mb-16">
        <ChapterTitle marker="8">Construire par artefacts validés</ChapterTitle>
        <p className="mb-6 max-w-3xl text-sm leading-relaxed text-white/60">
          Ne demande pas « crée le site ». Fournis les documents validés, demande un lot borné et exige un retour sur les critères d&apos;acceptation. Les faits, la direction, les droits, les actions sensibles et la mise en ligne restent des validations humaines.
        </p>
        <ol className="divide-y divide-white/10 border-y border-white/10">
          {WORKFLOW.map(([step, question, output, validation], index) => (
            <li key={step} className="grid gap-2 py-4 md:grid-cols-[3rem_0.7fr_1.2fr_1fr_1.2fr] md:gap-4">
              <span className="font-mono text-xs text-[#e8d5b0]/60">{String(index + 1).padStart(2, "0")}</span>
              <strong className="text-sm text-[#f0ede8]">{step}</strong>
              <span className="text-sm text-white/50">{question}</span>
              <span className="text-sm text-white/65">{output}</span>
              <span className="text-sm text-white/45">{validation}</span>
            </li>
          ))}
        </ol>
        <blockquote className="mt-7 border-l-2 border-[#e8d5b0]/55 pl-5 text-sm leading-relaxed text-white/65">
          Lis le brief, le plan de page, le copy deck et le design system. Résume l&apos;audience, l&apos;action principale, les contraintes et les interdits. N&apos;implémente que le lot demandé. Si une information manque, marque-la comme bloquante au lieu de l&apos;inventer.
        </blockquote>
      </SectionReveal>

      <SectionReveal className="mb-16">
        <ChapterTitle marker="9">Rendre le site visible et rapide</ChapterTitle>
        <p className="mb-6 max-w-3xl text-sm leading-relaxed text-white/60">
          Le SEO aide une page utile à être comprise, explorée puis proposée à la bonne recherche. La performance évite de perdre la personne avant même qu&apos;elle voie la promesse. Commence par une page sémantique avec un seul titre principal, des sous-titres ordonnés, des liens compréhensibles et un contenu qui répond réellement à une intention.
        </p>
        <div className="grid gap-8 lg:grid-cols-2">
          <div>
            <h4 className="mb-3 font-semibold text-[#f0ede8]">Le paquet minimum d&apos;une page</h4>
            <dl className="divide-y divide-white/10 border-y border-white/10 text-sm leading-relaxed">
              {[
                ["Title", "Le sujet précis de la page, différencié des autres pages."],
                ["Description", "Un résumé honnête qui donne une raison de consulter la page."],
                ["canonical", "L'URL de référence lorsque plusieurs chemins montrent un contenu équivalent."],
                ["sitemap.xml", "La liste des URLs indexables que le moteur peut découvrir."],
                ["robots.txt", "Les règles d'exploration, sans jamais l'utiliser comme protection d'un contenu privé."],
                ["Données structurées", "Seulement un schéma qui décrit fidèlement un contenu visible, par exemple Organization, Product ou Article."],
              ].map(([term, detail]) => (
                <div key={term} className="py-3">
                  <dt className="font-medium text-[#e8d5b0]">{term}</dt>
                  <dd className="mt-1 text-white/50">{detail}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div>
            <h4 className="mb-3 font-semibold text-[#f0ede8]">Le budget de performance</h4>
            <p className="mb-4 text-sm leading-relaxed text-white/55">
              Fixe les limites avant de construire: poids maximal du premier écran, nombre de polices, JavaScript initial et poids de chaque image. Une image est recadrée au bon ratio, redimensionnée pour son usage et livrée dans un format moderne. Une police est limitée aux graisses réellement employées. Un script tiers doit justifier son coût.
            </p>
            <div className="border-y border-white/10 py-4">
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#e8d5b0]/70">Core Web Vitals</p>
              <p className="text-sm leading-relaxed text-white/55">
                <strong className="text-white/75">Largest Contentful Paint</strong> mesure quand le contenu principal devient visible. <strong className="text-white/75">Interaction to Next Paint</strong> mesure la réponse aux interactions. <strong className="text-white/75">Cumulative Layout Shift</strong> mesure les déplacements inattendus de la mise en page.
              </p>
            </div>
          </div>
        </div>
        <p className="mt-6 text-sm leading-relaxed text-white/55">
          Vérifie d&apos;abord en local avec Lighthouse ou les outils du navigateur, puis mesure l&apos;URL déployée avec PageSpeed Insights et les données réelles de Search Console quand elles existent. Garde une mesure avant et après chaque changement. Un score isolé n&apos;explique pas la cause et ne remplace pas l&apos;observation d&apos;un vrai parcours.
        </p>
        <Checkpoint>Chaque page indexable a un sujet, des métadonnées uniques, une URL canonique et des liens entrants. Le premier écran respecte un budget mesuré sur mobile et desktop.</Checkpoint>
      </SectionReveal>

      <SectionReveal className="mb-16">
        <ChapterTitle marker="10">Prouver que le site tient</ChapterTitle>
        <p className="mb-6 max-w-3xl text-sm leading-relaxed text-white/60">
          Relire le code sans ouvrir le site revient à valider une maison depuis son plan. « Ça compile » prouve seulement que le projet peut être construit. La livraison exige le vrai rendu, les vraies interactions et les cas d&apos;échec.
        </p>
        <DecisionTable caption="Gates de qualité" headers={["Contrôle", "Preuve attendue", "Blocage typique"]} rows={QA_GATES} />
        <p className="mt-5 text-sm leading-relaxed text-white/55">
          Un score de laboratoire est une mesure à un instant donné. Il ne remplace ni le test humain, ni l&apos;interaction réelle, ni le suivi en production. Un verdict reste textuel: PASS, FAIL ou BLOCKED. BLOCKED n&apos;est jamais un succès.
        </p>
        <div className="mt-7">
          <MarkdownFilePreview filename="QA-REPORT.md">
{`# QA-REPORT.md

Date: [date réelle]
Version: [commit ou build]
Navigateurs: [versions testées]
Viewports: 375, 430, 768, 1024, 1280, 1440

| Gate | Preuve | Verdict | Blocage |
|---|---|---|---|
| Parcours principal | [capture ou test] | BLOCKED | [raison] |
| Clavier et focus | [observation] | FAIL | [récupération] |
| Responsive | [captures] | PASS | aucun |

Défauts critiques ouverts: [liste]
Limites non vérifiées: [liste explicite]
Décision de livraison: [go / no-go et responsable]`}
          </MarkdownFilePreview>
        </div>
      </SectionReveal>

      <SectionReveal>
        <ChapterTitle marker="11">Améliorer depuis le réel</ChapterTitle>
        <p className="mb-5 max-w-3xl text-sm leading-relaxed text-white/60">
          Une fois en ligne, le site devient observable. Les données montrent où le parcours fuit. Les appels, messages et tests utilisateurs aident à comprendre pourquoi. Avec peu de trafic, quelques conversations utiles valent mieux qu&apos;un test A/B trop faible pour conclure.
        </p>
        <div className="mb-7 border-y border-white/10 py-5 font-mono text-sm leading-7 text-[#e8d5b0]">
          Observer -&gt; localiser la friction -&gt; formuler une hypothèse -&gt; modifier une chose -&gt; vérifier -&gt; mesurer -&gt; documenter
        </div>
        <dl className="grid gap-px bg-white/10 sm:grid-cols-2">
          {[
            ["Observation", "Les personnes quittent au champ téléphone."],
            ["Hypothèse", "Le champ arrive trop tôt ou son usage est flou."],
            ["Changement", "Le retirer ou expliquer pourquoi il est demandé."],
            ["Mesure", "Comparer le taux de fin et la qualité des demandes."],
          ].map(([term, detail]) => (
            <div key={term} className="bg-[#161618] p-4">
              <dt className="mb-1 text-sm font-semibold text-[#e8d5b0]">{term}</dt>
              <dd className="text-sm leading-relaxed text-white/50">{detail}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-7 text-sm leading-relaxed text-white/65">
          La vitesse vient de l&apos;IA. La méthode évite d&apos;aller vite dans la mauvaise direction. Construis une première version honnête, vérifie-la dans le réel, puis transforme seulement les apprentissages répétés en système réutilisable.
        </p>
      </SectionReveal>
    </div>
  );
}
