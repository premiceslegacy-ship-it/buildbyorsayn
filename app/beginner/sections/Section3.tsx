export function Section3() {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-3 mb-8">
        <span className="text-xs font-semibold text-[#e8d5b0]/60 uppercase tracking-widest">08</span>
        <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-[#f0ede8]">Générer des visuels pro</h2>
      </div>
      <p className="text-white/60 text-base leading-relaxed mb-10">
        Cette section sert surtout à construire de meilleurs sites web : landing pages, sites vitrines, pages d'offre, portfolios ou pages produit. L'objectif n'est pas de générer de jolies images au hasard, mais de créer une direction visuelle cohérente avec le message, la conversion et le design system.
      </p>

      {/* Le danger de l'AI Slop */}
      <div className="bg-red-500/5 border border-red-500/15 rounded-2xl p-6 md:p-8 mb-6">
        <h3 className="text-base font-semibold text-red-400 mb-4">Éviter le "AI Slop"</h3>
        <p className="text-sm text-white/60 leading-relaxed mb-4">
          Le "AI slop", c'est ce rendu générique, lisse, sur-saturé et artificiel que produisent les IA par défaut. Un utilisateur le repère en une fraction de seconde, et ça détruit instantanément la crédibilité de ton site.
        </p>
        <p className="text-sm text-white/60 leading-relaxed">
          La solution ? <strong className="text-white">Le contexte visuel.</strong> Ne demande jamais à une IA de "faire un beau design". Va d'abord sur Pinterest, Dribbble ou Awwwards. Prends des captures d'écran des sites, des couleurs, des typos, des ambiances photographiques qui te plaisent. C'est exactement la logique d'ORACLE Site Web : définir le brief, le message, la direction artistique et le design system avant de générer.
        </p>
      </div>

      {/* Outils */}
      <div className="mb-8">
        <h3 className="text-base font-semibold text-[#f0ede8] mb-6">Les outils et leurs usages</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              name: "Nano Banana",
              desc: "Mon outil de prédilection pour créer des ambiances qui s'intègrent parfaitement à ton design, sans passer des heures sur Photoshop.",
            },
            {
              name: "GPT IMAGE 2.0",
              desc: "Très utile pour produire des visuels propres à partir d'un brief précis : images de hero, variations d'ambiance, assets éditoriaux et éléments cohérents avec une page web.",
            },
            {
              name: "Kling",
              desc: "Ton moteur pour la vidéo. Au lieu d'un site statique, Kling te donne le pouvoir d'animer tes produits ou de créer de courtes séquences immersives.",
            },
            {
              name: "Midjourney",
              desc: "Particulièrement impressionnant pour des portraits très poussés. Maîtrise totale de la cohérence visuelle et du photoréalisme.",
            },
            {
              name: "Higgsfield",
              desc: "Un 'wrapper d'IA' regroupant tout un tas d'outils au même endroit. Confort absolu pour centraliser ta création visuelle. (faut du budget)",
            },
          ].map(({ name, desc }) => (
            <div key={name} className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-5">
              <span className="text-sm font-semibold text-[#f0ede8] block mb-2">{name}</span>
              <p className="text-xs text-white/50 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Penser comme un photographe */}
      <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-6 md:p-8 mb-6">
        <h3 className="text-base font-semibold text-[#f0ede8] mb-4">Penser comme un photographe</h3>
        <p className="text-sm text-white/55 leading-relaxed mb-6">
          Un prompt image se construit comme un brief photo. Ne décris pas ce que tu veux voir, décris <em>comment</em> tu veux le capturer.
        </p>
        <div className="grid grid-cols-2 gap-3 mb-6">
          {[
            { el: "Sujet", ex: "Un homme d'affaires en costume gris." },
            { el: "Style", ex: "Éditorial, commercial, lifestyle." },
            { el: "Lumière", ex: "Directionnelle, naturelle basse." },
            { el: "Couleurs", ex: "Palette désaturée, bleutée." },
          ].map(({ el, ex }) => (
            <div key={el} className="bg-black/20 border border-white/5 rounded-xl p-3">
              <p className="text-xs font-semibold text-[#e8d5b0] mb-1.5">{el}</p>
              <p className="text-[11px] text-white/40 leading-relaxed">{ex}</p>
            </div>
          ))}
        </div>
        <div className="bg-black/30 border border-white/5 rounded-xl p-4">
          <p className="text-xs text-[#e8d5b0]/70 font-mono leading-relaxed">
            "Commercial product photography of a minimalist ceramic mug, matte black. Shot with 50mm, f/2.8, soft side lighting..."
          </p>
        </div>
      </div>

      {/* Cohérence visuelle */}
      <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-6 md:p-8">
        <h3 className="text-base font-semibold text-[#f0ede8] mb-4">La règle de la cohérence visuelle</h3>
        <p className="text-sm text-white/55 leading-relaxed mb-4">
          Avant de générer la moindre image, définis le style de ton site dans un fichier <code className="text-[#e8d5b0] bg-white/5 px-1.5 py-0.5 rounded text-[11px] font-mono">DESIGN-SYSTEM.md</code>.
        </p>
        <ul className="space-y-3">
          {[
            "Décide d'un style et tiens-t'y (ex: \"Photographie commerciale, tons chauds\" ou \"Illustration flat\").",
            "Conserve les paramètres (objectif, colorimétrie) d'un prompt réussi pour les suivants.",
            "N'utilise qu'un seul modèle IA pour le même projet (Midjourney a son grain, Kling a le sien).",
          ].map((text, i) => (
            <li key={i} className="flex gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[#e8d5b0]/50 flex-shrink-0 mt-2" />
              <p className="text-sm text-white/60 leading-relaxed">{text}</p>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-6 bg-[#e8d5b0]/5 border border-[#e8d5b0]/15 rounded-2xl p-6 md:p-8">
        <h3 className="text-base font-semibold text-[#f0ede8] mb-4">Le niveau au-dessus : ux-ui-design</h3>
        <p className="text-sm text-white/55 leading-relaxed mb-4">
          Dans le système complet, j'utilise un skill dédié à l'UX/UI. Il ne se contente pas de dire "fais un beau site" : il force une direction artistique, un BRAND-SYSTEM, un DESIGN-SYSTEM, des règles de copywriting, des quality gates et des prompts visuels précis.
        </p>
        <p className="text-sm text-white/55 leading-relaxed">
          C'est ce qui crée l'écart entre une page correcte générée par IA et un site qui ressemble à un vrai produit : cohérent, premium, lisible, mobile first et pensé pour convertir.
        </p>
      </div>
    </div>
  );
}
