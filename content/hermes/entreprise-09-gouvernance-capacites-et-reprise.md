---
id: build-agentique-entreprise-09
titre: Planifie sans perdre le contrôle
ordre: 20
---

## Une tâche automatique se réveille sans toi

Ton premier palier tient. Reste à le faire tourner tout seul, à heure fixe. Une tâche planifiée, c'est un travail que ton agent lance sans que tu le demandes : lundi, 7 h, elle démarre, que tu sois devant ton écran ou non. Peut-être qu'une clé d'accès a changé, qu'une source a disparu, ou que personne ne lira le résultat.

C'est pour ça que tu ne planifies jamais un travail que tu n'as pas déjà réussi à la main.

## Tu vas programmer une tâche que tu peux arrêter et reprendre

À la fin, tu sauras attacher un skill à une tâche, choisir où elle livre, relire son historique et gérer une coupure.

[[maquette:CalendrierTachePlanifiee]]

## Lance d'abord le travail à la main

Exécute la mission sur un vrai cas autorisé. Regarde quels outils elle appelle, ce qu'elle coûte et ce qu'elle rend. Puis retire-lui une pièce, par exemple une source, pour voir comment elle réagit.

Quand le travail tient, ouvre la planification avec la commande `hermes cron`. Cron, c'est le réveil de ton terminal : tu lui donnes un horaire, par exemple « chaque lundi à 7 h », et il lance la tâche à ce moment-là. Une tâche peut tourner une fois ou se répéter. Elle peut recevoir un ou plusieurs skills et livrer sa sortie dans un fichier ou dans une messagerie que tu as configurée.

[[schema:ManuelPuisPlanifie]]

## Donne-lui une heure, un modèle et une destination

Une tâche planifiée démarre dans une session neuve. Elle ne se souvient pas de ta conversation d'hier : elle doit retrouver seule ses sources et ses règles.

Le modèle d'IA utilisé suit cet ordre : celui choisi pour la tâche, sinon le réglage commun du calendrier, sinon ton modèle principal. Écris le modèle attendu dans la fiche pour ne pas avoir de surprise.

[[maquette:TerminalCronEtHistorique]]

==Une tâche récurrente doit savoir où livrer, quand s'arrêter et qui regarde.==

## Construis une veille marketing qui attend avant de publier

Chaque matin, l'agent rassemble les nouvelles sources, retire les doublons et prépare trois idées de post. Il dépose le rapport dans Telegram ou dans un fichier.

Il ne publie rien. Tu choisis l'idée, tu corriges le texte et tu cliques toi-même sur Publier.

[[schema:VeillePlanifieeAvecFrein]]

## Prépare la coupure avant qu'elle arrive

La pause globale empêche les nouveaux départs. Une tâche déjà lancée peut aller au bout. Regarde donc les exécutions en cours et les livraisons en attente.

Si tu ne sais pas si un envoi est parti, relis le service concerné avant de réessayer. Note le numéro de l'exécution, son état final et la prochaine action.

[[schema:PauseNarretePasLeTrain]]

:::exemple Lina reçoit son rapport sans publication
Lina crée du contenu pour un cabinet de recrutement. À 7 h, la tâche rassemble les nouvelles sources et prépare trois angles.

Le rapport arrive dans Telegram. Lina choisit un angle, vérifie les liens, puis publie elle-même depuis son outil de réseaux sociaux.

Un matin, aucune source récente n'existe. La tâche écrit « rien de nouveau » et s'arrête.
:::

## À toi de jouer

Compte une heure, une fois ton essai manuel réussi.

1. Choisis une tâche en lecture seule.
2. Attache le skill déjà testé et une destination de test.
3. Lance-la une fois à la main depuis le calendrier.
4. Relis l'historique, puis teste la pause et la reprise.

À la fin, tu as une tâche planifiée qui prépare sans publier.

## Version pour ton IA

```text
Je veux planifier cette tâche : [description].

Vérifie d'abord qu'elle a réussi manuellement.
Prépare une fiche avec :
1. l'horaire ;
2. le skill attaché ;
3. les sources ;
4. le modèle attendu ;
5. les outils actifs ;
6. la destination de test ;
7. les raisons d'arrêt ;
8. la personne qui lit le résultat.

Commence en lecture seule.
Ne publie, n'envoie et ne dépense rien.
Si un ancien effet est incertain, demande une relecture avant de recommencer.
```

## La suite

Tu es parti d'un terminal vide. Tu as maintenant un workflow de métier qui reçoit, prépare, attend ton accord, livre, et que quelqu'un d'autre peut reprendre.
