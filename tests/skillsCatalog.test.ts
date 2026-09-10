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
  assert.equal(getSkillBySlug('ux-ui-design')?.access, 'beginner');
  assert.equal(getSkillBySlug('ux-ui-design')?.fileName, 'ux-ui-design.zip');
});
