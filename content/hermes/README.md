---
id: build-coffre-corpus21
titre: Installe ton agent et fais un premier essai sans risque
ordre: 1
---

## Ton terminal doit répondre avant ton entreprise

Tu viens d'installer un nouvel outil. La tentation, c'est de brancher Gmail, Telegram et ton CRM. Attends.

Commence par une conversation simple dans un dossier vide. Pourquoi ? Parce que tu veux séparer un problème d'installation d'un problème de travail.

## Tu vas vérifier la base en quelques minutes

À la fin, tu sauras installer Hermes Agent, choisir un modèle et lancer un essai sans donnée client. Tu auras aussi vérifié l'état réel de ta configuration.

[[maquette:TerminalInstallationHermes]]

## Installe avec la commande prévue pour ta machine

Sur macOS et Windows, tu peux utiliser l'application Desktop officielle. Sur macOS, le paquet actuel demande une machine Apple Silicon.

Pour une installation en ligne de commande sur Linux, macOS ou WSL2, garde cette commande exacte :

```bash
curl -fsSL https://hermes-agent.nousresearch.com/install.sh | bash
```

Sur Windows natif, lance PowerShell et garde cette commande exacte :

```powershell
iex (irm https://hermes-agent.nousresearch.com/install.ps1)
```

Une commande téléchargée depuis Internet peut changer ta machine. Lis la source et vérifie le domaine avant de l'exécuter. Si ton entreprise impose un paquet signé, suis cette règle.

==Installer le moteur ne lui donne encore aucun travail ni aucun droit.==

## Vérifie ce qui fonctionne vraiment

Recharge ton terminal. Lance ensuite ces commandes, dans cet ordre :

```bash
hermes --version
hermes doctor
hermes status --all
```

La première confirme la version installée. La deuxième cherche les problèmes de configuration. La troisième affiche l'état complet sans montrer les clés en clair.

[[schema:TroisVoyantsInstallation]]

Choisis ton fournisseur et ton modèle avec `hermes model`. Configure les outils plus tard avec `hermes tools`. Une clé acceptée prouve seulement que la connexion marche.

Pense à une voiture. Le moteur démarre. Cela ne te dit pas où aller, qui peut conduire ou ce que tu transportes.

## Fais un essai qui ne peut rien envoyer

Crée un dossier avec trois faux messages de prospects. Demande une fiche par message. Interdis tout envoi, toute modification et toute invention.

[[maquette:PremierEssaiTerminal]]

Ton test doit montrer quatre choses. Le bon fichier a été lu. Les informations manquantes restent visibles. Aucune action extérieure n'a été tentée. La sortie peut être comprise sans relire toute la conversation.

:::exemple Karim teste sans client
Karim dirige une petite entreprise de peinture. Il crée trois demandes fictives : un appartement, un commerce et une cage d'escalier.

L'agent classe les pièces reçues et les pièces manquantes. Il ne calcule aucun prix. Karim voit tout de suite si l'installation fonctionne sans exposer un vrai devis.
:::

## À toi de jouer

Compte vingt minutes aujourd'hui.

1. Installe l'outil avec la méthode adaptée à ta machine.
2. Lance les trois commandes de vérification.
3. Choisis un modèle avec `hermes model`.
4. Teste trois faux dossiers dans un dossier vide.

À la fin, tu as un terminal qui répond et un premier résultat sans risque client.

## Version pour ton IA

```text
Tu travailles uniquement dans le dossier d'exemple ouvert.

Lis les trois demandes fictives.
Pour chacune, prépare une fiche avec :
1. les faits présents ;
2. les informations manquantes ;
3. la décision attendue d'une personne ;
4. le fichier utilisé.

N'envoie rien.
Ne modifie aucun fichier source.
N'invente aucun prix, délai ou engagement.
Arrête-toi si deux fichiers se contredisent.
```

## La suite

Ton terminal fonctionne. Dans le prochain chapitre, tu vas choisir le vrai travail à lui confier.

## Un agent impressionnant peut quand même être inutile

Il écrit, cherche et clique très vite. Pourtant, personne dans ton équipe ne sait quoi lui demander demain matin.

La vérité, c'est que tu n'as pas besoin d'un spectacle. Tu as besoin d'une tâche qui se termine clairement.

## Tu vas choisir un premier workflow qui a du sens

À la fin, tu sauras distinguer une tâche, un workflow, un skill, un outil et une validation. Tu auras choisi un cas simple de ton activité.

[[schema:CinqObjetsPasUnSeul]]

## Une tâche n'est qu'un morceau du trajet

« Prépare une réponse » est une tâche. Le workflow commence plus tôt et finit plus tard.

Un message arrive. Il faut reconnaître la demande, chercher les bonnes informations, préparer une réponse, la faire valider et ranger la suite. Voilà le trajet complet.

[[schema:MessageJusquaSuite]]

Un skill est différent. C'est une méthode écrite que l'agent peut charger. Il explique comment faire un travail, avec quels choix et quels tests.

L'outil, lui, réalise une opération. Gmail lit un e-mail. Notion ouvre une fiche. Stripe montre un paiement. Aucun ne décide seul ce que ton entreprise doit promettre.

## Choisis une fin que quelqu'un peut reconnaître

« Aide-moi avec le marketing » ne possède aucune ligne d'arrivée. « Prépare trois idées de contenu à partir de cinq avis clients » en possède une.

Pourquoi ? Parce qu'une autre personne peut compter les idées, retrouver les avis et refuser une invention.

Pense à une livraison. Le livreur connaît l'adresse, le colis et la personne qui reçoit. Sans ces trois éléments, rouler plus vite ne sert à rien.

==Une bonne mission dit ce qui doit sortir et qui dira oui.==

[[schema:LigneArriveeDuTravail]]

## Commence par une tâche fréquente et peu risquée

Choisis un travail que tu connais. Il revient souvent, mais une erreur ne doit pas envoyer un mauvais prix ou supprimer une donnée.

Bon départ : préparer un résumé de support, classer des demandes, relever des concurrents ou proposer un brouillon de relance.

Mauvais départ : publier automatiquement, rembourser un client, signer un devis ou modifier toute la base.

:::exemple Léa choisit son premier cas
Léa vend des formations à distance. Elle pense commencer par un bot qui répond à tous ses clients.

Elle réduit la mission. Chaque matin, il rassemble les questions reçues et propose une réponse à partir de sa documentation. Léa choisit ce qui part.

Elle garde le support humain. Elle retire seulement la recherche répétitive.
:::

## À toi de jouer

Compte vingt-cinq minutes.

1. Liste trois tâches qui reviennent chaque semaine.
2. Barre celles qui engagent un prix, un paiement ou une promesse.
3. Choisis celle que tu connais le mieux.
4. Écris sa demande de départ, sa sortie et la personne qui valide.

À la fin, tu as une mission assez petite pour être testée.

## Version pour ton IA

```text
Voici trois tâches de mon activité : [liste].

Aide-moi à choisir la meilleure pour un premier essai.
Pour chaque tâche, indique :
1. ce qui déclenche le travail ;
2. ce qui doit sortir ;
3. les données nécessaires ;
4. la décision qui doit rester humaine ;
5. une version en lecture seule.

Ne propose aucune publication, dépense ou modification automatique.
Pose-moi une question si la fin du travail reste floue.
```

## La suite

Tu as choisi une tâche. On va maintenant regarder la dernière fois où elle a vraiment bloqué.
