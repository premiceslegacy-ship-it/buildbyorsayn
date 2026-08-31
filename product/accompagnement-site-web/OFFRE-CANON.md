# Vendre des sites web avec l'IA : offre canonique

## Rôle

Cet accompagnement aide à vendre des sites web créés avec l'IA et à structurer l'activité autour : offre, acquisition, vente, production, livraison, marge et croissance. Le site n'est pas un asset secondaire : c'est le service vendu.

Le point de départ change selon la personne, mais le résultat recherché reste le même : savoir transformer un besoin réel en site web compréhensible, vendable, livrable et améliorable. On ne vend ni une page décorative, ni un raccourci magique vers des revenus.

Le gain recherché est concret : disposer d'une capacité de production comparable à une petite équipe de développeurs à portée de main grâce à l'IA, puis savoir l'utiliser avec assez de méthode pour vendre et livrer davantage sans abandonner la qualité ni la marge.

## Promesse

Créer un site avec l'IA ne consiste pas à demander un livrable puis à accepter sa première version. Il faut savoir cadrer le problème du client, choisir une offre de site, donner le bon contexte, produire, relire, corriger, vendre, livrer et apprendre du réel pour améliorer le site suivant.

## Résultat attendu

À la fin, l'accompagné repart avec :

- une offre de sites web claire, reliée à un problème, une entreprise et une valeur précise ;
- une façon de travailler avec l'IA qui permet de produire plus vite, plus souvent et sans copier-coller aveugle ;
- un site et des preuves utiles pour expliquer, rassurer et vendre ;
- une proposition commerciale que l'on peut présenter et faire évoluer ;
- un parcours simple entre demande, conversation, vente et livraison ;
- les outils et connexions nécessaires, sans ajouter de complexité pour impressionner ;
- des contenus et supports compréhensibles par les entreprises ciblées ;
- un premier plan concret pour obtenir des demandes de sites et des ventes ;
- une base réutilisable pour produire davantage de sites sans perdre la marge.

Le résultat commercial dépend ensuite du marché, de l'offre, de la prospection, de la qualité d'exécution et de la régularité. L'accompagnement donne une capacité de production et une méthode, pas une garantie de chiffre d'affaires.

## Publics

### Je démarre

On part des bases utiles pour passer de zéro à une première offre de site présentable, puis comprendre comment la proposer et la livrer.

### J'ai déjà de l'expérience

On ne refait pas ce qui est acquis. On travaille les décisions qui font encore perdre du temps, de la marge ou des ventes de sites, afin de produire et livrer plus régulièrement.

### Je lance mon activité

On construit une offre de site claire, les preuves qui la rendent compréhensible et un premier chemin pour la présenter aux bonnes entreprises.

### Je développe une agence

On transforme une façon de vendre et produire des sites en règles, rôles et méthodes partageables, pour augmenter le volume avec une équipe sans tout garder dans sa tête.

### Je me reconvertis

On apprend par un projet réel et on repart avec une première offre de site, un site montrable et une compréhension concrète du métier.

## Format

- Un échange initial de 15 minutes pour comprendre le projet.
- Un diagnostic de 90 minutes si l'accompagnement est pertinent.
- Des sessions adaptées au projet et au point de départ.
- Un seul projet réel comme fil conducteur.
- Des thèmes travaillés dans l'ordre où ils servent le résultat.
- Une relecture avant chaque passage important.
- Un suivi à 30, 60 et 90 jours après les premières ventes ou livraisons.

La durée exacte et le nombre de sessions dépendent du périmètre, du niveau et des besoins réels. Rien n'est présenté comme un calendrier identique pour tout le monde.

## Thèmes de travail

1. Une activité de sites web claire avant de commencer.
2. Une offre de sites web que les bons clients comprennent.
3. Des références pour créer des sites qui donnent confiance.
4. Une base de production web que tu peux réutiliser.
5. Construire et livrer les sites que tu peux vendre.
6. Relier tes sites à la vente et à la livraison.
7. Être trouvé par les entreprises qui ont besoin d'un site.
8. Obtenir des demandes et vendre des sites.
9. Améliorer les ventes de sites et protéger la marge.

La liste détaillée est dans `lib/siteWebAccompagnement.ts`. Elle alimente la page de l'offre, l'espace membre et l'export de suivi.

## Principes de travail

- Le résultat économique passe avant l'outil.
- Le site doit pouvoir être vendu, livré et amélioré, pas seulement montré.
- Le visiteur comprend avant que la technique soit expliquée.
- Une fonction n'entre que si elle sert le projet.
- Une tâche n'est cochée que lorsqu'elle est faite.
- Une personne peut demander une explication à tout moment.
- Une erreur importante est corrigée avant de passer à la suite.
- Une réussite isolée ne devient pas automatiquement une méthode générale.

## Architecture produit

L'accompagnement reste dans BUILD :

- `/accompagnement` : sas pour choisir un accompagnement ;
- `/accompagnement/site-web` : page de l'offre activité, avec un slug historique conservé pour la compatibilité ;
- `/accompagnement/espace` : thèmes, progression, informations et export ;
- `/accompagnement/formateur` : vue de pilotage réservée au formateur ;
- Supabase `accompaniment_assignments` : affectation, parcours, période, statut et thèmes autorisés ;
- Supabase `progress` : progression des personnes connectées ;
- Supabase `accompaniment_workspace_context` : activité, projet, URL et notes partagées entre le formé et le formateur ;
- `localStorage` : secours de reprise locale, jamais source d'autorité pour l'accès ou le contexte partagé ;
- export Markdown : document portable que l'accompagné peut conserver.

Les visuels de proposition sont des compositions BUILD en HTML/CSS. Ils montrent le cadrage, la production d'assets, la relecture, la vente, la livraison et l'apprentissage. Les vrais logomarks dédiés de ChatGPT, Codex et Claude Code, ainsi que les marques Vercel, Supabase et Stripe, apparaissent dans des étapes auxquelles ils donnent un rôle lisible. Ils ne sont jamais affichés comme une rangée décorative : les outils restent des moyens, la méthode et le résultat économique constituent la valeur de l'accompagnement.

Aucune donnée de connexion ou clé de service ne doit être affichée dans l'interface ou dans un document exporté.
