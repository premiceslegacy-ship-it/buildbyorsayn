import "server-only";

import type { ReactNode } from "react";
import { FlowDiagram, StackDiagram, type FlowItem } from "./layouts";

type BlockSchema = {
  id: string;
  title: string;
  says: string;
  caption?: string;
  layout?: "flow" | "stack";
  items: readonly FlowItem[];
};

const SCHEMAS_BY_SECTION: Record<string, readonly BlockSchema[]> = {
  "b1-s0": [
    { id: "b1-0", title: "Même demande, deux façons de travailler", says: "Deux électriciens reçoivent la même demande. Le premier y passe la soirée, le second obtient un brouillon en dix minutes.", items: [{ label: "Tout à la main", sub: "toute la soirée" }, { label: "Système prêt", sub: "brouillon en dix minutes", accent: true }] },
    { id: "b1-0-b", title: "L'écart grandit chaque mois", says: "Sans système, l'avance reste presque plate. Avec un système, chaque projet ajoute un peu de capacité.", items: [{ label: "Mois 1", sub: "même départ" }, { label: "Mois 3", sub: "l'écart apparaît" }, { label: "Mois 6", sub: "le système capitalise", accent: true }] },
  ],
  "b1-s1": [
    { id: "b1-1", title: "Tu relies trois choses, l'IA suit", says: "Tu relies le métier du client, ses gestes et ses choix pour donner une direction utile à l'IA.", items: [{ label: "Son métier" }, { label: "Ses gestes" }, { label: "Ses choix" }, { label: "Direction utile", accent: true }] },
  ],
  "b1-s2": [
    { id: "b1-2", title: "Plus tu précises, plus tu parles juste", says: "Tu passes d'un marché trop large à une situation précise et observable.", layout: "stack", items: [{ label: "Les entreprises", tone: "muted" }, { label: "Restaurants de quartier" }, { label: "Tables vides du vendredi", accent: true }] },
    { id: "b1-2-b", title: "Les quatre briques de ta ligne", says: "Une ligne solide réunit une douleur répétée, un décideur, un résultat visible et une suite logique.", items: [{ label: "Douleur", sub: "elle revient" }, { label: "Décideur", sub: "il peut dire oui" }, { label: "Résultat", sub: "visible vite" }, { label: "Suite logique", accent: true }] },
  ],
  "b1-s3": [
    { id: "b1-3", title: "Une boucle qui apprend à chaque tour", says: "La demande devient un devis, puis une relance et une livraison. La trace du tour améliore le suivant.", items: [{ label: "Demande" }, { label: "Devis" }, { label: "Relance" }, { label: "Livraison", accent: true }] },
  ],
  "b1-s4b": [
    { id: "b1-4", title: "De ton offre à la vidéo", says: "Tu poses l'offre, tu dessines les scènes, tu assembles les médias, puis tu regardes tout avant de livrer.", layout: "stack", items: [{ num: "01", label: "Offre en une phrase" }, { num: "02", label: "Cinq scènes dessinées" }, { num: "03", label: "Images, voix, musique" }, { num: "04", label: "Relecture complète", accent: true }] },
  ],
  "b1-s4": [
    { id: "b1-5", title: "Les quatre trous de ta phrase", says: "Ta phrase précise le client, le progrès attendu, le geste qui bloque et ta capacité.", layout: "stack", items: [{ label: "J'aide", sub: "un type de client" }, { label: "À faire avancer", sub: "un résultat" }, { label: "En améliorant", sub: "le geste qui bloque" }, { label: "Grâce à", sub: "ta capacité", accent: true }] },
  ],
  "b2-s1": [
    { id: "b2-0", title: "Peu d'outils, bien connus", says: "Quatre outils maîtrisés valent mieux que vingt outils seulement survolés.", items: [{ label: "Vingt outils", sub: "survolés", tone: "muted" }, { label: "Quatre outils", sub: "maîtrisés", accent: true }] },
    { id: "b2-0-b", title: "Les trois questions d'entrée", says: "Un nouvel outil entre seulement s'il remplace mieux, s'intègre au reste et justifie son coût.", layout: "stack", items: [{ num: "01", label: "Il remplace mieux ?" }, { num: "02", label: "Il va avec le reste ?" }, { num: "03", label: "Son coût se justifie ?" }, { label: "Trois oui", sub: "il entre", accent: true }] },
  ],
  "b2-s2": [
    { id: "b2-1", title: "Ta stack de départ", says: "Chaque outil a un rôle. Le reste attend qu'un vrai projet le réclame.", items: [{ label: "Claude", sub: "raisonner" }, { label: "Cursor", sub: "écrire le code" }, { label: "GitHub", sub: "garder les versions" }, { label: "Notion", sub: "tenir les notes", accent: true }] },
  ],
  "b2-s3": [
    { id: "b2-2", title: "Accès plus jugement", says: "L'accès aux vraies données rejoint les règles du métier pour produire un travail utile.", items: [{ label: "Accès", sub: "les données réelles" }, { label: "Jugement", sub: "les règles métier" }, { label: "Travail utile", accent: true }] },
    { id: "b2-2-b", title: "Dans quel ordre brancher", says: "Tu choisis d'abord la connexion la plus directe, puis tu ajoutes une couche seulement si elle est nécessaire.", layout: "stack", items: [{ num: "01", label: "CLI", sub: "commande dans le terminal", accent: true }, { num: "02", label: "API", sub: "connexion directe" }, { num: "03", label: "MCP", sub: "si le projet le demande" }] },
  ],
  "b5-s1": [
    { id: "b3-0", title: "Pars de lui, pas de toi", says: "Ton idée seule peut laisser le client froid. Son problème résolu lui donne une raison d'avancer.", items: [{ label: "Ton idée", sub: "partie de toi", tone: "muted" }, { label: "Son problème", sub: "parti du terrain" }, { label: "Résultat utile", sub: "il avance", accent: true }] },
  ],
  "b5-s2": [
    { id: "b3-1", title: "Le message se trouve sur le terrain", says: "Un message technique reste sans réponse. Un message qui nomme la situation réelle ouvre une conversation.", items: [{ label: "Solution digitale", sub: "message abstrait", tone: "muted" }, { label: "Tables vides", sub: "situation concrète" }, { label: "Réponses", sub: "le terrain tranche", accent: true }] },
  ],
  "b5-s3": [
    { id: "b3-2", title: "Regarde où les personnes partent", says: "Tu mesures chaque passage pour trouver l'endroit où le flux perd le plus de personnes.", layout: "stack", items: [{ label: "Visitent", sub: "100" }, { label: "Commencent", sub: "40", accent: true }, { label: "Finissent", sub: "15" }, { label: "Achètent", sub: "5" }] },
  ],
  "b5-s4": [
    { id: "b3-3", title: "Ce qu'on accepte, ce qui bloque", says: "Un défaut cosmétique peut attendre. Une clé visible ou un paiement non vérifié bloque la sortie.", items: [{ label: "Écran imparfait", sub: "acceptable" }, { label: "Fonction plus tard", sub: "acceptable" }, { label: "Clé visible", sub: "bloquant" }, { label: "Paiement non vérifié", sub: "bloquant", accent: true }] },
  ],
  "b3-s1": [
    { id: "b4-0", title: "Le code vient en dernier", says: "Le brief, le message, la page et le style donnent une direction avant l'écriture du code.", layout: "stack", items: [{ num: "01", label: "Brief", sub: "pour qui" }, { num: "02", label: "Message", sub: "quoi dire" }, { num: "03", label: "Page", sub: "quel ordre" }, { num: "04", label: "Style", sub: "quelle allure" }, { num: "05", label: "Code", sub: "en dernier", accent: true }] },
  ],
  "b3-s2": [
    { id: "b4-1", title: "Trois choix, une direction", says: "Le message, la structure et le style convergent vers un site cohérent.", items: [{ label: "Message", sub: "quoi dire" }, { label: "Structure", sub: "quel ordre" }, { label: "Style", sub: "quelle allure" }, { label: "Direction", sub: "un ensemble cohérent", accent: true }] },
  ],
  "b3-s3": [
    { id: "b4-2", title: "D'abord le plan, ensuite la construction", says: "Le plan répond aux besoins de visibilité, de modification et de protection avant qu'une session fraîche construise.", layout: "stack", items: [{ label: "Être trouvé" }, { label: "Rester modifiable" }, { label: "Être protégé" }, { label: "Le plan", sub: "aucun fichier touché", accent: true }, { label: "La construction", sub: "session fraîche" }] },
  ],
  "b6-s1": [
    { id: "b5-0", title: "ORACLE transforme l'idée en projet cadré", says: "Une idée floue passe par une interview courte et ressort sous la forme d'un projet écrit.", layout: "stack", items: [{ label: "Idée floue", tone: "muted" }, { label: "ORACLE", sub: "trois questions à la fois", accent: true }, { label: "Projet cadré", sub: "écrit et prêt" }] },
  ],
  "b6-s2": [
    { id: "b5-1", title: "Six étapes, toujours dans cet ordre", says: "L'interview précède les documents, les spécialistes, les décisions, la construction et l'audit.", layout: "stack", items: [{ num: "01", label: "Interview" }, { num: "02", label: "Documents" }, { num: "03", label: "Spécialistes" }, { num: "04", label: "Décisions" }, { num: "05", label: "Construction" }, { num: "06", label: "Audit", sub: "un point critique arrête", accent: true }] },
  ],
  "b6-s3": [
    { id: "b5-2", title: "Un spécialiste par sujet", says: "ORACLE délègue le visible et le backend à des spécialistes, puis rassemble leurs sorties dans le produit.", items: [{ label: "ORACLE", accent: true }, { label: "ux-ui-design", sub: "ce qui se voit" }, { label: "backend-orsayn", sub: "derrière l'écran" }, { label: "Produit", sub: "sorties réunies" }] },
  ],
  "b6-s4": [
    { id: "b5-3", title: "Quatre gestes pour lancer ORACLE", says: "Tu télécharges le dossier, tu le ranges, tu vérifies qu'il est trouvé, puis tu le lances.", layout: "stack", items: [{ num: "01", label: "Télécharge" }, { num: "02", label: "Range dans skills/" }, { num: "03", label: "Vérifie la liste" }, { num: "04", label: "Lance ORACLE", accent: true }] },
  ],
  "b6-s5": [
    { id: "b5-4", title: "Marché, produit, puis page de vente", says: "La recherche éclaire le produit. Le produit donne ensuite la matière de la page qui le vend.", items: [{ label: "Marché", sub: "deep-research-vertical" }, { label: "Produit", sub: "oracle-by-orsayn" }, { label: "Page", sub: "oracle-site-web", accent: true }] },
  ],
  "b4-s1": [
    { id: "b6-0", title: "Avec un skill, l'IA suit ta méthode", says: "Un prompt vague laisse l'IA deviner. Un skill lui donne une méthode explicite.", items: [{ label: "Prompt expert", sub: "l'IA devine", tone: "muted" }, { label: "SKILL.md", sub: "l'IA suit ta méthode", accent: true }] },
  ],
  "b4-s1b": [
    { id: "b6-1", title: "Un résultat, plusieurs métiers", says: "Un site qui vend réunit des règles de textes, de design, de parcours, de preuve, de visibilité, de vitesse et de sécurité.", layout: "stack", items: [{ label: "Textes" }, { label: "Design" }, { label: "Parcours" }, { label: "Preuves" }, { label: "Visibilité" }, { label: "Vitesse" }, { label: "Sécurité", accent: true }] },
  ],
  "b4-s2": [
    { id: "b6-2", title: "Les skills s'enchaînent dans l'ordre du travail", says: "Chaque skill passe une sortie vérifiable au suivant.", items: [{ label: "Marché" }, { label: "Design" }, { label: "Textes" }, { label: "Build" }, { label: "Vente", accent: true }] },
  ],
  "b4-s3": [
    { id: "b6-3", title: "Le skill naît d'un vrai projet", says: "Tu vends, tu livres, tu notes ce qui marche, puis tu l'encodes pour le projet suivant.", items: [{ label: "Vends" }, { label: "Livre" }, { label: "Note" }, { label: "Skill", accent: true }] },
  ],
  "b7-s1": [
    { id: "b7-0", title: "Deux fois, donc une procédure", says: "Une tâche répétée devient une procédure avec son contexte, ses étapes, ses pièges et son résultat.", layout: "stack", items: [{ label: "Contexte" }, { label: "Étapes" }, { label: "Pièges" }, { label: "Résultat", accent: true }] },
  ],
  "b7-s2": [
    { id: "b7-1", title: "L'outil vient en dernier", says: "Tu observes le travail, tu trouves le vrai problème, puis seulement tu choisis l'outil.", layout: "stack", items: [{ num: "01", label: "Regarde", sub: "une heure avec lui" }, { num: "02", label: "Trouve", sub: "le vrai problème", accent: true }, { num: "03", label: "Choisis l'outil", sub: "en dernier" }] },
    { id: "b7-1-b", title: "Du message au tableur sans recopier", says: "Les demandes arrivent par plusieurs canaux. Un formulaire structuré évite au patron de tout recopier.", items: [{ label: "Téléphone" }, { label: "WhatsApp" }, { label: "Instagram" }, { label: "Formulaire", sub: "remplit le tableur", accent: true }] },
  ],
  "b7-s3": [
    { id: "b7-2", title: "Trois fois le même geste, un skill", says: "Le geste répété sur trois projets devient une méthode qui accélère le quatrième.", items: [{ label: "Projet 1", sub: "même geste" }, { label: "Projet 2", sub: "même geste" }, { label: "Projet 3", sub: "même geste" }, { label: "Un skill", sub: "règles conservées", accent: true }] },
  ],
  "b7-s4": [
    { id: "b7-3", title: "Vingt minutes par semaine", says: "Un court bilan suffit pour corriger la procédure, le skill ou le document qui a montré une faiblesse.", layout: "stack", items: [{ label: "Observe", sub: "ce qui a bloqué" }, { label: "Corrige", sub: "la source utile", accent: true }, { label: "Procédure, skill ou document", sub: "version suivante" }] },
  ],
};

function BlockSchemaFigure({ schema }: { schema: BlockSchema }) {
  const Component = schema.layout === "stack" ? StackDiagram : FlowDiagram;
  return <Component id={schema.id} title={schema.title} says={schema.says} caption={schema.caption} description={schema.says} items={schema.items} />;
}

export function blockDiagramsForSection(sectionId: string): ReactNode | undefined {
  const schemas = SCHEMAS_BY_SECTION[sectionId];
  if (!schemas?.length) return undefined;
  return <>{schemas.map((schema) => <BlockSchemaFigure key={schema.id} schema={schema} />)}</>;
}

export const BLOCK_SCHEMA_SECTION_IDS = Object.freeze(Object.keys(SCHEMAS_BY_SECTION));
