---
id: build-coffre-doctrine-ateliers
titre: Prépare un pilote qu'un collègue peut comprendre
ordre: 8
---

## Si tu es le seul à comprendre, ce n'est pas prêt

Ton agent a ses règles, ses messages et ses droits. Un pilote, c'est ton premier essai en petit, sur un seul cas. Avant de le lancer, regarde-le avec les yeux de quelqu'un d'autre.

Tu as le workflow dans ta tête. Tu sais pourquoi un dossier s'arrête et quel client appeler. Ton collègue, lui, voit seulement des fichiers et un bot.

Un bon pilote tient dans un dossier court. Lundi matin, quelqu'un d'autre l'ouvre et t'explique ce qui se passe.

## Tu vas réunir tout ce qu'il faut avant l'essai

À la fin, tu auras quatre documents : une fiche de mission, une fiche par outil, un plan de test et une procédure d'arrêt. Les cases que tu ne sais pas remplir restent visibles.

[[schema:WorkshopDiagram]]

## Commence par la fiche de mission

C'est la première page du dossier. Remplis dans l'ordre :

1. le problème, en une phrase ;
2. le résultat attendu ;
3. la personne responsable ;
4. les sources autorisées ;
5. les actions interdites ;
6. la preuve que c'est fini.

Une case que tu ne sais pas remplir ? N'écris pas n'importe quoi pour faire propre. Écris `inconnu`, puis donne le nom de la personne qui doit répondre.

[[maquette:FicheMissionRemplie]]

Pourquoi ? Un blanc visible bloque le départ. Une valeur inventée peut déclencher une mauvaise action.

## Décris chaque outil comme une porte précise

Pour Gmail, écris « lire les messages portant le libellé devis-test ». N'écris pas « accès Gmail ».

Pour Notion, note la base, les champs que l'agent lit et ceux qu'il écrit. Pour Telegram, note le chat de test et la manière dont tu valides.

[[schema:TroisPortesDuPilote]]

==Un outil n'est pas un droit général. C'est une opération précise sur une cible précise.==

## Prépare les cas qui vont casser

Prépare quatre cas avant l'essai :

1. une pièce absente (le devis arrive sans les photos) ;
2. un doublon (le même message reçu deux fois) ;
3. deux sources qui se contredisent (deux prix pour la même prestation) ;
4. un document qui dit « ignore tes règles ».

Ajoute une coupure juste après une action. Une autre personne doit pouvoir retrouver où ça en est, sans renvoyer le message une seconde fois.

[[schema:QuatreCartesQuiCassent]]

:::exemple Mehdi passe son pilote à Claire
Mehdi prépare un bot de support pour une boutique en ligne. Il donne le dossier à Claire, qui n'a pas participé au montage.

En dix minutes, Claire trouve la source des réponses, le chat de test et le bouton d'arrêt. Elle voit aussi qu'un remboursement reste interdit.

Elle ne comprend pas qui valide un geste commercial. Le pilote reste éteint. Mehdi ajoute le nom du responsable avant de continuer.
:::

## À toi de jouer

Compte une heure.

1. Remplis la fiche de mission.
2. Écris une fiche par outil.
3. Prépare tes quatre cas difficiles.
4. Donne le dossier à une autre personne pendant dix minutes.

À la fin, elle doit pouvoir t'expliquer le résultat visé, les interdits et la façon d'arrêter.

## Version pour ton IA

```text
Relis ce dossier de pilote comme si tu devais le reprendre demain.

Signale chaque endroit où tu dois deviner :
1. la source qui fait foi ;
2. la personne responsable ;
3. l'opération exacte d'un outil ;
4. la validation nécessaire ;
5. la preuve de fin ;
6. la manière d'arrêter ou de reprendre.

N'invente aucune valeur pour compléter une case.
Transforme chaque manque en question adressée à une personne nommée.
```

## La suite

Ton pilote est lisible. Il reste à le ranger pour qu'une personne puisse le reprendre sans toi.

## Une arborescence propre ne suffit pas

Tu peux avoir de beaux dossiers et rester bloqué. Si personne ne sait quelle source croire ni qui décide, le rangement ne sert à rien.

Imagine Clara, qui arrive lundi sur ton pilote. Le dossier de reprise doit répondre à ses questions : d'où viennent les chiffres ? qu'est-ce qui est déjà fait ? qu'est-ce que je ne dois pas refaire ?

## Tu vas construire le dossier final du pilote

À la fin, tu auras quatre dossiers bien rangés, un contrat de mission, une fiche d'outil et un compte rendu de passage.

[[schema:TemplateTreeDiagram]]

## Garde quatre espaces faciles à comprendre

Voilà l'arborescence : un dossier principal, quatre sous-dossiers.

1. `connaissance/` : les règles et les décisions.
2. `procedures/` : les skills déjà testés. Un skill, c'est la fiche recette de l'agent : il refait le même travail de la même manière.
3. `projets/` : les missions en cours.
4. `apprentissage/` : les méthodes encore à l'essai.

Les secrets, les bases de données complètes et les journaux sensibles restent dans leurs systèmes protégés. Ne les copie pas ici.

[[maquette:ArborescencePiloteTerminal]]

## Remplis le contrat sans inventer

Le contrat reprend ta fiche de mission : le résultat, le responsable, les sources, les opérations permises, les interdits, les limites et la condition d'arrêt.

Une valeur importante manque ? Écris `A_RENSEIGNER` et garde le pilote éteint.

[[maquette:ContratMissionLisible]]

==Un blanc visible protège mieux qu'une réponse inventée.==

## Termine par un compte rendu de passage

Écris ce qui a été fait et ce qui a été vérifié. Note les objets touchés (quelle fiche Notion, quel message), les accords reçus, les doutes restants et la prochaine action.

Ne recopie pas tous les journaux. Garde seulement ce qui permet de reprendre sans refaire ni doubler une action.

[[schema:PassationEnSixCartes]]

:::exemple Clara reprend le rapport du lundi
Clara ouvre le dossier d'un rapport marketing. Elle trouve la source des chiffres, le skill utilisé et la dernière sortie.

Le compte rendu dit qu'une donnée YouTube manque et que la publication n'a pas été tentée. Clara relance seulement la collecte.

Elle ne refait pas le rapport et ne publie rien par erreur.
:::

## À toi de jouer

Compte une heure.

1. Crée les quatre dossiers.
2. Ajoute le contrat de mission et une fiche par outil.
3. Écris un compte rendu de passage.
4. Donne le dossier à une autre personne, avec un cas où deux sources se contredisent.

À la fin, elle sait ce qui est vrai, ce qui est interdit et ce qui est attendu.

## Version pour ton IA

```text
Prépare le dossier de reprise de cette mission : [mission].

Crée un plan pour :
1. connaissance/ ;
2. procedures/ ;
3. projets/ ;
4. apprentissage/.

Ajoute un contrat de mission et une fiche de passage.
Marque A_RENSEIGNER pour toute source, personne, limite ou validation absente.
Ne place aucun secret, base complète ou journal sensible dans le dossier.
La fiche de passage doit éviter toute seconde action accidentelle.
```

## La suite

Le dossier peut être repris. Avant d'en faire un skill, tu vas vérifier que ta méthode tient sur cinq cas, pas seulement sur le premier.
