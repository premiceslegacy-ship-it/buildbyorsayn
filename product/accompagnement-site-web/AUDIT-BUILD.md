# Audit BUILD : ordre, retard et dette éditoriale

Date : 2026-08-30

## Verdict

BUILD n'est pas en retard sur sa thèse mère. La décomposition, la distillation, la boucle terrain, l'apprentissage par l'erreur, les patterns candidats et la promotion vers SOPs ou skills existent déjà dans le contenu courant.

En revanche, le système était en retard sur deux points : la profondeur pédagogique du design web et la visibilité de son ordre réel. Les idées récentes existaient mieux dans les skills et dans le second cerveau que dans l'expérience membre.

## Ce qui était déjà présent

Dans `lib/mockData.ts` :

- le Bloc 3 présente l'ordre brief, positionnement, conversion, direction, design system, SEO, sécurité, plan, développement, validation ;
- le Bloc 4 explique la décomposition d'un résultat en sous-métiers, la capture d'expertise, la formalisation et le chaînage ;
- le Bloc 5 relie vente, feedback terrain, données produit et itération ;
- le Bloc 7 distingue l'erreur reproductible, le test de non-régression, la réussite comme pattern candidat, la baseline, la métrique, les garde-fous et le déploiement progressif.

La boucle que Samuel pensait absente est donc bien présente dans la version actuelle. Elle est simplement tardive et condensée dans le récapitulatif, ce qui la rend moins structurante qu'elle ne devrait l'être.

## Ce qui était en retard

La section Fondations sur les visuels expliquait surtout les outils et le prompt photographique. Elle ne donnait pas encore le niveau actuel de précision sur :

- la différence entre univers visuel, écran produit et composant ;
- le rôle distinct de Pinterest, Refero, Mintlify et Rare UI ;
- la séquence références, directions, écrans, itérations, design system ;
- la provenance et le niveau de confiance des tokens ;
- les composants avec anatomie, états, responsive et accessibilité ;
- le choix entre Figma, image IA, image-to-video, SVG et HTML ;
- le statique comme source canonique d'un dérivé animé ;
- le registre d'assets, les fallbacks et la cohérence de famille.

Ces manques ont été corrigés partiellement dans `app/beginner/sections/Section3.tsx` et le catalogue de sources a été enrichi dans `app/sources/page.tsx`. Le design system complet reste à enseigner dans un vrai parcours pratique, ce que fait l'offre Site Web by AI.

## Problème d'ordre actuel

Le parcours Fondations est globalement compréhensible : psychologie, copy, vente, marketing, cadrage, environnement, visuels, mise en ligne, seuil.

Les sept blocs sont moins cohérents pédagogiquement :

1. logique du système ;
2. stack ;
3. frameworks ;
4. skills ;
5. logique business ;
6. construction ;
7. récapitulatif et apprentissage.

La logique business arrive trop tard. La stack arrive trop tôt et risque de devenir un inventaire avant que l'élève sache quel résultat elle sert. L'ingénierie des skills arrive avant une première boucle complète de delivery, alors que BUILD dit lui-même que le terrain doit précéder la promotion d'un système.

## Ordre recommandé

### Fondation mentale et commerciale

1. Pourquoi construire et ce qu'un site peut réellement produire.
2. Psychologie, offre, ICP, copy, vente et canaux.
3. Penser avant de construire.
4. Bases web et vocabulaire de production.

### Première boucle complète

5. Références, direction artistique et anti-slop.
6. Structure, design system, build, Git, preview et mise en ligne.
7. Mesure, premiers contacts, retours et correction.

### Système avancé

8. Décomposition du résultat en métiers et compétences.
9. Choix de stack just-in-time.
10. ORACLE, délégations, backend, sécurité et site connecté.
11. SEO, GEO, Search Console et acquisition agentique bornée.

### Capitalisation

12. Incident, diagnostic et test de non-régression.
13. Expérience, A/B test et pattern candidat.
14. Promotion vers SOP, skill, asset, règle ou décision versionnée.
15. Revue, dépréciation et rollback.

## Décision éditoriale

La boucle de capitalisation reste volontairement la fin de la progression détaillée, car elle a besoin d'un terrain. Mais elle doit être annoncée dès le départ comme la destination du parcours. L'élève sait ainsi qu'il ne construit pas seulement un site. Il construit aussi la capacité à mieux livrer le suivant.

## Limites de cette intervention

Cette livraison n'a pas réordonné tout le dashboard BUILD ni déplacé les sept blocs. Elle a :

- produit l'audit et l'ordre cible ;
- enrichi les sources design ;
- corrigé la section visuels sur les médias et la cohérence multi-modèles ;
- créé un parcours 1:1 qui applique immédiatement l'ordre cible.

La réécriture globale du curriculum BUILD doit rester une intervention distincte, car elle change la progression, la navigation, les accès, les vidéos et les promesses commerciales.
