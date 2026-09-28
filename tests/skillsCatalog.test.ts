import assert from 'node:assert/strict';
import test from 'node:test';
import { SKILLS_CATALOG, getSkillBySlug } from '../lib/skillsCatalog';

test('motion pack is explicitly beginner without changing existing UX contract', () => {
  const motion = getSkillBySlug('code-motion-production');
  assert.ok(motion, 'new motion pack must exist');
  assert.equal(motion.access, 'beginner');
  assert.equal(motion.fileName, 'code-motion-production.zip');
  assert.equal(SKILLS_CATALOG.length, 7);
  assert.equal(new Set(SKILLS_CATALOG.map(s => s.slug)).size, 7);
  assert.equal(new Set(SKILLS_CATALOG.map(s => s.fileName)).size, 7);
  const siteWeb = getSkillBySlug('oracle-site-web');
  assert.ok(siteWeb, 'ORACLE Site Web pack must exist');
  assert.equal(siteWeb.title, 'ORACLE Site Web + Pack Copy & LP');
  assert.equal(siteWeb.fileName, 'oracle-site-web.md');
  assert.equal(siteWeb.access, 'beginner');
  assert.equal(SKILLS_CATALOG.length, 7);
});
