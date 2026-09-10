# Agent Instructions

## BUILD Skills Sync

Canonical private skill source is provided by `ORSAYN_AI_ROOT`:

```text
$ORSAYN_AI_ROOT/skills/
```

The canonical published set is limited to the seven mappings below (catalogue v2). Read `SKILLS-PUBLICATION.md` before publication. The legacy top-level `expert-backend-v2.md` is retired and must never be mirrored or published. Its maintained authority is `backend-orsayn/references/17-domains.md`.

`docs/` is only the BUILD publishing mirror. Never treat it as the source of truth and never edit a skill there first.

When the user says they updated, modified, replaced, added, or published a skill in the canonical Orsayn AI folder:

1. Read and validate the changed source bundle completely.
2. Mirror it into `docs/` while preserving directory structure and excluding `.DS_Store`:
   - `oracle-by-orsayn/SKILL.md` + `oracle-by-orsayn/references/` → `docs/oracle-by-orsayn/SKILL.md` + `docs/oracle-by-orsayn/references/`
   - `oracle-site-web.md` → `docs/oracle-site-web.md`
   - `ux-ui-design-2/` → `docs/ux-ui-design/`
   - `backend-orsayn/` → `docs/backend-orsayn/`
   - `deep-research-vertical/` → `docs/deep-research-vertical/`
   - `apple-design-skills/` → `docs/apple-design-skills/`
   - `code-motion-production/` → `docs/code-motion-production/` (BEGINNER explicitly authorized)
3. Discover the existing native Hermes installation for each skill and preserve its category; do not assume all skills live under orsayn. Keep `expert-backend-v2.md` retired because its content lives in `backend-orsayn/references/17-domains.md`.
4. Compare source/mirror hashes before publishing.
5. Synchronize the private BUILD skills to Supabase Storage from the repo root:

```bash
npm run skills:sync
```

6. Only after parent review and canonical freeze, `npm run skills:sync` reads every uploaded artifact back, compares exact bytes, then publishes and verifies `catalogs/v2/manifest.json` (schema version 2, catalogVersion 2, exact seven-file set). Legacy `manifest.json` and its immutable releases MUST remain untouched for old apps and rollback. Publish and independently verify v2 before deploying new app code. The manifest timestamp must only advance after every catalog artifact passes readback. No uploads, deployments or watcher acceptance during preparation.

Typical trigger phrases:

- "j'ai mis à jour un skill dans Orsayn AI"
- "sync le skill"
- "mets à jour les skills"
- "publie la dernière version"
- "les users doivent avoir la dernière version"

If the command is blocked by sandbox/network permissions, request approval and rerun the same command.

Success criteria:

- The output includes `Uploaded releases/<releaseId>/<skill-file> to skills (readback verified)` for every catalog artifact and `catalogs/v2/manifest.json`.
- The verified manifest contains the complete expected artifact set and advances its timestamp only after all artifact readbacks pass.
- Tell the user the latest version is available only after independent remote ZIP-member/hash verification, canonical/mirror stability checks and deployed UI/API/MCP access tests. Fixtures do not prove live availability.
- For existing skill content updates, no GitHub push or Vercel redeploy is required.

Important rules:

- Never commit `docs/`; it contains private BUILD content and is ignored by Git.
- Never expose `.env.local` or `SUPABASE_SERVICE_ROLE_KEY`.
- Never commit `.next/` or `tsconfig.tsbuildinfo`.
- If a brand-new skill is added or an artifact changes between `.md` and `.zip`, update `lib/skillsCatalog.ts`, ensure the API route can serve it, run `npm test`, `npm run lint` et `npm run build`, then push app-code changes if needed.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
