import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';

test('skills teaching page promotes Product Film Factory without the removed motion pack', () => {
  const source = readFileSync(new URL('../app/skills/page.tsx', import.meta.url), 'utf8');
  assert.doesNotMatch(source, /Motion Design avec HyperFrames, V1/);
  assert.match(source, /Product Film Factory/);
  assert.match(source, /film produit de motion design/);
});
