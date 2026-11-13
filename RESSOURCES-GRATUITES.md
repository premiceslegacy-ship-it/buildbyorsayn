# Ressources gratuites (page `/ressources`)

Deux skills offerts contre un compte gratuit : **SLOP** (écrire sans que ça sonne IA) et **SKILL** (vidéo avec un personnage IA qui parle). La page sert aussi de passerelle vers Fondations et LE COFFRE.

## Ce que fait la page
- Visiteur sans compte : voit les deux ressources et un seul appel à l'action, « Créer mon compte gratuit ». Le compte ramène sur la page avec la ressource visée (`?r=slop`) et la source (`?s=instagram|tiktok|youtube|linkedin`).
- Connecté (n'importe quel niveau, `free` compris) : bouton « Télécharger ». Le fichier passe par `/api/ressources/<slug>` : session exigée, limite de débit commune aux téléchargements privés, lien signé de 60 secondes, trace dans `free_resource_downloads`.
- Conversion : « Ces skills sont un point de départ », le bloc 1 gratuit, le prochain pas relié à la ressource, puis la zone « Offres » habituelle qui s'adapte au niveau de la personne (Fondations, LE COFFRE, montée).

## Fichiers
| Chemin | Rôle |
| --- | --- |
| `app/ressources/page.tsx`, `ressources.css`, `loading.tsx` | page publique |
| `app/api/ressources/[slug]/route.ts` | téléchargement protégé |
| `lib/freeResources.ts` | catalogue, source, adresses |
| `supabase/migrations/20261113120000_free_resources.sql` | table des téléchargements (RLS, lecture seule côté navigateur) |
| `scripts/publish-free-resources.ts` (`npm run resources:publish`) | dépose les deux .zip dans le dépôt privé `free-resources` |
| `tests/freeResources.test.ts` | catalogue, texte, accès, migration, route |

## Mise en ligne (rien n'est fait tant que Samuel n'a pas dit oui)
1. Appliquer la migration `20261113120000_free_resources.sql`.
2. Contrôler : `npm run resources:publish -- --check` (lecture seule).
3. Déposer les fichiers : `npm run resources:publish` (source : `Contenu et réseaux/05 - Ressources gratuites/_zips`).
4. Déployer l'application. Vérifier à la main : page sans compte, création de compte, téléchargement des deux fichiers, trace dans la table.
5. Mettre le lien `https://<domaine>/ressources?r=slop&s=instagram` (ou `skill`) dans la réponse aux commentaires et dans la bio.

## E-mails
Le compositeur d'e-mails de l'administration sait déjà viser l'audience « gratuits » (les comptes gratuits inactifs n'en reçoivent jamais). Une séquence automatique n'est pas faite : elle demande une case de consentement non cochée à la création du compte.

## Mise à jour d'une ressource
Remplacer le .zip dans `_zips`, relancer `npm run resources:publish`. Pas de déploiement : le fichier est relu à chaque téléchargement.
