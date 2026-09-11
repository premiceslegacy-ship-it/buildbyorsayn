import { Play } from "lucide-react";
import Link from "next/link";
import { LiquidCard } from "@/components/ui/liquid-glass-card";
import { SectionReveal } from "@/components/ui/section-reveal";
import { ProjectPipelineDiagram } from "../diagrams";

function ToolChip({ name, logoSrc }: { name: string; logoSrc: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 border border-white/10 bg-white/[0.03] pl-1.5 pr-2.5 py-1">
      <img src={logoSrc} alt="" aria-hidden="true" width={14} height={14} className="w-3.5 h-3.5 object-contain" loading="lazy" decoding="async" draggable={false} />
      <span className="text-[11px] font-medium text-white/60">{name}</span>
    </span>
  );
}

const STEPS = [
  {
    num: 1,
    title: "Génération no-code : le brouillon",
    tools: [
      { name: "Lovable", logoSrc: "/brand-logos/lovable.svg" },
      { name: "Bolt.new", logoSrc: "/brand-logos/bolt-new.svg" },
      { name: "AI Studio", logoSrc: "/brand-logos/google-ai-studio.png" },
    ],
    body: (
      <>
        <p className="text-sm text-white/55 leading-relaxed mb-4">
          Avant de toucher un éditeur de code, je crée un premier jet visuel avec un outil no-code.
        </p>
        <ul className="space-y-2 mb-4 text-sm text-white/55 leading-relaxed">
          <li>• Je décris mon projet (en lui donnant le brief et le style trouvés sur Pinterest).</li>
          <li>• L&apos;outil génère une première version interactive.</li>
          <li>• Ça permet de valider la structure globale avant d&apos;investir des heures de travail.</li>
        </ul>
        <div className="bg-black/20 border border-white/5 p-4 mt-auto">
          <p className="text-[11px] font-semibold text-white/30 uppercase tracking-widest mb-2">La limite du no-code</p>
          <p className="text-xs text-white/45 leading-relaxed">
            Dès que tu veux des comptes utilisateurs, des paiements en ligne, une vraie base de données, ces outils bloquent. C&apos;est là qu&apos;on passe à un vrai éditeur (IDE).
          </p>
        </div>
      </>
    ),
  },
  {
    num: 2,
    title: "Le cloud de ton code : GitHub",
    tools: [{ name: "GitHub", logoSrc: "/brand-logos/github.svg" }],
    body: (
      <>
        <p className="text-sm text-white/55 leading-relaxed mb-4">
          Une fois le premier jet généré, il faut &quot;sauvegarder&quot; ce code de manière sécurisée. C&apos;est le Google Drive du code.
        </p>
        <div className="space-y-3 mt-auto">
          {[
            ["Pourquoi GitHub ?", "Si ton ordinateur casse, ton projet n'est pas perdu. Et c'est là que l'hébergeur viendra lire ton code pour le mettre en ligne."],
            ["Les 'commits'", "Chaque commit est un point de sauvegarde. Tu peux retourner dans le passé à tout moment."],
          ].map(([title, desc]) => (
            <div key={title} className="bg-black/20 border border-white/5 p-3">
              <p className="text-xs font-semibold text-[#e8d5b0] mb-1">{title}</p>
              <p className="text-xs text-white/40 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </>
    ),
  },
  {
    num: 3,
    title: "L'éditeur (IDE) et tes variables secrètes",
    tools: [
      { name: "Cursor", logoSrc: "/brand-logos/cursor.svg" },
      { name: "Codex", logoSrc: "/brand-logos/codex.svg" },
      { name: "Antigravity", logoSrc: "/brand-logos/antigravity.svg" },
    ],
    body: (
      <>
        <p className="text-sm text-white/55 leading-relaxed mb-4">
          On &quot;clone&quot; (télécharge) le code sur notre ordinateur dans un IDE. C&apos;est là que la vraie IA de codage entre en jeu.
        </p>
        <div className="bg-[#e8d5b0]/5 border border-[#e8d5b0]/15 p-4 mb-3">
          <p className="text-[11px] font-semibold text-[#e8d5b0]/80 uppercase tracking-widest mb-2">Premier lancement local</p>
          <p className="text-xs text-white/50 leading-relaxed mb-3">
            Après avoir récupéré un MVP depuis Lovable, Bolt ou AI Studio, il faut installer les dépendances une fois avant de lancer le site.
          </p>
          <div className="font-mono text-xs text-[#e8d5b0] space-y-1">
            <p><span className="text-white/30">1. </span>npm install</p>
            <p><span className="text-white/30">2. </span>npm run dev</p>
          </div>
          <p className="text-xs text-white/40 leading-relaxed mt-3">
            Sans <code>npm install</code>, le projet peut être présent dans l&apos;IDE mais ne pas s&apos;afficher correctement quand tu lances <code>npm run dev</code>.
          </p>
        </div>
        <div className="relative overflow-hidden border border-emerald-500/20 bg-gradient-to-b from-emerald-500/[0.06] to-black/20 p-4 mb-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.04),inset_0_-16px_28px_-24px_rgba(0,0,0,0.6)]">
          <p className="text-[11px] font-semibold text-emerald-400/80 uppercase tracking-widest mb-2">Les 3 commandes</p>
          <div className="font-mono text-xs text-[#e8d5b0] space-y-1">
            <p><span className="text-white/30">1. </span>git add .</p>
            <p><span className="text-white/30">2. </span>git commit -m &quot;...&quot;</p>
            <p><span className="text-white/30">3. </span>git push</p>
          </div>
        </div>
        <div className="relative overflow-hidden border border-red-500/20 bg-gradient-to-b from-red-500/[0.06] to-black/20 p-4 mt-auto shadow-[inset_0_1px_0_rgba(255,255,255,0.04),inset_0_-16px_28px_-24px_rgba(0,0,0,0.6)]">
          <p className="text-[11px] font-semibold text-red-500/80 uppercase tracking-widest mb-1">Danger : les clés API</p>
          <p className="text-xs text-white/55 leading-relaxed">
            Les mots de passe ne s&apos;écrivent <strong>JAMAIS</strong> dans le code. Mets-les dans un fichier <code className="text-[#f87171] bg-red-500/10 px-1 rounded">.env.local</code>.
          </p>
        </div>
      </>
    ),
  },
  {
    num: 4,
    title: "La mise en ligne (Vercel ou Cloudflare)",
    tools: [
      { name: "Vercel", logoSrc: "/brand-logos/vercel.svg" },
      { name: "Cloudflare", logoSrc: "/brand-logos/cloudflare.svg" },
    ],
    body: (
      <>
        <p className="text-sm text-white/55 leading-relaxed mb-4">
          Un hébergeur transforme ton code en un vrai site accessible partout dans le monde. Vercel est le plus simple pour démarrer. Cloudflare (avec Pages et Workers) est l&apos;autre grande option, plus robuste, celle qu&apos;on utilise pour les projets sérieux.
        </p>
        <ul className="space-y-3 text-sm text-white/55 leading-relaxed">
          <li className="flex gap-2"><span className="text-[#e8d5b0] flex-shrink-0">•</span><span><strong className="text-white/80">Connexion :</strong> Crée un compte, clique sur &quot;Importer&quot; et lie-le à ton GitHub. Les deux fonctionnent pareil.</span></li>
          <li className="flex gap-2"><span className="text-[#e8d5b0] flex-shrink-0">•</span><span><strong className="text-white/80">Déploiement auto :</strong> À chaque <code>git push</code>, ton site se met à jour tout seul en moins d&apos;une minute.</span></li>
          <li className="flex gap-2"><span className="text-[#e8d5b0] flex-shrink-0">•</span><span><strong className="text-white/80">Variables :</strong> Tes clés secrètes se rangent dans l&apos;écran &quot;Variables d&apos;environnement&quot;, présent chez Vercel comme chez Cloudflare.</span></li>
        </ul>
        <p className="text-sm text-white/70 font-medium mt-4">
          Code, push, en ligne.
        </p>
      </>
    ),
  },
];

export function Section4() {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-3 mb-8">
        <span className="text-xs font-semibold text-[#e8d5b0]/60 uppercase tracking-widest">09</span>
        <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-[#f0ede8]">Le flow : de l&apos;idée à l&apos;URL en ligne</h2>
      </div>

      <div className="bg-[#e8d5b0]/5 border border-[#e8d5b0]/15 px-6 py-4 mb-10">
        <p className="text-sm text-[#e8d5b0]/80">
          C&apos;est la section la plus concrète. À la fin, tu sais mettre un site en ligne, même si tu n&apos;as jamais codé.
        </p>
      </div>

      <SectionReveal>
        <ProjectPipelineDiagram />
      </SectionReveal>

      {/* Grille 2x2 */}
      <SectionReveal className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5 items-start">
        {STEPS.map((step) => (
          <LiquidCard key={step.num} variant="elevated" className="p-6">
            <div className="flex flex-col h-full">
              <div className="flex items-center gap-3 mb-3">
                <span className="w-7 h-7 bg-[#e8d5b0]/10 border border-[#e8d5b0]/20 flex items-center justify-center text-xs font-bold text-[#e8d5b0] flex-shrink-0">
                  {step.num}
                </span>
                <h3 className="text-base font-semibold text-[#f0ede8]">{step.title}</h3>
              </div>
              <div className="flex flex-wrap gap-1.5 mb-4">
                {step.tools.map((tool) => (
                  <ToolChip key={tool.name} {...tool} />
                ))}
              </div>
              {step.body}
            </div>
          </LiquidCard>
        ))}
      </SectionReveal>

      {/* Zone vidéo */}
      <div className="mt-10 pt-8 border-t border-white/5">
        <p className="text-[11px] uppercase tracking-[0.2em] text-white/40 font-semibold mb-4">
          Vidéo liée à cette section
        </p>
        <Link
          href="/videos#fondations"
          className="inline-flex items-center gap-3 group"
        >
          <div className="w-10 h-10 bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-[#e8d5b0]/30 group-hover:shadow-[0_0_20px_rgba(232,213,176,0.15)] transition-all duration-300">
            <Play className="w-4 h-4 text-[#e8d5b0]" />
          </div>
          <div>
            <p className="text-[15px] font-medium text-[#f0ede8] group-hover:text-[#e8d5b0] transition-colors duration-300">
              Voir la vidéo
            </p>
            <p className="text-[13px] text-white/40">Accéder à la bibliothèque →</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
