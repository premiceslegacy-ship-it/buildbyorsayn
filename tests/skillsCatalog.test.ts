import assert from 'node:assert/strict';
import test from 'node:test';
import { SKILLS_CATALOG, getSkillBySlug } from '../lib/skillsCatalog';

test('motion packs are explicitly beginner and catalogue identities stay unique', () => {
  const motion = getSkillBySlug('code-motion-production');
  assert.ok(motion, 'code motion pack must exist');
  assert.equal(motion.access, 'beginner');
  assert.equal(motion.fileName, 'code-motion-production.zip');
  assert.equal(motion.title, 'Motion Design avec HyperFrames, V1');
  assert.match(motion.description, /HyperFrames/);

  const productFilm = getSkillBySlug('product-film-factory');
  assert.ok(productFilm, 'product film factory pack must exist');
  assert.equal(productFilm.access, 'beginner');
  assert.equal(productFilm.fileName, 'product-film-factory.zip');
  assert.equal(productFilm.category, 'motion');

  assert.equal(SKILLS_CATALOG.length, 8);
  assert.equal(new Set(SKILLS_CATALOG.map(s => s.slug)).size, 8);
  assert.equal(new Set(SKILLS_CATALOG.map(s => s.fileName)).size, 8);

  const siteWeb = getSkillBySlug('oracle-site-web');
  assert.ok(siteWeb, 'ORACLE Site Web pack must exist');
  assert.equal(siteWeb.title, 'ORACLE Site Web + Pack Copy & LP');
  assert.equal(siteWeb.fileName, 'oracle-site-web.md');
  assert.equal(siteWeb.access, 'beginner');
});
