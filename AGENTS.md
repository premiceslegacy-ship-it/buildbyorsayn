# Agent Instructions

## BUILD Skills Sync

When the user says they updated, modified, replaced, or published a BUILD skill file in `docs/`, synchronize the private skills to Supabase Storage.

Typical trigger phrases:

- "j'ai mis à jour expert-backend-v2.md"
- "sync le skill"
- "mets à jour les skills"
- "publie la dernière version"
- "les users doivent avoir la dernière version"

Run from the repo root:

```bash
npm run skills:sync
```

If the command is blocked by sandbox/network permissions, request approval and rerun the same command.

Success criteria:

- The output includes `Uploaded <skill-file> to skills`.
- Tell the user the latest version is now available from the app.
- For existing skill content updates, no GitHub push or Vercel redeploy is required.

Important rules:

- Never commit `docs/`; it contains private BUILD content and is ignored by Git.
- Never expose `.env.local` or `SUPABASE_SERVICE_ROLE_KEY`.
- Never commit `.next/` or `tsconfig.tsbuildinfo`.
- If a brand-new skill is added, update `lib/skillsCatalog.ts`, ensure the API route can serve it, run `npm run lint`, then push app-code changes if needed.
