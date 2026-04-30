import { ArrowRight } from "lucide-react";

export function Section2() {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-3 mb-8">
        <span className="text-xs font-semibold text-[#e8d5b0]/60 uppercase tracking-widest">02</span>
        <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-[#f0ede8]">Comprendre l'environnement</h2>
      </div>
      <p className="text-white/60 text-base leading-relaxed mb-10">
        Pas besoin d'être développeur. Mais comprendre les bases change radicalement la qualité des résultats qu'on obtient.
      </p>

      {/* LLM */}
      <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-6 md:p-8 mb-6">
        <h3 className="text-base font-semibold text-[#f0ede8] mb-4">Démystifier le LLM</h3>
        <p className="text-sm text-white/55 leading-relaxed mb-6">
          Un LLM c'est le moteur derrière Claude, ChatGPT, Gemini. Il prédit le prochain mot le plus probable. Ce n'est pas une base de données. Il génère une réponse probable en fonction du contexte.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-black/20 border border-white/5 rounded-xl p-4">
            <p className="text-xs font-semibold text-[#e8d5b0] mb-2">Les tokens</p>
            <p className="text-xs text-white/50 leading-relaxed">
              L'IA ne lit pas des mots, elle lit des tokens (env. 0,75 mot). Chaque modèle a une limite de tokens (la fenêtre de contexte). Quand la fenêtre est pleine, le modèle commence à "oublier" ce qui a été dit au début. Une trop longue conversation produit des résultats incohérents.
            </p>
          </div>
          <div className="bg-black/20 border border-white/5 rounded-xl p-4">
            <p className="text-xs font-semibold text-[#e8d5b0] mb-2">Pourquoi un projet Claude change tout</p>
            <p className="text-xs text-white/50 leading-relaxed">
              Un projet Claude, c'est une conversation permanente avec un contexte chargé une fois pour toutes. J'y mets des fichiers de connaissances. À chaque session, l'IA sait déjà qui est le client et quelles sont les règles. Je ne répète rien.
            </p>
          </div>
        </div>
      </div>

      {/* API */}
      <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-6 md:p-8 mb-6">
        <h3 className="text-base font-semibold text-[#f0ede8] mb-4">L'analogie de l'API</h3>
        <p className="text-sm text-white/55 leading-relaxed mb-4">
          Une API, c'est comme un serveur dans un restaurant. Je passe ma commande au serveur, qui transmet à la cuisine, qui prépare et renvoie.
        </p>
        <div className="bg-black/20 border border-white/5 rounded-xl p-4 mb-4">
          <div className="flex items-center gap-2 text-[10px] md:text-xs text-white/40 flex-wrap justify-between md:justify-start">
            <span className="text-[#e8d5b0] whitespace-nowrap">Mon app</span>
            <ArrowRight className="w-3 h-3 flex-shrink-0" />
            <span className="whitespace-nowrap">API</span>
            <ArrowRight className="w-3 h-3 flex-shrink-0" />
            <span className="whitespace-nowrap">Service externe</span>
            <ArrowRight className="w-3 h-3 flex-shrink-0" />
            <span className="whitespace-nowrap">API</span>
            <ArrowRight className="w-3 h-3 flex-shrink-0" />
            <span className="text-[#e8d5b0] whitespace-nowrap">Mon app</span>
          </div>
        </div>
        <p className="text-sm text-white/55 leading-relaxed">
          Je comprends qu'il faut une clé API secrète, et gérer les erreurs. Sans cette compréhension, l'IA produirait du code que je ne saurais pas évaluer.
        </p>
      </div>

      {/* Prompt structuré */}
      <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-6 md:p-8">
        <h3 className="text-base font-semibold text-[#f0ede8] mb-4">Le prompt structuré</h3>
        <p className="text-sm text-white/55 leading-relaxed mb-6">Même outil, même modèle, deux résultats radicalement différents.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-red-500/5 border border-red-500/15 rounded-xl p-4">
            <p className="text-xs font-semibold text-red-400 mb-2">Prompt basique</p>
            <p className="text-xs text-white/50 font-mono">"Fais-moi un site pour un plombier."</p>
            <p className="text-xs text-white/35 mt-3 leading-relaxed">Résultat : générique, sans personnalité, indistinguable de 10 000 autres sites.</p>
          </div>
          <div className="bg-emerald-500/5 border border-emerald-500/15 rounded-xl p-4">
            <p className="text-xs font-semibold text-emerald-400 mb-2">Prompt structuré</p>
            <p className="text-[11px] text-white/50 font-mono leading-relaxed">
              "Tu es un designer senior spécialisé dans les sites pour artisans. Contexte : Marc, plombier. Clientèle : propriétaires 35-60 ans. Problème : ils ne savent pas s'il est disponible..."
            </p>
          </div>
        </div>
        <div className="bg-black/20 border border-white/5 rounded-xl p-4">
          <p className="text-xs font-semibold text-[#e8d5b0] mb-3">Les composantes d'un bon prompt</p>
          <ul className="space-y-3">
            {[
              ["Le rôle", "\"Tu es un développeur senior\", \"Tu es un copywriter\"."],
              ["Le contexte", "Qui est le client, le problème, l'utilisateur final."],
              ["La tâche précise", "\"Génère le texte du hero\", pas \"génère le site\"."],
              ["Les contraintes", "\"Pas de jargon technique\", \"respecte ces couleurs\"."],
              ["Le format de sortie", "Markdown, JSON, code React."],
            ].map(([label, desc]) => (
              <li key={label as string} className="flex gap-2 text-xs md:text-sm text-white/50 leading-relaxed">
                <span className="text-[#e8d5b0] flex-shrink-0 font-medium whitespace-nowrap min-w-[100px]">{label} :</span>
                <span>{desc}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
