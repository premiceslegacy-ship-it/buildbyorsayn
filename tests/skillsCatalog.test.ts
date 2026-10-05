import assert from 'node:assert/strict';
import test from 'node:test';
import { SKILLS_CATALOG, getSkillBySlug } from '../lib/skillsCatalog';

test('Product Film Factory opens the current catalogue and identities stay unique', () => {
  assert.equal(getSkillBySlug('code-motion-production'), undefined);

  const productFilm = getSkillBySlug('product-film-factory');
  assert.ok(productFilm, 'product film factory pack must exist');
  assert.equal(productFilm.access, 'beginner');
  assert.equal(productFilm.fileName, 'product-film-factory.zip');
  assert.equal(productFilm.category, 'motion');
  assert.match(productFilm.description, /motion design/i);
  assert.equal(SKILLS_CATALOG.at(0), productFilm);

  assert.equal(SKILLS_CATALOG.length, 7);
  assert.equal(new Set(SKILLS_CATALOG.map(s => s.slug)).size, 7);
  assert.equal(new Set(SKILLS_CATALOG.map(s => s.fileName)).size, 7);

  const siteWeb = getSkillBySlug('oracle-site-web');
  assert.ok(siteWeb, 'ORACLE Site Web pack must exist');
  assert.equal(siteWeb.title, 'ORACLE Site Web + Pack Copy & LP');
  assert.equal(siteWeb.fileName, 'oracle-site-web.md');
  assert.equal(siteWeb.access, 'beginner');
});
