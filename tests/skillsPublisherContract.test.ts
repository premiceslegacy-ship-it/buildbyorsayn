import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';

test('publisher never overwrites legacy pointer and validates readback catalogue', () => {
 const source=readFileSync(new URL('../scripts/sync-skills-to-supabase.ts',import.meta.url),'utf8');
 assert.match(source,/uploadAndVerify\(SKILLS_MANIFEST_PATH, manifestBody, true\)/);
 assert.doesNotMatch(source,/uploadAndVerify\("manifest.json"/);
 assert.match(source,/parseCurrentSkillsPublicationManifest\(JSON.parse\(remote.toString\("utf8"\)\)\)/);
 assert.match(source,/catalogVersion: SKILLS_CATALOG_VERSION/);
});
