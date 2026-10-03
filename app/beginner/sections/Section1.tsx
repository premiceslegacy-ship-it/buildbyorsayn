import Image from "next/image";
import { ContextFilesDiagram, FounderDossierDiagram } from "../diagrams";
import { FoundationChapter } from "../FoundationChapter";
import { FoundationEditorialNote } from "../FoundationEditorialNote";

const QUESTION_GROUPS = [
  {
    label: "Le public",
    intro: "Pour qui, et pour faire quoi.",
    questions: [
      ["Qui est l'utilisateur ?", "Une personne précise, avec un contexte précis. Cette personne détermine le design, le niveau de complexité, les mots et le CTA principal."],
      ["Quel problème je résous ?", "Pas « je veux faire un site web ». Le problème se formule depuis le point de vue de l'utilisateur : temps perdu, demandes mal qualifiées, confiance difficile à établir ou information qui se perd."],
      ["Quel CTA principal ?", "Un seul. L'utilisateur qui arrive sur le site, quelle action unique doit-il pouvoir faire : prendre un rendez-vous, demander un devis, acheter ou télécharger ?"],
    ],
  },
  {
    label: "La technique",
    intro: "Ce que le projet demande vraiment de construire.",
    questions: [
      ["Quelles connexions ?", "Une connexion entre le formulaire, le mail, le CRM ou le paiement est une dépendance du projet. Liste-la dès le départ et précise les données qui circulent."],
      ["Quel niveau de backend ?", "Un site vitrine simple n'a pas les mêmes besoins qu'un espace membre, un paiement ou une base de données. Décide ce qui doit être privé, persistant et vérifiable."],
      ["Quelles limites de sécurité ?", "Identifie les secrets, les permissions, les données sensibles, les comptes responsables et les actions qui devront rester soumises à validation."],
    ],
  },
  {
    label: "Le cadrage business",
    intro: "Ce qui borne la décision de tout le reste.",
    questions: [
      ["Quelle direction artistique ?", "Décris des décisions visibles : grille, typographie, densité, lumière, matières, icônes, états et mouvement. Trois adjectifs ne suffisent pas."],
      ["Quelles fonctionnalités, dans quel ordre ?", "Classe les fonctions indispensables et celles qui peuvent attendre. Un résultat réduit mais complet vaut mieux qu'une accumulation partiellement finie."],
      ["Quel objectif à 90 jours ?", "Choisis une métrique liée à l'action : demandes qualifiées, rendez-vous, ventes, activation ou temps économisé. L'objectif oriente la technique et le contenu."],
    ],
  },
] as const;

function ToolMark({ name, src }: { name: string; src: string }) {
  return (
    <span className="inline-flex items-center gap-2 text-sm text-white/70">
      <Image src={src} alt="" aria-hidden="true" width={24} height={24} className="h-6 w-6 object-contain" loading="lazy" />
      {name}
    </span>
  );
}

export function Section1() {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 motion-reduce:animate-none">
      <div className="mb-8 flex items-center gap-3">
        <span className="text-xs font-semibold uppercase tracking-widest text-[#e8d5b0]/60">06</span>
        <h2 className="text-2xl font-semibold tracking-tight text-[#f0ede8] md:text-3xl">Penser avant de construire</h2>
      </div>
      <p className="mb-10 max-w-3xl text-base leading-relaxed text-white/60">
        Avant de toucher un outil, pose le cadre. C'est l'étape qui empêche un projet de devenir une suite de décisions prises au hasard.
      </p>

      <FoundationChapter eyebrow="Chapitre 1" title="Les questions vitales">
        <p>
          Réponds à ces questions avant d'ouvrir un éditeur ou de demander une génération. Elles forment un dossier de décision, pas huit cases à remplir pour faire joli.
        </p>
        <div className="divide-y divide-white/10 border-y border-white/10">
          {QUESTION_GROUPS.map((group) => (
            <div key={group.label} className="py-6">
              <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#e8d5b0]/70">{group.label}</p>
              <p className="mb-4 text-xs leading-relaxed text-white/40">{group.intro}</p>
              <div className="divide-y divide-white/10">
                {group.questions.map(([question, answer], index) => (
                  <div key={question} className="grid gap-3 py-4 sm:grid-cols-[2rem_12rem_1fr] sm:items-start">
                    <span className="font-mono text-xs text-[#e8d5b0]/60">{index + 1})</span>
                    <strong className="text-sm text-[#f0ede8]">{question}</strong>
                    <p className="text-sm leading-relaxed text-white/60">{answer}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </FoundationChapter>

      <FoundationChapter eyebrow="Chapitre 2" title="Pourquoi une IA seule ne suffit pas">
        <p>
          Beaucoup de gens pensent qu'il suffit de demander à une IA de créer un site pour un métier précis. En pratique, un résultat professionnel dépend du contexte, des décisions de structure, des preuves disponibles et de critères qui permettent de vérifier le travail.
        </p>
        <p>
          L'IA est un outil d'exécution extraordinaire. Elle a besoin d'un dossier compréhensible : problème, public, offre, références, contraintes, fichiers à lire et définition du résultat terminé. <strong className="text-[#f0ede8]">L'IA exécute. Toi, tu gardes le jugement, le périmètre et la responsabilité de vérifier.</strong>
        </p>
        <FoundationEditorialNote label="À noter">
          Une source publique peut inspirer un mécanisme, mais elle ne devient pas une méthode parce qu'elle est populaire. Note toujours ce qui a été observé, ce qui reste hypothétique et le test qui permettrait de trancher.
        </FoundationEditorialNote>
      </FoundationChapter>

      <FoundationChapter eyebrow="Chapitre 3" title="Les automatisations suivent une logique simple">
        <p>
          Quand un formulaire envoie un email et crée une ligne dans un CRM, il y a une condition, une action et un résultat. Le langage naturel peut décrire cette logique, mais tu dois savoir ce qui doit arriver, à qui, avec quelles données et dans quel cas l'automatisation doit s'arrêter.
        </p>
        <p className="border-y border-white/10 py-4 font-mono text-xs leading-relaxed text-[#e8d5b0]">
          « Quand ce formulaire est soumis, envoie une confirmation et crée le contact dans le CRM, sauf si le consentement manque. »
        </p>
        <div className="flex flex-wrap gap-x-7 gap-y-4 border-b border-white/10 pb-5">
          <ToolMark name="Claude" src="/brand-logos/claude.svg" />
          <ToolMark name="Cursor" src="/brand-logos/cursor.svg" />
          <ToolMark name="HubSpot" src="/brand-logos/hubspot.svg" />
        </div>
        <p>
          Avant de l'exécuter, vérifie les permissions, le format des données, les doublons, les erreurs et le chemin manuel de récupération. Une automatisation fiable est une petite procédure observable, pas une phrase impressionnante.
        </p>
      </FoundationChapter>

      <FoundationChapter eyebrow="Chapitre 4" title="Un workflow agentique n'est pas un prompt géant">
        <p>
          Un workflow agentique sépare les responsabilités. Il collecte, interprète, prépare puis demande une autorisation quand l'action touche une personne, un compte, un CRM, une publication ou une dépense. Commence en lecture seule, garde les sources et augmente l'autorité uniquement après des tests réels.
        </p>
        <div className="flex flex-wrap gap-x-7 gap-y-4 border-y border-white/10 py-5">
          <ToolMark name="Hermes Agent" src="/brand-logos/hermes-agent-mark.png" />
          <ToolMark name="X" src="/brand-logos/x.svg" />
          <ToolMark name="TikTok" src="/brand-logos/tiktok.svg" />
        </div>
        <div className="divide-y divide-white/10 border-y border-white/10">
          {[
            ["Collecter", "Récupérer des données publiques ou autorisées en conservant l'URL, la date, le statut d'accès et la limite."],
            ["Interpréter", "Transformer la matière en critères : pertinence, valeur, urgence réelle, risque, coût et prochaine action."],
            ["Préparer", "Produire un résumé, une segmentation, un brouillon ou une proposition sans déclencher l'action externe."],
            ["Autoriser", "Faire valider la publication, l'envoi, la modification ou la dépense tant que le flux n'a pas prouvé sa fiabilité."],
          ].map(([title, description], index) => (
            <div key={title} className="grid gap-2 py-4 md:grid-cols-[2rem_10rem_1fr]">
              <span className="font-mono text-xs text-[#e8d5b0]/60">{index + 1})</span>
              <strong className="text-sm text-[#f0ede8]">{title}</strong>
              <p className="text-sm leading-relaxed text-white/60">{description}</p>
            </div>
          ))}
        </div>
        <FoundationEditorialNote label="Les noms comptent">
          Les noms de connexions sont littéraux. Si ton environnement déclare une connexion sous le nom <code className="text-[#e8d5b0]">nom-connexion</code>, utilise exactement ce nom. Ne remplace jamais un identifiant par une variante supposée plus logique.
        </FoundationEditorialNote>
      </FoundationChapter>

      <FoundationChapter eyebrow="Chapitre 5" title="Les fichiers de contexte donnent une mémoire de travail au projet">
        <p>
          Avant de lancer un outil IA, crée un dossier de contexte. Un brief résume le problème et l'objectif. Un document de critères liste ce qui doit fonctionner. D'autres fichiers peuvent préciser la marque, le modèle de données, la sécurité, les parcours, les hypothèses et les décisions déjà prises.
        </p>
        <ContextFilesDiagram />
        <p>
          Sur un vrai projet, deux fichiers ne suffisent pas longtemps. L'important n'est pas de produire une documentation décorative, mais de garder une carte canonique qui indique ce qui est décidé, ce qui est prouvé, ce qui est hypothétique et ce qui doit encore être testé.
        </p>
        <FounderDossierDiagram />
        <p>
          C'est le principe d'un dossier fondateur : chaque décision possède une source, une preuve ou un statut explicite. Le dossier devient ensuite le contexte partagé par les skills et les agents du projet.
        </p>
      </FoundationChapter>

      <FoundationChapter eyebrow="Chapitre 6" title="Les workflows se prouvent dans le travail réel">
        <p>
          Les méthodes de BUILD viennent de situations concrètes : organiser une recherche, synchroniser des compétences, étudier une source autorisée, transformer une vidéo en dérivés ou relier un contenu à une prochaine étape commerciale. Elles ne sont pas des recettes à recopier. Elles montrent comment choisir un périmètre, ajouter un contrôle et mesurer avant de généraliser.
        </p>
        <div className="flex flex-wrap gap-x-7 gap-y-4 border-y border-white/10 py-5">
          <ToolMark name="Hermes Agent" src="/brand-logos/hermes-agent-mark.png" />
          <ToolMark name="TikTok" src="/brand-logos/tiktok.svg" />
          <ToolMark name="YouTube" src="/brand-logos/youtube.svg" />
          <ToolMark name="GitHub" src="/brand-logos/github.svg" />
        </div>
        <div className="divide-y divide-white/10 border-y border-white/10">
          {[
            ["Recherche vers résultat", "Un brief devient des sources qualifiées, une fiche de mécanisme, une intégration dans le produit puis une validation technique."],
            ["Skill et synchronisation", "Un pack est comparé à sa source canonique. Si une référence dérive, le processus s'arrête au lieu de publier un résultat incomplet."],
            ["Source vers contenu", "Une source conservée devient une transcription, une sélection humaine, un dérivé relié à son origine, une approbation et une mesure."],
            ["Connexion vers action", "Une tâche passe par une compétence, une connexion nommée, une permission limitée, une préparation, une validation et un readback, c'est-à-dire une lecture de l'état réel après l'action."],
            ["Bots spécialisés", "Un bot spécialisé ne reçoit pas une mission vague : chaque profil a un périmètre, des sources, des outils autorisés, une sortie attendue et une règle d'arrêt."],
            ["Miniature YouTube", "Le contrat réel de la vidéo devient un angle, un concept, une miniature lisible à petite taille, des contrôles et une approbation artistique séparée."],
            ["SEO et visibilité générative", "Le SEO (optimisation pour les moteurs de recherche) et le GEO (optimisation pour les moteurs génératifs) commencent par une lecture autorisée des données de recherche pour choisir une page à renforcer. La vérité produit, le maillage, le build et l'approbation passent avant la publication."],
          ].map(([title, description], index) => (
            <div key={title} className="grid gap-2 py-4 md:grid-cols-[2rem_12rem_1fr]">
              <span className="font-mono text-xs text-[#e8d5b0]/60">{index + 1})</span>
              <strong className="text-sm text-[#f0ede8]">{title}</strong>
              <p className="text-sm leading-relaxed text-white/60">{description}</p>
            </div>
          ))}
        </div>
        <FoundationEditorialNote label="Ce qui compte">
          Le résultat n'est considéré comme réutilisable qu'après une lecture du résultat réel, une mesure, une règle d'arrêt et un chemin manuel. Un chiffre de communauté, une promesse publique ou une économie annoncée ne remplace jamais cette preuve.
        </FoundationEditorialNote>
      </FoundationChapter>

      <FoundationEditorialNote label="À retenir" className="mt-14 mb-4">Un bon projet ne commence pas avec le meilleur outil. Il commence avec une situation, une décision à prendre, une preuve à obtenir et une limite à respecter.</FoundationEditorialNote>
    </div>
  );
}
