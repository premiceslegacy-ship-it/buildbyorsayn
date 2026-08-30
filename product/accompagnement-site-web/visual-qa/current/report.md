# QA visuelle : accompagnement BUILD

## Périmètre

Version locale servie sur `http://127.0.0.1:3001` après le build de production final.

Surfaces vérifiées :

- `/`
- `/accompagnement`
- `/accompagnement/site-web`
- `/accompagnement/espace` sans session
- `/accompagnement/formateur` sans session
- ordre pédagogique des blocs dans `lib/mockData.ts`
- rendu des assets et des logos familiers

## Captures actuelles

- `gateway-desktop-1440.png`
- `gateway-mobile-390.png`
- `site-web-desktop-1440.png`
- `site-web-mobile-390.png`
- `home-assets-desktop-1440.png`
- `site-web-assets-desktop-1440.png`

Les captures sont produites depuis le build servi sur le port 3001 et stockées dans ce même dossier.

## Résultats publics

### Homepage `/`

Verdict : PASS pour la surface vérifiée.

- La section `La même IA. Deux résultats opposés.` est présente.
- Le sous-titre explique que la différence vient de ce que l'on construit avec l'outil.
- L'asset montre un brief, le contexte donné à l'IA, une page construite et les étapes `Cadrer`, `Construire`, `Monétiser`.
- La sortie économique est explicite : le site peut être vendu à un client ou utilisé pour sa propre activité.
- L'asset contient une réglette visuelle d'outils familiers : ChatGPT, Codex, Claude Code, Stripe, Vercel et Supabase.
- Les outils restent des repères secondaires. Ils ne sont pas présentés comme la valeur de l'accompagnement.
- À 1440 px, `scrollWidth = 1440`.
- À 390 px, `scrollWidth = 390`.

### Sas `/accompagnement`

Verdict : PASS pour la surface vérifiée.

- H1 actuel : `Crée des sites web avec l'IA. Vends ton savoir-faire.`
- Le sous-titre couvre le débutant, l'expérience existante, l'indépendance, l'agence et la reconversion.
- Le lien vers l'offre Site Web reste présent.
- Le logo visible est BUILD.
- La palette anthracite et or reste cohérente avec BUILD.
- À 1440 px, `scrollWidth = 1440`.
- À 390 px, `scrollWidth = 390`.
- Aucun débordement horizontal observé.

### Offre `/accompagnement/site-web`

Verdict : PASS pour la surface vérifiée.

- H1 actuel : `Crée des sites web avec l'IA. Vends ton savoir-faire.`
- Le premier écran précise les situations couvertes : première prestation, agence, activité personnelle et reconversion.
- Les actions restent courtes et distinctes : `Parler du projet` et `Ouvrir l'espace`.
- Le résultat est expliqué comme une capacité à produire, relire et améliorer un site avec l'IA.
- Les anciens blocs de listes répétitives sont remplacés par des compositions visuelles : résultat, cycle de travail, atlas des thèmes et chemins selon le point de départ.
- L'asset de résultat contient les repères `Produire`, `Vendre`, `Développer` et une réglette visuelle d'outils familiers.
- Les boutons utilisent un relief léger, une bordure, un reflet intérieur et un état pressé sans modifier la hiérarchie BUILD.
- À 1440 px, `scrollWidth = 1440`.
- À 390 px, `scrollWidth = 390`.
- Aucun débordement horizontal observé.

## Logos et ressources locales

Les logos sont servis localement depuis `public/brand-logos/` :

- `openai.svg`, utilisé pour ChatGPT et Codex ;
- `anthropic.svg`, utilisé pour Claude Code ;
- `stripe.svg` ;
- `vercel.svg` ;
- `supabase.svg`.

Contrôles effectués :

- les cinq fichiers sont des SVG XML valides ;
- le navigateur charge les six images rendues avec `complete = true` ;
- chaque image rendue retourne `naturalWidth = 150` ;
- les libellés DOM vérifiés sont `ChatGPT`, `Codex`, `Claude Code`, `Stripe`, `Vercel` et `Supabase` ;
- aucune dépendance CDN n'est nécessaire au rendu des assets.

La licence et la provenance des fichiers sont à conserver avec le projet si les assets sont réutilisés sur d'autres supports commerciaux.

## Accès protégés

Contrôles sans session :

- `/accompagnement/espace` : `307` vers `/login?next=%2Faccompagnement%2Fespace` ;
- `/accompagnement/formateur` : `307` vers `/accompagnement`.

Verdict : PASS pour le comportement sans session.

La zone authentifiée n'a pas été ouverte avec une session membre réelle. Aucun identifiant n'a été deviné ou saisi.

## Curriculum

Ordre vérifié dans les données :

`1 → 5 → 3 → 6 → 2 → 4 → 7`

Correspondance pédagogique :

- Bloc 1 : fondations mentales et projet clair ;
- Bloc 5 : offre et logique commerciale ;
- Bloc 3 : première boucle de direction et de construction ;
- Bloc 6 : construction et mise en ligne ;
- Bloc 2 : système avancé et fonctions nécessaires ;
- Bloc 4 : cohérence visuelle et réutilisation ;
- Bloc 7 : capitalisation et amélioration avec le réel.

Le bouton de bloc suivant s'appuie sur l'ordre de `BLOCS_DATA`, et non sur un calcul numérique de l'identifiant.

## Vue formateur

La route et le code sont présents. La vue utilise :

- les profils BUILD réellement présents ;
- l'e-mail de chaque formé ;
- le parcours ;
- l'état `À démarrer`, `En cours`, `À relancer` ou `Terminé` ;
- le pourcentage de progression ;
- la progression thème par thème ;
- la dernière activité ;
- le dernier geste traduit en français ;
- une note de séance explicitement locale au navigateur.

Le formateur lui-même est exclu du compteur. Une personne sans activité Site Web n'est pas transformée en activité inventée : elle apparaît comme `À démarrer`.

La vue formateur n'a pas été ouverte avec le compte administrateur pendant cette session. Son comportement protégé est toutefois vérifié par la redirection sans session et sa compilation est incluse dans le build.

## Tests exécutés

- `npm run lint` : exit 0 ;
- `npm test` : exit 0, 14 tests réussis ;
- `npx tsc --noEmit` : exit 0 ;
- `npm run build` : exit 0, compilation réussie et 30 pages générées ;
- `git diff --check` : exit 0 ;
- contrôles HTTP locaux : routes publiques en 200, routes protégées en 307.

## Limites et verdict fail-closed

- Une revue visuelle de l'espace membre avec un compte membre réel reste à faire.
- Une revue visuelle de la vue formateur avec le compte administrateur reste à faire.
- Le test clavier complet, les états asynchrones et la revue avec lecteur d'écran ne sont pas exécutés dans cette session.
- Aucun reviewer indépendant n'est disponible dans cette session.

Le verdict des surfaces publiques vérifiées est `PASS`.

Le verdict global de livraison reste `BLOCKED` au sens fail-closed tant que les surfaces authentifiées et la revue indépendante ne sont pas vérifiées. Ce statut ne remet pas en cause les résultats techniques et publics listés ci-dessus.

## Identité

Builder : Hermes Agent

Reviewer indépendant : non disponible dans cette session

Verdict global : BLOCKED
