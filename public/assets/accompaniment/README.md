# Asset ASCII / Dither des mains

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
