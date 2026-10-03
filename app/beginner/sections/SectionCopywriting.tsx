import Image from "next/image";
import { FoundationChapter } from "../FoundationChapter";
import { FoundationEditorialNote } from "../FoundationEditorialNote";

const MESSAGE_PARTS = [
  ["Le moment", "Ce qui vient juste d'arriver. Par exemple : une demande de devis arrive pendant que l'équipe est sur un chantier."],
  ["Le vrai problème", "Ce qui rend ce moment pénible ou coûteux. Par exemple : les informations restent dans plusieurs téléphones et personne ne sait qui doit rappeler."],
  ["Le progrès", "Ce qui devient plus simple. Par exemple : voir les demandes au même endroit et savoir laquelle traiter ensuite."],
  ["Ce qui le permet", "Le geste ou le système qui fait avancer les choses. Pas un nom magique, juste ce qui change dans le travail."],
  ["La prochaine étape", "Ce que la personne peut faire maintenant : répondre, regarder un exemple, demander un devis ou dire que ce n'est pas pour elle."],
] as const;

const MOMENTS = [
  ["Elle découvre le problème", "Aide-la à reconnaître la scène. Ne lui parle pas encore comme si elle connaissait déjà ta méthode."],
  ["Elle sait que cela bloque", "Montre simplement pourquoi le blocage revient et ce qui peut changer."],
  ["Elle compare", "Explique ce que tu fais, ce que cela demande d'elle et ce que cela ne règle pas."],
  ["Elle est prête à avancer", "Dis ce qui se passe après le clic, l'appel ou le paiement. Rien de plus."],
] as const;

const PROOF_QUESTIONS = [
  ["Est-ce que cela ressemble à mon cas ?", "Montre une scène, un exemple ou un livrable qui ressemble vraiment à son travail."],
  ["Est-ce que vous savez le faire ?", "Montre un processus, une démonstration ou un élément vérifiable. Pas seulement un beau logo."],
  ["Est-ce que cela vaut le coup pour moi ?", "Explique le périmètre, l'effort demandé, le prix quand il est décidé et la limite qui reste."],
] as const;

function ToolMark({ name, src }: { name: string; src: string }) {
  return (
    <span className="inline-flex items-center gap-2 text-sm text-white/70">
      <Image src={src} alt="" aria-hidden="true" width={24} height={24} className="h-6 w-6 object-contain" loading="lazy" />
      {name}
    </span>
  );
}

export function SectionCopywriting() {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 motion-reduce:animate-none">
      <div className="mb-8 flex items-center gap-3">
        <span className="text-xs font-semibold uppercase tracking-widest text-[#e8d5b0]/60">03</span>
        <h2 className="text-2xl font-semibold tracking-tight text-[#f0ede8] md:text-3xl">Écrire pour que la bonne personne comprenne et réponde</h2>
      </div>
      <p className="mb-10 max-w-3xl text-base leading-relaxed text-white/60">
        Le copywriting, c'est expliquer une offre avec des mots simples. La personne doit voir sa situation, comprendre ce qui peut changer et savoir quoi faire ensuite. Ce n'est pas faire joli. Ce n'est pas parler plus fort. C'est rendre une décision facile à comprendre.
      </p>

      <FoundationChapter eyebrow="Chapitre 1" title="Commence par une scène que l'on peut voir">
        <p>
          Avant d'écrire un titre, raconte ce qui se passe dans la vraie vie. Imagine un mardi matin. Qui fait quoi ? Qu'est-ce qui coince ? Qu'est-ce qui devrait être plus simple après ? Si tu ne peux pas raconter la scène à un enfant de 10 ans, ta phrase est encore trop floue.
        </p>
        <div className="divide-y divide-white/10 border-y border-white/10">
          {MESSAGE_PARTS.map(([label, description], index) => (
            <div key={label} className="grid gap-3 py-4 sm:grid-cols-[2rem_10rem_1fr] sm:items-start">
              <span className="font-mono text-xs text-[#e8d5b0]/60">{index + 1})</span>
              <strong className="text-sm text-[#f0ede8]">{label}</strong>
              <p className="text-sm leading-relaxed text-white/60">{description}</p>
            </div>
          ))}
        </div>
        <FoundationEditorialNote label="La règle simple">
          Écris d'abord ce que la personne vit aujourd'hui. Ensuite seulement, parle de ton outil, de ta méthode ou de ton offre.
        </FoundationEditorialNote>
      </FoundationChapter>

      <FoundationChapter eyebrow="Chapitre 2" title="Remplace les phrases floues par des phrases que l'on comprend tout de suite">
        <p>
          Une phrase utile ne cherche pas à impressionner. Elle montre un moment, le blocage et le changement attendu. Le lecteur doit pouvoir se dire : « Oui, c'est exactement ça », ou « Non, ce n'est pas mon cas ».
        </p>
        <div className="grid gap-8 border-y border-white/10 py-6 md:grid-cols-2">
          <div>
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/45">Trop flou</p>
            <p className="text-lg leading-relaxed text-white/55">« Nous aidons les entreprises à gagner du temps grâce à l'IA. »</p>
            <p className="mt-4 text-sm leading-relaxed text-white/40">On ne sait pas qui perd du temps, sur quoi, ni ce qui change vraiment.</p>
          </div>
          <div className="border-t border-[#e8d5b0]/30 pt-5 md:border-t-0 md:border-l md:pl-8">
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#e8d5b0]/70">On comprend la scène</p>
            <p className="text-lg leading-relaxed text-[#f0ede8]">« Une demande de devis arrive par téléphone, puis les photos arrivent sur WhatsApp. On les range au même endroit pour savoir qui répond et quand. »</p>
            <p className="mt-4 text-sm leading-relaxed text-white/50">On voit le problème, le geste qui change le travail et le résultat attendu. Il reste à vérifier que ce cas existe vraiment chez les personnes visées.</p>
          </div>
        </div>
      </FoundationChapter>

      <FoundationChapter eyebrow="Chapitre 3" title="Le même message ne convient pas à tout le monde">
        <p>
          Une personne qui découvre son problème n'a pas besoin du même texte qu'une personne qui compare déjà deux offres. Ne force pas la même page, le même email ou le même script partout.
        </p>
        <div className="divide-y divide-white/10 border-y border-white/10">
          {MOMENTS.map(([label, description], index) => (
            <div key={label} className="grid gap-3 py-4 sm:grid-cols-[2rem_12rem_1fr] sm:items-start">
              <span className="font-mono text-xs text-[#e8d5b0]/60">{index + 1})</span>
              <strong className="text-sm text-[#f0ede8]">{label}</strong>
              <p className="text-sm leading-relaxed text-white/60">{description}</p>
            </div>
          ))}
        </div>
      </FoundationChapter>

      <FoundationChapter eyebrow="Chapitre 4" title="Explique ce qui change dans le travail">
        <p>
          Les mots comme « automatiser », « optimiser » ou « transformer » cachent souvent la question importante : qu'est-ce que la personne fera autrement demain ? Décris les gestes, les documents, les messages ou les décisions qui changent.
        </p>
        <div className="grid gap-6 border-y border-white/10 py-6 md:grid-cols-2">
          <div className="border-t border-white/10 pt-4">
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/45">Promesse qui reste vague</p>
            <p className="text-sm leading-relaxed text-white/55">« Un flux intelligent qui garde vos décisions et vos preuves. »</p>
          </div>
          <div className="border-t border-[#e8d5b0]/30 pt-4">
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#e8d5b0]/70">Explication que l'on peut vérifier</p>
            <p className="text-sm leading-relaxed text-white/75">« Après chaque appel, la demande est rangée avec la prochaine action. L'équipe voit ce qui doit être fait sans relire toutes les conversations. »</p>
          </div>
        </div>
        <FoundationEditorialNote label="Pas de mot magique">
          Si tu ne peux pas montrer le geste qui produit le progrès, ne donne pas encore de grand nom à ta méthode.
        </FoundationEditorialNote>
      </FoundationChapter>

      <FoundationChapter eyebrow="Chapitre 5" title="La preuve répond à une vraie question">
        <p>
          Une preuve n'est pas là pour faire sérieux. Elle répond à une inquiétude précise. Avant d'ajouter un logo, un chiffre ou un témoignage, demande-toi ce que la personne essaie de vérifier.
        </p>
        <div className="divide-y divide-white/10 border-y border-white/10">
          {PROOF_QUESTIONS.map(([question, answer], index) => (
            <div key={question} className="grid gap-3 py-4 sm:grid-cols-[2rem_15rem_1fr] sm:items-start">
              <span className="font-mono text-xs text-[#e8d5b0]/60">{index + 1})</span>
              <strong className="text-sm text-[#e8d5b0]">{question}</strong>
              <p className="text-sm leading-relaxed text-white/60">{answer}</p>
            </div>
          ))}
        </div>
        <p className="text-sm leading-relaxed text-white/45">
          Si tu cites un résultat, garde la date, le contexte, la méthode et la limite. Un résultat obtenu dans un cas ne devient pas une promesse pour tout le monde.
        </p>
      </FoundationChapter>

      <FoundationChapter eyebrow="Chapitre 6" title="Le premier message cherche une réponse, pas une vente">
        <p>
          Au début, tu ne sais pas encore si la personne vit vraiment le problème. Le bon premier message ouvre une conversation courte et donne une sortie facile. Il ne balance pas un lien, un long pitch et une urgence inventée.
        </p>
        <div className="border-y border-white/10 py-6">
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#e8d5b0]/70">Exemple simple</p>
          <p className="max-w-2xl text-lg leading-relaxed text-[#f0ede8]">« Bonjour l'équipe Martin. Quand une demande de devis arrive par téléphone puis sur WhatsApp, comment vous évitez qu'elle soit oubliée ? »</p>
        </div>
        <FoundationEditorialNote label="Ce que tu attends">
          Une réponse honnête. Si le problème n'existe pas, remercie et arrête. S'il existe, tu peux poser une question de plus ou proposer un exemple adapté.
        </FoundationEditorialNote>
      </FoundationChapter>

      <FoundationChapter eyebrow="Chapitre 7" title="L'IA peut t'aider à écrire, pas inventer à ta place">
        <p>
          Une IA peut raccourcir, organiser ou proposer plusieurs versions. Elle ne sait pas ce que tes clients vivent si tu ne lui donnes pas la scène, les mots entendus, les preuves autorisées et les limites de l'offre.
        </p>
        <div className="flex flex-wrap gap-x-7 gap-y-4 border-y border-white/10 py-5">
          <ToolMark name="Hermes Agent" src="/brand-logos/hermes-agent-mark.png" />
          <ToolMark name="ChatGPT" src="/brand-logos/chatgpt.svg" />
          <ToolMark name="Claude" src="/brand-logos/claude.svg" />
        </div>
        <pre className="overflow-x-auto whitespace-pre-wrap break-words border-y border-white/10 py-5 font-mono text-xs leading-6 text-[#e8d5b0]">{`Je veux écrire un message pour une personne qui vit cette scène : [décris-la].
Le problème qu'elle a déjà dit : [mots réels].
Ce que je peux vraiment lui proposer : [livrable ou prochaine étape].
Voici ma preuve autorisée : [exemple, démonstration ou rien].
Écris trois versions simples. N'invente ni chiffre, ni urgence, ni témoignage, ni résultat.`}</pre>
      </FoundationChapter>

      <FoundationEditorialNote label="Avant d'envoyer" className="mt-14 mb-4">
        Raconte la scène à voix haute. Si on ne comprend pas qui fait quoi, ce qui bloque et ce qui change, recommence avec des mots plus simples.
      </FoundationEditorialNote>
    </div>
  );
}
