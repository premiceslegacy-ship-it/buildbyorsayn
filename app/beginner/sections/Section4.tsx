export function Section4() {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-3 mb-8">
        <span className="text-xs font-semibold text-[#e8d5b0]/60 uppercase tracking-widest">04</span>
        <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-[#f0ede8]">Le flow : de l'idée à l'URL en ligne</h2>
      </div>
      <div className="bg-[#e8d5b0]/5 border border-[#e8d5b0]/15 rounded-2xl px-6 py-4 mb-10">
        <p className="text-sm text-[#e8d5b0]/80">
          C'est la section la plus concrète. À la fin, tu sais mettre un site en ligne, même si tu n'as jamais codé. On va y aller étape par étape.
        </p>
      </div>

      <div className="space-y-6">
        {/* Étape 1 */}
        <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-6 md:p-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-7 h-7 rounded-full bg-[#e8d5b0]/10 border border-[#e8d5b0]/20 flex items-center justify-center text-xs font-bold text-[#e8d5b0]">1</span>
            <h3 className="text-base font-semibold text-[#f0ede8]">Génération no-code : le brouillon</h3>
          </div>
          <p className="text-sm text-white/55 leading-relaxed mb-4">
            Avant de toucher un éditeur de code, je crée un premier jet visuel. J'utilise des outils comme <strong className="text-white">Lovable, Bolt.new ou AI Studio</strong>.
          </p>
          <ul className="space-y-3 mb-4 text-sm text-white/55 leading-relaxed">
            <li>• Je décris mon projet (en lui donnant le brief et le style trouvés sur Pinterest).</li>
            <li>• L'outil génère une première version interactive.</li>
            <li>• Ça permet de valider la structure globale avant d'investir des heures de travail.</li>
          </ul>
          <div className="bg-black/20 border border-white/5 rounded-xl p-4">
            <p className="text-[11px] font-semibold text-white/30 uppercase tracking-widest mb-2">La limite du no-code</p>
            <p className="text-xs text-white/45 leading-relaxed">
              Dès que tu veux des comptes utilisateurs, des paiements Stripe, une vraie base de données, ces outils bloquent. C'est à ce moment-là qu'il faut passer sur ton propre ordinateur, dans un vrai éditeur (IDE).
            </p>
          </div>
        </div>

        {/* Étape 2 */}
        <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-6 md:p-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-7 h-7 rounded-full bg-[#e8d5b0]/10 border border-[#e8d5b0]/20 flex items-center justify-center text-xs font-bold text-[#e8d5b0]">2</span>
            <h3 className="text-base font-semibold text-[#f0ede8]">Le cloud de ton code : GitHub</h3>
          </div>
          <p className="text-sm text-white/55 leading-relaxed mb-4">
            Une fois le premier jet généré, il faut "sauvegarder" ce code de manière sécurisée. On utilise <strong>GitHub</strong>. C'est le Google Drive du code.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              ["Pourquoi GitHub ?", "Parce que si ton ordinateur casse, ton projet n'est pas perdu. Et parce que c'est là que l'hébergeur viendra lire ton code pour le mettre en ligne."],
              ["Les 'commits'", "Sur GitHub, on ne sauvegarde pas juste une fois. Chaque 'commit' est un point de sauvegarde. Tu peux retourner dans le passé à tout moment."],
            ].map(([title, desc]) => (
              <div key={title} className="bg-black/20 border border-white/5 rounded-xl p-3">
                <p className="text-xs font-semibold text-[#e8d5b0] mb-1">{title}</p>
                <p className="text-xs text-white/40 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Étape 3 */}
        <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-6 md:p-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-7 h-7 rounded-full bg-[#e8d5b0]/10 border border-[#e8d5b0]/20 flex items-center justify-center text-xs font-bold text-[#e8d5b0]">3</span>
            <h3 className="text-base font-semibold text-[#f0ede8]">L'éditeur (IDE) et tes variables secrètes</h3>
          </div>
          <p className="text-sm text-white/55 leading-relaxed mb-4">
            Maintenant, on "clone" (télécharge) ce code sur notre ordinateur dans un IDE (comme <strong>Cursor</strong> ou <strong>Antigravity</strong>). C'est là que la vraie IA de codage entre en jeu pour ajouter les fonctionnalités complexes.
          </p>
          <div className="bg-emerald-500/5 border border-emerald-500/15 rounded-xl p-4 mb-6">
            <p className="text-[11px] font-semibold text-emerald-400/80 uppercase tracking-widest mb-2">Les 3 commandes magiques à taper</p>
            <p className="text-xs text-emerald-400/60 leading-relaxed mb-2">Quand tu finis un changement dans l'IDE, tu tapes ça dans le "terminal" (la petite fenêtre noire en bas) pour l'envoyer sur GitHub :</p>
            <div className="font-mono text-xs text-[#e8d5b0] space-y-1">
              <p><span className="text-white/30">1. Prépare les fichiers : </span> git add .</p>
              <p><span className="text-white/30">2. Nomme la sauvegarde : </span> git commit -m "j'ajoute le prix"</p>
              <p><span className="text-white/30">3. Envoie sur internet : </span> git push</p>
            </div>
          </div>
          <div className="bg-red-500/5 border border-red-500/15 rounded-xl p-4">
            <p className="text-[11px] font-semibold text-red-500/80 uppercase tracking-widest mb-2">Sécurité : Le danger mortel des clés API</p>
            <p className="text-xs text-white/55 leading-relaxed">
              Les mots de passe (Stripe, base de données) ne s'écrivent <strong>JAMAIS</strong> dans le code. Sinon les hackers les trouveront sur GitHub. Tu crées un fichier nommé <code className="text-[#f87171] bg-red-500/10 px-1 rounded">.env.local</code> et tu mets tes secrets dedans. L'IDE sait qu'il ne doit jamais envoyer ce fichier sur GitHub.
            </p>
          </div>
        </div>

        {/* Étape 4 */}
        <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-6 md:p-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-7 h-7 rounded-full bg-[#e8d5b0]/10 border border-[#e8d5b0]/20 flex items-center justify-center text-xs font-bold text-[#e8d5b0]">4</span>
            <h3 className="text-base font-semibold text-[#f0ede8]">La mise en ligne avec Vercel</h3>
          </div>
          <p className="text-sm text-white/55 leading-relaxed mb-4">
            <strong>Vercel</strong>, c'est l'hébergeur magique. C'est lui qui transforme ton code en un vrai site accessible au monde entier.
          </p>
          <ul className="space-y-4 mb-4 text-sm text-white/55 leading-relaxed">
            <li className="flex gap-2"><span className="text-[#e8d5b0]">•</span><strong>Connexion :</strong> Crée un compte Vercel, clique sur "Importer", et lie-le à ton GitHub.</li>
            <li className="flex gap-2"><span className="text-[#e8d5b0]">•</span><strong>Déploiement auto :</strong> À chaque fois que tu fais un <code>git push</code> (la fameuse commande 3), Vercel capte le changement automatiquement et met ton site à jour en 60 secondes.</li>
            <li className="flex gap-2"><span className="text-[#e8d5b0]">•</span><strong>Variables d'environnement :</strong> Puisque Vercel n'a pas accès à ton fichier <code>.env.local</code> (pour la sécurité), tu dois aller dans les paramètres de Vercel (onglet "Environment Variables") pour lui dicter tes mots de passe Stripe/DB.</li>
          </ul>
          <p className="text-sm text-white/55 leading-relaxed font-medium">
            Pas de serveurs compliqués, pas de transferts manuels. Code, push, en ligne.
          </p>
        </div>
      </div>
    </div>
  );
}
