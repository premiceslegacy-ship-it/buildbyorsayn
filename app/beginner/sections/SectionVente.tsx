export function SectionVente() {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-3 mb-8">
        <span className="text-xs font-semibold text-[#e8d5b0]/60 uppercase tracking-widest">04</span>
        <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-[#f0ede8]">Vendre, c'est de la psychologie appliquée</h2>
      </div>
      <p className="text-white/60 text-base leading-relaxed mb-10">
        La vente fait peur parce qu'on l'imagine comme du baratin de marchand de tapis. C'est l'inverse. Bien vendre, c'est comprendre quelqu'un mieux qu'il ne se comprend, puis lui montrer le bon chemin. C'est la compétence qui te fait gagner ta vie, peu importe le produit.
      </p>

      {/* Position médecin */}
      <div className="bg-gradient-to-b from-white/[0.05] to-white/[0.02] border border-white/[0.07] border-t-white/10 rounded-2xl p-6 md:p-8 mb-6 shadow-[0_4px_24px_rgba(0,0,0,0.4)]">
        <h3 className="text-base font-semibold text-[#f0ede8] mb-4">Prends la position du médecin</h3>
        <p className="text-sm text-white/55 leading-relaxed mb-4">
          Un bon médecin ne te vend pas un médicament dès que tu entres. Il pose des questions, il écoute, il diagnostique. Ensuite il prescrit, et tu lui fais confiance. Fais pareil. Tu n'es pas un vendeur qui supplie. Tu es un expert qui diagnostique un problème.
        </p>
        <p className="text-sm text-white/55 leading-relaxed">
          <strong className="text-[#f0ede8]">Pose des questions ouvertes, écoute deux fois plus que tu ne parles.</strong> Plus le client se livre, plus tu comprends sa vraie douleur, et plus ta proposition tombe juste. Ta posture et ta voix doivent rester calmes et posées. La personne la plus sereine dans la conversation est celle qui mène.
        </p>
      </div>

      {/* Le déroulé */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {[
          {
            t: "Comprendre en profondeur",
            d: "Avant de parler de ton offre, creuse. Depuis quand le problème existe ? Combien il lui coûte en temps, en argent, en stress ? Qu'a-t-il déjà essayé ? Tu ne peux pas vendre une solution à un problème que tu n'as pas compris à fond.",
          },
          {
            t: "Mettre face aux contradictions",
            d: "Avec tact, fais ressortir l'écart entre ce que le client dit vouloir et ce qu'il fait. \"Vous dites que c'est urgent, mais vous repoussez depuis six mois.\" Sans agresser. Juste pour qu'il prenne conscience lui-même qu'il est temps d'agir.",
          },
          {
            t: "Défendre le prix par la valeur",
            d: "On ne baisse pas le prix dès qu'on hésite. On rappelle ce que le problème lui coûte aujourd'hui, et ce que la solution lui rapporte. Si la valeur est claire, le prix paraît petit. La remise est un aveu que tu n'as pas montré la valeur.",
          },
          {
            t: "Les mêmes leviers de persuasion",
            d: "La preuve sociale, la rareté, l'autorité fonctionnent aussi à l'oral. Un client rassuré par tes résultats et conscient qu'il ne peut pas attendre éternellement décide plus vite et plus sereinement.",
          },
        ].map(({ t, d }) => (
          <div key={t} className="bg-gradient-to-b from-white/[0.05] to-white/[0.02] border border-white/[0.07] border-t-white/10 rounded-2xl p-5 shadow-[0_4px_24px_rgba(0,0,0,0.4)]">
            <p className="text-sm font-semibold text-[#e8d5b0] mb-3">{t}</p>
            <p className="text-xs text-white/55 leading-relaxed">{d}</p>
          </div>
        ))}
      </div>

      <div className="bg-[#e8d5b0]/5 border border-[#e8d5b0]/15 rounded-2xl px-6 py-5">
        <p className="text-sm text-[#e8d5b0]/85 leading-relaxed">
          Vendre, c'est écouter, diagnostiquer, puis prescrire. Pose plus de questions que tu ne fais de promesses. Le calme et la compréhension vendent mieux que la pression.
        </p>
      </div>
    </div>
  );
}
