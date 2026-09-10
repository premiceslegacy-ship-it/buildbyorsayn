import assert from 'node:assert/strict';
import test from 'node:test';
import { createHash } from 'node:crypto';
import { readFileSync, readdirSync } from 'node:fs';

const migrations = new URL('../supabase/migrations/', import.meta.url);
const original = '20260801095000_skill_publication_lock.sql';

test('additive lock migration removes all automatic takeover, preserves deployed SQL', () => {
  assert.equal(createHash('sha256').update(readFileSync(new URL(original, migrations))).digest('hex'),
    'bc9071daaa05fe4abf8f501f4247101556e3b0543e45d7084f56720a2b49e364');
  const definitions = readdirSync(migrations).filter(name => name.endsWith('.sql')).sort()
    .map(name => readFileSync(new URL(name, migrations), 'utf8'))
    .filter(sql => /create or replace function public\.acquire_skill_publication_lock\(/i.test(sql));
  const latest = definitions.at(-1)!;
  assert.match(latest, /on conflict \(lock_key\) do nothing/i);
  assert.doesNotMatch(latest, /do update|interval\s*'30 minutes'/i);
  assert.match(latest, /get diagnostics acquired_count = row_count/i);
  assert.match(latest, /return acquired_count = 1/i);
  assert.match(latest, /set search_path = ''/i);
  assert.match(latest, /revoke all on function public\.acquire_skill_publication_lock\(text, text\) from public, anon, authenticated/i);
  assert.match(latest, /grant execute on function public\.acquire_skill_publication_lock\(text, text\) to service_role/i);
});
