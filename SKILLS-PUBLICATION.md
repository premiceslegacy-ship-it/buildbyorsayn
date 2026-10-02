# Skills catalogue v3: Product Film Factory and rollback-safe publication

Preparation only. Do not upload, deploy, change mirrors or accept watcher state until the parent has reviewed the app patch and frozen the canonical bundles.

## Compatibility contract

- Legacy app keeps reading `manifest.json`, schema version 2 and its exact legacy six-file set.
- Deployed v2 app keeps reading `catalogs/v2/manifest.json`, schema version 2, `catalogVersion: 2` and its exact seven-file set.
- New app exclusively reads `catalogs/v3/manifest.json`, schema version 2, `catalogVersion: 3` and the exact eight-file set, including `product-film-factory.zip`. Metadata and HTTP/MCP Storage use the same v3 contract.
- The v3 publisher NEVER writes or deletes `manifest.json`, `catalogs/v2/manifest.json` or any release referenced by either pointer. Shared artifacts are repackaged into a fresh immutable release.
- No lenient parser, cross-catalogue fallback or production filesystem fallback. Future set or file-type changes require a new catalogue identity and pointer path.

## Phases

Prerequisite before any sync: complete the additive non-expiring SQL lock migration, real PostgreSQL proof, journal/access checks and quiescence gates in `SKILLS-LOCK-RECOVERY.md`. Never reclaim an old lock by age; abandoned-lock release requires proof that old publishers and their in-flight writes cannot resume.

1. Review the app diff and access decision. Freeze all eight canonical files, including the generic Product Film Factory starter. Validate full bundles and mirror them through the existing quality-gate protocol. All eight artifacts must exist under the publishing repo's ignored docs directory. Recheck hashes immediately before sync. Do not use the isolated code-only worktree as a publishing mirror implicitly.
2. Independently download and retain `manifest.json`, `catalogs/v2/manifest.json` and every referenced artifact hash as rollback evidence, using authorized SDK access without printing credentials. Confirm the legacy six-file set and the v2 seven-file set. No deletes.
3. From the reviewed code checkout with validated mirrors and authorized environment:

   ```bash
   npm test
   npm run lint
   npm run typecheck
   npm run build
   npm run skills:sync
   ```

   The sync command is a WRITE, not a dry run. Existing private-bucket enforcement, global publication lock and immutable artifact upload/readback remain. After all artifact readbacks it validates the v3 manifest locally, upserts only `catalogs/v3/manifest.json`, validates the remote version/set and compares exact bytes. A failed pre-pointer artifact upload leaves all serving pointers unchanged. A failure after pointer write/readback can mean publication completed but remains unverified; do not deploy on that signal.
4. Independently read v3 through the SDK: parse it using `parseCurrentSkillsPublicationManifest`, read every `artifact.storagePath`, check SHA-256 and compare ZIP members to frozen canonical/BUILD/Hermes manifests. Re-read legacy and v2 pointers, then verify byte equality with phase 2. Recheck source stability. Abort promotion on any discrepancy.
5. Only now deploy the reviewed v3 app. Legacy instances continue reading legacy, v2 instances continue reading verified v2 and v3 instances read verified v3. Test deployed metadata, UI and MCP discovery by tier, authorized ZIP contents/headers and 401/403/404. No local test is live evidence.
6. Parent coordinates final mirror/remote equality and watcher acceptance only after all bundles and live readers are verified.

## Rollback

Before v3 app deployment, a verified v3 release is unused and harmless. Leave legacy and v2 pointers untouched. Never clean historical releases during the transition.

After v3 app deployment, roll back the app to the verified v2 deployment. Its unchanged `catalogs/v2/manifest.json` still names the original seven artifacts. Product Film Factory disappears from that older catalogue by design. Keep all pointers and releases for investigation.

For a same-v3 content rollback, restore the separately retained and strictly validated v3 pointer under the same publication lock. Verify exact pointer readback and every referenced artifact hash. Never point v3 to a v2 or legacy manifest.

## Evidence limits

This patch prepares an app contract, documentation, tests and publisher behaviour. It does not prove production availability. Canonical bundle title and description review, mirrors, Storage permissions, live manifest, deployed app/UI/MCP checks and watcher acceptance remain coordinated release gates.
