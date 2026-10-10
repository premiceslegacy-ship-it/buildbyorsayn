# BUILD by Orsayn

BUILD est une plateforme de formation et d'accompagnement pour construire une activité vendable avec l'IA, puis livrer un travail réutilisable sans repartir de zéro.

L'application contient le parcours Fondations, les blocs du système BUILD, le catalogue de skills, la bibliothèque Hermes Agent et le connecteur MCP soumis à des contrôles d'accès.

## Démarrer en local

Prérequis : Node.js et npm.

```bash
npm ci
cp .env.example .env.local
npm run dev
```

L'application est ensuite disponible sur `http://127.0.0.1:3000`.

Les variables d'environnement sont propres à chaque installation. Les clés Supabase, Stripe, Resend, les secrets OAuth, les secrets de rate-limit et les chemins de vault restent côté serveur et ne doivent jamais être commités.

## Commandes utiles

```bash
npm test
npm run lint
npx tsc --noEmit --pretty false
npm run build
npm audit --omit=dev --audit-level=high
```

Pour les parcours navigateur authentifiés, utiliser uniquement des comptes E2E dédiés et un fichier local ignoré par Git :

```bash
set -a
. ./.env.e2e.local
set +a
npx playwright test --reporter=line
```

Les tests E2E authentifiés attendent notamment `E2E_TEST_EMAIL`, `E2E_TEST_PASSWORD`, `E2E_BEGINNER_TEST_EMAIL` et `E2E_BEGINNER_TEST_PASSWORD`. Ne jamais utiliser un compte personnel ou administrateur dans une fixture versionnée.

## Structure principale

- `app/` : routes et pages Next.js.
- `components/` : composants d'interface et parcours interactifs.
- `lib/` : accès Supabase, catalogue, doctrine, MCP et règles métier.
- `tests/` : tests unitaires et contractuels.
- `e2e/` : parcours Playwright, fixtures locales et snapshots visuels.
- `public/` : assets publiables et logos documentés.
- `docs/` : miroir privé des skills BUILD, ignoré par Git. La source canonique reste le dossier Orsayn AI indiqué dans `AGENTS.md`.

## Accès et publication

Les pages et API réservées vérifient l'identité et le tier côté serveur. Masquer un lien dans l'interface ne constitue pas une autorisation.

La publication des skills est une opération séparée. Lire `SKILLS-PUBLICATION.md` et `AGENTS.md` avant toute synchronisation. `npm run skills:sync` ne doit être exécuté qu'après revue du diff, gel des bundles canoniques, validation des prérequis et autorisation explicite de l'opération distante.

La synchronisation locale destinée aux utilisateurs est documentée dans `BUILD-SYNC.md`. Elle utilise une portée OAuth `skills:read` distincte du MCP, vérifie les SHA-256 publiés et conserve les adaptations dans `CUSTOM.md`.

## Qualité avant livraison

Avant un commit ou une mise en ligne, rejouer les tests, le lint, TypeScript, le build, l'audit des dépendances et les E2E pertinents. Vérifier aussi le diff, les snapshots, les secrets, les routes protégées et les readbacks des systèmes externes lorsqu'une publication ou une mutation a été autorisée.
