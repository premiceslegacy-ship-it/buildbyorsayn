# Claude Project Instructions

## BUILD Skills Sync

When the user says a BUILD skill in `docs/` was updated, run:

```bash
npm run skills:sync
```

This uploads the latest private skill files to Supabase Storage so users download the newest version from the app.

For existing skill content updates:

- No Vercel redeploy is required.
- No GitHub push is required.
- Confirm upload success with `Uploaded <skill-file> to skills`.

Safety:

- Do not commit `docs/`.
- Do not reveal `.env.local` or service role keys.
- Do not commit `.next/` or `tsconfig.tsbuildinfo`.

If a brand-new skill is added, update the app catalog/code first, run `npm run lint`, sync skills, then push code changes if needed.
