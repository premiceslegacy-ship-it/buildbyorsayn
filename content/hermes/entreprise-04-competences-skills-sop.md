---
id: build-agentique-entreprise-04
titre: Transforme le savoir-faire de l'équipe en skills
ordre: 16
---

## Un prompt ne contient pas ton métier

Lundi, 9 h. Tu écris à ton IA : « Fais-moi une bonne campagne. » Elle répond, mais elle ne sait pas comment ton équipe choisit un angle, quelle promesse tu refuses, ni qui relit avant l'envoi. Ces choix vivent dans la tête de deux personnes.

Un skill, c'est la fiche recette collée sur le frigo : n'importe qui refait le plat. Concrètement, c'est un dossier avec un fichier `SKILL.md` (la méthode écrite), des documents de référence et des cas de test.

## Tu vas écrire une compétence que quelqu'un peut reprendre

À la fin, tu auras découpé un métier en petites compétences et ouvert ton premier dossier `SKILL.md`. Si ta collègue part en vacances, quelqu'un d'autre refait le geste avec la même fiche.

[[schema:SkillCommeDossierOuvert]]

## Pars d'un geste précis

Ne crée pas un « skill marketing ». Crée « préparer trois angles depuis les avis clients » ou « classer une demande de support ».

Écris d'abord le déclencheur, c'est-à-dire ce qui lance le travail : par exemple « un nouvel export d'avis arrive le lundi ». Puis écris la sortie : trois angles, chacun avec une phrase d'avis client à l'appui, qu'une personne peut accepter ou refuser.

[[schema:SkillsSopDiagram]]

## Écris les choix, pas seulement les étapes

Une procédure (SOP, la liste des étapes d'un travail) dit quoi faire. Un bon skill dit aussi quand prendre la route A ou B, quand demander de l'aide et quand s'arrêter. Exemple : « Si moins de dix avis, ne propose aucun angle et préviens-moi. »

Ajoute ensuite un bon exemple, un contre-exemple (un résultat à ne jamais rendre) et la liste des actions interdites, comme envoyer un mail au client. Tu relies un fichier de référence, par exemple le guide de ton, seulement quand le skill en a besoin.

[[maquette:DossierSkillReel]]

==Un skill utile transporte le jugement de l'équipe, pas seulement une liste d'étapes.==

## Fais grandir le skill avec les tests

Un test, c'est un cas réel que tu rejoues pour vérifier que le skill tient. Ton IA se trompe sur un export sans données ? Tu ajoutes cet export au dossier `tests/`. Chaque correction porte un numéro de version et une date, par exemple « v1.2, 14 mars ».

Avant d'installer un skill trouvé en ligne, lis-le en entier. Un fichier peut contenir une instruction dangereuse, ou demander plus de droits que ta mission n'en prévoit.

[[schema:BriquesDeCompetence]]

:::exemple Une équipe transforme son rapport ads
Chaque lundi, une agence prépare un rapport publicitaire pour ses clients. Elle crée trois skills : lire les données, repérer les écarts de dépense, écrire la synthèse.

Le choix du budget reste hors du skill. Le responsable reçoit trois recommandations et valide celle qui part au client.

Un jour, une campagne arrive sans aucune donnée et l'analyse casse. L'équipe ajoute ce cas aux tests.
:::

## À toi de jouer

Compte quarante-cinq minutes.

1. Choisis un geste précis de ton workflow, celui que tu refais chaque semaine.
2. Écris le déclencheur et la sortie en deux phrases.
3. Ajoute les choix, les interdits et deux exemples.
4. Prépare cinq cas de test, dont un cas où il manque une pièce.

À la fin, tu as un skill candidat, pas encore activé partout.

## Version pour ton IA

```text
Je veux transformer ce savoir-faire en skill : [description].

Prépare le plan d'un dossier avec :
1. SKILL.md ;
2. references/ ;
3. tests/ ;
4. scripts/ seulement si un script est vraiment nécessaire.

Dans SKILL.md, écris le déclencheur, la sortie, les choix, les interdits, les contrôles et la personne qui valide.
Ajoute un bon exemple et un contre-exemple.
Ne demande aucun droit qui n'existe pas dans la mission.
```

## La suite

Ton skill sait quoi faire. Au chapitre suivant, tu lui donnes les outils dont il a besoin (Gmail, Notion, un terminal), sans ouvrir toutes les portes.
