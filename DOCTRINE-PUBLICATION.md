# Publication de la doctrine Coffre

## Périmètre

La doctrine est une adaptation pédagogique privée, pas une copie du Second Brain. Son registre de provenance reste hors du dépôt, de Storage et du corpus MCP. Les Markdown autorisés sont conservés dans une source canonique extérieure au dépôt. Aucun contenu local n'est utilisé comme secours par l'application.

Seuls les membres `full` et les administrateurs peuvent lire `/doctrine`. La source de connaissance MCP `doctrine` impose `tier: full` ; le filtrage du serveur et les contrôles de résultat restent applicables. Une réussite de build n'est pas une preuve d'accès authentifié ni une validation éditoriale.

## Conditions avant publication

- Revue éditoriale indépendante positive sur l’inventaire choisi et le registre privé exacts.
- Revue technique positive sur le code exact, incluant accès, téléchargement borné, rendu Markdown et concurrence.
- Tests, TypeScript, build et contrôle des bundles réussis.
- Sources canoniques figées ; provenance et captures privées exclues du Git.
- Bucket `skills` existant et privé ; migration `20260910120000_skill_publication_lock_fail_closed.sql` appliquée et relue.

## Ordre de livraison

1. Valider localement sans écriture : `node --import tsx scripts/publish-doctrine.ts --source="$DOCTRINE_SOURCE_DIR"`.
2. Après les revues, publier Storage avec la même commande et `--apply`. Chaque artefact immuable est relu et comparé octet pour octet avant la mise à jour de `doctrine/v1/manifest.json`. Le manifeste et les artefacts sont à nouveau relus après cette mise à jour.
3. Déployer le commit applicatif compatible avec la source `doctrine` et vérifier le SHA distant, le déploiement et les parcours autorisés/refusés.
4. Ingestion de l’extension BLOQUÉE dans cette livraison : le script courant ne possède pas de mode doctrine-only et son `--max-chunks` peut supprimer des versions différées. Ne pas utiliser `knowledge:sync --apply` pour cette opération. Un plan paginé borné à doctrine, sans modification des autres sources, et son readback exact doivent être implémentés/revus séparément. Ne pas activer le scan du vault.
5. Vérifier les lignes ingérées, leur niveau `full`, les refus MCP pour Aperçu/Fondations et la lecture positive Coffre.

L'ancien serveur MCP rejette la nouvelle valeur de source. L'ingestion avant le déploiement compatible peut donc casser les réponses de l'ancien serveur, même sans filtre explicite sur la doctrine.

## Verrou et échec ambigu

Le publisher utilise les RPC existantes `acquire_skill_publication_lock` et `release_skill_publication_lock`, avec la clé dédiée `doctrine`. Ce verrou protège les écritures du pointeur doctrine ; les chemins des catalogues skills restent séparés. L'acquisition n'est jamais reprise automatiquement selon un délai. Le jeton généré reste en mémoire et n'est pas journalisé.

Le verrou n'est libéré qu'après tous les readbacks réussis. Tout échec après acquisition, notamment une réponse réseau ambiguë, conserve volontairement le verrou. Une erreur lors de sa libération empêche l'annonce de réussite.

Il ne s'agit pas d'un fencing implémenté par Storage. Après interruption :

1. Arrêter tous les publishers doctrine sur toutes les machines et suspendre leurs déclencheurs.
2. Établir que les anciens processus et les écritures Storage en vol sont terminés. L'âge du verrou et l'absence d'un processus sur une seule machine ne suffisent pas.
3. Relire le manifeste exact et tous les artefacts qu'il référence ; comparer à la release approuvée. Ne pas supposer que l'ancien pointeur est resté intact.
4. Récupérer le verrou uniquement par une opération administrateur bornée à la clé `doctrine`, après vérification et autorisation de récupération. Ne jamais vider la table de verrous et ne pas supprimer la clé `skills`.
5. Relire l'absence du verrou, puis reprendre la publication normale et ses contrôles.

Ne pas relancer `--apply` en boucle et ne pas contourner un refus de consentement. Les erreurs affichées restent génériques ; aucun secret, jeton, cookie ou contenu privé ne doit entrer dans les journaux de livraison.

## Retour arrière

Préserver les anciennes releases immuables et une copie privée du manifeste précédent avant de déplacer le pointeur. Un retour arrière doit être revu, sérialisé par le même verrou et relu après écriture. Ne pas déployer un ancien enum MCP tant que des lignes `source = doctrine` restent susceptibles d'être renvoyées : corriger ou retirer cette source de façon bornée avant un rollback incompatible.

## Limite de cette livraison

Les enseignements issus des audits sont des exigences et des exemples pédagogiques, pas une preuve d'exploitation. Obsidian reste le Second Brain. Cette livraison n'installe et n'active aucun runtime opérationnel supplémentaire, scheduler, agent permanent ni connecteur.

## Inventaires versionnés et compatibilité corpus18

`lib/doctrine/inventory.ts` autorise exactement `socle-v1` (9 noms) ou `agentique-v1` (18 noms : socle9, README, extension8). Le publisher reconnaît le lot par égalité exacte de noms ; aucun scan récursif, dossier supplémentaire ou document privé n’est admis. `.DS_Store` seul est ignoré. Le socle conserve ses neuf premières positions. Les fixtures ne contiennent aucun contenu canonique.

Le schéma et le pointeur restent `schemaVersion: 1` et `doctrine/v1/manifest.json`. Décision minimale : le reader déployable existant accepte déjà 1..100 artefacts et ses tests couvrent maintenant 18. Aucun pointeur v2 ni migration reader/UI n’est nécessaire. **Une future publication corpus18 sur ce pointeur modifiera aussi le contenu lu par les anciennes instances compatibles** : sauvegarder le manifeste précédent et faire approuver explicitement cette bascule avant apply. Aucune bascule n’est exécutée par cette préparation.

Le dry-run ne charge pas `.env.local` et ne fait aucun appel réseau. Pour 18 fichiers :

```sh
npm run doctrine:publish -- --source="$DOCTRINE_SOURCE_DIR"
```

Le préflight contrôle tout l’inventaire par stat avant allocation, puis lit chaque fichier régulier sans suivre de symlink, avec allocations bornées et détection de croissance/troncature. Il réserve 2 × 64 KiB aux métadonnées du reader dans son plafond inchangé de 8 000 000 octets ; le manifeste est limité à 64 KiB et chaque fichier à 2 000 000 octets. UTF-8 strict, hashes et contrôle de secrets précèdent le réseau. La source est relue de façon bornée avant publication du pointeur.

Le transport conserve trois passes artefacts et N+5 réponses de 64 KiB (manifeste compris), un budget partagé fini et une échéance absolue de 120 s maximum. Les réponses réseau sont lues en streaming borné avant parsing SDK ; dépassement/timeout/mismatch après acquisition conserve le verrou. Les contrôles Coffre/full/admin, refus preview/beginner, Storage privé, source MCP doctrine/full et absence de fallback filesystem restent inchangés.
