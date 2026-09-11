import { LiquidCard } from "@/components/ui/liquid-glass-card";
import { ToolCard } from "@/components/ui/tool-card";
import { SectionReveal } from "@/components/ui/section-reveal";
import { PromptContextDiagram, ApiFlowDiagram } from "../diagrams";

export function Section2() {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-3 mb-8">
        <span className="text-xs font-semibold text-[#e8d5b0]/60 uppercase tracking-widest">07</span>
        <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-[#f0ede8]">Comprendre l&apos;environnement</h2>
      </div>
      <p className="text-white/60 text-base leading-relaxed mb-10">
        Pas besoin d&apos;être développeur. Mais comprendre les bases change radicalement la qualité des résultats qu&apos;on obtient.
      </p>

      {/* LLM */}
      <SectionReveal>
        <LiquidCard variant="elevated" className="p-6 md:p-8 mb-6">
          <h3 className="text-base font-semibold text-[#f0ede8] mb-4 tracking-tight leading-snug">Démystifier le LLM</h3>
          <p className="text-sm text-white/65 leading-relaxed mb-4">
            Un LLM c&apos;est le moteur derrière Claude, ChatGPT, Gemini. Il prédit le prochain mot le plus probable. Ce n&apos;est pas une base de données. Il génère une réponse probable en fonction du contexte.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
            <ToolCard name="Claude" logoSrc="/brand-logos/claude.svg" description="Le modèle utilisé comme référence dans BUILD, notamment pour ses &quot;projets&quot; à contexte permanent." />
            <ToolCard name="ChatGPT" logoSrc="/brand-logos/chatgpt.svg" description="Le plus connu du grand public - bon pour cadrer et rédiger." />
            <ToolCard name="Gemini" logoSrc="/brand-logos/gemini.svg" description="Le modèle de Google, intégré nativement à son écosystème d'outils." />
          </div>
          <PromptContextDiagram />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5 items-start mt-6">
            <div className="bg-black/20 border border-white/5 p-4">
              <p className="text-xs font-semibold text-[#e8d5b0] mb-2">Les tokens</p>
              <p className="text-[13px] text-white/60 leading-[1.65]">
                L&apos;IA ne lit pas des mots, elle lit des tokens (env. 0,75 mot). Chaque modèle a une limite de tokens (la fenêtre de contexte). Quand la fenêtre est pleine, le modèle commence à &quot;oublier&quot; ce qui a été dit au début. Une trop longue conversation produit des résultats incohérents.
              </p>
            </div>
            <div className="bg-black/20 border border-white/5 p-4">
              <p className="text-xs font-semibold text-[#e8d5b0] mb-2">Pourquoi un projet Claude change tout</p>
              <p className="text-[13px] text-white/60 leading-[1.65]">
                Un projet Claude, c&apos;est une conversation permanente avec un contexte chargé une fois pour toutes. J&apos;y mets des fichiers de connaissances. À chaque session, l&apos;IA sait déjà qui est le client et quelles sont les règles. Je ne répète rien.
              </p>
            </div>
          </div>
        </LiquidCard>
      </SectionReveal>

      {/* API */}
      <SectionReveal>
        <LiquidCard variant="elevated" className="p-6 md:p-8 mb-6">
          <h3 className="text-base font-semibold text-[#f0ede8] mb-4 tracking-tight leading-snug">L&apos;analogie de l&apos;API</h3>
          <p className="text-sm text-white/65 leading-relaxed mb-4">
            Une API, c&apos;est comme un serveur dans un restaurant. Je passe ma commande au serveur, qui transmet à la cuisine, qui prépare et renvoie.
          </p>
          <ApiFlowDiagram />
          <p className="text-sm text-white/65 leading-relaxed mt-4">
            Je comprends qu&apos;il faut une clé API secrète, et gérer les erreurs. Sans cette compréhension, l&apos;IA produirait du code que je ne saurais pas évaluer.
          </p>
        </LiquidCard>
      </SectionReveal>

      {/* Prompt structuré */}
      <SectionReveal>
        <LiquidCard variant="elevated" className="p-6 md:p-8 mb-6">
          <h3 className="text-base font-semibold text-[#f0ede8] mb-4 tracking-tight leading-snug">Pourquoi &quot;sois un designer senior&quot; ne suffit pas</h3>
          <p className="text-sm text-white/65 leading-relaxed mb-4">
            &quot;Tu es un designer senior spécialisé Apple&quot; est un meilleur prompt qu&apos;une simple instruction brute, mais ça reste une coquille vide : l&apos;IA ne sait pas ce qu&apos;est réellement le design Apple, comment un designer chez eux exécute, quels tokens et quel process il applique. Le rôle donne un ton, jamais une méthode. Même chose en marketing, en vente, en copywriting : nommer un métier n&apos;installe pas son savoir-faire.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5 mb-6 items-start">
            <div className="relative overflow-hidden border border-red-500/20 bg-gradient-to-b from-red-500/[0.06] to-black/20 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04),inset_0_-16px_28px_-24px_rgba(0,0,0,0.6)]">
              <p className="text-xs font-semibold text-red-400 mb-2">Prompt de rôle seul</p>
              <p className="text-xs text-white/50 font-mono">&quot;Tu es un designer senior spécialisé Apple, fais-moi un site pour un plombier.&quot;</p>
              <p className="text-xs text-white/35 mt-3 leading-relaxed">Résultat : un vernis de vocabulaire &quot;premium&quot;, mais toujours générique - l&apos;IA improvise le reste.</p>
            </div>
            <div className="relative overflow-hidden border border-emerald-500/20 bg-gradient-to-b from-emerald-500/[0.06] to-black/20 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04),inset_0_-16px_28px_-24px_rgba(0,0,0,0.6)]">
              <p className="text-xs font-semibold text-emerald-400 mb-2">Rôle + process formalisé</p>
              <p className="text-[11px] text-white/50 font-mono leading-relaxed">
                Contexte : Marc, plombier. Clientèle : propriétaires 35-60 ans. + le process de design (brief, tokens, calibration) déjà écrit une fois pour toutes.
              </p>
            </div>
          </div>
          <div className="relative overflow-hidden border border-white/10 bg-gradient-to-b from-white/[0.03] to-black/20 p-4 mb-4">
            <p className="text-xs font-semibold text-[#e8d5b0] mb-3">Ce qui fait vraiment la différence</p>
            <p className="text-sm text-white/60 leading-relaxed">
              Au début, ce qui marche c&apos;est le <span className="text-[#f0ede8] font-medium">meta-prompting</span> : demander à l&apos;IA elle-même comment formuler la meilleure instruction pour ce qu&apos;on veut obtenir, plutôt que deviner la formule magique. Mais très vite, ce genre de prompt ponctuel plafonne : sans les tokens de design, les process précis et les standards du métier écrits noir sur blanc, la qualité reste plafonnée au générique.
            </p>
          </div>
          <div className="bg-[#e8d5b0]/5 border border-[#e8d5b0]/15 p-4">
            <p className="text-sm text-[#e8d5b0]/85 leading-relaxed">
              Le vrai secret n&apos;est pas le prompt parfait à chaque fois. C&apos;est le contexte chargé une fois pour toutes : tes fichiers de projet, tes règles, tes standards, tes tokens de design réunis dans un système réutilisable. C&apos;est ça qu&apos;on appelle un skill, et c&apos;est ce qui transforme l&apos;IA en collaborateur qui te connaît déjà - sans avoir à réexpliquer le métier à chaque session.
            </p>
          </div>
        </LiquidCard>
      </SectionReveal>

      {/* De l'assistant à l'agent */}
      <SectionReveal>
        <LiquidCard variant="elevated" className="p-6 md:p-8">
          <h3 className="text-base font-semibold text-[#f0ede8] mb-4 tracking-tight leading-snug">De l&apos;assistant à l&apos;agent</h3>
          <p className="text-sm text-white/65 leading-relaxed mb-4">
            Tout ce qu&apos;on vient de voir décrit un assistant : tu poses une question dans une conversation, il répond, tu lis, tu recopies. Un <strong className="text-[#f0ede8]">agent</strong> va plus loin - il ne se contente pas de répondre, il agit : il peut naviguer un site, exécuter du code, appeler des outils, enchaîner plusieurs étapes tout seul, et vérifier lui-même que le résultat correspond à la demande.
          </p>
          <p className="text-sm text-white/65 leading-relaxed mb-4">
            Concrètement : au lieu de copier-coller la réponse d&apos;un chat dans ton code, un agent comme Claude Code ou Cursor lit ton projet, modifie les fichiers directement, lance les tests, corrige ses propres erreurs - et ne s&apos;arrête que quand la tâche est vérifiée, pas quand il a produit une réponse qui a l&apos;air correcte.
          </p>
          <p className="text-sm text-white/65 leading-relaxed">
            C&apos;est la différence entre demander une recette et avoir quelqu&apos;un qui va faire les courses, cuisiner, et goûter avant de servir. Cette bascule - de l&apos;assistant qui répond à l&apos;agent qui exécute et vérifie - est celle qui va le plus vite transformer la manière de travailler dans les prochaines années. LE COFFRE approfondit cette doctrine agentique en détail : comment décomposer un métier en agents et border leur autorité.
          </p>
        </LiquidCard>
      </SectionReveal>
    </div>
  );
}
