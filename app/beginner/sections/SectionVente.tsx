import { SectionReveal } from "@/components/ui/section-reveal";
import { FoundationChapter } from "../FoundationChapter";

const DISCOVERY_QUESTIONS = [
  ["La dernière fois", "Quand ce problème s’est-il présenté pour la dernière fois ?"],
  ["L’alternative actuelle", "Comment l’as-tu résolu, ou qu’as-tu essayé à la place ?"],
  ["Le coût concret", "Qu’est-ce que cela t’a coûté en temps, en argent, en marge ou en énergie ?"],
  ["La décision", "Qu’est-ce qui devrait être vrai pour que tu changes maintenant ?"],
] as const;

const OFFER_ELEMENTS = [
  ["Le progrès", "Ce que la personne pourra faire ou livrer de mieux, sans promettre un revenu automatique."],
  ["Le chemin", "Les étapes prises en charge, le format de livraison et les décisions qui restent à prendre."],
  ["L’effort", "Le temps, les informations, les validations et les actions que le client doit réellement fournir."],
  ["La limite", "Les cas où l’offre ne convient pas, les dépendances et le risque qui reste après l’achat."],
] as const;

const OBJECTIONS = [
  ["Je peux le faire avec une IA", "Oui. La valeur est dans le cadrage, le contexte, les arbitrages, la vérification et le résultat livré, pas dans l’accès à un outil."],
  ["Je dois réfléchir", "Demande ce qui doit être clarifié : le prix, le risque, le calendrier, la priorité ou l’adéquation. Ne crée pas une urgence artificielle."],
  ["C’est trop cher", "Reviens au coût actuel, au périmètre et au résultat attendu. Si la valeur n’est pas compréhensible, améliore l’offre avant de proposer une remise."],
  ["J’ai déjà un prestataire", "Cherche ce qui fonctionne, ce qui reste lent ou fragile et ce qui ne mérite pas d’être remplacé. Une bonne qualification peut conclure à ne rien changer."],
] as const;

export function SectionVente() {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 motion-reduce:animate-none">
      <div className="mb-8 flex items-center gap-3">
        <span className="text-xs font-semibold uppercase tracking-widest text-[#e8d5b0]/60">04</span>
        <h2 className="text-2xl font-semibold tracking-tight text-[#f0ede8] md:text-3xl">Vendre, c’est de la psychologie appliquée</h2>
      </div>
      <p className="mb-10 max-w-3xl text-base leading-relaxed text-white/60">
        La vente fait peur parce qu’on l’imagine comme du baratin de marchand de tapis. C’est l’inverse. Bien vendre, c’est comprendre quelqu’un sans parler à sa place, puis lui montrer un chemin proportionné à sa situation. C’est une compétence qui peut soutenir une activité quand l’offre répond à un besoin réel et que la livraison tient ses promesses.
      </p>

      <FoundationChapter eyebrow="Chapitre 1" title="Diagnostiquer avant de proposer">
        <p>
          Un bon médecin ne prescrit pas dès que tu entres. Il pose des questions, écoute, vérifie, puis recommande uniquement ce qui correspond au cas. Fais pareil : le premier objectif n’est pas de placer ton offre, mais de savoir si le problème est réel, récent, coûteux et accessible.
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
        <p className="border-l-2 border-[#e8d5b0]/45 bg-[#e8d5b0]/[0.035] px-5 py-4 text-sm leading-relaxed text-white/65">
          Une question sur un comportement passé vaut mieux qu’une question qui demande si quelqu’un aimerait une solution imaginaire. Une intention déclarée n’est pas une vente. Cherche un document, un paiement, un temps déjà consacré ou une décision réellement prise.
        </p>
      </FoundationChapter>

      <FoundationChapter eyebrow="Chapitre 2" title="Le déroulé d’une vente, dans l’ordre">
        <p>
          Ce n’est pas une liste de techniques à empiler. Chaque étape prépare la suivante et peut s’arrêter si l’offre n’est pas adaptée.
        </p>
        <div className="divide-y divide-white/10 border-y border-white/10">
          {[
            ["Comprendre", "Faire raconter la situation, l’alternative actuelle, le coût et le résultat recherché."],
            ["Reformuler", "Vérifier que tu as compris sans amplifier la douleur ni inventer une urgence."],
            ["Relier", "Montrer le lien entre le problème décrit, le résultat possible et ton mode de livraison."],
            ["Proposer", "Présenter une prochaine étape proportionnée : exemple, diagnostic, devis, démonstration ou achat."],
            ["Vérifier", "Demander ce qui bloque, confirmer les conditions et laisser une sortie claire si ce n’est pas le bon moment."],
          ].map(([title, description], index) => (
            <div key={title} className="grid gap-3 py-4 sm:grid-cols-[2rem_10rem_1fr] sm:items-start">
              <span className="font-mono text-xs text-[#e8d5b0]/60">{index + 1})</span>
              <strong className="text-sm text-[#f0ede8]">{title}</strong>
              <p className="text-sm leading-relaxed text-white/60">{description}</p>
            </div>
          ))}
        </div>
      </FoundationChapter>

      <FoundationChapter eyebrow="Chapitre 3" title="Rendre l’offre facile à choisir">
        <p>
          Une offre n’est pas une longue liste de bonus. Elle devient lisible quand la personne comprend le progrès recherché, le chemin proposé, le travail qui reste à sa charge et le risque qui n’est pas supprimé.
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
      </FoundationChapter>

      <FoundationChapter eyebrow="Chapitre 4" title="Répondre aux objections sans forcer">
        <p>
          Une objection est souvent une information manquante, pas une invitation à parler plus fort. Réponds à la question réelle, puis vérifie si elle est résolue. Si elle ne l’est pas, réduis le périmètre ou arrête la conversation.
        </p>
        <div className="divide-y divide-white/10 border-y border-white/10">
          {OBJECTIONS.map(([objection, response]) => (
            <div key={objection} className="grid gap-3 py-4 md:grid-cols-[14rem_1fr] md:items-start">
              <strong className="text-sm text-[#e8d5b0]">« {objection} »</strong>
              <p className="text-sm leading-relaxed text-white/60">{response}</p>
            </div>
          ))}
        </div>
      </FoundationChapter>

      <FoundationChapter eyebrow="Chapitre 5" title="Passer du problème à une offre proposable">
        <p>La méthode ne s’arrête pas au bon diagnostic. Elle doit produire une prochaine étape concrète, tout en laissant la personne libre de ne pas acheter.</p>
        <div className="divide-y divide-white/10 border-y border-white/10">
          {[
            ["Choisir un terrain", "Pars d’un segment que tu peux atteindre, dont tu comprends les contraintes et où tu peux observer le travail réel. Une niche n’est pas une prison : c’est un premier terrain d’apprentissage."],
            ["Formuler le livrable", "Décris ce qui sera remis, dans quel format, avec quelles limites et quelles informations le client devra fournir. Vends un résultat vérifiable, pas une promesse vague d’IA."],
            ["Organiser un appel", "Sur 20 à 30 minutes : 5 minutes pour la situation, 10 pour le coût et les alternatives, 5 pour le résultat et les contraintes, puis 5 pour décider de la prochaine étape ou de l’arrêt."],
            ["Proposer un prix", "Relie le prix au périmètre, au temps de préparation, aux validations, aux outils et au risque restant. Commence avec une offre simple et ajuste après des retours réels, pas après une intuition."],
            ["Suivre sans harceler", "Garde dans un CRM minimal le problème, le dernier échange, la prochaine date, le statut et la raison d’un refus. Un rappel peut vérifier la décision ; il ne doit pas créer une fausse urgence."],
          ].map(([title, description], index) => (
            <div key={title} className="grid gap-3 py-4 sm:grid-cols-[2rem_11rem_1fr] sm:items-start">
              <span className="font-mono text-xs text-[#e8d5b0]/60">{index + 1})</span>
              <strong className="text-sm text-[#f0ede8]">{title}</strong>
              <p className="text-sm leading-relaxed text-white/60">{description}</p>
            </div>
          ))}
        </div>
        <p className="border-l-2 border-[#e8d5b0]/45 bg-[#e8d5b0]/[0.035] px-5 py-4 text-sm leading-relaxed text-white/65">Une séquence simple peut suffire : premier message ancré dans une scène métier, réponse ou silence, relance courte quelques jours plus tard, puis arrêt documenté. Mesure les réponses et les objections pour améliorer l’offre, sans transformer une observation interne en preuve commerciale.</p>
      </FoundationChapter>

      <SectionReveal className="border-t border-white/10 pt-8">
        <p className="text-sm leading-relaxed text-[#e8d5b0]/85">
          Vendre, c’est écouter, diagnostiquer, puis prescrire. Pose plus de questions que tu ne fais de promesses. Le calme et la compréhension vendent mieux que la pression.
        </p>
      </SectionReveal>
    </div>
  );
}
