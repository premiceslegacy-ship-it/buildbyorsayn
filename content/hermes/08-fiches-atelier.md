---
id: build-coffre-doctrine-ateliers
titre: Prépare un pilote qu'un collègue peut comprendre
ordre: 8
---

## Si tu es le seul à comprendre, ce n'est pas prêt

Tu as le workflow dans ta tête. Tu sais pourquoi un dossier s'arrête et quel client appeler. Ton collègue, lui, voit seulement des fichiers et un bot.

Un bon pilote tient dans un dossier court. Quelqu'un d'autre peut l'ouvrir et expliquer ce qui se passe.

## Tu vas réunir tout ce qu'il faut avant l'essai

À la fin, tu auras une fiche de mission, une fiche d'outil, un plan de test et une procédure d'arrêt. Les cases inconnues resteront visibles.

[[schema:WorkshopDiagram]]

## Commence par la fiche de mission

Écris le problème, le résultat attendu et la personne responsable. Ajoute les sources autorisées, les actions interdites et la preuve de fin.

Ne remplis pas une case au hasard pour faire propre. Écris `inconnu`, puis donne un nom à la personne qui doit répondre.

[[maquette:FicheMissionRemplie]]

Pourquoi ? Parce qu'un blanc visible bloque le départ. Une valeur inventée peut déclencher une mauvaise action.

## Décris chaque outil comme une porte précise

Pour Gmail, note « lire les messages portant le libellé devis-test ». N'écris pas simplement « accès Gmail ».

Pour Notion, note la base, les champs lus et les champs écrits. Pour Telegram, note le chat de test et la manière dont tu valides.

[[schema:TroisPortesDuPilote]]

==Un outil n'est pas un droit général. C'est une opération précise sur une cible précise.==

## Prépare les cas qui vont casser

Teste une pièce absente, un doublon, deux sources qui se contredisent et un document qui demande d'ignorer tes règles.

Ajoute une coupure juste après une action. Une autre personne doit pouvoir retrouver l'état sans répéter l'envoi.

[[schema:QuatreCartesQuiCassent]]

:::exemple Mehdi passe son pilote à Claire
Mehdi prépare un bot de support pour une boutique. Il donne le dossier à Claire, qui n'a pas participé au montage.

Claire trouve la source des réponses, le chat de test et le bouton d'arrêt. Elle voit aussi qu'un remboursement reste interdit.

Quand elle ne comprend pas qui valide un geste commercial, le pilote reste éteint. Mehdi ajoute le responsable avant de continuer.
:::

## À toi de jouer

Compte une heure.

1. Remplis la fiche de mission.
2. Écris une fiche par outil.
3. Prépare quatre cas difficiles.
4. Donne le dossier à une autre personne pendant dix minutes.

À la fin, elle doit pouvoir expliquer le résultat, les interdits et l'arrêt.

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

Le pilote est lisible. Il faut maintenant vérifier que la méthode fonctionne sur plusieurs cas avant d'en faire un skill.

## Une arborescence propre ne suffit pas

Tu peux avoir de beaux dossiers et rester bloqué. Si personne ne sait quelle source croire ou qui décide, le rangement ne sert à rien.

Le dossier de reprise doit répondre aux questions d'une personne qui arrive après toi.

## Tu vas construire le dossier final du pilote

À la fin, tu auras une arborescence simple, un contrat de mission, une fiche d'outil et un compte rendu de passage.

[[schema:TemplateTreeDiagram]]

## Garde quatre espaces faciles à comprendre

`connaissance/` contient les règles et décisions. `procedures/` contient les skills testés. `projets/` contient les missions en cours. `apprentissage/` contient les méthodes encore candidates.

Les secrets, les bases complètes et les journaux sensibles restent dans leurs systèmes protégés.

[[maquette:ArborescencePiloteTerminal]]

## Remplis le contrat sans inventer

Le contrat contient le résultat, le responsable, les sources, les opérations permises, les interdits, les limites et l'arrêt.

Une valeur critique manque ? Écris `A_RENSEIGNER` et garde le pilote éteint.

[[maquette:ContratMissionLisible]]

==Un blanc visible protège mieux qu'une réponse inventée.==

## Termine par un compte rendu de passage

Écris ce qui a été fait et ce qui a été vérifié. Note les objets touchés, les accords reçus, les doutes restants et la prochaine action.

Ne recopie pas tous les journaux. Donne seulement ce qui permet de reprendre sans refaire ni doubler une action.

[[schema:PassationEnSixCartes]]

:::exemple Clara reprend le rapport du lundi
Clara ouvre le dossier d'un rapport marketing. Elle trouve la source des chiffres, le skill utilisé et la dernière sortie.

Le compte rendu dit qu'une donnée YouTube manque et que la publication n'a pas été tentée. Clara relance seulement la collecte.

Elle ne recommence pas le rapport et ne publie rien par erreur.
:::

## À toi de jouer

Compte une heure.

1. Crée les quatre dossiers.
2. Ajoute le contrat de mission et les fiches d'outils.
3. Écris un compte rendu de passage.
4. Donne le dossier à une autre personne avec un cas contradictoire.

À la fin, elle doit savoir ce qui est vrai, interdit et attendu.

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

Le dossier peut être repris. Il reste une dernière étape : planifier les tâches récurrentes sans perdre le contrôle.
