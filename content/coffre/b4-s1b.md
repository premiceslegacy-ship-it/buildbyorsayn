---
id: b4-s1b
titre: Le framework de décomposition des métiers
ordre: 2
---

## « Faire un site » cache une table entière de métiers

Quelqu'un écrit les mots. Quelqu'un organise le parcours. Quelqu'un protège les données. Même si une seule personne fait tout, les décisions restent différentes.

Tu dois séparer ces décisions avant de les confier à une IA.

## Tu vas transformer un grand résultat en tâches vérifiables

La décomposition part du résultat accepté. Elle descend ensuite vers les domaines, les compétences, les tâches et les contrôles qui réunissent le tout.

À la fin, tu auras une carte complète et une fiche de compétence clarifiée.

## Pars du résultat, puis ouvre les couches

« Un beau site » ne dit pas ce qui doit fonctionner. « Recevoir une demande complète sans exposer de donnée » donne déjà une direction.

[[schema:ResultatVersCompetences]]

Tu peux alors séparer la recherche, le message, le design, l'expérience, le développement, la découverte, la sécurité et la qualité.

Ces compétences ne demandent pas huit personnes. Une même personne peut en porter plusieurs. Le découpage nomme les décisions, pas les effectifs.

==Tu découpes le jugement nécessaire. Tu ne fabriques pas une équipe pour remplir le dessin.==

## Un seul formulaire réunit quatre métiers

Le formulaire semble simple à l'écran. Pourtant, son libellé vient du copy. Son ordre vient de l'UX. Son envoi vient du code. Sa protection vient de la sécurité.

[[maquette:FormulaireQuatreMetiers]]

Pourquoi montrer cet écran ? Parce que les métiers se rencontrent toujours dans le résultat final.

Le contrôle commun vérifie qu'une demande valide arrive une fois. Il refuse une demande incorrecte et garde les secrets hors du navigateur.

Pense à un restaurant. La salle, la cuisine et la caisse ont des métiers différents. Le client juge pourtant un seul repas.

:::retiens
Le contrôle commun vérifie la rencontre des compétences, pas seulement chaque morceau séparé.
:::

## Donne une fiche courte à chaque compétence

Chaque fiche répond à six questions. Que reçoit-elle ? Que remet-elle ? Quelle source fait foi ? Quelle décision prend-elle ? Quelle erreur évite-t-elle ? Comment vérifie-t-on ?

[[maquette:FicheCompetenceAnnotee]]

Ajoute le propriétaire de la décision. Ce mot désigne la personne qui peut confirmer ou refuser le résultat.

Concrètement, « design » reste trop large. « Organiser le formulaire mobile pour obtenir une demande complète » peut être remis et vérifié.

## Arrête de découper quand la tâche peut voyager

Tu n'as pas besoin de diviser chaque geste jusqu'au clic. Arrête quand une personne peut recevoir la tâche sans deviner son but.

[[schema:QuandArreterDeDecouper]]

La tâche possède alors une entrée, une sortie, des sources, un responsable et un contrôle. Elle nomme aussi les dépendances qui doivent être prêtes.

Si l'entrée reste « tout le contexte », continue. Si la sortie reste « quelque chose de propre », continue encore.

==Une bonne tâche tient seule sans perdre le résultat qu'elle sert.==

## Écris une règle seulement quand elle résiste aux cas

Commence par tes projets, tes erreurs et les résultats que tu peux montrer. Complète avec plusieurs sources sérieuses.

[[schema:PratiqueSourcesRegle]]

Garde la date, le contexte et les désaccords. Une répétition propose une règle. Un cas contraire permet de la tester.

Tu ne copies pas l'autorité d'une source. Tu extrais une idée, tu la confrontes à ton travail et tu écris avec tes mots.

## Prends Sofia, pâtissière à Angers

:::exemple Sofia découpe la commande de gâteau
Sofia veut « prendre les commandes en ligne ». Cette phrase mélange la fiche du gâteau, la date, les allergies, l'acompte et le planning du laboratoire.

Elle sépare d'abord le résultat : une commande complète que l'équipe peut confirmer sans rappeler trois fois.

Le formulaire recueille les informations. La règle de délai refuse certaines dates. Le paiement confirme l'acompte. Le carnet vérifie la place disponible.

Sofia peut maintenant améliorer un maillon sans demander à l'IA de réinventer toute sa boutique.
:::

## À toi de jouer

Compte quarante-cinq minutes aujourd'hui.

1. Écris le résultat complet que tu veux obtenir.
2. Liste les domaines qui prennent une décision.
3. Descends jusqu'aux tâches qu'on peut confier.
4. Clarifie la fiche la plus vague.

À la fin, tu as une carte du métier et une tâche vraiment testable.

## Version pour ton IA

```text
Décompose ce résultat en travail vérifiable.

Pars du résultat accepté.
Descends ensuite vers :
1. les domaines ;
2. les compétences ;
3. les tâches ;
4. les contrôles communs.

Pour chaque élément, donne :
- ce qu'il reçoit ;
- ce qu'il remet ;
- la source qui fait foi ;
- la décision prise ;
- le risque principal ;
- le propriétaire ;
- la vérification finale.

Ne crée pas un agent par compétence.
Signale les chevauchements et les données sensibles.
```

## La suite

Tu as séparé les compétences. Le prochain chapitre va les regrouper et faire passer un livrable clair de l'une à l'autre.
