import { Compare, Fork, ToolMap } from "../kit";
import type { HandcraftedVisual } from "../coffre/types";

const EM = "#22d96e";

export function ManuelDossierBoiteDiagram() {
  return <ToolMap
    title="Trois maisons séparées"
    description="La méthode, le cas du jour et les outils restent rangés à part pour savoir ce qui fait foi."
    legend="Une mémoire garde une préférence, elle ne remplace jamais le CRM."
    ariaLabel="Trois espaces. Le manuel garde la méthode : la méthode de chiffrage dans Obsidian, les règles de remise dans Notion. Le dossier du jour fait foi sur le cas, mis en avant : l'état réel du devis dans HubSpot, le fil avec le client dans Gmail. La boîte à outils sert à agir : encaisser l'acompte avec Stripe, poser la visite dans Google Agenda."
    accent={EM}
    accentGroup={1}
    groups={[
      { role: "Le manuel", tools: [{ name: "Obsidian", description: "La méthode de chiffrage" }, { name: "Notion", description: "Les règles de remise" }] },
      { role: "Le dossier du jour", tools: [{ name: "HubSpot", description: "L'état réel du devis" }, { name: "Gmail", description: "Le fil avec le client" }] },
      { role: "La boîte à outils", tools: [{ name: "Stripe", description: "Encaisser l'acompte" }, { name: "Google Agenda", description: "Poser la visite" }] },
    ]}
  />;
}

export function DeuxSourcesQuiSeContredisentDiagram() {
  return <Fork
    title="Le désaccord reste visible"
    description="Exemple : le CRM et un e-mail du client donnent deux prix différents pour le même devis."
    legend="Seule la décision qui dépend du prix attend, le reste du dossier avance."
    ariaLabel="Situation, exemple : le CRM dit 4 200 euros, l'e-mail dit 3 800 euros. Faire la moyenne, refusé : un prix que personne n'a dit. Trancher seul, refusé : l'agent invente une règle. Bloquer et demander, conseillé : la bonne personne arbitre."
    accent={EM}
    situation="CRM : 4 200 €, e-mail : 3 800 €"
    outcomes={[
      { label: "Faire la moyenne", condition: "Un prix que personne n'a dit", rejected: true },
      { label: "Trancher seul", condition: "L'agent invente une règle", rejected: true },
      { label: "Bloquer, demander", condition: "La bonne personne arbitre", recommended: true },
    ]}
  />;
}

export function ContexteDansUneValiseDiagram() {
  return <Compare
    title="Une petite valise de contexte"
    description="La mission emporte l'essentiel du dossier et laisse les archives derrière elle."
    legend="Retrouver une information ne change ni sa valeur ni le droit d'agir."
    ariaLabel="Comparaison. Toutes les archives : tous les e-mails du client, les vieux devis, tout le CRM, le drive entier, aucune fin écrite. La petite valise : objectif et contraintes, décisions acceptées, faits récents datés, sources permises, état du dossier et preuve de fin."
    accent={EM}
    beforeTitle="Toutes les archives"
    afterTitle="La petite valise"
    rows={[
      { before: "Tous les e-mails du client", after: "Objectif et contraintes" },
      { before: "Les vieux devis", after: "Décisions acceptées" },
      { before: "Tout le CRM", after: "Faits récents, datés" },
      { before: "Le drive entier", after: "Sources permises" },
      { before: "Aucune fin écrite", after: "État et preuve de fin" },
    ]}
  />;
}

export const doctrine05 = [
  { name: "ManuelDossierBoite", kind: "schema", chapter: "03-connaissance-memoire-contexte.md", component: ManuelDossierBoiteDiagram },
  { name: "DeuxSourcesQuiSeContredisent", kind: "schema", chapter: "03-connaissance-memoire-contexte.md", component: DeuxSourcesQuiSeContredisentDiagram },
  { name: "ContexteDansUneValise", kind: "schema", chapter: "03-connaissance-memoire-contexte.md", component: ContexteDansUneValiseDiagram },
] as const satisfies readonly HandcraftedVisual[];
