---
id: build-agentique-entreprise-07
titre: Commence petit et élargis seulement ce qui marche
ordre: 19
---

## Tu n'as pas besoin d'automatiser toute l'entreprise

Lundi, tu prends une seule sorte de demande, par exemple « où en est ma livraison ? ». Un seul canal, Telegram. Une seule personne qui valide. Si ce premier palier tient une semaine, tu ajoutes la suite.

Beaucoup de projets deviennent fragiles parce qu'ils grandissent avant d'avoir appris. Un workflow branché sur dix canaux le premier jour casse partout en même temps.

## Tu vas passer de l'essai à l'usage sans perdre la main

À la fin, tu auras six paliers écrits sur une page. Tu sauras quoi compter avant d'ajouter des cas, des outils ou des droits.

[[schema:AdoptionLaddersDiagram]]

## Commence en observation

Palier 1 : l'agent lit des dossiers fictifs, ou des vrais dossiers copiés sans aucun secret. Palier 2 : il prépare un résultat et ne l'envoie pas. Palier 3 : une personne s'en sert sur quelques vrais cas et valide tout à la main. Tu augmentes le volume seulement après.

[[schema:EscalierDesDroits]]

Pense au permis de conduire. Tu ne commences pas sur l'autoroute, de nuit, avec une remorque.

==Tu ajoutes un droit après une preuve, jamais avant.==

## Mesure le résultat complet

Pendant l'essai, compte quatre choses : les dossiers acceptés tels quels, les corrections, les oublis, et le nombre de fois où quelqu'un a dû reprendre après une coupure. Ajoute le temps humain et le coût total.

Exemple : une réponse prête en 30 secondes ne vaut rien si elle demande 20 minutes de correction.

[[maquette:TableauAvantApresPilote]]

## Garde une sortie à chaque palier

Tu dois pouvoir revenir au travail manuel sans perdre un seul dossier. Garde les sources intactes, les étapes écrites et un bouton d'arrêt que tout le monde connaît.

Si la qualité baisse, si les doublons montent ou si le coût dérive, tu t'arrêtes sur ce palier et tu corriges.

[[schema:SortieDeSecours]]

:::exemple Une boutique teste son support
Une boutique commence avec les questions de livraison reçues sur Telegram. Le bot prépare dix réponses et une personne valide chacune.

Au bout d'une semaine, l'équipe compte les corrections et les questions que le bot ne connaissait pas. Elle ajoute alors les demandes de retour simples. Les remboursements restent hors du workflow.

La zone couverte ne grandit pas parce que la démo est jolie. Elle grandit parce que le palier d'avant a tenu.
:::

## À toi de jouer

Compte quarante minutes.

1. Choisis le premier palier de ton workflow.
2. Note la situation d'aujourd'hui avant l'essai : temps passé, nombre de dossiers.
3. Fixe ce que tu comptes et la date de revue.
4. Écris la raison qui te fait arrêter ou revenir en arrière.

À la fin, tu as un pilote limité et une décision prévue à date fixe.

## Version pour ton IA

```text
Voici le workflow que je veux tester : [description].

Propose six paliers progressifs.
Pour chaque palier, indique :
1. les cas inclus ;
2. les outils actifs ;
3. ce que la personne valide ;
4. les mesures à suivre ;
5. la preuve nécessaire pour avancer ;
6. la raison de revenir au palier précédent.

Commence en lecture seule.
Ne propose aucune augmentation de droits sans résultat mesuré.
```

## La suite

Ton premier palier tient. Au chapitre suivant, tu fais tourner ce travail tout seul, à heure fixe, avec un frein à portée de main.
