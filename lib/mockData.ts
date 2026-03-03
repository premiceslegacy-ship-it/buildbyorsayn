export const BLOCS_DATA = [
  {
    id: "1",
    titre: "Bloc 1 : La logique du système",
    sections: [
      {
        id: "b1-s1",
        title: "Ce que l'IA a vraiment changé",
        content: "La génération de code est devenue une commodité. Il y a encore quelques années, la barrière à l'entrée pour construire un produit logiciel résidait dans la syntaxe, la configuration des serveurs et la résolution de bugs obscurs. Aujourd'hui, les modèles d'intelligence artificielle écrivent des algorithmes complexes en quelques secondes. Mais cette abondance a créé une nouvelle rareté : la clarté architecturale.\n\nSi tout le monde peut générer du code, la différence se fait désormais sur la capacité à orchestrer ce code. L'ingénieur moderne n'est plus un simple traducteur de logique métier en syntaxe informatique ; il est un architecte système. Il doit comprendre comment les données circulent, comment les composants interagissent, et surtout, comment le produit final résout un problème réel pour l'utilisateur. L'IA accélère l'exécution, mais elle ne remplace pas la vision.\n\nL'avantage concurrentiel ne réside plus dans le nombre de lignes de code produites, mais dans la pertinence des problèmes résolus. Un code parfait qui ne répond à aucun besoin du marché est inutile. À l'inverse, un MVP (Minimum Viable Product) imparfait mais parfaitement ciblé peut générer de la traction. L'IA nous permet d'atteindre ce MVP plus rapidement, mais elle ne nous dispense pas de la phase de découverte client."
      },
      {
        id: "b1-s2",
        title: "Les modèles de business viables",
        content: "Dans un écosystème saturé d'outils génériques, la spécialisation est votre seule protection. Les modèles de type \"Micro-SaaS\" hyper-nichés démontrent une résilience exceptionnelle. Plutôt que de construire un outil qui fait tout pour tout le monde, l'objectif est de résoudre un problème extrêmement douloureux pour un groupe très restreint d'utilisateurs.\n\nLa viabilité ne se mesure plus à la capacité d'acquisition, mais à la rétention. Un produit qui s'intègre profondément dans le flux de travail quotidien d'une entreprise devient indispensable. Cela implique de privilégier les intégrations B2B, les flux automatisés et la sécurité des données dès le premier jour. Le code doit être au service d'un modèle économique clair : abonnement récurrent, tarification à l'usage, ou licence d'entreprise.\n\nÉvitez le piège du \"B2C gratuit avec espoir de monétisation future\". Sauf si vous disposez d'un financement massif, ce modèle est un gouffre financier. Concentrez-vous sur des entreprises prêtes à payer pour gagner du temps ou augmenter leurs revenus. Si votre outil leur fait économiser 10 heures par semaine, facturer 50€ par mois est une évidence."
      },
      {
        id: "b1-s3",
        title: "Le framework de positionnement",
        content: "Un bon produit mal positionné échouera toujours face à un produit moyen parfaitement positionné. Le framework que nous utilisons repose sur trois piliers : l'identification de la douleur (Pain), la promesse de valeur (Value Proposition), et le mécanisme de livraison (Delivery).\n\nNe construisez pas une \"vitamine\" (un confort optionnel), construisez un \"antidouleur\" (une nécessité absolue). Votre positionnement doit être si précis que votre client idéal se dise : \"Cet outil a été créé exactement pour moi\". Cela dicte non seulement votre marketing, mais aussi les fonctionnalités que vous choisissez de développer en priorité, et surtout, celles que vous décidez d'ignorer.\n\nLa clarté de votre message est aussi importante que la qualité de votre code. Si vous ne pouvez pas expliquer ce que fait votre produit en une phrase simple, c'est qu'il est trop complexe. \"Nous aidons les [Cible] à obtenir [Résultat] grâce à [Mécanisme]\" est un bon point de départ. Remplissez les blancs avec précision."
      },
      {
        id: "b1-s4",
        title: "La formule qui tient",
        content: "La formule du succès dans l'écosystème actuel se résume à une équation simple : Distribution + Rétention = Croissance. Vous pouvez avoir le meilleur produit du monde, si personne ne le connaît, il n'existe pas. La distribution doit être pensée dès le premier jour, en parallèle du développement.\n\nLa rétention, quant à elle, dépend de l'expérience utilisateur (UX) et de la fiabilité de votre système. C'est ici que l'architecture technique entre en jeu. Un système instable, lent ou difficile à utiliser fera fuir vos utilisateurs plus vite que vous ne pourrez les acquérir. Investissez dans la performance, la sécurité et un design intuitif.\n\nEnfin, n'oubliez pas que la simplicité est la sophistication suprême. Ne surchargez pas votre produit de fonctionnalités inutiles. Concentrez-vous sur le cœur de valeur et exécutez-le à la perfection. C'est cette rigueur qui fera la différence entre un projet abandonné et un business florissant."
      }
    ]
  },
  {
    id: "2",
    titre: "Bloc 2 : La stack",
    sections: [
      {
        id: "b2-s1",
        title: "Le choix du framework",
        content: "Next.js s'est imposé comme le standard de l'industrie pour les applications React. Son architecture App Router permet un rendu hybride (serveur et client) qui optimise à la fois les performances SEO et l'interactivité. En centralisant le routing et les API, il réduit drastiquement la complexité opérationnelle."
      },
      {
        id: "b2-s2",
        title: "La base de données et l'Auth",
        content: "Supabase offre une alternative open-source robuste à Firebase, construite sur PostgreSQL. L'avantage majeur réside dans la puissance du SQL combinée à des API REST/Realtime générées automatiquement. L'authentification intégrée et le Row Level Security (RLS) garantissent une sécurité de niveau entreprise dès le premier jour."
      },
      {
        id: "b2-s3",
        title: "Le styling et l'UI",
        content: "Tailwind CSS couplé à shadcn/ui représente l'état de l'art du développement front-end. Au lieu de surcharger l'application avec des bibliothèques de composants lourdes, cette approche permet de copier-coller des composants accessibles et de les styliser via des classes utilitaires, offrant un contrôle total sur le design system."
      }
    ]
  },
  {
    id: "3",
    titre: "Bloc 3 : Les frameworks",
    sections: [
      {
        id: "b3-s1",
        title: "Architecture de l'information",
        content: "Une bonne architecture sépare clairement la logique métier de l'interface utilisateur. Le pattern Repository permet d'isoler les appels à la base de données, rendant le code plus testable et facilitant d'éventuelles migrations futures."
      },
      {
        id: "b3-s2",
        title: "Gestion d'état",
        content: "L'état global doit être utilisé avec parcimonie. Privilégiez l'état local pour les composants isolés et les contextes React pour les données partagées (comme l'utilisateur ou le thème). Les bibliothèques comme Zustand offrent une alternative légère et performante à Redux."
      },
      {
        id: "b3-s3",
        title: "Sécurité et validation",
        content: "Ne faites jamais confiance aux données du client. Utilisez Zod pour valider les schémas de données côté client et côté serveur. Implémentez des middlewares pour protéger les routes sensibles et vérifiez systématiquement les permissions avant chaque action mutative."
      }
    ]
  },
  {
    id: "4",
    titre: "Bloc 4 : Les templates",
    sections: [
      {
        id: "b4-s1",
        title: "Le template d'authentification",
        content: "Un flux d'authentification complet comprend l'inscription, la connexion, la réinitialisation de mot de passe et la gestion des sessions. L'utilisation de Magic Links ou de l'authentification sociale (OAuth) réduit les frictions à l'entrée."
      },
      {
        id: "b4-s2",
        title: "Le dashboard utilisateur",
        content: "Le dashboard est le centre de contrôle de l'utilisateur. Il doit présenter les métriques clés de manière claire et offrir un accès rapide aux actions principales. L'utilisation de Skeletons pendant le chargement améliore la perception des performances."
      },
      {
        id: "b4-s3",
        title: "Le module de facturation",
        content: "L'intégration de Stripe nécessite une gestion rigoureuse des webhooks pour synchroniser l'état des abonnements avec votre base de données. Prévoyez des flux clairs pour l'upgrade, le downgrade et l'annulation, en respectant les normes SCA (Strong Customer Authentication)."
      }
    ]
  },
  {
    id: "5",
    titre: "Bloc 5 : La logique business",
    sections: [
      {
        id: "b5-s1",
        title: "Acquisition et Onboarding",
        content: "L'acquisition coûte cher, l'onboarding détermine si cet investissement est rentable. Un utilisateur doit percevoir la valeur de votre produit (le 'Aha! moment') dans les 5 premières minutes. Simplifiez les premières étapes et guidez l'utilisateur vers le succès."
      },
      {
        id: "b5-s2",
        title: "Rétention et Engagement",
        content: "La rétention est le véritable moteur de la croissance. Mettez en place des boucles d'engagement (notifications pertinentes, rapports hebdomadaires) pour ramener l'utilisateur dans l'application. Mesurez le DAU/MAU (Daily/Monthly Active Users) pour évaluer la santé de votre produit."
      },
      {
        id: "b5-s3",
        title: "Monétisation et Pricing",
        content: "Le pricing est un exercice de positionnement. Ne sous-évaluez pas votre produit. Proposez des plans basés sur la valeur perçue (Value-Based Pricing) plutôt que sur les coûts. Expérimentez avec les limites (features, usage) pour encourager l'upsell naturel."
      }
    ]
  },
  {
    id: "6",
    titre: "Bloc 6 : Oracle",
    sections: [
      {
        id: "b6-s1",
        title: "La vision prédictive",
        content: "L'Oracle ne se contente pas de réagir, il anticipe. Dans un monde technologique en accélération constante, la capacité à prévoir les points d'inflexion du marché devient l'avantage ultime. Il s'agit de lire les signaux faibles avant qu'ils ne deviennent des tendances dominantes."
      },
      {
        id: "b6-s2",
        title: "L'intelligence augmentée",
        content: "Au-delà de l'automatisation, l'Oracle vise la symbiose. L'IA n'est plus un outil, mais un partenaire cognitif qui étend vos capacités de raisonnement. C'est le passage du 'faire faire' au 'penser avec', démultipliant la créativité et la résolution de problèmes complexes."
      },
      {
        id: "b6-s3",
        title: "La résilience systémique",
        content: "Un système Oracle est antifragile. Il se nourrit du chaos et de l'incertitude pour se renforcer. En intégrant des boucles de rétroaction rapides et une architecture évolutive, votre produit ne survit pas seulement aux changements, il en tire profit pour distancer la concurrence."
      }
    ]
  }
];
