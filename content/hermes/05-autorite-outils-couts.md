---
id: build-coffre-doctrine-autorite
titre: Choisis ses outils, ses droits et son budget
ordre: 7
---

## Une règle écrite ne verrouille aucune porte

Tu peux écrire « ne publie jamais sans moi ». Si l'outil possède quand même tous les droits, une erreur reste possible.

La consigne guide. Le réglage bloque. Le test prouve que le blocage marche.

## Tu vas limiter ce que ton agent peut réellement faire

À la fin, tu auras choisi les outils nécessaires, séparé lecture et écriture, placé tes validations et fixé une limite de coût.

[[schema:AuthorityLayersDiagram]]

## Donne une seule clé pour une seule mission

Un bot de support peut lire la documentation et préparer une réponse. Il n'a pas besoin d'accéder à Stripe, au dépôt GitHub et à toute la boîte mail.

Crée une clé par service. Donne les droits les plus petits possibles. Garde les secrets hors des prompts et des fichiers partagés.

[[schema:TrousseauMinimal]]

Pense à un hôtel. La carte de ta chambre n'ouvre pas la cuisine, la caisse et toutes les autres chambres.

==La confiance ne remplace jamais un droit bien réglé.==

## Place ta validation juste avant l'action

Pour une publication, l'agent peut rechercher, écrire et préparer. Tu valides le texte, le compte et le moment avant l'envoi.

Pour un devis, il peut vérifier les pièces et remplir le modèle. Tu valides le prix, le délai et le destinataire.

[[schema:MainAvantLeMondeExterieur]]

Un accord ancien ne couvre pas un texte modifié. Si le prix, le compte ou le destinataire change, demande un nouvel accord.

## Compte tout le travail, pas seulement la réponse finale

Une tâche peut appeler un modèle principal, une recherche, plusieurs outils et des sous-tâches. Le coût total vient de l'ensemble.

Fixe une limite par appel et une limite pour toute la mission. Ajoute aussi une durée, un nombre de tentatives et un volume maximum.

[[schema:CompteurDeMission]]

:::exemple Yanis prépare un rapport publicitaire
Yanis gère des campagnes pour un restaurant. L'agent lit les résultats et prépare le rapport.

Il n'a aucun droit de modifier la campagne. Yanis vérifie les dépenses, choisit la recommandation et décide lui-même du prochain budget.

Le workflow s'arrête si les données manquent ou si le coût de recherche atteint la limite fixée.
:::

## À toi de jouer

Compte trente minutes.

1. Liste les outils nécessaires à ton premier cas.
2. Retire tout outil qui ne sert pas la sortie.
3. Sépare lecture, préparation et action extérieure.
4. Fixe coût, durée, tentatives et arrêt.

À la fin, tu as un contrat que tu peux tester, pas une simple promesse.

## Version pour ton IA

```text
Voici la mission : [mission].
Voici les outils envisagés : [outils].

Prépare un tableau avec :
1. l'opération exacte de chaque outil ;
2. les données lues ;
3. les données modifiées ;
4. la validation humaine nécessaire ;
5. la limite de coût, de durée et de tentatives ;
6. le test qui doit prouver le refus.

Retire tout outil inutile.
Ne demande aucun secret.
Ne considère jamais une phrase du prompt comme un verrou technique.
```

## La suite

Les portes sont réglées. Tu peux préparer un pilote complet qu'un collègue saura relire.
