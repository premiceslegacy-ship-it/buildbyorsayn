import { ORACLE_SAAS_RAW, ORACLE_SITEWEB_RAW } from "./skillsData";

export const BLOCS_DATA = [
  {
    id: "1",
    titre: "Bloc 1 : La logique du système",
    sections: [
      {
        id: "b1-s1",
        title: "Ce que l'IA a vraiment changé",
        content:
          "Soyons directs. L'IA n'a pas tout révolutionné du jour au lendemain. Mais elle a rendu certaines choses obsolètes très vite, et créé de nouvelles opportunités que très peu de gens exploitent encore correctement.\n\n" +
          "Ce qui est mort ou en train de mourir : les sites WordPress avec des templates achetés 30 euros sur ThemeForest. Les sites Webflow revendus avec un abonnement mensuel sans valeur ajoutée. L'intégrateur HTML/CSS qui passe deux semaines sur un formulaire de contact. Le designer qui livre un Figma sans penser à l'implémentation.\n\n" +
          "Ces marchés ne disparaissent pas du jour au lendemain. Il y a encore des clients qui achètent ça parce qu'ils ne savent pas qu'il existe mieux. Mais construire un business là-dessus en 2025, c'est construire sur du sable.\n\n" +
          "Ce qui résiste et va continuer à résister : la compréhension du problème client avant de toucher un outil. Le jugement design, savoir ce qui est bon et pourquoi. La sécurité et l'architecture backend complexe. Le conseil stratégique. La relation client dans des secteurs exigeants. La capacité à assembler un système cohérent plutôt que des pièces qui ne se parlent pas.\n\n" +
          "La formule qui tient : Valeur = Jugement x Exécution IA x Compréhension métier.\n\n" +
          "L'IA est un multiplicateur. Un multiplicateur de zéro reste zéro. C'est ton jugement et ta compréhension du métier de ton client qui font la différence.",
      },
      {
        id: "b1-s2",
        title: "Les modèles de business viables",
        content:
          "Il en existe cinq. Un seul est adapté à ton stade actuel.\n\n" +
          "Modèle 1, l'agence IA : tu livres des sites, des apps, des SaaS à des clients. Tu utilises l'IA pour produire dix fois plus vite qu'une agence classique. Tu gardes la marge. C'est le modèle pour commencer. Revenus immédiats, pas besoin d'audience.\n\n" +
          "Modèle 2, le SaaS builder : tu construis tes propres produits et tu les vends en abonnement. Scalable, mais cycle long avant revenus significatifs. À envisager après avoir validé avec le modèle 1.\n\n" +
          "Modèle 3, l'éducation et les systèmes : tu vends ce que tu sais faire, formations, templates, systèmes. Demande une pratique réelle à transmettre et une audience déjà constituée.\n\n" +
          "Modèle 4, l'automatisation et les agents : tu construis des workflows IA pour des entreprises. Tickets élevés, peu de concurrence compétente. n8n c'est pas de la réelle compétence à mes yeux, sachant que tu peux construire des workflows sur un seul prompt. Mais comprendre la logique derrière, c'est plus intéressant.\n\n" +
          "Modèle 5, le modèle hybride, c'est mon modèle : prestation plus produit plus éducation. C'est là où les profils solides arrivent après 12 à 24 mois de pratique.\n\n" +
          "La règle absolue pour commencer : vends avant de construire. Pas de SaaS six mois dans ton coin avant d'avoir un client. La vente valide que tu résous un vrai problème.",
      },
      {
        id: "b1-s3",
        title: "Le framework de positionnement",
        content:
          "Le positionnement, c'est une décision stratégique. Réponds à ces quatre questions avec précision, pas avec des généralités.\n\n" +
          "Question 1, pour qui précisément : \"Pour les PME\" n'est pas une réponse. \"Pour les cabinets de gestion de patrimoine indépendants de 5 à 20 personnes\" est une réponse. Plus c'est précis, plus c'est vendable.\n\n" +
          "Question 2, quel problème précis tu résous : pas \"je crée des sites web\". Le problème formulé comme ton client le formule dans sa tête à 3h du matin quand ça l'empêche de dormir. Je suis passé de \"je crée des sites performants\" à \"je corrige la dissonance de prestige : l'écart entre excellence réelle et présence digitale\". L'humain déteste l'incohérence, et c'est sur ce genre de biais que je joue.\n\n" +
          "Les biais de Cialdini à retenir pour convaincre, persuader, convertir : la réciprocité, l'engagement et la cohérence, la preuve sociale, l'autorité, la rareté, et la sympathie. Ce sont les leviers psychologiques universels. Ils viennent du livre Influence et Manipulation de Robert Cialdini, à lire absolument.\n\n" +
          "Question 3, pourquoi toi : réponse honnête au début, parce que tu comprends leur secteur mieux qu'un généraliste. Si tu te positionnes comme expert du BTP et que tu parles de leurs douleurs dans tes contenus, les entreprises te feront plus confiance qu'à une agence généraliste. Tu préfères manger des pâtes chez l'italien ou chez le mec qui vend des grecs, des burgers, des tacos, du poulet ? À long terme : parce que tu as des résultats documentés dans ce secteur.\n\n" +
          "Question 4, comment tu le prouves : études de cas, résultats chiffrés si possible, témoignages. Si tu n'en as pas, montre ce que tu fais vraiment. Les démos peuvent être un vrai levier de preuve sociale.\n\n" +
          "Formule de positionnement : J'aide [QUI PRÉCISÉMENT] à [RÉSOUDRE QUEL PROBLÈME] grâce à [TON APPROCHE] pour qu'ils puissent [RÉSULTAT MESURABLE]. C'est la phrase que tu dois pouvoir dire à n'importe qui en moins de 15 secondes.",
      },
      {
        id: "b1-s4",
        title: "La formule qui tient",
        content:
          "Ce système a été construit à partir d'une pratique réelle : des projets livrés, des clients payants, des erreurs corrigées. Tout ce qui est ici est actionnable, pas de théorie creuse.\n\n" +
          "Ce système est une base. Pas une fin en soi. Le vrai avantage compétitif dans le business IA, c'est la curiosité et la profondeur. Les outils changent tous les trois mois. Les fondamentaux, eux, restent. Ce que tu vas trouver ici te donne le cadre. À toi d'aller chercher le contexte de ton secteur, d'expérimenter, d'itérer.\n\n" +
          "La règle numéro un : le focus paye. La dispersion tue. Ceux qui réussissent dans ce domaine ne font pas 15 choses en même temps. Ils maîtrisent un système, ils l'exécutent en profondeur, ils mesurent, ils améliorent. C'est tout.\n\n" +
          "La valeur se crée dans la profondeur, pas dans la diversité des outils. Maîtrise un modèle, exécute-le à fond, mesure les résultats, améliore. Puis, et seulement ensuite, tu ajoutes une couche. C'est cette discipline qui fait la différence entre un projet abandonné et un business qui tient dans la durée.",
      },
    ],
    videos: [
      {
        title: "À venir — Bloc 1",
        youtubeId: "dQw4w9WgXcQ",
        description: "Vidéo de présentation du bloc à venir.",
      },
    ],
  },
  {
    id: "2",
    titre: "Bloc 2 : La stack",
    sections: [
      {
        id: "b2-s1",
        title: "Pourquoi une stack fixe",
        content:
          "La dispersion est l'ennemi numéro un de la productivité dans ce domaine. Chaque semaine, de nouveaux outils sortent avec les mêmes promesses. LinkedIn est rempli de threads \"les 10 outils IA indispensables\" qui changent tous les deux mois.\n\n" +
          "Résultat pour la plupart des gens : 25 outils, 20% des fonctionnalités utilisées sur chacun, des abonnements qui s'accumulent, et une énergie dépensée à gérer les outils plutôt qu'à construire. C'est le piège classique de la procrastination productive. Tu testes des outils, tu te sens actif, mais tu ne construis rien.\n\n" +
          "La règle pour intégrer un outil : il entre dans la stack si et seulement si il remplace quelque chose qu'on faisait moins bien avant, s'intègre sans friction avec les outils existants, et justifie son coût par le temps ou la qualité qu'il génère. Un outil, un rôle. Pas de doublon, pas de dispersion.\n\n" +
          "La profondeur dans une stack fixe vaut dix fois plus que la largeur sur vingt outils maîtrisés à moitié. Chaque heure passée à tester un nouvel outil est une heure de moins à construire quelque chose de réel.",
      },
      {
        id: "b2-s2",
        title: "La stack complète",
        content:
          "Recherche et contexte. Perplexity est le moteur de recherche IA qui cite ses sources. Pour la veille marché, l'analyse de concurrents, la recherche factuelle en temps réel. Contrairement aux LLM classiques qui ont une date de coupure, il accède au web maintenant. C'est ton outil de recherche principal.\n\n" +
          "NotebookLM de Google est l'outil le plus sous-utilisé de la stack. Tu lui donnes des sources hétérogènes : vidéos YouTube, PDFs, articles, sites web. Il construit une base de connaissance que tu peux interroger avec précision. Pour un projet, tu charges les rapports du secteur, les vidéos des concurrents, les guides réglementaires. Tu peux même charger des vidéos d'un créateur que tu apprécies. Tu obtiens un LLM qui parle de ton secteur avec des sources vérifiables. Gratuit.\n\n" +
          "Conception et design. Google Stitch génère des designs d'interface complets à partir d'un brief textuel. Tous les écrans, tous les états. Sa qualité est directement liée à la qualité du contexte qu'on lui donne. Sans brief solide : écrans génériques. Avec brief solide : base de développement directement utilisable. Intégrable dans Figma, MCP Antigravity, AI Studio.\n\n" +
          "Figma pour les specs détaillées et le handoff client quand le client veut valider visuellement avant le développement. Mobbin pour analyser des patterns d'interface qui fonctionnent vraiment dans des apps réelles en production, pas des concepts. Dribbble pour l'inspiration visuelle, les directions esthétiques, les palettes, les traitements typographiques. 21st.dev pour les composants React premium modernes dans l'écosystème Tailwind.\n\n" +
          "Développement. Antigravity ou Cursor est ton environnement de développement principal. L'IA est intégrée nativement au niveau de l'éditeur. Elle voit ton projet entier, navigue dans tes fichiers, comprend les dépendances, modifie plusieurs fichiers simultanément. La différence avec utiliser Claude dans un navigateur à côté : elle travaille dans ton projet, pas à côté de lui. Les devs préfèrent souvent Cursor, mais Antigravity est gratuit contrairement à Cursor dont le gratuit est limité.\n\n" +
          "Claude Code offre le meilleur niveau de qualité de code actuellement, particulièrement sur le backend. Il s'intègre dans Antigravity et Cursor. Je préfère toujours Gemini pour le front mais teste et tu verras. C'est ton principal outil de génération de code.\n\n" +
          "Google AI Studio pour les sessions longues et complexes. Sa fenêtre de contexte étendue est un avantage quand tu dois donner à l'IA une quantité massive de contexte simultané : documentation, code existant, brief, design system. C'est aussi l'outil pour affiner les écrans Stitch avant de passer au développement et pour générer des MVPs.\n\n" +
          "GitHub pour le versioning. Ce n'est jamais optionnel. Chaque modification tracée, chaque version récupérable. Structure de branches : main pour la production, on ne touche jamais directement. develop pour l'intégration. feature/* avec une branche par fonctionnalité. Cette structure évite de casser la production par accident.\n\n" +
          "Vercel connecté à GitHub. Chaque push génère une URL de preview unique. Le client voit l'avancement en temps réel sans toucher la production. Déploiement en production en un clic.\n\n" +
          "Stack technique. Next.js 14 App Router est le framework React qui a gagné. L'écosystème le plus riche, la documentation la meilleure, et Claude Code le connaît mieux que tout autre framework, ce qui se traduit directement en qualité du code généré.\n\n" +
          "Tailwind CSS : classes utilitaires. Le seul choix raisonnable pour du vibe coding professionnel. Les classes sont lisibles, l'IA les génère correctement, la configuration permet d'ancrer les tokens du design system.\n\n" +
          "shadcn/ui : pas une librairie classique. Une collection de composants que tu copies dans ton projet et que tu possèdes. Accessibles, responsives, stylisables avec Tailwind. Claude Code les connaît parfaitement. Tu ne dépends d'aucune librairie externe.\n\n" +
          "Supabase pour PostgreSQL avec auth intégrée et Row Level Security native. Excellent pour aller vite et valider le marché. Mais attention, personne ne te dira ça : son pricing devient douloureux à l'échelle, je te jure ça pique. La stratégie : Supabase jusqu'à validation du marché et MRR stable, puis migration vers PostgreSQL avec un ORM (Drizzle ou Prisma) sur Neon ou Railway. Construis dès le début de façon à ce que la migration soit possible en centralisant tous les appels Supabase dans un dossier /lib/data/, ne les éparpille jamais dans les composants.\n\n" +
          "Stripe pour le paiement, le standard mondial. Documentation excellente, API stable, Claude Code la connaît parfaitement. Pour les abonnements, les factures, les webhooks. Resend pour les emails transactionnels, intégration Next.js native, délivrabilité excellente. Sentry pour le monitoring des erreurs en production, chaque erreur tracée avec son contexte. PostHog pour les analytics comportementales, l'A/B testing, les feature flags, et les session recordings dans un seul outil open source.\n\n" +
          "Les LLM. Claude d'Anthropic est le LLM principal pour le code et la rédaction. Meilleur niveau de qualité sur le backend et les architectures complexes. Gemini de Google pour AI Studio, Stitch, NotebookLM. Fenêtre de contexte très large, bon pour les sessions longues et pour le design. GPT d'OpenAI en complément sur certaines tâches spécifiques, notamment pour le Prompt Master que tu verras dans le Bloc 6.\n\n" +
          "Productivité. Notion comme base de connaissance centrale : briefs clients, SOPs, documentation des décisions, index des Skills. Pas un outil de gestion de tâches, une mémoire organisée. Linear pour la gestion de projet produit : issues, bugs, cycles de développement. S'intègre avec GitHub pour lier les issues aux commits. Au début, tu peux garder juste Notion ou même un papier et un stylo.",
      },
      {
        id: "b2-s3",
        title: "Les MCP et les Skills",
        content:
          "MCP signifie Model Context Protocol. En clair : des connexions qui permettent à l'IA dans ton environnement de développement d'interagir directement avec tes outils externes. Au lieu de copier-coller du contexte manuellement, l'IA le lit directement depuis la source.\n\n" +
          "Exemple concret : avec le MCP Supabase connecté dans Cursor, l'IA voit ton schéma de base de données en temps réel. Elle génère des requêtes cohérentes avec ta structure réelle sans que tu aies à lui expliquer quoi que ce soit sur tes tables.\n\n" +
          "MCP essentiels à configurer sur chaque projet. Supabase MCP pour que l'IA voie le schéma de base de données en temps réel. GitHub MCP pour accéder à l'historique du code et pouvoir soumettre des modifications. Vercel MCP pour voir les logs de déploiement et les variables d'environnement. Figma MCP pour lire les specs de design directement depuis Figma sans copier-coller. Stripe MCP pour accéder à la documentation API Stripe en contexte.\n\n" +
          "Un Skill, c'est un fichier Markdown qui encode une compétence, un process, ou un système de décision. Tu le charges dans ton environnement et l'IA opère avec cette expertise intégrée. C'est la compétence pour bien construire ce composant.\n\n" +
          "Exemple concret : un skill-ui.md contient ce qu'un designer UI senior sait. Les règles de hiérarchie visuelle, les patterns qui fonctionnent, les erreurs à éviter, les questions à se poser avant de générer un composant. Quand Cursor ou Antigravity charge ce Skill, l'IA génère des interfaces avec le jugement d'un designer senior, pas avec le jugement d'un stagiaire.\n\n" +
          "Skills essentiels à créer en premier : skill-ui.md pour les règles de design UI et la hiérarchie visuelle. skill-ux.md pour le process parcours utilisateur et les états à couvrir. skill-security.md pour la checklist sécurité et les patterns OWASP. skill-copywriting.md pour les règles d'écriture UI, la voix et le ton, les formules CTA. skill-seo-geo.md pour le process SEO et GEO, les métadonnées, Schema.org, llms.txt.\n\n" +
          "La structure standard d'un Skill comporte : un Rôle (qui est l'IA quand elle charge ce skill), des Principes fondamentaux (les règles non-négociables numérotées), un Process étape par étape (le workflow précis dans l'ordre), des Anti-patterns (ce qu'on ne fait jamais avec le pourquoi), et une Checklist de validation (liste actionnable avant de passer à la suite).\n\n" +
          "```\n" +
          "# Skill : [NOM]\n" +
          "\n" +
          "## Rôle\n" +
          "[Qui est l'IA quand elle charge ce skill]\n" +
          "\n" +
          "## Principes fondamentaux\n" +
          "[Les règles non-négociables, numérotées]\n" +
          "\n" +
          "## Process étape par étape\n" +
          "[Le workflow précis dans l'ordre]\n" +
          "\n" +
          "## Anti-patterns\n" +
          "[Ce qu'on ne fait jamais, avec le pourquoi]\n" +
          "\n" +
          "## Checklist de validation\n" +
          "[Liste actionnable avant de passer à la suite]\n" +
          "```\n\n" +
          "Le meta-skill : crée un skill-creator.md qui encode le process de création d'un Skill. Ensuite, chaque nouveau workflow que tu développes peut être transformé en Skill en quelques minutes. Le système se nourrit lui-même. Un skill pour créer des skills.\n\n" +
          "La logique business : tu crées un process, par exemple la semi-automatisation des articles de ton site. Tu en fais un Skill. Tu l'utilises à chaque fois que tu veux publier des articles, tu ne repars pas de zéro. L'IA répète ce process sur demande, en suivant chaque étape comme un SOP. C'est de la scalabilité sans recrutement.",
      },
    ],
    videos: [],
  },
  {
    id: "3",
    titre: "Bloc 3 : Les frameworks",
    sections: [
      {
        id: "b3-s1",
        title: "Le workflow et le brief produit",
        content:
          "Voici le workflow dans l'ordre. Chaque phase a un rôle précis. On ne saute pas d'étape.\n\n" +
          "```\n" +
          "PHASE 1 — RECHERCHE ET CONTEXTE\n" +
          "   Perplexity : veille marché, analyse concurrents\n" +
          "   NotebookLM : agrégation de sources sectorielles\n" +
          "   LLM dédié (projet Claude/Gem) : brief produit\n" +
          "\n" +
          "PHASE 2 — DESIGN MVP\n" +
          "   Google Stitch : génération des écrans complets\n" +
          "   Export vers Figma, AI Studio, ou Antigravity via MCP\n" +
          "   AI Studio : affinage interactif des écrans complexes\n" +
          "\n" +
          "PHASE 3 — INITIALISATION\n" +
          "   GitHub : repo + structure de branches\n" +
          "\n" +
          "PHASE 4 — DÉVELOPPEMENT\n" +
          "   Antigravity ou Cursor avec Claude Code\n" +
          "   MCP connectés\n" +
          "   Skills chargés — on code.\n" +
          "\n" +
          "PHASE 5 — VALIDATION ET DÉPLOIEMENT\n" +
          "   Vercel : connexion repo, preview automatique\n" +
          "   Variables d'environnement configurées\n" +
          "   Preview Vercel sur chaque push\n" +
          "   Checklists de validation\n" +
          "   Merge sur main uniquement quand validé\n" +
          "```\n\n" +
          "Un brief produit n'est pas un cahier des charges de 40 pages. C'est un document d'une à deux pages qui répond à sept questions précises. Si tu ne peux pas y répondre, le projet n'est pas prêt à être construit.\n\n" +
          "Les 7 questions du brief produit : 1. Qui est l'utilisateur principal et quel est son contexte ? 2. Quel est le problème qu'il a en arrivant sur ce site ou cette app ? 3. Quelle est l'action principale qu'on veut qu'il fasse ? 4. Quels sont les trois messages clés qu'il doit retenir ? 5. Qui sont les concurrents directs et comment se différencie-t-on ? 6. Quelles sont les contraintes techniques ou business non-négociables ? 7. Comment mesure-t-on le succès à 30 jours et 90 jours ? Si tu ne peux pas répondre à une de ces questions, le projet n'est pas prêt.\n\n" +
          "Le framework projet LLM : la méthode des projets spécialisés. Un LLM généraliste répond à tout mais excelle rarement. Un projet Claude ou Gem spécialisé répond moins de choses mais les fait beaucoup mieux, parce qu'il a le bon contexte chargé en permanence. À chaque conversation, il part avec tout le contexte disponible sans que tu aies à réexpliquer.\n\n" +
          "Les trois projets LLM fondamentaux à créer. Projet Brand et Copy : spécialisé dans l'identité verbale et le copywriting d'un projet spécifique. Il connaît la mission, le vocabulaire autorisé, les personas, le ton. Il produit du texte cohérent dès le premier draft. Projet Architecture : spécialisé dans les décisions techniques, stack, schéma de données, routes API, décisions de sécurité. Tu lui poses les questions structurantes avant d'ouvrir l'IDE. Projet UX : spécialisé dans les parcours utilisateurs, les états d'interface, les messages d'erreur. Il simule l'utilisateur et identifie les frictions avant qu'elles soient codées.\n\n" +
          "Plus le prompt système d'un projet est précis, moins tu expliques à chaque session. Le projet LLM garde tout en mémoire, tu n'expliques jamais deux fois.\n\n" +
          "La structure minimale d'un projet LLM spécialisé :\n\n" +
          "```\n" +
          "RÔLE\n" +
          "[Qui est l'IA — expert en quoi, spécialisé dans quel secteur]\n" +
          "\n" +
          "PROJET\n" +
          "[Nom, contexte, problème résolu, utilisateur cible]\n" +
          "\n" +
          "STACK\n" +
          "[Technologies utilisées]\n" +
          "\n" +
          "RÈGLES\n" +
          "[Ce que l'IA fait et ne fait jamais sur ce projet]\n" +
          "```",
      },
      {
        id: "b3-s2",
        title: "Brand System, Design System et Parcours utilisateurs",
        content:
          "La plupart des gens sautent directement au design system : les couleurs, les polices, le logo. C'est l'erreur. Un design system sans brand system, c'est des règles visuelles sans âme. Le résultat : quelque chose de propre, mais qui pourrait être n'importe quelle autre marque. La brand architecture répond à une question avant tout : qui es-tu, et comment ça se voit et s'entend dans chaque détail du produit ?\n\n" +
          "Le brand system se construit en quatre couches dans l'ordre. Couche 1, la fondation : la mission (ce que tu fais concrètement pour qui, pas une phrase inspirante mais une action précise), l'anti-mission (ce que tu refuses d'être, souvent plus révélateur que la mission, elle définit tes frontières), et la tension de marque (le paradoxe que tu résous : \"Technique ET humain\", \"Premium ET accessible\"). C'est ce qui rend une marque mémorable, elle tient ensemble deux choses que le marché pensait incompatibles.\n\n" +
          "Couche 2, la personnalité : cinq adjectifs maximum. Chaque adjectif a une définition pratique et un opposé à éviter. Rigoureux ne veut pas dire froid. Direct ne veut pas dire brutal. Confiant ne veut pas dire arrogant. Pour le B2B premium, quatre archétypes fonctionnent : le Sage (autorité par la connaissance), le Souverain (autorité par le statut), le Gardien (autorité par la protection), le Créateur (autorité par l'innovation). Un dominant, un secondaire maximum. Pas les quatre à la fois.\n\n" +
          "Couche 3, l'identité verbale : la voix est constante, c'est le caractère de la marque. Le ton s'adapte au contexte, plus formel dans un contrat, plus direct dans un email d'onboarding. Ce qu'on applique systématiquement : phrases courtes, vocabulaire précis, parler du client plutôt que de soi, éviter les superlatifs et les adverbes d'intensité. \"Vraiment\", \"extrêmement\", \"incroyable\" sonnent creux. Les faits convainquent, pas les adjectifs.\n\n" +
          "Couche 4, l'intégration dans le prompt système : une fois les trois couches définies, elles rentrent dans le prompt système du projet. Pas juste les couleurs hex. Le positionnement, les cinq adjectifs de personnalité, le guide verbal, les mots autorisés et interdits. L'IA génère alors du contenu qui ressemble à la marque dès le départ. Sans ce contexte : copywriting générique à réécrire entièrement. Avec ce contexte : premier draft dans le bon registre à affiner à la marge.\n\n" +
          "Le design system repose sur quatre piliers. Sans design system documenté, l'IA produit ce qu'elle connaît le mieux : le template SaaS bleu et blanc générique qu'elle a vu dix mille fois. Avec un design system, chaque composant respecte les mêmes règles. La cohérence devient une contrainte structurelle, pas un effort.\n\n" +
          "Couleurs : couleur primaire (dominante, porteur de l'identité), couleur secondaire (accents, hover states), couleur neutre (fond, texte, structure), couleur sémantique (succès, erreur, avertissement). Règle d'usage : 60% primaire, 30% secondaire, 10% sémantique.\n\n" +
          "Typographies : deux fontes maximum. Une pour les titres (autorité, personnalité), une pour le corps (lisibilité absolue). Trois fontes ou plus signalent l'indécision. L'espacement : système basé sur une unité de 8px. L'espacement généreux est le marqueur visuel le plus puissant d'un design premium. Un site institutionnel qui respire communique la confiance. L'iconographie : une seule librairie par projet. Dans notre stack : Lucide React, intégré nativement dans shadcn/ui. Jamais de mélange entre librairies.\n\n" +
          "Les styles de design, six registres au total. Le minimalisme : espace négatif comme élément de design, typographie principale, palette réduite. Pour les cabinets de conseil, les marques premium, les portfolios. L'Apple Aesthetics : clarté absolue, matériaux qui semblent physiques, animations fluides, attention aux détails. Pour les produits tech grand public. Le Glassmorphism : effet de verre dépoli, background blur, opacité partielle. Pour les dashboards et les apps data. Fonctionne uniquement avec une palette sombre ou très claire, pas sur du blanc cassé. Le Flat Design : formes géométriques, couleurs vives et franches, ombres minimales. Pour les apps éducatives, les outils productivité, les interfaces très denses. Le Neumorphism : relief subtil sur fond monochrome, ombres internes et externes. Pour les interfaces audio, les apps de méditation, les outils créatifs. Très difficile à réussir sur mobile. Le Dark Premium : fonds sombres proches du noir, typographie lumineuse, accents néon ou or. Pour les outils professionnels, les dashboards IA, les plateformes financières. La règle : chaque style est un outil. On choisit le registre qui correspond à l'identité de la marque, pas celui qu'on trouve le plus beau ce matin.\n\n" +
          "Le parcours utilisateur, c'est la cartographie complète de tout ce qu'un utilisateur fait, pense, ressent, et décide depuis le moment où il entend parler du produit jusqu'au moment où il accomplit son objectif. Ce n'est pas un luxe de grande entreprise. C'est la fondation qui détermine si l'application sera utilisée ou abandonnée.\n\n" +
          "Trois niveaux à définir. Niveau 1, le parcours macro : toutes les étapes depuis la découverte jusqu'à la fidélisation. Découverte, considération, inscription, activation, valeur, habitude, expansion, fidélisation. Niveau 2, les User Flows : le détail précis de chaque action importante. Pour chaque action clé : chaque écran, chaque décision, chaque alternative, chaque cas d'erreur. Niveau 3, la carte d'empathie : ce que l'utilisateur fait, pense, ressent, dit, et entend pendant son parcours. Nourrit directement les décisions d'interface et les microcopy.\n\n" +
          "Sur chaque composant data, quatre états obligatoires. L'état loading : un skeleton ou spinner pendant le chargement, jamais une page blanche. L'état vide : un message clair quand il n'y a pas encore de données, avec un CTA vers l'action correspondante. L'état erreur : un message compréhensible par un humain, jamais \"Error 500\" ou un stack trace brut. L'état chargé : les données affichées proprement. Sans ces quatre états, le composant n'est pas fini. Pas d'exception.",
      },
      {
        id: "b3-s3",
        title: "Sécurité, Architecture et SEO",
        content:
          "La règle absolue en sécurité : Secure by design est supérieur à Secure by review est supérieur à Secure by patch. La sécurité intégrée dès l'architecture coûte dix fois moins cher que la sécurité ajoutée après coup, et cent fois moins qu'une faille en production.\n\n" +
          "Tu n'as pas besoin d'être développeur backend pour comprendre la sécurité. Tu as besoin de comprendre les principes fondamentaux et de savoir comment les faire appliquer par l'IA correctement. Va dans le détail de la sécurité pour chercher toutes les failles possibles et inimaginables. Plus tu donnes de contexte pour la sécu, plus tu es safe.\n\n" +
          "OWASP Top 10 : la référence universelle des dix catégories de vulnérabilités web les plus critiques. Broken Access Control : un utilisateur accède à des ressources qui ne lui appartiennent pas. Exemple concret, un client modifie l'URL /portal/user/123 en /portal/user/456 et voit les données de quelqu'un d'autre. Solution : toujours vérifier les droits côté serveur, jamais uniquement côté interface.\n\n" +
          "Injection : du code malveillant injecté via un champ de formulaire et exécuté par le serveur. Solution dans notre stack : utiliser les méthodes Supabase typées plutôt que des requêtes SQL construites à la main. Valider tous les inputs avec Zod.\n\n" +
          "Cryptographic Failures : des mots de passe stockés en clair, des communications non chiffrées. Solution : Supabase Auth gère le hachage des mots de passe automatiquement. HTTPS est forcé par Vercel par défaut. Security Misconfiguration : des clés API dans le code, des messages d'erreur qui révèlent la structure du serveur, des permissions trop larges. Solution : variables d'environnement dans Vercel uniquement, jamais dans le code.\n\n" +
          "Les règles non-négociables quelle que soit la nature du produit. Jamais de secret dans le code ou dans le repo GitHub, même privé. Clés API, mots de passe, tokens : uniquement dans les variables d'environnement Vercel. HTTPS actif sur tous les environnements. Validation des données côté serveur sur chaque formulaire et chaque route API. Messages d'erreur génériques côté utilisateur, les erreurs techniques vont dans Sentry. Pour les apps et SaaS : Row Level Security sur toutes les tables Supabase, et vérification des droits côté serveur sur chaque route API.\n\n" +
          "La vision avancée : construire ses propres experts sécurité et architecture sur-mesure. Les skills génériques couvrent le cas moyen. Un skill sur-mesure couvre ton cas exact, avec les vecteurs d'attaque spécifiques à tes features. C'est la différence entre un médecin généraliste et un spécialiste qui a ton dossier complet devant lui.\n\n" +
          "La méthode en quatre étapes. Étape 1 : charge les références mondiales dans NotebookLM ou Perplexity. Pour la sécurité : la documentation OWASP Top 10 complète, les guides de sécurité Supabase sur le Row Level Security, les bonnes pratiques de sécurité Next.js officiels. Si ton projet a Stripe : la documentation des webhooks Stripe et leur validation de signature. Si ton projet a des utilisateurs : les recommandations RGPD pour les données personnelles en France.\n\n" +
          "Étape 2 : interroge en profondeur avant de créer le skill. Une fois les sources chargées, tu poses des questions précises sur ton projet. Pour un SaaS avec authentification, plans d'abonnement Stripe, et appels OpenAI, quelles sont les 15 failles les plus probables selon l'OWASP ? Plus tu es précis sur tes features réelles, plus les réponses sont chirurgicales.\n\n" +
          "Étape 3 : crée un Projet Claude expert avec tout ce contexte accumulé. Il produit deux fichiers .md calibrés sur ton projet exact. Étape 4 : charge ces fichiers depuis /docs dans l'IDE. Claude Code les applique sur chaque session. Il ne part jamais d'une page blanche sur la sécurité de ce projet.\n\n" +
          "En architecture, la règle numéro 1 : centralise tous les appels Supabase dans /lib/data/. Ne mélange jamais le \"comment ça s'affiche\" avec le \"comment on récupère les données\". Si tu changes de base de données dans 6 mois, tu veux n'avoir qu'un seul dossier à toucher, pas 40 fichiers éparpillés.\n\n" +
          "Les sept règles d'architecture à encoder dans ton skill. Separation of Concerns : un fichier fait une chose, un composant affiche, une fonction récupère, une route API traite, jamais les trois en même temps. DRY (Don't Repeat Yourself) : toute logique dupliquée dans plusieurs endroits doit être extraite en fonction ou hook partagé, tu corriges un bug une fois pas dix. Taille des fichiers limitée à 300 lignes : au-delà c'est le signal que le fichier fait trop de choses. Les 4 états sur chaque composant data sans exception. Configuration via variables d'environnement uniquement, aucune valeur hardcodée. Stateless par défaut : Next.js sur Vercel fonctionne en serverless, zéro état stocké en mémoire entre les requêtes, tout ce qui doit persister va dans Supabase. Monolithe modulaire d'abord : n'over-engineer pas avant que le MRR le justifie, les micro-services c'est pour quand tu embauches un DevOps.\n\n" +
          "SEO et GEO : deux disciplines distinctes. Le SEO pour la visibilité sur Google, le GEO (Generative Engine Optimization) pour la visibilité dans les LLM comme Claude, ChatGPT, Perplexity. Ils ne s'ajoutent pas après le lancement, ils s'intègrent pendant la conception et le développement.\n\n" +
          "Le minimum vital SEO : métadonnées uniques sur chaque page (title et description précis avec mots-clés naturellement intégrés, jamais de titres génériques \"Accueil\"). Schema.org pour le balisage sémantique : LocalBusiness pour un artisan, Product avec prix et disponibilité pour de l'e-commerce, Article avec auteur et date pour du contenu. Sitemap.xml généré automatiquement avec Next.js. Core Web Vitals au-dessus de 75 sur mobile, une page à 40/100 ne sera pas bien référencée peu importe la qualité du contenu.\n\n" +
          "Le llms.txt : fichier texte placé à la racine du site (comme robots.txt). Il dit aux LLM ce qu'est le site, ce qu'il fait, ce qu'il ne fait pas, et comment le citer correctement. Format standard émergent, déjà lu par Perplexity et certains crawlers IA. Vingt minutes de travail à la fin de chaque projet, pas trois jours d'optimisation.\n\n" +
          "Voici la structure de base d'un skill-security.md à créer dans /docs de chaque projet :\n\n" +
          "```\n" +
          "# Skill : Sécurité Backend\n" +
          "\n" +
          "## Rôle\n" +
          "Tu es un ingénieur sécurité senior sur la stack Next.js + Supabase.\n" +
          "Tu appliques ces vérifications sur chaque Route Handler et chaque composant qui gère des données utilisateur.\n" +
          "Si jamais il y a d'autres failles visibles, tu les mentionnes et tu les règles.\n" +
          "\n" +
          "## Checklist sur chaque Route Handler\n" +
          "1. Authentification vérifiée en premier\n" +
          "2. Autorisation vérifiée en second (l'utilisateur a-t-il le droit ?)\n" +
          "3. Inputs validés avec Zod\n" +
          "4. Rate limiting si la route est sensible\n" +
          "5. Réponse sans données superflues ni stack trace\n" +
          "\n" +
          "## Anti-patterns à détecter immédiatement\n" +
          "- Clé SUPABASE_SERVICE_ROLE_KEY dans un fichier client\n" +
          "- Requêtes SQL construites par concaténation de strings\n" +
          "- Absence de vérification d'autorisation sur une route API\n" +
          "- dangerouslySetInnerHTML avec du contenu utilisateur non sanitisé\n" +
          "- Math.random() pour générer des tokens (prévisible)\n" +
          "\n" +
          "## Règles absolues\n" +
          "- Jamais de secret dans le code ou le repo\n" +
          "- Toujours valider côté serveur, jamais uniquement côté client\n" +
          "- Erreurs techniques dans les logs (Sentry), pas dans la réponse utilisateur\n" +
          "```\n\n" +
          "Et voici le prompt d'audit sécurité à lancer en fin de projet depuis l'IDE :\n\n" +
          "```\n" +
          "Tu es un ingénieur sécurité senior. Charge le skill-security.md depuis /docs et effectue un audit complet du projet.\n" +
          "\n" +
          "Pour chaque point de la checklist du skill :\n" +
          "1. Vérifie si le point est respecté dans le code\n" +
          "2. Si non : identifie le fichier exact et la ligne concernée\n" +
          "3. Classe la criticité : CRITIQUE / IMPORTANTE / MINEURE\n" +
          "4. Propose le correctif exact, pas seulement le diagnostic\n" +
          "\n" +
          "Commence par les points CRITIQUES. Ne passe pas à la suite tant qu'un point critique n'est pas résolu.\n" +
          "\n" +
          "Liens à vérifier en priorité :\n" +
          "- Toutes les Route Handlers dans /app/api/\n" +
          "- Toutes les fonctions dans /lib/data/\n" +
          "- Toutes les pages avec formulaires\n" +
          "- Le fichier de configuration des webhooks Stripe (si présent)\n" +
          "- Les règles RLS dans Supabase (demande-moi de les partager si nécessaire)\n" +
          "```\n\n" +
          "La règle numéro 1 en architecture : centralise tous les appels Supabase dans /lib/data/. La séparation est non-négociable — elle va dans ton PROMPT-SYSTEM.md dès le début du projet.\n\n" +
          "```\n" +
          "/lib\n" +
          "  /data\n" +
          "    users.ts       → toutes les fonctions liées aux utilisateurs\n" +
          "    orders.ts      → toutes les fonctions liées aux commandes\n" +
          "    products.ts    → toutes les fonctions liées aux produits\n" +
          "  /stripe\n" +
          "    client.ts      → initialisation Stripe\n" +
          "    webhooks.ts    → traitement des webhooks\n" +
          "  /openai\n" +
          "    client.ts      → initialisation OpenAI\n" +
          "```\n\n" +
          "Voici le skill-architecture.md à créer dans /docs de chaque projet :\n\n" +
          "```\n" +
          "# Skill : Architecture\n" +
          "\n" +
          "## Rôle\n" +
          "Tu es un architecte logiciel senior spécialisé sur la stack Next.js 14 App Router + Supabase + Vercel.\n" +
          "Tu appliques ces principes sur chaque fichier que tu génères ou modifies.\n" +
          "Si tu détectes une violation de ces principes dans le code existant, tu le signales.\n" +
          "\n" +
          "## Règles non-négociables\n" +
          "\n" +
          "1. Separation of Concerns\n" +
          "   - Tous les appels Supabase dans /lib/data/ uniquement\n" +
          "   - Les composants React n'interrogent jamais la BDD directement\n" +
          "   - Les Route Handlers API ne contiennent pas de logique métier complexe\n" +
          "\n" +
          "2. DRY — Don't Repeat Yourself\n" +
          "   - Toute logique présente plus de deux fois → extraire en fonction/hook partagé\n" +
          "   - Les types TypeScript définis une seule fois dans /types/\n" +
          "\n" +
          "3. Taille des fichiers\n" +
          "   - Maximum 300 lignes par fichier\n" +
          "   - Au-delà → signal de refactoring nécessaire, proposer la découpe\n" +
          "\n" +
          "4. Les 4 états sur chaque composant data\n" +
          "   - loading : skeleton ou spinner approprié\n" +
          "   - empty : message humain + CTA pertinent\n" +
          "   - error : message humain (jamais de stack trace), action de récupération\n" +
          "   - loaded : le contenu\n" +
          "\n" +
          "5. Configuration externalisée\n" +
          "   - Zéro valeur hardcodée qui appartient à l'environnement\n" +
          "   - Toutes les clés, URLs, secrets → variables d'environnement Vercel\n" +
          "\n" +
          "6. Stateless\n" +
          "   - Zéro état stocké en mémoire sur le serveur entre les requêtes\n" +
          "   - L'état persistant appartient à Supabase\n" +
          "\n" +
          "## Anti-patterns à détecter et corriger\n" +
          "- Appel Supabase dans un composant React ou une page\n" +
          "- Logique métier dans un composant UI\n" +
          "- Même bloc de code copié à deux endroits différents\n" +
          "- Fichier de plus de 300 lignes sans proposition de découpe\n" +
          "- Valeur d'environnement hardcodée dans le code\n" +
          "\n" +
          "## Checklist avant de valider un fichier\n" +
          "- [ ] Ce fichier fait-il une seule chose ?\n" +
          "- [ ] Les appels BDD sont-ils dans /lib/data/ ?\n" +
          "- [ ] Les 4 états sont-ils couverts si le composant gère de la data ?\n" +
          "- [ ] Y a-t-il de la duplication visible ?\n" +
          "- [ ] Le fichier fait-il moins de 300 lignes ?\n" +
          "```\n\n" +
          "Pour construire des experts sécurité et architecture sur-mesure, voici les prompts à utiliser dans NotebookLM ou un projet Claude dédié après avoir chargé les références mondiales.\n\n" +
          "Prompt d'interrogation sécurité :\n\n" +
          "```\n" +
          "Pour un SaaS avec authentification utilisateur, plans d'abonnement Stripe,\n" +
          "dashboard personnel, et appels à l'API OpenAI, quelles sont les 15 failles\n" +
          "de sécurité les plus probables et les plus critiques selon l'OWASP ?\n" +
          "Pour chacune, donne-moi le vecteur d'attaque exact et la contre-mesure\n" +
          "spécifique dans Next.js 14 + Supabase.\n" +
          "```\n\n" +
          "Prompt d'interrogation architecture :\n\n" +
          "```\n" +
          "Pour une application Next.js 14 App Router avec Supabase, Stripe webhooks,\n" +
          "et génération de PDF, quelles sont les règles d'architecture les plus\n" +
          "importantes à encoder dans un PROMPT-SYSTEM pour qu'une IA génère\n" +
          "du code maintenable et scalable ? Base-toi sur le Twelve-Factor App\n" +
          "et les best practices Next.js officiels.\n" +
          "```\n\n" +
          "Prompt pour créer ton projet Claude expert sur-mesure :\n\n" +
          "```\n" +
          "Tu es un expert en sécurité backend et en architecture logicielle,\n" +
          "spécialisé sur la stack suivante : Next.js 14 App Router, Supabase,\n" +
          "Stripe, OpenAI API, Vercel.\n" +
          "\n" +
          "Tu as chargé et assimilé :\n" +
          "- L'OWASP Top 10\n" +
          "- Les guides de sécurité Supabase (RLS, Auth)\n" +
          "- Le Twelve-Factor App\n" +
          "- Les best practices Next.js 14 officiels\n" +
          "\n" +
          "Mon projet est [description précise].\n" +
          "Il a les features suivantes : [liste].\n" +
          "Les données sensibles traitées sont : [liste].\n" +
          "\n" +
          "Ta mission : m'aider à créer un skill-security.md et un\n" +
          "skill-architecture.md ultra-précis, calibrés exactement sur ce projet.\n" +
          "Commence par me poser les questions dont tu as besoin.\n" +
          "```\n\n" +
          "Le llms.txt — à placer à la racine de chaque projet en fin de développement :\n\n" +
          "```\n" +
          "# llms.txt\n" +
          "\n" +
          "> [Description du site en 2 phrases]\n" +
          "\n" +
          "## Pages principales\n" +
          "- [Accueil](URL) : [description courte]\n" +
          "- [Services](URL) : [description courte]\n" +
          "- [Contact](URL) : [description courte]\n" +
          "\n" +
          "## Sujets d'autorité\n" +
          "- [Sujet 1 sur lequel le site fait référence]\n" +
          "- [Sujet 2]\n" +
          "\n" +
          "## Citation préférée\n" +
          "[Nom de l'organisation ou du créateur], [URL principale]\n" +
          "```\n\n" +
          "Et voici le prompt d'audit architecture à lancer en fin de projet depuis l'IDE :\n\n" +
          "```\n" +
          "Tu es un architecte logiciel senior. Charge le skill-architecture.md\n" +
          "depuis /docs et effectue un audit d'architecture complet du projet.\n" +
          "\n" +
          "Pour chaque règle du skill :\n" +
          "1. Vérifie si la règle est respectée dans la structure du code\n" +
          "2. Si non : identifie les fichiers concernés\n" +
          "3. Classe l'impact : DETTE TECHNIQUE HAUTE / MOYENNE / FAIBLE\n" +
          "4. Propose le refactoring exact si la dette est haute\n" +
          "\n" +
          "Points spécifiques à vérifier :\n" +
          "- Y a-t-il des appels Supabase en dehors de /lib/data/ ?\n" +
          "- Y a-t-il des composants React qui dépassent 300 lignes ?\n" +
          "- Y a-t-il de la logique dupliquée visible entre plusieurs fichiers ?\n" +
          "- Les 4 états (loading/empty/error/loaded) sont-ils couverts\n" +
          "  sur chaque composant data ?\n" +
          "- Les variables d'environnement sont-elles correctement externalisées ?\n" +
          "\n" +
          "Donne-moi le rapport en deux parties :\n" +
          "1. Ce qui doit être corrigé avant la mise en ligne (dette haute)\n" +
          "2. Ce qui peut attendre la V2 mais doit être noté (dette moyenne/faible)\n" +
          "```",
      },
    ],
    videos: [],
  },
  {
    id: "4",
    titre: "Bloc 4 : Les templates",
    sections: [
      {
        id: "b4-s1",
        title: "Pourquoi ces templates changent tout",
        content:
          "La plupart des templates qu'on trouve en ligne sont des squelettes vides. Tu les remplis, tu les donnes à l'IA, et l'IA produit quelque chose de moyen parce qu'elle n'a pas eu assez de contexte pour faire mieux.\n\n" +
          "Ces templates sont conçus différemment. Chaque template a trois caractéristiques qui font toute la différence.\n\n" +
          "Où l'utiliser : dans un projet Claude ou Gem pour les documents de réflexion et de contexte, ou dans l'IDE pour tout ce qui touche au code. Ce n'est pas interchangeable. Charger un BRIEF.md dans Cursor n'a pas le même effet que dans un projet Claude dédié. Chaque outil a son rôle dans le workflow.\n\n" +
          "L'expertise déclarée : chaque prompt commence par déclarer une ou plusieurs expertises précises. L'IA opère différemment quand tu lui dis \"tu es un analyste produit senior spécialisé en SaaS B2B avec dix ans d'expérience en M&A tech\" versus \"tu es un développeur fullstack\". La précision du rôle détermine la précision du résultat. Tu peux même empiler plusieurs rôles sur un même prompt.\n\n" +
          "Le cadre d'action : chaque template définit ce que l'IA fait, ce qu'elle ne fait pas, les principes qui gouvernent chaque décision. Sans cadre, l'IA improvise. Avec un cadre précis, elle travaille dans les limites que tu as définies et te signale quand une demande sort de ce cadre.\n\n" +
          "Plus tu remplis ces templates avec précision, moins tu corriges après. Chaque ligne que tu ajoutes élimine une décision approximative de l'IA.\n\n" +
          "---\n\n" +
          "Template 1 — BRIEF.md\n\n" +
          "Où l'utiliser : Dans un projet Claude ou Gem dédié au projet, en fichier source. C'est le document de départ que tous les autres LLM du projet vont utiliser comme référence. Pas dans l'IDE, ce n'est pas du code, c'est de la réflexion produit.\n\n" +
          "Expertise à déclarer quand tu l'utilises : Analyste produit senior + expert du secteur cible du client.\n\n" +
          "```\n" +
          "# Brief Produit — [NOM DU PROJET]\n" +
          "Date : [DATE]\n" +
          "Type : Site vitrine / Application / SaaS\n" +
          "Secteur client : [Ex : gestion de patrimoine, M&A, logistique...]\n" +
          "\n" +
          "## Rôle de l'IA pour ce document\n" +
          "Tu es un analyste produit senior avec une expertise approfondie\n" +
          "dans [SECTEUR DU CLIENT]. Tu as accompagné des dizaines de projets\n" +
          "digitaux dans ce secteur. Tu comprends les enjeux métier, les\n" +
          "contraintes réglementaires, et le vocabulaire de ce domaine.\n" +
          "\n" +
          "Quand tu analyses ce brief, tu identifies les zones floues, tu poses\n" +
          "les questions manquantes, et tu t'assures que chaque décision de\n" +
          "produit est justifiée par un besoin réel de l'utilisateur — pas\n" +
          "par une préférence technique ou une envie de l'équipe projet.\n" +
          "\n" +
          "## L'utilisateur principal\n" +
          "Qui est-il ?\n" +
          "   Âge : [Ex : 32 ans]\n" +
          "   Rôle : [Ex : Analyste M&A dans un cabinet de 15 personnes]\n" +
          "   Niveau technique : [Débutant / Intermédiaire / Expert]\n" +
          "   Device principal : [Mobile 70% / Desktop 80% / Mix]\n" +
          "\n" +
          "Son contexte quand il arrive sur le produit :\n" +
          "   [Ex : Il vient de finir une réunion, il est sur son téléphone,\n" +
          "   il a 3 minutes pour trouver ce qu'il cherche]\n" +
          "\n" +
          "Son problème formulé dans ses mots à lui :\n" +
          "   [Ex : \"Je perds 3 heures par deal à compiler des données\n" +
          "   dans Excel alors que tout est déjà là\"]\n" +
          "\n" +
          "Ce qu'il essaie d'accomplir :\n" +
          "   [Ce qu'il veut résoudre — pas ce qu'on veut lui vendre]\n" +
          "\n" +
          "Ses objections probables :\n" +
          "   [Ce qui pourrait le faire hésiter ou partir]\n" +
          "\n" +
          "## Les objectifs du produit\n" +
          "Action principale souhaitée (une seule) :\n" +
          "   [Ex : Créer un compte et importer ses premiers documents]\n" +
          "\n" +
          "Trois messages clés à retenir après la visite :\n" +
          "   1. [Ce que le client doit retenir — lié à son problème réel]\n" +
          "   2. [...]\n" +
          "   3. [...]\n" +
          "\n" +
          "## Le marché\n" +
          "Concurrents directs (ceux que le client compare) :\n" +
          "   Concurrent 1 : [Nom + URL] — Ce qu'ils font bien : [X]\n" +
          "                              — Leur faiblesse : [X]\n" +
          "   Concurrent 2 : [Nom + URL] — Ce qu'ils font bien : [X]\n" +
          "                              — Leur faiblesse : [X]\n" +
          "\n" +
          "Notre différenciation (un fait, pas un adjectif) :\n" +
          "   [Ex : Seul outil M&A avec templates aux standards des\n" +
          "   banques d'affaires françaises, données hébergées en France]\n" +
          "\n" +
          "## Les contraintes\n" +
          "Techniques : [Ex : Intégration Google Drive requise]\n" +
          "Business : [Ex : RGPD strict, données en Europe]\n" +
          "Visuelles : [Ex : Respecter charte graphique existante]\n" +
          "Non-négociables : [Ce qu'on ne fera jamais sur ce projet]\n" +
          "\n" +
          "## La mesure du succès\n" +
          "À 30 jours : [Métrique précise — comportement utilisateur mesurable]\n" +
          "À 90 jours : [Métrique précise — résultat business mesurable]\n" +
          "```\n\n" +
          "---\n\n" +
          "Template 2 — BRAND-SYSTEM.md\n\n" +
          "Où l'utiliser : Dans un projet Claude ou Gem dédié. Ce fichier est chargé en permanence dans le projet — il nourrit tous les outputs de copywriting, les messages d'interface, les emails. Pas dans l'IDE directement, mais son contenu est collé dans le PROMPT-SYSTEM.md qui lui est chargé dans l'IDE.\n\n" +
          "Expertise à déclarer quand tu l'utilises : Directeur de marque senior + expert copywriting B2B dans le secteur cible.\n\n" +
          "```\n" +
          "# Brand System — [NOM DU PROJET / CLIENT]\n" +
          "\n" +
          "## Rôle de l'IA pour ce document\n" +
          "Tu es un directeur de marque senior avec une spécialisation en\n" +
          "identité verbale B2B dans [SECTEUR]. Tu sais que les marques qui\n" +
          "durent ne parlent pas de leur technologie — elles parlent du\n" +
          "problème qu'elles résolvent pour leurs clients.\n" +
          "\n" +
          "Quand tu travailles sur ce brand system, chaque décision verbale\n" +
          "et visuelle doit passer ce test : est-ce que ça parle au client,\n" +
          "ou est-ce que ça parle à l'ego de l'équipe projet ?\n" +
          "\n" +
          "## La fondation\n" +
          "Mission (action concrète pour qui) :\n" +
          "   [Ex : Nous aidons les cabinets M&A à produire leurs mémorandums\n" +
          "   dix fois plus vite, sans sacrifier la qualité]\n" +
          "\n" +
          "Anti-mission (ce qu'on refuse d'être) :\n" +
          "   [Ce qui permet de dire non sans hésiter]\n" +
          "\n" +
          "Tension de marque (le paradoxe qu'on résout) :\n" +
          "   [Ex : Aussi rigoureux qu'un banquier, aussi rapide qu'un logiciel]\n" +
          "\n" +
          "## La personnalité\n" +
          "Archétype dominant : [Sage / Souverain / Gardien / Créateur]\n" +
          "Archétype secondaire : [idem]\n" +
          "\n" +
          "Cinq adjectifs de personnalité :\n" +
          "   1. [Adjectif] — Ce que ça veut dire : [X] — Ce que ça ne veut PAS dire : [X]\n" +
          "   2. [...]\n" +
          "   3. [...]\n" +
          "   4. [...]\n" +
          "   5. [...]\n" +
          "\n" +
          "## L'identité verbale\n" +
          "Voix (constante) :\n" +
          "   [Ex : Directe, factuelle, sans superlatif.\n" +
          "   On parle comme un expert qui n'a pas besoin de convaincre.]\n" +
          "\n" +
          "Ton selon le contexte :\n" +
          "   Onboarding : [Ex : Encourageant, concret, orienté action]\n" +
          "   Erreurs : [Ex : Clair, solution immédiate, jamais alarmiste]\n" +
          "   Pricing : [Ex : Confiant, factuel, sans pression]\n" +
          "   Documentation : [Ex : Précis, pédagogue, économe en mots]\n" +
          "\n" +
          "Vocabulaire à utiliser :\n" +
          "   [Mots du secteur, termes que le client utilise lui-même]\n" +
          "\n" +
          "Vocabulaire à éviter absolument :\n" +
          "   [Ex : innovant, disruptif, révolutionnaire, game-changer]\n" +
          "\n" +
          "Formules interdites :\n" +
          "   [Ex : \"Nous sommes fiers de...\" — ça parle de nous, pas du client]\n" +
          "   [Ex : \"Notre solution...\" — parler du résultat client, pas de l'outil]\n" +
          "\n" +
          "## Couleurs\n" +
          "Primaire : #[HEX] — Ce qu'elle communique : [X] — Où elle domine : [X]\n" +
          "Secondaire : #[HEX] — Accents, CTA, hover states\n" +
          "Fond principal : #[HEX] — [Jamais blanc pur #FFFFFF sur du premium]\n" +
          "Texte principal : #[HEX]\n" +
          "Texte secondaire : #[HEX]\n" +
          "Succès : #[HEX] | Erreur : #[HEX]\n" +
          "\n" +
          "## Instruction pour l'IA\n" +
          "Quand tu génères du contenu pour ce projet, chaque phrase doit\n" +
          "passer deux tests avant d'être proposée :\n" +
          "1. Est-ce que ça parle du problème du client ou de nos fonctionnalités ?\n" +
          "2. Est-ce que ça ressemble à CETTE marque ou à n'importe quelle marque ?\n" +
          "Si l'une des réponses est mauvaise, réécris avant de proposer.\n" +
          "```",
      },
      {
        id: "b4-s2",
        title: "PRD, Parcours et Design Brief",
        content:
          "Template 3 — PRD.md (Product Requirements Document)\n\n" +
          "Où l'utiliser : Dans un projet Claude ou Gem dédié à la phase de conception produit. C'est le document de référence du produit, chargé en permanence dans le projet. Transmis ensuite à l'IDE comme fichier de contexte dans le PROMPT-SYSTEM.md. Essentiel pour les apps et SaaS, optionnel pour un site vitrine simple.\n\n" +
          "Expertise à déclarer quand tu l'utilises : Product Manager senior avec expérience en product-led growth pour les SaaS B2B dans le secteur cible.\n\n" +
          "```\n" +
          "# PRD — Product Requirements Document\n" +
          "Projet : [NOM]\n" +
          "Date : [DATE]\n" +
          "Version : 1.0\n" +
          "Statut : [Draft / Validé / En révision]\n" +
          "\n" +
          "## Rôle de l'IA pour ce document\n" +
          "Tu es un Product Manager senior avec dix ans d'expérience sur des\n" +
          "produits SaaS B2B dans [SECTEUR]. Tu as une expertise particulière\n" +
          "en product-led growth et en réduction du time-to-value.\n" +
          "\n" +
          "Ton cadre d'action ici : chaque fonctionnalité doit être justifiée\n" +
          "par un besoin utilisateur précis documenté dans le brief. Si une\n" +
          "feature n'est pas liée à un problème utilisateur réel, elle n'entre\n" +
          "pas dans ce PRD. Ton rôle est d'être le gardien de la cohérence\n" +
          "entre ce que le produit fait et ce que l'utilisateur a besoin.\n" +
          "\n" +
          "## Vision produit\n" +
          "En deux phrases : [Ce que c'est et pour qui]\n" +
          "\n" +
          "## Utilisateurs cibles\n" +
          "Profil 1 — [Nom du profil]\n" +
          "   Problème principal : [Formulé dans ses mots]\n" +
          "   Scénario d'usage principal : [Comment et quand il utilise le produit]\n" +
          "   Définition du succès pour lui : [Ce qu'il doit ressentir]\n" +
          "\n" +
          "Profil 2 — [Si applicable]\n" +
          "\n" +
          "## Fonctionnalités — priorisées\n" +
          "\n" +
          "### Priorité 1 — MVP (ce qui bloque le lancement si absent)\n" +
          "\n" +
          "Fonctionnalité : [NOM]\n" +
          "   Besoin utilisateur lié : [Lequel des problèmes documentés ça résout]\n" +
          "   Description comportementale : [Ce que l'utilisateur peut faire]\n" +
          "   Critères d'acceptation :\n" +
          "      - [ ] [Condition 1 — vérifiable et binaire]\n" +
          "      - [ ] [Condition 2]\n" +
          "      - [ ] [Condition 3]\n" +
          "   Ce que ce n'est PAS : [Ce qui est hors scope pour cette feature]\n" +
          "\n" +
          "### Priorité 2 — Post-lancement (améliore l'expérience)\n" +
          "\n" +
          "[Même structure]\n" +
          "\n" +
          "### Priorité 3 — Roadmap (ne bloque rien aujourd'hui)\n" +
          "\n" +
          "[Même structure]\n" +
          "\n" +
          "## Contraintes et décisions non-négociables\n" +
          "Technique : [Stack imposée, intégrations requises]\n" +
          "Sécurité : [Niveau de sécurité requis selon le secteur]\n" +
          "Réglementaire : [RGPD, contraintes sectorielles]\n" +
          "Performance : [Temps de réponse attendu, disponibilité]\n" +
          "\n" +
          "## Métriques de succès\n" +
          "Activation : [Ex : 40% des inscrits créent leur premier projet\n" +
          "              dans les 48h]\n" +
          "Rétention : [Ex : 70% des utilisateurs actifs après 30 jours]\n" +
          "Valeur : [Ex : Un utilisateur génère son premier output en moins\n" +
          "          de 2 heures]\n" +
          "```\n\n" +
          "---\n\n" +
          "Template 4 — PARCOURS-UTILISATEURS.md\n\n" +
          "Où l'utiliser : Dans un projet Claude ou Gem dédié à la réflexion UX. Ce document est généré avec le LLM (pas dans l'IDE) et est ensuite chargé comme contexte dans ton projet de développement. C'est de la conception, pas du code.\n\n" +
          "Expertise à déclarer quand tu l'utilises : UX researcher senior + Product Designer spécialisé en [secteur].\n\n" +
          "```\n" +
          "# Parcours Utilisateurs — [NOM DU PROJET]\n" +
          "\n" +
          "## Rôle de l'IA pour ce document\n" +
          "Tu es un UX researcher senior et Product Designer avec une\n" +
          "spécialisation dans [SECTEUR]. Tu as conduit des dizaines\n" +
          "d'entretiens utilisateurs dans ce domaine.\n" +
          "\n" +
          "Ton cadre d'action : tu simules l'utilisateur réel à chaque\n" +
          "étape de son parcours. Tu identifies les frictions avant qu'elles\n" +
          "soient codées. Tu rappelles systématiquement que l'utilisateur\n" +
          "ne lit pas, il scanne. Il ne retient pas les instructions,\n" +
          "il clique sur ce qui attire son attention. Il abandonne au\n" +
          "moindre obstacle non anticipé.\n" +
          "\n" +
          "Pour chaque écran, tu penses à ces quatre états avant tout le reste :\n" +
          "loading, vide, erreur, chargé. Un écran sans ces quatre états\n" +
          "est un écran incomplet.\n" +
          "\n" +
          "## Utilisateur : [NOM DU PROFIL]\n" +
          "Description : [Âge, rôle, contexte d'utilisation, pression temporelle]\n" +
          "\n" +
          "---\n" +
          "\n" +
          "## PARCOURS MACRO\n" +
          "\n" +
          "ÉTAPE 1 — Découverte\n" +
          "   Canal : [Comment il entend parler du produit]\n" +
          "   Question dans sa tête : [Ce qu'il se demande]\n" +
          "   Moment de vérité : [Ce qui l'accroche ou le fait partir en < 5 sec]\n" +
          "\n" +
          "ÉTAPE 2 — Évaluation\n" +
          "   Ce qu'il cherche à confirmer : [X]\n" +
          "   Objection principale : [X]\n" +
          "   Ce qui fait qu'il continue : [X]\n" +
          "\n" +
          "ÉTAPE 3 — Activation\n" +
          "   Action accomplie : [X]\n" +
          "   Moment aha : [La phrase qu'il se dit quand il comprend la valeur]\n" +
          "\n" +
          "ÉTAPE 4 — Conversion\n" +
          "   Déclencheur de l'achat : [X]\n" +
          "   Décideur final : [Lui / Son manager / Le DAF — précise qui signe]\n" +
          "\n" +
          "ÉTAPE 5 — Usage régulier\n" +
          "   Fréquence : [X fois par semaine/mois]\n" +
          "   Indicateur de rétention : [Ce qui fait qu'il revient]\n" +
          "\n" +
          "---\n" +
          "\n" +
          "## USER FLOWS — chaque action clé\n" +
          "\n" +
          "### Flow : [NOM DE L'ACTION]\n" +
          "Point de départ : [Écran + état de l'utilisateur]\n" +
          "\n" +
          "Étape 1 : [Écran]\n" +
          "   Ce qu'il voit : [Description précise — pas ce qu'on veut qu'il voie,\n" +
          "                   ce qu'il voit vraiment en arrivant]\n" +
          "   Ce qu'il fait : [Action]\n" +
          "   Sa question : [Ce qu'il se demande à ce moment précis]\n" +
          "   État loading : [Ce qu'on affiche — skeleton, message, progression]\n" +
          "   État erreur : [Message exact en langage humain]\n" +
          "\n" +
          "Étape 2 — [Même structure]\n" +
          "\n" +
          "Résultat : [Ce qu'il a accompli]\n" +
          "Confirmation : [Message de validation — toast, redirect, email]\n" +
          "\n" +
          "Cas d'abandon à gérer :\n" +
          "   - [Situation] → [Ce qu'on fait]\n" +
          "\n" +
          "---\n" +
          "\n" +
          "## LES QUATRE ÉTATS — à documenter pour chaque composant data\n" +
          "\n" +
          "Composant : [NOM]\n" +
          "\n" +
          "Loading :\n" +
          "   Affichage : [Skeleton / Spinner / Message \"Chargement en cours...\"]\n" +
          "   Jamais : page blanche, écran figé sans feedback\n" +
          "\n" +
          "Vide :\n" +
          "   Message : [Phrase en langage naturel]\n" +
          "   Sous-message : [Pourquoi c'est vide + quoi faire]\n" +
          "   CTA : [Bouton vers l'action suivante]\n" +
          "   Jamais : tableau vide sans explication\n" +
          "\n" +
          "Erreur :\n" +
          "   Message : [En langage humain — pas de code d'erreur]\n" +
          "   Action : [\"Réessayer\" / \"Contacter le support\" / autre]\n" +
          "   Log serveur : [Ce qui part dans Sentry — détail technique complet]\n" +
          "   Jamais : Error 500, stack trace, message en anglais sur interface FR\n" +
          "\n" +
          "Chargé :\n" +
          "   Hiérarchie info : [Ce qui est le plus important visuellement]\n" +
          "   Actions disponibles : [Ce que l'utilisateur peut faire]\n" +
          "\n" +
          "---\n" +
          "\n" +
          "## CARTE D'EMPATHIE — moment critique : [MOMENT CLÉ]\n" +
          "\n" +
          "Ce qu'il FAIT : [Comportement observable]\n" +
          "Ce qu'il PENSE : [Ses doutes, ses questions, ses espoirs]\n" +
          "Ce qu'il RESSENT : [Émotion dominante à ce moment]\n" +
          "Ce qu'il DIT : [Formulations exactes — vocabulaire métier]\n" +
          "Ce qu'il ENTEND : [Ce que son manager, collègues, clients lui disent]\n" +
          "\n" +
          "Décisions d'interface générées :\n" +
          "   [Ce que cette empathie implique concrètement pour l'UI]\n" +
          "```\n\n" +
          "---\n\n" +
          "Template 5 — DESIGN-BRIEF.md\n\n" +
          "Où l'utiliser : Dans un projet Claude ou Gem pour la phase de conception visuelle. Son contenu est ensuite collé dans le PROMPT-SYSTEM.md et chargé dans l'IDE. C'est un document de conception, pas un fichier de code.\n\n" +
          "Expertise à déclarer quand tu l'utilises : Designer UI senior spécialisé en interfaces B2B premium + expert en design systems.\n\n" +
          "```\n" +
          "# Design Brief — [NOM DU PROJET]\n" +
          "\n" +
          "## Rôle de l'IA pour ce document\n" +
          "Tu es un designer UI senior spécialisé en interfaces B2B premium\n" +
          "et expert en design systems. Tu as conçu des interfaces pour des\n" +
          "secteurs exigeants : finance, juridique, conseil, santé.\n" +
          "\n" +
          "Ton cadre d'action : tu ne génères jamais de design générique.\n" +
          "Chaque décision visuelle est justifiée par le secteur, par\n" +
          "l'utilisateur, et par la brand architecture définie. Tu signales\n" +
          "immédiatement quand une demande risque de produire un résultat\n" +
          "qui \"ressemble à un template SaaS\" plutôt qu'à une identité propre.\n" +
          "\n" +
          "## Identité visuelle\n" +
          "Style principal : [Minimalisme / Dark Premium / Apple Aesthetics /\n" +
          "                  Glassmorphism / Bento Grid / Brutalisme / Liquid Glass]\n" +
          "Registre en 3 mots : [Ex : Sobre / Précis / Autoritaire]\n" +
          "\n" +
          "Référence principale : [URL] — Ce qu'on en retient : [X]\n" +
          "Référence secondaire : [URL] — Ce qu'on en retient : [X]\n" +
          "\n" +
          "## Palette complète\n" +
          "Primaire : #[HEX]\n" +
          "   Usage : [Fond hero, titres principaux]\n" +
          "   Interdit pour : [Fond de texte long, éléments secondaires]\n" +
          "\n" +
          "Secondaire : #[HEX] — CTA, hover, accents\n" +
          "Fond principal : #[HEX] — [Jamais #FFFFFF pur sur du premium]\n" +
          "Fond secondaire : #[HEX] — Cartes, sections alternées\n" +
          "Texte principal : #[HEX]\n" +
          "Texte secondaire : #[HEX]\n" +
          "Bordures : #[HEX]\n" +
          "Succès : #[HEX] | Erreur : #[HEX] | Avertissement : #[HEX]\n" +
          "\n" +
          "## Typographies\n" +
          "Titres : [Fonte] — H1 600 / H2 500 / H3 400\n" +
          "Corps : [Fonte] — 400 — line-height 1.6\n" +
          "Interface (labels, boutons) : [Fonte ou identique au corps]\n" +
          "\n" +
          "Tailles :\n" +
          "   H1 : [3rem] | H2 : [2rem] | H3 : [1.5rem]\n" +
          "   Body large : [1.125rem] | Body : [1rem] | Caption : [0.875rem]\n" +
          "\n" +
          "## Espacement — système 8px strict\n" +
          "4 / 8 / 16 / 24 / 32 / 48 / 64 / 96px\n" +
          "Padding sections : [96px] | Padding cartes : [24px]\n" +
          "Gap grille : [24px] | Max-width contenu : [1200px]\n" +
          "\n" +
          "## Composants\n" +
          "Border-radius : Boutons [8px] / Cartes [12px] / Inputs [8px] / Badges [999px]\n" +
          "Ombres : Repos [0 1px 3px rgba(0,0,0,0.08)] / Hover [0 4px 12px rgba(0,0,0,0.12)]\n" +
          "Bouton primaire : [fond secondaire, texte blanc]\n" +
          "Bouton secondaire : [transparent, border 1px primaire]\n" +
          "Bouton désactivé : [opacity 0.4, cursor not-allowed]\n" +
          "\n" +
          "## Interdits absolus\n" +
          "[Ex : Pas d'emojis dans l'interface]\n" +
          "[Ex : Pas de gradient harsh]\n" +
          "[Ex : Jamais trois colonnes sur mobile]\n" +
          "[Ex : Animations max 300ms]\n" +
          "```",
      },
      {
        id: "b4-s3",
        title: "PROMPT-SYSTEM et Checklist de Lancement",
        content:
          "Template 6 — PROMPT-SYSTEM.md\n\n" +
          "Où l'utiliser : Dans l'IDE — Antigravity ou Cursor — en fichier de règles ou CLAUDE.md au niveau du projet. C'est le fichier que Claude Code charge automatiquement à chaque session. C'est aussi chargeable manuellement dans AI Studio pour les sessions longues de génération.\n\n" +
          "Expertise à déclarer : Combinaison des expertises du projet — développeur fullstack + expert du secteur + ingénieur sécurité. On empile les rôles parce que le code doit être juste techniquement, pertinent métier, et sécurisé.\n\n" +
          "```\n" +
          "# Prompt Système — [NOM DU PROJET]\n" +
          "Version : 1.0 | Date : [DATE]\n" +
          "\n" +
          "## Qui tu es\n" +
          "Tu es un développeur fullstack senior, designer UI/UX expérimenté,\n" +
          "et ingénieur sécurité, avec une expertise approfondie dans le secteur\n" +
          "[SECTEUR DU CLIENT].\n" +
          "\n" +
          "Tu travailles comme si tu étais le lead technique responsable de ce\n" +
          "produit devant des vrais utilisateurs et des vrais clients. Chaque\n" +
          "ligne de code que tu génères sera lue par un humain, exécutée sur\n" +
          "un serveur, et utilisée par quelqu'un dont les données comptent.\n" +
          "\n" +
          "Tu ne génères pas de code générique. Tu ne proposes pas de solutions\n" +
          "\"standard\" quand le contexte du projet indique un besoin spécifique.\n" +
          "Tu signales quand une demande est incohérente avec le brief ou le\n" +
          "design system.\n" +
          "\n" +
          "## Ton cadre d'action\n" +
          "Tu opères avec ces fichiers de contexte :\n" +
          "   - BRIEF.md : qui est l'utilisateur et quel est son problème\n" +
          "   - PRD.md : ce que le produit doit faire et pourquoi\n" +
          "   - BRAND-SYSTEM.md : comment la marque parle et se présente\n" +
          "   - DESIGN-BRIEF.md : toutes les règles visuelles\n" +
          "   - PARCOURS-UTILISATEURS.md : les flows et les quatre états\n" +
          "\n" +
          "Tout ce qui contredit ces fichiers doit être signalé avant\n" +
          "d'être implémenté.\n" +
          "\n" +
          "## Le projet\n" +
          "Nom : [NOM]\n" +
          "Type : [Site / App / SaaS]\n" +
          "Description : [2 phrases — ce que ça fait et pour qui exactement]\n" +
          "\n" +
          "## Stack technique\n" +
          "Next.js 14 App Router | Tailwind CSS | shadcn/ui\n" +
          "Supabase (Auth + DB + Storage + RLS) | Vercel\n" +
          "[Stripe si paiement] | [Resend si emails] | Sentry | PostHog\n" +
          "\n" +
          "## Design system\n" +
          "[COLLER ICI LE CONTENU COMPLET DE DESIGN-BRIEF.MD]\n" +
          "\n" +
          "## Brand system\n" +
          "[COLLER ICI VOIX, TON, VOCABULAIRE DE BRAND-SYSTEM.MD]\n" +
          "\n" +
          "## L'utilisateur\n" +
          "[RÉSUMÉ DU PROFIL EN 3 LIGNES]\n" +
          "[Son problème en une phrase dans ses mots]\n" +
          "[Ce qu'il doit ressentir après avoir utilisé ce produit]\n" +
          "\n" +
          "## Principes inviolables — dans cet ordre\n" +
          "1. Chaque écran couvre ses quatre états : loading, vide, erreur, chargé.\n" +
          "   Si tu génères un composant sans ces quatre états, c'est incomplet.\n" +
          "2. Validation côté serveur avec Zod sur chaque route API et formulaire.\n" +
          "   La validation client seule n'est pas suffisante.\n" +
          "3. Aucun secret dans le code — uniquement variables d'environnement.\n" +
          "4. Messages d'erreur en langage humain côté utilisateur.\n" +
          "   Erreurs techniques dans Sentry.\n" +
          "5. Composants strictement conformes aux tokens du design system.\n" +
          "   Pas de valeurs hardcodées hors du système.\n" +
          "6. Chaque décision de copywriting respecte la voix et le vocabulaire\n" +
          "   du brand system. Pas de formule générique.\n" +
          "7. [PRINCIPES SPÉCIFIQUES AU PROJET]\n" +
          "\n" +
          "## Architecture\n" +
          "Pages et objectifs :\n" +
          "   / → [Objectif]\n" +
          "   /[route] → [Objectif]\n" +
          "\n" +
          "Routes API et leur rôle :\n" +
          "   /api/[route] → [Ce qu'elle fait]\n" +
          "\n" +
          "Composants principaux :\n" +
          "   [Liste]\n" +
          "\n" +
          "## Ce que tu ne fais jamais\n" +
          "- Générer un composant data sans ses quatre états\n" +
          "- Utiliser des placeholders génériques non liés au secteur\n" +
          "- Laisser une clé API ou un secret dans le code\n" +
          "- Proposer une architecture qui ne peut pas migrer hors Supabase\n" +
          "- Créer une route API sans vérification d'authentification\n" +
          "- [INTERDITS SPÉCIFIQUES AU PROJET]\n" +
          "```\n\n" +
          "---\n\n" +
          "Template 7 — CHECKLIST-LANCEMENT.md\n\n" +
          "Où l'utiliser : Document de travail — dans Notion pour ton usage, ou dans un projet Claude pour demander à l'IA d'auditer ton code contre cette checklist. Commande utile : \"Audite le projet contre cette checklist. Identifie chaque point non couvert avec le niveau de criticité.\"\n\n" +
          "Expertise à déclarer pour l'audit IA : Ingénieur sécurité senior + expert qualité produit SaaS.\n\n" +
          "```\n" +
          "# Checklist de Lancement — [NOM DU PROJET]\n" +
          "Date cible : [DATE] | Type : [Site / App / SaaS]\n" +
          "\n" +
          "## Rôle de l'IA pour cet audit\n" +
          "Tu es un ingénieur sécurité senior et expert qualité produit SaaS.\n" +
          "Tu audites ce projet avant sa mise en production.\n" +
          "\n" +
          "Ton cadre : tu n'es pas là pour valider — tu es là pour trouver\n" +
          "ce qui pourrait casser, exposer des données, ou dégrader\n" +
          "l'expérience utilisateur. Chaque point non coché est un risque\n" +
          "que tu dois documenter avec son niveau de criticité et la\n" +
          "correction attendue.\n" +
          "\n" +
          "---\n" +
          "## CRITIQUE — Bloque le lancement\n" +
          "\n" +
          "SÉCURITÉ : Vérifie tout en ta qualité d'ingénieur sécurité senior,\n" +
          "Penses aux fuites de données bancaires, cyberattaque, couvre toute la\n" +
          "sécurité de A à Z, cette liste n'est pas exhaustive :\n" +
          "- [ ] HTTPS actif et forcé\n" +
          "      Vérifier : accéder en http:// — doit rediriger vers https://\n" +
          "- [ ] Aucun secret dans le code ou le repo\n" +
          "      Vérifier : grep -r \"API_KEY\\|SECRET\\|PASSWORD\" --include=\"*.ts\"\n" +
          "- [ ] Variables d'environnement configurées sur Vercel prod\n" +
          "- [ ] Headers sécurité dans next.config.js\n" +
          "      (X-Frame-Options, X-Content-Type-Options, Referrer-Policy)\n" +
          "- [ ] Validation Zod côté serveur sur toutes les routes API\n" +
          "      Vérifier : tester en POST avec données invalides directement\n" +
          "      sur l'URL de la route, sans passer par l'interface\n" +
          "\n" +
          "POUR LES APPS ET SAAS EN PLUS\n" +
          "- [ ] RLS activée sur toutes les tables Supabase\n" +
          "      Vérifier : Dashboard Supabase > chaque table > RLS enabled\n" +
          "- [ ] Test d'isolation : deux comptes, l'un ne voit pas les données\n" +
          "      de l'autre même en manipulant les IDs dans les requêtes\n" +
          "- [ ] SERVICE_ROLE_KEY uniquement dans les fichiers serveur\n" +
          "- [ ] Reset mot de passe testé de bout en bout\n" +
          "\n" +
          "LÉGAL\n" +
          "- [ ] Politique de confidentialité accessible depuis le footer\n" +
          "- [ ] Mentions légales complètes\n" +
          "- [ ] Bandeau cookies si analytics actif\n" +
          "\n" +
          "---\n" +
          "## ÉLEVÉ — À résoudre dans les 48h\n" +
          "\n" +
          "PERFORMANCE\n" +
          "- [ ] PageSpeed > 90 desktop, > 75 mobile (pagespeed.web.dev)\n" +
          "- [ ] Images WebP avec lazy loading\n" +
          "- [ ] Sentry configuré — déclencher une erreur test pour valider\n" +
          "- [ ] npm audit : zéro vulnérabilité critique\n" +
          "\n" +
          "QUALITÉ PRODUIT\n" +
          "- [ ] Quatre états couverts sur chaque composant data\n" +
          "      (loading / vide / erreur / chargé)\n" +
          "- [ ] Messages d'erreur en français, langage humain, testés\n" +
          "- [ ] Parcours complet testé sur un vrai mobile\n" +
          "- [ ] Test sur 375px, 768px, 1440px\n" +
          "\n" +
          "SEO/GEO\n" +
          "- [ ] Métadonnées uniques sur chaque page\n" +
          "- [ ] Sitemap.xml accessible sur /sitemap.xml\n" +
          "- [ ] llms.txt à la racine\n" +
          "\n" +
          "---\n" +
          "## MODÉRÉ — Dans les 30 jours\n" +
          "\n" +
          "- [ ] Monitoring uptime configuré (UptimeRobot)\n" +
          "- [ ] Backups automatiques vérifiés\n" +
          "- [ ] Schema.org implémenté\n" +
          "- [ ] 404 et pages d'erreur customisées\n" +
          "- [ ] Dependabot activé sur GitHub\n" +
          "\n" +
          "---\n" +
          "## Validation finale\n" +
          "Audité par : [NOM] | Date : [DATE]\n" +
          "Tous les points critiques et élevés cochés : Oui / Non\n" +
          "```",
      },
    ],
    videos: [],
  },
  {
    id: "5",
    titre: "Bloc 5 : La logique business",
    sections: [
      {
        id: "b5-s1",
        title: "L'orientation client",
        content:
          "C'est le point que la plupart des gens dans le business IA ratent complètement. Ils construisent ce qu'ils trouvent cool, ce qui impressionne leurs pairs, ce qui leur permet de montrer une démo sympa sur LinkedIn. Et leur client s'en fout.\n\n" +
          "La vérité : mon client ne paie pas pour ma technique. Il paie pour résoudre un problème qui lui coûte du temps, de l'argent, ou de la crédibilité. Mon job, c'est de comprendre ce problème mieux qu'il ne le comprend lui-même, et d'y répondre exactement. Pas d'y répondre avec la solution que j'avais envie de construire.\n\n" +
          "L'ego dans ce business se manifeste de quatre façons : choisir la stack la plus complexe parce qu'elle m'intéresse, pas parce qu'elle est la plus adaptée au problème. Ajouter des fonctionnalités que le client n'a pas demandées parce que je trouve ça élégant. Livrer un design qui m'impressionne moi, pas un design qui convertit pour lui. Défendre mes choix en réunion au lieu d'écouter ce que le client me dit sur ses utilisateurs réels.\n\n" +
          "Chaque fois que je fais ça, je travaille pour moi et je facture le client pour ça. C'est une erreur qui se paie tôt ou tard : soit il ne recommande pas, soit il ne renouvelle pas, soit il demande des corrections que je n'avais pas anticipées parce que je n'avais pas écouté.\n\n" +
          "Avant de toucher un outil, je passe du temps à comprendre trois choses : son problème exact formulé dans ses mots à lui. Le contexte dans lequel ce problème se présente, quand, pour qui, avec quelles conséquences. Et ce qu'il considère comme un succès, pas ce que moi je considère comme un bon livrable.\n\n" +
          "Les questions ouvertes qui valent dix fois plus que toute la veille technique : \"Montre-moi comment tu travailles aujourd'hui.\" \"Qu'est-ce qui t'a fait perdre le plus de temps la semaine dernière ?\" \"Si dans six mois ce projet est un succès, qu'est-ce qui s'est passé ?\" Je pose ces questions, j'écoute vraiment, et je construis la réponse à ce que j'entends.\n\n" +
          "La règle qui résume tout : construire ce que le client doit avoir pour résoudre son problème. Pas ce que j'aurais envie de construire si c'était mon produit.",
      },
      {
        id: "b5-s2",
        title: "La vente d'abord, toujours",
        content:
          "La vente, c'est le sang du business. Pas de clients, pas de business. Avant le code, avant les outils, avant les automatisations, il y a quelqu'un qui dit oui et qui paie. Tout commence et finit là.\n\n" +
          "Dans ma pratique, j'aborde la vente avec une logique simple : une niche précise, une compréhension profonde du problème, un positionnement clair, et du volume. Je ne vends pas à tout le monde. Je choisis un secteur, je comprends ses problèmes mieux que ses acteurs eux-mêmes, et je me positionne comme la seule solution logique pour ce secteur.\n\n" +
          "L'outreach, c'est la pratique concrète. Cold call, cold email, messages directs sur LinkedIn ou Instagram selon la niche. Le principe est toujours le même : on contacte en volume, on observe ce qui répond, on ajuste le message, on recommence. Un refus n'est pas un échec. C'est une donnée. Chaque \"non\" ou \"pas intéressé\" me dit quelque chose sur mon message, mon ciblage ou mon timing. Je collecte, j'analyse, j'itère.\n\n" +
          "Un exemple concret : quand je prospecte des restaurateurs pour un système de réservation en ligne, les premiers messages parlent de \"solution digitale innovante\". Personne ne répond. Je change de message, je parle de \"tables vides le vendredi soir\". Les réponses arrivent. C'est ça la vente par itération : on ne cherche pas le message parfait du premier coup, on le trouve en terrain réel.\n\n" +
          "La vente s'améliore comme le code : par itérations successives. La question à se poser avant chaque campagne d'outreach : quel est le problème exact que cette personne a aujourd'hui, formulé dans ses mots à elle ? Si tu ne peux pas y répondre, tu n'es pas encore prêt à prospecter.",
      },
      {
        id: "b5-s3",
        title: "Le feedback terrain comme moteur",
        content:
          "Je reviens systématiquement vers le terrain. En vente, chaque échange me donne des données. En delivery, chaque mise en production me donne des données. Le point commun : je ne suppose pas, je mesure.\n\n" +
          "Pour les produits et les SaaS, PostHog est mon outil de base. Il me montre comment les vrais utilisateurs se comportent, pas comment je pensais qu'ils allaient se comporter. Les session recordings montrent exactement où les gens s'arrêtent, où ils abandonnent, où ils cliquent là où je ne l'avais pas prévu. Un utilisateur qui abandonne à l'étape 3 de l'onboarding ne m'envoie pas un email pour m'expliquer pourquoi. PostHog me le montre.\n\n" +
          "Le principe que j'applique : shipper vite, mesurer, ajuster. Un produit imparfait en production qui reçoit du feedback vaut cent fois plus qu'un produit parfait en développement qui n'a jamais été vu par un vrai utilisateur. Amazon, Apple, tous les grands produits qu'on utilise aujourd'hui étaient imparfaits au lancement. Ce qui les a rendus bons, c'est la vitesse d'itération après le lancement, pas la perfection avant.\n\n" +
          "Concrètement : je définis 2 ou 3 métriques clés avant chaque mise en ligne (taux d'activation, taux de complétion de l'onboarding, taux de conversion sur la page de pricing). Je les surveille la première semaine. Je cherche les anomalies. Quand quelque chose ne se passe pas comme prévu, je creuse. Je regarde les sessions. Je parle à un ou deux utilisateurs. Je corrige. Je remesure.\n\n" +
          "Ce que je pensais être bon ne l'est pas toujours. Ce que je pensais être un problème n'en est parfois pas un. Les données tranchent.",
      },
      {
        id: "b5-s4",
        title: "Les erreurs graves à éviter vs les erreurs normales",
        content:
          "Il y a des erreurs qu'on peut accepter dans un produit en construction, et des erreurs qu'on ne peut pas se permettre. Savoir distinguer les deux, c'est ce qui sépare un développeur qui avance de celui qui reste bloqué par la peur de mal faire.\n\n" +
          "Les erreurs acceptables : une interface pas encore parfaite, un onboarding qui manque d'une étape, une feature absente qui sera ajoutée plus tard, un design mobile perfectible, un message d'erreur générique. Ces erreurs-là, un vrai utilisateur peut les vivre. Il peut revenir malgré elles. Elles n'endommagent pas ses données, ne compromettent pas son compte, ne coûtent rien à l'entreprise.\n\n" +
          "Les erreurs inacceptables : elles forment une ligne rouge à ne jamais franchir. Une clé API dans le code front (n'importe qui peut l'inspecter et l'utiliser). Pas de validation des inputs utilisateur (injection SQL, scripts malveillants). Pas de rate limiting sur les routes publiques (un bot peut spammer ou abuser ton API). La clé service_role Supabase utilisée côté client (elle bypass toutes les politiques de sécurité, c'est une porte d'entrée ouverte sur toute ta base de données). Pas d'authentification sur des routes qui modifient des données.\n\n" +
          "La règle que j'applique : avant chaque mise en ligne, je passe le skill-security. Si un point CRITIQUE remonte, le produit ne sort pas. Peu importe la deadline, peu importe la pression client. Les failles de sécurité en production coûtent dix fois plus cher à corriger qu'un retard de livraison.\n\n" +
          "Exemple pratique : j'ai récemment audité un projet où la route de paiement Stripe n'était pas protégée par une vérification côté serveur. N'importe qui pouvait appeler la route directement et déclencher un accès premium sans payer. C'est une erreur CRITIQUE. L'interface était belle, le produit fonctionnait bien en apparence, mais cette faille suffisait à le rendre non livrable.",
      },
    ],
    videos: [],
  },
  {
    id: "6",
    titre: "Bloc 6 : Construire pour de vrai",
    sections: [
      {
        id: "b6-s1",
        title: "Ce qu'est ORACLE",
        content:
          "ORACLE est mon framework de construction de A à Z. Pas un outil, pas un prompt. Un process structuré en couches qui fonctionne sur chaque projet, du site artisan au SaaS multi-tenant.\n\n" +
          "La logique de base : chaque couche produit quelque chose de concret qui alimente la couche suivante. On ne saute pas une couche. On ne revient pas en arrière.\n\n" +
          "Couche 1, l'interview de démarrage : le skill ORACLE conduit lui-même l'interview. Il pose des questions, écoute, reformule, confirme. Tu n'as pas besoin de préparer un brief parfait. Tu décris ton projet comme tu l'as dans la tête, ORACLE structure. Si tu dis \"je veux une app pour les restaurateurs\", il te demande pour quel type de restaurateurs, dans quelle ville, quel problème précis, qui utilise l'app. Il ne laisse pas passer les zones floues.\n\n" +
          "Couche 2, les documents fondateurs : dans l'ordre strict. BRIEF (qui, quoi, pourquoi, pour qui, avec quelles contraintes). BRAND-SYSTEM (l'âme du produit avant son apparence, délégué au sous-skill ux-ui-design). DESIGN-SYSTEM (les règles visuelles en tokens réutilisables, délégué à ux-ui-design). PRD (ce que le produit fait, priorisé P1/P2/P3, avec critères d'acceptation binaires). PARCOURS-UTILISATEURS (chaque action, chaque état, chaque émotion). PROMPT-SYSTEM (la synthèse de tout, le cerveau qui va dans l'IDE). Pour un SaaS ou une app, un document supplémentaire : le DATA-MODEL, qui définit le schéma de base de données, les politiques RLS, les triggers et les migrations.\n\n" +
          "Couche 3, les décisions structurantes : architecture technique, intégrations, décisions sécurité, décisions business. On prend les décisions difficiles avant d'ouvrir l'IDE. Ce qui prend 20 minutes en conversation ici prend des semaines à corriger dans le code.\n\n" +
          "Couche 4, l'exécution dans l'IDE : Claude Code charge le PROMPT-SYSTEM depuis /docs et construit dans l'ordre du PRD, P1 d'abord entièrement avant de regarder P2. La première instruction de chaque session est toujours la même : \"Charge et lis /docs/PROMPT-SYSTEM.md. Confirme que tu as tout compris avant de commencer.\"\n\n" +
          "Couche 5, les audits : qualité, sécurité, architecture. Dans cet ordre. Un point CRITIQUE dans l'un des trois audits bloque la livraison. Toujours.\n\n" +
          "L'ordre n'est pas arbitraire. C'est la même logique qu'une maison : on ne peint pas avant que le béton soit sec.",
      },
      {
        id: "b6-s2",
        title: "Les sous-skills qui composent ORACLE",
        content:
          "ORACLE n'essaie pas de tout faire seul. Il orchestre. Les sous-skills exécutent dans leur domaine. C'est cette séparation qui garantit la qualité à chaque couche.\n\n" +
          "ux-ui-design : tout ce qui est visuel. Identité de marque, palette de couleurs, typographie, système de composants, maquettes. Ce skill a son propre ADN visuel : Apple-level premium, dark, liquid glass quand c'est justifié. Il reçoit le BRIEF et produit le BRAND-SYSTEM et le DESIGN-SYSTEM. Il génère aussi les prompts visuels pour Stitch ou AI Studio. Tu ne lui demandes pas \"fais quelque chose de beau\". Tu lui fournis le contexte du projet et il définit l'identité visuelle avec précision.\n\n" +
          "expert-backend : architecture, sécurité, patterns de code. Appelé pour les décisions techniques lourdes : schéma de base de données, choix de l'architecture d'auth, stratégie de rate limiting, RLS Supabase. Ce skill connaît les erreurs qui coûtent cher. Il ne laisse pas passer une clé API dans le front ou une route non protégée.\n\n" +
          "Comment ça s'utilise concrètement : quand je lance ORACLE sur un nouveau projet, il conduit l'interview. Dès qu'il faut définir le BRAND-SYSTEM, il passe la main à ux-ui-design avec le contexte complet. Quand une décision d'architecture se pose, il consulte expert-backend. Il récupère les livrables, les intègre dans le flux, et continue. Je ne réexplique jamais le projet d'un skill à l'autre, ORACLE transmet le contexte.\n\n" +
          "Les librairies de composants à connaître : 21st.dev pour les composants React premium, shadcn/ui pour la base fondamentale, accessible et entièrement customisable, Aceternity UI pour les effets dark premium à utiliser chirurgicalement, Magic UI pour les animations de CTA et éléments de célébration. Ces librairies s'explorent en Couche 3, quand les maquettes sont devant toi, pas pendant le code.\n\n" +
          "Le principe derrière tout ça : je construis une fois, je réutilise partout. Chaque nouveau projet bénéficie de tout ce que j'ai encodé dans ces skills. Je ne repars pas de zéro. Je capitalise.",
      },
      {
        id: "b6-s3",
        title: "Les deux skills ORACLE",
        content:
          "Un skill, c'est plus qu'un prompt. C'est un package de compétence complet : le contexte, les règles critiques, l'identité de l'expert, les instructions dans l'ordre. Quand je charge un skill dans Claude Code ou dans un projet Claude, je n'explique plus le projet depuis zéro. Le skill sait déjà.\n\nJ'ai construit oracle-site-web et oracle-saas parce que je construisais les mêmes types de projets en boucle. À chaque nouveau site, je réexpliquais les mêmes principes. À chaque nouveau SaaS, je redéfinissais les mêmes règles de sécurité. Au bout d'un moment, j'ai encodé tout ça. La première version était basique. Avec chaque projet, le skill s'est enrichi.\n\nSur la sécurité spécifiquement : je n'avais pas toutes ces connaissances au départ. J'ai dû me confronter aux erreurs, lire la doc OWASP, comprendre ce que signifie RLS sur Supabase, ce que ça veut dire qu'une route n'est pas protégée. Ce qui a vraiment accéléré ma compréhension, c'est NotebookLM. Je prenais les meilleures ressources techniques que je trouvais (tutos backend senior, doc officielle, articles OWASP) et je les chargeais dans un notebook. Ensuite je questionnais en profondeur sur mes cas précis. Ce n'est plus juste lire une doc, c'est apprendre avec un expert qui a lu toute la doc pour toi. C'est un cheat code pour monter en compétence vite.\n\nLa logique de délégation dans ces skills : ORACLE orchestre, mais il ne fait pas tout. Tout ce qui est visuel (BRAND-SYSTEM, DESIGN-SYSTEM, maquettes) est délégué au skill ux-ui-design. Toute décision technique lourde (architecture BDD, RLS, patterns sécurité) est déléguée au skill expert-backend. ORACLE reçoit leurs livrables, les intègre, et continue. On ne réinvente pas la roue à chaque projet.\n\nLes skills ci-dessous sont les versions actuelles. Ils continueront d'évoluer. Un skill est vivant : il s'améliore avec l'usage, avec les projets, avec ce qu'on apprend. Ce que tu copies aujourd'hui n'est pas la version finale. C'est le point de départ.",
        skillContent: [
          {
            title: "oracle-site-web — Copier le skill complet",
            raw: ORACLE_SITEWEB_RAW,
          },
          {
            title: "oracle-saas — Copier le skill complet",
            raw: ORACLE_SAAS_RAW,
          },
        ],
      },
    ],
    videos: [],
  },
  {
    id: "7",
    titre: "Bloc 7 : Récapitulatif",
    sections: [
      {
        id: "b7-s1",
        title: "Tout processiser",
        content:
          "Je documente tout ce que je fais plus de deux fois. C'est une règle simple qui a changé ma façon de travailler.\n\n" +
          "Une SOP (Standard Operating Procedure), c'est un document court qui décrit comment faire une action précise. Le contexte (pourquoi on fait ça et dans quelle situation), les étapes dans l'ordre (numérotées, sans ambiguïté), les pièges à éviter (ce qui peut mal tourner et comment le prévenir), et le résultat attendu (à quoi ressemble un travail bien fait).\n\n" +
          "Exemple concret : à chaque fois que je déploie un nouveau projet sur Vercel, je fais les mêmes vérifications. Variables d'environnement, domaine connecté, Sentry activé, Google Search Console configurée. J'ai documenté ça en une SOP de 12 étapes. Elle prend 15 minutes à suivre. Elle m'évite d'oublier un point critique et d'avoir à y revenir en urgence le lendemain.\n\n" +
          "Le test pour savoir si une SOP est utile : est-ce que quelqu'un d'autre pourrait suivre ces instructions et obtenir le même résultat sans me demander quoi que ce soit ? Si oui, la SOP est bonne. Si non, elle a besoin de plus de précision.\n\n" +
          "Quand je délègue une tâche à un collaborateur ou à un skill IA, la SOP devient l'instruction. Je n'explique plus, je fournis le document. C'est ça la scalabilité réelle : pas les outils, la documentation.",
      },
      {
        id: "b7-s2",
        title: "L'audit avant l'automatisation",
        content:
          "Avant d'implémenter l'IA ou une automatisation chez un client, je cartographie d'abord. Quels sont les flux actuels, tels qu'ils existent vraiment, pas tels qu'ils sont supposés exister ? Où est la friction réelle ? Quel est le vrai problème derrière le problème qu'on me décrit ?\n\n" +
          "L'outil vient après la compréhension. Jamais avant. Une automatisation mal posée sur un mauvais process ne fait qu'accélérer les erreurs. Si le process de facturation est chaotique, automatiser la facturation ne règle pas le chaos, il le produit plus vite.\n\n" +
          "Ma méthode concrète avant tout projet d'automatisation : je passe une heure à interviewer le client sur comment il travaille aujourd'hui. Je ne lui demande pas ce qu'il veut, je lui demande de me montrer ce qu'il fait. \"Montre-moi comment tu traites une commande client de A à Z.\" La réponse à cette question contient toujours les vrais problèmes, ceux qu'il n'aurait pas pensé à mentionner.\n\n" +
          "Ensuite je cartographie. Je note chaque étape, chaque outil, chaque transfert de données. Je cherche les goulots d'étranglement (une personne qui fait tout à la main), les redondances (la même information saisie dans deux outils), et les risques (des données client stockées dans un tableur non protégé).\n\n" +
          "C'est seulement après cet audit que je propose un outil. Make, n8n, Supabase, une intégration API. L'outil répond à un problème identifié, pas à une envie de moderniser.",
      },
      {
        id: "b7-s3",
        title: "Les skills comme infrastructure de connaissance",
        content:
          "Chaque fois que je repère un process répétitif dans mes projets, je l'encode dans un skill. Le skill devient un collaborateur permanent qui connaît mes règles, mes standards, mes préférences. Je n'explique plus deux fois la même chose.\n\n" +
          "Un skill, c'est un package de compétence. Il contient le contexte (qui il est, pour quoi il existe, dans quel cadre il intervient), les règles critiques (ce qu'il ne fait jamais, ce qu'il vérifie toujours), et les instructions (comment il travaille, dans quel ordre, avec quels livrables).\n\n" +
          "On crée un skill dès qu'on repère un pattern répétitif. Pas besoin de grand chose : un fichier SKILL.md avec un frontmatter YAML valide, les règles critiques en haut, et les instructions. Si j'audite la sécurité de chaque projet que je livre, j'encode cet audit dans skill-security.md. La prochaine fois, Claude Code charge le skill et applique les mêmes critères avec la même rigueur.\n\n" +
          "L'avantage compétitif réel dans le business IA, ce ne sont pas les outils. Les outils changent tous les six mois. Ce sont les systèmes. Un système de skills bien encodé, c'est une connaissance capitalisée qui s'améliore avec chaque projet. La première version du skill-security était basique. Après cinq projets, il couvre des cas d'usage que je n'avais pas anticipés au départ.\n\n" +
          "Question pratique : quelles sont les trois actions que tu répètes sur chaque projet ? Si tu peux les lister, tu peux les encoder. C'est ton point de départ.",
      },
      {
        id: "b7-s4",
        title: "Itérer en continu",
        content:
          "Les systèmes ne sont jamais finis. Un skill s'améliore avec l'usage. Une SOP évolue avec la pratique. Un produit change avec les retours clients. Ce qui compte, c'est d'avoir une cadence d'itération.\n\n" +
          "Dans ma pratique, je fais un bilan rapide chaque semaine. Qu'est-ce qui a frotté dans les projets de la semaine ? Quelle étape a pris plus de temps que prévu ? Quelle erreur j'ai faite que j'avais déjà faite avant ? Quelle décision j'ai dû prendre en urgence parce qu'elle n'était pas documentée ?\n\n" +
          "Chaque réponse à ces questions devient une action : mettre à jour une SOP, enrichir un skill, corriger un document de référence. Ça prend 20 minutes. Sur un an, ça représente des dizaines d'itérations sur des dizaines de documents. Le résultat : un système qui devient meilleur tout seul, par accumulation.\n\n" +
          "La distinction que j'essaie de garder en tête : un système vivant versus une documentation morte. La documentation morte, c'est ce qu'on écrit une fois, qu'on ne relit jamais, et qui devient faux en six mois. Un système vivant, c'est ce qu'on consulte réellement, qu'on corrige quand c'est faux, et qu'on enrichit quand c'est incomplet.\n\n" +
          "Ce qui sépare les deux : la cadence d'itération. Pas la qualité initiale du document. Un document parfait au premier jet mais jamais mis à jour est mort au bout de trois mois. Un document imparfait mais revu chaque semaine devient précieux.\n\n" +
          "---\n\n" +
          "RÉCAP : Ce que tu sais maintenant faire\n\n" +
          "Blocs 1 à 4 t'ont donné la stack et l'environnement de travail. Les outils, les librairies, la logique de construction. Ce sont les fondations techniques.\n\n" +
          "Bloc 5 t'a montré que le business commence par la vente, que le client prime sur l'ego technique, que le feedback terrain est non-négociable, et qu'il existe une ligne rouge entre les erreurs acceptables et celles qui bloquent la livraison.\n\n" +
          "Bloc 6 t'a présenté ORACLE : le framework de construction de A à Z. L'interview interne, les documents fondateurs, les sous-skills qui exécutent dans leur domaine (ux-ui-design pour le visuel, expert-backend pour l'architecture et la sécurité), et trois projets réels qui montrent le process appliqué sur un site artisan, une marque mode et un SaaS.\n\n" +
          "Bloc 7 t'a donné les outils pour tenir dans la durée. Processiser ce qu'on fait plus de deux fois. Auditer avant d'automatiser. Encoder les process répétitifs dans des skills. Itérer chaque semaine plutôt que construire une documentation parfaite une seule fois.\n\n" +
          "Ce que tout ça forme ensemble : un système de travail complet. De la vente au delivery, de l'idée au produit en production, de la première version à l'itération continue. Tu n'as pas besoin de tout maîtriser avant de commencer. Tu as besoin de commencer pour commencer à maîtriser.\n\n" +
          "La question maintenant : quel est ton prochain projet ? Lance ORACLE. Décris-le. Commence.",
      },
    ],
    videos: [],
  },
];
