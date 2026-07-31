# Agent Instructions

## BUILD Skills Sync

Canonical private skill source is provided by `ORSAYN_AI_ROOT`:

```text
$ORSAYN_AI_ROOT/skills/
```

The canonical published set is limited to the five mappings below. The legacy top-level `expert-backend-v2.md` is retired and must never be mirrored or published. Its maintained authority is `backend-orsayn/references/17-domains.md`.

`docs/` is only the BUILD publishing mirror. Never treat it as the source of truth and never edit a skill there first.

When the user says they updated, modified, replaced, added, or published a skill in the canonical Orsayn AI folder:

1. Read and validate the changed source bundle completely.
2. Mirror it into `docs/` while preserving directory structure and excluding `.DS_Store`:
   - `oracle-by-orsayn.md` → `docs/oracle-by-orsayn.md`
   - `oracle-site-web.md` → `docs/oracle-site-web.md`
   - `ux-ui-design-2/` → `docs/ux-ui-design/`
   - `backend-orsayn/` → `docs/backend-orsayn/`
   - `deep-research-vertical/` → `docs/deep-research-vertical/`
3. Mirror the same source into `~/.hermes/skills/orsayn/` using native Hermes packaging. Keep `expert-backend-v2.md` retired because its content lives in `backend-orsayn/references/17-domains.md`.
4. Compare source/mirror hashes before publishing.
5. Synchronize the private BUILD skills to Supabase Storage from the repo root:

```bash
npm run skills:sync
```

6. Read every published artifact back from Supabase Storage, normalize it with the same rules as the local mirror, and compare path sets plus content hashes. Upload output alone is not proof of success.

Typical trigger phrases:

- "j'ai mis à jour un skill dans Orsayn AI"
- "sync le skill"
- "mets à jour les skills"
- "publie la dernière version"
- "les users doivent avoir la dernière version"

If the command is blocked by sandbox/network permissions, request approval and rerun the same command.

Success criteria:

- The output includes `Uploaded <skill-file> to skills`.
- Remote readback returns the complete expected path set and content hashes identical to the normalized BUILD mirrors.
- Tell the user the latest version is now available from the app only after both checks pass.
- For existing skill content updates, no GitHub push or Vercel redeploy is required.

Important rules:

- Never commit `docs/`; it contains private BUILD content and is ignored by Git.
- Never expose `.env.local` or `SUPABASE_SERVICE_ROLE_KEY`.
- Never commit `.next/` or `tsconfig.tsbuildinfo`.
- If a brand-new skill is added, update `lib/skillsCatalog.ts`, ensure the API route can serve it, run `npm run lint`, then push app-code changes if needed.
