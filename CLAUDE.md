# Claude Project Instructions

## BUILD Skills Sync

The private skill source of truth is `$ORSAYN_AI_ROOT/skills/`. The repository `docs/` tree is an ignored publishing mirror, never the authoring source.

The published set is:

- `oracle-by-orsayn.md` to `docs/oracle-by-orsayn.md`;
- `oracle-site-web.md` to `docs/oracle-site-web.md`;
- `ux-ui-design-2/` to `docs/ux-ui-design/`;
- `backend-orsayn/` to `docs/backend-orsayn/`;
- `deep-research-vertical/` to `docs/deep-research-vertical/`.

The legacy top-level `expert-backend-v2.md` is retired and must never be mirrored or published. Its maintained authority is `backend-orsayn/references/17-domains.md`.

When the user updates a canonical skill:

1. Validate the complete source bundle.
2. Mirror it to `docs/` and to the native Hermes skill path while preserving structure and excluding `.DS_Store`.
3. Compare source and mirror hashes.
4. Run the repository quality checks.
5. Run:

```bash
npm run skills:sync
```

6. The sync command verifies every uploaded artifact by reading it back, then publishes and verifies `manifest.json`. That manifest timestamp powers the BUILD Skills page and must never advance after a partial or unverified publication.

Existing skill content updates do not require a Vercel redeploy. A brand-new catalog entry requires an explicit app catalog/API change, validation and code push.

Safety:

- Do not commit `docs/`.
- Do not reveal `.env.local`, credentials or service-role keys.
- Do not commit `.next/` or `tsconfig.tsbuildinfo`.
- Do not report success until source, Hermes mirror, BUILD mirror and remote artifact agree.
