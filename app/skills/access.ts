import type { SkillAccess } from "@/lib/skillsCatalog";

export type SkillTier = string | null;

export function canDownloadSkill(tier: SkillTier, access: SkillAccess) {
  return access === "free" || tier === "full" || (tier === "beginner" && access === "beginner");
}

export function accessibleSkillCount<T extends { access: SkillAccess }>(skills: readonly T[], tier: SkillTier) {
  return skills.filter((skill) => canDownloadSkill(tier, skill.access)).length;
}

export function lockedSkillCta(tier: SkillTier, access: SkillAccess) {
  if (access === "beginner" && tier !== "beginner") return "Prendre Fondations";
  return "Passer à LE\u00a0COFFRE";
}
