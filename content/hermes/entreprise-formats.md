---
id: build-agentique-entreprise-formats
titre: Range chaque information là où elle reste vraie
ordre: 15
---

## Une information copiée cinq fois finit fausse quelque part

Ton dossier voyage, et avec lui le prix, la date, la version. Mercredi, le prix passe de 1 200 à 1 350 euros dans le CRM (exemple). L'ancien montant reste dans Notion, dans Slack et dans un prompt. Vendredi, l'agent répond au client avec 1 200 euros.

Ce n'est pas un problème d'IA. Tu as trop de copies sans propriétaire.

## Tu vas choisir une maison pour chaque information

À la fin, tu auras une table d'une page. Elle dit où vit un fait qui change, où vit une règle, où vit un document, et où poser un échange et un index de recherche.

[[schema:DataFormatsDiagram]]

## L'endroit qui fait foi doit être nommé

Le CRM garde l'état du prospect. Stripe garde le paiement. Le calendrier garde le rendez-vous. Le dossier projet garde le livrable.

Une note peut résumer ces données. Elle doit alors pointer vers l'origine, avec un lien, et indiquer quand elle l'a lue : « prix lu dans le CRM le 12 octobre à 9 h ».

[[schema:SourceEtCopiesDatees]]

Pense à une horloge. Tu peux avoir dix écrans qui affichent l'heure, mais tu les règles tous sur la même référence.

==Une copie utile porte toujours sa source et sa date.==

## Choisis le format selon le travail

Un format, c'est la forme du fichier où tu ranges l'information. Markdown (un fichier texte simple, comme `SOUL.md`) convient aux règles et aux méthodes que des humains relisent. Une base de données (Notion, Airtable) convient aux objets qui changent souvent, comme les devis. JSON convient à un échange précis entre deux logiciels : une ligne par champ, lisible par une machine.

Un index de recherche, c'est la table des matières qui aide à retrouver un document. Il ne devient jamais la source d'origine.

[[schema:QuatreFormatsQuatreUsages]]

## Prévois ce qui se passe quand une valeur change

Si le prix change, quelles copies deviennent anciennes ? Si un contact demande la suppression de ses données, quels index doivent suivre ?

Écris la règle de mise à jour avant de multiplier les copies. Sinon, l'agent doit deviner laquelle croire.

[[schema:ValeurQuiChange]]

:::exemple Le suivi client garde une seule date
Une coach suit ses appels dans Notion et Google Agenda. La date du prochain appel vit dans le calendrier.

La fiche Notion affiche une copie datée, avec un lien vers l'événement. Si la date change, le workflow relit le calendrier avant toute relance.

Le message WhatsApp ne devient jamais la source du planning.
:::

## À toi de jouer

Compte trente minutes.

1. Liste dix informations de ton premier workflow : prix, date de rendez-vous, statut du paiement, ton de voix…
2. Pour chacune, écris l'endroit qui fait foi.
3. Ajoute une date de lecture à chaque copie.
4. Écris ce qui se passe quand la valeur change.

À la fin, ton agent sait où relire au lieu de choisir au hasard.

## Version pour ton IA

```text
Voici les informations utilisées par mon workflow : [liste].

Pour chacune, propose :
1. l'endroit qui fait foi ;
2. le propriétaire humain ;
3. le format adapté ;
4. la date ou version à garder ;
5. les copies connues ;
6. ce qui se passe quand la valeur change.

Signale toute information copiée sans source.
Ne choisis pas un index de recherche comme origine.
```

## La suite

Chaque information a sa maison. Il reste le savoir-faire de l'équipe, que tu vas écrire sous forme de skill : un dossier qu'on peut relire et tester.
