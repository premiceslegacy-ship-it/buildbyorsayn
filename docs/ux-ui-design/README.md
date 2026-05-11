# UX/UI Design Premium - Notice d'utilisation

Ce dossier est un skill complet, pas seulement un prompt. Il contient :

- `SKILL.md` : les instructions principales à charger dans l'IA ;
- `references/` : les règles, templates, quality gates et standards ;
- `assets/reference-board/` : des références visuelles de départ ;
- `agents/` : configuration d'agent si tu veux spécialiser ton environnement.

## Comment l'utiliser

1. Place le dossier `ux-ui-design/` dans le dossier de contexte de ton projet, souvent `/docs` ou `/skills`.
2. Demande à l'IA : `Charge docs/ux-ui-design/SKILL.md avant de travailler sur l'UX/UI.`
3. Donne ton contexte : produit, cible, offre, stack, contraintes, captures et objectifs.
4. Demande un livrable précis : audit UX/UI, BRAND-SYSTEM, DESIGN-SYSTEM, prompt visuel, refonte d'écran, landing page ou app/SaaS dashboard.

## Comment l'adapter à ton écosystème

Les références Orsayn sont une base de goût, pas une obligation. Tu peux les remplacer avec tes propres éléments :

- screenshots de sites ou apps que tu aimes ;
- anti-références à éviter ;
- logo, typographies, couleurs, photos, vidéos ;
- captures de ton produit ou de celui de ton client ;
- contraintes sectorielles : luxe, santé, BTP, éducation, SaaS, créateur, local.

Prompts utiles :

```text
Adapte ce skill à mon marché : [contexte]. Remplace les références Orsayn par celles-ci : [liens/captures].
```

```text
Audite cette interface avec ux-ui-design. Classe les problèmes en critique, important, mineur, puis propose les corrections.
```

```text
Garde la structure premium du skill, mais change le registre visuel vers : [sobre / éditorial / organique / corporate premium / éducatif].
```

```text
À partir de ces assets, crée une DA-SYNTHESIS puis un DESIGN-SYSTEM exploitable par mon agent code.
```

## Règle importante

Tu peux tout personnaliser sauf les standards qualité : lisibilité, hiérarchie, accessibilité, cohérence, performance, mobile first et clarté de l'action principale.
