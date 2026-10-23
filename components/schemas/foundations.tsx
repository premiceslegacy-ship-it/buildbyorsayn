import "server-only";

import { Diagram, Edge, Label, Node } from "./primitives";
import { FlowDiagram, StackDiagram } from "./layouts";

export function PromptContextDiagram() {
  const title = "La fenêtre de contexte se remplit, puis oublie";
  const says = "La fenêtre est limitée. Quand elle se remplit, les premiers éléments sortent pour laisser entrer la conversation en cours.";
  const description = "De gauche à droite : oublié ; contexte chargé, avec les fichiers de projet, les règles et les standards ; conversation en cours.";
  return <Diagram
    id="contexte"
    title={title}
    says={says}
    caption="Ce qui doit durer sort de la conversation et rejoint un fichier canonique."
    description={description}
    wideHeight={176}
    compactHeight={384}
    wide={<>
      <Label x={340} y={12} text="La fenêtre de contexte, de gauche à droite" kind="note" />
      <Node x={0} y={52} w={144} h={96} label="Oublié" tone="hollow" step={0} />
      <Node x={168} y={52} w={336} h={96} label="Contexte chargé" sub="fichiers de projet, règles, standards" accent step={1} />
      <Node x={528} y={52} w={152} h={96} label="Conversation" sub="en cours" tone="muted" step={2} />
    </>}
    compact={<>
      <Label x={136} y={12} text="La fenêtre se remplit" kind="note" />
      <Node x={0} y={48} w={272} h={88} label="Oublié" tone="hollow" align="start" step={0} />
      <Edge points={[[136, 136], [136, 168]]} step={0} />
      <Node x={0} y={168} w={272} h={96} label="Contexte chargé" sub="fichiers, règles, standards" accent align="start" step={1} />
      <Edge points={[[136, 264], [136, 296]]} step={1} />
      <Node x={0} y={296} w={272} h={88} label="Conversation en cours" tone="muted" align="start" step={2} />
    </>}
  />;
}

export function ApiFlowDiagram() {
  return <FlowDiagram
    id="api"
    title="Une API, comme un serveur au restaurant"
    says="Ton application passe une commande, le service la traite, puis la réponse revient au client qui l'a demandée."
    caption="La réponse revient au client qui a passé la commande."
    items={[
      { label: "Mon application", sub: "le client" },
      { label: "Requête API", sub: "la commande" },
      { label: "Service tiers", sub: "la cuisine" },
      { label: "Réponse JSON", sub: "le plat livré", accent: true },
    ]}
  />;
}

export function ProjectPipelineDiagram() {
  return <FlowDiagram
    id="projet-url"
    title="De l'idée à l'URL en ligne"
    says="Chaque étape a un rôle distinct. Tu gardes les secrets hors du code du début à la fin."
    caption="Les clés API ne vont jamais dans le code."
    description="Brouillon sans code ; sauvegarde sur GitHub ; ajustement dans l'éditeur avec une IA ; mise en ligne. Les clés API ne vont jamais dans le code."
    items={[
      { label: "Brouillon", sub: "premier jet visuel" },
      { label: "GitHub", sub: "code versionné" },
      { label: "Éditeur et IA", sub: "ajuster et corriger" },
      { label: "Mise en ligne", sub: "URL accessible", accent: true },
    ]}
  />;
}

export function ContextFilesDiagram() {
  return <FlowDiagram
    id="fichiers-contexte"
    title="Le dossier /docs qui cadre chaque session"
    says="Deux fichiers suffisent pour éviter qu'une nouvelle session reparte sans objectif ni critères de fin."
    caption="Les fichiers cadrent la session. La session produit le code sans réécrire seule son cadre."
    items={[
      { label: "BRIEF.md", sub: "projet et objectif" },
      { label: "PRD.md", sub: "fonctions et critères" },
      { label: "Session IA", sub: "lit le cadre", accent: true },
      { label: "Code du projet", sub: "sortie vérifiable" },
    ]}
  />;
}

export function FounderDossierDiagram() {
  return <StackDiagram
    id="dossier-fondateur"
    title="Le dossier fondateur complet"
    says="Le dossier suit l'ordre réel de construction, du cadrage jusqu'au marché, avec un index qui sert de carte."
    caption="Chaque partie dépend des décisions posées avant elle."
    items={[
      { num: "01", label: "Cadrage", sub: "brief, hypothèses, capacités", accent: true },
      { num: "02", label: "Expérience", sub: "marque, textes, design, parcours" },
      { num: "03 à 07", label: "Fonctionnement", sub: "données, sécurité, produit" },
      { num: "10 et 11", label: "Marché", sub: "distribution, plans, index" },
    ]}
  />;
}
