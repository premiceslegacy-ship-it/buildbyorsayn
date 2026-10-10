# BUILD Sync

BUILD Sync maintient les skills officiels dans les dossiers personnels de Codex,
Claude Code et Hermes Agent. Le site ne reçoit aucun accès aux projets locaux.

## Parcours utilisateur

1. L'utilisateur lance l'installateur macOS/Linux/WSL ou PowerShell depuis `/skills`.
2. Le CLI détecte les agents présents et ouvre BUILD pour une autorisation PKCE.
3. L'API retourne uniquement les artefacts inclus dans le niveau du compte.
4. Le CLI vérifie le SHA-256, extrait les ZIP sans dépendance et installe chaque
   skill de manière atomique.
5. Une tâche locale vérifie les versions toutes les six heures.

Les adaptations doivent vivre dans `CUSTOM.md`. Ce fichier est injecté dans le
contrat du skill et n'est jamais remplacé. Si un autre fichier géré a été modifié,
la copie complète est sauvegardée sous `~/.build-sync/backups/` avant la mise à
jour. Les versions précédentes restent sous `~/.build-sync/rollbacks/`.

## Déploiement

1. Appliquer `supabase/migrations/20261010130000_build_sync_oauth.sql`.
2. Configurer `NEXT_PUBLIC_APP_URL`, `BUILD_SYNC_OAUTH_ISSUER` si nécessaire et
   un `BUILD_SYNC_TOKEN_RATE_LIMIT_PEPPER` aléatoire d'au moins 16 caractères.
3. Déployer l'application et vérifier que ces fichiers sont servis :
   - `/build-sync/build.mjs`
   - `/build-sync/install.sh`
   - `/build-sync/install.ps1`
4. Tester une connexion réelle, un téléchargement Beginner puis Full, un refus
   401 sans jeton, un refus 403 hors niveau et une rotation du refresh token.

Le contrôle live reproductible utilise les comptes E2E dédiés :

```bash
npm run test:build-sync-live
```

La migration garde BUILD Sync séparé du MCP : portée `skills:read`, tables,
jetons et révocation distincts. Les jetons d'accès expirent après 15 minutes ;
les refresh tokens tournent à chaque usage et leur famille expire après 90 jours.

## Développement local

```bash
npm run build-skills -- setup --base-url=http://127.0.0.1:3000 --agents=codex
npm run build-skills -- status
npm run build-skills -- update
```

Utiliser `BUILD_SYNC_HOME` avec un dossier temporaire pendant les essais afin de
ne pas toucher aux installations personnelles existantes.
