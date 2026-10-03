import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import test from 'node:test';

test('Product Film Factory has a real ASCII illustration instead of the card fallback', () => {
  const asset = new URL('../public/assets/illustrations/skills-product-film-factory.png', import.meta.url);
  assert.ok(existsSync(asset), 'Product Film Factory illustration must exist');
  const bytes = readFileSync(asset);
  assert.ok(bytes.length > 50_000, 'illustration must be a substantive PNG asset');
  assert.deepEqual([...bytes.subarray(0, 8)], [137, 80, 78, 71, 13, 10, 26, 10]);
});
