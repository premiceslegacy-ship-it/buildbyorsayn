import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';

test('download maps the current product film and Apple ZIPs with production denial before local fallback', () => {
 const source=readFileSync(new URL('../app/api/skills/[slug]/route.ts',import.meta.url),'utf8');
 for(const slug of ['product-film-factory','apple-design-skills']) assert.ok(source.includes(`"${slug}": "${slug}"`), `${slug} local mapping missing`);
 assert.doesNotMatch(source, /"code-motion-production": "code-motion-production"/);
 assert.ok(source.indexOf('process.env.NODE_ENV === "production"') < source.indexOf('const ZIP_DIR_SKILLS'));
 assert.match(source,/status: 401/); assert.match(source,/status: 403/); assert.match(source,/status: 404/);
 assert.match(source,/"Cache-Control": "private, no-store"/);
 assert.match(source,/"X-Content-Type-Options": "nosniff"/);
 });

 test('skills page remembers a downloaded snapshot and offers an explicit update without overwriting local work', () => {
 const source=readFileSync(new URL('../app/skills/page.tsx',import.meta.url),'utf8');
 assert.match(source,/build-skill-downloads/);
 assert.match(source,/Mettre à jour/);
 assert.match(source,/copie locale/);
 assert.match(source,/n'écrase jamais tes adaptations/);
 });
