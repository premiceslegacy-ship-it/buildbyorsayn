---
id: b4-s1b
titre: Le framework de décomposition des métiers
ordre: 2
---

## « Faire un site » cache une table entière de métiers

Tu as ton skill. Tu écris : « Fais-moi le site du client. » Derrière cette phrase, quelqu'un écrit les mots, quelqu'un organise le parcours, quelqu'un protège les données. Même si une seule personne fait tout, ces décisions restent différentes.

Sépare-les avant de les confier à une IA.

## Tu vas transformer un grand résultat en tâches vérifiables

Tu pars du résultat accepté. Tu descends vers les domaines (grands métiers), les compétences (ce qu'un métier sait décider), les tâches (ce qu'on peut confier), puis tu ajoutes les contrôles qui réunissent le tout.

À la fin, tu auras une carte complète et une fiche de compétence clarifiée.

## Pars du résultat, puis ouvre les couches

« Un beau site » ne dit pas ce qui doit fonctionner. « Recevoir une demande de devis complète sans exposer de donnée » donne déjà une direction.

[[schema:ResultatVersCompetences]]

Tu peux alors séparer le copy (les mots), le design, l'UX (l'ordre dans lequel la personne avance), le code, et la sécurité. Pour un autre projet, tu ajouterais la recherche ou la qualité.

Ces compétences ne demandent pas quatre personnes. Une même personne peut en porter plusieurs. Le découpage nomme les décisions, pas les effectifs.

==Tu découpes le jugement nécessaire. Tu ne fabriques pas une équipe pour remplir le dessin.==

## Un seul formulaire réunit quatre métiers

Ouvre mentalement la page « Demande de devis » d'un site. Le formulaire semble simple. Pourtant, le titre « Décris ton besoin » et les libellés des champs viennent du copy (le métier qui écrit les textes). L'ordre des champs vient de l'UX. L'envoi vient du code. La protection des coordonnées vient de la sécurité.

[[maquette:FormulaireQuatreMetiers]]

Sur cet écran, les quatre métiers se rencontrent, comme dans tout résultat final.

Le contrôle commun vérifie qu'une demande valide arrive une seule fois, qu'une demande incorrecte est refusée, et que les secrets (les clés d'accès) restent hors du navigateur.

Pense à un restaurant. La salle, la cuisine et la caisse ont des métiers différents. Le client juge pourtant un seul repas.

:::retiens
Le contrôle commun vérifie la rencontre des compétences, pas seulement chaque morceau pris à part.
:::

## Donne une fiche courte à chaque compétence

Chaque fiche tient dans un fichier et répond à six questions. Que reçoit-elle ? Que remet-elle ? Quelle source fait foi ? Quelle décision prend-elle ? Quelle erreur évite-t-elle ? Comment vérifie-t-on ?

[[maquette:FicheCompetenceAnnotee]]

Ajoute le propriétaire de la décision : la personne qui peut confirmer ou refuser le résultat.

Compare deux fiches. « Design » reste trop large. « Organiser le formulaire mobile pour obtenir une demande complète » peut être remis, puis vérifié par un test sur téléphone.

## Arrête de découper quand la tâche peut voyager

Inutile de descendre jusqu'au clic. Arrête-toi quand une personne peut recevoir la tâche sans deviner son but.

[[schema:QuandArreterDeDecouper]]

La tâche a alors une entrée, une sortie, des sources, un responsable et un contrôle. Elle nomme aussi les dépendances, c'est-à-dire ce qui doit être prêt avant elle.

Si l'entrée reste « tout le contexte », continue de découper. Si la sortie reste « quelque chose de propre », continue encore.

==Une bonne tâche tient seule sans perdre le résultat qu'elle sert.==

## Écris une règle seulement quand elle résiste aux cas

Pour savoir comment bien faire un métier, commence par tes projets : tes erreurs, les résultats que tu peux montrer. Complète avec plusieurs sources sérieuses.

[[schema:PratiqueSourcesRegle]]

Note la date, le contexte et les désaccords. Une même chose vue trois fois propose une règle. Un cas contraire permet de la tester.

Tu ne copies pas l'autorité d'une source. Tu extrais une idée, tu la confrontes à ton travail et tu l'écris avec tes mots.

## Prends Sofia, pâtissière à Angers

:::exemple Sofia découpe la commande de gâteau
En mars, Sofia veut « prendre les commandes en ligne ». Cette phrase mélange la fiche du gâteau, la date, les allergies, l'acompte et le planning du laboratoire.

Elle écrit d'abord le résultat : une commande complète que l'équipe confirme sans rappeler trois fois.

Le formulaire recueille les informations. Une règle de délai refuse certaines dates. Le paiement confirme l'acompte. Le carnet de commandes vérifie la place disponible.

Sofia peut maintenant améliorer un maillon sans demander à l'IA de réinventer toute sa boutique.
:::

## À toi de jouer

Compte quarante-cinq minutes aujourd'hui.

1. Écris, en une phrase, le résultat complet que tu veux obtenir.
2. Liste les domaines qui y prennent une décision.
3. Descends jusqu'aux tâches qu'on peut confier à quelqu'un.
4. Réécris la fiche la plus vague avec les six questions.

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

Tes compétences sont séparées, chacune avec sa fiche. Le prochain chapitre les range en dossiers et fait passer un fichier précis d'une compétence à la suivante.
