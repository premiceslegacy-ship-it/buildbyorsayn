# RÈGLES DE DÉVELOPPEMENT - PROJET BUILD_

# CONTEXTE GLOBAL DU PROJET
Avant de prendre des décisions d'architecture ou de design, réfère-toi toujours aux spécifications situées dans le dossier `/docs/` :
- Pour les fonctionnalités et la base de données : lis `/docs/prd.md`
- Pour les règles visuelles et l'UI : lis `/docs/design system.md`
- Pour le ton et le copywriting : lis `/docs/brand system.md`

## 1. Interdiction stricte de modifier l'UI
- L'interface actuelle (Tailwind, Liquid Glass, couleurs Dark Premium) est VALIDÉE.
- Tu n'as PAS le droit de modifier les classes CSS existantes, de supprimer des <div>, ou de changer la typographie.
- Si tu dois afficher des erreurs ou des états de chargement, tu dois utiliser le style visuel existant de l'application (couleurs #0e0e0f, #f0ede8, #e8d5b0).

## 2. Architecture des données (Backend Supabase)
- TOUS les appels à Supabase doivent être centralisés dans un dossier `/lib/data/` ou `/lib/supabase/`. 
- Interdiction de mettre des requêtes SQL directement dans les composants React.
- Utilise l'authentification native Supabase (supabase.auth).

## 3. Sécurité (Secure By Design)
- Aucune clé API dans le code. Utilise uniquement les variables d'environnement.
- Gère silencieusement les erreurs techniques (console.error) et affiche des messages génériques et humains à l'utilisateur.