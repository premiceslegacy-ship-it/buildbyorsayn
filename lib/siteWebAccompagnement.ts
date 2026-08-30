export type AccompanimentTrack = "debutant" | "experimente" | "agence";

export type AccompanimentTask = {
  id: string;
  title: string;
  proof: string;
  tracks?: AccompanimentTrack[];
};

export type AccompanimentPhase = {
  id: string;
  marker: string;
  duration: string;
  title: string;
  promise: string;
  why: string;
  deliverables: string[];
  tasks: AccompanimentTask[];
  validation: string;
  trackValidation?: Partial<Record<AccompanimentTrack, string>>;
};

export const TRACKS: Array<{
  id: AccompanimentTrack;
  label: string;
  shortLabel: string;
  description: string;
  adjustment: string;
}> = [
  {
    id: "debutant",
    label: "Je pars de zéro",
    shortLabel: "Débutant",
    description:
      "Tu apprends le vocabulaire, la logique du web et les gestes de base avant de construire.",
    adjustment:
      "Les fondations sont obligatoires et validées par une petite page construite sans magie.",
  },
  {
    id: "experimente",
    label: "Je livre déjà des sites",
    shortLabel: "Expérimenté",
    description:
      "Tu compresses les bases et travailles surtout le jugement, le système et la reproductibilité.",
    adjustment:
      "Les acquis sont testés. Ce qui est maîtrisé est sauté, pas rejoué pour remplir le calendrier.",
  },
  {
    id: "agence",
    label: "Je veux faire scaler une agence",
    shortLabel: "Agence",
    description:
      "Tu transformes plusieurs années de pratique en chaîne de production transmissible et contrôlée.",
    adjustment:
      "Chaque étape identifie ce qui relève de l'expert, du process, du skill, du contrôle humain et du client.",
  },
];

export const PHASES: AccompanimentPhase[] = [
  {
    id: "diagnostic",
    marker: "Avant le départ",
    duration: "1 diagnostic de 90 min",
    title: "Partir de ton vrai niveau et de ton vrai business",
    promise:
      "On ne te fait pas suivre un programme générique. On mesure ce que tu sais déjà faire, ce qui manque et le résultat à obtenir.",
    why:
      "Un débutant, un freelance expérimenté et une agence n'ont ni les mêmes angles morts, ni les mêmes preuves à produire.",
    deliverables: [
      "Baseline de compétences",
      "Objectif commercial du site",
      "Projet fil rouge",
      "Parcours personnalisé",
    ],
    tasks: [
      { id: "web-diagnostic-01", title: "Décrire le projet, l'offre et le résultat attendu", proof: "Brief oral et fiche projet complétée" },
      { id: "web-diagnostic-02", title: "Auditer le niveau web, design, copy, code et acquisition", proof: "Matrice de compétences notée avec exemples" },
      { id: "web-diagnostic-03", title: "Choisir une preuve finale mesurable", proof: "Critères d'acceptation écrits avant le build" },
      { id: "web-diagnostic-04", title: "Tracer la voie débutant, expérimenté ou agence", proof: "Étapes obligatoires, compressées et optionnelles identifiées" },
      { id: "web-diagnostic-agency-01", title: "Cartographier les rôles, handoffs et goulots de l'équipe", proof: "Carte owner, exécutant, reviewer et validation client", tracks: ["agence"] },
    ],
    validation:
      "Le projet, la cible, l'action principale et la preuve finale tiennent sur une page compréhensible par une personne extérieure.",
    trackValidation: {
      agence: "L'agence a aussi identifié qui décide, qui produit, qui revoit, qui parle au client et où une perte de qualité peut apparaître.",
    },
  },
  {
    id: "fondations",
    marker: "Semaine 1",
    duration: "1 à 2 sessions",
    title: "Comprendre ce qu'est réellement un site",
    promise:
      "Tu comprends comment une page tient debout avant de demander à l'IA de la construire.",
    why:
      "Sans vocabulaire ni modèle mental, l'IA masque les erreurs. Tu peux obtenir une belle capture sans savoir corriger un layout, une marge ou un composant.",
    deliverables: [
      "Page de fondations",
      "Lexique personnel",
      "Premier composant responsive",
      "Carte frontend, backend et hébergement",
    ],
    tasks: [
      { id: "web-foundations-01", title: "Comprendre page, section, conteneur, grille et colonne", proof: "Schéma annoté d'une page existante", tracks: ["debutant"] },
      { id: "web-foundations-02", title: "Distinguer padding, margin, gap, width et max-width", proof: "Exercice responsive corrigé", tracks: ["debutant"] },
      { id: "web-foundations-03", title: "Comprendre composants, variantes, états et contenu", proof: "Un composant avec au moins quatre états" },
      { id: "web-foundations-04", title: "Relier navigateur, frontend, backend, API, base et domaine", proof: "Carte simple expliquée sans jargon" },
      { id: "web-foundations-05", title: "Lire et modifier une page dans les DevTools", proof: "Capture avant et après avec explication", tracks: ["debutant"] },
      { id: "web-foundations-06", title: "Passer le test de compression des acquis", proof: "Démonstration sans aide", tracks: ["experimente", "agence"] },
    ],
    validation:
      "Tu peux expliquer la structure d'une page, corriger un problème d'espacement et anticiper son comportement mobile sans demander une régénération complète.",
  },
  {
    id: "business-copy",
    marker: "Semaine 2",
    duration: "2 sessions",
    title: "Faire du site un maillon du système commercial",
    promise:
      "Le site ne promet pas de créer des clients tout seul. Il clarifie, rassure, prouve et transforme l'attention venant des bons canaux.",
    why:
      "Une belle boutique au milieu du désert reste vide. Le message, l'offre, l'ICP et le canal précèdent la structure de page.",
    deliverables: [
      "ICP et contexte d'achat",
      "Message central",
      "Carte des objections",
      "COPY-DECK versionné",
    ],
    tasks: [
      { id: "web-copy-01", title: "Relier offre, ICP, niveau de conscience et source de trafic", proof: "Matrice trafic, message, action" },
      { id: "web-copy-02", title: "Extraire les mots du marché au lieu de les inventer", proof: "Corpus VOC sourcé et daté" },
      { id: "web-copy-03", title: "Écrire la promesse, les preuves, les objections et le CTA", proof: "Copy deck complet sans texte interchangeable" },
      { id: "web-copy-04", title: "Croiser Schwartz, Ogilvy, Cialdini et les autres fondamentaux avec le réel", proof: "Choix de framework justifié, pas de citations décoratives" },
      { id: "web-copy-05", title: "Préparer une variante de message réellement testable", proof: "Hypothèse, baseline, métrique et garde-fous" },
      { id: "web-copy-agency-01", title: "Définir le contrat d'entrée et de validation du copy client", proof: "Sources requises, owner, délais, révisions et acceptation", tracks: ["agence"] },
    ],
    validation:
      "Le premier écran dit pour qui, quel écart est traité et quelle action vient ensuite. Aucun titre ne pourrait être copié chez dix concurrents.",
  },
  {
    id: "references-da",
    marker: "Semaine 3",
    duration: "2 sessions",
    title: "Construire une direction, pas collectionner des screenshots",
    promise:
      "Tu apprends à partir d'un univers, d'une émotion ou d'un mécanisme visuel, même lorsque la référence n'est pas un site web.",
    why:
      "Pinterest peut donner une lumière, une matière ou une tension. Refero montre des écrans. Mintlify montre la précision d'un système. Rare UI ouvre des pistes de composants. Chaque source a un rôle différent.",
    deliverables: [
      "Matrice de références",
      "Anti-références",
      "PATTERN-DNA",
      "DA-SYNTHESIS validée",
    ],
    tasks: [
      { id: "web-da-01", title: "Sourcer références et anti-références par rôle", proof: "Board avec Pinterest, produit, motion et composants séparés" },
      { id: "web-da-02", title: "Extraire structure, lumière, typographie, matière et tension", proof: "PATTERN-DNA avec valeurs inférées clairement étiquetées" },
      { id: "web-da-03", title: "Proposer deux directions sur le même écran réel", proof: "Comparatif équivalent, pas deux moodboards" },
      { id: "web-da-04", title: "Choisir ce qui est repris, traduit ou rejeté", proof: "Matrice observation, mécanisme, traduction, décision" },
    ],
    validation:
      "La direction retenue reste reconnaissable sans le logo, mais ne reproduit ni la composition ni les assets propriétaires d'une référence.",
  },
  {
    id: "design-system-assets",
    marker: "Semaine 4",
    duration: "2 sessions",
    title: "Passer de la direction au design system agent-ready",
    promise:
      "Un humain ou un agent peut créer une nouvelle page et ses états sans inventer les règles manquantes.",
    why:
      "Un design system n'est pas une palette. Il relie tokens, composants, contenu, images, logos, motion, responsive, accessibilité et handoff.",
    deliverables: [
      "Design system web navigable",
      "Tokens sémantiques",
      "Contrats de composants",
      "Famille d'assets",
      "Motion spec",
    ],
    tasks: [
      { id: "web-ds-01", title: "Définir primitives, rôles sémantiques et tokens composants", proof: "Source de tokens versionnée avec provenance" },
      { id: "web-ds-02", title: "Documenter anatomie, variantes, états et responsive", proof: "Composants rendus avec contenus réalistes" },
      { id: "web-ds-03", title: "Choisir Figma, SVG, HTML ou image IA selon le rôle", proof: "Registre d'assets et décision de médium" },
      { id: "web-ds-04", title: "Créer un asset statique canonique et ses dérivés", proof: "Source, prompt, modèle, dimensions, fallback et validation" },
      { id: "web-ds-05", title: "Ajouter du motion léger seulement s'il sert un état ou une idée", proof: "Déclencheur, durée, fin, interruption et reduced motion" },
      { id: "web-ds-06", title: "Passer le gate anti AI-slop", proof: "Audit argumenté, captures et corrections" },
      { id: "web-ds-agency-01", title: "Séparer les décisions senior des opérations déléguables", proof: "Matrice jugement, process, skill, contrôle et escalade", tracks: ["agence"] },
      { id: "web-ds-agency-02", title: "Créer une fixture de revue utilisable par un second designer", proof: "États, contenus adverses, viewports et verdict documentés", tracks: ["agence"] },
    ],
    validation:
      "Une seconde personne peut produire une section, une card, un état d'erreur et une déclinaison mobile cohérente sans improviser la marque.",
    trackValidation: {
      agence: "Un collaborateur peut produire, un senior peut contrôler avec une fixture commune et les désaccords disposent d'une règle d'escalade.",
    },
  },
  {
    id: "build-stack",
    marker: "Semaine 5",
    duration: "2 sessions",
    title: "Construire, versionner et garder le contrôle",
    promise:
      "Tu passes du brief au code sans transformer le vibecoding en boîte noire.",
    why:
      "GitHub, previews, variables d'environnement et rollback rendent le travail réversible. L'outil précis change, la discipline reste.",
    deliverables: [
      "Repository propre",
      "Preview partageable",
      "Composants construits",
      "Journal de décisions",
    ],
    tasks: [
      { id: "web-build-01", title: "Initialiser le repo, les branches et le contrat agent", proof: "Historique Git lisible et secrets exclus" },
      { id: "web-build-02", title: "Choisir la stack proportionnée au projet", proof: "Décision Next.js, statique, CMS ou autre justifiée" },
      { id: "web-build-03", title: "Construire par slices vérifiables", proof: "Chaque slice possède résultat, tests et capture" },
      { id: "web-build-04", title: "Déployer une Preview sur Vercel ou Cloudflare", proof: "URL testée après lecture des logs" },
      { id: "web-build-05", title: "Documenter le rollback et la reprise", proof: "Retour à une version connue démontré" },
      { id: "web-build-agency-01", title: "Formaliser la chaîne branche, review, preview et acceptation", proof: "Template de PR, reviewer obligatoire et gate client", tracks: ["agence"] },
      { id: "web-build-agency-02", title: "Mesurer le temps et les reprises par étape", proof: "Baseline delivery et principales causes de rework", tracks: ["agence"] },
    ],
    validation:
      "Le site peut être repris depuis le repo, lancé localement, prévisualisé et restauré sans dépendre de la conversation qui l'a généré.",
    trackValidation: {
      agence: "La chaîne peut être exécutée par l'équipe sans accès implicite au contexte du fondateur et sans fusionner une livraison non revue.",
    },
  },
  {
    id: "connected",
    marker: "Semaine 6A",
    duration: "Branche selon le projet",
    title: "Ajouter uniquement le backend que le résultat exige",
    promise:
      "Espace client, formulaire, CRM, automatisation, API ou paiement sont ajoutés avec des frontières claires.",
    why:
      "Un site connecté change de classe de risque. Auth, permissions, validation, données et opérations ne sont pas du polish frontend.",
    deliverables: [
      "Carte des données",
      "Contrats API",
      "Matrice de permissions",
      "Plan de sauvegarde",
    ],
    tasks: [
      { id: "web-connected-01", title: "Décider si une base de données est réellement nécessaire", proof: "Alternative sans BDD comparée au besoin" },
      { id: "web-connected-02", title: "Choisir Supabase, Neon ou VPS selon le rôle", proof: "Décision coût, auth, portabilité et opérations" },
      { id: "web-connected-03", title: "Centraliser accès data, API et secrets côté serveur", proof: "Audit de frontières et variables" },
      { id: "web-connected-04", title: "Tester auth, permissions, validation et échecs", proof: "Cas autorisé, refusé, invalide et doublon" },
      { id: "web-connected-05", title: "Relier CRM ou automatisation avec idempotence", proof: "Replay sans double effet" },
    ],
    validation:
      "Aucune donnée sensible ni action critique n'est accessible par simple manipulation du navigateur. Les échecs restent récupérables.",
  },
  {
    id: "seo-geo",
    marker: "Semaine 6B",
    duration: "1 à 2 sessions",
    title: "Installer un système SEO, GEO et mesure plutôt qu'une checklist",
    promise:
      "Le site devient lisible pour les moteurs, les assistants et les humains, puis son apprentissage est relié aux vraies requêtes.",
    why:
      "Le SEO et le GEO peuvent produire durablement, rarement instantanément. La Search Console permet de mesurer impressions, requêtes, pages et écarts au lieu de deviner.",
    deliverables: [
      "Carte intentions et pages",
      "Schema.org",
      "Search Console configurée",
      "Brief d'agent SEO borné",
    ],
    tasks: [
      { id: "web-seo-01", title: "Cartographier intentions, pages, preuves et maillage", proof: "SEO-GEO-MAP reliée aux offres" },
      { id: "web-seo-02", title: "Implémenter métadonnées, sitemap, robots et données structurées", proof: "Inspection technique et résultats enrichis testés" },
      { id: "web-seo-03", title: "Configurer Google Search Console et son API", proof: "Propriété vérifiée et première requête API documentée" },
      { id: "web-seo-04", title: "Définir l'agent SEO, ses sources et ses permissions", proof: "Process lire, recommander, approuver, publier, mesurer" },
      { id: "web-seo-05", title: "Préparer les surfaces GEO sans fabriquer d'autorité", proof: "Entités, réponses, sources et preuves cohérentes" },
    ],
    validation:
      "Les moteurs peuvent découvrir et interpréter les pages, les mesures sont accessibles et aucune publication agentique ne contourne la validation prévue.",
  },
  {
    id: "launch-acquisition",
    marker: "Semaines 7 et 8",
    duration: "2 à 3 sessions",
    title: "Lancer avec des canaux, des preuves et une boucle de vente honnête",
    promise:
      "Tu ne restes pas à attendre le trafic. Tu montres, contactes, observes les réponses et améliores le système.",
    why:
      "Le site rassure quand l'attention existe. Les premiers clients viennent souvent de la prospection, du contenu, du réseau et de démonstrations personnalisées.",
    deliverables: [
      "Liste de prospects propre",
      "Séquence de contact",
      "Démonstration Loom",
      "Plan de contenu",
      "Tableau d'expériences",
    ],
    tasks: [
      { id: "web-acq-01", title: "Choisir deux canaux maximum pour le premier cycle", proof: "Canaux reliés à l'ICP et à la capacité réelle" },
      { id: "web-acq-02", title: "Construire un petit outil de collecte autorisée", proof: "Source, consentement, conformité et qualité documentés" },
      { id: "web-acq-03", title: "Créer une approche appel, LinkedIn ou email non trompeuse", proof: "Message court ancré dans un problème observé" },
      { id: "web-acq-04", title: "Enregistrer une vidéo Loom personnalisée qui montre le gap", proof: "Avant, conséquence, possibilité, prochaine étape" },
      { id: "web-acq-05", title: "Publier du contenu qui montre le travail réel", proof: "Trois pièces liées à des décisions ou preuves" },
      { id: "web-acq-06", title: "Lancer un test borné", proof: "Contrôle, variante, métrique métier et règle d'arrêt" },
      { id: "web-acq-agency-01", title: "Transformer une preuve de delivery en actif commercial réutilisable", proof: "Cas, limites, consentement client et variantes par ICP", tracks: ["agence"] },
    ],
    validation:
      "Le site est relié à des canaux actifs, chaque message reste honnête sur ce qu'un site peut produire et la métrique va au-delà du clic.",
  },
  {
    id: "qa-capitalisation",
    marker: "Clôture",
    duration: "1 revue complète",
    title: "Livrer, apprendre et transformer le travail en capital",
    promise:
      "Le projet ne finit pas à la mise en ligne. Il produit une preuve, une méthode, des erreurs comprises et des actifs réutilisables.",
    why:
      "Une exécution unique est un résultat. Une exécution tracée, comparée, testée et promue avec prudence devient une capacité.",
    deliverables: [
      "Rapport de QA",
      "Dossier de passation",
      "SOPs candidates",
      "Skills candidats",
      "Plan 30, 60 et 90 jours",
    ],
    tasks: [
      { id: "web-qa-01", title: "Tester responsive, clavier, accessibilité, performance et erreurs", proof: "Rapport avec commandes, captures et verdicts" },
      { id: "web-qa-02", title: "Vérifier production, domaine, formulaires et analytics", proof: "Smoke tests post-déploiement" },
      { id: "web-qa-03", title: "Séparer observation, pattern candidat, SOP et skill", proof: "Registre de capitalisation avec niveau de preuve" },
      { id: "web-qa-04", title: "Créer les tests de non-régression utiles", proof: "Incident reproductible couvert" },
      { id: "web-qa-05", title: "Écrire le plan de suivi 30, 60 et 90 jours", proof: "Prochaines décisions, métriques et dates" },
      { id: "web-qa-agency-01", title: "Promouvoir un seul process à travers le gate de capitalisation", proof: "Trigger, owner, preuve, version, rollback et date de revue", tracks: ["agence"] },
      { id: "web-qa-agency-02", title: "Préparer l'onboarding d'un collaborateur sur le système", proof: "Exécution témoin sans aide du fondateur et écarts observés", tracks: ["agence"] },
    ],
    validation:
      "Le live est vérifié, la reprise est documentée et aucune leçon n'est promue en règle globale sans preuve suffisante.",
    trackValidation: {
      agence: "Au moins un process a été transmis, exécuté, revu et rendu réversible sans transformer une réussite isolée en standard global.",
    },
  },
];

export const OUTCOMES = [
  "Un site utile dans un système d'acquisition réel",
  "Une méthode de design par références qui ne produit pas d'AI slop",
  "Un design system précis, rendu et réutilisable",
  "Une stack comprise, versionnée et déployable",
  "Un socle SEO, GEO et Search Console mesurable",
  "Des process, SOPs et skills candidats issus du terrain",
];

export const TOOL_LAYERS = [
  { label: "Sourcer", tools: "Pinterest, Refero, Mintlify, Rare UI, sites métier" },
  { label: "Concevoir", tools: "Figma, HTML, SVG, design system versionné" },
  { label: "Produire", tools: "IDE agentique, GitHub, modèles image et vidéo adaptés" },
  { label: "Opérer", tools: "Vercel ou Cloudflare, Supabase ou Neon, API, VPS si justifié" },
  { label: "Mesurer", tools: "Search Console, analytics, CRM, retours commerciaux" },
  { label: "Capitaliser", tools: "SOPs, skills, tests, assets, décisions versionnées" },
];

export type SiteWebFollowUpProfile = {
  name: string;
  company: string;
  project: string;
  siteUrl: string;
  track: AccompanimentTrack;
};

export type SiteWebFollowUpValues = {
  baseline: string;
  day30: string;
  day60: string;
  day90: string;
  metrics: string;
  observations: string;
};

function escapeInlineMarkdown(value: string) {
  return value
    .replace(/\r/g, "")
    .trim()
    .replace(/([\\`*_[\]{}()#+.!|>~-])/g, "\\$1");
}

function safeTextBlock(value: string, fallback: string) {
  const text = value.replace(/\r/g, "").trim() || fallback;
  const longestTicks = Math.max(0, ...[...text.matchAll(/`+/g)].map((match) => match[0].length));
  const fence = "`".repeat(Math.max(3, longestTicks + 1));
  return `${fence}text\n${text}\n${fence}`;
}

function fileSlug(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function buildSiteWebFollowUpFilename(profile: SiteWebFollowUpProfile) {
  return `suivi-site-web-${fileSlug(profile.company || profile.name || "client")}.md`;
}

export function buildSiteWebFollowUpMarkdown({
  profile,
  followUp,
  completed,
  exportedAt = new Date(),
}: {
  profile: SiteWebFollowUpProfile;
  followUp: SiteWebFollowUpValues;
  completed: string[];
  exportedAt?: Date;
}) {
  const visibleTasks = PHASES.flatMap((phase) =>
    phase.tasks.filter((task) => !task.tracks || task.tracks.includes(profile.track))
  );
  const completedVisible = visibleTasks.filter((task) => completed.includes(task.id)).length;
  const progress = visibleTasks.length
    ? Math.round((completedVisible / visibleTasks.length) * 100)
    : 0;
  const track = TRACKS.find((item) => item.id === profile.track)?.shortLabel ?? profile.track;
  const date = new Intl.DateTimeFormat("fr-FR", { dateStyle: "long" }).format(exportedAt);
  const phaseSections = PHASES.map((phase) => {
    const tasks = phase.tasks.filter(
      (task) => !task.tracks || task.tracks.includes(profile.track)
    );
    const taskLines = tasks
      .map(
        (task) =>
          `${completed.includes(task.id) ? "- [x]" : "- [ ]"} ${task.title}\n  Preuve attendue : ${task.proof}`
      )
      .join("\n");
    const trackGate = phase.trackValidation?.[profile.track];
    const validation = trackGate
      ? `${phase.validation} ${trackGate}`
      : phase.validation;
    return `## ${phase.marker} : ${phase.title}\n\nValidation du palier : ${validation}\n\n${taskLines}`;
  }).join("\n\n");

  return (
    `# Suivi post-accompagnement : Site Web by AI\n\n` +
    `Client : ${escapeInlineMarkdown(profile.name)}\n\n` +
    `Entreprise : ${escapeInlineMarkdown(profile.company)}\n\n` +
    `Projet : ${escapeInlineMarkdown(profile.project)}\n\n` +
    `URL : ${escapeInlineMarkdown(profile.siteUrl) || "Non renseignée"}\n\n` +
    `Parcours : ${track}\n\n` +
    `Exporté le : ${date}\n\n` +
    `Progression : ${completedVisible}/${visibleTasks.length} preuves, soit ${progress} %\n\n` +
    `## Baseline et état de sortie\n\n${safeTextBlock(followUp.baseline, "À compléter pendant la revue de clôture.")}\n\n` +
    `## Mesures à suivre\n\n${safeTextBlock(followUp.metrics, "Aucune métrique renseignée.")}\n\n` +
    `## À 30 jours\n\n${safeTextBlock(followUp.day30, "À compléter.")}\n\n` +
    `## À 60 jours\n\n${safeTextBlock(followUp.day60, "À compléter.")}\n\n` +
    `## À 90 jours\n\n${safeTextBlock(followUp.day90, "À compléter.")}\n\n` +
    `## Observations, erreurs et patterns candidats\n\n${safeTextBlock(followUp.observations, "Aucune observation renseignée.")}\n\n` +
    `## Règle de capitalisation\n\nUne répétition déclenche la capture. Elle ne déclenche pas automatiquement une promotion. Une observation devient SOP, skill, test ou asset seulement après diagnostic, preuve adaptée au risque, versionnement et revue.\n\n` +
    phaseSections +
    "\n"
  );
}
