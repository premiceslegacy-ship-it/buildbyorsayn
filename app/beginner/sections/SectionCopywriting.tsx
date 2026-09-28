import Image from "next/image";
import { SectionReveal } from "@/components/ui/section-reveal";
import { FoundationChapter } from "../FoundationChapter";

const DECISION_FIELDS = [
  ["Situation", "Qu'est-ce qui rend le problème important maintenant ?", "Un échange, une demande, une observation ou une donnée datée."],
  ["Travail à accomplir", "Quel progrès la personne cherche-t-elle réellement ?", "Une formulation confirmée par plusieurs signaux comparables."],
  ["Friction", "Qu'est-ce qui bloque aujourd'hui et quelle alternative existe déjà ?", "Un exemple concret, sans inventer une peur ou une cause."],
  ["Risque", "Qu'est-ce qu'elle veut éviter avant de s'engager ?", "Une objection explicite, une contrainte ou une limite de capacité."],
  ["Preuve", "Pourquoi cette prochaine étape paraît-elle raisonnable ?", "Un artefact, une méthode, un cas autorisé ou un résultat vérifiable."],
  ["Non-adéquation", "Quand l'offre ne convient-elle pas ?", "Une condition claire qui permet de qualifier ou de refuser proprement."],
] as const;

const DECISION_LEVELS = [
  ["Contexte inconnu", "Une scène métier précise et une question légère. Pas de profilage, pas d'inférence personnelle."],
  ["Problème reconnu", "Un diagnostic de la friction, puis une piste pour vérifier si elle correspond vraiment au cas."],
  ["Approches connues", "Des critères de comparaison, un mécanisme compréhensible et des limites visibles."],
  ["Offre connue", "Le périmètre, les conditions, les responsabilités, le prix et les alternatives sans zone floue."],
  ["Relation établie", "Une proposition de prochaine étape adaptée à la situation, avec consentement et possibilité de dire non."],
] as const;

const PROOF_TYPES = [
  ["Pertinence", "Un cas dont la situation ressemble réellement à celle du lecteur."],
  ["Capacité", "Un artefact ou une démonstration qui montre ce qui a été fait, pas seulement une promesse."],
  ["Résultat", "Une mesure avec sa période, sa population, sa méthode, son périmètre et sa limite."],
  ["Confiance", "Un retour autorisé et contextualisé, sans le transformer en résultat typique."],
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
        <h2 className="text-2xl font-semibold tracking-tight text-[#f0ede8] md:text-3xl">Écrire pour être compris et faire agir</h2>
      </div>
      <p className="mb-10 max-w-3xl text-base leading-relaxed text-white/60">
        Le copywriting ne consiste pas à remplir une page avec des phrases séduisantes. Il consiste à rendre une décision plus compréhensible pour une personne précise, dans une situation précise, avec une promesse, un mécanisme, une preuve et une limite que l'on peut expliquer. Le mot d'ordre est simple : la clarté avant l'intensité.
      </p>

      <FoundationChapter eyebrow="Chapitre 1" title="Le copy commence avant la phrase">
        <p>
          Avant de demander un titre à une IA, écris le chemin de décision. Qui lit ? Que comprend cette personne déjà ? Quel problème essaie-t-elle de résoudre ? Que fait-elle aujourd'hui à la place ? Quelle action doit-elle pouvoir prendre après la lecture ? Si tu ne peux pas répondre, le problème n'est pas encore un problème de style.
        </p>
        <div className="grid gap-6 border-y border-white/10 py-5 md:grid-cols-3">
          {[
            ["Reconnaître", "La personne se reconnaît dans une scène de travail réelle, pas dans un persona décoratif."],
            ["Comprendre", "Elle comprend le résultat, le mécanisme, l'effort demandé et les conditions."],
            ["Décider", "Elle sait quelle prochaine étape est possible et si elle est adaptée à son cas."],
          ].map(([label, description]) => (
            <div key={label} className="border-t border-[#e8d5b0]/25 pt-4">
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#e8d5b0]/75">{label}</p>
              <p className="text-sm leading-relaxed text-white/60">{description}</p>
            </div>
          ))}
        </div>
      </FoundationChapter>

      <FoundationChapter eyebrow="Chapitre 2" title="Remplacer le persona figé par une fiche de décision">
        <p>
          Une cible utile n'est pas une étiquette démographique. C'est une situation de décision : ce que la personne veut faire, ce qui la bloque, ce qu'elle risque, ce qu'elle a déjà essayé et ce qui peut raisonnablement la rassurer.
        </p>
        <div className="divide-y divide-white/10 border-y border-white/10">
          {DECISION_FIELDS.map(([label, question, proof]) => (
            <div key={label} className="grid gap-2 py-4 md:grid-cols-[9rem_1fr_1fr] md:gap-5">
              <strong className="text-sm text-[#e8d5b0]">{label}</strong>
              <p className="text-sm leading-relaxed text-white/75">{question}</p>
              <p className="text-xs leading-relaxed text-white/50">Preuve minimale : {proof}</p>
            </div>
          ))}
        </div>
        <p className="border-l-2 border-[#e8d5b0]/45 bg-[#e8d5b0]/[0.035] px-5 py-4 text-sm leading-relaxed text-white/65">
          Une question de qualification n'est utile que si sa réponse change l'orientation, l'aide apportée ou la mesure. Sinon, elle ajoute de la friction et donne seulement l'impression de mieux connaître la personne.
        </p>
      </FoundationChapter>

      <FoundationChapter eyebrow="Chapitre 3" title="Le niveau de décision change l'entrée du message">
        <p>
          Une même offre ne se présente pas de la même façon à quelqu'un qui découvre le problème et à quelqu'un qui compare déjà deux options. Utilise les signaux réellement observés : recherche volontaire, parcours, échange, contenu consulté ou relation consentie. Ne transforme pas une hypothèse psychologique en certitude.
        </p>
        <div className="divide-y divide-white/10 border-y border-white/10">
          {DECISION_LEVELS.map(([label, description], index) => (
            <div key={label} className="grid gap-3 py-4 sm:grid-cols-[2rem_10rem_1fr] sm:items-start">
              <span className="font-mono text-xs text-[#e8d5b0]/60">{index + 1})</span>
              <strong className="text-sm text-[#f0ede8]">{label}</strong>
              <p className="text-sm leading-relaxed text-white/60">{description}</p>
            </div>
          ))}
        </div>
      </FoundationChapter>

      <FoundationChapter eyebrow="Chapitre 4" title="Une idée forte n'est pas un slogan">
        <p>
          Une idée directrice utile met en lumière une tension vécue, propose une explication nouvelle mais vérifiable, puis conduit vers un mécanisme et une action proportionnée. Elle ne promet pas un secret magique. Elle donne une meilleure façon de comprendre le problème.
        </p>
        <div className="grid gap-4 border-y border-white/10 py-5 md:grid-cols-2">
          <div className="border-t border-red-500/25 pt-4"><p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-red-300/80">Trop vague</p><p className="text-sm leading-relaxed text-white/60">« Utilisez l'IA pour transformer votre entreprise. »</p><p className="mt-3 text-xs leading-relaxed text-white/45">Aucun problème précis, aucun mécanisme, aucune condition.</p></div>
          <div className="border-t border-emerald-500/25 pt-4"><p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-emerald-300/80">À tester</p><p className="text-sm leading-relaxed text-white/70">« Le gain ne vient pas d'un outil de plus, mais d'un flux qui conserve les décisions, les preuves et les prochaines actions. »</p><p className="mt-3 text-xs leading-relaxed text-white/45">Cette phrase doit ensuite être sectorisée, illustrée et éventuellement invalidée.</p></div>
        </div>
        <div className="grid gap-3 border-b border-white/10 pb-5 sm:grid-cols-5">
          {["Tension observable", "Différence intelligible", "Mécanisme explicable", "Preuve proportionnée", "Prochain pas logique"].map((item, index) => <div key={item}><span className="font-mono text-xs text-[#e8d5b0]/65">{index + 1})</span><p className="mt-1 text-xs leading-relaxed text-white/60">{item}</p></div>)}
        </div>
      </FoundationChapter>

      <FoundationChapter eyebrow="Chapitre 5" title="La preuve répond à une objection">
        <p>
          Un logo, un compteur ou un témoignage n'est pas automatiquement une preuve. Commence par écrire l'incertitude : « Est-ce adapté à mon activité ? », « Est-ce faisable avec mes contraintes ? », « Qui va vraiment l'exécuter ? ». Ensuite place la preuve exactement devant cette question.
        </p>
        <div className="divide-y divide-white/10 border-y border-white/10">
          {PROOF_TYPES.map(([label, description], index) => (
            <div key={label} className="grid gap-3 py-4 sm:grid-cols-[2rem_9rem_1fr] sm:items-start"><span className="font-mono text-xs text-[#e8d5b0]/60">{index + 1})</span><strong className="text-sm text-[#f0ede8]">{label}</strong><p className="text-sm leading-relaxed text-white/60">{description}</p></div>
          ))}
        </div>
        <p className="text-xs leading-relaxed text-white/45">Avant publication, conserve la source, la date, le périmètre, le droit d'usage, la limite et la personne responsable de la révision. Un résultat client ne devient pas un résultat typique par la magie du montage.</p>
      </FoundationChapter>

      <FoundationChapter eyebrow="Chapitre 6" title="Les scripts de vente doivent parler français avant de parler persuasion">
        <p>
          Un script appris mot pour mot rend vite un commercial artificiel. En France, le même mot ne fonctionne pas dans le BTP, le conseil, la santé, l'artisanat ou un logiciel B2B. Adapte la scène, le niveau de formalité, les objections, la preuve disponible, le canal et le rythme de décision. Garde la structure de raisonnement, pas les phrases comme des incantations.
        </p>
        <div className="grid gap-5 border-y border-white/10 py-5 md:grid-cols-2">
          <div className="border-t border-white/10 pt-4"><p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-white/55">Scène de départ</p><p className="text-sm leading-relaxed text-white/65">« Quand les demandes de devis arrivent par téléphone, WhatsApp et email, où se perd l'information avant la relance ? »</p></div>
          <div className="border-t border-[#e8d5b0]/25 pt-4"><p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#e8d5b0]/75">Question de discernement</p><p className="text-sm leading-relaxed text-white/65">« Qu'est-ce qui est réellement différent dans votre organisation, et quelle partie ne mérite pas d'être automatisée ? »</p></div>
        </div>
        <p className="border-l-2 border-[#e8d5b0]/45 bg-[#e8d5b0]/[0.035] px-5 py-4 text-sm leading-relaxed text-white/65">Le but du premier message est souvent d'obtenir une réponse honnête, pas de vendre en trois lignes. Retire le lien, le pitch et la fausse urgence si la personne ne les a pas demandés.</p>
      </FoundationChapter>

      <FoundationChapter eyebrow="Chapitre 7" title="Écrire avec l'IA sans perdre ta voix">
        <p>
          Une IA peut produire un texte correct en quelques secondes. Elle ne sait pas, par défaut, ce qui est vrai pour ton secteur, ce que ton offre ne fait pas, ni quelle phrase tes clients emploient réellement. Donne-lui une fiche de décision, des preuves autorisées, deux ou trois textes validés et une règle d'arrêt.
        </p>
        <div className="flex flex-wrap gap-x-7 gap-y-4 border-y border-white/10 py-5">
          <ToolMark name="Hermes Agent" src="/brand-logos/hermes-agent-mark.png" />
          <ToolMark name="ChatGPT" src="/brand-logos/chatgpt.svg" />
          <ToolMark name="Claude" src="/brand-logos/claude.svg" />
        </div>
        <pre className="overflow-x-auto whitespace-pre-wrap break-words border-y border-white/10 py-5 font-mono text-xs leading-6 text-[#e8d5b0]">{`Avant d'écrire, fais quatre choses.
1) Résume la situation de décision et indique ce qui est un fait, une interprétation ou une hypothèse.
2) Propose trois angles adaptés à cette offre et à ce secteur, puis explique le risque de chacun.
3) Écris une version courte avec une preuve autorisée, une limite et une prochaine étape sans pression.
4) Relis le texte comme un prospect français : quelle phrase paraît importée, exagérée ou impossible à vérifier ?
Ne crée aucun témoignage, chiffre, logo, résultat ou urgence que je ne t'ai pas fourni.`}</pre>
        <p>Hermes peut ensuite garder cette méthode dans un skill ou un dossier de contexte. Le modèle change, la discipline de travail reste. C'est ce qui évite de répéter des frameworks sans comprendre quand ils ne s'appliquent pas.</p>
      </FoundationChapter>

      <SectionReveal className="border border-[#e8d5b0]/15 bg-[#e8d5b0]/[0.04] px-6 py-5">
        <p className="text-sm leading-relaxed text-[#e8d5b0]/85">Écris simple. Nomme la scène, précise le progrès, montre le mécanisme, place la preuve devant l'objection et dis quand l'offre ne convient pas. Le discernement est une compétence de copywriting.</p>
      </SectionReveal>
    </div>
  );
}
