import { FoundationChapter } from "../FoundationChapter";
import { FoundationEditorialNote } from "../FoundationEditorialNote";

const RULES = [
  ["Le hook qui arrête le scroll", "Le hook est la première phrase ou la première image. Il nomme rapidement une scène, une question ou un progrès pertinent. Son rôle consiste à qualifier l'attention, puis le contenu doit livrer ce qu'il annonce."],
  ["Décliner une idée par canal", "Une conversation, une démonstration ou une vidéo longue peut devenir plusieurs contenus. Chaque adaptation garde le même problème, la même position et les mêmes limites, tout en respectant l'usage du canal."],
  ["Produire pour apprendre", "Au début, le volume sert à comparer des angles et à entraîner ta production. Il reste utile seulement si tu notes la variable testée, le signal attendu et les réactions qualifiées."],
  ["Consolider ce qui répond", "Quand une direction produit régulièrement des conversations pertinentes, réduis les variations gratuites. Améliore la preuve, l'ouverture, la clarté et la distribution. Une cadence soutenable vaut mieux qu'un calendrier rempli au hasard."],
] as const;

const FUNNEL = [
  ["Faire découvrir", "Pars d'une scène assez large pour être reconnue par une personne qui ne te connaît pas. Donne-lui une observation utile sans demander tout de suite un engagement important."],
  ["Faire considérer", "Montre le mécanisme, un exemple, une preuve et les limites. La personne comprend comment tu travailles, compare avec son alternative et juge si la suite mérite son attention."],
  ["Faire passer à l'action", "Présente l'offre, les conditions et une prochaine étape proportionnée au niveau de confiance. Le refus reste possible et aucune urgence n'est ajoutée si elle n'existe pas."],
] as const;

const OBSERVATION_FIELDS = [
  ["Scène", "Quel moment de travail est montré, avec quelle personne et quel déclencheur ?"],
  ["Tension", "Quel coût, risque ou désir est nommé, et peut-on le distinguer d'un slogan ?"],
  ["Mécanisme", "Quelle étape explique comment le progrès devient possible ?"],
  ["Preuve", "Quel artefact, cas, résultat ou raisonnement soutient l'affirmation, avec quelle limite ?"],
  ["Action", "Quel geste est demandé et correspond-il au niveau de confiance construit ?"],
  ["Limite", "Quelles conditions ou situations rendent le message non pertinent ?"],
] as const;

export function SectionMarketing() {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 motion-reduce:animate-none">
      <div className="mb-8 flex items-center gap-3">
        <span className="text-xs font-semibold text-[var(--em)]">05</span>
        <h2 className="text-2xl font-semibold tracking-tight text-[var(--encre)] md:text-3xl">Capter l'attention et rester dans les têtes</h2>
      </div>
      <p className="mb-10 max-w-3xl text-base leading-relaxed text-[var(--t2)]">
        Le marketing relie une offre à des personnes qui peuvent en avoir besoin. Il transforme une situation réelle en message, choisit un canal, puis observe la qualité des réactions. L'objectif est une attention utile : la bonne personne reconnaît sa scène, comprend le progrès possible et sait quelle action choisir.
      </p>

      <FoundationChapter eyebrow="Chapitre 1" title="Une idée claire vaut mieux qu'un bruit de plus">
        <p>
          Une idée forte tient en une phrase : une situation précise, une lecture utile et une conséquence compréhensible. Elle intéresse ta niche, c'est-à-dire le groupe restreint que tu choisis de servir d'abord. Elle doit aussi conduire naturellement vers ce que ton offre sait réellement faire.
        </p>
        <p>
          Exemple : « Les demandes reçues en vocal disparaissent entre le chantier et le devis » nomme une scène. Tu peux ensuite montrer le flux qui transforme chaque vocal en demande à valider. Le contenu attire les équipes concernées et laisse les autres passer sans créer de mystère artificiel.
        </p>
        <FoundationEditorialNote label="Le test">
          Retire le nom de ta marque. Une personne extérieure doit encore pouvoir expliquer la scène, l'idée défendue, la preuve et la prochaine étape. La portée seule ne dit ni si le public est pertinent ni s'il a compris.
        </FoundationEditorialNote>
      </FoundationChapter>

      <FoundationChapter eyebrow="Chapitre 2" title="Le parcours en trois temps">
        <p>
          Un funnel est le parcours qui va de la découverte à une action commerciale. Chaque étape répond à une question différente. Un inconnu cherche d'abord à comprendre. Une personne intéressée veut inspecter le mécanisme. Une personne prête à décider a besoin du périmètre, des conditions et de la suite.
        </p>
        <div className="divide-y divide-[var(--trait)] border-y border-[var(--trait)]">
          {FUNNEL.map(([title, description], index) => (
            <div key={title} className="grid gap-3 py-4 sm:grid-cols-[2rem_10rem_1fr] sm:items-start">
              <span className="font-mono text-xs text-[var(--t3)]">{index + 1})</span>
              <strong className="text-sm text-[var(--menthe)]">{title}</strong>
              <p className="text-sm leading-relaxed text-[var(--t2)]">{description}</p>
            </div>
          ))}
        </div>
        <p>
          Fais correspondre l'engagement demandé à l'étape. Un post de découverte peut proposer de regarder un exemple. Une démonstration peut proposer un diagnostic. Une page d'offre peut présenter l'achat quand le prix, les conditions et le livrable sont déjà clairs.
        </p>
        <p>
          Exemple pour un magasin de vélos. Le post raconte la crevaison du lundi matin sur le trajet du travail. La vidéo montre ce que contient une révision complète. La page de l'offre révision donne le délai, ce qui est inclus et comment réserver.
        </p>
      </FoundationChapter>

      <FoundationChapter eyebrow="Chapitre 3" title="Observer avant d'imiter">
        <p>
          Une bibliothèque publicitaire montre des annonces diffusées. C'est un outil public qui liste les annonces actives d'une page, par exemple celle de Meta. Un centre créatif, un post public, une discussion communautaire ou une vidéo longue montre aussi des choix de message. Aucun de ces supports ne révèle à lui seul la rentabilité, la qualité des demandes ou les conditions de production.
        </p>
        <p>
          Exemple : ouvre la bibliothèque publicitaire de Meta et relève 5 annonces de salles de sport de ta ville. Note pour chacune la scène montrée, l'offre et l'action demandée. Compte 30 minutes. Tu repars avec un tableau de cinq lignes à comparer.
        </p>
        <p>
          Étudie donc la mécanique au lieu de recopier la surface. Capture le lien, la date, le public apparent et les six champs ci-dessous. Reformule ensuite le principe sur une page blanche avec les faits de ton offre. Une phrase, une promesse ou un exemple reconnaissable reste chez sa source.
        </p>
        <div className="divide-y divide-[var(--trait)] border-y border-[var(--trait)]">
          {OBSERVATION_FIELDS.map(([label, question], index) => (
            <div key={label} className="grid gap-3 py-4 sm:grid-cols-[2rem_8rem_1fr] sm:items-start">
              <span className="font-mono text-xs text-[var(--t3)]">{index + 1})</span>
              <strong className="text-sm text-[var(--encre)]">{label}</strong>
              <p className="text-sm leading-relaxed text-[var(--t2)]">{question}</p>
            </div>
          ))}
        </div>
        <p className="text-xs leading-relaxed text-[var(--t3)]">Écarte les slogans vagues, les chiffres sans source ni période, les témoignages impossibles à contextualiser, les captures isolées et les conseils qui ne donnent aucun chemin de vérification.</p>
      </FoundationChapter>

      <FoundationChapter eyebrow="Chapitre 4" title="Volume puis qualité, avec un signal de sortie">
        <div className="grid gap-6 border-y border-[var(--trait)] py-5 md:grid-cols-2">
          {RULES.map(([title, description]) => (
            <div key={title} className="border-t border-[var(--trait)] pt-4">
              <p className="mb-2 text-sm font-semibold tracking-tight text-[var(--menthe)]">{title}</p>
              <p className="text-sm leading-relaxed text-[var(--t2)]">{description}</p>
            </div>
          ))}
        </div>
        <p>
          Avant de publier, choisis un signal lié à ton objectif : réponse qualifiée, demande d'exemple, conversation engagée, devis demandé ou objection nouvelle. Ajoute un signal négatif comme une mauvaise qualification ou une confusion répétée. Si les réactions ne progressent pas, reviens à la scène, à l'offre ou à la preuve avant d'augmenter le volume.
        </p>
        <p>
          Exemple fictif : un serrurier publie 10 posts en 3 semaines sur deux angles, la porte claquée et la serrure changée après un déménagement. Le premier angle produit 4 réponses qualifiées, le second aucune. Il garde le premier et teste une nouvelle preuve.
        </p>
      </FoundationChapter>

      <FoundationChapter eyebrow="Chapitre 5" title="Démultiplier ta production avec l'IA">
        <p>
          L'IA peut extraire des idées, proposer des découpages et adapter une source à plusieurs formats. Elle multiplie aussi les erreurs quand le contexte manque. Donne-lui une matière que tu as le droit d'utiliser, ta position, les faits autorisés, les limites et les règles propres au canal.
        </p>
        <div className="divide-y divide-[var(--trait)] border-y border-[var(--trait)]">
          {[
            ["Source", "Une conversation consentie et anonymisée, une démonstration, une décision ou un contenu que tu possèdes."],
            ["Extraction", "Les scènes, objections, mécanismes et preuves présents dans la source, sans compléter les trous."],
            ["Adaptation", "Le format, la longueur, le niveau de contexte, le public et l'appel à l'action propres au canal."],
            ["Contrôle", "La fidélité aux faits, les droits d'usage, la voix, les conditions et la possibilité de retirer le contenu."],
          ].map(([title, description], index) => (
            <div key={title} className="grid gap-3 py-4 sm:grid-cols-[2rem_8rem_1fr] sm:items-start">
              <span className="font-mono text-xs text-[var(--t3)]">{index + 1})</span>
              <strong className="text-sm text-[var(--encre)]">{title}</strong>
              <p className="text-sm leading-relaxed text-[var(--t2)]">{description}</p>
            </div>
          ))}
        </div>
        <pre className="overflow-x-auto whitespace-pre-wrap break-words border-b border-[var(--trait)] py-5 font-mono text-xs leading-6 text-[var(--menthe)]">{`À partir de cette source autorisée : [colle la source].
Extrais les scènes, objections, mécanismes et preuves présents. Marque toute information manquante.
Propose un format pour [canal] destiné à [public], avec une seule idée et une seule prochaine étape.
N'invente aucun fait, chiffre, témoignage, urgence ou résultat. Termine par la liste des points à vérifier.`}</pre>
      </FoundationChapter>

      <FoundationChapter eyebrow="Chapitre 6" title="Un calendrier que tu peux réellement tenir">
        <p>Un plan éditorial organise une boucle d'apprentissage. Choisis une cadence qui laisse du temps pour observer, produire, répondre et analyser. Chaque contenu doit avoir un propriétaire, une date, un objectif et un signal de qualité.</p>
        <div className="divide-y divide-[var(--trait)] border-y border-[var(--trait)]">
          {[
            ["Jour 1 : scène", "Décris une situation de travail reconnaissable et la conséquence actuelle, sans exagérer."],
            ["Jour 2 : mécanisme", "Explique une décision ou une méthode qui rend le progrès compréhensible, avec sa limite."],
            ["Jour 3 : preuve", "Montre un artefact, une étape, une source ou une vérification et précise ce qu'elle établit."],
            ["Jour 4 : objection", "Réponds à une inquiétude réellement entendue : effort, risque, prix, outil ou changement d'habitude."],
            ["Jour 5 : prochaine étape", "Propose un geste proportionné : répondre, regarder un exemple, demander un échange ou passer."],
          ].map(([title, description], index) => (
            <div key={title} className="grid gap-3 py-4 sm:grid-cols-[2rem_12rem_1fr] sm:items-start">
              <span className="font-mono text-xs text-[var(--t3)]">{index + 1})</span>
              <strong className="text-sm text-[var(--encre)]">{title}</strong>
              <p className="text-sm leading-relaxed text-[var(--t2)]">{description}</p>
            </div>
          ))}
        </div>
        <FoundationEditorialNote label="Le même fond">Adapte la forme au canal et conserve le contrat du message. Un post court montre une scène. Une vidéo peut démontrer le mécanisme. Une newsletter développe le raisonnement. Un email propose une décision simple. Les faits, les conditions et la preuve restent identiques.</FoundationEditorialNote>
      </FoundationChapter>

      <FoundationEditorialNote label="À faire maintenant" className="mt-14 mb-4">
        Choisis une conversation ou une démonstration que tu peux utiliser. Remplis les six champs d'observation, écris une idée directrice et décline-la dans un format. Chaque scène, preuve, structure et contrôle validés rejoignent un capital réutilisable que tu peux adapter au prochain contenu au lieu de repartir de zéro. Avant de publier, note le signal attendu, le signal négatif et la condition qui te fera arrêter ou réviser. Compte 45 minutes. Tu repars avec un contenu prêt à publier et ses deux signaux écrits.
      </FoundationEditorialNote>
    </div>
  );
}
