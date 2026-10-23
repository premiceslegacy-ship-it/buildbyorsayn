---
id: build-agentique-entreprise-09
titre: Planifie sans perdre le contrôle
ordre: 21
---

## Une tâche automatique se réveille sans toi

Lundi matin, elle démarre même si une clé a changé, si une source manque ou si personne ne regarde le résultat.

Voilà pourquoi tu ne planifies jamais un travail que tu n'as pas réussi à la main.

## Tu vas programmer une tâche que tu peux arrêter et reprendre

À la fin, tu sauras attacher un skill, choisir une destination, vérifier l'historique et gérer une coupure.

[[maquette:CalendrierTachePlanifiee]]

## Lance d'abord le travail à la main

Exécute la mission sur un vrai cas autorisé. Lis les outils appelés, le coût et la sortie. Provoque ensuite une pièce manquante.

Quand le travail tient, ouvre la planification avec `hermes cron`. Une tâche peut être unique ou récurrente. Elle peut recevoir un ou plusieurs skills et livrer sa sortie vers un fichier ou une messagerie configurée.

[[schema:ManuelPuisPlanifie]]

## Donne-lui une heure, un modèle et une destination

Une tâche planifiée démarre dans une nouvelle session. Elle doit donc retrouver ses sources et ses règles sans dépendre de ta conversation actuelle.

Le modèle choisi suit l'ordre documenté : choix propre à la tâche, réglage commun du calendrier, puis modèle principal. Écris le choix attendu pour éviter une surprise.

[[maquette:TerminalCronEtHistorique]]

==Une tâche récurrente doit savoir où livrer, quand s'arrêter et qui regarde.==

## Construis une veille marketing qui attend avant de publier

Chaque matin, l'agent rassemble les nouvelles sources, retire les doublons et prépare trois idées. Il livre le rapport dans Telegram ou dans un fichier.

Il ne publie rien. Tu choisis l'idée, tu corriges le texte et tu déclenches la publication.

[[schema:VeillePlanifieeAvecFrein]]

## Prépare la coupure avant qu'elle arrive

La pause globale bloque les nouveaux départs. Une tâche déjà lancée peut finir. Regarde donc les exécutions en cours et les livraisons en attente.

Si un effet extérieur reste incertain, relis le service avant toute nouvelle tentative. Garde l'identifiant, l'état final et la prochaine action.

[[schema:PauseNarretePasLeTrain]]

:::exemple Lina reçoit son rapport sans publication
Lina crée du contenu pour un cabinet de recrutement. À sept heures, la tâche rassemble les nouvelles sources et prépare trois angles.

Le rapport arrive dans Telegram. Lina choisit un angle et vérifie les liens. Elle publie ensuite depuis l'outil social.

Si aucune source récente n'est trouvée, la tâche livre « rien de nouveau » et s'arrête.
:::

## À toi de jouer

Compte une heure après un essai manuel réussi.

1. Choisis une tâche en lecture seule.
2. Attache le skill testé et une destination de test.
3. Lance-la une fois manuellement depuis le calendrier.
4. Vérifie l'historique, puis teste pause et reprise.

À la fin, tu as un workflow planifié qui prépare sans publier.

## Version pour ton IA

```text
Je veux planifier cette tâche : [description].

Vérifie d'abord qu'elle a réussi manuellement.
Prépare une fiche avec :
1. l'horaire ;
2. le skill attaché ;
3. les sources ;
4. le modèle attendu ;
5. les outils actifs ;
6. la destination de test ;
7. les raisons d'arrêt ;
8. la personne qui lit le résultat.

Commence en lecture seule.
Ne publie, n'envoie et ne dépense rien.
Si un ancien effet est incertain, demande une relecture avant de recommencer.
```

## La suite

Tu es parti d'un terminal vide. Tu as maintenant un workflow métier qui reçoit, prépare, demande ton accord, livre et peut être repris.
