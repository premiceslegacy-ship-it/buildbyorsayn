# Site Web by AI : offre canonique

## Rôle

Cette offre accompagne une personne ou une équipe pour concevoir, construire, lancer et rendre reproductible un système de production web avec l'IA.

Elle ne vend pas un site magique. Elle transmet une capacité de décision et d'exécution qui reste utile lorsque le modèle, l'IDE ou l'hébergeur change.

## Résultat attendu

À la fin, l'accompagné possède :

- un site relié à une offre, une cible, une action et des canaux réels ;
- une méthode de recherche visuelle qui transforme des références en règles sans les copier ;
- un design system agent-ready, rendu et suffisamment précis pour être prolongé ;
- un repository versionné, une preview, une production et une procédure de reprise ;
- un socle SEO, GEO et Search Console mesurable ;
- un plan d'acquisition honnête qui ne fait pas croire qu'un site crée seul la demande ;
- un registre de patterns, SOPs, skills, tests et assets candidats issus du travail réel ;
- un document de suivi à 30, 60 et 90 jours.

## Publics

### Débutant

Les bases du web, du layout et de la mise en ligne sont obligatoires. Le passage au palier suivant exige une preuve construite et expliquée.

### Expérimenté

Les acquis sont testés. Une compétence démontrée est compressée. Le temps libéré est déplacé vers le jugement, le système, les branches connectées, l'acquisition et la capitalisation.

### Agence

Chaque étape sépare ce qui relève du jugement d'un senior, d'un process stable, d'un skill, d'un contrôle humain et d'une validation client. L'objectif supplémentaire est la transmissibilité sans baisse silencieuse de qualité.

## Format

- Diagnostic initial de 90 minutes.
- Huit semaines de construction, adaptées au niveau.
- Une ou deux sessions par semaine selon le palier.
- Travail sur un projet fil rouge réel.
- Validation par preuves, pas par temps passé ni vidéos regardées.
- Revue de clôture.
- Plan de suivi 30, 60 et 90 jours.

Le prix et la capacité ne sont pas inventés dans ce document. Ils sont décidés par Samuel selon le périmètre, le niveau, le nombre de sessions et le risque du projet.

## Progression

1. Diagnostic et preuve finale.
2. Fondations web.
3. Business, message et copy.
4. Références et direction artistique.
5. Design system et assets.
6. Build, Git et déploiement.
7. Branche connectée lorsque nécessaire.
8. SEO, GEO, Search Console et agent SEO borné.
9. Lancement et acquisition.
10. QA, passation et capitalisation.

La définition détaillée de chaque palier vit dans `lib/siteWebAccompagnement.ts` et alimente l'espace membre.

## Garde-fous commerciaux

- Le site n'est jamais présenté comme un canal d'acquisition autonome.
- Le SEO et le GEO sont décrits comme des actifs qui mûrissent, pas comme une promesse de court terme.
- Aucun témoignage, chiffre, délai de résultat ou rareté n'est inventé.
- Le call initial diagnostique avant de prescrire.
- Le parcours saute ce qui est démontré, jamais ce qui est seulement déclaré.
- Une réussite isolée reste un pattern candidat.

## Architecture produit retenue

L'offre et l'espace de progression sont intégrés à BUILD :

- `/accompagnement` : page publique de l'offre ;
- `/accompagnement/espace` : progression, personnalisation et export du suivi ;
- Supabase `progress` : synchronisation des preuves lorsque l'utilisateur est connecté ;
- localStorage : copie locale et personnalisation sans donnée sensible ;
- export Markdown : document portable et possédé par l'accompagné.

Neon n'est pas ajouté. BUILD possède déjà l'auth et la table de progression dans Supabase. Une seconde base créerait une frontière de données et des opérations supplémentaires sans bénéfice pour cette V1.
