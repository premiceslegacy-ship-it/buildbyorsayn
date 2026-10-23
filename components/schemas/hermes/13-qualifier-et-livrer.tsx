import { Chat, FileCard, Fork, Workflow } from "../kit";

const EM = "#22d96e";

export function FicheProspectQualifieMockup() {
  return <FileCard
    title="La fiche qui aide à agir"
    description="Exemple : cinq lignes dans Notion répondent à qui, quoi, quel manque, qui reprend, quand."
    legend="Lis les lignes surlignées : le manque et la date disent quoi faire ensuite."
    ariaLabel="Une fiche prospect Notion à cinq lignes : la personne Karim B., son besoin de rénover un commerce, le manque sur le prix et la surface, le responsable Maya et la prochaine action, un appel mardi."
    accent={EM}
    filename="prospect-1042"
    tool="Notion"
    lines={[
      { text: "Personne : Karim B." },
      { text: "Besoin : rénover un commerce" },
      { text: "Manque : surface, prix à valider", tone: "heading" },
      { text: "Responsable : Maya" },
      { text: "Prochaine action : appel mardi", tone: "heading" },
    ]}
    annotations={[
      { line: 2, label: "Ce qu'il veut" },
      { line: 3, label: "Ce qui manque" },
      { line: 5, label: "Qui reprend, et quand" },
    ]}
  />;
}

export function QuestionsQuiOuvrentUneRouteDiagram() {
  return <Fork
    title="Trois questions changent la route"
    description="Exemple : pour un devis de site, seules certaines questions changent la suite."
    legend="Si la réponse ne change pas la suite, ne la pose pas encore."
    ariaLabel="Pour un devis de site web, l'objectif, le contenu disponible et la date importante changent la route. La couleur préférée ne la change pas et est écartée."
    accent={EM}
    situation="Devis de site web"
    outcomes={[
      { label: "Objectif", condition: "Ce que le site doit faire", recommended: true },
      { label: "Contenu", condition: "Ce qui existe déjà", recommended: true },
      { label: "Date", condition: "Ce qui presse", recommended: true },
      { label: "Couleur", condition: "Ne change pas la route", rejected: true },
    ]}
  />;
}

export function MessageVersFicheCRMDiagram() {
  return <Workflow
    title="Le message nourrit la fiche"
    description="Le message reste dans la messagerie, la fiche garde l'état commercial."
    legend="Le lien vers le message d'origine suit la fiche, pour pouvoir le relire."
    ariaLabel="Un message WhatsApp est lu par l'agent, qui en extrait les faits. Les faits remplissent une fiche Notion avec le lien vers le message. Puis un brouillon de relance est préparé dans Gmail."
    accent={EM}
    actors={["Source", "Agent", "CRM", "Toi"]}
    steps={[
      { actor: 0, label: "Message", tool: "WhatsApp" },
      { actor: 1, label: "Faits extraits", tool: "Hermes Agent", transfer: "message" },
      { actor: 2, label: "Fiche", tool: "Notion", transfer: "faits, lien" },
      { actor: 3, label: "Relance", tool: "Gmail", transfer: "brouillon", humanValidation: true },
    ]}
    accentIndex={2}
  />;
}

export function RelanceDansWhatsAppMockup() {
  return <Chat
    title="La relance reste un brouillon"
    description="Exemple : une relance qui rappelle le besoin et propose un choix simple."
    legend="La relance cite le besoin du client, et rien ne part sans ton accord."
    ariaLabel="Une conversation WhatsApp avec Karim : il dit qu'il perd des devis, la relance rappelle son besoin et propose de relire la fiche mardi ou mercredi. En coulisse, le besoin est retrouvé dans Notion, le brouillon est préparé, puis tu valides l'envoi."
    accent={EM}
    platform="WhatsApp"
    contact="Karim"
    messages={[
      { from: "person", text: "Je perds des devis dans mes mails.", time: "14:12" },
      { from: "agent", text: "Tu voulais réduire les devis oubliés. J'ai préparé la fiche du dernier cas. Veux-tu la relire mardi ou mercredi ?", time: "14:13" },
    ]}
    backstageTitle="En coulisse"
    actions={[
      { label: "Besoin retrouvé", tool: "Notion" },
      { label: "Brouillon préparé", tool: "Hermes Agent" },
      { label: "Tu valides l'envoi", humanValidation: true },
    ]}
  />;
}
