import { FoundationChapter } from "../FoundationChapter";
import { FoundationEditorialNote } from "../FoundationEditorialNote";

const RULES = [
  ["Le hook qui arrête le scroll", "Les premières secondes doivent rendre la situation reconnaissable. Sans scène précise, même le meilleur contenu reste invisible."],
  ["Une idée, plusieurs formats", "Une conversation, une démonstration ou une vidéo longue peut devenir plusieurs contenus, à condition de garder le même problème et la même position."],
  ["Le volume comme apprentissage", "Au début, le volume sert à apprendre ce qui déclenche une réponse. Il ne remplace ni la qualité de l’offre ni le respect des personnes."],
  ["Puis moins mais mieux", "Quand un angle est validé, réduis les variations inutiles et améliore la preuve, le rythme et la distribution au lieu de publier pour remplir un calendrier."],
] as const;

const FUNNEL = [
  ["Faire découvrir", "Une scène large attire des personnes qui ne te connaissent pas. Le but est de créer un écart compréhensible entre leur manière actuelle de travailler et un progrès possible."],
  ["Faire considérer", "Des exemples, des mécanismes et des limites montrent que tu sais de quoi tu parles. La personne peut se projeter sans avoir besoin de croire à une promesse absolue."],
  ["Faire passer à l’action", "Une offre claire, une preuve adaptée et une prochaine étape proportionnée lèvent les derniers doutes sans fabriquer d’urgence."],
] as const;

const OBSERVATION_FIELDS = [
  ["Scène", "Que se passe-t-il concrètement avant que le message apparaisse ?"],
  ["Tension", "Quel coût, risque ou désir est formulé sans slogan ?"],
  ["Mécanisme", "Quelle explication rend la promesse crédible ?"],
  ["Preuve", "Quel artefact ou signal soutient la promesse ?"],
  ["Action", "Que demande le contenu et à quel niveau de confiance ?"],
  ["Limite", "Qu’est-ce qui montre que le contenu ne convient pas à tout le monde ?"],
] as const;

export function SectionMarketing() {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 motion-reduce:animate-none">
      <div className="mb-8 flex items-center gap-3">
        <span className="text-xs font-semibold uppercase tracking-widest text-[#e8d5b0]/60">05</span>
        <h2 className="text-2xl font-semibold tracking-tight text-[#f0ede8] md:text-3xl">Capter l’attention et rester dans les têtes</h2>
      </div>
      <p className="mb-10 max-w-3xl text-base leading-relaxed text-white/60">
        Le meilleur produit du monde ne sert à rien si personne ne le connaît. Le marketing cherche une attention utile : une personne qui reconnaît sa situation, comprend le progrès possible et peut décider de la prochaine étape sans être poussée artificiellement.
      </p>

      <FoundationChapter eyebrow="Chapitre 1" title="Une idée claire vaut mieux qu’un bruit de plus">
        <p>
          Pour exister, il te faut une idée forte. Une idée qui intrigue ta niche, qui remet en question sa façon de faire, mais qui reste explicable et vérifiable. Une position nette attire les bonnes personnes et repousse les autres. Le but n’est pas de provoquer pour être vu, mais de rendre une différence immédiatement compréhensible.
        </p>
        <FoundationEditorialNote label="Le test">
          Si une publication ne contient ni scène, ni tension, ni preuve, ni prochaine étape, elle peut faire des vues sans créer de demande. La portée seule n’est pas un signal de valeur.
        </FoundationEditorialNote>
      </FoundationChapter>

      <FoundationChapter eyebrow="Chapitre 2" title="Le parcours en trois temps">
        <p>
          Un inconnu ne devient pas client d’un coup. Ton contenu doit nourrir le bon niveau de confiance, puis s’arrêter quand la personne n’est pas encore prête.
        </p>
        <div className="divide-y divide-white/10 border-y border-white/10">
          {FUNNEL.map(([title, description], index) => (
            <div key={title} className="grid gap-3 py-4 sm:grid-cols-[2rem_10rem_1fr] sm:items-start">
              <span className="font-mono text-xs text-[#e8d5b0]/60">{index + 1})</span>
              <strong className="text-sm text-[#e8d5b0]">{title}</strong>
              <p className="text-sm leading-relaxed text-white/60">{description}</p>
            </div>
          ))}
        </div>
      </FoundationChapter>

      <FoundationChapter eyebrow="Chapitre 3" title="Observer avant d’imiter">
        <p>
          Les bibliothèques publicitaires, les centres créatifs, les posts publics, les fils communautaires et les vidéos longues peuvent aider à trouver des angles. Ils ne disent pas automatiquement ce qui fonctionne. Un contenu doit être retenu pour son mécanisme, son contexte et sa possibilité de test, pas pour son nombre de vues.
        </p>
        <div className="divide-y divide-white/10 border-y border-white/10">
          {OBSERVATION_FIELDS.map(([label, question], index) => (
            <div key={label} className="grid gap-3 py-4 sm:grid-cols-[2rem_8rem_1fr] sm:items-start">
              <span className="font-mono text-xs text-[#e8d5b0]/60">{index + 1})</span>
              <strong className="text-sm text-[#f0ede8]">{label}</strong>
              <p className="text-sm leading-relaxed text-white/60">{question}</p>
            </div>
          ))}
        </div>
        <p className="text-xs leading-relaxed text-white/45">Écarte les slogans vagues, les chiffres sans période, les témoignages impossibles à contextualiser, les captures isolées, les contenus conçus uniquement pour provoquer et les conseils qui ne donnent aucun chemin de vérification.</p>
      </FoundationChapter>

      <FoundationChapter eyebrow="Chapitre 4" title="Volume puis qualité, avec un signal de sortie">
        <div className="grid gap-6 border-y border-white/10 py-5 md:grid-cols-2">
          {RULES.map(([title, description]) => (
            <div key={title} className="border-t border-[#c9b48a]/25 pt-4">
              <p className="mb-2 text-sm font-semibold tracking-tight text-[#e8d5b0]">{title}</p>
              <p className="text-sm leading-relaxed text-white/60">{description}</p>
            </div>
          ))}
        </div>
        <p>
          Fixe un signal de sortie : une réponse qualifiée, une demande de démonstration, un appel réservé, une vente ou un apprentissage explicite. Si rien ne change après plusieurs variantes, ne publie pas simplement davantage. Reviens à la scène, à l’offre ou à la preuve.
        </p>
      </FoundationChapter>

      <FoundationChapter eyebrow="Chapitre 5" title="Démultiplier ta production avec l’IA">
        <p>
          Une idée, plusieurs formats devient beaucoup plus rapide avec l’IA : elle peut redécouper un échange client, une publication longue ou une vidéo en variantes adaptées à chaque canal. Mais décliner dix fois un contenu générique donne dix contenus génériques. Donne toujours à l’IA ta position, ta scène métier, tes preuves autorisées et la règle qui lui interdit d’inventer.
        </p>
        <div className="divide-y divide-white/10 border-y border-white/10">
          {[
            ["Source", "Une conversation, une démonstration ou une décision réellement produite."],
            ["Extraction", "Les scènes, objections, phrases utiles et mécanismes qui méritent une variante."],
            ["Adaptation", "Le format, la longueur, le niveau de contexte et l’appel à l’action du canal."],
            ["Contrôle", "La fidélité aux faits, le respect du consentement, la voix et la possibilité de retirer le contenu."],
          ].map(([title, description], index) => (
            <div key={title} className="grid gap-3 py-4 sm:grid-cols-[2rem_8rem_1fr] sm:items-start">
              <span className="font-mono text-xs text-[#e8d5b0]/60">{index + 1})</span>
              <strong className="text-sm text-[#f0ede8]">{title}</strong>
              <p className="text-sm leading-relaxed text-white/60">{description}</p>
            </div>
          ))}
        </div>
      </FoundationChapter>

      <FoundationChapter eyebrow="Chapitre 6" title="Un calendrier que tu peux réellement tenir">
        <p>Un plan éditorial n’est pas une promesse de publier tous les jours. C’est une cadence assez légère pour observer, produire, mesurer et recommencer sans épuiser la qualité.</p>
        <div className="divide-y divide-white/10 border-y border-white/10">
          {[
            ["Jour 1 - scène", "Décris une situation de travail reconnaissable et le coût de la manière actuelle de faire."],
            ["Jour 2 - mécanisme", "Explique une décision ou une méthode qui rend le progrès compréhensible, avec une limite claire."],
            ["Jour 3 - preuve", "Montre un artefact, une étape, une source ou une vérification que la personne peut comprendre."],
            ["Jour 4 - objection", "Réponds à une inquiétude réelle : prix, effort, risque, outil ou changement d’habitude."],
            ["Jour 5 - prochaine étape", "Propose une action proportionnée : répondre, demander un exemple, réserver un échange ou ne rien faire."],
          ].map(([title, description], index) => (
            <div key={title} className="grid gap-3 py-4 sm:grid-cols-[2rem_12rem_1fr] sm:items-start">
              <span className="font-mono text-xs text-[#e8d5b0]/60">{index + 1})</span>
              <strong className="text-sm text-[#f0ede8]">{title}</strong>
              <p className="text-sm leading-relaxed text-white/60">{description}</p>
            </div>
          ))}
        </div>
        <FoundationEditorialNote label="Le même fond">Adapte le format au canal sans changer le problème : une phrase et une scène pour un post court, une démonstration pour une vidéo, un raisonnement sourcé pour une newsletter, une invitation claire pour un email. Le canal change la forme ; il ne doit pas changer les faits.</FoundationEditorialNote>
      </FoundationChapter>

      <FoundationEditorialNote label="À retenir" className="mt-14 mb-4">
        Le contenu que tu crées et les compétences que tu développes sont du capital. Il s’accumule quand chaque publication produit une preuve, une conversation, une amélioration ou un actif réutilisable.
      </FoundationEditorialNote>
    </div>
  );
}
