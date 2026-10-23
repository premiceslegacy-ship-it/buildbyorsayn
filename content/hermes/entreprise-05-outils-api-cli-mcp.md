---
id: build-agentique-entreprise-05
titre: Connecte les bons outils, pas tous les outils
ordre: 17
---

## Trois portes peuvent mener au même logiciel

Ton skill de devis est prêt. Pour travailler, il doit lire un mail dans Gmail et remplir une fiche dans Notion. Il y a trois façons de lui ouvrir ces logiciels.

Une API, c'est le guichet par lequel deux logiciels se parlent : ton programme envoie une demande, le service répond. Une CLI est une commande que tu tapes dans le terminal, par exemple `gh` pour GitHub. MCP présente des outils à un agent dans un format commun, comme une prise standard.

Le nom de la porte change. Les droits du compte utilisé, eux, restent la vraie limite.

## Tu vas choisir la bonne connexion pour chaque opération

À la fin, tu sauras laquelle des trois portes prendre pour chaque geste. Tu auras testé une lecture autorisée et un refus, avant toute écriture.

[[schema:TroisPortesUnService]]

## Une API est le guichet d'un logiciel

Ton programme envoie une demande précise, par exemple « donne-moi les cinq derniers mails non lus ». Le service répond avec des données, ou fait l'opération si ton compte y a droit.

Une CLI convient bien aux fichiers, aux scripts et aux opérations que tu veux rejouer à l'identique : transformer un modèle en PDF, par exemple.

Une connexion MCP ne crée aucun droit. Elle expose seulement ce que le serveur prévoit et ce que le compte branché a le droit de faire.

[[schema:ToolAccessDiagram]]

## Donne une phrase à chaque outil réel

- `Gmail` lit les demandes et prépare des brouillons.
- `Notion` garde une fiche de travail ou un modèle de devis.
- `Stripe` montre l'état d'un paiement et ne fait que les opérations autorisées.
- `Telegram` reçoit ta demande et affiche le bouton de validation.

[[schema:CarteOutilsParRole]]

Au premier essai, garde les outils d'écriture éteints. Tu en allumes un seulement quand son test de refus a marché : tu demandes une action interdite, et le service dit non.

==Connecté ne veut pas dire nécessaire. Nécessaire ne veut pas dire autorisé partout.==

## Relis l'effet avant de recommencer

Une commande peut se terminer sans erreur alors que le service a refusé l'action. Une coupure peut aussi tomber juste après l'envoi.

Ouvre donc le service qui fait foi : le dossier « Envoyés » de Gmail, ou le tableau de bord Stripe. Si tu ne sais pas si le mail est parti, ne le renvoie pas tout de suite.

[[schema:LireAgirRelire]]

:::exemple Un devis traverse trois portes
Un artisan reçoit la demande de devis dans Gmail. L'agent lit le message par une connexion limitée à la lecture et remplit le modèle dans Notion.

Une fois le prix validé, un script produit le PDF. Gmail prépare l'envoi, puis l'artisan relit le destinataire et le document avant de cliquer sur Envoyer.

Chaque porte ne sert qu'à une opération.
:::

## À toi de jouer

Compte quarante minutes.

1. Liste les opérations de ton workflow, une par ligne : lire un mail, remplir une fiche, créer un PDF.
2. Choisis API, CLI ou MCP pour chacune.
3. Teste une lecture autorisée.
4. Teste une action qui doit être refusée, comme supprimer un mail.

À la fin, tu as une carte de connexions limitée à ton besoin.

## Version pour ton IA

```text
Voici les opérations de mon workflow : [liste].
Voici les outils disponibles : [liste].

Pour chaque opération, compare API, CLI et MCP.
Choisis la porte la plus simple à vérifier.
Indique :
1. le compte utilisé ;
2. les droits nécessaires ;
3. les données lues ou écrites ;
4. le test du refus ;
5. la lecture à faire après l'action.

Retire toute connexion sans opération précise.
Ne demande aucun secret dans le prompt.
```

## La suite

Tes outils sont branchés, chacun avec un rôle précis. Au chapitre suivant, tu fais voyager un prospect de la publicité jusqu'au suivi client, à travers ces outils.
