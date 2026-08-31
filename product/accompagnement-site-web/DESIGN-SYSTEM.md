# Design system : Vente de sites web avec l'IA

## Statut

Version : 2.2

Surface : sas des accompagnements, page de l'offre activité et espace membre.

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
- Le sas porte BUILD. La page d'offre porte BUILD. L'espace membre porte BUILD.

## Assets de proposition

Les assets visuels de la page ne représentent pas des logiciels isolés. Ils représentent le travail qui crée la valeur : une entreprise cliente, un besoin compris, une offre de site web, la production avec l'IA, une relecture, une vente, une livraison et un système réutilisable.

Les compositions sont codées dans `components/AccompanimentAssets.tsx` et restent dans la palette BUILD. Le logo BUILD est l'élément de méthode dominant lorsque des outils sont représentés. Les marques produit sont des briques interchangeables reliées au centre, jamais la promesse principale.

Il est interdit de poser ces logos en rangée décorative. Une marque doit toujours être attachée à une étape, une entrée ou une sortie. Le centre des compositions reste le travail réel et le résultat économique. Les éventuels boutons dans les fausses pages sont des éléments de décor explicatifs, pas des contrôles fonctionnels.

La page d'offre utilise deux compositions principales et un atlas de contenu :

- `StartingPointAsset` : trois points d'entrée reliés au même accompagnement 1:1, du premier site vendu au système qui peut scaler ;
- `MethodToolsAsset` : BUILD au centre et les outils autour, sans noms visibles sous les logos ;
- `ThemeAtlas` : les thèmes du projet, présenté comme un contenu de décision et non comme un asset décoratif.

Le sas général utilise `AccompanimentGuidanceAsset` : deux mains anatomiquement réalistes se rejoignent pour représenter le travail main dans la main, quel que soit le sujet de l'accompagnement. La source est un détail du domaine public de `The Creation of Adam`, segmenté avec macOS Vision puis transformé dans ASCII Magic. La couche finale superpose un Dither Atkinson et un jeu de caractères standard, recolorés en crème et or sur transparence réelle. Aucun fond, masque rectangulaire, cadre, texte ou vidéo n'est intégré au fichier.

L'accueil utilise `BuildMethodHeroAsset` pour montrer BUILD comme la couche de méthode qui organise ChatGPT, Codex, Claude Code, Stripe, Supabase, Vercel et Cloudflare. Les cartes outils sont secondaires, sans labels visibles, et les connexions représentent l'orchestration.

Les assets ne sont pas des bento grids. Ils utilisent un canvas de relations avec un centre, des nœuds, des lignes fines et une sortie identifiable. La page d'offre suit la séquence commerciale : l'accompagnement s'adapte au point de départ, puis la méthode reste valable quand les outils changent.

Les compositions relationnelles ne sont pas enfermées dans un grand cadre extérieur. Le canvas respire dans la section qui l'accueille ; seuls les nœuds, le centre et la sortie portent une surface lorsque cela aide à comprendre le flux.

Les assets d'outils ne possèdent aucun cercle d'orbite. Les cards individuelles, les logos et les flux restent visibles ; aucun anneau décoratif ne relie artificiellement les marques.

Les ombres et reliefs sont limités aux boutons ou aux feuilles visuelles afin d'évoquer un objet manipulable. Ils ne deviennent pas un système de cartes ou une décoration généralisée.

Pour les assets de relations, une profondeur plus expressive est autorisée uniquement lorsqu'elle explique le système :

- dans `StartingPointAsset` et `MethodToolsAsset`, les traits utilisent un dessous sombre décalé, une face de rail or, une arête claire, une ligne de base toujours allumée, un port de connexion et un segment lumineux qui avance vers BUILD comme une jauge continue ;
- dans `AccompanimentGuidanceAsset`, les deux mains et leur point de contact sont le seul langage visuel ; un signal masqué parcourt uniquement la couche Characters en `6.8 s`, sans déplacer les mains ; reduced motion masque ce signal et conserve Dither + Characters ;
- les cartes peuvent recevoir une seconde couche basse, une ombre courte et une translation verticale de quelques pixels pour suggérer un objet manipulable ;
- un blur peut exister derrière le réseau ou le centre, à faible opacité, sans flouter les logos, les lignes ou les textes ;
- le segment lumineux peut recevoir une lueur très courte pour rester lisible comme un flux, sans devenir un halo décoratif ;
- la hiérarchie reste fixe : BUILD domine, les outils restent secondaires et la sortie reste lisible ;
- `prefers-reduced-motion` désactive le déplacement du segment et les mouvements secondaires, tout en conservant les rails, les ports et les lignes de base.

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

Pas de gradient de fond, pas de halo décoratif, pas de bleu concurrent de l'or BUILD. Un gradient textuel crème-or est réservé à la phrase d'action principale de l'accueil ; il ne devient ni une surface ni un effet généralisé.

## Typographie

L'accompagnement et l'accueil héritent de la même instance Inter chargée par `next/font`. Les titres principaux partagent un poids `500` et un interlettrage de `-0.04em` à taille desktop.

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

1. résultat économique et promesse de vente de sites web avec l'IA ;
2. points de départ selon le niveau et le projet ;
3. méthode BUILD et outils contextualisés ;
4. thèmes abordés ;
5. prise de contact.

Le H1 de la hero est centré dans une colonne de lecture large, avec les boutons centrés et regroupés sans débordement sur mobile. Les boutons nomment un bénéfice : `Faire le point gratuitement`, `Trouver le bon point de départ`, `Ouvrir l'espace`, `Voir l'offre` et `Ouvrir le thème`. L'appel Site Web utilise `https://cal.com/samuel-mbeboura/point-sur-ton-projet-de-site-web`. Le relief skeuomorphique reste léger : bord inférieur, reflet intérieur, état pressé et focus visible, sans dégrader le contraste ni la lisibilité.

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

1. Une activité de sites web claire avant de commencer.
2. Une offre de sites web que les bons clients comprennent.
3. Des références pour créer des sites qui donnent confiance.
4. Une base de production web que tu peux réutiliser.
5. Construire et livrer les sites que tu peux vendre.
6. Relier tes sites à la vente et à la livraison.
7. Être trouvé par les entreprises qui ont besoin d'un site.
8. Obtenir des demandes et vendre des sites.
9. Améliorer les ventes de sites et protéger la marge.

Chaque thème contient un résultat attendu, des tâches courtes et une phrase simple qui indique quand le sujet est suffisamment avancé. Aucun thème n'est présenté comme une gate ou comme une collection de preuves.

## Actions et états

Les boutons principaux utilisent le fond `#e8d5b0` et le texte `#0e0e0f`. Les boutons secondaires restent transparents avec un filet clair.

Chaque action doit avoir les états suivants quand ils s'appliquent : repos, survol, focus visible, pression, désactivé, sauvegarde, succès et erreur avec récupération.

La progression affiche toujours un nombre en plus de la couleur. Une tâche cochée indique qu'elle a été faite. La synchronisation distante conserve une file locale en cas de panne.

Les champs ont un label visible. Les textes de secours expliquent ce qui s'est passé et quoi faire ensuite.

## Icônes et motion

Les icônes Lucide restent réservées aux actions ou aux statuts utiles : retour, export, sauvegarde, remise à zéro, recherche et activité. Aucune icône décorative n'est ajoutée à chaque section.

La motion d'interface sert uniquement à confirmer une sauvegarde, un changement de thème ou une progression. Dans les assets relationnels, les logos restent fixes ; les lignes de base restent allumées. Les flux des assets site web avancent vers BUILD comme une jauge continue ; dans le sas transversal, les deux flux avancent vers le nœud central. Le mode `prefers-reduced-motion` ramène les transitions à 1 ms, désactive le défilement doux et conserve les points, rails, ports et lignes statiques lisibles.

## Responsive

Viewports à vérifier : 320, 375, 768, 1024, 1025 et 1440 px.

- Le sas et la page d'offre restent centrés sans couper le H1.
- `StartingPointAsset` reste en colonne jusqu'à 1023 px, puis passe en trois colonnes à partir de 1024 px.
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
- bento grids utilisées comme composition par défaut ;
- noms d'outils écrits sous chaque logo dans les assets de méthode ;
- BUILD relégué au même niveau visuel que les outils ;
- répétition de listes numérotées `01`, `02`, `03` pour remplacer une vraie composition ;
- traits décoratifs devant chaque ligne ;
- jargon non expliqué ;
- faux chiffres ou faux témoignages ;
- bouton dont le résultat n'est pas compréhensible ;
- thème présenté comme une semaine ou une preuve.

## QA

Le rapport historique dans `visual-qa/browser-report.json` correspond à l'ancienne interface et n'est pas une preuve pour cette version. Il doit être régénéré après la prochaine capture navigateur.

La direction BUILD est validée par la demande du propriétaire du produit. Le rendu final doit encore faire l'objet d'une revue visuelle indépendante avant publication.
