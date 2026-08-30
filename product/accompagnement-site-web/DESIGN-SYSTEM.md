# Design system : Site Web by AI

## Statut et provenance

Version : 1.0

Surface : page d'offre et espace de progression BUILD.

Référence visuelle fournie : `Identité Visuelle/DA/f53bd06f88ecd3ef7d0d8c24f558af42.jpg`.

Toutes les valeurs dérivées de la photographie sont `inférées`. Les valeurs présentes dans le code sont des décisions `proposées`, puis calibrées sur les routes réelles. Elles ne sont pas présentées comme les tokens exacts de la référence.

## Thèse visuelle

Un système calme apparaît dans la brume. L'accompagné passe d'un territoire intuitif et diffus à une chaîne d'exécution lisible, sans perdre la créativité ni l'émotion.

## Ce qui est repris comme mécanisme

- Une lumière laiteuse et froide traverse un fond profond.
- Le display serif apporte l'imagination et l'éditorial.
- Le sans serif apporte la méthode et l'interface.
- Un objet humain ou central est remplacé par un objet de progression, afin de lier l'émotion à la fonction du produit.
- Le bouton clair, presque nacré, concentre l'action.
- Le grain empêche l'univers de devenir un gradient SaaS parfaitement lisse.

## Ce qui n'est pas copié

- Aucun nuage, personnage, slogan, composition ou badge Colab n'est repris.
- L'image source n'est pas utilisée dans le produit.
- Le hero n'imite pas son placement exact.
- La palette est refroidie et assombrie pour rester dans l'univers Orsayn.

## Tokens de couleur

| Token | Valeur proposée | Rôle |
|---|---:|---|
| `canvas.base` | `#0b1117` | Fond principal, silence et contraste |
| `canvas.elevated` | `#101920` | Section ou couche fonctionnelle |
| `surface.glass` | `rgba(229, 237, 238, 0.07)` | Surface élevée rare |
| `surface.input` | `rgba(0, 0, 0, 0.20)` | Saisie et zones éditables |
| `text.primary` | `#f1ece4` | Titres et informations principales |
| `text.body` | `#b8c2c9` | Corps long |
| `text.muted` | `#8d9aa3` | Détails et métadonnées |
| `line.subtle` | `rgba(255, 255, 255, 0.08)` | Séparation structurelle |
| `accent.ice` | `#d5e1e6` | Focus, lumière et statut actif |
| `action.background` | `#e5eceb` | Action principale |
| `action.text` | `#172027` | Texte sur action principale |
| `editorial.paper` | `#edf0eb` | Section claire de la timeline |

Le bleu froid est une lumière et un état, jamais un second CTA dominant.

## Typographie

### Display

Pile actuelle : `Iowan Old Style`, `Baskerville`, `Times New Roman`, serif.

Rôle : titres éditoriaux, grandes transitions et expression de l'idée.

Règles :

- tracking de `-0.04em` à `-0.055em` sur les grands titres ;
- line-height de `0.88` à `1.02` selon la longueur ;
- aucune capitale intégrale en display ;
- largeur de ligne bornée pour éviter un mur typographique ;
- sur mobile, taille fluide et saut de ligne naturel, jamais une copie compressée du desktop.

### Interface et corps

Inter, via `next/font`, avec fallbacks système.

Rôle : navigation, actions, corps, preuves et saisie.

Règles :

- corps de 14 à 18 px selon la surface ;
- ligne de 1.5 à 1.75 ;
- labels de 10 à 11 px seulement pour des métadonnées non essentielles ;
- tracking des labels de `0.16em` à `0.26em` ;
- aucune information décisive à moins de 12 px.

## Grille et espaces

### Page d'offre

- largeur maximale : 1280 px ;
- marges : 20 px compact, 32 px régulier, 48 px large ;
- hero large : grille `1.12fr / 0.88fr` ;
- sections : 96 à 128 px vertical sur large, 80 à 96 px compact ;
- texte de lecture : 640 à 760 px maximum.

### Espace membre

- large : `292px / minmax(0, 1fr) / 320px` ;
- régulier et compact : colonne unique ;
- la navigation de paliers devient une bande horizontale scrollable ;
- la personnalisation descend après le travail principal sur mobile ;
- aucune largeur minimale enfant ne peut agrandir le viewport.

Échelle d'espacement utilisée : 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96, 128.

## Géométrie

- bouton principal : pill, hauteur minimale 48 px ;
- bouton secondaire : pill ou cercle seulement pour une vraie action ;
- surface narrative : rayon 30 à 34 px ;
- inputs : rayon 12 à 16 px ;
- séparations : filets, alignements et espace avant de créer une card ;
- aucune plaque décorative derrière chaque icône.

## Matière

Le verre est réservé à l'objet principal, à la progression et à quelques surfaces d'état. Il n'est pas appliqué à chaque section.

Contrat :

- contenu lisible sans `backdrop-filter` ;
- bordure claire entre 8 et 15 % d'opacité ;
- une lumière interne supérieure ;
- ombre diffuse et profonde ;
- grain global très léger ;
- pas de glow autour de chaque composant.

## Composants

### Action principale

But : diagnostic ou export.

États : rest, hover, focus-visible, pressed, disabled si nécessaire.

Focus : anneau clair de 2 px avec offset visible.

Compact : largeur complète lorsque le libellé reste court.

### Palier de navigation

But : changer de phase et montrer l'avancement.

Anatomie : index, marker temporel, compteur de preuves, chevron large uniquement.

États : rest, hover, active, completed.

Mobile : élément de 230 px dans une bande scrollable, pas une liste verticale avant le contenu.

### Tâche-preuve

But : enregistrer une preuve existante, pas simuler une progression.

Anatomie : contrôle circulaire, action, preuve attendue.

États : rest, hover, focus-visible, completed, saving, rollback en cas d'échec distant.

### Champ de suivi

But : produire le document après accompagnement.

Les labels restent visibles. Le placeholder n'est jamais le label. La donnée reste locale dans cette V1.

## Motion

### Micro-interaction

- durée proposée : 150 ms ;
- easing : `cubic-bezier(0.16, 1, 0.3, 1)` ;
- propriétés : couleur, bordure, translateY inférieur à 2 px ;
- interruption : immédiate ;
- état final : stable et lisible.

### Progression

- durée proposée : 500 ms ;
- propriété : largeur de barre ;
- aucune boucle ;
- le pourcentage textuel reste la source d'information.

### Reduced motion

Toutes les animations et transitions passent à 1 ms. Le scroll smooth est désactivé. Aucune information ne dépend du mouvement.

## Logo et asset

Le fichier utilisé est `public/orsayn-secondary-anthracite.png`.

Il est placé sur une surface claire afin de conserver le contraste du logo anthracite. Son rôle est la signature de marque. Il n'est pas répété dans les cartes.

## Anti AI-slop

Le système refuse :

- gradient violet SaaS ;
- grille de cards répétée pour remplir ;
- hero générique avec mockup de dashboard sans rapport ;
- icône encadrée systématiquement ;
- glass sur toutes les surfaces ;
- métrique inventée ;
- témoignage inventé ;
- motion de scroll décoratif ;
- copie littérale de la référence ;
- phrase qui pourrait vendre n'importe quelle agence web.

## Calibration et preuves

Routes et viewports testés :

- `/accompagnement` à 320, 375, 768 et 1440 px ;
- `/accompagnement/espace` en session authentifiée à 320, 375, 768, 1023, 1025 et 1440 px ;
- zoom 200 % simulé par un viewport CSS de 640 px avec `devicePixelRatio: 2` ;
- reduced motion, navigation clavier, focus visible et arbre d'accessibilité.

Preuves versionnées :

- `product/accompagnement-site-web/visual-qa/browser-report.json` ;
- `product/accompagnement-site-web/visual-qa/rls-runtime-verification.json`.

Captures locales inspectées : `/tmp/build-offer-qa-final/`.

Résultats : aucun overflow horizontal, aucune cible interactive visible sous 44 px, aucun champ sans label, checkboxes et radios nommées dans l'arbre d'accessibilité, focus visible, reduced motion à 1 ms, double clic sérialisé en une mutation, panne réseau conservée dans l'outbox, reprise synchronisée au reload, export Markdown téléchargé et vérifié. L'unique erreur console enregistrée correspond à l'échec réseau volontaire de la fixture. Le typecheck, les 12 tests et le build de production réussissent. La RLS `progress` a été appliquée puis vérifiée avec deux utilisateurs isolés : lecture et écriture propres autorisées, lecture, insertion et suppression croisées refusées.

Une validation humaine de direction artistique reste souhaitable avant de considérer cette identité comme verrouillée pour toutes les futures offres.
