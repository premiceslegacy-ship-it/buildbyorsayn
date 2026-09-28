import Image from "next/image";
import { SectionReveal } from "@/components/ui/section-reveal";
import { PromptContextDiagram, ApiFlowDiagram } from "../diagrams";
import { FoundationChapter } from "../FoundationChapter";

function ToolMark({ name, src }: { name: string; src: string }) {
  return (
    <span className="inline-flex items-center gap-2 text-sm text-white/70">
      <Image src={src} alt="" aria-hidden="true" width={24} height={24} className="h-6 w-6 object-contain" loading="lazy" />
      {name}
    </span>
  );
}

export function Section2() {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 motion-reduce:animate-none">
      <div className="mb-8 flex items-center gap-3">
        <span className="text-xs font-semibold uppercase tracking-widest text-[#e8d5b0]/60">07</span>
        <h2 className="text-2xl font-semibold tracking-tight text-[#f0ede8] md:text-3xl">Comprendre l'environnement</h2>
      </div>
      <p className="mb-10 max-w-3xl text-base leading-relaxed text-white/60">
        Pas besoin d'être développeur. Mais comprendre les bases change la qualité des décisions, des demandes et des vérifications que tu peux faire.
      </p>

      <FoundationChapter eyebrow="Chapitre 1" title="Démystifier le LLM">
        <p>
          Un LLM (<em>Large Language Model</em>, ou grand modèle de langage) est le moteur derrière plusieurs assistants connus. Il produit une suite probable à partir du contexte qu'on lui donne. Ce n'est pas une base de données fiable par défaut et ce n'est pas un expert qui prend automatiquement la responsabilité du résultat.
        </p>
        <div className="flex flex-wrap gap-x-7 gap-y-4 border-y border-white/10 py-5">
          <ToolMark name="Claude" src="/brand-logos/claude.svg" />
          <ToolMark name="ChatGPT" src="/brand-logos/chatgpt.svg" />
          <ToolMark name="Gemini" src="/brand-logos/gemini.svg" />
        </div>
        <PromptContextDiagram />
        <div className="divide-y divide-white/10 border-y border-white/10">
          <div className="grid gap-3 py-4 md:grid-cols-[9rem_1fr]"><strong className="text-sm text-[#e8d5b0]">Les tokens</strong><p className="text-sm leading-relaxed text-white/60">Les tokens sont les unités de texte que le modèle traite, parfois un mot entier, parfois un morceau de mot. Une conversation est limitée par une fenêtre de contexte. Quand elle devient trop longue, les éléments anciens peuvent peser moins ou être résumés. Un dossier de contexte clair vaut mieux qu'un historique interminable.</p></div>
          <div className="grid gap-3 py-4 md:grid-cols-[9rem_1fr]"><strong className="text-sm text-[#e8d5b0]">Le projet</strong><p className="text-sm leading-relaxed text-white/60">Un projet ou un dossier de connaissances charge les règles, les fichiers et les décisions utiles. Tu évites de répéter le métier à chaque session, mais tu dois continuer à vérifier que le contexte est à jour.</p></div>
        </div>
        <p className="border-l-2 border-[#e8d5b0]/45 bg-[#e8d5b0]/[0.035] px-5 py-4 text-sm leading-relaxed text-white/65">
          Pour une tâche précise, ne charge pas tout le projet par réflexe. Commence par le fichier cible, ses dépendances directes, les règles concernées et les tests associés. Élargis le contexte seulement lorsqu'une dépendance le justifie, puis vérifie que les fichiers modifiés restent dans le périmètre.
        </p>
      </FoundationChapter>

      <FoundationChapter eyebrow="Chapitre 2" title="L'analogie de l'API">
        <p>
          Une API ressemble à un serveur dans un restaurant. Tu envoies une demande structurée, le service distant l'interprète, puis il renvoie une réponse. Il faut connaître le format attendu, la clé d'accès, le coût éventuel, les délais, les erreurs et les données qui sortent de ton système.
        </p>
        <ApiFlowDiagram />
        <p>
          Ne colle jamais une clé dans un dépôt, une capture ou un prompt partagé. Utilise un secret injecté par l'environnement, limite les permissions et vérifie le chemin de révocation avant de relier un service.
        </p>
      </FoundationChapter>

      <FoundationChapter eyebrow="Chapitre 3" title="Un rôle ne remplace pas une méthode">
        <p>
          « Tu es un designer senior » peut donner un ton, mais cela n'installe ni les critères, ni les fichiers, ni le processus, ni les limites du métier. Un résultat plus fiable vient d'un rôle, d'un contexte, d'une tâche bornée et d'une définition du travail terminé.
        </p>
        <div className="grid gap-6 border-y border-white/10 py-5 md:grid-cols-2">
          <div className="border-t border-red-500/25 pt-4"><p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-red-300/80">Rôle seul</p><p className="font-mono text-xs leading-relaxed text-white/50">« Tu es un designer senior, fais-moi un site pour un plombier. »</p><p className="mt-3 text-xs leading-relaxed text-white/35">Le modèle improvise le reste.</p></div>
          <div className="border-t border-emerald-500/25 pt-4"><p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-emerald-300/80">Rôle et méthode</p><p className="font-mono text-[11px] leading-relaxed text-white/50">Contexte, public, offre, références, tokens, critères d'acceptation et vérification du parcours.</p><p className="mt-3 text-xs leading-relaxed text-white/35">Le modèle sait quoi lire et comment vérifier.</p></div>
        </div>
        <p className="border-l-2 border-[#e8d5b0]/45 bg-[#e8d5b0]/[0.035] px-5 py-4 text-sm leading-relaxed text-white/65">
          Le vrai levier n'est pas le prompt parfait. C'est le contexte chargé une fois pour toutes et maintenu comme un actif de projet : règles, exemples, exceptions, preuves et décisions.
        </p>
      </FoundationChapter>

      <FoundationChapter eyebrow="Chapitre 4" title="De l'assistant à l'agent">
        <p>
          Un assistant répond dans une conversation. Un agent peut lire un dossier, appeler des outils, modifier un fichier, exécuter une étape, contrôler une sortie et s'arrêter sur une exception. Cette capacité ne justifie pas une autonomie illimitée : plus l'agent agit, plus son périmètre doit être explicite.
        </p>
        <div className="divide-y divide-white/10 border-y border-white/10">
          {[
            ["Observer", "Lire les fichiers, l'état du projet et les sources autorisées avant d'agir."],
            ["Décider", "Choisir une prochaine étape à partir de critères visibles, avec une hypothèse si une information manque."],
            ["Exécuter", "Modifier, appeler ou préparer seulement ce qui entre dans le périmètre donné."],
            ["Vérifier", "Lancer les tests, relire la sortie, comparer au critère d'acceptation et signaler ce qui reste incertain."],
          ].map(([title, description], index) => (
            <div key={title} className="grid gap-3 py-4 sm:grid-cols-[2rem_9rem_1fr] sm:items-start"><span className="font-mono text-xs text-[#e8d5b0]/60">{index + 1})</span><strong className="text-sm text-[#f0ede8]">{title}</strong><p className="text-sm leading-relaxed text-white/60">{description}</p></div>
          ))}
        </div>
        <p>
          La différence ressemble à une recette et une personne qui fait les courses, cuisine et goûte avant de servir. Le résultat doit être observable, réversible et compréhensible après l'exécution.
        </p>
      </FoundationChapter>

      <FoundationChapter eyebrow="Chapitre 5" title="Hermes organise le travail autour du modèle">
        <p>
          Le modèle produit une réponse. Hermes organise le travail autour : contexte, skills, outils, mémoire, profils, planification, délégation et contrôles. Si tu changes de modèle, les éléments qui doivent rester stables se trouvent dans tes fichiers, tes méthodes, tes preuves et tes règles, pas dans une conversation fragile.
        </p>
        <p>
          Le MCP (<em>Model Context Protocol</em>) est un standard de connexion entre un assistant et des outils ou des sources autorisées. Claude, ChatGPT ou un autre client compatible peuvent ainsi consulter une même capacité, mais le MCP ne décide pas à ta place : les permissions, le périmètre, la validation humaine et la lecture de l'état réel restent nécessaires.
        </p>
        <div className="flex flex-wrap gap-x-7 gap-y-4 border-y border-white/10 py-5">
          <ToolMark name="DeepSeek" src="/brand-logos/deepseek.svg" />
          <ToolMark name="OpenRouter" src="/brand-logos/openrouter.svg" />
          <ToolMark name="OpenCode" src="/brand-logos/opencode.svg" />
          <ToolMark name="Hermes Agent" src="/brand-logos/hermes-agent-mark.png" />
        </div>
        <div className="divide-y divide-white/10 border-y border-white/10">
          {[
            ["Le modèle", "Un fournisseur ou un routeur produit les réponses. Teste sa qualité sur ta tâche, sa vitesse, son coût, sa sensibilité aux données et son besoin d'outils."],
            ["La connexion", "Une couche de connexion peut donner accès à des outils ou des données externes. Elle ne choisit pas automatiquement le meilleur modèle et ne remplace pas les contrôles."],
            ["L'orchestration", "Hermes relie les capacités, garde le contexte utile, déclenche des processus et rend la séparation des responsabilités lisible."],
            ["La décision", "Tu gardes une règle d'approbation pour les messages, publications, modifications CRM, dépenses et actions qui engagent une autre personne."],
          ].map(([title, description], index) => (
            <div key={title} className="grid gap-3 py-4 sm:grid-cols-[2rem_10rem_1fr] sm:items-start"><span className="font-mono text-xs text-[#e8d5b0]/60">{index + 1})</span><strong className="text-sm text-[#f0ede8]">{title}</strong><p className="text-sm leading-relaxed text-white/60">{description}</p></div>
          ))}
        </div>
        <p className="border-l-2 border-[#e8d5b0]/45 bg-[#e8d5b0]/[0.035] px-5 py-4 text-sm leading-relaxed text-white/65">
          Ne choisis pas un modèle, un routeur ou une interface parce qu'un tutoriel le présente comme universel. Décris d'abord la tâche et le niveau de qualité attendu, puis compare les routes avec un test reproductible.
        </p>
        <p className="border-l-2 border-[#e8d5b0]/45 bg-[#e8d5b0]/[0.035] px-5 py-4 text-sm leading-relaxed text-white/65">
          Un autre pattern utile consiste à relier une compétence à ses outils, ses permissions et ses connexions sans remettre les secrets à l'agent. La compétence décrit le travail, la connexion détient l'accès, le journal garde la trace et la personne valide les actions qui franchissent une frontière externe. Tu peux adapter ce pattern à Hermes ou à une autre stack : ce qui compte est la séparation des responsabilités, pas le nom du fournisseur.
        </p>
      </FoundationChapter>

      <SectionReveal className="border-t border-white/10 pt-8">
        <p className="text-sm leading-relaxed text-[#e8d5b0]/85">Comprendre l'environnement, c'est savoir où placer le contexte, où placer l'outil, où placer la décision humaine et comment vérifier que le système a réellement fait ce qu'il prétend.</p>
      </SectionReveal>
    </div>
  );
}
