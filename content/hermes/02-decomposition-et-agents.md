---
id: build-coffre-doctrine-decomposition
titre: Découpe le travail pour pouvoir le reprendre
ordre: 4
---

## Une mission trop grande cache les erreurs

Tu sais maintenant où ton travail bloque. Tu peux être tenté de tout confier d'un bloc : « Gère mes prospects ». Cette phrase mélange la recherche, le tri, la réponse, le devis et la relance. Quand le résultat est mauvais, tu ne sais pas quelle partie corriger.

Découpe le travail comme un chantier. Chaque corps de métier reçoit une zone claire et passe le relais avec quelque chose de visible : le plaquiste laisse un mur prêt à peindre, le peintre n'a pas à deviner.

## Tu vas transformer une grosse mission en petits lots

À la fin, chaque lot aura une entrée, une sortie, une source et une personne responsable. Tu sauras aussi quand l'agent doit s'arrêter au lieu d'improviser.

[[schema:DecompositionDiagram]]

## Coupe selon ce qui doit sortir

Ne commence pas par créer cinq personnages d'IA avec un prénom chacun. Commence par les résultats dont tu as besoin.

Pour un devis, tu peux avoir quatre lots, dans cet ordre :

1. vérifier les pièces reçues (photos, mesures) ;
2. relever les besoins du client ;
3. préparer le brouillon du devis ;
4. te demander ta validation.

Chaque lot produit un objet que tu peux ouvrir : une liste de pièces, une fiche de besoins, un brouillon, un message de validation.

[[schema:DevisEnQuatreLots]]

Pourquoi ? Parce qu'un lot sans sortie visible ressemble à « réfléchis bien ». Personne ne sait s'il est fini.

==Tu découpes par résultat, pas par personnage.==

## Donne un contrat simple à chaque lot

Pour chaque lot, écris six lignes. Ce qui entre. Ce qui doit sortir. La source qui fait foi (le fichier ou l'outil qu'on croit en cas de doute). Ce qui est interdit. La personne qui valide. La raison d'arrêter.

Si deux lots ont besoin de la même donnée, par exemple ton tarif horaire, pointe vers la même source. Ne copie pas la valeur dans plusieurs prompts : le jour où le tarif change, tu en oublierais un.

[[schema:CarteContratDuLot]]

Pense à un bon de travail sur un chantier. Il ne raconte pas toute l'entreprise. Il dit ce qui doit être fait ici, avec quelles pièces, et qui signe.

## Garde les spécialistes pour les vraies différences

Un sous-agent est un deuxième agent que le premier appelle pour un travail à part. Il est utile quand un lot demande un autre métier ou une autre source. Il ne sert à rien s'il ne fait que remplir un organigramme.

L'agent principal peut lui demander une recherche sur la concurrence, puis reprendre le résultat. Le spécialiste ne publie pas la campagne. Il rend un dossier avec ses sources.

:::exemple Nora prépare ses publicités
Nora vend des cosmétiques. Elle veut produire une campagne.

Elle sépare la recherche client, les angles, les visuels et le rapport. La recherche donne cinq faits sourcés. Le travail créatif donne six variantes. Nora en choisit deux avant tout lancement.

Quand une pub fonctionne mal, elle sait si c'est l'angle ou le visuel qu'il faut changer.
:::

## À toi de jouer

Compte trente minutes.

1. Écris en une phrase le résultat final de ta mission.
2. Coupe-le en trois à cinq sorties visibles.
3. Donne une source et un responsable à chaque sortie.
4. Écris une raison d'arrêt par lot.

À la fin, tu as une carte de travail qu'une autre personne peut suivre.

## Version pour ton IA

```text
Voici le résultat final : [résultat].
Voici les sources disponibles : [sources].

Découpe le travail en trois à cinq lots maximum.
Pour chaque lot, donne :
1. ce qui entre ;
2. ce qui doit sortir ;
3. la source qui fait foi ;
4. ce qui reste interdit ;
5. la personne qui valide ;
6. la raison d'arrêter.

Ne crée pas de sous-agent si un lot simple suffit.
Signale les dépendances entre les lots.
```

## La suite

Tes lots sont clairs, mais chacun a besoin de bonnes informations. On va voir comment les lui donner dans quatre fichiers, sans charger toute ton entreprise.
