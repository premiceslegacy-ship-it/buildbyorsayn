import type { SkillAccess, SkillCatalogItem } from "@/lib/skillsCatalog";

const SKILL_ACCESS_LABEL: Record<SkillAccess, string> = {
  free: "gratuit",
  beginner: "Fondations",
  full: "LE COFFRE",
};

const SKILL_CATALOG_SEARCH_DETAILS: Readonly<Record<string, string>> = {
  "backend-orsayn":
    "Il couvre aussi les tâches planifiées et les webhooks, notamment leur signature et leur résistance aux doublons.",
};

export function skillCatalogSearchDetail(skill: SkillCatalogItem): string | undefined {
  return SKILL_CATALOG_SEARCH_DETAILS[skill.slug];
}

export function skillCatalogKnowledgeContent(skill: SkillCatalogItem): string {
  return [
    skill.description,
    skillCatalogSearchDetail(skill),
    `Palier d'accès : ${SKILL_ACCESS_LABEL[skill.access]}.`,
    skill.fileName.endsWith(".md")
      ? "Livraison : texte lisible avec get_skill."
      : "Livraison : archive installée avec BUILD Sync.",
  ].filter(Boolean).join("\n\n");
}
