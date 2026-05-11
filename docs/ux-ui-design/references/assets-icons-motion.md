# Assets, Icons et Motion Premium

Ce fichier guide la production d'assets visuels, d'icônes personnalisées et d'animations. Le but : retenir l'attention sans créer de bruit.

## Assets premium

Un asset premium n'est pas une image décorative. Il doit renforcer la compréhension, le désir ou la preuve.

### Types d'assets à privilégier

```text
Hero cinematic : grand visuel immersif, lumière directionnelle, profondeur.
Device in hand : produit crédible, usage tangible, émotion contrôlée.
Abstract product object : forme 3D ou matière qui symbolise le système.
Data landscape : lignes, points, flux, mais sobre et lisible.
Editorial human : personne réelle ou silhouette, jamais pose corporate.
Motion blur card : sensation de mouvement, utile pour réseaux sociaux ou apps.
```

### Prompt image premium

```text
[Subject] in a dark cinematic environment, soft directional light, subtle glass reflections, premium technology aesthetic, shallow depth of field, fine film grain, calm composition, negative space for typography, deep navy and graphite background, realistic materials, no cartoon, no generic stock photo, no oversaturated colors, no text in image
```

Adapter le sujet au projet. Toujours prévoir un espace pour titre ou CTA si l'image sert une landing ou une ad.

### Contrôle qualité asset

```text
La lumière est cohérente avec l'interface.
Le sujet est lisible en petit format mobile.
L'image a un point focal clair.
L'image peut recevoir un overlay sans devenir sale.
Le rendu ne ressemble pas à une image IA générique.
Les détails anatomiques, textes et objets sont crédibles.
```

## Images qui retiennent l'attention

Pour arrêter le scroll, préférer la tension visuelle au bruit.

Tensions efficaces :

```text
Humain minuscule face à un espace immense.
Objet simple dans une lumière impossible.
Main ou geste avec mouvement flou contrôlé.
Surface liquide, verre, prisme, reflet.
Système complexe rendu calme et lisible.
Avant/après visuel sans explication longue.
```

Interdits :

```text
Personnes qui sourient face caméra sans contexte.
Laptop posé sur bureau générique.
Mockup flottant sans profondeur.
Abstraction 3D violette vue mille fois.
Image trop détaillée qui écrase le texte.
Visuel sans rapport avec la promesse.
```

## Iconographie premium personnalisée

Utiliser Lucide seulement comme base rapide. Pour un rendu premium, définir une famille d'icônes propre au projet.

### Spécification par défaut

```text
Grid : 24 x 24 px.
Stroke : 1.5 px pour luxe discret, 2 px pour app plus robuste.
Caps : round par défaut.
Joins : round par défaut.
Style : monoline, géométrique, inspiré SF Symbols, non cartoon.
Complexité : 2 à 4 formes maximum par icône.
Optical correction : ajuster à l'oeil, pas seulement mathématiquement.
```

### Règles

```text
Une seule famille d'icônes par produit.
Pas d'emoji utilisé comme pictogramme.
Pas de mélange outline et filled sans règle.
Pas d'icône juste pour remplir un vide.
Pas d'icône avec détails invisibles en 20 px.
Toujours aligner verticalement icône et texte.
```

### Prompt de création d'icônes

```text
Create a custom premium monoline icon set for [project]. 24px grid, [1.5px or 2px] stroke, rounded caps, rounded joins, geometric proportions, inspired by modern operating system symbols and fintech interfaces, minimal, precise, no cartoon style, no emoji, no filled illustration, consistent optical weight. Icons needed: [list]. Export as SVG paths with consistent viewBox.
```

### Conteneurs d'icônes

Dans cette DA, les icônes peuvent être placées dans des capsules ou carrés arrondis glass.

```css
.icon-shell {
  width: 40px;
  height: 40px;
  border-radius: 14px;
  display: grid;
  place-items: center;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.12);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.14);
  backdrop-filter: blur(16px) saturate(150%);
}
```

## Motion premium

Une animation premium réduit l'effort de compréhension. Elle ne cherche pas à se faire remarquer.

### Durées

```text
Hover : 120 à 180 ms.
Press : 80 à 120 ms.
Dropdown : 160 à 220 ms.
Modal : 220 à 280 ms.
Page section reveal : 240 à 300 ms.
Loading shimmer : 1200 à 1800 ms en boucle, uniquement sur skeleton.
```

### Easing

```css
--ease-premium: cubic-bezier(0.16, 1, 0.3, 1);
--ease-hover: cubic-bezier(0.22, 1, 0.36, 1);
--ease-press: cubic-bezier(0.4, 0, 0.2, 1);
```

### Patterns autorisés

```text
Fade-up unique au scroll.
Button lift de 1 à 2 px.
Scale hover maximum 1.02.
Press scale 0.98.
Glass highlight qui suit légèrement le hover sur desktop.
Skeleton shimmer pendant chargement.
Accordion height + opacity, sans retard long.
Modal backdrop blur + fade court.
```

### Patterns interdits

```text
Rotation continue.
Clignotement.
Bounces enfantins.
Parallax mobile.
Animations qui empêchent de cliquer.
Intro longue avant d'accéder au contenu.
Effets déclenchés partout au scroll.
```

## Reduced motion

Toujours prévoir une version réduite.

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 1ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 1ms !important;
    scroll-behavior: auto !important;
  }
}
```

## Responsive motion

```text
Desktop : parallax léger autorisé, max 20 px.
Tablet : limiter aux transitions et reveal.
Mobile : pas de parallax, pas de hover dépendant, feedback press prioritaire.
```
