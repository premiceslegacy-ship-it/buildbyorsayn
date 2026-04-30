import { Play } from "lucide-react";
import Link from "next/link";

const STEPS = [
  {
    num: 1,
    title: "Génération no-code : le brouillon",
    body: (
      <>
        <p className="text-sm text-white/55 leading-relaxed mb-4">
          Avant de toucher un éditeur de code, je crée un premier jet visuel. J'utilise des outils comme <strong className="text-white">Lovable, Bolt.new ou AI Studio</strong>.
        </p>
        <ul className="space-y-2 mb-4 text-sm text-white/55 leading-relaxed">
          <li>• Je décris mon projet (en lui donnant le brief et le style trouvés sur Pinterest).</li>
          <li>• L'outil génère une première version interactive.</li>
          <li>• Ça permet de valider la structure globale avant d'investir des heures de travail.</li>
        </ul>
        <div className="bg-black/20 border border-white/5 rounded-xl p-4 mt-auto">
          <p className="text-[11px] font-semibold text-white/30 uppercase tracking-widest mb-2">La limite du no-code</p>
          <p className="text-xs text-white/45 leading-relaxed">
            Dès que tu veux des comptes utilisateurs, des paiements en ligne, une vraie base de données, ces outils bloquent. C'est là qu'on passe à un vrai éditeur (IDE).
          </p>
        </div>
      </>
    ),
  },
  {
    num: 2,
    title: "Le cloud de ton code : GitHub",
    body: (
      <>
        <p className="text-sm text-white/55 leading-relaxed mb-4">
          Une fois le premier jet généré, il faut "sauvegarder" ce code de manière sécurisée. On utilise <strong className="text-white">GitHub</strong>. C'est le Google Drive du code.
        </p>
        <div className="space-y-3 mt-auto">
          {[
            ["Pourquoi GitHub ?", "Si ton ordinateur casse, ton projet n'est pas perdu. Et c'est là que l'hébergeur viendra lire ton code pour le mettre en ligne."],
            ["Les 'commits'", "Chaque commit est un point de sauvegarde. Tu peux retourner dans le passé à tout moment."],
          ].map(([title, desc]) => (
            <div key={title} className="bg-black/20 border border-white/5 rounded-xl p-3">
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
    body: (
      <>
        <p className="text-sm text-white/55 leading-relaxed mb-4">
          On "clone" (télécharge) le code sur notre ordinateur dans un IDE comme <strong className="text-white">Cursor</strong> ou <strong className="text-white">Antigravity</strong>. C'est là que la vraie IA de codage entre en jeu.
        </p>
        <div className="bg-emerald-500/5 border border-emerald-500/15 rounded-xl p-4 mb-3">
          <p className="text-[11px] font-semibold text-emerald-400/80 uppercase tracking-widest mb-2">Les 3 commandes</p>
          <div className="font-mono text-xs text-[#e8d5b0] space-y-1">
            <p><span className="text-white/30">1. </span>git add .</p>
            <p><span className="text-white/30">2. </span>git commit -m "..."</p>
            <p><span className="text-white/30">3. </span>git push</p>
          </div>
        </div>
        <div className="bg-red-500/5 border border-red-500/15 rounded-xl p-4 mt-auto">
          <p className="text-[11px] font-semibold text-red-500/80 uppercase tracking-widest mb-1">Danger : les clés API</p>
          <p className="text-xs text-white/55 leading-relaxed">
            Les mots de passe ne s'écrivent <strong>JAMAIS</strong> dans le code. Mets-les dans un fichier <code className="text-[#f87171] bg-red-500/10 px-1 rounded">.env.local</code>.
          </p>
        </div>
      </>
    ),
  },
  {
    num: 4,
    title: "La mise en ligne avec Vercel",
    body: (
      <>
        <p className="text-sm text-white/55 leading-relaxed mb-4">
          <strong className="text-white">Vercel</strong>, c'est l'hébergeur magique. Il transforme ton code en un vrai site accessible partout dans le monde.
        </p>
        <ul className="space-y-3 text-sm text-white/55 leading-relaxed mt-auto">
          <li className="flex gap-2"><span className="text-[#e8d5b0] flex-shrink-0">•</span><span><strong className="text-white/80">Connexion :</strong> Crée un compte Vercel, clique sur "Importer", lie-le à ton GitHub.</span></li>
          <li className="flex gap-2"><span className="text-[#e8d5b0] flex-shrink-0">•</span><span><strong className="text-white/80">Déploiement auto :</strong> À chaque <code>git push</code>, Vercel met ton site à jour en 60 secondes.</span></li>
          <li className="flex gap-2"><span className="text-[#e8d5b0] flex-shrink-0">•</span><span><strong className="text-white/80">Variables :</strong> Configure tes secrets dans les paramètres Vercel → "Environment Variables".</span></li>
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
        <span className="text-xs font-semibold text-[#e8d5b0]/60 uppercase tracking-widest">04</span>
        <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-[#f0ede8]">Le flow : de l'idée à l'URL en ligne</h2>
      </div>

      <div className="bg-[#e8d5b0]/5 border border-[#e8d5b0]/15 rounded-2xl px-6 py-4 mb-10">
        <p className="text-sm text-[#e8d5b0]/80">
          C'est la section la plus concrète. À la fin, tu sais mettre un site en ligne, même si tu n'as jamais codé.
        </p>
      </div>

      {/* Grille 2x2 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {STEPS.map((step) => (
          <div
            key={step.num}
            className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-6 flex flex-col"
          >
            <div className="flex items-center gap-3 mb-4">
              <span className="w-7 h-7 rounded-full bg-[#e8d5b0]/10 border border-[#e8d5b0]/20 flex items-center justify-center text-xs font-bold text-[#e8d5b0] flex-shrink-0">
                {step.num}
              </span>
              <h3 className="text-base font-semibold text-[#f0ede8]">{step.title}</h3>
            </div>
            {step.body}
          </div>
        ))}
      </div>

      {/* Zone vidéo */}
      <div className="mt-10 pt-8 border-t border-white/5">
        <p className="text-[11px] uppercase tracking-[0.2em] text-white/40 font-semibold mb-4">
          Vidéo liée à cette section
        </p>
        <Link
          href="/videos#fondations"
          className="inline-flex items-center gap-3 group"
        >
          <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-[#e8d5b0]/30 group-hover:shadow-[0_0_20px_rgba(232,213,176,0.15)] transition-all duration-300">
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
