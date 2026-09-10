// Approved publishing inventories, not a filesystem wildcard. Schema/pointer stay v1.
export const DOCTRINE_INVENTORIES = {
  "socle-v1": [
  "00-parcours.md",
  "01-diagnostic-et-offre.md",
  "02-decomposition-et-agents.md",
  "03-connaissance-memoire-contexte.md",
  "04-evenements-inbox-execution.md",
  "05-autorite-outils-couts.md",
  "06-preuve-iteration-skills.md",
  "07-methode-offre-transmission.md",
  "08-fiches-atelier.md"
],
  "agentique-v1": [
  "00-parcours.md",
  "01-diagnostic-et-offre.md",
  "02-decomposition-et-agents.md",
  "03-connaissance-memoire-contexte.md",
  "04-evenements-inbox-execution.md",
  "05-autorite-outils-couts.md",
  "06-preuve-iteration-skills.md",
  "07-methode-offre-transmission.md",
  "08-fiches-atelier.md",
  "README.md",
  "entreprise-01-cerveau-federe.md",
  "entreprise-02-cartographie-poles.md",
  "entreprise-04-competences-skills-sop.md",
  "entreprise-05-outils-api-cli-mcp.md",
  "entreprise-06-workflows-interpoles.md",
  "entreprise-07-adoption-preuves-promotion.md",
  "entreprise-08-templates-et-exercices.md",
  "entreprise-formats.md"
]
} as const;

export function doctrineInventory(names: readonly string[]): readonly string[] {
  const found = Object.values(DOCTRINE_INVENTORIES).find(expected =>
    expected.length === names.length && expected.every(name => names.includes(name)) && new Set(names).size === names.length);
  if (!found) throw new Error("Unapproved doctrine inventory");
  return found;
}
