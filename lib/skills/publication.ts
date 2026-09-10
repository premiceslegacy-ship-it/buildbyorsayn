import { SKILLS_CATALOG } from '../skillsCatalog';
import { parseSkillsPublicationManifest } from '../skillsMetadata';

// Catalogue identity is independent of manifest schema version. Never repoint
// legacy manifest.json: old applications require their exact six-artifact set.
export const SKILLS_CATALOG_VERSION = 2 as const;
export const SKILLS_MANIFEST_PATH = 'catalogs/v2/manifest.json';

export function parseCurrentSkillsPublicationManifest(value: unknown) {
  if (!value || typeof value !== 'object' ||
      (value as Record<string, unknown>).catalogVersion !== SKILLS_CATALOG_VERSION) return null;
  const manifest = parseSkillsPublicationManifest(value, SKILLS_CATALOG.map(s => s.fileName));
  return manifest ? { ...manifest, catalogVersion: SKILLS_CATALOG_VERSION } : null;
}
