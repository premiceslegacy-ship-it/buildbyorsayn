# QA visuelle : accompagnement BUILD

## Périmètre

Version locale servie sur `http://127.0.0.1:3001` après le build de production courant.

Surfaces vérifiées :

- `/`
- `/accompagnement`
- `/accompagnement/site-web`
- `/accompagnement/espace` sans session
- `/accompagnement/formateur` sans session
- ordre pédagogique des blocs dans `lib/mockData.ts`
- scènes d'assets et marques produit locales

## Captures actuelles

- `gateway-desktop-1440.png`
- `gateway-mobile-390.png`
- `site-web-desktop-1440.png`
- `site-web-mobile-390.png`
- `home-assets-desktop-1440.png`
- `site-web-assets-desktop-1440.png`
- `site-web-outcome-mobile-390.png`

Les quatre dernières captures ont été régénérées depuis le build courant et stockées dans ce dossier.

## Homepage `/`

Verdict : `PASS` pour la scène publique vérifiée.

- La section `La même IA. Deux résultats opposés.` est présente.
- L'asset montre une entrée réelle : client, activité, offre, message, contraintes et action attendue.
- La chaîne visible est : brief, cadrage, construction, relecture, mise en ligne, puis connexions optionnelles.
- Chaque outil est affecté à une étape et à un verbe : ChatGPT clarifie, Codex construit, Claude Code relit, Vercel publie, Supabase connecte et Stripe intervient pour le paiement.
- La sortie montre un site qui porte une offre, une page livrable et une action mesurable.
- Le contraste `Sans méthode` / `Avec BUILD` explique la différence entre une réponse plausible et un site utile.
- Les logos ne sont plus une réglette autonome et ne sont pas présentés comme la valeur de l'accompagnement.
- À 1440 px, `scrollWidth = 1440`.
- Les six images de marque sont chargées avec `complete = true` et une largeur naturelle supérieure à zéro.
- Aucune occurrence rendue de `&apos;` n'est présente.

## Sas `/accompagnement`

Verdict : `PASS` pour la surface publique vérifiée.

- H1 actuel : `Crée des sites web avec l'IA. Vends ton savoir-faire.`
- Le sous-titre couvre le débutant, l'expérience existante, l'indépendance, l'agence et la reconversion.
- Le lien vers l'offre Site Web reste présent.
- Le logo visible est BUILD.
- La palette anthracite et or reste cohérente avec BUILD.
- À 1440 px, `scrollWidth = 1440`.
- À 390 px, `scrollWidth = 390`.

## Offre `/accompagnement/site-web`

Verdict : `PASS` pour les scènes publiques vérifiées.

### Capacités selon le point de départ

`AudienceRoutesAsset` ne se limite plus à une liste de publics. Les cinq cartes montrent chacune une entrée, une transformation et une sortie :

- brief client → site livrable → prestation ;
- offre → page claire → demande ;
- règles BUILD → équipe → livraisons ;
- workflow → relecture → version fiable ;
- projet réel → portfolio → nouveau métier.

Les mini-flux restent lisibles sur desktop et mobile. Les titres se recomposent sans être coupés à 390 px.

### Livrable

`SiteWebOutcomeAsset` montre :

- une offre à rendre claire ;
- un site construit et relu ;
- une demande ou une vente ;
- un aperçu de page réelle avec une prochaine étape ;
- les rôles de ChatGPT, Codex et Claude Code dans le passage du message à la page ;
- Vercel et Stripe en sortie, avec leur rôle explicite.

Le défaut de largeur observé sur la première capture desktop a été corrigé avec des colonnes `minmax(0, ...)` et des enfants `min-w-0`. À 1440 px, aucun contenu de la colonne de sortie ne dépasse ou n'est coupé.

### Cycle de travail

`WorkCycleAsset` représente la boucle :

`Cadrer → Construire → Relire → Publier`

Chaque étape porte une marque produit, un verbe et une description opérationnelle. Supabase et Stripe apparaissent ensuite comme des options conditionnelles, pas comme des décorations.

### Responsive

- Desktop 1440 px : `scrollWidth = 1440`.
- Mobile 390 px : `scrollWidth = 390`.
- Mobile : `document.body.scrollWidth = 390`.
- Aucun élément mesuré ne dépasse le viewport après le correctif.
- Les apostrophes sont rendues normalement.
- Les captures mobiles montrent les titres complets et les mini-flux contenus.

## Marques produit locales

Les fichiers sont servis depuis `public/brand-logos/` afin que le rendu ne dépende pas d'un CDN :

- `chatgpt.svg` : nœud OpenAI utilisé par ChatGPT, avec le libellé produit ChatGPT ;
- `codex.svg` : logomark dédié Codex ;
- `claude-code.svg` : logomark dédié Claude Code ;
- `vercel.svg` : marque Vercel ;
- `supabase.svg` : marque Supabase ;
- `stripe.svg` : marque Stripe.

Les marques Codex et Claude Code ne sont plus remplacées par les logos génériques OpenAI et Anthropic. Les fichiers dédiés Codex et Claude Code sont versionnés depuis :

- `https://unpkg.com/@lobehub/icons-static-svg@1.94.0/icons/codex-color.svg`
- `https://unpkg.com/@lobehub/icons-static-svg@1.94.0/icons/claudecode-color.svg`

La provenance est documentée dans `public/brand-logos/README.md`. Les règles de marque et de réutilisation commerciale doivent être revérifiées avant une diffusion sur un autre support.

Contrôles effectués :

- tous les SVG locaux sont des XML valides ;
- les chemins chargés par le navigateur sont distincts pour ChatGPT, Codex et Claude Code ;
- les six marques utilisées dans les scènes sont chargées ;
- les marques sont attachées à des étapes et à des responsabilités ;
- aucune marque n'est affichée comme une rangée décorative autonome.

## Accès protégés

Contrôles sans session :

- `/accompagnement/espace` : `307` vers `/login?next=%2Faccompagnement%2Fespace` ;
- `/accompagnement/formateur` : `307` vers `/accompagnement`.

Verdict : `PASS` pour le comportement sans session.

La zone authentifiée n'a pas été ouverte avec une session membre réelle. Aucun identifiant n'a été deviné ou saisi.

## Curriculum

Ordre vérifié dans les données :

`1 → 5 → 3 → 6 → 2 → 4 → 7`

Le bouton de bloc suivant s'appuie sur l'ordre de `BLOCS_DATA`, et non sur un calcul numérique de l'identifiant.

## Vue formateur

La route et le code restent présents. La vue utilise :

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

La vue formateur n'a pas été ouverte avec le compte administrateur pendant cette session. Son comportement protégé est vérifié par la redirection sans session et sa compilation est incluse dans le build.

## Tests exécutés

- `npm run lint` : exit 0 ;
- `npm test` : exit 0, 14 tests réussis ;
- `npx tsc --noEmit` : exit 0 ;
- `npm run build` : exit 0, compilation réussie et 30 pages générées ;
- `git diff --check` : exit 0 ;
- contrôles navigateur desktop et mobile : routes chargées, marques chargées, dimensions vérifiées.

## Limites et verdict fail-closed

- Une revue visuelle de l'espace membre avec un compte membre réel reste à faire.
- Une revue visuelle de la vue formateur avec le compte administrateur reste à faire.
- Le test clavier complet, les états asynchrones et la revue avec lecteur d'écran ne sont pas exécutés dans cette session.
- Aucun reviewer indépendant n'est disponible dans cette session.

Le verdict des surfaces publiques et des scènes d'assets vérifiées est `PASS`.

Le verdict global de livraison reste `BLOCKED` au sens fail-closed tant que les surfaces authentifiées et la revue indépendante ne sont pas vérifiées. Ce statut ne remet pas en cause les résultats techniques et publics listés ci-dessus.

## Identité

Builder : Hermes Agent

Reviewer indépendant : non disponible dans cette session

Verdict global : `BLOCKED`
