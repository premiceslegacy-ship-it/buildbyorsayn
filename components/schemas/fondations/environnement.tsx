import { Compare, Steps, Workflow } from "../kit";

const EM = "#22d96e";

export function ModeleContexteReponseDiagram() {
  return <Steps
    title="Une suite probable, pas une vérité"
    description="Exemple de Sofia, coach : le modèle prolonge ce qu'elle lui donne, et peut très bien écrire une erreur."
    legend="La dernière carte reste à toi : relis avant d'envoyer, surtout un prix ou une formule."
    ariaLabel="Sofia donne son offre et ses règles au modèle, Claude, ChatGPT ou Gemini, qui calcule plusieurs suites probables, en écrit une bien tournée, puis Sofia vérifie, par exemple une formule qui n'existe plus. La vérification est mise en avant."
    accent={EM}
    accentIndex={3}
    items={[
      { label: "Contexte", detail: "Son offre et ses règles", tools: ["Claude", "ChatGPT", "Gemini"] },
      { label: "Probables", detail: "Plusieurs suites possibles" },
      { label: "Réponse", detail: "Une suite bien écrite" },
      { label: "À vérifier", detail: "Cette formule existe encore ?" },
    ]}
  />;
}

export function ValiseDuContexteDiagram() {
  return <Compare
    title="Une valise, pas toute la maison"
    description="Exemple de Sofia : elle remplace ses copier‑coller dans le chat par un petit dossier daté."
    legend="Ajoute un fichier seulement quand la tâche du jour en a vraiment besoin."
    ariaLabel="Avant, Sofia colle toutes ses anciennes conversations, une ancienne formule et des règles noyées dans les messages. Après, son dossier contient l'offre actuelle datée, l'ancienne formule retirée et un fichier de règles de réponse."
    accent={EM}
    beforeTitle="Tout dans le chat"
    afterTitle="Le dossier du jour"
    rows={[
      { before: "Toutes les anciennes conversations", after: "L'offre actuelle, datée" },
      { before: "L'ancienne formule encore collée", after: "L'ancienne formule retirée" },
      { before: "Des règles noyées dans les messages", after: "Un fichier de règles de réponse" },
    ]}
  />;
}

export function ComptoirAPIDiagram() {
  return <Workflow
    title="L'API, le comptoir entre logiciels"
    description="Exemple : ton formulaire demande à Resend d'envoyer une confirmation, puis lit le statut qui revient."
    legend="Comme au comptoir : une commande lisible part, le plat ou une explication revient."
    ariaLabel="Ton site envoie une demande avec sa clé, Resend contrôle la clé et la demande, envoie l'e-mail, puis renvoie à ton site un statut, envoyé ou erreur, mis en avant."
    accent={EM}
    actors={["Ton site", "Resend"]}
    accentIndex={3}
    steps={[
      { actor: 0, label: "Demande" },
      { actor: 1, label: "Contrôle", transfer: "demande et clé" },
      { actor: 1, label: "Envoi", transfer: "l'e-mail" },
      { actor: 0, label: "Statut", transfer: "envoyé ou erreur" },
    ]}
  />;
}

export function RoleSeulMethodeCompleteDiagram() {
  return <Compare
    title="Un titre ne remplace pas une méthode"
    description="Exemple : la même demande pour le site d'une coach, avec un simple rôle, puis avec sources et contrôle."
    legend="La colonne de droite marche aussi avec le prochain modèle : rien ne dépend d'une phrase chanceuse."
    ariaLabel="Le rôle seul dit tu es un designer senior et fais un site premium, sans critère de fin. La méthode demande de lire le brief et trois références, de garder le texte et les couleurs fournis, puis de vérifier le bouton sur mobile."
    accent={EM}
    beforeTitle="Un rôle"
    afterTitle="Une méthode"
    rows={[
      { before: "« Tu es un designer senior »", after: "Lis le brief et les trois références" },
      { before: "« Fais un site premium »", after: "Garde le texte et les couleurs fournis" },
      { before: "Aucun critère de fin", after: "Vérifie le bouton sur mobile" },
    ]}
  />;
}

export function QuiFaitQuoiIADiagram() {
  return <Workflow
    title="Quatre rôles, une seule décision"
    description="Exemple : préparer une réponse client depuis sa fiche Notion. Chacun son rôle, la décision reste à toi."
    legend="Seule la dernière carte peut engager une personne : elle ne se délègue pas."
    ariaLabel="L'agent, Hermes Agent, prépare le plan ; la connexion MCP ouvre la fiche Notion ; le modèle, Claude, rédige un brouillon ; toi, tu valides l'envoi, mis en avant."
    accent={EM}
    actors={["Agent", "MCP", "Modèle", "Toi"]}
    accentIndex={3}
    steps={[
      { actor: 0, label: "Prépare le plan", tool: "Hermes Agent" },
      { actor: 1, label: "Ouvre la fiche", tool: "Notion", transfer: "le plan" },
      { actor: 2, label: "Rédige", tool: "Claude", transfer: "la fiche" },
      { actor: 3, label: "Valide l'envoi", transfer: "le brouillon", humanValidation: true },
    ]}
  />;
}
