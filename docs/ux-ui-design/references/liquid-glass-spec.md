# Liquid Glass Spec

Liquid Glass est un matériau, pas un effet décoratif. Il doit donner une impression de surface physique : transparence contrôlée, bord lumineux, profondeur, reflet, interaction.

## Principe de base

Un composant Liquid Glass n'existe que si 4 conditions sont réunies :

1. Fond sombre ou image sombre derrière lui.
2. Contraste suffisant pour lire le contenu.
3. Bord ou reflet qui définit la surface.
4. Rôle UX clair : navigation, CTA, panel, input, tooltip, modal, card active.

Si une condition manque, utiliser une surface dark elevated plutôt qu'un glass panel.

## Layer stack obligatoire

Construire les écrans avec cette pile :

```text
Layer 0 : fond near-black ou image cinématique.
Layer 1 : lumière atmosphérique, radial gradients, vignette.
Layer 2 : surfaces principales dark elevated.
Layer 3 : surfaces Liquid Glass pour navigation, CTA, cards actives.
Layer 4 : bordures, reflets, highlights, glows contrôlés.
Layer 5 : texte, icônes, actions.
```

Ne jamais placer 6 cards glass identiques au même niveau. Le glass sert à hiérarchiser.

## Tokens de matériau

```css
:root {
  --glass-fill-soft: rgba(255, 255, 255, 0.045);
  --glass-fill: rgba(255, 255, 255, 0.065);
  --glass-fill-strong: rgba(255, 255, 255, 0.095);

  --glass-stroke-soft: rgba(255, 255, 255, 0.08);
  --glass-stroke: rgba(255, 255, 255, 0.14);
  --glass-stroke-strong: rgba(255, 255, 255, 0.24);

  --glass-highlight: rgba(255, 255, 255, 0.36);
  --glass-highlight-soft: rgba(255, 255, 255, 0.16);
  --glass-inner-shadow: rgba(255, 255, 255, 0.05);

  --glass-blur-sm: 12px;
  --glass-blur-md: 20px;
  --glass-blur-lg: 28px;
  --glass-saturation: 165%;

  --glass-shadow-sm: 0 8px 24px rgba(0, 0, 0, 0.28);
  --glass-shadow-md: 0 18px 48px rgba(0, 0, 0, 0.42);
  --glass-shadow-lg: 0 32px 80px rgba(0, 0, 0, 0.58);

  --accent-primary: #8b5cf6;
  --accent-glow: rgba(139, 92, 246, 0.22);
}
```

## Classe de base

```css
.liquid-glass {
  position: relative;
  overflow: hidden;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.075), rgba(255, 255, 255, 0.035));
  border: 1px solid var(--glass-stroke);
  box-shadow:
    inset 0 1px 0 var(--glass-highlight-soft),
    inset 0 -1px 0 rgba(255, 255, 255, 0.035),
    var(--glass-shadow-md);
  backdrop-filter: blur(var(--glass-blur-md)) saturate(var(--glass-saturation));
  -webkit-backdrop-filter: blur(var(--glass-blur-md)) saturate(var(--glass-saturation));
}

.liquid-glass::before {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  background:
    radial-gradient(circle at 20% 0%, rgba(255, 255, 255, 0.18), transparent 28%),
    linear-gradient(110deg, transparent 0%, rgba(255, 255, 255, 0.06) 42%, transparent 56%);
  opacity: 0.55;
}

.liquid-glass::after {
  content: "";
  position: absolute;
  inset: 1px;
  pointer-events: none;
  border-radius: inherit;
  border: 1px solid rgba(255, 255, 255, 0.045);
}
```

## Fallback obligatoire

```css
@supports not ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px))) {
  .liquid-glass {
    background: rgba(18, 18, 31, 0.92);
  }
}
```

## Recettes par composant

### Navigation capsule

Usage : desktop nav, floating top bar, mobile bottom nav si nécessaire.

```css
.nav-glass {
  height: 56px;
  padding: 0 10px;
  border-radius: 9999px;
  background: rgba(12, 16, 28, 0.62);
  border: 1px solid rgba(255, 255, 255, 0.14);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.18),
    0 18px 60px rgba(0, 0, 0, 0.42);
  backdrop-filter: blur(24px) saturate(160%);
}

.nav-glass a {
  min-height: 40px;
  padding: 0 16px;
  border-radius: 9999px;
  color: rgba(255, 255, 255, 0.72);
}

.nav-glass a[data-active="true"] {
  color: #ffffff;
  background: rgba(255, 255, 255, 0.10);
}
```

Critères : max 5 liens, libellés courts, logo au centre ou à gauche, CTA séparé si conversion prioritaire.

### Bouton glass premium

```css
.button-glass {
  min-height: 44px;
  padding: 0 18px;
  border-radius: 9999px;
  background: rgba(255, 255, 255, 0.07);
  border: 1px solid rgba(255, 255, 255, 0.16);
  color: #ffffff;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.18),
    0 10px 28px rgba(0, 0, 0, 0.32);
  backdrop-filter: blur(18px) saturate(165%);
  transition: transform 180ms ease-out, border-color 180ms ease-out, background 180ms ease-out, box-shadow 180ms ease-out;
}

.button-glass:hover {
  transform: translateY(-1px) scale(1.01);
  background: rgba(255, 255, 255, 0.105);
  border-color: rgba(255, 255, 255, 0.28);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.28),
    0 0 24px var(--accent-glow),
    0 16px 36px rgba(0, 0, 0, 0.42);
}

.button-glass:active {
  transform: scale(0.98);
}

.button-glass:focus-visible {
  outline: 2px solid var(--accent-primary);
  outline-offset: 3px;
}
```

### Primary CTA

Primary ne veut pas toujours dire couleur pleine. Dans cette DA, le primary peut être :

- accent filled si l'action doit être très visible ;
- glass strong si l'écran est très cinématique ;
- white filled sur fond très sombre pour un luxe minimal.

```css
.button-primary {
  min-height: 46px;
  padding: 0 20px;
  border-radius: 9999px;
  background: #ffffff;
  color: #05060a;
  font-weight: 650;
  box-shadow: 0 0 36px rgba(255, 255, 255, 0.16), 0 18px 48px rgba(0, 0, 0, 0.42);
}
```

### Card Liquid Glass

```css
.card-glass {
  border-radius: 24px;
  padding: 24px;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.065), rgba(255, 255, 255, 0.035));
  border: 1px solid rgba(255, 255, 255, 0.11);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.13),
    0 24px 72px rgba(0, 0, 0, 0.48);
  backdrop-filter: blur(22px) saturate(155%);
}

.card-glass:hover {
  transform: translateY(-2px);
  border-color: rgba(255, 255, 255, 0.20);
}
```

Utiliser les cards glass pour :

- feature card dominante ;
- preuve sociale ;
- widget produit ;
- input group ;
- testimonial ;
- module de pricing.

Ne pas utiliser pour toutes les sections à la fois.

### Input glass

```css
.input-glass {
  min-height: 48px;
  padding: 0 16px;
  border-radius: 9999px;
  background: rgba(255, 255, 255, 0.055);
  border: 1px solid rgba(255, 255, 255, 0.14);
  color: #ffffff;
  backdrop-filter: blur(16px) saturate(150%);
}

.input-glass::placeholder {
  color: rgba(255, 255, 255, 0.42);
}

.input-glass:focus-visible {
  outline: none;
  border-color: rgba(139, 92, 246, 0.72);
  box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.18);
}
```

### Hero image overlay

Tout texte sur image doit avoir un overlay.

```css
.hero-overlay {
  background:
    linear-gradient(180deg, rgba(5, 6, 10, 0.08) 0%, rgba(5, 6, 10, 0.72) 82%, rgba(5, 6, 10, 0.96) 100%),
    radial-gradient(circle at 50% 12%, rgba(255, 255, 255, 0.12), transparent 32%);
}
```

## Densité et radius

Règles par défaut :

```text
Nav capsule : 9999 px
Boutons : 9999 px
Inputs : 9999 px ou 14 px selon produit
Cards petites : 18 px
Cards moyennes : 22 à 24 px
Panels hero : 28 à 32 px
Modals : 24 à 28 px
Images : 20 à 28 px
```

Ne pas mélanger plus de 3 familles de radius dans une interface.

## Blur par device

```text
Desktop nav : 20 à 28 px
Desktop card : 16 à 24 px
Desktop modal : 24 à 32 px
Mobile nav : 12 à 18 px
Mobile card : 10 à 16 px
Mobile modal : 16 à 22 px
```

Sur mobile, limiter le nombre de surfaces avec backdrop-filter visibles simultanément.

## Animation Liquid Glass

Durée maximale : 300 ms.

```css
.premium-motion {
  transition:
    transform 180ms ease-out,
    opacity 180ms ease-out,
    border-color 180ms ease-out,
    background 180ms ease-out,
    box-shadow 220ms ease-out;
}

.fade-up {
  animation: fade-up 260ms cubic-bezier(0.16, 1, 0.3, 1) both;
}

@keyframes fade-up {
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: translateY(0); }
}
```

Autorisé : lift 1 à 2 px, scale 1.01 à 1.02, press scale 0.98, shimmer loading, glow au hover sur CTA principal.

Interdit : rotation continue, clignotement, parallax mobile, animation qui bloque le scroll.

## Accessibilité

Règles renforcées :

- texte principal : viser 7:1 ;
- texte secondaire : minimum 4.5:1 ;
- bord d'input et focus : minimum 3:1 ;
- focus visible sur tous les interactifs ;
- overlay obligatoire sur image ;
- ne jamais mettre du texte à opacité 0.35 s'il contient une information utile.

## Diagnostic rapide

Un composant Liquid Glass est mauvais si :

- on ne voit pas son bord ;
- le texte perd en lisibilité ;
- le blur donne un effet sale ;
- le composant flotte sans logique ;
- la surface est identique à toutes les autres ;
- l'effet ne se voit pas sur mobile ;
- le rendu ressemble à un template SaaS générique.
