# Claude Project Instructions

## BUILD Skills Sync

Canonical private source: `$ORSAYN_AI_ROOT/skills/`. The ignored `docs/` tree is only the publishing mirror; never author a skill there first.

Published catalogue v2 contains exactly seven mappings:

- `oracle-by-orsayn/SKILL.md` + `oracle-by-orsayn/references/` -> `docs/oracle-by-orsayn/SKILL.md` + `docs/oracle-by-orsayn/references/`;
- `oracle-site-web.md` -> `docs/oracle-site-web.md`;
- `ux-ui-design-2/` -> `docs/ux-ui-design/`;
- `backend-orsayn/` -> `docs/backend-orsayn/`;
- `deep-research-vertical/` -> `docs/deep-research-vertical/`;
- `apple-design-skills/` -> `docs/apple-design-skills/`;
- `code-motion-production/` -> `docs/code-motion-production/` (BEGINNER, explicitly authorized).

`expert-backend-v2.md` is retired; never mirror/publish it. Its maintained authority is `backend-orsayn/references/17-domains.md`.

Required gates: read and validate complete canonical bundles, freeze sources, back up and mirror to BUILD and discovered native Hermes paths (preserve category; no guessed orsayn path), exclude `.DS_Store`, compare every file hash. Recheck canonical stability before publication and after independent remote readback. Run `npm test`, `npm run lint`, `npm run build` for catalogue/API/app changes. No install/purge to mask iCloud errors; diagnose exact paths.

## Versioned publication: review before execution

Read `SKILLS-PUBLICATION.md`. After parent review and canonical freeze, `npm run skills:sync` uploads every catalogue artifact to immutable `releases/<releaseId>/...`, verifies exact readbacks, then publishes and reads back `catalogs/v2/manifest.json`. Strict schema version 2, catalogVersion 2 and exact seven-file set are required. It NEVER writes legacy `manifest.json`; preserve that pointer and all its releases for old apps/rollback.

Publish v2 Storage first, independently verify manifest and every artifact (ZIP members against canonical/mirrors), then deploy reviewed app code. New app Storage and metadata exclusively read v2; old app continues reading legacy. Never deploy new code before verified v2 publication. Same-catalogue content updates need no redeploy; new catalogue contracts do.

Safety: never commit `docs/`, `.env.local`, `.next/`, `tsconfig.tsbuildinfo` or credentials. Do not expose service-role keys. No upload/deploy/watcher accept during preparation. Announce availability only after deployed UI/API/MCP authorized downloads and 401/403/404 checks; local fixtures are not live evidence. Watcher acceptance requires all canonical/mirror/remote gates, coordinated across workers.
