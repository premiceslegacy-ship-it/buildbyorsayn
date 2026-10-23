---
id: build-agentique-entreprise-05
titre: Connecte les bons outils, pas tous les outils
ordre: 17
---

## Trois portes peuvent mener au même logiciel

Une API parle directement au service. Une CLI passe par une commande dans le terminal. MCP présente des outils dans un format commun pour les agents.

Le nom de la porte change. Les droits du compte restent la vraie limite.

## Tu vas choisir la bonne connexion pour chaque opération

À la fin, tu sauras distinguer API, CLI et MCP. Tu testeras une lecture autorisée et un refus avant toute écriture.

[[schema:TroisPortesUnService]]

## Une API est le guichet d'un logiciel

Ton programme envoie une demande structurée. Le service répond avec des données ou réalise une opération autorisée.

Une CLI est une commande utilisable dans le terminal. Elle convient bien aux fichiers, aux scripts et aux opérations que tu veux rejouer.

MCP est une manière commune de présenter des outils à un agent. Une connexion MCP ne crée aucun droit. Elle expose seulement les opérations prévues par le serveur et le compte utilisé.

[[schema:ToolAccessDiagram]]

## Donne une phrase à chaque outil réel

- `Gmail` lit les demandes et prépare des brouillons.
- `Notion` garde une fiche de travail ou un modèle.
- `Stripe` montre l'état d'un paiement et réalise seulement les opérations autorisées.
- `Telegram` reçoit une demande et présente une validation.

[[schema:CarteOutilsParRole]]

Garde les outils d'écriture désactivés au premier essai. Active une opération seulement quand son test de refus fonctionne.

==Connecté ne veut pas dire nécessaire. Nécessaire ne veut pas dire autorisé partout.==

## Relis l'effet avant de recommencer

Une commande peut finir sans erreur alors que le service a refusé l'action. Une coupure peut aussi arriver après l'effet.

Relis donc le service qui fait foi. Si tu ne sais pas si le message est parti, ne le renvoie pas immédiatement.

[[schema:LireAgirRelire]]

:::exemple Un devis traverse trois portes
Un artisan reçoit la demande dans Gmail. L'agent lit le message par une connexion limitée et remplit un modèle dans Notion.

Après validation du prix, un script produit le PDF. Gmail prépare l'envoi, puis l'artisan relit le destinataire et le document.

Chaque porte sert une seule opération.
:::

## À toi de jouer

Compte quarante minutes.

1. Liste les opérations de ton workflow.
2. Choisis API, CLI ou MCP pour chacune.
3. Teste une lecture autorisée.
4. Teste une action qui doit être refusée.

À la fin, tu as une carte de connexions limitée à ton besoin.

## Version pour ton IA

```text
Voici les opérations de mon workflow : [liste].
Voici les outils disponibles : [liste].

Pour chaque opération, compare API, CLI et MCP.
Choisis la porte la plus simple à vérifier.
Indique :
1. le compte utilisé ;
2. les droits nécessaires ;
3. les données lues ou écrites ;
4. le test du refus ;
5. la lecture à faire après l'action.

Retire toute connexion sans opération précise.
Ne demande aucun secret dans le prompt.
```

## La suite

Les outils sont branchés avec des rôles précis. Tu peux maintenant faire traverser un dossier complet entre plusieurs métiers.
