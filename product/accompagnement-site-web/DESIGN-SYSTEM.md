# Design system : Accompagnement Site Web

## Statut

Version : 2.0

Surface : sas des accompagnements, page de l'offre Site Web et espace membre.

Source de vérité :

- `build-brand-system.md`
- `build-design-system.md`
- `app/globals.css`
- `components/Logo.tsx`

La direction n'est pas une identité séparée. Elle reprend la direction BUILD pour que l'accompagnement reste une partie du même produit.

## Direction visuelle

Registre : sombre, direct, précis, calme.

La page doit donner l'impression d'un atelier de travail sérieux, pas d'un outil IA générique. La hiérarchie vient de la taille des titres, des espacements, des filets fins et de la lumière or patiné. Aucun effet ne doit prendre la place du résultat annoncé.

## Marque

- Utiliser le composant `Logo` existant et le mot BUILD.
- Ne pas afficher de logo Orsayn dans ces surfaces.
- Ne pas recréer un logo avec une autre image ou une autre typographie.
- Le sas porte BUILD. La page Site Web porte BUILD. L'espace membre porte BUILD.

## Assets de proposition

Les assets visuels de la page ne représentent pas des logiciels. Ils représentent le travail qui crée la valeur : un brief, le contexte donné à l'IA, une page construite, une relecture et une sortie commerciale.

Les compositions sont codées dans `components/AccompanimentAssets.tsx` et restent dans la palette BUILD. Une réglette présente des logos familiers de ChatGPT, Codex, Claude Code, Stripe, Vercel et Supabase. Ils servent à situer l'écosystème de production, pas à faire croire qu'un logiciel constitue la valeur de l'accompagnement.

Le centre des compositions reste le travail réel : brief, contexte donné à l'IA, page construite, relecture, mise en ligne et sortie commerciale. Les éventuels boutons dans les fausses pages sont des éléments de décor explicatifs, pas des contrôles fonctionnels.

La page Site Web utilise trois compositions principales :

- `AudienceRoutesAsset` : les cinq points de départ et leur sortie possible ;
- `SiteWebOutcomeAsset` : le passage d'une idée à un site vendable ;
- `WorkCycleAsset` et `ThemeAtlas` : la construction, la relecture et les thèmes du projet.

Les ombres et reliefs sont limités aux boutons ou aux feuilles visuelles afin d'évoquer un objet manipulable. Ils ne deviennent pas un système de cartes ou une décoration généralisée.

## Couleurs

| Rôle | Valeur | Usage |
|---|---|---|
| Fond principal | `#0e0e0f` | Toutes les surfaces de travail |
| Fond secondaire | `#161618` | Alternance et zone de regroupement |
| Or patiné | `#e8d5b0` | Action principale, sélection, index et progression |
| Or sombre | `#c9b48a` | Variation discrète de l'accent |
| Texte principal | `#f0ede8` | Titres et informations importantes |
| Texte secondaire | `rgba(240, 237, 232, 0.50)` | Explications et détails |
| Texte discret | `rgba(240, 237, 232, 0.25)` | Métadonnées non essentielles |
| Filet | `rgba(255, 255, 255, 0.07)` | Séparation des zones et des lignes |
| Succès | `rgba(74, 222, 128, 0.80)` | Confirmation explicite |
| Erreur | `rgba(248, 113, 113, 0.80)` | Échec et récupération |

Pas de gradient de fond, pas de halo décoratif, pas de bleu concurrent de l'or BUILD.

## Typographie

L'accompagnement utilise la même pile que BUILD : `-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", sans-serif` via `font-sans`.

- Les titres restent en sans serif, avec un poids moyen et un interlettrage serré.
- Les textes d'interface restent lisibles à partir de 14 px.
- Les libellés courts peuvent utiliser la casse haute avec parcimonie.
- Aucun serif éditorial n'est ajouté à l'accompagnement.
- Aucun texte important ne dépend d'une police externe non chargée.

## Composition

### Sas

Le sas explique qu'il existe plusieurs accompagnements et donne une seule destination active. Les offres futures restent visibles comme une information de contexte, pas comme de faux boutons.

### Page de l'offre

Ordre de lecture :

1. résultat économique et promesse de création de sites avec l'IA ;
2. points de départ selon le niveau et le projet ;
3. ce que le site permet de vendre ou de développer ;
4. façon de travailler ;
5. thèmes abordés ;
6. limites de l'accompagnement ;
7. prise de contact.

Le H1 est centré. Les boutons nomment une action courte : `Parler du projet`, `Ouvrir l'espace`, `Voir l'offre` et `Ouvrir le thème`. Le relief skeuomorphique reste léger : bord inférieur, reflet intérieur, état pressé et focus visible, sans dégrader le contraste ni la lisibilité.

### Espace membre

Ordre de lecture :

1. progression globale ;
2. liste des thèmes ;
3. sujet actif ;
4. tâches du sujet ;
5. condition simple pour passer à la suite ;
6. éléments produits ;
7. notes de suivi ;
8. informations personnelles.

La navigation est une liste de lignes. Les tâches sont des lignes sélectionnables. Les cartes empilées ne servent pas de structure par défaut.

## Thèmes

L'espace ne parle pas en semaines. Il suit les thèmes du travail :

1. Un projet clair avant de commencer.
2. Un message qui donne envie d'avancer.
3. Une direction qui donne confiance.
4. Des pages cohérentes partout.
5. Construire et mettre en ligne.
6. Ajouter seulement ce qui est nécessaire.
7. Être trouvé par les bonnes personnes.
8. Obtenir des demandes.
9. Améliorer avec le réel.

Chaque thème contient un résultat attendu, des tâches courtes et une phrase simple qui indique quand le sujet est suffisamment avancé. Aucun thème n'est présenté comme une gate ou comme une collection de preuves.

## Actions et états

Les boutons principaux utilisent le fond `#e8d5b0` et le texte `#0e0e0f`. Les boutons secondaires restent transparents avec un filet clair.

Chaque action doit avoir les états suivants quand ils s'appliquent : repos, survol, focus visible, pression, désactivé, sauvegarde, succès et erreur avec récupération.

La progression affiche toujours un nombre en plus de la couleur. Une tâche cochée indique qu'elle a été faite. La synchronisation distante conserve une file locale en cas de panne.

Les champs ont un label visible. Les textes de secours expliquent ce qui s'est passé et quoi faire ensuite.

## Icônes et motion

Les icônes Lucide restent réservées aux actions ou aux statuts utiles : retour, export, sauvegarde, remise à zéro, recherche et activité. Aucune icône décorative n'est ajoutée à chaque section.

La motion sert uniquement à confirmer une sauvegarde, un changement de thème ou une progression. Elle n'est pas nécessaire pour comprendre la page. Le mode `prefers-reduced-motion` ramène les transitions à 1 ms et désactive le défilement doux.

## Responsive

Viewports à vérifier : 320, 375, 768, 1024, 1025 et 1440 px.

- Le sas et la page d'offre restent centrés sans couper le H1.
- La table des thèmes devient une liste lisible sur petit écran.
- L'espace membre passe de trois zones à une colonne dans l'ordre de lecture.
- La liste des thèmes devient défilable horizontalement uniquement lorsqu'elle ne tient plus.
- Aucune action ne descend sous 44 px.
- Aucun texte ou bouton important ne dépend du survol.

## Anti AI-slop

Interdits dans ces surfaces :

- police serif ajoutée pour faire premium ;
- logo Orsayn ou variante de marque ;
- sparkles, halos, blobs ou grille décorative ;
- glassmorphism sans rôle ;
- rangées de cartes interchangeables ;
- logos d'outils utilisés comme preuve de valeur ;
- répétition de listes numérotées `01`, `02`, `03` pour remplacer une vraie composition ;
- traits décoratifs devant chaque ligne ;
- jargon non expliqué ;
- faux chiffres ou faux témoignages ;
- bouton dont le résultat n'est pas compréhensible ;
- thème présenté comme une semaine ou une preuve.

## QA

Le rapport historique dans `visual-qa/browser-report.json` correspond à l'ancienne interface et n'est pas une preuve pour cette version. Il doit être régénéré après la prochaine capture navigateur.

La direction BUILD est validée par la demande du propriétaire du produit. Le rendu final doit encore faire l'objet d'une revue visuelle indépendante avant publication.
