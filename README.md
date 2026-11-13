# BUILD by Orsayn

BUILD est une plateforme de formation pour construire une activité vendable avec l'IA, puis livrer un travail réutilisable sans repartir de zéro.

L'application contient le parcours Fondations, les blocs du système BUILD, le catalogue de skills, la bibliothèque Hermes Agent et le connecteur MCP soumis à des contrôles d'accès.

## Démarrer en local

Prérequis : Node.js 24.x et npm (voir `engines` dans `package.json`).

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

### Activation après achat et récupération

Les invitations envoyées après paiement reviennent sur `/update-password` avec les jetons Supabase dans le fragment de l’URL. Cette page les efface de l’adresse puis établit la session avec `auth.setSession` avant d’autoriser l’enregistrement du mot de passe. Le client partagé reste en PKCE pour les autres parcours. La récupération par code conserve sa session lors du passage vers cette page.

Une session absente ou un lien refusé propose un nouveau code via `/forgot-password`. Les erreurs distinguent mot de passe faible ou identique, identifiants incorrects, limitation des tentatives, panne du service et problème réseau. Un échec d’envoi du code n’affiche pas de confirmation d’envoi.

Le code de récupération doit être saisi en entier : le formulaire accepte 6 à 10 chiffres, sans imposer une longueur dans les indications ; Supabase vérifie sa validité. La régression navigateur `e2e/password-recovery.spec.ts` couvre un code de huit chiffres commençant par zéro, un code refusé puis la création du mot de passe, sur desktop et mobile, avec un transport Auth isolé.

Les champs de connexion, inscription, activation et Compte disposent d’un bouton afficher/masquer, utilisable au clavier. Le mot de passe reste masqué initialement ; ce contrôle ne l’enregistre ni ne le transmet.

Régression ciblée : `node --import tsx --test tests/passwordSession.test.ts`. Elle exerce le SDK Supabase réel avec un transport fournisseur isolé, sans compte client ni envoi d’e-mail. Après publication, vérifier le nouveau déploiement et les contrôles visibles ; ne pas confondre le push GitHub avec la mise en service.


## Qualité avant livraison

Avant un commit ou une mise en ligne, rejouer les tests, le lint, TypeScript, le build, l'audit des dépendances et les E2E pertinents. Vérifier aussi le diff, les snapshots, les secrets, les routes protégées et les readbacks des systèmes externes lorsqu'une publication ou une mutation a été autorisée.

### Audit backend local du 13 novembre 2026

Les régressions ci-dessous couvrent les correctifs de sécurité exercés en local. Le rapport détaillé et les preuves d'exploitation sont conservés hors du dépôt public. Les contrôles locaux ne constituent pas une validation de production. L'auto-déploiement Vercel est désactivé uniquement pour la branche `audit/backend-local-20261113` dans `vercel.json`.

Régressions de sécurité ajoutées, sans compte réel ni fournisseur payant :

```bash
node --import tsx --test --test-concurrency=1 tests/buildSyncSecurity.test.ts tests/buildSyncAuthorization.test.ts tests/muxCleanupClaims.test.ts tests/freeResourceIsolation.test.ts
```

Ces tests utilisent le SDK Supabase et les migrations SQL avec PGlite, une dépendance de développement épinglée. Le transport HTTP est isolé ; les règles SQL sont réellement exécutées. Ce harnais ne remplace pas un readback des politiques du projet Supabase déployé ni un essai de concurrence multiconnexion PostgreSQL natif.
