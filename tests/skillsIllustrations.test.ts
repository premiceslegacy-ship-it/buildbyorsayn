import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import test from 'node:test';

const ILLUSTRATIONS = [
  'blocs-1',
  'blocs-2',
  'blocs-3',
  'blocs-4',
  'blocs-5',
  'blocs-6',
  'blocs-7',
  'skills-deep-research-vertical',
  'skills-oracle-by-orsayn',
  'skills-ux-ui-design',
  'skills-apple-design-skills',
  'skills-backend-orsayn',
  'skills-oracle-site-web',
] as const;

const PNG_SIGNATURE = [137, 80, 78, 71, 13, 10, 26, 10];
const PRODUCT_FILM_FACTORY_SHA256 = '3790f71e179b517d1e6c00e4c5f45677d894dbe0a497fe090b51bc7134185806';

function illustrationBytes(id: string) {
  const asset = new URL(`../public/assets/illustrations/${id}.png`, import.meta.url);
  assert.ok(existsSync(asset), `${id} illustration must exist`);
  const bytes = readFileSync(asset);
  assert.deepEqual([...bytes.subarray(0, 8)], PNG_SIGNATURE, `${id} must be a PNG`);
  return bytes;
}

test('dashboard and current Skills cards have substantive square illustrations', () => {
  for (const id of ILLUSTRATIONS) {
    const bytes = illustrationBytes(id);
    assert.ok(bytes.length > 50_000, `${id} should remain a substantive raster asset`);
    assert.equal(bytes.readUInt32BE(16), 1254, `${id} must use the BUILD card production width`);
    assert.equal(bytes.readUInt32BE(20), 1254, `${id} must use the BUILD card production height`);
  }
});

test('Product Film Factory keeps its approved illustration unchanged', () => {
  const bytes = illustrationBytes('skills-product-film-factory');
  const hash = createHash('sha256').update(bytes).digest('hex');
  assert.equal(hash, PRODUCT_FILM_FACTORY_SHA256);
});

test('the retired Motion Design with HyperFrames illustration is not shipped in BUILD', () => {
  const asset = new URL('../public/assets/illustrations/skills-code-motion-production.png', import.meta.url);
  assert.equal(existsSync(asset), false);
});
