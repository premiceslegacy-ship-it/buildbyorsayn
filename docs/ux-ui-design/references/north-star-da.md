# North Star Direction Artistique

Cette référence définit la direction artistique permanente du skill. L'objectif n'est pas de faire "joli". L'objectif est de produire une sensation immédiate de maîtrise, de désirabilité et de simplicité.

## Synthèse

La DA cible : interfaces sombres, calmes, cinématiques, avec surfaces translucides, lumière douce, profondeur maîtrisée, imagerie premium et copywriting orienté bénéfice.

L'utilisateur doit ressentir en moins de 2 secondes :

```text
C'est premium.
C'est simple.
Je comprends quoi faire.
J'ai envie d'essayer.
```

## Inspirations structurantes

### Apple et les OS modernes

À retenir :

- clarté extrême de la hiérarchie ;
- composants arrondis, tactiles, respirants ;
- matériaux numériques : verre, blur, transparence, reflets ;
- animations courtes, naturelles, non démonstratives ;
- zéro bruit visuel ;
- chaque écran ressemble à un objet fini, pas à une collection de blocs.

À éviter :

- copier l'interface Apple littéralement ;
- confondre premium avec vide ;
- mettre du blur partout ;
- utiliser des icônes décoratives sans fonction.

### Perplexity et produits de recherche premium

À retenir :

- interface calme qui réduit la charge cognitive ;
- structure de lecture évidente ;
- confiance par la précision, pas par le spectacle ;
- navigation compacte, claire, presque invisible ;
- sensation de système intelligent qui accompagne sans pousser.

À éviter :

- froideur clinique ;
- pages trop textuelles ;
- gris moyen sans profondeur ;
- composants sans affordance.

### Références visuelles fournies

Les assets dans `assets/reference-board/` définissent le goût de base.

Observations à préserver :

1. Fonds sombres profonds : noir bleuté, graphite, bleu nuit, pas de gris plat.
2. Lumière atmosphérique : halos doux, brume, gradients profonds, reflets contrôlés.
3. Navigation capsule : floating, glass, arrondie, peu bruyante.
4. Hero cinématique : image forte, espace négatif, typographie massive mais calme.
5. Cards premium : grandes, arrondies, espacées, souvent portées par l'image.
6. Motion blur esthétique : sensation de vie, pas effet gadget.
7. Storytelling visuel : humain ou objet au centre, contexte immersif autour.
8. Copy court : une promesse immédiatement lisible.
9. CTA bas friction : verbe simple, bénéfice clair, forme tactile.
10. Modularité : sections en grille premium, pas en blocs SaaS génériques.

## Signature visuelle obligatoire

### 1. Fond

Utiliser un fond sombre avec profondeur :

```css
--bg-void: #05060a;
--bg-base: #080810;
--bg-deep: #0b1020;
--bg-elevated: #10111c;
--bg-cinematic-blue: #0c1728;
```

Jamais de fond blanc principal. Jamais de gris moyen comme base.

### 2. Lumière

La lumière doit sembler venir d'une source réelle : haut centre, haut gauche ou arrière-plan. Ne jamais disperser des glows sans logique.

Recettes :

```css
.radial-aurora {
  background:
    radial-gradient(circle at 50% 0%, rgba(96, 165, 250, 0.22), transparent 34%),
    radial-gradient(circle at 72% 18%, rgba(139, 92, 246, 0.16), transparent 30%),
    linear-gradient(180deg, #0b1020 0%, #05060a 100%);
}

.soft-vignette {
  box-shadow: inset 0 -160px 220px rgba(0, 0, 0, 0.78);
}
```

### 3. Typographie

Deux directions possibles :

- premium produit : Geist, Inter, Plus Jakarta Sans, Satoshi ;
- aspirationnel éditorial : Neue Montreal, Cabinet Grotesk, General Sans, Canela-like si disponible.

Règles :

- maximum 2 familles ;
- titres larges, tracking négatif ;
- corps lisible, jamais sous 16 px ;
- microcopy discrète mais lisible ;
- chiffres en tabular-nums.

### 4. Imagerie

Assets à privilégier :

- photo ou rendu cinématique, basse lumière, grain fin ;
- paysage abstrait ou spatial, mais crédible ;
- humain vu comme repère d'échelle, pas stock photo souriante ;
- objet premium isolé, lumière contrôlée ;
- formes liquides, reflets, verre, prisme, brume ;
- motion blur doux pour suggérer usage ou énergie.

Interdits :

- stock photo corporate ;
- illustrations cartoon ;
- mascottes génériques ;
- avatars IA trop lisses ;
- visuels avec doigts déformés, textes illisibles, détails incohérents ;
- photos trop lumineuses sans contraste.

## Recette de section hero premium

Un hero réussi suit cette structure :

```text
1. Fond cinématique ou gradient profond.
2. Navigation capsule glass en haut, max 5 liens.
3. Preuve ou contexte court au-dessus du titre.
4. Titre bénéfice en 5 à 9 mots.
5. Description qui clarifie le résultat, pas la technologie.
6. CTA principal orienté action + CTA secondaire de confiance.
7. Asset fort : device, scène, rendu, carte ou abstraction.
8. Gradient overlay pour garantir la lisibilité.
```

## Recette de grille premium

Utiliser pour sections features, preuves, use cases ou communauté.

```text
1. Une grande idée en titre.
2. Grille asymétrique 2 à 5 cards.
3. Une card visuelle dominante.
4. Une card preuve chiffrée.
5. Une card usage concret.
6. Une card CTA secondaire.
7. Images et surfaces cohérentes, pas de mosaïque aléatoire.
```

## Échelle de personnalité

Le rendu doit être :

- calme, pas passif ;
- futuriste, pas gadget ;
- luxueux, pas bling ;
- humain, pas stock ;
- précis, pas froid ;
- simple, pas pauvre ;
- immersif, pas confus.

## Anti AI slop

Refuser ou corriger immédiatement :

- gradients arc-en-ciel ;
- glow violet partout ;
- textes génériques comme "unlock your potential" ;
- cards identiques empilées sans hiérarchie ;
- icônes Lucide posées sans système ;
- visuels IA sans cohérence de lumière ;
- boutons tous au même niveau ;
- pages desktop pensées avant mobile ;
- hero avec trop de promesses ;
- témoignages inventés sans contexte ;
- trop d'effets de blur qui rendent le texte flou.
