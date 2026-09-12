# Atelier by Orsayn — Design System

Extrait directement du code de production (`app/styles.css`, `app/components/*.tsx`, `app/components/AtelierIcons.tsx`). Toutes les valeurs ci-dessous sont réelles, pas des approximations — c'est la référence à utiliser pour le produit, les assets marketing (vidéos, carrousels, decks, templates) et toute nouvelle page.

Structure du document, calquée sur une grammaire de référence (thèse → rôles de couleur → typographie → densité/formes → surfaces → composants → imagery → icônes → motion → responsive → provenance) plutôt que sur une liste plate de valeurs.

---

## 1. Thèse visuelle

**« Gomme dure sur papier crème. »**

Le système simule des objets physiques posés sur une page, pas des calques plats sur un écran. Trois signatures portent cette thèse :

1. **Le relief de gomme dure** : chaque bouton et chaque card repose sur une ombre-socle nette (`0 Npx 0 couleur`) qui simule une épaisseur — pas un flou diffus seul. Au clic, le bouton s'enfonce littéralement (`translateY`).
2. **Le double liseré** : à l'intérieur de presque toute surface bordée (bento, pricing, schémas, mockups, article-cards), un second trait très fin est en retrait de 5 à 8 px du bord extérieur — comme un écran dans un écran, ou un passe-partout autour d'une photo. C'est la signature la plus reconnaissable du système, présente sur les cards autant que sur les diagrammes.
3. **Un accent qui ne se dilue jamais** : l'orange est soit plein (bouton, dégradé chaud, chiffre clé), soit absent. Jamais une teinte pastel générique en fond de page.

Le hero et les sections dark (pricing, closing, dark mockups) portent les moments chromatiques forts. Le reste de la page revient à un socle crème/encre presque monochrome, où la preuve produit (mockup téléphone, flow-diagram, demo Sarah) fait le pont entre la promesse et l'outil réel.

---

## 2. Rôles de couleur

Deux couches : des **neutres papier** qui font tout le socle du site, et trois **accents sémantiques** — orange pour l'action, vert pour la validation, indigo réservé à un seul usage par page.

| Token | Valeur | Rôle |
|---|---|---|
| `--paper` | `#F7F4EE` | Fond global des pages claires. Jamais blanc pur. |
| `--ink` | `#080807` | Texte principal + fonds sombres (nav scrollée, footer, sections dark, phone mockup). |
| `--surface` | `#EEE8DF` | Fond des sections alternées (preuve marché, features métier, TOC mobile). |
| `--orange` | `#FF9F1C` | CTA primaire, accent de titre, métrique clé, halo actif. Couleur de marque n°1. |
| `--green` | `#B4F481` | Succès, validation, badge « vu », check de confirmation. |
| `--indigo` | `#6864ED` | Réservé à une seule carte par grille (bento « conformité », problem-card n°4). Ne jamais généraliser à un bouton ou un fond de page. |
| `--muted` | `#6E6A62` | Texte secondaire, sous-titres, légendes, unités. |
| `--line` | `rgba(8,8,7,.12)` | Bordures fines par défaut. |
| Ember (eyebrow) | `#8F4600` | Labels majuscules sur fond clair — plus sourd que l'orange pur, réservé au texte minuscule. |

Fonds de sections et cards spécifiques (jamais génériques, toujours nommés) :

| Contexte | Valeur |
|---|---|
| Section pricing (fond) | `#0B0B0A` — plus profond que `--ink` |
| Card pricing featured | `radial-gradient(circle at 50% -20%, rgba(255,140,20,.28), transparent 55%), linear-gradient(160deg, #241A0E, #121210 70%)` |
| Bloc "usage / add-on" pricing | `linear-gradient(135deg, #251A0E, #141412)` |
| Card bento orange | `linear-gradient(145deg, #FFF7EA, #F2D5A7)` |
| Card bento verte | `linear-gradient(145deg, #F4FFE9, #D9F5BD)` |
| Card bento indigo | `linear-gradient(145deg, #22213D, #5955C9)` |
| Closing / trade-cta (fond sombre chaud) | `radial-gradient(circle at 50% 62-68%, rgba(255,120,20,.27-.28), transparent 32-34%), linear-gradient(120deg, #120C08, #2D140B 58%, #090909)` |
| Erreur / retard (badge inline) | fond `#FFD9D9`, texte `#A01212` |

La couleur n'est jamais une texture de remplissage. Chaque dégradé chaud existe pour distinguer *une seule* carte dans une grille par ailleurs neutre — jamais toute la grille à la fois.

---

## 3. Typographie

Une seule famille pour tout : **Geist Variable** (`/fonts/geist-variable.woff2`, weight variable 100–900, chargée en `font-display: swap`). Pas de serif, pas de seconde police, pas de monospace visible. La hiérarchie se fait par la taille, un `letter-spacing` très négatif sur les gros titres, et le poids — jamais par un changement de famille.

> Note de build : `public/fonts/inter-latin.woff2` et `plus-jakarta-sans-latin.woff2` sont présents dans le dossier mais **non déclarés en `@font-face` et non référencés** dans le code — résidus à ignorer, pas des polices actives du système.

### Échelle

| Rôle | Taille | Tracking | Line-height | Poids |
|---|---|---|---|---|
| Hero H1 | `clamp(46px, 6.3vw, 90px)` | `-0.07em` | `.98` | ~600 |
| Closing H2 | `clamp(42px, 6vw, 78px)` | `-0.055em` | `1.09` | ~600 |
| Section H2 | `clamp(36px, 5vw, 68px)` | `-0.052em` | `1.09` | ~600 |
| Trade-hero H1 | `clamp(44px, 5.4vw, 74px)` | `-0.055em` | `1.05` | ~600 |
| Blog hero H1 | `clamp(48px, 7vw, 92px)` | `-0.058em` | `1.05` | ~600 |
| Card H3 (bento / pricing) | `clamp(23px, 2.3vw, 36px)` | `-0.042em` | `1.18` | ~600 |
| Body lead (hero, section) | `16–20px` | normal | `1.6–1.75` | 400, `--muted` |
| Metric / chiffre clé | `26–74px` selon contexte | `-0.05/-0.07em` | `.95` | `750` |
| Eyebrow (label) | `9–11px` | `+0.14/+0.18em` | `1.2` | `800`, uppercase, `#8F4600` (ou `--orange` sur fond sombre) |
| Bouton | `11–13px` | normal | `1` | `720` |
| Corps d'article (`.prose`) | `16px` | normal | `1.85` | 400, `#36332E` |

Règle : plus l'élément est grand (H1, closing), plus le tracking est négatif et le line-height serré. Plus il est petit (eyebrow, bouton, unité), plus le tracking devient positif et le poids monte. Le corps de texte ne descend jamais sous 12px pour la lecture continue (les légendes techniques à 8–10px restent réservées aux unités et labels courts).

---

## 4. Densité, spacing et formes

- Densité : confortable, jamais compacte — les bento cards ont `min-height: 380–440px` même pour peu de contenu.
- Container standard : `width: min(1280px, calc(100% - 48px))` — toujours au moins 24 px de marge.
- Gap entre sections : `.section { padding: 120px 0 }` desktop, `85px 0` en dessous de 800px.
- Padding de card majeure (bento, pricing, problem, feature) : `28–36px`.
- Gap de grille bento/problem/feature : `18px`.
- Grille bento : **12 colonnes, rythme asymétrique** (`7/5` puis `4/4/4`) — jamais une grille uniforme 3×3 ou 2×2 régulière. Le déséquilibre volontaire fait partie de la signature.

### Rayons

| Élément | Radius |
|---|---|
| Boutons, badges, pilules, eyebrow-pill | `999px` |
| Cards majeures (bento, pricing, hero container, problem, feature, closing/dark sections) | `28px` |
| Chips, panels secondaires (context-chip, demo-doc, article-card) | `16–24px` |
| Icon badges (bento icon, problem-num, feature icon) | `11–15px` |
| Simulateur IA (bloc dédié, volontairement plus carré) | `4px` — seule exception assumée à la règle des grands radius, pour signaler un module "outil" distinct du reste de la page |

Le système n'utilise jamais de radius à mi-chemin non documenté ici — toute nouvelle surface doit se raccrocher à l'une de ces cinq valeurs.

---

## 5. Surfaces, élévation et le double-liseré

Trois familles d'ombres cohabitent, jamais mélangées au hasard :

| Type | Exemple | Rôle |
|---|---|---|
| Ombre-socle dure | `0 4px 0 #A95800` (bouton), `0 6px 0 #B3AA9C` (pricing) | Relief physique — l'objet "repose" sur la page |
| Ombre diffuse | `0 22px 70px rgba(43,34,20,.06)` | Profondeur douce sous les cards, très peu opaque |
| Halo coloré | `0 0 0 12px rgba(255,159,28,.12)` | Accent autour d'un élément actif (mic, check, orb Sarah) |

### Le double-liseré (« double frame »)

C'est la signature la plus visible du système et son mécanisme le plus réutilisable. Sur toute card, mockup ou schéma déjà borduré, un second trait extrêmement fin est dessiné en retrait du bord extérieur — jamais collé dessus, jamais une double bordure CSS empilée (`border` + `outline`), toujours un `::before`/`::after` positionné en `inset` avec son propre radius réduit :

```css
.bento-card { position: relative; border-radius: 28px; /* ... */ }
.bento-card::before {
  content: "";
  position: absolute;
  inset: 7px;                              /* retrait du bord extérieur */
  border: 1px solid rgba(8,8,7,.06);        /* trait interne très sourd */
  border-radius: 21px;                      /* radius extérieur - retrait */
  pointer-events: none;
}
```

Règles d'application :
- Le retrait (`inset`) est proportionnel à la taille de la card : `4–5px` pour un petit chip (`demo-chip`, `demo-context`), `6–7px` pour une card standard, `8px` pour un très grand conteneur (mockup téléphone).
- Le radius interne est toujours `radius extérieur − retrait`, jamais une valeur arbitraire — la deuxième ligne doit rester concentrique à la première.
- Le trait est **quasi invisible en isolation** (`rgba(8,8,7,.06)` à `.08` sur fond clair, `rgba(255,255,255,.1)` à `.14` sur fond sombre) — il agit par répétition de forme, pas par contraste.
- `pointer-events: none` systématique — c'est un ornement, jamais une zone interactive.
- Sur les cards avec un fond dégradé foncé (bento indigo, pricing featured, demo-phone), la couleur du trait passe en blanc à faible opacité plutôt qu'en noir.

Familles de surfaces qui portent ce double-liseré dans le code actuel : `.bento-card`, `.flow-node--input`, `.flow-node--core`, `.proof-band__grid`, `.market-card`, `.problem-grid article`, `.feature-list article`, `.pricing-card`, `.pricing-choice`, `.pricing-usage`, `.section-cta`, `.lead-modal`, `.demo-doc`, `.demo-chip`, `.demo-context > div`, `.demo-phone`, `.article-card`.

Une bordure faible seule ne suffit jamais comme unique signal de structure : elle est toujours doublée soit par cette deuxième ligne interne, soit par l'ombre-socle — jamais un `border: 1px solid` isolé sur une grande surface.

---

## 6. Composants

### 6.1 Boutons

Trois variantes, toutes en **pilule** (`border-radius: 999px`), hauteur min `48px` (`44px` en `--small`).

**`.button--primary`** (action n°1)
```css
color: var(--ink);
border: 1px solid #D57806;
background: linear-gradient(180deg, #FFC56F 0%, #FFA51F 30%, #F38B08 100%);
box-shadow: inset 0 1px 0 rgba(255,255,255,.8), inset 0 -1px 0 rgba(97,43,0,.2),
            0 4px 0 #A95800, 0 12px 28px rgba(255,137,0,.22);
```

**`.button--dark`** (action n°2 sur fond clair)
```css
color: white;
border: 1px solid #050504;
background: linear-gradient(180deg, #3A3A37, #11110F 68%);
box-shadow: inset 0 1px 0 rgba(255,255,255,.22), 0 4px 0 #000, 0 12px 28px rgba(0,0,0,.2);
```

**`.button--ghost` / `.button--glass` / `.button--light`** (action n°2 sur fond sombre/image)
```css
color: white;
border: 1px solid rgba(255,255,255,.18);
background: linear-gradient(180deg, rgba(255,255,255,.15), rgba(255,255,255,.045));
backdrop-filter: blur(12px);
box-shadow: inset 0 1px 0 rgba(255,255,255,.16), inset 0 -1px 0 rgba(0,0,0,.45),
            0 3px 0 rgba(0,0,0,.5), 0 10px 24px rgba(0,0,0,.16);
```

Comportement commun : `hover → translateY(-1px)`, `active → translateY(3px)`, transition `.16s ease` sur transform/box-shadow/background/border-color. Icône SVG interne `17×17px`.

`.text-link` : lien texte simple, `13px/700`, `border-bottom: 1px solid var(--ink)` — pas de pilule, réservé aux actions tertiaires (voir historique, changer de mode).

### 6.2 Bento Card

La pièce la plus reconnaissable du système (section « Ce que ça change »). Coin très arrondi (`28px`), fond quasi-blanc chaud `#FFFDF9`, ombre-socle + ombre diffuse + double-liseré.

```css
.bento-card {
  padding: 32px;
  border: 1px solid var(--line);
  border-radius: 28px;
  background: #FFFDF9;
  box-shadow: inset 0 1px 0 rgba(255,255,255,.9), 0 3px 0 rgba(131,116,91,.1),
              0 22px 70px rgba(43,34,20,.06);
}
.bento-card::before { inset: 7px; border-radius: 21px; border: 1px solid rgba(8,8,7,.06); }
```

Structure de contenu constante, toujours dans cet ordre :
1. Icône badge (52 px, voir §8).
2. Eyebrow (label métier : « Devis », « Trésorerie », « Marge »…).
3. Titre engageant à la 2ᵉ personne (« Répondez avant que le client appelle ailleurs. »).
4. Phrase d'explication courte, `--muted`, 13 px.
5. **Métrique chiffrée en pied de carte** — toujours présente : `1 min`, `+18 %`, `45 → 12 j`, `1 vue`, `Factur-X`. C'est la preuve, jamais une simple promesse.

Trois cartes sur cinq portent un dégradé de couleur douce (orange, vert), une bascule en indigo foncé (texte blanc, eyebrow et paragraphe à 70 % d'opacité).

### 6.3 Autres familles de cards

**Proof-card** (bandeau chiffres clés en tête de page)
```css
border: 1px solid var(--line); border-left: 1px solid var(--line) /* sauf 1ère colonne */;
background: #FFFDF9; border-radius: 24px (conteneur), pas de radius individuel;
box-shadow: inset 0 1px 0 rgba(255,255,255,.9), 0 3px 0 rgba(131,116,91,.1), 0 22px 70px rgba(43,34,20,.06);
```
Le conteneur `.proof-band__grid` porte le double-liseré global ; chaque `.proof-card` est une colonne interne animée en `fade-up` au scroll. Chiffre en tête (`clamp(24px,2.4vw,34px)`, weight 750), micro-illustration SVG animée (horloge, facture, calendrier, avion papier), légende `--muted` en dessous.

**Flow-diagram / flow-node** (schéma « comment ça marche »)
- Trois zones : `flow-node--input` (bulle vocale gauche), `flow-node--core` (avatar Sarah, carré 148×148, fond `#14130F`, halo orange), `flow-node--output` (sorties : devis, relance, pointage, marge).
- Lignes de connexion SVG (`.flow-line`) avec un pulse orange animé qui voyage le long du tracé (`stroke-dasharray` + `dashoffset`).
- Double-liseré sur `--input` et `--core`, pas sur les petites pilules `--output` (trop petites pour porter l'effet sans le diluer).

**Market-card** (preuve marché / organismes de référence)
```css
padding: 30px 26px; border-radius: 22px; background: #FFFDF9;
box-shadow: inset 0 1px 0 rgba(255,255,255,.9), 0 3px 0 rgba(131,116,91,.1), 0 20px 55px rgba(43,34,20,.06);
```
Variante `.is-accent` : bordure et ombre-socle orange, dégradé chaud très léger — réservée à une seule carte par ligne pour souligner le chiffre le plus fort.

**Article-card** (journal/blog)
- Radius `24px`, fond blanc, image en `aspect-ratio: 1.55`, double-liseré sur toute la card (y compris par-dessus l'image).
- État hover **sans déplacement** : uniquement un raffermissement de la bordure et de l'ombre diffuse (`border-color` + `box-shadow`, `.2s ease`) — **pas de `translateY`**. Un hover qui fait "sauter" la carte a été volontairement retiré : la preuve produit doit rester stable au survol, l'accent va au contenu, pas à l'animation.

**Pricing-card / pricing-choice**
- Fond crème dégradé `linear-gradient(180deg, #FFFDF9, #F1EBE1)`.
- Ombre-socle épaisse : `0 5-6px 0 #B3AA9C` (le double du bento) — l'objet le plus « physique » du système, cohérent avec l'enjeu (décision d'achat).
- Double-liseré à `inset: 7px`.
- État sélectionné (`pricing-choice.is-selected`) : halo radial orange + badge check flottant (`::after`, `content: "✓"`) — le double-liseré (`::before`) et le badge (`::after`) cohabitent sans conflit de pseudo-élément.
```css
.pricing-choice.is-selected {
  border-color: #D57806;
  background: radial-gradient(circle at 50% -30%, rgba(255,159,28,.24), transparent 55%),
              linear-gradient(180deg, #FFF8EC, #F3E5CD);
  box-shadow: inset 0 1px 0 white, 0 6px 0 #B07A2A, 0 35px 90px rgba(255,137,0,.18);
}
```

### 6.4 Demo shell (mockup produit — la preuve dans le hero sombre)

C'est l'équivalent Atelier du « Documentation Product Card » de la référence Mintlify : le produit réel mis en scène dans une section sombre, pas une abstraction.

- `.demo-phone` : conteneur téléphone, radius `40px`, fond `linear-gradient(160deg,#222229,#0e0e10)`, double-liseré blanc `inset: 7px` / radius `33px`.
- `.demo-sidebar` : navigation à étapes (01–04), état actif = fond blanc 6 %, bordure blanche 10 %.
- `.demo-conversation` : contenu qui change selon l'étape active, fond `--paper`, transition `fade-up`.
- `.demo-doc`, `.demo-chip` : mini-cards internes (facture, contexte client) avec leur propre double-liseré à `inset: 4-5px`.
- `.demo-context` (colonne droite, glass sur fond sombre) : chaque item a son double-liseré en blanc à 10 % d'opacité.

### 6.5 Eyebrow

- Rôle : angle ou catégorie, jamais un titre.
- `10–11px`, `800`, uppercase, `letter-spacing: .14–.18em`, couleur `#8F4600` sur fond clair / `--orange` ou `#FFB95D` sur fond sombre.
- Toujours suivi d'un titre plus grand — jamais seul.

### 6.6 Formulaire (lead capture)

- Champs : `min-height: 46px`, radius `14px`, bordure `--line`, focus → bordure orange + halo `0 0 0 3px rgba(255,159,28,.18)`.
- Checks/pills de choix (`.lead-form__check`) : pilule, état coché → bordure et fond orange doux.
- Modale (`.lead-modal`) : radius `28px`, double-liseré `inset: 7px`, fermeture en bouton rond skeuomorphe.

---

## 7. Glass & skeuomorphisme léger

Sur fond sombre, le système bascule en **verre dépoli** : bordures blanches à ~13 % d'opacité, fond en dégradé blanc quasi-transparent, `backdrop-filter: blur(14px)`. Jamais de flou seul — toujours associé à une ombre interne haute (highlight) et une ombre externe basse (profondeur), et désormais au double-liseré blanc quand la surface est assez grande pour le porter.

```css
/* Glass sur fond sombre (context-chip, demo-context) */
background: linear-gradient(170deg, rgba(255,255,255,.1), rgba(255,255,255,.03));
backdrop-filter: blur(14px);
box-shadow: inset 0 1px 0 rgba(255,255,255,.16), inset 0 -1px 0 rgba(0,0,0,.4),
            0 14px 34px rgba(0,0,0,.32);

/* Glass sur fond clair (proof-card, phrase-core) */
background: linear-gradient(170deg, rgba(255,255,255,.88), rgba(255,255,255,.56));
backdrop-filter: blur(20px) saturate(1.4);
```

La **saturation boostée** (`saturate(1.4)`) sur les glass clairs donne l'effet « verre » plutôt qu'un flou gris plat.

---

## 8. Icônes

Deux registres séparés, jamais mélangés au même endroit :

### 8.1 Icônes fonctionnelles — Lucide

Bibliothèque [Lucide](https://lucide.dev), trait fin par défaut. Réservée à la navigation, aux boutons et à l'UI utilitaire (menu, fermer, flèche, check générique, chevron). Jamais d'icônes pleines, jamais d'émojis.

Utilisées dans le code : `ArrowRight`, `Check`, `ChevronDown`, `MessageCircle`, `Mic`, `Play`, `RefreshCw`, `Menu`, `X`.

### 8.2 Icônes de marque — set maison « feutre »

Fichier source : `app/components/AtelierIcons.tsx`. Un système d'illustration entièrement custom pour les bénéfices métier (bento cards, feature-list, problem-cards) — jamais remplacé par une icône Lucide générique dans ce contexte.

Règle de dessin, valable pour toute nouvelle icône du set :
- `viewBox="0 0 48 48"` (`0 0 64 64` pour les micro-illustrations animées du bandeau preuve).
- Un seul trait encre `#161613` (`STROKE`) pour la forme principale — `stroke-width` entre `1.4` et `1.7`, `strokeLinecap="round"`, `strokeLinejoin="round"`.
- **Un unique accent orange `#FF9F1C` (`ACCENT`)** par icône, jamais plus — toujours le détail qui porte le sens (le check du devis validé, l'étincelle de la relance, l'aiguille de l'horloge, la flèche de tendance).
- Pas de fond, pas de forme pleine (sauf les micro-badges d'état des `proof-illu`, qui sont animés et non statiques), pas de halo — le dessin seul, comme un croquis technique.
- `aria-hidden="true"` systématique — l'icône est décorative, le texte adjacent porte l'information.

Inventaire actuel : `IconDevis`, `IconRelance`, `IconPointage`, `IconMarge`, `IconCalendrier`, `IconConformite`, `IconChantier`, `IconTresorerie`, `IconVoix`, `IconPropose`, `IconApprend`, `IconEquipe`, plus quatre micro-illustrations animées (`ProofClock`, `ProofInvoice`, `ProofCalendarCheck`, `ProofSent`) utilisées uniquement dans le bandeau de preuve en tête de page.

### 8.3 Badges d'icône (containers)

Les icônes ne flottent jamais nues dans une card — elles vivent dans un badge skeuomorphe qui répète la logique du double-liseré à petite échelle :

```css
/* bento-card__icon — 52×52px, radius 15px */
width: 52px; height: 52px;
border: 1px solid rgba(8,8,7,.14);
border-radius: 15px;
background: linear-gradient(145deg, rgba(255,255,255,.96), rgba(237,232,223,.78));
box-shadow: inset 0 1px 0 white, inset 0 -1px 0 rgba(8,8,7,.08),
            0 4px 0 rgba(88,76,58,.16), 0 11px 24px rgba(42,35,24,.09);
```
```css
/* bento-card__icon::after — le double-liseré miniature */
inset: 5px; border: 1px solid rgba(255,255,255,.72); border-radius: 10px;
```

| Contexte | Container | Détail |
|---|---|---|
| Icône de bento-card | `52×52px`, radius `15px` | Dégradé blanc→beige + double-liseré interne + ombre posée |
| Numéro de problem-card (`.problem-num`) | `40×40px`, radius `12px` | Même famille, contenu = chiffre plutôt qu'icône |
| Bouton micro (voix) | `54×54px`, cercle | Dégradé orange + halo `0 0 0 12px rgba(255,159,28,.12)` |
| Check de validation | `62×62px`, cercle | Dégradé vert, même logique de halo |
| Icône inline (liste `.pricing-card li svg`) | `19×19px` dans badge radius `7px` | Fond vert clair, bordure verte foncée |

---

## 9. Imagery

Deux registres très séparés, comme la thèse le prescrit.

### Zones à moment expressif (hero, dark sections)
- Avatar Sarah : illustration métier (casque, gilet), cadrée dans un container sombre à halo orange — la seule « présence humaine » dessinée du système.
- Sections dark (pricing, closing, trade-cta) : dégradés radiaux chauds sur fond quasi-noir, jamais de photo.
- Le mockup téléphone (`.demo-phone`) est la pièce qui « déborde » visuellement de la section sombre vers le contenu clair — c'est la preuve produit mise en scène.

### Contenu inférieur (sobre, presque monochrome)
- Images hero chantier : `public/brand/hero-chantier-v2.avif` / `.webp`.
- Photos d'articles de blog : `aspect-ratio: 1.55`, `object-fit: cover`.
- Logos d'organismes de référence (Qualibat, etc.) : niveaux de gris, `opacity: .55`, repassent en couleur au hover (`filter: grayscale(0)`), défilement marquee continu.
- Aucun rendu 3D abstrait, aucun motif géométrique décoratif gratuit, aucun gradient générique hors des zones nommées en §2.

---

## 10. Layout et rythme de page

- Hero : navigation flottante transparente puis blanche/floutée au scroll (`.site-header.is-scrolled`), headline centrée, CTA sous le message principal, grille de fond en pointillés très légère (`opacity: .5`, mask radiale).
- Container central `1280px` sous le hero, marge mini `24px`.
- Sections « habillées » (dark, pricing, closing) : pleine largeur avec `border-radius: 28px`, comme des cartes géantes plutôt que des bandeaux plats.
- Grille bento : 12 colonnes, rythme `7/5` puis `4/4/4` — jamais uniforme.
- Alternance constante : titre centré ou split → paragraphe → grille de cards → bande de preuve/logos → section dark → répète.
- FAQ et pages métier : deux colonnes asymétriques (`.8fr 1.2fr` ou `.6fr 1fr`), jamais de grille dense éditoriale.

---

## 11. Motion et comportement dynamique

Chaque animation du système a un rôle précis et documenté — rien n'est ajouté « parce que la page semble vide ».

| Élément | Trigger | Propriété | Durée / easing | Note |
|---|---|---|---|---|
| Boutons | hover / active | `transform`, `box-shadow` | `.16s ease` | lift `-1px` au hover, enfoncement `+3px` au clic |
| `.pricing-choice` | hover / active | `transform`, `box-shadow` | `.18s` | même logique gomme dure, amplitude plus grande (carte de décision) |
| `.article-card` | hover | `box-shadow`, `border-color` uniquement | `.2s ease` | **pas de `transform`** — volontairement retiré, voir §6.3 |
| Proof-band cards | scroll (IntersectionObserver) | `opacity`, `transform: translateY` | `.4-.5s cubic-bezier(.2,.8,.2,1)` | apparition une seule fois (`is-visible`), pas de replay |
| Micro-illustrations preuve (horloge, facture, calendrier, avion) | scroll (même trigger que ci-dessus) | `transform`, `stroke-dashoffset`, `opacity` | `.3-1.1s`, spring `cubic-bezier(.34,1.56,.64,1)` sur les micro-checks | seul endroit du système où un léger overshoot/bounce est assumé — sur un check qui apparaît, pas sur un hover |
| Flow-diagram lignes | auto, en boucle | `stroke-dashoffset` | `2.8s linear infinite`, décalage `1.4s` entre les deux tracés | simule un flux continu de données |
| Demo Sarah (étapes 01–04) | auto (timer JS) ou clic manuel | contenu + `fade-up` | durée par étape `5.2–7.2s` | s'arrête si `prefers-reduced-motion` |
| Logos partenaires | auto, en boucle | `transform: translateX` | `24s linear infinite` (`20s` mobile) | marquee, `mask-image` en fondu sur les bords |
| Reduced motion | media query | toutes | `.01ms` | `@media (prefers-reduced-motion: reduce)` coupe toutes les durées sauf le marquee, explicitement mis à `animation: none` |

Règle de fond : un hover qui déplace verticalement une card entière (« bounce ») est réservé aux surfaces où l'utilisateur prend une décision active (pricing) — jamais sur du contenu de lecture passive (articles, logos, bento). Sur ces dernières, l'état hover se signale par la bordure et l'ombre, pas par le mouvement.

---

## 12. Accessibilité et responsive

- Focus visible : `outline: 3px solid var(--orange)`, offset `3px`, sur tous les éléments interactifs.
- `prefers-reduced-motion: reduce` : toutes les durées d'animation et de transition tombent à `.01ms`, le marquee logos s'arrête.
- Icônes toujours `aria-hidden="true"` quand décoratives, jamais seules comme unique porteuse de sens (toujours accompagnées d'un label texte).
- Breakpoints : `1180px` (nav → menu mobile, bento passe à 2 colonnes), `800px` (sections en pile, grilles horizontales en scroll-snap pour pricing/articles, CTA WhatsApp flottant mobile-only).
- Contraste : texte courant toujours `--ink` sur `--paper` (ratio élevé) ; le texte `--muted` (`#6E6A62`) réservé aux légendes et jamais utilisé pour un contenu porteur de sens critique.
- Touch targets : boutons `min-height: 44-48px` systématique, y compris en variante `--small`.

---

## 13. Do / Don't

**Do**
- Utiliser Geist Variable partout, hiérarchie par taille/poids/tracking uniquement.
- Réserver l'orange plein aux CTA, chiffres clés et un seul accent de titre par phrase forte.
- Doubler chaque bordure de card/mockup/schéma d'un liseré interne en retrait (`inset` proportionnel, radius concentrique).
- Garder l'icône maison (« feutre », un seul accent orange) pour tout bénéfice métier ; Lucide pour l'UI utilitaire uniquement.
- Fermer chaque bénéfice sur une preuve chiffrée vérifiable (`1 min`, `+18 %`, `45 → 12 j`).
- Garder les hovers de lecture passive (articles, logos) statiques en position — bordure/ombre seulement.

**Don't**
- Ne pas ajouter de seconde police ni de famille display séparée.
- Ne pas transformer l'indigo en couleur généralisable — une seule carte par grille maximum.
- Ne pas empiler `border` + `outline` pour le double-liseré : toujours un pseudo-élément en `inset`.
- Ne pas faire « sauter » (`translateY` au hover) une card de contenu passif — c'était le cas des article-cards, volontairement retiré.
- Ne pas mélanger icônes Lucide et icônes maison dans une même famille de composants.
- Ne pas ajouter d'ombre diffuse forte à la place du double-liseré — la seconde ligne fine reste le signal principal, l'ombre reste discrète.
- Ne pas utiliser une bordure faible isolée comme unique signal de structure sur une grande surface.

---

## 14. Provenance et assets de référence

- Police : `public/fonts/geist-variable.woff2` (Geist Variable, licence dans `GEIST-LICENSE.txt`).
- Logo : `public/logo-atelier-blanc.png`.
- Images hero : `public/brand/hero-chantier-v2.avif` / `.webp`.
- Icônes de marque : `app/components/AtelierIcons.tsx` (source de vérité, pas de fichier `.svg` externe — tout est en JSX inline).
- Icônes utilitaires : package `lucide-react`.
- Screenshots à jour : `artifacts/screenshots/` (à régénérer si le contenu change — vérifier la date avant réutilisation).

**Fichier source de vérité pour toute mise à jour future de ce document : `app/styles.css` + `app/components/AtelierIcons.tsx`.** Ce document est une extraction, pas une spécification indépendante — en cas de divergence entre ce fichier et le code, le code fait foi et ce document doit être régénéré.
