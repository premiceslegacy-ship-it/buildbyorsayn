`---`  
`name: oracle-by-orsayn`  
`description: "Framework ORACLE by Orsayn pour cadrer et construire des apps, SaaS, outils internes, plateformes métier, cockpits opérateurs et interfaces avec agents IA intégrés. Utilise ce skill dès que l'utilisateur mentionne la création d'une app, d'un SaaS, d'un dashboard, d'une plateforme avec auth, d'un espace membre, d'un outil métier, d'une interface avec BDD, d'un produit IA ou demande comment construire un projet avec Claude Code, Cursor ou Codex. ORACLE accompagne l'utilisateur non technique, produit les documents fondateurs, choisit le mode de déploiement adapté (per-client, SaaS, AaaS intégré, cockpit, hybride), puis délègue le backend à expert-backend et l'UX/UI à ux-ui-design. S'adapte au secteur, au niveau de maturité, à la stack, aux contraintes client et aux pivots possibles."`  
`---`  
`# ORACLE by Orsayn — Framework App, SaaS, AaaS intégré & Cockpit`  
`## Règles critiques — À retenir sur tout le projet`  
`Ces règles s'appliquent à chaque décision, chaque session, chaque composant. Elles ne se négocient pas.`  
`1. **Interview obligatoire et pédagogique** — Commencer par la Couche 1 : l'utilisateur décrit son idée en langage naturel. ORACLE pose des questions métier simples, puis traduit les réponses en décisions produit/techniques. Jamais demander à l'utilisateur d'être architecte.`  
``2. **UX/UI délégué** — Tout ce qui est visuel (BRAND-SYSTEM, DESIGN-SYSTEM, maquettes) est produit par le skill `ux-ui-design`. Ne jamais prendre de décision visuelle sans lui.``  
``3. **Backend délégué** — Toute décision d'architecture backend, sécurité, schéma BDD, patterns API, RLS est produite par le skill `expert-backend`. Ne jamais prendre de décision technique lourde sans lui.``  
`4. **ORSAYN-PROJECT.md d'abord** — Après l'interview, créer le document de cadrage qui choisit le mode : per-client, SaaS, AaaS intégré, cockpit, outil interne ou hybride.`  
`5. **Ordre des couches inviolable** — Jamais de code avant que ORSAYN-PROJECT + BRIEF + BRAND + DESIGN + DATA-MODEL + SECURITY-MODEL + PRD + USER-FLOWS + PROMPT-SYSTEM soient validés.`  
`6. **Stack adaptable** — Cloudflare/Supabase est le défaut Orsayn, mais Vercel, Stripe, Clerk, Neon, Paddle ou autre sont autorisés si le contexte le justifie. Toute exception est documentée dans ORSAYN-PROJECT.md.`  
`7. **Agents IA invisibles** — Les agents ne sont pas livrés comme produits bruts aux entreprises. Ils sont intégrés dans l'interface comme assistants, automatisations, recommandations ou workflows discrets.`  
`8. **RLS sur toutes les tables sensibles** — Activer et tester avant de coder la feature qui utilise la table. Tester avec deux comptes/organisations quand l'isolation est pertinente.`  
`9. **Zéro service_role côté client** — Jamais. Le service_role bypass RLS et expose toutes les données.`  
`10. **Zod sur tous les inputs** — Côté serveur, sur toutes les routes API et Server Actions.`  
`11. **Limites et permissions côté serveur** — Jamais uniquement côté client. Plans, quotas, modules et permissions sont vérifiés côté serveur.`  
`12. **Les 4 états obligatoires** — Tout composant data : LOADING (skeleton) · EMPTY (message humain + CTA) · ERROR (phrase humaine + action) · SUCCESS.`  
``13. **Zéro logique métier dans les composants React** — Tous les appels BDD et la logique métier dans `/lib/`.``  
`14. **Webhooks signés** — Stripe, WhatsApp, paiement, CRM, cockpit ou autre : chaque webhook vérifie sa signature avant traitement.`  
`15. **Un CRITIQUE en audit bloque la livraison** — Toujours, sans exception.`  
`---`  
`## Philosophie`  
`Une app métier, un SaaS ou un cockpit sans architecture solide, c'est de la dette technique dès le premier commit. La différence entre un produit qui évolue et un produit qu'on réécrit en 6 mois, c'est la qualité de ce qui est pensé avant que la première ligne de code soit écrite.`  
`> Un projet construit sans les couches 1, 2 et 3, c'est construire un immeuble sans plan d'architecte.`  
`---`  
`## Portée ORACLE by Orsayn`  
   
`Ce skill couvre les projets applicatifs de l'écosystème Orsayn, sans supposer que l'utilisateur connaît les termes techniques.`  
`- **Auth complète** — inscription, connexion, sessions, refresh tokens, MFA`  
`- **Modèle de données** — schéma BDD, relations, RLS, migrations`  
`- **Déploiement adaptable** — per-client, SaaS multi-tenant, cockpit, outil interne, hybride`  
`- **Monétisation adaptable** — abonnement, usage-based, licence client, forfait agence, interne, sans paiement`  
`- **Multi-tenant ou per-client** — isolation par infrastructure, RLS, organisation/workspace ou utilisateur`  
`- **Rôles et permissions** — admin, member, viewer, custom roles`  
`- **Onboarding** — activation, empty states, time-to-value`  
`- **Dashboard et data** — métriques, graphes, exports, états complexes`  
`- **Real-time** — notifications, mises à jour live, présence`  
`- **API et webhooks** — pour les intégrations tierces`  
`- **Agents IA intégrés** — assistants et automatisations dans l'interface, rarement exposés comme agents autonomes`  
`- **Rétention** — emails transactionnels, séquences, in-app notifications`  
`---`  
`## Couche 1 — Interview de démarrage`  
`Cette couche remplace le master prompt externe. Le skill conduit lui-même l'interview, pose les bonnes questions, synthétise les réponses, puis enchaîne directement sur la Couche 2.`  
`**Dès qu'un utilisateur active ce skill, démarrer immédiatement par cette phrase :**`  
`> "Décris-moi ton projet comme tu l'as dans la tête — en langage naturel, sans structure imposée. Dis-moi ce que c'est, pour qui, pourquoi maintenant, et ce que tu imagines concrètement. Je poserai ensuite les questions nécessaires pour cadrer tout ça précisément."`  
`---`  
`### Protocole d'interview — 3 phases`  
`**Phase 1 — Écoute libre**`  
`L'utilisateur décrit son projet librement. Ne pas interrompre, ne pas poser de questions pendant cette phase. Laisser la description se déployer complètement.`  
`Une fois la description terminée, reformuler en 3 lignes ce qu'on a compris :`  
`- Ce que c'est (le produit)`  
`- Pour qui (l'utilisateur cible)`  
`- Ce que ça résout (le problème réel)`  
`Demander confirmation : "C'est bien ça ?"`  
`---`  
`**Phase 2 — Questions de précision**`  
`Sur la base de la description libre, identifier les zones floues et poser les questions manquantes. Ne jamais poser plus de 3 questions à la fois. Regrouper les questions par thème.`  
`Questions à couvrir obligatoirement (adapter l'ordre selon ce qui a déjà été dit). Formuler en langage métier, puis traduire techniquement dans ORSAYN-PROJECT.md.`  
`**Sur le produit**`  
`- Quel est le type d'outil dans tes mots ? (outil métier, dashboard, assistant, portail client, app interne, plateforme...)`  
`- Quelle est la fonctionnalité core — celle sans laquelle le produit n'existe pas ?`  
`- Qu'est-ce que ce produit n'est PAS ? (poser si les frontières ne sont pas claires)`  
`**Sur l'utilisateur et son problème**`  
`- Qui est l'utilisateur principal ? (titre, taille d'entreprise, outil qu'il utilise aujourd'hui)`  
`- Quel est son problème concret — ce qu'il fait aujourd'hui et pourquoi c'est insuffisant ?`  
`- Qu'est-ce qui le ferait abandonner le produit après 7 jours ?`  
`**Sur le modèle économique**`  
`- Comment le produit se monétise ? (freemium / abonnement / usage-based / interne / pas encore)`  
`- Si abonnement : quels plans envisagés ? Qu'est-ce qui est gratuit et pourquoi ?`  
`- Quel est l'indicateur North Star — la métrique qui prouve que le produit crée de la valeur ?`  
`**Sur l'isolation et les accès**`  
`- Est-ce que chaque client doit avoir son espace totalement isolé, ou est-ce acceptable que plusieurs clients utilisent la même plateforme avec des accès séparés ?`  
`- Qui a le droit de voir quoi ? Une personne seule, une équipe, plusieurs agences/cabinets/entreprises ?`  
`- Faut-il des connexions simples (email/mot de passe, magic link) ou des accès entreprise (Google, Microsoft, SSO) ?`  
`- Des données sensibles ? Santé, finance, contrats, pièces d'identité, données client, données enfants, secrets métier ?`  
`**Sur les intégrations**`  
`- Intégrations bloquantes pour le lancement ? (sans lesquelles le produit ne peut pas sortir)`  
`- Des outils déjà en place à connecter ? (CRM, email, analytics, support)`  
`- Des automatisations nécessaires ? (webhooks, Make/n8n, notifications)`  
`**Sur l'IA**`  
`- L'IA aide l'utilisateur à faire quoi concrètement ? Générer, résumer, classer, vérifier, relancer, recommander, automatiser ?`  
`- L'IA doit-elle être visible comme un assistant, ou plutôt agir discrètement dans le workflow ?`  
`- Que doit-il se passer si l'IA échoue ou répond mal ?`  
`**Sur les contraintes de déploiement**`  
`- Le client impose-t-il un hébergeur, un domaine, un outil de paiement, un CRM ou des règles de sécurité ?`  
`- Est-ce un projet à déployer pour un seul client, plusieurs clients séparés, ou une plateforme commune ?`  
`- Faut-il pouvoir pivoter vite si le marché ou le client change d'avis ?`  
`**Sur le contexte**`  
`- Qui construit ? (solo / équipe / agence — niveau technique disponible)`  
`- Quel objectif à 90 jours ? (MRR cible, nombre d'utilisateurs, validation d'hypothèse)`  
`- Quels sont les 2-3 concurrents directs et pourquoi l'utilisateur choisirait ce produit ?`  
`**Sur le design**`  
`- Des références visuelles ou des apps que tu aimes ? (positif et négatif)`  
`- Un registre attendu ? (dense / épuré / data-heavy / grand public)`  
`- Des contraintes d'identité existantes ? (logo, charte, couleurs déjà définies)`  
`---`  
`**Phase 3 — Synthèse et confirmation**`  
`Une fois toutes les zones couvertes, produire une synthèse structurée :`  
```` ``` ````  
`SYNTHÈSE DU PROJET`  
`==================`  
`Nom du produit : [nom]`  
`Type : [type d'app exact]`  
`Secteur : [secteur]`  
`Le problème résolu :`  
`[en 2 phrases — le vrai problème, pas la solution]`  
`L'utilisateur principal :`  
`[profil précis + contexte d'usage + ce qui le ferait partir]`  
`La fonctionnalité core :`  
`[une seule chose, clairement nommée]`  
`Le modèle économique :`  
`[type + plans envisagés + North Star metric]`  
`L'architecture :`  
`[mode détecté + isolation + auth + données sensibles]`  
`Les concurrents :`  
`[3 max avec pourquoi l'utilisateur choisirait ce produit]`  
`Les intégrations requises :`  
`[liste précise avec priorité lancement]`  
`Le contexte builder :`  
`[qui construit + niveau technique + objectif 90j]`  
`Le registre visuel :`  
`[3 mots + références + anti-références]`  
   
`Traduction ORACLE :`  
`[mode probable : per-client / SaaS / AaaS intégré / cockpit / hybride]`  
`[criticité : faible / moyenne / élevée / réglementée]`  
`[stack pressentie + exceptions à valider]`  
`[skills à déléguer + moment d'intervention]`  
```` ``` ````  
`Demander confirmation : "Est-ce que cette synthèse capture bien ton projet ? Des corrections ou des précisions avant qu'on passe à la suite ?"`  
`Une fois confirmée, enchaîner directement sur la Couche 2 sans attendre d'instruction supplémentaire.`  
`---`  
`## Couche 2 — Les 9 documents fondateurs`  
``L'ordre est inviolable. ORSAYN-PROJECT.md est créé en premier, juste après l'interview confirmée. Les documents BRAND et DESIGN sont délégués au skill `ux-ui-design`. DATA-MODEL.md et SECURITY-MODEL.md sont produits ou validés par `expert-backend`.``  
```` ``` ````  
`ORSAYN-PROJECT.md → BRIEF.md`  
`→ [ux-ui-design] BRAND-SYSTEM.md → [ux-ui-design] DESIGN-SYSTEM.md`  
`→ [expert-backend] DATA-MODEL.md + SECURITY-MODEL.md`  
`→ PRD.md → USER-FLOWS.md → PROMPT-SYSTEM.md`  
```` ``` ````  
``> **Documents BRAND & DESIGN — délégués à `ux-ui-design`**``  
`> Active ce skill avec ORSAYN-PROJECT.md + BRIEF.md et demande-lui de produire BRAND-SYSTEM.md`  
`> puis DESIGN-SYSTEM.md. Reviens ici avec les deux fichiers validés.`  
   
``> **Documents DATA & SECURITY — délégués à `expert-backend`**``  
`> Active ce skill avec ORSAYN-PROJECT.md, BRIEF.md, BRAND-SYSTEM.md et DESIGN-SYSTEM.md.`  
`> Il produit ou valide DATA-MODEL.md, SECURITY-MODEL.md et les décisions de déploiement.`  
`---`  
`### Document 1 — ORSAYN-PROJECT.md`  
   
`**Rôle :** le sas d'adaptation. Il transforme l'interview métier en cadrage Orsayn : mode de déploiement, verticale, criticité, stack pressentie, exceptions, pivots possibles et délégations.`  
   
`**Prompt de production :**`  
   
```` ``` ````  
`Produis ORSAYN-PROJECT.md pour [nom du produit].`  
`Utilise la synthèse d'interview comme source unique.`  
   
`1. IDENTITÉ DU PROJET`  
  `Nom provisoire.`  
  `Type d'outil exprimé en langage utilisateur.`  
  `Secteur / verticale.`  
  `Utilisateur principal.`  
  `Objectif à 30/90 jours.`  
   
`2. MODE ORSAYN DÉTECTÉ`  
  `Mode principal : per-client / SaaS multi-tenant / AaaS intégré / cockpit opérateur / outil interne / hybride.`  
  `Niveau de confiance : élevé / moyen / faible.`  
  `Pourquoi ce mode semble adapté.`  
  `Ce qui ferait changer de mode.`  
   
`3. TRADUCTION TECHNIQUE NON-JARGON`  
  `Reformuler chaque décision technique en phrase compréhensible.`  
  `Exemple : "chaque cabinet a sa propre base" plutôt que seulement "per-client".`  
  `Lister les décisions encore incertaines.`  
   
`4. STACK PRESSENTIE`  
  `Défaut Orsayn : Next.js + Supabase + Cloudflare/OpenNext + Resend + Sentry.`  
  `Exceptions possibles : Vercel, Stripe, Paddle, Clerk, Neon, provider IA spécifique, hébergeur imposé.`  
  `Pour chaque exception : raison → impact → risque → décision.`  
   
`5. DONNÉES ET CRITICITÉ`  
  `Données manipulées.`  
  `Données sensibles.`  
  `Niveau de criticité : faible / moyen / élevé / réglementé.`  
  `Compliance à valider : RGPD, HDS, finance, Factur-X, eIDAS, autre.`  
   
`6. IA ET AUTOMATISATIONS`  
  `Rôle de l'IA dans le produit.`  
  `Mode d'exposition : invisible / assistant discret / copilote visible / API interne.`  
  `Fallback si l'IA échoue.`  
  `Risques : hallucination, coût, confidentialité, dépendance provider.`  
   
`7. MONÉTISATION ET LIVRAISON`  
  `Modèle : abonnement, forfait client, usage-based, licence, interne, pas encore.`  
  `Paiement requis en V1 : oui / non / à valider.`  
  `Provider pressenti si paiement : Stripe / Paddle / autre / aucun.`  
   
`8. HYPOTHÈSES ET PIVOTS`  
  `Hypothèses produit.`  
  `Hypothèses techniques.`  
  `Pivots possibles : cible, verticale, stack, pricing, IA, déploiement.`  
  `Signaux qui déclenchent un pivot.`  
   
`9. DÉLÉGATIONS À ACTIVER`  
  `ux-ui-design : livrables attendus et contraintes.`  
  `expert-backend : livrables attendus et contraintes.`  
  `Autres skills futurs : mobile, compliance, marketplace, growth, si nécessaire.`  
```` ``` ````  
   
`---`  
   
`### Document 2 — BRIEF.md`  
`**Rôle :** la carte d'identité complète du produit. Capture le problème réel, l'utilisateur exact, le modèle économique et les contraintes avant toute décision technique.`  
`**Prompt de production :**`  
```` ``` ````  
`Produis le BRIEF.md complet pour [nom du produit].`  
`Utilise ORSAYN-PROJECT.md comme cadrage stratégique.`  
`1. LE PRODUIT`  
  `Nom et concept en une phrase.`  
  `Le problème réel résolu (la douleur concrète, pas "manque d'outil").`  
  `Ce que l'utilisateur fait aujourd'hui pour résoudre ce problème et pourquoi c'est insuffisant.`  
  `La solution — ce que le produit fait précisément, pas comment il le fait.`  
  `Ce que ce produit n'est PAS (frontières claires).`  
`2. LE BUILDER`  
  `Qui construit : solo / équipe / agence.`  
  `Niveau technique disponible.`  
  `Budget et délai réalistes.`  
  `Objectif post-lancement (MRR cible, nombre d'utilisateurs, validation d'hypothèse).`  
`3. L'UTILISATEUR PRINCIPAL`  
  `Profil précis : titre, taille d'entreprise, outil qu'il utilise aujourd'hui.`  
  `Contexte d'usage exact : quand, où, dans quel flux de travail.`  
  `Ce qu'il veut accomplir — la tâche de fond (Jobs To Be Done).`  
  `Ses freins à l'adoption d'un nouvel outil.`  
  `Ce qui le ferait abandonner le produit après 7 jours.`  
`4. LE MODÈLE ÉCONOMIQUE`  
  `Type : freemium / abonnement / usage-based / one-shot / interne.`  
  `Plans envisagés (noms, prix indicatifs, limites par plan).`  
  `Ce qui est gratuit et pourquoi.`  
  `Ce qui est payant et pourquoi c'est la limite naturelle.`  
  `Metric d'expansion revenue si applicable (seats, usage, features).`  
`5. LA CONCURRENCE`  
  `3 concurrents directs avec leur force principale et leur faiblesse principale.`  
  `Pourquoi l'utilisateur choisirait ce produit plutôt que chacun d'eux.`  
  `Positionnement unique : ce qu'on fait mieux, pour qui, pourquoi ça compte.`  
`6. LES CONTRAINTES`  
  `Stack : imposée ou à choisir.`  
  `Auth : méthodes requises (email, OAuth, SSO).`  
  `Isolation : single user / équipe / multi-org / per-client / cockpit / hybride.`  
  `Données sensibles : RGPD, chiffrement, résidence des données.`  
  `Intégrations bloquantes (sans lesquelles le produit ne peut pas être lancé).`  
`7. LES MÉTRIQUES DE SUCCÈS`  
  `À 30 jours : acquisition et activation (signups, onboarding completion, first action).`  
  `À 90 jours : rétention et conversion (DAU/WAU, churn, MRR).`  
  `Indicateur North Star (la métrique qui prouve que le produit crée de la valeur).`  
`8. LES RISQUES`  
  `Risques produit : hypothèses non validées, features non prioritaires.`  
  `Risques techniques : intégrations complexes, scalabilité.`  
  `Risques business : acquisition, conversion, churn.`  
  `Comment on mitige chacun.`  
```` ``` ````  
`---`  
`### Documents 3 & 4 — BRAND-SYSTEM.md + DESIGN-SYSTEM.md`  
   
``> **Délégués au skill `ux-ui-design`.**``  
`> Fournir ORSAYN-PROJECT.md + BRIEF.md. Le skill produit les deux documents dans l'ordre.`  
``> Demander explicitement à `ux-ui-design` de traiter le contexte réel :``  
`> app métier dense, SaaS, cockpit, outil interne, interface mobile, portail client,`  
`> assistants IA intégrés, états vides, skeletons, navigation app et vues critiques.`  
`---`  
`### Documents 5 & 6 — DATA-MODEL.md + SECURITY-MODEL.md`  
``**Rôle :** le schéma de la base de données, les règles de sécurité, les migrations, RLS/RBAC, secrets, rate limits et stratégie de déploiement. Ces documents sont délégués à `expert-backend`.``  
   
``> ORACLE ne tranche pas seul le modèle BDD. Il prépare le contexte et demande à `expert-backend` de produire ou valider DATA-MODEL.md et SECURITY-MODEL.md.``  
`**Prompt de production :**`  
```` ``` ````  
`Active expert-backend pour produire DATA-MODEL.md et SECURITY-MODEL.md pour [nom du produit].`  
`Documents fournis : ORSAYN-PROJECT.md, BRIEF.md, BRAND-SYSTEM.md, DESIGN-SYSTEM.md.`  
`Stack pressentie : [depuis ORSAYN-PROJECT.md], adaptable si l'expert détecte un meilleur choix.`  
`--- SECTION 1 : ENTITÉS PRINCIPALES ---`  
`Pour chaque table :`  
`- Nom (snake_case)`  
`- Colonnes avec types Postgres précis`  
`- Clés primaires et étrangères`  
`- Contraintes (unique, not null, check)`  
`- Index recommandés (pour les requêtes fréquentes)`  
`Tables standard à inclure selon le projet :`  
`profiles         (extension de auth.users — données publiques de l'utilisateur)`  
`organizations    (si multi-tenant — workspace/équipe)`  
`memberships      (relation user ↔ organization avec role)`  
`subscriptions    (plans, statuts, stripe_customer_id, stripe_subscription_id)`  
`[tables métier spécifiques au produit]`  
`--- SECTION 2 : ROW LEVEL SECURITY (RLS) ---`  
`Pour chaque table, documenter les politiques RLS :`  
`SELECT : qui peut lire quelles lignes ?`  
`INSERT : qui peut créer ? Avec quelles valeurs forcées ?`  
`UPDATE : qui peut modifier quelles colonnes ?`  
`DELETE : qui peut supprimer ?`  
`Règles standard à adapter selon le mode :`  
`Un utilisateur ne voit que ses propres données.`  
`Un membre voit les données de son organisation.`  
`Un admin peut tout voir dans son organisation.`  
`Jamais de données cross-tenant.`  
`Politique type à documenter pour chaque table :`  
`CREATE POLICY "nom_explicite" ON table_name`  
 `FOR [SELECT|INSERT|UPDATE|DELETE]`  
 `TO authenticated`  
 `USING ([condition RLS]);`  
`--- SECTION 3 : RELATIONS ET INTÉGRITÉ ---`  
`Diagramme textuel des relations entre tables.`  
`Cascades : que se passe-t-il en cas de suppression d'un utilisateur ?`  
 `→ suppression en cascade, soft delete ou erreur ?`  
`Données orphelines : lesquelles sont acceptables ? Lesquelles pas ?`  
`--- SECTION 4 : DONNÉES SENSIBLES ---`  
`Colonnes à ne jamais exposer côté client.`  
`Colonnes à chiffrer (si applicable).`  
`Colonnes soumises au RGPD (à anonymiser lors d'une suppression de compte).`  
`PII (Personally Identifiable Information) identifiée.`  
`--- SECTION 5 : FONCTIONS ET TRIGGERS ---`  
`Triggers Postgres nécessaires :`  
`- Création automatique d'un profil à l'inscription`  
`- Mise à jour automatique de updated_at`  
`- Audit log sur les actions sensibles`  
`Fonctions RPC Supabase utiles pour ce projet.`  
`--- SECTION 6 : MIGRATIONS ---`  
`Ordre de création des tables (respecter les dépendances de clés étrangères).`  
`Données de seed pour le développement.`  
`Données de seed pour les tests.`  
   
`--- SECTION 7 : SECURITY-MODEL.md ---`  
   
`Mode d'isolation : per-client / multi-tenant / hybride.`  
`RLS/RBAC/permissions.`  
`Secrets runtime et variables publiques.`  
`Rate limiting.`  
`Webhooks et signatures.`  
`Routes publiques.`  
`Déploiement cible : Cloudflare / Vercel / autre.`  
`Préflight et rollback.`  
```` ``` ````  
`---`  
`### Document 7 — PRD.md`  
`**Rôle :** le document de référence produit complet. Il couvre les fonctionnalités, limites, permissions, onboarding, emails transactionnels, IA intégrée et intégrations selon le mode défini dans ORSAYN-PROJECT.md.`  
`**Prompt de production :**`  
```` ``` ````  
`Produis le PRD.md complet pour [nom du produit].`  
`Utilise ORSAYN-PROJECT.md, BRIEF.md, DATA-MODEL.md, SECURITY-MODEL.md, BRAND-SYSTEM.md et DESIGN-SYSTEM.md comme sources de vérité.`  
`--- SECTION 1 : VISION PRODUIT ---`  
`Vision en 2 phrases.`  
`Principe directeur : la décision qui guide tous les trade-offs.`  
`KPIs mesurables (pas qualitatifs).`  
`Hors scope V1 : ce que ce PRD ne couvre pas.`  
`--- SECTION 2 : UTILISATEURS ET RÔLES ---`  
`Pour chaque rôle (Owner, Admin, Member, Viewer, etc.) :`  
`- Ce qu'il peut faire`  
`- Ce qu'il ne peut pas faire`  
`- Comment il arrive dans le système (invitation, inscription directe, SSO)`  
`--- SECTION 3 : PLANS ET LIMITES ---`  
`Pour chaque plan :`  
`Nom, prix, destinataire cible.`  
`Limites précises (volume, features, seats, storage).`  
`Ce qui se passe quand la limite est atteinte (blocage, upgrade prompt, grace period).`  
`Ce qui est inclus uniquement dans les plans supérieurs et pourquoi.`  
`Règle : les limites doivent être codées comme des constantes dans /lib/plans.ts`  
`jamais hardcodées dans les composants.`  
`--- SECTION 4 : ARCHITECTURE DE L'APP ---`  
`Toutes les routes de l'application avec leur rôle exact.`  
`Séparation nette :`  
 `Routes publiques (marketing, pricing, auth)`  
 `Routes app authentifiées (/app/[...])`  
 `Routes admin (/admin/[...] — si applicable)`  
 `Routes API (/api/[...])`  
`Pour chaque route/page :`  
`- L'objectif unique`  
`- Le contenu dans l'ordre vertical`  
`- Critères d'acceptation binaires`  
`--- SECTION 5 : FONCTIONNALITÉS P1/P2/P3 ---`  
`P1 — Bloque le lancement.`  
`Pour chaque feature P1 :`  
`Description précise du comportement attendu.`  
`Critère d'acceptation binaire.`  
`Cas d'erreur à gérer impérativement.`  
`Impact sur le schéma BDD.`  
`Dépendances (autres features, intégrations).`  
`P2 — Dans les 60 jours post-lancement.`  
`P3 — Roadmap future — jamais pendant le sprint V1.`  
`--- SECTION 6 : ONBOARDING ET ACTIVATION ---`  
`L'onboarding est souvent la feature la plus importante d'une app métier ou d'un SaaS.`  
`Un utilisateur qui n'active pas dans les 7 jours ne reviendra pas.`  
`Définir :`  
`Le "first value moment" (l'instant précis où l'utilisateur comprend la valeur).`  
`Les étapes obligatoires pour y arriver (maximum 3-5 étapes).`  
`Ce qui se passe si l'utilisateur abandonne à chaque étape.`  
`Les emails déclenchés à J+1 / J+3 / J+7 si non activé.`  
`La checklist d'onboarding in-app (si applicable).`  
`--- SECTION 7 : EMAILS TRANSACTIONNELS ---`  
`Liste exhaustive de tous les emails envoyés par le produit :`  
`Déclencheur précis → Sujet → Contenu attendu → Timing`  
`Emails standards à adapter selon le modèle :`  
`Confirmation d'inscription + magic link ou lien de vérification`  
`Email de bienvenue (post-vérification)`  
`Invitation à rejoindre une organisation`  
`Réinitialisation de mot de passe`  
`Confirmation de paiement`  
`Échec de paiement (J0 + J3 + J7)`  
`Fin de période d'essai (J-7 + J-3 + J0)`  
`Annulation de l'abonnement (confirmation + offre de rétention)`  
`Upgrade/downgrade de plan`  
`Suppression de compte`  
`--- SECTION 8 : INTÉGRATIONS ET APIS ---`  
`Pour chaque intégration :`  
`Outil et version.`  
`Flow nominal complet.`  
`Flow d'erreur et fallback.`  
`Webhooks à gérer pour chaque provider critique — documenter chaque event.`  
`Clés dans variables d'environnement du provider de déploiement — jamais dans le code.`  
   
`Paiement si Stripe est retenu :`  
`checkout.session.completed`  
`customer.subscription.updated`  
`customer.subscription.deleted`  
`invoice.payment_succeeded`  
`invoice.payment_failed`  
`--- SECTION 9 : CONTRAINTES TECHNIQUES ---`  
`Stack complète avec versions, en reprenant les choix validés dans ORSAYN-PROJECT.md et SECURITY-MODEL.md.`  
`Performance : LCP < 2.5s · INP < 200ms · CLS < 0.1`  
`Breakpoints : 375px · 768px · 1024px · 1440px`  
`Accessibilité : WCAG 2.2 AA`  
`Limites Supabase à respecter (RLS sur toutes les tables, pas de service_role côté client)`  
`--- SECTION 10 : MÉTRIQUES DE SUCCÈS ---`  
`À 30 jours :`  
`Taux d'activation (% qui atteignent le first value moment)`  
`Conversion trial-to-paid (si applicable)`  
`Taux de complétion de l'onboarding`  
`À 90 jours :`  
`DAU / WAU / MAU`  
`Churn mensuel si SaaS ; rétention client ou usage récurrent si per-client/interne`  
`MRR et croissance MRR`  
`NPS ou CSAT`  
```` ``` ````  
`---`  
`### Document 8 — USER-FLOWS.md`  
`**Rôle :** la cartographie complète de tous les parcours utilisateurs dans l'app. Couvre les flows d'auth, onboarding, permissions, actions métier, IA intégrée, billing si applicable, et états des features.`  
`**Prompt de production :**`  
```` ``` ````  
`Produis le USER-FLOWS.md complet pour [nom du produit].`  
`Utilise ORSAYN-PROJECT.md pour respecter le mode de déploiement, les contraintes client et les pivots possibles.`  
`--- SECTION 1 : FLOWS D'AUTH ---`  
`INSCRIPTION`  
`Chaque étape dans l'ordre (form → validation → email → vérification → onboarding).`  
`Cas d'erreur à chaque étape (email déjà utilisé, lien expiré, etc.).`  
`Comportement si l'utilisateur ferme la fenêtre en cours de route.`  
`CONNEXION`  
`Email + mot de passe : flux nominal + erreurs (mauvais mdp, compte bloqué).`  
`OAuth (Google / GitHub) : flux nominal + erreurs (permissions refusées, compte déjà lié).`  
`Magic link : flux nominal + lien expiré + lien déjà utilisé.`  
`MFA : flux nominal + code invalide + perte d'accès.`  
`MOT DE PASSE OUBLIÉ`  
`Chaque étape avec timing des emails et expiration des tokens.`  
`DÉCONNEXION`  
`Simple + déconnexion de tous les appareils.`  
`--- SECTION 2 : FLOW D'ONBOARDING ---`  
`Cartographier le chemin de la première connexion au first value moment.`  
`Pour chaque étape :`  
`Écran affiché.`  
`Ce que l'utilisateur doit faire.`  
`Ce qui se passe s'il passe sans faire l'action.`  
`Ce qui se passe s'il fait une erreur.`  
`Email ou notification déclenchée.`  
`--- SECTION 3 : FLOWS MÉTIER PRINCIPAUX ---`  
`Pour chaque action clé du produit (créer, éditer, supprimer une entité principale) :`  
`Point d'entrée.`  
`Chaque écran dans l'ordre.`  
`Bifurcations (oui/non avec les deux chemins).`  
`Cas d'erreur et récupération.`  
`Confirmation et feedback.`  
`--- SECTION 4 : FLOWS DE BILLING ---`  
`UPGRADE`  
`Comment l'utilisateur découvre qu'il a besoin d'upgrader (atteinte d'une limite).`  
`Le prompt d'upgrade : où, quand, avec quel message.`  
`Flow paiement si applicable → success → activation des features payantes.`  
`Flow d'erreur de paiement.`  
`DOWNGRADE`  
`Comment l'utilisateur change de plan.`  
`Ce qui se passe aux données excédentaires (archivage, suppression, conservation temporaire).`  
`Email de confirmation.`  
`ANNULATION`  
`Flow de rétention (offre de pause, downgrade suggestion).`  
`Confirmation d'annulation + email.`  
`Comportement de l'app après annulation (accès jusqu'à la fin de la période payée).`  
`--- SECTION 5 : LES 4 ÉTATS — RÈGLE ABSOLUE ---`  
`Tout composant gérant de la donnée doit avoir ces 4 états :`  
`LOADING`  
`Skeleton avec shimmer (jamais page blanche).`  
`Préserver le layout pour éviter le content shift.`  
`EMPTY`  
`Le premier empty state est souvent le plus important de l'app.`  
`Message humain qui explique POURQUOI c'est vide + CTA vers la première action.`  
`L'utilisateur doit comprendre quoi faire en moins de 3 secondes.`  
`Exemple : "Vous n'avez pas encore de projet. Créez votre premier projet en 30 secondes."`  
`ERROR`  
`Message humain (jamais code d'erreur).`  
`Action de récupération claire.`  
`Option de contact support si l'erreur persiste.`  
`LOADED`  
`Transition douce depuis le skeleton.`  
`Pagination ou infinite scroll pour les listes longues.`  
`Filtres et recherche si > 10 items attendus.`  
`--- SECTION 6 : PERMISSIONS ET GARDE-FOUS ---`  
`Pour chaque action sensible, documenter :`  
`Qui peut la faire (rôle requis).`  
`Ce qui s'affiche aux utilisateurs sans permission (hidden vs disabled vs redirect).`  
`Message d'erreur si tentative non autorisée.`  
```` ``` ````  
`---`  
`### Document 9 — PROMPT-SYSTEM.md`  
`**Rôle :** le cerveau de l'IDE pour ce projet Orsayn. Chargé dans /docs, lu par Claude Code à chaque session. Doit être entièrement autonome — Claude Code sait tout sans réexplication.`  
`**Prompt de production :**`  
```` ``` ````  
`Produis le PROMPT-SYSTEM.md pour ce projet Orsayn.`  
`Ce fichier est chargé dans /docs et lu par Claude Code à chaque session.`  
`Il doit être AUTONOME — Claude Code ne doit jamais demander de contexte.`  
`1. IDENTITÉ ET RÔLE`  
  `Expert produit/tech Orsayn sur [nom du produit].`  
  `Ce qu'il fait / ce qu'il ne fait jamais.`  
  `Niveau d'autonomie : quand il propose vs quand il exécute.`  
`2. CONTEXTE PRODUIT (5 lignes max)`  
  `Problème résolu, utilisateur cible, mode Orsayn, modèle économique, north star metric.`  
`3. STACK COMPLÈTE`  
  `Framework + version + dépendances clés.`  
  `Auth : provider + stratégie de session.`  
  `BDD : provider et projet (nom uniquement — jamais les clés).`  
  `Conventions : PascalCase composants · camelCase fonctions · kebab-case fichiers.`  
  `Variables d'environnement utilisées (noms uniquement).`  
`4. ARCHITECTURE DU PROJET`  
  `/app/(marketing)/    routes publiques`  
  `/app/(auth)/         connexion, inscription, réinitialisation`  
  `/app/(app)/          app authentifiée (protégée par middleware)`  
  `/app/(admin)/        admin (protégé par role check)`  
  `/app/api/            routes API et webhooks`  
  `/components/ui/      composants shadcn/ui`  
  `/components/app/     composants métier de l'app`  
  `/lib/                toute la logique métier, appels BDD, helpers`  
  `/lib/supabase/       client, server, middleware, types`  
  `/lib/providers/      adapters Stripe/Paddle/WhatsApp/CRM/email/IA selon le projet`  
  `/lib/validations/    tous les schémas Zod`  
  `/lib/plans.ts        plans/quotas si pertinents`  
  `/lib/features.ts     feature flags/modules si pertinents`  
  `/data/               données statiques JSON`  
  `/docs/               documentation du projet`  
  `Règle absolue : zéro appel BDD dans les composants React.`  
  `Règle absolue : toute la logique dans /lib/.`  
`5. MODÈLE DE DONNÉES (résumé)`  
  `Tables principales avec leurs colonnes clés.`  
  `RLS activé sur toutes les tables.`  
  `Types TypeScript générés par Supabase CLI.`  
`6. DESIGN SYSTEM EN TOKENS`  
  `Couleurs (variables CSS + hex + rôle).`  
  `Typographies (classes Tailwind).`  
  `Espacements (valeurs autorisées).`  
  `Composants clés et leurs états.`  
`7. BRAND SYSTEM EN VOIX`  
  `Archétype et implication sur le copywriting.`  
  `Vocabulaire autorisé / interdit.`  
  `Ton de la microcopy (erreurs, succès, empty states).`  
`8. PLANS, MODULES, PERMISSIONS ET LIMITES`  
  `Constantes, tables ou providers utilisés.`  
  `Comment vérifier les droits d'un utilisateur côté serveur.`  
  `Comment afficher les prompts d'upgrade, demandes d'accès ou blocages métier.`  
`9. PRINCIPES INVIOLABLES (numérotés par priorité)`  
  `Sécurité : RLS sur toutes les tables · Zod sur tous les inputs · rate limiting · jamais service_role côté client`  
  `Performance : Server Components · lazy loading · pagination`  
  `Accessibilité : WCAG 2.2 AA · focus visible · aria-labels`  
  `Les 4 états sur tout composant data`  
  `Composant Image Next.js — jamais img brut`  
  `Mobile first absolu`  
  `[Principes spécifiques au produit]`  
`10. INTERDITS ABSOLUS`  
   `Ce que Claude Code ne fait JAMAIS sur ce projet.`  
```` ``` ````  
`---`  
`## Couche 3 — Décisions structurantes + maquettes`  
`### Temps 1 — Décisions avant le code`  
`Ces décisions bloquent si elles sont prises en cours de route. 30 minutes ici = des semaines de refactoring évitées.`  
```` ``` ````  
`DÉCISION — AUTH STRATEGY`  
`Provider choisi : Supabase Auth / Clerk / NextAuth.`  
`Sessions : JWT ou cookies httpOnly ?`  
`Middleware Next.js : comment protéger les routes /app/* ?`  
`Refresh token strategy ?`  
`OAuth providers à configurer (Google, GitHub, Slack).`  
`MFA : TOTP — quand l'activer (optionnel ou forcé) ?`  
`DÉCISION — MULTI-TENANCY`  
`Model : single-user / team / multi-org.`  
`Comment l'organization_id est-il propagé dans toutes les requêtes ?`  
`RLS : toutes les tables ont-elles une colonne organization_id ou user_id ?`  
`Invitation à une organisation : flow complet (email → lien → acceptation).`  
`DÉCISION — MODE DE DÉPLOIEMENT ORSAYN`  
`Mode retenu : per-client / SaaS multi-tenant / AaaS intégré / cockpit / outil interne / hybride.`  
`Isolation : BDD séparée, RLS par organisation, projet cockpit séparé, ou autre.`  
`Déploiement : Cloudflare/OpenNext, Vercel, autre provider.`  
`Justification : pourquoi ce choix est adapté maintenant.`  
`Pivot possible : ce qui ferait changer de mode.`  
   
`DÉCISION — MONÉTISATION / PAIEMENT`  
`Paiement en V1 : oui / non / plus tard.`  
`Modèle : abonnement, usage-based, forfait client, licence, interne.`  
`Provider si nécessaire : Stripe / Paddle / Lemon Squeezy / facture manuelle / autre.`  
`Webhooks requis : lesquels, avec signature obligatoire.`  
`Portail client ou gestion manuelle : selon le modèle.`  
`Trial, limites, quotas : seulement si pertinents.`  
`DÉCISION — LIMITES DE PLANS`  
`Où stocker les limites/modules : /lib/plans.ts, table feature flags, tenant_config ou équivalent.`  
`Comment les vérifier : helper serveur checkLimit/checkFeature/checkPermission.`  
`Comment bloquer : UX adaptée (upgrade prompt, contact commercial, module désactivé, workflow manuel).`  
`Comment mesurer l'usage : colonne de comptage en BDD ou query count() ?`  
`DÉCISION — DONNÉES MODIFIABLES`  
`Données statiques dans /data/*.json (pricing affiché, features marketing).`  
`Données configurables par l'admin dans la BDD (settings par organisation).`  
`Contenu modifiable sans code : spécifier quelles tables et par qui.`  
`DÉCISION — REAL-TIME (si applicable)`  
`Quels events nécessitent du real-time vs polling.`  
`Supabase Realtime : subscriptions sur quelles tables/colonnes ?`  
`Optimistic updates : où les appliquer pour une UX instantanée ?`  
`DÉCISION — ARCHITECTURE SEO (routes marketing)`  
`Les routes (marketing) sont statiques et indexables.`  
`Les routes (app) ne sont PAS indexées (noindex dans metadata).`  
`robots.txt : bloquer /app/* et /admin/*.`  
```` ``` ````  
`### Temps 2 — Maquettes visuelles`  
``> **Délégué au skill `ux-ui-design`.**``  
`> Fournir BRAND-SYSTEM.md + DESIGN-SYSTEM.md + architecture de l'app du PRD.`  
`>`  
`> Demander spécifiquement selon le profil détecté :`  
`> - Dashboard principal avec sidebar navigation`  
`> - Empty states des vues principales`  
`> - Onboarding (étapes, progress)`  
`> - Pricing page si monétisation self-serve`  
`> - Écran de connexion et d'inscription`  
`> - Prompt d'upgrade, contact commercial ou module verrouillé selon le modèle`  
`> - Moments IA intégrés : suggestion, résumé, génération, validation, relance`  
`> - Version mobile des vues critiques`  
`### Temps 3 — Architecture backend et sécurité`  
``> **Délégué au skill `expert-backend`.**``  
`> Les apps Orsayn ont une surface d'attaque variable : per-client, SaaS, IA, cockpit, données sensibles.`  
`> Activer ce skill avant d'ouvrir l'IDE pour valider toute l'architecture backend.`  
`> Il produit un PLAN numéroté pour validation humaine, puis exécute bloc par bloc.`  
```` ``` ````  
`[Appel au skill expert-backend — Couche 3]`  
`Documents disponibles : ORSAYN-PROJECT.md, BRIEF.md, BRAND-SYSTEM.md, DESIGN-SYSTEM.md, PRD.md, PROMPT-SYSTEM.md.`  
`Questions à traiter :`  
`- Profil détecté : per-client / SaaS / AaaS intégré / cockpit / hybride`  
`- Architecture RLS : politiques SELECT / INSERT / UPDATE / DELETE par table`  
`- Stratégie auth : sessions, refresh tokens, middleware de protection des routes`  
`- Validation Zod : périmètre exact (toutes les routes API, Server Actions)`  
`- Rate limiting : routes d'auth + routes API publiques`  
`- Paiement si pertinent : provider, webhooks signés, flux nominal + erreurs`  
`- IA : feature gating, Zod en sortie, coût, fallback, données sensibles`  
`- Variables d'environnement : séparation NEXT_PUBLIC_ vs secrets`  
`- Supabase : jamais service_role côté client, types TypeScript générés par CLI`  
`- Audit logs si données sensibles`  
`Produit ou valide DATA-MODEL.md + SECURITY-MODEL.md + PLAN backend avant tout code.`  
```` ``` ````  
`---`  
`## Couche 4 — Exécution dans l'IDE`  
`### Initialisation`  
```` ``` ````  
`1. Créer le repo et choisir le provider de déploiement validé (Cloudflare/OpenNext par défaut Orsayn, Vercel ou autre si justifié)`  
`2. Initialiser Supabase project(s) selon le mode : per-client, staging/prod, cockpit séparé si nécessaire`  
`3. Créer /docs → ORSAYN-PROJECT.md · BRIEF.md · BRAND-SYSTEM.md · DESIGN-SYSTEM.md · DATA-MODEL.md · SECURITY-MODEL.md · PRD.md · USER-FLOWS.md · PROMPT-SYSTEM.md`  
`4. Configurer les variables d'environnement dans le provider retenu`  
`5. Générer les types TypeScript depuis Supabase CLI : supabase gen types typescript`  
`6. Créer les migrations SQL dans /supabase/migrations/`  
`7. Ajouter un préflight de déploiement si le projet vise des clients réels`  
```` ``` ````  
`### Premier message Claude Code`  
```` ``` ````  
`Charge et lis /docs/PROMPT-SYSTEM.md entièrement avant de produire quoi que ce soit.`  
`Confirme que tu as bien compris le produit, la stack, le schéma BDD,`  
`les principes de sécurité et les principes inviolables.`  
`Ensuite on commence par : [première tâche précise].`  
```` ``` ````  
`### Ordre de construction — P1 complet avant tout P2`  
```` ``` ````  
`Session 1 — Fondations`  
 `Migrations SQL dans /supabase/migrations/ (toutes les tables + RLS)`  
 `Types TypeScript générés (supabase gen types)`  
 `Clients Supabase : /lib/supabase/client.ts · server.ts · middleware.ts`  
 `/lib/plans.ts : constantes de plans et limites`  
 `Tokens Tailwind : couleurs, typos, espacements du DESIGN-SYSTEM`  
 `Layout global : structure avec sidebar ou top nav selon le PRD`  
`Session 2 — Auth complète`  
 `Pages d'inscription, connexion, réinitialisation de mot de passe`  
 `OAuth si applicable`  
 `Middleware : protection des routes /app/* et /admin/*`  
 `Création automatique du profil à l'inscription (trigger Supabase)`  
 `Emails transactionnels auth : vérification, bienvenue, réinitialisation`  
`Session 3 — Onboarding`  
 `Flow d'onboarding étape par étape`  
 `Empty states des vues principales`  
 `Checklist d'activation si applicable`  
 `Email J+1 si non activé (Resend)`  
`Session 4 — Features P1`  
 `Chaque feature dans l'ordre de priorité du PRD`  
 `Les 4 états sur chaque composant data`  
 `Permissions, modules, quotas ou limites vérifiés côté serveur`  
 `Prompts d'upgrade, contact commercial ou blocages métier aux bons endroits`  
`Session 5 — Monétisation / intégrations critiques`  
 `Paiement si applicable : session checkout côté serveur ou workflow commercial`  
 `Webhooks provider : tous les events documentés dans le PRD`  
 `Portail client, facturation manuelle ou cockpit opérateur selon le modèle`  
 `Pages : /pricing · /billing · /upgrade seulement si pertinentes`  
 `Gating des features selon plan, module, contrat ou permissions`  
`Session 6 — Finitions et optimisation`  
 `Emails transactionnels restants (billing, offboarding)`  
 `Performance : Server Components, lazy loading, pagination`  
 `Accessibilité : focus, aria, navigation clavier`  
 `Tests responsive : 375px / 768px / 1024px / 1440px`  
 `RGPD : suppression de compte, export de données`  
 `Pages légales : CGU, politique de confidentialité, mentions légales`  
```` ``` ````  
`**Règles de construction non-négociables :**`  
`- Une feature à 100% avant la suivante`  
`- RLS vérifié sur chaque nouvelle table avant de coder la feature qui l'utilise`  
`- Zod sur tous les inputs de toutes les routes API`  
`- Les 4 états sur tout composant data ou formulaire`  
`- Zéro appel BDD dans les composants React — passe par /lib/`  
`- Permissions, modules, quotas et limites vérifiés côté serveur — jamais uniquement côté client`  
``- `<Image>` Next.js obligatoire — jamais `<img>` brut``  
`---`  
`## Couche 5 — Quatre audits de validation`  
`**Un CRITIQUE bloque la livraison. Toujours. Sans exception.**`  
`### Audit 1 — Fonctionnel et produit`  
```` ``` ````  
`Tu es un auditeur produit senior.`  
`Voici le PRD : [coller PRD.md]`  
`Voici l'URL de preview : [URL]`  
`CRITIQUE :`  
`Tous les critères d'acceptation P1 remplis ?`  
`L'onboarding mène au first value moment en < 5 minutes ?`  
`Les 4 états couverts sur tous les composants data ?`  
`Le billing, la facturation ou le workflow commercial est-il fonctionnel si applicable ?`  
`Les permissions, modules, quotas ou limites sont-ils respectés en production ?`  
`Responsive correct sur 375px, 768px, 1440px ?`  
`IMPORTANT :`  
`Les emails transactionnels P1 s'envoient correctement ?`  
`Les empty states sont humains et ont des CTA ?`  
`Les prompts d'upgrade s'affichent aux bons endroits ?`  
`La suppression de compte fonctionne ?`  
`MINEUR :`  
`404 personnalisée ?`  
`Favicon et Open Graph ?`  
`Pages légales complètes ?`  
`Classe chaque écart : CRITIQUE / IMPORTANT / MINEUR + correctif exact.`  
```` ``` ````  
`### Audit 2 — Sécurité App Orsayn`  
```` ``` ````  
`Tu es un ingénieur sécurité senior spécialisé apps métier, SaaS, per-client et IA.`  
`Charge /docs/SECURITY-MODEL.md et /docs/PROMPT-SYSTEM.md puis audite ce projet.`  
`RLS — CRITIQUE :`  
`Toutes les tables ont-elles RLS activé ?`  
`Aucun accès cross-tenant possible (tester avec deux comptes différents) ?`  
`Le service_role key n'est-il jamais utilisé côté client ?`  
`Les politiques RLS couvrent SELECT, INSERT, UPDATE et DELETE ?`  
`AUTH — CRITIQUE :`  
`Les routes /app/* sont-elles protégées par le middleware ?`  
`Les tokens JWT sont-ils validés côté serveur sur chaque route API ?`  
`Le refresh token est-il géré correctement ?`  
`Les magic links / liens de vérification expirent-ils ?`  
`INPUTS — CRITIQUE :`  
`Validation Zod sur toutes les routes API ?`  
`Rate limiting sur les routes d'auth (login, register, reset) ?`  
`Rate limiting sur toutes les routes API publiques ?`  
`Pas de SQL injection possible (Supabase parameterized queries — vérifié) ?`  
`PAIEMENT / PROVIDERS — CRITIQUE SI APPLICABLE :`  
`La signature des webhooks provider est-elle vérifiée ?`  
`Aucune manipulation des prix, quotas ou droits côté client ?`  
`Les plans, contrats ou modules actifs sont-ils lus depuis la BDD / provider, jamais depuis le localStorage ?`  
`DONNÉES — IMPORTANT :`  
`Les données sensibles ne sont pas exposées dans les réponses API ?`  
`Les emails ne sont pas visibles dans le HTML source ?`  
`Les clés API sont dans les variables d'environnement ?`  
`Honeypot sur les formulaires publics ?`  
`Security headers dans next.config.js :`  
`X-Frame-Options · X-Content-Type-Options · Referrer-Policy · CSP`  
`Chaque problème : CRITIQUE / IMPORTANT / MINEUR + correctif exact.`  
```` ``` ````  
`### Audit 3 — Architecture`  
```` ``` ````  
`Tu es un architecte logiciel senior.`  
`Charge /docs/PROMPT-SYSTEM.md, /docs/DATA-MODEL.md et /docs/SECURITY-MODEL.md puis audite ce projet.`  
`1. Des appels Supabase dans des composants React (hors /lib/) ?`  
`2. Des permissions, modules, quotas ou limites vérifiés uniquement côté client ?`  
`3. Des balises img au lieu du composant Image Next.js ?`  
`4. Les 4 états sur tous les composants data ?`  
`5. Des fichiers > 200 lignes ?`  
`6. Des types any dans le TypeScript ?`  
`7. Des constantes de plans/modules hardcodées dans les composants plutôt que dans /lib ou la BDD ?`  
`8. De la logique métier dupliquée entre fichiers ?`  
`9. Des variables d'environnement exposées côté client (NEXT_PUBLIC_ sur des secrets) ?`  
`Rapport en deux parties :`  
`1. Dette haute : corriger avant la livraison`  
`2. Dette moyenne : documenter en P1 V2`  
```` ``` ````  
`### Audit 4 — Rétention et activation`  
```` ``` ````  
`Tu es un expert activation, rétention et adoption produit.`  
`Voici le PRD (section onboarding et emails) et accès à l'app.`  
`ACTIVATION :`  
`Le first value moment est-il atteignable en < 5 minutes par un nouvel utilisateur ?`  
`Les empty states guident-ils vers la première action ?`  
`L'onboarding peut-il être complété sans aide extérieure ?`  
`RÉTENTION :`  
`Les emails J+1 / J+3 / J+7 sont-ils configurés ?`  
`L'email de fin de trial ou relance commerciale est-il configuré si applicable ?`  
`L'email de récupération après échec de paiement est-il configuré si paiement en ligne ?`  
`Y a-t-il un mécanisme de détection de churns potentiels ?`  
`CONVERSION :`  
`Les prompts d'upgrade, CTA commerciaux ou demandes d'accès s'affichent-ils au bon moment ?`  
`Le message est-il axé bénéfice et non feature ?`  
`La page pricing ou l'explication commerciale est-elle claire si applicable ?`  
`Rapport : CRITIQUE / IMPORTANT / MINEUR + recommandation.`  
```` ``` ````  
`---`  
`## Stack de référence Orsayn adaptable`  
```` ``` ````  
`Framework        Next.js App Router + TypeScript strict`  
`Styling          Tailwind CSS + shadcn/ui`  
`Auth             Supabase Auth (ou Clerk pour des besoins avancés)`  
`BDD              Supabase (Postgres + RLS + Realtime + Storage)`  
`Types            Supabase CLI gen types`  
`Déploiement      Cloudflare Workers/OpenNext par défaut Orsayn ; Vercel si contexte plus adapté`  
`Paiement         Stripe / Paddle / autre / aucun selon ORSAYN-PROJECT.md`  
`Email            Resend + React Email`  
`Séquences        Loops (ou Resend avec séquences)`  
`Analytics        PostHog (product analytics + feature flags)`  
`Analytics web    Plausible, PostHog ou analytics provider selon déploiement`  
`Monitoring       Sentry`  
`Icônes           Lucide React`  
`Images           next/image`  
`Validation       Zod (tous les inputs, côté serveur uniquement)`  
`State            Zustand (si état global complexe) ou React state simple`  
`Données          /data/*.json pour le statique · Supabase pour le dynamique`  
`IA               Agents intégrés dans l'interface : assistants, automatisations, recommandations, jamais exposés sans UX métier`  
```` ``` ````  
`---`  
`## Checklist de livraison Orsayn`  
```` ``` ````  
`PRODUIT ET FONCTIONNEL`  
`[ ] ORSAYN-PROJECT.md validé : mode, stack, criticité, pivots, délégations`  
`[ ] Tous les critères d'acceptation P1 du PRD remplis`  
`[ ] Onboarding testé avec un compte vierge → first value moment atteint`  
`[ ] Les 4 états sur tous les composants data et formulaires`  
`[ ] Limites, permissions, modules ou quotas fonctionnels si pertinents`  
`[ ] Prompts d'upgrade, contact commercial ou blocages métier aux bons endroits`  
`[ ] Responsive testé : 375px / 768px / 1024px / 1440px`  
`[ ] Navigation clavier fonctionnelle (Tab, Enter, Échap)`  
`[ ] 404 personnalisée`  
`SÉCURITÉ`  
`[ ] RLS activé et testé sur toutes les tables (test cross-tenant)`  
`[ ] Zod sur toutes les routes API`  
`[ ] Rate limiting sur les routes d'auth et API publiques`  
`[ ] Signatures webhooks vérifiées pour chaque provider utilisé`  
`[ ] Aucun service_role côté client`  
`[ ] Security headers dans next.config.js`  
`[ ] Variables d'environnement correctement séparées (NEXT_PUBLIC_ uniquement pour le public)`  
`[ ] Aucune clé dans le code ou le repo`  
`[ ] Agents IA : feature gating, Zod en sortie, fallback, coûts loggués si applicable`  
`BILLING / MONÉTISATION SI APPLICABLE`  
`[ ] Provider paiement testé en mode test (success + cancel)`  
`[ ] Webhooks testés pour les events réellement utilisés`  
`[ ] Portail client ou procédure de gestion commerciale fonctionnelle`  
`[ ] Downgrade testé (comportement aux données excédentaires conforme au PRD)`  
`[ ] Annulation testée (accès jusqu'à fin de période payée)`  
`EMAILS TRANSACTIONNELS`  
`[ ] Vérification email (inscription)`  
`[ ] Email de bienvenue`  
`[ ] Réinitialisation de mot de passe`  
`[ ] Invitation organisation (si multi-tenant)`  
`[ ] Confirmation de paiement`  
`[ ] Échec de paiement (J0 + J+3 + J+7)`  
`[ ] Fin de trial (J-7 + J-3 + J0)`  
`[ ] Annulation confirmée`  
`[ ] Séquence onboarding (J+1 / J+3 / J+7 si non activé)`  
`RGPD ET LÉGAL`  
`[ ] Suppression de compte (données utilisateur anonymisées ou supprimées)`  
`[ ] Export de données utilisateur (si applicable)`  
`[ ] Politique de confidentialité complète`  
`[ ] CGU complètes`  
`[ ] Consentement cookies si analytics côté client`  
`PERFORMANCE ET MONITORING`  
`[ ] LCP < 2.5s sur mobile`  
`[ ] CLS < 0.1`  
`[ ] Sentry configuré (erreurs en temps réel)`  
`[ ] PostHog configuré (events d'activation et rétention trackés)`  
`[ ] Alertes Sentry configurées sur les erreurs critiques`  
`MISE EN LIGNE`  
`[ ] Domaine connecté dans le provider retenu`  
`[ ] Variables d'environnement production configurées`  
`[ ] Supabase project en mode production (pas staging)`  
`[ ] Provider paiement en live si paiement en V1`  
`[ ] Preflight déploiement exécuté si per-client ou client réel`  
`[ ] DNS et SSL actifs`  
```` ``` ````  
`---`  
`## Ce que ce skill ne couvre pas encore`  
   
`- **Marketplace** (deux types d'utilisateurs, transactions entre eux, split de revenus) → skill à venir`  
`- **App mobile React Native** → skill à venir`  
`- **API publique autonome avec clés d'API tierces** (type OpenAI, Stripe pour les devs) → skill dédié à venir`  
