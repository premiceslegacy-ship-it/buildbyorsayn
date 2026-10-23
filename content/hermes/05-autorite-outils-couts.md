---
id: build-coffre-doctrine-autorite
titre: Choisis ses outils, ses droits et son budget
ordre: 6
---

## Une règle écrite ne verrouille aucune porte

Ton agent reçoit déjà des messages et te montre un brouillon. La question suivante : qu'est-ce qu'il a le droit de toucher ?

Tu peux écrire « ne publie jamais sans moi » dans son fichier de règles. Si l'outil de publication reste ouvert avec tous les droits, une erreur est encore possible, un jeudi à 22 h, quand tu ne regardes pas.

La consigne guide. Le réglage bloque. Le test prouve que le blocage marche.

## Tu vas limiter ce que ton agent peut réellement faire

À la fin, tu auras fait quatre choses : choisi les outils nécessaires, séparé lecture et écriture, placé tes validations et fixé une limite de coût.

[[schema:AuthorityLayersDiagram]]

## Donne une seule clé pour une seule mission

Une clé d'accès, c'est le badge qu'un service te donne pour qu'un logiciel s'y connecte. Un bot de support lit la documentation et prépare une réponse. Il n'a pas besoin de Stripe (tes paiements), du dépôt GitHub (l'endroit où est stocké ton code) ni de toute ta boîte mail.

1. Crée une clé par service.
2. Donne les droits les plus petits possibles : lecture seule si l'agent ne fait que lire.
3. Garde les clés hors des prompts et des fichiers partagés.

[[schema:TrousseauMinimal]]

Pense à un hôtel. La carte de ta chambre n'ouvre pas la cuisine, la caisse ni les autres chambres.

==La confiance ne remplace jamais un droit bien réglé.==

## Place ta validation juste avant l'action

Pour une publication, l'agent peut chercher, écrire et préparer. Toi, tu valides le texte, le compte et le moment, juste avant l'envoi.

Pour un devis, il peut vérifier les pièces et remplir le modèle. Toi, tu valides le prix, le délai et le destinataire.

[[schema:MainAvantLeMondeExterieur]]

Un accord donné hier ne couvre pas le texte modifié ce matin. Si le prix, le compte ou le destinataire change, l'agent te redemande.

## Compte tout le travail, pas seulement la réponse finale

Une seule tâche peut appeler le modèle principal, une recherche web, plusieurs outils et des sous-tâches. Chaque appel coûte. Le coût total, c'est la somme de tout ça, pas seulement la réponse que tu lis.

Fixe une limite pour chaque appel et une pour toute la mission. Ajoute une durée maximale, un nombre de tentatives et un volume maximum. Par exemple : 2 € par mission, 10 minutes, 3 tentatives, 20 lignes de données.

[[schema:CompteurDeMission]]

:::exemple Yanis prépare un rapport publicitaire
Yanis gère des campagnes pour un restaurant. Chaque lundi, l'agent lit les résultats de la semaine et prépare le rapport.

Il n'a aucun droit de modifier la campagne. Yanis vérifie les dépenses, choisit la recommandation et décide lui-même du budget suivant.

Le workflow s'arrête tout seul si des données manquent, ou si le coût de recherche atteint la limite fixée.
:::

## À toi de jouer

Compte trente minutes.

1. Écris la liste des outils dont ton premier cas a besoin.
2. Barre tout outil qui ne sert pas la sortie.
3. Pour chaque outil restant, note s'il lit, prépare ou agit à l'extérieur.
4. Fixe le coût, la durée, le nombre de tentatives et la condition d'arrêt.

À la fin, tu as un contrat que tu peux tester : tu essaies de lui faire faire un envoi interdit, et il refuse.

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

Tes portes sont réglées. Maintenant, tu mets tout ça dans un dossier de pilote qu'un collègue peut ouvrir et comprendre.
