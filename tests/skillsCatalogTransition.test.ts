import assert from 'node:assert/strict';
import test from 'node:test';
import { createSkillsPublicationManifest, parseSkillsPublicationManifest } from '../lib/skillsMetadata';
import { SKILLS_CATALOG } from '../lib/skillsCatalog';
import { getStoredSkillContent } from '../lib/skills/storage';
import { GET as metadata } from '../app/api/skills/metadata/route';
import { createHash } from 'node:crypto';
const names = SKILLS_CATALOG.map(s => s.fileName);
const legacy = names.filter(n => n !== 'code-motion-production.zip');
const id = '20260910T120000000Z-abcdef12';
const bytes = Buffer.from('synthetic archive fixture');
const make = (files: string[]) => createSkillsPublicationManifest(id, files.map(fileName => ({fileName, storagePath: `releases/${id}/${fileName}`, sha256: createHash('sha256').update(bytes).digest('hex')})));

test('legacy exact-set parser stays strict through catalogue transition', () => {
 assert.ok(parseSkillsPublicationManifest(make(legacy), legacy));
 assert.equal(parseSkillsPublicationManifest(make(names), legacy), null);
 assert.equal(parseSkillsPublicationManifest(make(legacy), names), null);
});

test('new Storage and metadata read only versioned pointer and reject wrong version/set', async () => {
 const saved = {fetch: globalThis.fetch, url: process.env.NEXT_PUBLIC_SUPABASE_URL, key: process.env.SUPABASE_SERVICE_ROLE_KEY};
 process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://example.supabase.co';
 process.env.SUPABASE_SERVICE_ROLE_KEY = 'synthetic-test-key';
 let manifest: unknown = {...make(names), catalogVersion: 2};
 const requests: string[] = [];
 globalThis.fetch = async (input) => {
   const url = String(input); requests.push(url);
   if (url.endsWith('/catalogs/v2/manifest.json')) return new Response(JSON.stringify(manifest));
   if (url.includes('/releases/')) return new Response(bytes);
   return new Response('not found', {status:404});
 };
 try {
   assert.ok(await getStoredSkillContent(SKILLS_CATALOG[0]), 'must read catalogue v2 pointer');
   assert.equal((await metadata()).status, 200);
   for (const invalid of [make(names), {...make(names), catalogVersion: 1}, {...make(legacy), catalogVersion: 2}]) {
     manifest = invalid;
     assert.equal(await getStoredSkillContent(SKILLS_CATALOG[0]), null);
     assert.equal((await metadata()).status, 502);
   }
   assert.ok(requests.every(url => !url.endsWith('/skills/manifest.json')));
 } finally {
   globalThis.fetch = saved.fetch;
   if (saved.url === undefined) delete process.env.NEXT_PUBLIC_SUPABASE_URL; else process.env.NEXT_PUBLIC_SUPABASE_URL = saved.url;
   if (saved.key === undefined) delete process.env.SUPABASE_SERVICE_ROLE_KEY; else process.env.SUPABASE_SERVICE_ROLE_KEY = saved.key;
 }
});
