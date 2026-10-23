---
id: build-coffre-doctrine-pilote
titre: Prépare un pilote qu'un collègue peut comprendre
ordre: 7
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

Ton pilote est lisible : un collègue sait ce qu'il doit faire et comment l'arrêter. Dans le prochain chapitre, tu construis le dossier final : un contrat de mission, une fiche d'outil et un compte rendu de passage, pour qu'une personne puisse le reprendre sans toi.
