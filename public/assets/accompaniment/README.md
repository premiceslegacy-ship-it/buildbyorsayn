# Assets ASCII / Dither de l'accompagnement

## Asset : les mains

## Source

- Œuvre : `The Creation of Adam`, Michelangelo, vers 1511.
- Fichier source : `Michelangelo - Creation of Adam (hand crop).jpg`.
- Provenance : https://commons.wikimedia.org/wiki/File:Michelangelo_-_Creation_of_Adam_(hand_crop).jpg
- Statut indiqué par Wikimedia Commons : domaine public.
- SHA-256 du fichier source utilisé : `c6e940eee139d1624a571427593db1356b05a3446126b22284363f04e810e3a0`.

## Transformation

1. Segmentation des deux instances de premier plan avec macOS Vision.
2. Recadrage `16:7` puis redimensionnement en `1440 × 630 px`.
3. Traitement dans ASCII Magic :
   - couche de base `Dither` ;
   - algorithme `Atkinson` ;
   - palette technique `Mono 1-bit` ;
   - chroma `Luminance only` ;
   - pixel size `2` ;
   - strength `100` ;
   - contrast `122` ;
   - threshold `50` ;
   - aucun post-effet.
4. Seconde couche `Characters` :
   - jeu `Standard` : `@#S08Xx+=-;:.` ;
   - font size `7` ;
   - coverage `100` ;
   - edge emphasis `22` ;
   - density `24` ;
   - brightness `6` ;
   - contrast `100` ;
   - aucun post-effet.
5. Noir technique converti en transparence réelle.
6. Recoloration BUILD : or patiné aux extrémités, crème au point de contact.
7. Superposition Dither `78 %` et Characters `48 %`.
8. Animation web : une troisième copie de la couche Characters reçoit un masque linéaire mobile de `6.8 s`. La géométrie des mains ne bouge jamais.
9. Reduced motion : la couche signal est supprimée ; Dither et Characters restent visibles dans leur état statique validé.

## Fichiers livrés

- `hands-dither-atkinson-build.png` : couche Dither stable.
- `hands-characters-build.png` : couche de caractères stable et source du signal animé.
- `hands-ascii-dither-build.png` : composition statique de référence.
- Tous les fichiers sont des PNG RGBA transparents en `1440 × 630 px`.
- Aucun fond, cadre, texte ou vidéo n'est intégré aux fichiers.

## Skill réutilisable

Le workflow validé est formalisé dans le skill local `ascii-magic-design-assets`, avec :

- segmentation macOS Vision ;
- composition et recoloration de couches ;
- recettes pour images, logos, icônes, cards, heroes, schémas et vidéos ;
- contrat d'animation et reduced motion ;
- gabarit de provenance et de QA.

## Asset : le coffre et le cadenas ("bientôt disponible"), silhouettes isolées

Icônes utilisées dans les cartes du folder d'accompagnement (`AccompanimentFolderCard.tsx`).

### Source

- Silhouettes originales dessinées en SVG pour ce projet (coffre, cadenas fermé) : `1200 × 750 px`, fond noir, forme blanche, aucun droit tiers.
- Aucune photo, aucune source externe.

### Transformation

Même recette que les mains (section précédente), appliquée via `ascii-magic.com/app` :

1. Couche `Dither` : `Atkinson`, palette `Mono 1-bit`, chroma `Luminance only`, pixel size `2`, strength `100`, contrast `122`, threshold `50`.
2. Couche `Characters` : jeu `Standard` `@#S08Xx+=-;:.`, font size `7`, coverage `100`, edge emphasis `22`, dark threshold `24`, brightness `6`, contrast `100`.
3. Export PNG (le moteur ASCII Magic exporte le fond noir en alpha opaque, pas transparent) puis post-traitement local : luminance -> alpha, noir -> transparence réelle, RGB -> palette BUILD.
4. Recoloration :
   - coffre : or `#e8d5b0` (dither) et crème `#f0ede8` (characters), pleine opacité - asset "disponible" ;
   - cadenas : gris sourd `#8f8b84`, alpha réduit (`0.5-0.7`) - asset "bientôt disponible".
5. Redimensionné à `960 × 600 px` et compressé en palette réduite pour rester léger.

### Fichiers livrés

- `coffre-dither-atkinson-build.png`, `coffre-characters-build.png` : accompagnement disponible (site web).
- `soon-dither-atkinson-build.png`, `soon-characters-build.png` : accompagnements à venir.
- Tous en PNG RGBA transparent.

## Asset : la scène du coffre (fond de la card d'accompagnement)

Fond plein cadre de `AccompanimentFolderCard.tsx`, pas une icône isolée : un vrai décor (halo, rayons, pièces avec reflet, étincelles, ombre portée dégradée) autour du coffre, pour donner un univers plutôt qu'un objet posé sur du vide.

### Source

- Composition SVG originale `1400 × 900 px` avec de vrais dégradés (metal, halo radial), un filtre `feTurbulence` de grain sur toute la scène et un `feDisplacementMap` pour casser les contours nets des rayons/halos/étincelles avant conversion. Un aplat vectoriel simple ne donne rien une fois passé au dither : il faut de la matière (dégradés, grain, bords irréguliers) en amont.
- Aucune photo, aucune source externe.

### Transformation

Même recette Atkinson / Characters que ci-dessus, appliquée sur cette composition texturée. Export, post-traitement alpha, recoloration or `#e8d5b0` (dither) et crème `#f0ede8` (characters), puis réduit à `1120 × 720 px`.

### Fichiers livrés

- `coffre-scene-dither-atkinson-build.png`, `coffre-scene-characters-build.png` : fond plein cadre, opacité réduite (`~0.9` dither, `~0.7` characters) pour rester lisible derrière le texte et le folder.

## Composant

`components/ui/ascii-dither-asset.tsx` généralise le rendu deux/trois couches utilisé par `hands-ascii-dither.tsx`, `AccompanimentFolderCard.tsx` et le CSS `.guidance-ascii-*` de `app/globals.css`.
