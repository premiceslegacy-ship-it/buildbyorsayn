import assert from 'node:assert/strict';
import test from 'node:test';
import { createHash } from 'node:crypto';
import { GET as metadata } from '../app/api/skills/metadata/route';
import { SKILLS_CATALOG, SKILLS_CATALOG_V2, SKILLS_CATALOG_V3 } from '../lib/skillsCatalog';
import { createSkillsPublicationManifest, parseSkillsPublicationManifest } from '../lib/skillsMetadata';
import { SKILLS_CATALOG_VERSION, SKILLS_MANIFEST_PATH } from '../lib/skills/publication';
import { getStoredSkillContent } from '../lib/skills/storage';

const v2Names = SKILLS_CATALOG_V2.map((skill) => skill.fileName);
const v3Names = SKILLS_CATALOG_V3.map((skill) => skill.fileName);
const v4Names = SKILLS_CATALOG.map((skill) => skill.fileName);
const id = '20261002T220000000Z-abcdef12';
const bytes = Buffer.from('synthetic archive fixture');
const make = (files: string[], catalogVersion: number) => ({
  ...createSkillsPublicationManifest(
    id,
    files.map((fileName) => ({
      fileName,
      storagePath: `releases/${id}/${fileName}`,
      sha256: createHash('sha256').update(bytes).digest('hex'),
    }))
  ),
  catalogVersion,
});

test('catalogues v2 and v3 stay frozen while v4 removes the retired motion pack', () => {
  assert.equal(SKILLS_CATALOG_VERSION, 4);
  assert.equal(SKILLS_MANIFEST_PATH, 'catalogs/v4/manifest.json');
  assert.equal(v2Names.length, 7);
  assert.equal(v3Names.length, 8);
  assert.equal(v4Names.length, 7);
  assert.ok(!v2Names.includes('product-film-factory.zip'));
  assert.ok(v3Names.includes('product-film-factory.zip'));
  assert.ok(v3Names.includes('code-motion-production.zip'));
  assert.ok(v4Names.includes('product-film-factory.zip'));
  assert.ok(!v4Names.includes('code-motion-production.zip'));
  assert.ok(parseSkillsPublicationManifest(make(v2Names, 2), v2Names));
  assert.equal(parseSkillsPublicationManifest(make(v3Names, 3), v2Names), null);
  assert.equal(parseSkillsPublicationManifest(make(v3Names, 3), v4Names), null);
  assert.equal(parseSkillsPublicationManifest(make(v4Names, 4), v3Names), null);
});

test('current storage and metadata read only the v4 pointer and reject the wrong version or set', async () => {
  const saved = {
    fetch: globalThis.fetch,
    url: process.env.NEXT_PUBLIC_SUPABASE_URL,
    key: process.env.SUPABASE_SERVICE_ROLE_KEY,
  };
  process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://example.supabase.co';
  process.env.SUPABASE_SERVICE_ROLE_KEY = 'synthetic-test-key';
  const publishedManifest = make(v4Names, 4);
  let manifest: unknown = publishedManifest;
  const requests: string[] = [];
  globalThis.fetch = async (input) => {
    const url = String(input);
    requests.push(url);
    if (url.endsWith('/catalogs/v4/manifest.json')) {
      return new Response(JSON.stringify(manifest));
    }
    if (url.includes('/releases/')) return new Response(bytes);
    return new Response('not found', { status: 404 });
  };
  try {
    const productFilm = SKILLS_CATALOG.find((skill) => skill.slug === 'product-film-factory');
    assert.ok(productFilm);
    assert.ok(await getStoredSkillContent(productFilm));
    const metadataResponse = await metadata();
    assert.equal(metadataResponse.status, 200);
    assert.deepEqual(await metadataResponse.json(), {
      publishedAt: publishedManifest.publishedAt,
      releaseId: id,
      artifacts: publishedManifest.artifacts.map(({ fileName, sha256 }) => ({ fileName, sha256 })),
    });
    for (const invalid of [
      createSkillsPublicationManifest(id, []),
      make(v4Names, 3),
      make(v3Names, 4),
    ]) {
      manifest = invalid;
      assert.equal(await getStoredSkillContent(productFilm), null);
      assert.equal((await metadata()).status, 502);
    }
    assert.ok(requests.some((url) => url.endsWith('/catalogs/v4/manifest.json')));
    assert.ok(requests.every((url) => !url.endsWith('/catalogs/v3/manifest.json')));
    assert.ok(requests.every((url) => !url.endsWith('/catalogs/v2/manifest.json')));
    assert.ok(requests.every((url) => !url.endsWith('/skills/manifest.json')));
  } finally {
    globalThis.fetch = saved.fetch;
    if (saved.url === undefined) delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    else process.env.NEXT_PUBLIC_SUPABASE_URL = saved.url;
    if (saved.key === undefined) delete process.env.SUPABASE_SERVICE_ROLE_KEY;
    else process.env.SUPABASE_SERVICE_ROLE_KEY = saved.key;
  }
});
