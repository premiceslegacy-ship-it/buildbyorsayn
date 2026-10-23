import Image from "next/image";
import { FoundationChapter } from "../FoundationChapter";
import { FoundationEditorialNote } from "../FoundationEditorialNote";

const MESSAGE_PARTS = [
  ["Le moment", "Le déclencheur concret. Exemple : une demande de devis arrive pendant que l'équipe est sur un chantier."],
  ["Le vrai problème", "La friction observable. Les informations restent dans plusieurs téléphones et personne ne sait qui doit rappeler."],
  ["Le progrès", "La situation que la personne cherche à obtenir. Chaque demande est visible avec un responsable et une prochaine action."],
  ["Ce qui le permet", "Le mécanisme, c'est-à-dire les étapes qui produisent le progrès. Ici : collecter la demande, la ranger, puis la faire valider."],
  ["La prochaine étape", "Le geste proposé maintenant : répondre, regarder un exemple, demander un devis ou décider que l'offre ne convient pas."],
] as const;

const MOMENTS = [
  ["Elle découvre le problème", "Fais reconnaître une scène et sa conséquence. Le produit peut attendre, car la personne cherche encore à comprendre ce qui se passe."],
  ["Elle sait que cela bloque", "Explique pourquoi la friction revient, quelles options existent et quel mécanisme pourrait l'améliorer."],
  ["Elle compare", "Précise le livrable, le fonctionnement, l'effort demandé, la preuve disponible et ce que l'offre ne règle pas."],
  ["Elle est prête à avancer", "Présente le prix décidé, les conditions, la suite exacte et la manière de refuser ou de sortir."],
] as const;

const PROOF_QUESTIONS = [
  ["Est-ce que cela ressemble à mon cas ?", "Montre une scène ou un exemple comparable. Précise les différences qui peuvent changer la décision."],
  ["Est-ce que vous savez le faire ?", "Montre un processus, une démonstration, un livrable ou un raisonnement inspectable. Un logo seul ne répond pas à cette question."],
  ["Est-ce que cela vaut le coup pour moi ?", "Explique le périmètre, l'effort, le prix lorsqu'il est fixé, les dépendances et le risque qui reste."],
] as const;

function ToolMark({ name, src }: { name: string; src: string }) {
  return (
    <span className="inline-flex items-center gap-2 text-sm text-[var(--t2)]">
      <Image src={src} alt="" aria-hidden="true" width={24} height={24} className="size-6 object-contain" loading="lazy" />
      {name}
    </span>
  );
}

export function SectionCopywriting() {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 motion-reduce:animate-none">
      <div className="mb-8 flex items-center gap-3">
        <span className="text-xs font-semibold text-[var(--em)]">03</span>
        <h2 className="text-2xl font-semibold tracking-tight text-[var(--encre)] md:text-3xl">Écrire pour que la bonne personne comprenne et réponde</h2>
      </div>
      <p className="mb-10 max-w-3xl text-base leading-relaxed text-[var(--t2)]">
        Le copywriting organise une décision avec des mots. Un texte utile montre une situation, un progrès, le mécanisme de l'offre, la preuve disponible, les limites et la prochaine étape. Sa force reste proportionnée à ce que tu peux livrer et démontrer.
      </p>

      <FoundationChapter eyebrow="Chapitre 1" title="Commence par une scène que l'on peut voir">
        <p>
          Avant le titre, décris un moment réel. Qui agit ? Que vient-il de se passer ? Où l'information se perd-elle ? Quelle conséquence la personne constate-t-elle ? Une scène donne au lecteur assez de matière pour se reconnaître ou comprendre que le message ne le concerne pas.
        </p>
        <p>
          Construis ensuite une carte de message. Elle rassemble les éléments qui doivent rester cohérents depuis le premier contenu jusqu'à la livraison. Une case inconnue reste une question ou une hypothèse à tester. Tu ne la complètes jamais avec une invention pratique.
        </p>
        <div className="divide-y divide-[var(--trait)] border-y border-[var(--trait)]">
          {MESSAGE_PARTS.map(([label, description], index) => (
            <div key={label} className="grid gap-3 py-4 sm:grid-cols-[2rem_10rem_1fr] sm:items-start">
              <span className="font-mono text-xs text-[var(--t3)]">{index + 1})</span>
              <strong className="text-sm text-[var(--encre)]">{label}</strong>
              <p className="text-sm leading-relaxed text-[var(--t2)]">{description}</p>
            </div>
          ))}
        </div>
        <FoundationEditorialNote label="La règle simple">
          Écris la scène et le progrès dans les mots du travail quotidien. Introduis l'outil ou la méthode au moment où tu peux expliquer précisément son rôle.
        </FoundationEditorialNote>
      </FoundationChapter>

      <FoundationChapter eyebrow="Chapitre 2" title="Remplace les phrases floues par des phrases que l'on comprend tout de suite">
        <p>
          Une phrase claire nomme une personne, un moment et un changement observable. Les verbes généraux comme « optimiser » ou « transformer » demandent toujours une précision. Ton lecteur doit pouvoir répondre rapidement : « cela ressemble à mon cas » ou « cela ne me concerne pas ».
        </p>
        <div className="grid gap-8 border-y border-[var(--trait)] py-6 md:grid-cols-2">
          <div>
            <p className="mb-3 text-xs font-semibold text-[var(--t3)]">Trop flou</p>
            <p className="text-lg leading-relaxed text-[var(--t2)]">« Nous aidons les entreprises à gagner du temps grâce à l'IA. »</p>
            <p className="mt-4 text-sm leading-relaxed text-[var(--t3)]">La phrase ne dit ni qui perd du temps, ni sur quelle tâche, ni comment le travail change.</p>
          </div>
          <div className="rounded-[var(--r-m)] bg-[var(--carte)] p-5">
            <p className="mb-3 text-xs font-semibold text-[var(--t3)]">On comprend la scène</p>
            <p className="text-lg leading-relaxed text-[var(--encre)]">« Le client explique son besoin au téléphone. Les photos utiles suivent dans un fil WhatsApp. Le flux réunit les deux pour attribuer la réponse et sa date. »</p>
            <p className="mt-4 text-sm leading-relaxed text-[var(--t3)]">Le problème, le mécanisme et le progrès sont visibles. Il reste à vérifier que cette scène existe chez les personnes visées et que le flux sait réellement la traiter.</p>
          </div>
        </div>
        <p>
          Pour un titre, garde une seule idée. Le sous-titre peut préciser la cible, le mécanisme ou la condition. Lis les deux à une personne extérieure : si elle doit demander « pour qui ? » ou « comment ? », remets l'information manquante près de l'affirmation.
        </p>
      </FoundationChapter>

      <FoundationChapter eyebrow="Chapitre 3" title="Le même message ne convient pas à tout le monde">
        <p>
          Le niveau de conscience décrit ce que la personne sait déjà du problème, des solutions et de ton offre. Choisis le point d'entrée à partir d'un signal observable : sa recherche, sa question, la page visitée ou une conversation. Une supposition sur son profil ne suffit pas.
        </p>
        <div className="divide-y divide-[var(--trait)] border-y border-[var(--trait)]">
          {MOMENTS.map(([label, description], index) => (
            <div key={label} className="grid gap-3 py-4 sm:grid-cols-[2rem_12rem_1fr] sm:items-start">
              <span className="font-mono text-xs text-[var(--t3)]">{index + 1})</span>
              <strong className="text-sm text-[var(--encre)]">{label}</strong>
              <p className="text-sm leading-relaxed text-[var(--t2)]">{description}</p>
            </div>
          ))}
        </div>
        <p>
          Un post vu au hasard demande plus de contexte qu'une page ouverte après une recherche précise. Une personne qui revient sur le devis cherche surtout les conditions et la suite. Garde le même contrat de fond, puis adapte la quantité d'explication.
        </p>
        <p>
          Exemple chez une fleuriste. Pour une personne qui ne pense pas encore au problème, le post nomme la scène : le bouquet commandé la veille d'un anniversaire, introuvable le samedi matin. Pour une personne qui compare déjà, la page donne les conditions, l'acompte et le délai de commande.
        </p>
        <FoundationEditorialNote label="À faire maintenant">
          Prends une offre et écris deux versions du même message : un post pour quelqu'un qui découvre le problème, une page pour quelqu'un qui compare. Compte 20 minutes. Tu repars avec deux textes de cinq lignes.
        </FoundationEditorialNote>
      </FoundationChapter>

      <FoundationChapter eyebrow="Chapitre 4" title="Explique ce qui change dans le travail">
        <p>
          Le mécanisme relie l'offre au progrès annoncé. Décris ses entrées, ses étapes, la validation humaine et sa sortie. Cette description permet au lecteur d'inspecter le chemin et t'empêche de cacher une promesse faible derrière un nom de méthode.
        </p>
        <div className="grid gap-6 border-y border-[var(--trait)] py-6 md:grid-cols-2">
          <div className="border-t border-[var(--trait)] pt-4">
            <p className="mb-2 text-xs font-semibold text-[var(--t3)]">Promesse qui reste vague</p>
            <p className="text-sm leading-relaxed text-[var(--t2)]">« Un flux intelligent qui garde vos décisions et vos preuves. »</p>
          </div>
          <div className="border-t border-[var(--trait)] pt-4">
            <p className="mb-2 text-xs font-semibold text-[var(--t3)]">Explication que l'on peut vérifier</p>
            <p className="text-sm leading-relaxed text-[var(--t1)]">« Après chaque appel, le flux range la demande avec sa source et propose une prochaine action. Une personne la valide avant qu'elle entre dans la file de l'équipe. »</p>
          </div>
        </div>
        <FoundationEditorialNote label="Montre le chemin">
          Donne un nom à ta méthode seulement quand tu peux montrer les entrées, les étapes, les contrôles, la sortie et les cas qu'elle ne couvre pas. Chez un traiteur, par exemple : la demande arrive, le nombre de couverts et la date sont vérifiés, puis une personne confirme le menu avant l'acompte.
        </FoundationEditorialNote>
      </FoundationChapter>

      <FoundationChapter eyebrow="Chapitre 5" title="La preuve répond à une vraie question">
        <p>
          Une preuve lève une incertitude précise. La preuve du problème montre que la friction existe. La preuve du mécanisme montre le fonctionnement. La preuve de compétence permet de juger l'exécution. La preuve de résultat exige un cas autorisé, daté et contextualisé.
        </p>
        <div className="divide-y divide-[var(--trait)] border-y border-[var(--trait)]">
          {PROOF_QUESTIONS.map(([question, answer], index) => (
            <div key={question} className="grid gap-3 py-4 sm:grid-cols-[2rem_15rem_1fr] sm:items-start">
              <span className="font-mono text-xs text-[var(--t3)]">{index + 1})</span>
              <strong className="text-sm text-[var(--menthe)]">{question}</strong>
              <p className="text-sm leading-relaxed text-[var(--t2)]">{answer}</p>
            </div>
          ))}
        </div>
        <p className="text-sm leading-relaxed text-[var(--t3)]">
          Place la preuve près de l'affirmation qu'elle soutient. Si tu cites un résultat, conserve la source, la date, le contexte, la méthode, l'autorisation et la limite. Un cas ne devient jamais une promesse universelle.
        </p>
        <p>
          Exemple : un paysagiste qui annonce « chantier tenu dans les délais » montre le planning prévu et les photos datées d'un jardin comparable. Ce soir, en 15 minutes, associe chacune de tes trois affirmations principales à une preuve disponible, ou retire-la.
        </p>
      </FoundationChapter>

      <FoundationChapter eyebrow="Chapitre 6" title="Le premier message cherche une réponse, pas une vente">
        <p>
          Au premier contact, tu ignores encore si la personne vit la scène et souhaite en parler. Présente-toi, donne une observation pertinente et pose une seule question facile à refuser. Un lien, un dossier complet ou une urgence ajoutée trop tôt augmente l'effort avant d'avoir établi la pertinence.
        </p>
        <div className="border-y border-[var(--trait)] py-6">
          <p className="mb-3 text-xs font-semibold text-[var(--t3)]">Exemple simple</p>
          <p className="max-w-2xl text-lg leading-relaxed text-[var(--encre)]">« Bonjour, est-ce que votre équipe reçoit des demandes par téléphone et des photos dans WhatsApp ? Si oui, comment décidez-vous qui reprend chaque dossier ? »</p>
        </div>
        <FoundationEditorialNote label="Ce que tu attends">
          Une réponse honnête. Si la scène n'existe pas, remercie et arrête. Si elle existe, demande un exemple récent avant de présenter une piste. La conversation reste une recherche de pertinence.
        </FoundationEditorialNote>
      </FoundationChapter>

      <FoundationChapter eyebrow="Chapitre 7" title="L'IA peut t'aider à écrire, pas inventer à ta place">
        <p>
          Une IA peut classer une recherche, raccourcir un brouillon, comparer des structures et proposer des variantes. Elle a besoin des faits, des mots réellement entendus, de la preuve autorisée, des limites et de l'action attendue. Toute information manquante doit rester visible.
        </p>
        <div className="flex flex-wrap gap-x-7 gap-y-4 border-y border-[var(--trait)] py-5">
          <ToolMark name="Hermes Agent" src="/brand-logos/hermes-agent-mark.png" />
          <ToolMark name="ChatGPT" src="/brand-logos/chatgpt.svg" />
          <ToolMark name="Claude" src="/brand-logos/claude.svg" />
        </div>
        <pre className="overflow-x-auto whitespace-pre-wrap break-words border-y border-[var(--trait)] py-5 font-mono text-xs leading-6 text-[var(--menthe)]">{`Surface et objectif : [où le texte sera lu et quelle décision il aide].
Personne et scène observée : [rôle, déclencheur, mots réellement entendus].
Progrès et mécanisme livré : [changement, entrées, étapes, contrôle, sortie].
Preuve autorisée : [problème, démonstration, compétence, cas, ou aucune].
Conditions, limites et non-pertinence : [ce qui change la décision].
Écris trois versions avec une seule prochaine étape. N'invente aucun fait, chiffre, urgence, témoignage ou résultat.
Après chaque version, liste les affirmations qui demandent une vérification.`}</pre>
      </FoundationChapter>

      <FoundationEditorialNote label="À faire maintenant" className="mt-14 mb-4">
        Choisis une offre réelle et remplis les cinq parties du message. Écris une phrase floue que tu utilises aujourd'hui, puis remplace-la par une scène, un mécanisme et une limite. Lis le résultat à voix haute et demande à une personne extérieure ce qu'elle comprend et pourquoi elle pourrait refuser. Compte 45 minutes. Tu repars avec une carte de message remplie et une phrase réécrite.
      </FoundationEditorialNote>
    </div>
  );
}
