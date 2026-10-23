---
id: build-agentique-entreprise-formats
titre: Range chaque information là où elle reste vraie
ordre: 15
---

## Une information copiée cinq fois finit fausse quelque part

Le prix change dans le CRM. L'ancien montant reste dans Notion, Slack et un prompt. Deux jours plus tard, l'agent utilise la mauvaise version.

Tu n'as pas un problème d'IA. Tu as trop de copies sans propriétaire.

## Tu vas choisir une maison pour chaque information

À la fin, tu sauras où garder un fait vivant, une règle et un document. Tu sauras aussi où placer un échange et un index de recherche.

[[schema:DataFormatsDiagram]]

## L'endroit qui fait foi doit être nommé

Le CRM garde l'état du prospect. Stripe garde le paiement. Le calendrier garde le rendez-vous. Le dossier projet garde le livrable.

Une note peut résumer ces données. Elle doit pointer vers l'origine et indiquer quand elle a été lue.

[[schema:SourceEtCopiesDatees]]

Pense à une horloge. Tu peux avoir plusieurs écrans, mais tu règles l'heure depuis la même référence.

==Une copie utile porte toujours sa source et sa date.==

## Choisis le format selon le travail

Markdown convient aux règles et méthodes que les humains relisent. Une base convient aux objets qui changent souvent. JSON convient à un échange précis entre deux logiciels.

Un index de recherche aide à retrouver. Il ne devient pas la source d'origine.

[[schema:QuatreFormatsQuatreUsages]]

## Prévois ce qui se passe quand une valeur change

Si un prix change, quelles copies deviennent anciennes ? Si un contact demande une suppression, quels index doivent suivre ?

Écris la règle de mise à jour avant de multiplier les copies. Sinon, l'agent doit deviner laquelle croire.

[[schema:ValeurQuiChange]]

:::exemple Le suivi client garde une seule date
Une coach suit ses appels dans Notion et Google Agenda. La date du prochain appel vit dans le calendrier.

La fiche Notion affiche une copie datée avec un lien. Si la date change, le workflow relit le calendrier avant toute relance.

Le message WhatsApp ne devient jamais la source de planning.
:::

## À toi de jouer

Compte trente minutes.

1. Liste dix informations de ton premier workflow.
2. Nomme l'endroit qui fait foi pour chacune.
3. Ajoute une date aux copies.
4. Écris ce qui se passe quand la valeur change.

À la fin, ton agent sait où relire au lieu de choisir au hasard.

## Version pour ton IA

```text
Voici les informations utilisées par mon workflow : [liste].

Pour chacune, propose :
1. l'endroit qui fait foi ;
2. le propriétaire humain ;
3. le format adapté ;
4. la date ou version à garder ;
5. les copies connues ;
6. ce qui se passe quand la valeur change.

Signale toute information copiée sans source.
Ne choisis pas un index de recherche comme origine.
```

## La suite

Chaque information a sa maison. Tu peux maintenant transformer le savoir-faire de l'équipe en skill clair et testable.
