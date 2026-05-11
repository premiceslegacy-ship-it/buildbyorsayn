# Quality Gates

Utiliser cette grille avant de rendre un design, un design system, un prompt visuel, une landing, une ad ou un audit.

## Seuils

```text
95 à 100 : premium, prêt à exécuter.
85 à 94 : bon, quelques corrections mineures.
70 à 84 : moyen, risque de rendu générique.
Moins de 70 : à reprendre.
```

Règle : ne jamais rendre comme final sous 85 si la mission est de produire une DA premium. Si le score est inférieur, fournir le diagnostic et la version corrigée.

## Échecs critiques

Un seul échec critique bloque la validation :

- emoji présent dans l'interface, les CTA, les ads ou les exemples ;
- CTA principal absent ou flou ;
- action principale inaccessible sur mobile ;
- glassmorphism sur fond blanc ou trop clair ;
- texte illisible sur image sans overlay ;
- aucune direction artistique identifiable ;
- rendu qui ressemble à un template SaaS générique ;
- stock photo corporate ;
- focus visible absent sur éléments interactifs ;
- body text inférieur à 16 px sur mobile ;
- animation qui dépasse 300 ms sans raison forte.

## Scorecard 100 points

### 1. Direction artistique - 20 points

```text
5 pts : sensation premium immédiate.
4 pts : cohérence avec la DA dark, glass, cinématique.
4 pts : imagerie mémorable et non générique.
3 pts : palette maîtrisée, sans couleurs parasites.
2 pts : typographie cohérente et expressive.
2 pts : personnalité claire, pas simplement "moderne".
```

Questions :

```text
L'écran serait-il reconnaissable sans le logo ?
Le rendu a-t-il une atmosphère ou seulement des composants ?
Chaque élément semble-t-il intentionnel ?
```

### 2. Liquid Glass et surfaces - 20 points

```text
5 pts : glass visible, lisible, sur fond adapté.
4 pts : bordures et highlights précis.
4 pts : profondeur par layers, pas par ombres invisibles.
3 pts : blur cohérent entre composants.
2 pts : glows limités aux priorités.
2 pts : fallback et performance mobile prévus.
```

Questions :

```text
Le glass sert-il une fonction UX ?
Y a-t-il trop de surfaces au même niveau ?
Le texte reste-t-il parfaitement lisible ?
```

### 3. UX et hiérarchie - 20 points

```text
5 pts : une action dominante par écran.
4 pts : parcours évident sans explication.
4 pts : hiérarchie visuelle instantanée.
3 pts : friction réduite dans les formulaires et états.
2 pts : navigation simple et prévisible.
2 pts : états empty, loading, error, success utiles.
```

Questions :

```text
L'utilisateur sait-il quoi faire en moins de 2 secondes ?
Peut-il réussir sans lire toute la page ?
Y a-t-il un élément qui vole l'attention au CTA ?
```

### 4. Copywriting système 1 - 15 points

```text
4 pts : titre orienté bénéfice client.
3 pts : description claire, concrète, non redondante.
3 pts : CTA orienté action et résultat.
2 pts : preuve ou réassurance visible.
2 pts : vocabulaire simple, direct, non corporate.
1 pt : microcopy humaine et utile.
```

Questions :

```text
Le titre vend-il le résultat ou la feature ?
Le CTA dit-il vraiment ce qui va se passer ?
Peut-on retirer des mots sans perdre de sens ?
```

### 5. Mobile first - 15 points

```text
4 pts : version 375 px pensée en premier.
3 pts : CTA principal visible ou immédiatement accessible.
3 pts : zones tactiles minimum 44 x 44 px.
2 pts : corps de texte minimum 16 px.
2 pts : sections longues simplifiées.
1 pt : performance des effets prévue.
```

Questions :

```text
Le mobile est-il une vraie version ou un desktop compressé ?
Le pouce peut-il atteindre les actions clés ?
La page garde-t-elle son impact sans grands effets desktop ?
```

### 6. Accessibilité et exécution - 10 points

```text
3 pts : contraste texte conforme.
2 pts : focus visible documenté.
2 pts : labels et sémantique prévus.
1 pt : reduced motion prévu.
1 pt : responsive clair.
1 pt : tokens exploitables par un développeur.
```

## Checklist avant rendu

```text
Aucun emoji.
Aucun CTA vague.
Aucun fond blanc principal.
Aucun texte sur image sans overlay.
Aucune animation supérieure à 300 ms sans justification.
Aucun composant glass sans rôle clair.
Aucune icône cartoon.
Pas plus de 2 familles typographiques.
Pas plus de 3 radius families.
Action principale évidente en 2 secondes.
Mobile 375 px documenté.
```

## Audit anti AI slop

Le rendu est probablement de l'AI slop si :

```text
Les sections pourraient appartenir à n'importe quelle startup.
Les titres utilisent des superlatifs sans preuve.
Les cards ont toutes la même taille et le même poids.
Les icônes semblent choisies au hasard.
Les images n'ont pas la même lumière ni le même grain.
Le design repose sur des effets au lieu d'une structure.
Le CTA est noyé parmi plusieurs actions concurrentes.
Le mobile n'est pas spécifié.
```

Correction : revenir à la DA, choisir un seul point focal par écran, réduire les composants, renforcer la preuve, simplifier les CTA, préciser les tokens.

## Validation des ads

Une ad doit passer ces tests :

```text
Le visuel arrête le scroll sans crier.
Le hook se comprend sans contexte.
Le bénéfice est visible avant la feature.
La créa est lisible sur mobile.
Le CTA correspond à la landing post-clic.
La promesse est crédible.
Aucun style cheap, cartoon ou corporate.
```

## Validation iconographie

```text
Stroke unique : 1.5 px ou 2 px.
Grille unique : 24 px ou 20 px.
Caps et corners cohérents.
Pas de mélange outline, filled et duotone sans règle.
Pas d'icône décorative sans rôle.
Pas d'emoji utilisé comme icône.
```
