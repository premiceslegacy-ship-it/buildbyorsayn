# Site Web : offre canonique

## Rôle

Cet accompagnement apprend à créer des sites web avec l'IA pour en tirer des revenus. Le site peut devenir une prestation vendue à des clients, le support d'une nouvelle activité ou la capacité de production d'une agence.

Le point de départ change selon la personne, mais le résultat recherché reste le même : savoir transformer un besoin réel en site clair, livrable, présentable et améliorable. On ne vend ni une page décorative, ni un raccourci magique vers des revenus.

## Promesse

Créer avec l'IA ne consiste pas à demander une page puis à accepter sa première version. Il faut savoir cadrer le projet, donner le bon contexte, faire produire, relire, corriger, mettre en ligne et présenter le résultat comme une prestation ou comme un actif pour sa propre activité.

## Résultat attendu

À la fin, l'accompagné repart avec :

- un site web construit avec l'IA et relié à une offre, une personne et une action précise ;
- une façon de travailler qui permet de produire sans copier-coller aveugle ;
- une prestation de site que l'on peut expliquer, présenter et vendre ;
- une direction visuelle cohérente et personnelle ;
- des pages utilisables sur mobile et ordinateur ;
- un site en ligne que l'on peut relire, corriger et reprendre ;
- les fonctions nécessaires, sans ajouter de complexité pour impressionner ;
- des pages que les moteurs peuvent comprendre ;
- un premier plan concret pour obtenir des demandes ;
- une base réutilisable pour développer une activité, une agence ou une reconversion.

Le résultat commercial dépend ensuite du marché, de l'offre, de la prospection, de la qualité d'exécution et de la régularité. L'accompagnement donne une capacité de production et une méthode, pas une garantie de chiffre d'affaires.

## Publics

### Je démarre

On part des bases utiles pour passer de zéro à un premier site livrable, puis comprendre comment le proposer comme prestation.

### J'ai déjà de l'expérience

On ne refait pas ce qui est acquis. On travaille les décisions qui font encore perdre du temps, de la qualité ou des ventes, afin de produire plus régulièrement.

### Je lance mon activité

On construit un site qui porte une offre claire et aide à présenter le savoir-faire aux premières personnes à contacter.

### Je développe une agence

On transforme une façon de faire personnelle en règles, rôles et méthodes partageables, pour produire avec une équipe sans tout garder dans sa tête.

### Je me reconvertis

On apprend par un projet réel et on repart avec une première offre, un site montrable et une compréhension concrète du métier.

## Format

- Un échange initial de 15 minutes pour comprendre le projet.
- Un diagnostic de 90 minutes si l'accompagnement est pertinent.
- Des sessions adaptées au projet et au point de départ.
- Un seul projet réel comme fil conducteur.
- Des thèmes travaillés dans l'ordre où ils servent le résultat.
- Une relecture avant chaque passage important.
- Un suivi à 30, 60 et 90 jours après la mise en ligne.

La durée exacte et le nombre de sessions dépendent du périmètre, du niveau et des besoins réels. Rien n'est présenté comme un calendrier identique pour tout le monde.

## Thèmes de travail

1. Un projet clair avant de commencer.
2. Un message qui donne envie d'avancer.
3. Une direction qui donne confiance.
4. Des pages cohérentes partout.
5. Construire et mettre en ligne.
6. Ajouter seulement ce qui est nécessaire.
7. Être trouvé par les bonnes personnes.
8. Obtenir des demandes.
9. Améliorer avec le réel.

La liste détaillée est dans `lib/siteWebAccompagnement.ts`. Elle alimente la page de l'offre, l'espace membre et l'export de suivi.

## Principes de travail

- Le résultat économique passe avant l'outil.
- Un site doit pouvoir être vendu, utilisé ou développé, pas seulement montré.
- Le visiteur comprend avant que la technique soit expliquée.
- Une fonction n'entre que si elle sert le projet.
- Une tâche n'est cochée que lorsqu'elle est faite.
- Une personne peut demander une explication à tout moment.
- Une erreur importante est corrigée avant de passer à la suite.
- Une réussite isolée ne devient pas automatiquement une méthode générale.

## Architecture produit

L'accompagnement reste dans BUILD :

- `/accompagnement` : sas pour choisir un accompagnement ;
- `/accompagnement/site-web` : page de l'offre Site Web ;
- `/accompagnement/espace` : thèmes, progression, informations et export ;
- `/accompagnement/formateur` : vue de pilotage réservée au formateur ;
- Supabase `progress` : progression des personnes connectées ;
- `localStorage` : informations de personnalisation et reprise locale ;
- export Markdown : document portable que l'accompagné peut conserver.

Les visuels de proposition sont des compositions BUILD en HTML/CSS. Ils montrent le brief, la construction, la relecture, la mise en ligne et la sortie commerciale. Les vrais logomarks dédiés de ChatGPT, Codex et Claude Code, ainsi que les marques Vercel, Supabase et Stripe, apparaissent dans des étapes auxquelles ils donnent un rôle lisible. Ils ne sont jamais affichés comme une rangée décorative : les outils restent des moyens, la méthode et le résultat économique constituent la valeur de l'accompagnement.

Aucune donnée de connexion ou clé de service ne doit être affichée dans l'interface ou dans un document exporté.
