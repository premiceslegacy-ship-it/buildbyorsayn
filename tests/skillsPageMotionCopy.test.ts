import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';

test('skills teaching page describes Motion Design avec HyperFrames, V1 consistently', () => {
  const source = readFileSync(new URL('../app/skills/page.tsx', import.meta.url), 'utf8');
  const label = 'Motion Design avec HyperFrames, V1';
  assert.equal(source.split(label).length - 1, 2);
  assert.doesNotMatch(source, /Motion Design par le code/);
  assert.match(source, /séquence HyperFrames/);
});
