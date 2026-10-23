---
id: build-coffre-doctrine-connaissance
titre: Donne-lui une identité, une mémoire et le bon contexte
ordre: 4
---

## Ton agent n'a pas besoin de tout savoir

Tes lots sont découpés. Chacun a besoin d'informations, et la tentation est de tout coller dans un seul grand document : ta façon de parler, tes tarifs, les règles du client du jour, tes souvenirs. Résultat : un énorme fichier que tu n'oses plus relire.

L'agent doit savoir trois choses : qui il est, qui tu es et ce que ce projet demande. Ce ne sont pas les mêmes informations. Je te montre quatre fichiers. Chacun répond à une seule question.

## Tu vas construire un cerveau simple à relire

À la fin, tu sauras écrire `SOUL.md`, le fichier qui dit qui est ton agent. Tu comprendras aussi le rôle de `USER.md`, `MEMORY.md` et `AGENTS.md`.

[[schema:QuatreFichiersQuatreQuestions]]

## `SOUL.md` dit qui est ton agent

Ce fichier définit sa personnalité, son ton et sa manière de réagir au doute. Il vit dans `~/.hermes/SOUL.md` (le dossier `.hermes` de ton dossier personnel), ou dans `$HERMES_HOME/SOUL.md` si tu utilises un autre dossier d'accueil.

Il ne contient pas les commandes d'un projet. Il ne contient pas tes secrets. Il ne contient pas la liste des ports d'un serveur.

[[maquette:SoulMdAnnote]]

Voici un exemple prêt à adapter :

```markdown
# Identité

Tu es l'assistant opérationnel d'une petite entreprise de service.

## Ta manière de parler

Tu écris en français simple.
Tu vas droit au fait.
Tu sépares les faits, les suppositions et les questions.

## Ta manière de travailler

Tu prépares le travail avant toute action extérieure.
Tu demandes une validation pour un prix, une promesse ou un envoi.
Tu cites la source utilisée.

## Ce que tu évites

Tu n'inventes jamais une information manquante.
Tu ne caches pas une contradiction.
Tu ne présentes pas une proposition comme une décision prise.
```

Lis-le de haut en bas. Le titre donne son rôle général. La première partie fixe sa voix. La deuxième fixe ses réflexes de travail. La dernière empêche les mauvaises habitudes.

==Une identité stable guide la manière de répondre. Elle ne donne aucun droit d'agir.==

## Les trois autres fichiers ont un autre travail

`USER.md` parle de toi : ton nom, ton rôle, tes préférences et ta manière de travailler. `MEMORY.md` garde ce que l'agent a appris sur son environnement, comme un carnet qu'il tient lui-même.

`AGENTS.md` parle du projet ouvert : les chemins, les commandes, les règles et la manière de vérifier le travail. Il se range dans le dossier du projet, pas dans `~/.hermes`.

[[schema:KnowledgeLayersDiagram]]

La mémoire est chargée au début d'une session, c'est-à-dire à chaque nouvelle conversation. Une information enregistrée pendant la conversation sera pleinement présente dans la session suivante. Relis donc ce qui a été écrit dans `MEMORY.md` de temps en temps.

## Charge seulement ce qui aide la tâche

Un dossier de support n'a pas besoin de toute ta comptabilité. Un rapport publicitaire n'a pas besoin des conversations privées du client.

Pense à un sac de voyage. Tu prends ce qu'il faut pour la destination. Tu ne transportes pas toute ta maison.

[[schema:SacDeContexte]]

:::exemple Maya sépare sa voix et son projet
Maya dirige un studio de design. Elle écrit dans `SOUL.md` que son assistant reste direct, calme et honnête sur le doute.

Dans le projet d'un restaurant, `AGENTS.md` contient les livrables, les dossiers et les validations. Quand elle passe à un autre client, l'identité de l'assistant reste. Les règles du restaurant ne suivent pas.
:::

## À toi de jouer

Compte quarante minutes.

1. Ouvre `~/.hermes/SOUL.md`.
2. Écris son rôle, sa voix, ses réflexes et ses interdits.
3. Retire toute règle propre à un seul projet.
4. Crée un `AGENTS.md` dans ton dossier d'essai avec ses règles locales.

À la fin, tu as une identité générale et un projet séparé.

## Version pour ton IA

```text
Aide-moi à relire mon fichier SOUL.md.

Classe chaque phrase dans une catégorie :
1. identité générale ;
2. préférence utilisateur ;
3. souvenir appris ;
4. règle propre à un projet ;
5. secret ou donnée à retirer.

Propose ensuite une version courte de SOUL.md.
Garde uniquement l'identité, le ton, la manière de travailler et les habitudes à éviter.
Ne déplace aucun secret dans un autre fichier.
```

## La suite

Ton agent sait comment se comporter et où trouver les règles du projet. Il est prêt à recevoir un vrai message : un prospect qui écrit sur Telegram, au prochain chapitre.
