# BUILD Hermes Agent, assets ASCII et MCP - plan d'exécution

> **Pour Hermes :** exécuter cette feuille par lots isolés, avec revue de conformité puis revue qualité avant toute publication.

**Objectif :** rendre BUILD réellement applicable : régénérer les familles d'assets demandées dans la DA ASCII validée, transformer le parcours Hermes Agent en missions concrètes, puis aligner le MCP sur le corpus approuvé.

**État au 3 octobre 2026 :**
- Fondations et Hermes Agent ont de nouvelles sources candidates générées puis traitées dans ASCII Magic. Elles ne sont pas encore promues, publiées ni approuvées comme assets finaux.
- Les blocs Dashboard et les Skills utilisent encore leurs anciennes familles par carte.
- Le corps de la doctrine Hermes à 18 chapitres est externe au dépôt et `DOCTRINE_SOURCE_DIR` n'est pas configuré dans cet environnement. Aucun corps de chapitre ne sera inventé ni publié sans retrouver une source canonique autorisée.
- Le MCP sert du contenu publié et ingéré séparément. Modifier l'UI locale ne met pas à jour le corpus MCP.

## Contrats de résultat

### Assets
1. **Fondations** : une illustration partagée, chemin du débutant vers l'IA, Claude Code et ChatGPT générés dans la scène, puis traitement ASCII Magic Dither mesuré.
2. **Hermes Agent** : une illustration partagée, girl générée dans la scène, outils, mémoire et tâche planifiée représentés par trois objets physiques, sans SVG collé ni marques tierces.
3. **Dashboard Blocs** : six illustrations, une par Bloc actif, avec une même grammaire Dots/Dither minimale. Le Bloc 7 reste sans image tant que sa surface n'en justifie pas une.
4. **Skills** : une illustration par skill actif avec une même grammaire Characters/Dither. Product Film Factory est conservé comme référence validée, non régénéré sans demande.
5. Chaque asset a : source, droits, recette ASCII Magic, hashes, preuve 320 px, preuve desktop/mobile, mapping de route, manifest et verdict artistique humain avant promotion.

### Hermes Agent
Chaque leçon doit livrer : une scène de travail, un problème, un geste à faire, un fichier ou rapport à garder, une vérification, une limite et la mission suivante. Les thèmes imposés sont : bots, skills, mémoire persistante, source de vérité, workflows, automatisations, cron, budgets et RTK comme outil tiers à mesurer, Second Brain, profils et sous-agents.

### MCP
Le MCP doit reprendre les définitions et limites du corpus approuvé. Il ne doit jamais faire passer RTK pour une fonction native Hermes ni présenter une mémoire d'agent comme une source de vérité.

## Étapes

0. Développer la porte d'entrée éditoriale : une masterclass YouTube française pour non-techniques et sept posts X courts. Elle part de cas Orsayn vérifiés et renvoie vers BUILD. Un transcript externe, s'il est retenu, est étudié puis reconstruit en français original après revue anti-imitation. Il n'est jamais copié.
1. Retrouver la source canonique autorisée des 18 Markdown. La source a été retrouvée et deux lots candidats séparés ont été rédigés. Les relire et les comparer au contrat avant tout remplacement du corpus canonique.
2. Définir le contrat versionné des 18 missions et ajouter les tests de complétude : scène, exercice, artefact, vérification, limite, route suivante et limite de claim.
3. Réécrire les métadonnées, l'entrée de bibliothèque, les diagrammes/exercices et les composants de chapitre pour rendre la première mission utilisable en moins de 20 minutes, sans écriture externe.
4. Réécrire le corpus canonique après revue du candidat, sans copier de contenu interne, puis valider chaque Markdown contre le contrat avant publication.
5. Mettre à jour les instructions MCP, les tests de limites mémoire/source de vérité/cron/RTK et le runbook doctrine-only.
6. Produire les six Blocs et les sept Skills non-PFF à partir de contrats visuels séparés, puis traiter toute la famille dans ASCII Magic.
7. Promouvoir seulement les assets approuvés : manifest compatible, routes, tests d'existence/hash/crop, build et QA visuelle réelle.
8. Après approbation éditoriale et artistique, exécuter la publication doctrine et l'ingestion doctrine-only selon le runbook, avec readbacks Storage, MCP et live. Aucun apply, déploiement ou ingestion n'est autorisé avant ces revues.

## Contrôles d'arrêt

- Aucun contenu de doctrine n'est inventé lorsque la source canonique est absente.
- Aucun asset candidat ne remplace une image publique sans QA à 320 px et validation artistique.
- Aucune publication, ingestion ou activation MCP n'est lancée avant approbation séparée de la source, des claims et des assets.
- RTK reste une optimisation externe non chiffrée tant qu'une définition, une baseline et une mesure locale ne sont pas fournies.
