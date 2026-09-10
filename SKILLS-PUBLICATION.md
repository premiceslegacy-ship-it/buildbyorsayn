# Skills catalogue v2: phased publication and rollback

Preparation only. Do not upload, deploy, change mirrors or accept watcher state until the parent has reviewed the app patch and frozen the canonical bundles.

## Compatibility contract

- Old app (six artifacts) keeps reading `manifest.json`, schema version 2, exact legacy set.
- New app (seven artifacts) exclusively reads `catalogs/v2/manifest.json`, schema version 2 plus required `catalogVersion: 2`, exact current set. Metadata and HTTP/MCP Storage use the same contract.
- The new publisher NEVER writes/deletes legacy `manifest.json` or its referenced releases. Shared artifacts are repackaged into a fresh immutable release; legacy bytes stay available.
- No lenient parser, cross-catalogue fallback or production filesystem fallback. Future set/type changes require another catalogue identity/path, not silently reusing v2.

## Phases (commands NOT executed during preparation)

Prerequisite before any sync: complete the additive non-expiring SQL lock migration, real PostgreSQL proof, journal/access checks and quiescence gates in `SKILLS-LOCK-RECOVERY.md`. Never reclaim an old lock by age; abandoned-lock release requires proof that old publishers and their in-flight writes cannot resume.

1. Review app diff and access decision (motion is BEGINNER). Freeze all canonical files; validate full bundles and mirror them through the existing quality-gate protocol. All seven artifacts must exist under the publishing repo's ignored docs directory. Recheck hashes immediately before sync. Do not use the isolated code-only worktree as a publishing mirror implicitly.
2. Independently download and retain legacy `manifest.json` and referenced artifact hashes as rollback evidence, using authorized SDK access without printing credentials. Confirm legacy exact six-file set. Retain the previous v2 pointer too if present. No deletes.
3. From the reviewed code checkout with validated mirrors and authorized environment:

   ```bash
   npm test
   npm run lint
   npm run build
   npm run skills:sync
   ```

   The sync command is a WRITE, not a dry run. Existing private-bucket enforcement, global publication lock and immutable artifact upload/readback remain. After all artifact readbacks it validates the new manifest locally, upserts only `catalogs/v2/manifest.json`, validates remote version/set and compares exact bytes. A failed pre-pointer artifact upload leaves both serving pointers unchanged. A failure after pointer write/readback can mean publication completed but remains unverified; do not deploy on that signal.
4. Independent SDK readback: parse v2 via `parseCurrentSkillsPublicationManifest`, read every `artifact.storagePath`, check SHA-256, compare ZIP members to frozen canonical/BUILD/Hermes manifests. Re-read legacy pointer and verify exact equality with phase 2. Recheck source stability. Abort promotion on any discrepancy.
5. Only now deploy reviewed new app. Old instances still read legacy while new instances read verified v2, so rolling deployment does not require a six-to-seven incompatible pointer swap. Test deployed metadata, UI and MCP discovery by tier, authorized ZIP contents/headers and 401/403/404. No local test is live evidence.
6. Parent coordinates final mirror/remote equality and watcher acceptance only after all workers' affected bundles are verified.

## Rollback

Before new app deploy: leave old app and legacy pointer alone; an unused v2 release is harmless. Never clean old releases during the transition.

After new app deploy: roll back app to the verified legacy deployment; its unchanged `manifest.json` still names the original six artifacts. The motion pack disappears from the old catalogue by design. Keep both manifests/releases for investigation. For same-v2 content rollback, under the same publication lock restore the separately retained, strictly validated v2 pointer and verify exact readback plus all referenced artifact hashes; never point v2 to the legacy six-file manifest.

## Evidence limits

This patch prepares app code, contract tests and a publisher, not production availability. Canonical bundle content/title-description final review, mirrors, Storage permissions/live manifest, deployed app/UI/MCP checks and watcher acceptance belong to the coordinated release owner. Download source-contract tests are not executed authenticated HTTP-route tests; that additional gate remains required before publication.
