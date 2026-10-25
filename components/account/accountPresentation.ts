export function accountTierLabel(tier: string | null) {
  if (tier === "full") return "LE\u00a0COFFRE";
  if (tier === "beginner") return "Fondations";
  if (tier === "preview") return "Aperçu";
  return "Gratuit";
}

export function accountIncludedItems(tier: string | null, connectorVisible = false) {
  if (tier === "full") return ["Tout le programme BUILD", "Tous les skills", ...(connectorVisible ? ["Hermes Agent et la connexion IA"] : [])];
  if (tier === "beginner") return ["Fondations", "Les skills Fondations", ...(connectorVisible ? ["La connexion IA à l’essentiel"] : [])];
  return ["Le contenu gratuit", "Ton compte BUILD"];
}

export function accountUpgradeTarget(tier: string | null) {
  if (tier === "full") return null;
  return tier === "beginner" ? "complement" : "full";
}
