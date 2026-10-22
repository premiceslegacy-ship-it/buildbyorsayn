import { FoundationChapter } from "../FoundationChapter";
import { FoundationEditorialNote } from "../FoundationEditorialNote";

const DISCOVERY_QUESTIONS = [
  ["La dernière fois", "Quand ce problème s'est-il présenté pour la dernière fois ? Que s'est-il passé, dans l'ordre ?"],
  ["L'alternative actuelle", "Comment l'as-tu traité ? Qu'as-tu essayé, payé ou décidé à la place ?"],
  ["Le coût concret", "Qu'est-ce que cet épisode a demandé en temps, en argent, en marge, en énergie ou en risque ?"],
  ["La décision", "Qu'est-ce qui devrait être vrai pour que tu changes, et qui doit participer à la décision ?"],
] as const;

const OFFER_ELEMENTS = [
  ["Le progrès", "Ce que la personne pourra faire, voir ou livrer de mieux. Formule un changement observable sans promettre un résultat hors de ton contrôle."],
  ["Le chemin", "Les étapes prises en charge, le format de livraison, les validations et le moment où le travail est considéré comme terminé."],
  ["L'effort", "Le temps, les informations, les accès, les décisions et les actions que le client doit réellement fournir."],
  ["La limite", "Les situations non couvertes, les dépendances, les conditions de sortie et le risque qui reste après l'achat."],
] as const;

const OBJECTIONS = [
  ["Je peux le faire avec une IA", "C'est possible. Vérifie ce que la personne veut prendre en charge. Ta valeur doit apparaître dans le cadrage, le contexte, les arbitrages, la vérification et le livrable, jamais dans le simple accès à un outil."],
  ["Je dois réfléchir", "Demande quelle information manque et quand la décision sera revue. La réponse peut concerner le prix, le calendrier, le risque, une autre personne ou une priorité différente. Laisse du temps sans fabriquer de date limite."],
  ["C'est trop cher", "Clarifie le périmètre, l'effort et le coût actuel avec des éléments fournis par la personne. Si la valeur reste incompréhensible, réduis ou recompose l'offre avant d'envisager une remise."],
  ["J'ai déjà un prestataire", "Comprends ce qui fonctionne, ce qui reste fragile et ce que la personne veut préserver. Une recommandation sérieuse peut compléter l'existant ou conclure qu'aucun changement n'est utile."],
] as const;

export function SectionVente() {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 motion-reduce:animate-none">
      <div className="mb-8 flex items-center gap-3">
        <span className="text-xs font-semibold uppercase tracking-widest text-[#e8d5b0]/60">04</span>
        <h2 className="text-2xl font-semibold tracking-tight text-[#f0ede8] md:text-3xl">Vendre, c'est de la psychologie appliquée</h2>
      </div>
      <p className="mb-10 max-w-3xl text-base leading-relaxed text-white/60">
        Vendre consiste à comprendre une situation, vérifier qu'un problème mérite une action, puis proposer un chemin que tu sais livrer. La personne garde sa décision. Ton rôle est de poser les bonnes questions, rendre le choix lisible et arrêter quand l'offre ne correspond pas.
      </p>

      <FoundationChapter eyebrow="Chapitre 1" title="Diagnostiquer avant de proposer">
        <p>
          Adopte la posture d'un médecin : écouter, examiner, formuler une hypothèse, puis prescrire seulement quand les faits suffisent. Au début de l'échange, cherche un épisode récent. Les comportements passés donnent une matière plus solide qu'une opinion sur une solution imaginaire.
        </p>
        <p>
          Demande la permission de prendre des notes. Laisse la personne raconter avant de reformuler. Sépare ses mots, tes interprétations et les informations manquantes. Cette discipline évite de transformer chaque difficulté en argument pour ton offre.
        </p>
        <p>
          Exemple fictif : tu demandes à la gérante d'une auto-école de raconter la dernière annulation. Un élève a prévenu par SMS à 7 h, le moniteur l'a appris à 9 h, et le créneau est resté vide. Elle estime à 5 le nombre de créneaux perdus ainsi chaque mois.
        </p>
        <div className="divide-y divide-white/10 border-y border-white/10">
          {DISCOVERY_QUESTIONS.map(([label, question], index) => (
            <div key={label} className="grid gap-3 py-4 sm:grid-cols-[2rem_10rem_1fr] sm:items-start">
              <span className="font-mono text-xs text-[#e8d5b0]/60">{index + 1})</span>
              <strong className="text-sm text-[#f0ede8]">{label}</strong>
              <p className="text-sm leading-relaxed text-white/60">{question}</p>
            </div>
          ))}
        </div>
        <FoundationEditorialNote label="Ce que tu cherches">
          Cherche une trace du comportement : document, outil, paiement, délai, relance ou décision. Une intention déclarée reste une information utile, mais elle ne prouve ni l'achat futur ni la valeur de ta solution.
        </FoundationEditorialNote>
      </FoundationChapter>

      <FoundationChapter eyebrow="Chapitre 2" title="Le déroulé d'une vente, dans l'ordre">
        <p>
          Chaque étape prépare la suivante et possède une condition d'arrêt. Si tu ne comprends pas le problème, tu continues le diagnostic. Si l'offre ne correspond pas, tu le dis. Si une condition importante manque, tu ne forces pas la proposition.
        </p>
        <div className="divide-y divide-white/10 border-y border-white/10">
          {[
            ["Comprendre", "Faire raconter la situation, le déclencheur, l'alternative actuelle, le coût et le progrès recherché."],
            ["Reformuler", "Résumer les faits avec les mots de la personne, puis lui demander ce que tu as mal compris ou oublié."],
            ["Relier", "Expliquer comment ton mode de livraison traite la friction, quelles étapes restent humaines et quelles limites demeurent."],
            ["Proposer", "Présenter une prochaine étape proportionnée : exemple, diagnostic, devis, démonstration ou achat."],
            ["Vérifier", "Demander ce qui bloque encore, confirmer les responsabilités et laisser une sortie claire."],
          ].map(([title, description], index) => (
            <div key={title} className="grid gap-3 py-4 sm:grid-cols-[2rem_10rem_1fr] sm:items-start">
              <span className="font-mono text-xs text-[#e8d5b0]/60">{index + 1})</span>
              <strong className="text-sm text-[#f0ede8]">{title}</strong>
              <p className="text-sm leading-relaxed text-white/60">{description}</p>
            </div>
          ))}
        </div>
        <p>
          Exemple : un artisan décrit des demandes dispersées entre appels et messages. Tu reformules le chemin actuel, vérifies qui doit répondre, puis montres un exemple de file à valider. Le devis vient après l'accord sur le problème, le périmètre et les responsabilités.
        </p>
      </FoundationChapter>

      <FoundationChapter eyebrow="Chapitre 3" title="Rendre l'offre facile à choisir">
        <p>
          Une offre est un contrat de progrès. Elle indique ce qui change, comment le travail sera mené, ce que chacun fournit et où s'arrête la responsabilité. Une longue liste de fonctions ne remplace aucune de ces réponses.
        </p>
        <div className="divide-y divide-white/10 border-y border-white/10">
          {OFFER_ELEMENTS.map(([label, description], index) => (
            <div key={label} className="grid gap-3 py-4 sm:grid-cols-[2rem_9rem_1fr] sm:items-start">
              <span className="font-mono text-xs text-[#e8d5b0]/60">{index + 1})</span>
              <strong className="text-sm text-[#f0ede8]">{label}</strong>
              <p className="text-sm leading-relaxed text-white/60">{description}</p>
            </div>
          ))}
        </div>
        <p>
          Écris aussi les cas de non-pertinence. Une offre peut être mauvaise pour une équipe sans responsable disponible, pour un volume trop faible ou pour un besoin déjà bien couvert. Dire cela avant l'achat améliore la décision et protège la livraison.
        </p>
        <p>
          Exemple pour un cabinet de kiné. Le progrès : les rendez-vous annulés sont reproposés le jour même. Le chemin : une liste d'attente et un message validé par l'accueil. L'effort : une heure d'échange et l'accès à l'agenda. La limite : les urgences restent gérées au téléphone.
        </p>
      </FoundationChapter>

      <FoundationChapter eyebrow="Chapitre 4" title="Répondre aux objections sans forcer">
        <p>
          Une objection signale une information, une confiance ou une priorité manquante. Commence par la reformuler, demande si tu as visé juste, puis réponds avec le fait ou la preuve adaptés. Vérifie ensuite si la question est résolue. Accepte qu'une réponse puisse rester négative.
        </p>
        <div className="divide-y divide-white/10 border-y border-white/10">
          {OBJECTIONS.map(([objection, response]) => (
            <div key={objection} className="grid gap-3 py-4 md:grid-cols-[14rem_1fr] md:items-start">
              <strong className="text-sm text-[#e8d5b0]">« {objection} »</strong>
              <p className="text-sm leading-relaxed text-white/60">{response}</p>
            </div>
          ))}
        </div>
        <FoundationEditorialNote label="Une réponse proportionnée">
          Prépare les objections réellement entendues et la preuve qui répond à chacune. Supprime les réponses qui reposent sur une peur, un faux délai, une comparaison invérifiable ou un résultat que tu ne peux pas documenter.
        </FoundationEditorialNote>
      </FoundationChapter>

      <FoundationChapter eyebrow="Chapitre 5" title="Passer du problème à une offre proposable">
        <p>Le diagnostic devient utile quand il produit un livrable clair, un prix explicable et une prochaine étape volontaire. Construis cette offre à partir du terrain, puis ajuste-la après des conversations et des livraisons documentées.</p>
        <p>Exemple fictif : tu choisis les salons de coiffure de ta ville, tu en appelles 10, et tu notes chaque échange dans un CRM minimal, c'est-à-dire un tableau de suivi des prospects avec une ligne par salon.</p>
        <div className="divide-y divide-white/10 border-y border-white/10">
          {[
            ["Choisir un terrain", "Pars d'un segment que tu peux atteindre, dont tu comprends les contraintes et où tu peux observer le travail réel. La niche sert de premier terrain d'apprentissage."],
            ["Formuler le livrable", "Décris ce qui sera remis, dans quel format, avec quels critères d'acceptation, quelles limites et quelles informations le client fournit."],
            ["Organiser un appel", "Prépare les thèmes plutôt qu'un monologue : situation récente, alternative, coût, progrès, contraintes, décision et suite. Garde du temps pour reformuler."],
            ["Proposer un prix", "Relie le prix au périmètre, à la préparation, aux validations, aux outils, au support et au risque pris. Change-le après des données de terrain, jamais pour répondre à une gêne passagère."],
            ["Suivre sans harceler", "Conserve dans ton tableau de suivi le problème, la dernière interaction, la prochaine date consentie, le statut et la raison d'un refus. Arrête quand il n'y a plus de suite convenue."],
          ].map(([title, description], index) => (
            <div key={title} className="grid gap-3 py-4 sm:grid-cols-[2rem_11rem_1fr] sm:items-start">
              <span className="font-mono text-xs text-[#e8d5b0]/60">{index + 1})</span>
              <strong className="text-sm text-[#f0ede8]">{title}</strong>
              <p className="text-sm leading-relaxed text-white/60">{description}</p>
            </div>
          ))}
        </div>
        <div className="border-b border-white/10 py-5">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#e8d5b0]/70">Version pour l'IA</p>
          <p className="text-sm leading-relaxed text-white/60">
            Donne à l'IA des notes anonymisées, le livrable réel, les limites et ta grille de qualification. Demande-lui de séparer faits, hypothèses, objections et questions manquantes, puis de préparer une reformulation et un brouillon de suivi. Relis chaque ligne avec la source avant tout envoi.
          </p>
        </div>
        <FoundationEditorialNote label="Une relance convenue">Le premier message nomme une scène et pose une question. La relance rappelle le contexte et permet une réponse courte. Sans accord, sans réponse ou après un refus, documente l'arrêt. Les objections recueillies servent à améliorer l'offre, jamais à fabriquer une preuve commerciale.</FoundationEditorialNote>
      </FoundationChapter>

      <FoundationEditorialNote label="À faire maintenant" className="mt-14 mb-4">
        Choisis une personne que tu peux interroger avec son accord. Prépare les quatre questions de découverte et écoute un épisode récent. Écris ensuite une offre d'une page avec progrès, chemin, effort et limite. Termine par une prochaine étape que la personne peut accepter ou refuser clairement. Compte une heure, appel compris. Tu repars avec tes notes d'appel et une offre d'une page.
      </FoundationEditorialNote>
    </div>
  );
}
