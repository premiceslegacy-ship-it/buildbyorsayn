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

## Asset : la card "Vendre des sites web avec l'IA" (coffre doré, dither)

`components/AccompanimentFolderCard.tsx`, composant `AvailableCardContent` : une des cartes qui sort du dossier d'accompagnement porte l'univers ASCII du coffre, superposition de deux couches transparentes exactement comme les mains (section précédente) - c'est ce qui donne la vraie "imprégnation" texturée, pas un aplat de couleur ou une photo compressée en fond plat.

### Source

- Image de référence fournie par l'utilisateur (générée via IA) : un coffre au trésor doré ciselé, un halo arc-en-ciel complet en arrière-plan, un ciel étoilé, un sol sombre avec un lit de reflets prismatiques - beaucoup de matière (dégradés, grain, lumière) avant conversion. Un aplat vectoriel simple ne donne rien une fois passé au dither : il faut cette matière en amont.
- Recadrée en paysage `1122 × 869 px` centrée sur le coffre, avec le début du halo et le sol texturé visibles.

### Transformation

Même recette Atkinson / Characters que les mains, appliquée via `ascii-magic.com/app` :

1. Couche `Dither` : `Atkinson`, palette `Mono 1-bit`, chroma `Luminance only`, pixel size `2`, strength `100`, contrast `122`, threshold `50`. Rend le coffre en silhouette sombre nette sur un ciel/sol texturé en dither clair, puis recoloré or `#e8d5b0` sur transparent (noir -> alpha 0) comme les mains.
2. Couche `Characters` : jeu `Standard` `@#S08Xx+=-;:.`, font size `7`, coverage `100`, edge emphasis `22`, dark threshold `24`, brightness `6`, contrast `100`. Contrairement à la recette des mains, cette couche **garde les couleurs d'origine** (or/orange chaud) au lieu d'être aplatie en une seule teinte : seule l'alpha est dérivée de la luminance (noir -> transparent), le RGB source est conservé pixel à pixel. C'est ce détail qui rend la texture riche plutôt que plate.
3. Les deux couches sont recadrées `cover` au ratio de la card (`700 × 900 px`) et compressées en PNG palette.

### Fichiers livrés

- `accompaniment-card-dither-atkinson-build.png` : couche Dither, or sur transparent, opacité `0.78` (`.guidance-ascii-dither`).
- `accompaniment-card-characters-build.png` : couche Characters couleur sur transparent, opacité `0.9` (`.guidance-ascii-characters` par défaut, mais montée ici car c'est la couche qui porte l'essentiel du détail).
- Rendues via `AsciiDitherAsset` avec `animated={false}` (le masque signal mobile est pensé pour un format paysage large, pas pour une card portrait étroite).

## Composant

`components/ui/ascii-dither-asset.tsx` généralise le rendu deux/trois couches transparentes utilisé par `hands-ascii-dither.tsx` et la card d'accompagnement, avec le CSS `.guidance-ascii-*` de `app/globals.css`.
