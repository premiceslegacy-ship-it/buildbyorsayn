import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';

test('download maps motion and Apple ZIPs with production denial before local fallback', () => {
 const source=readFileSync(new URL('../app/api/skills/[slug]/route.ts',import.meta.url),'utf8');
 for(const slug of ['code-motion-production','apple-design-skills']) assert.ok(source.includes(`"${slug}": "${slug}"`), `${slug} local mapping missing`);
 assert.ok(source.indexOf('process.env.NODE_ENV === "production"') < source.indexOf('const ZIP_DIR_SKILLS'));
 assert.match(source,/status: 401/); assert.match(source,/status: 403/); assert.match(source,/status: 404/);
 assert.match(source,/"Cache-Control": "private, no-store"/);
 assert.match(source,/"X-Content-Type-Options": "nosniff"/);
});
