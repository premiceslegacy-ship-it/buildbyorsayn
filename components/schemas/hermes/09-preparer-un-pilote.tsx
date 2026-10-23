import { FileCard, Fork, Steps, ToolMap } from "../kit";

const EM = "#22d96e";

export function WorkshopDiagram() {
  return <Steps
    title="Cinq fiches dans le même dossier"
    description="Avant l'essai, un collègue doit pouvoir ouvrir le dossier et expliquer ce qui va se passer."
    legend="Une case inconnue reste écrite « inconnu » : le blanc visible bloque le départ."
    ariaLabel="Cinq fiches dans l'ordre : la mission donne le résultat attendu, les sources disent ce qui fait foi, les droits disent ce qui est permis, les tests disent ce qui doit passer, l'arrêt dit quand reprendre la main. Les tests sont mis en avant."
    accent={EM}
    items={[
      { label: "Mission", detail: "Le résultat attendu" },
      { label: "Sources", detail: "Ce qui fait foi" },
      { label: "Droits", detail: "Ce qui est permis" },
      { label: "Tests", detail: "Ce qui doit passer" },
      { label: "Arrêt", detail: "Quand reprendre la main" },
    ]}
    accentIndex={3}
  />;
}

export function FicheMissionRemplieMockup() {
  return <FileCard
    title="Une mission remplie sans inventer"
    description="Exemple : le responsable du prix est inconnu, donc la fiche l'écrit et le pilote ne part pas."
    legend="Écris « inconnu », puis donne un nom à la personne qui doit répondre."
    ariaLabel="Une fiche de mission contient problème, résultat, responsable du prix, sources, interdits, validation, preuve et arrêt. Le responsable du prix est marqué inconnu et la dernière ligne indique que le départ est bloqué."
    accent={EM}
    filename="mission.md"
    lines={[
      { text: "Problème : devis ralentis" },
      { text: "Résultat : brouillon complet" },
      { text: "Responsable du prix : inconnu", tone: "heading" },
      { text: "Sources : messages et photos" },
      { text: "Interdits : aucun envoi" },
      { text: "Validation : responsable du prix" },
      { text: "Preuve : deux dossiers relus" },
      { text: "Arrêt : contradiction" },
      { text: "Départ bloqué", tone: "heading" },
    ]}
    annotations={[
      { line: 2, label: "Ce qui sort" },
      { line: 3, label: "Qui décide" },
      { line: 9, label: "Ce qui bloque" },
    ]}
  />;
}

export function TroisPortesDuPiloteDiagram() {
  return <ToolMap
    title="Trois portes, trois droits"
    description="Chaque outil reçoit une opération précise sur une cible précise, jamais un « accès général »."
    legend="Écris la cible : le libellé, la base, le chat de test."
    ariaLabel="Trois portes pour le pilote. Gmail lit les devis-test en lecture seule. Notion écrit le brouillon dans le dossier de test. Telegram demande l'accord dans le chat de test. La porte Telegram est mise en avant."
    accent={EM}
    groups={[
      { role: "Lire les devis-test", tools: [{ name: "Gmail", description: "Libellé devis-test, lecture seule" }] },
      { role: "Écrire le brouillon", tools: [{ name: "Notion", description: "Base de test, champs écrits" }] },
      { role: "Demander l'accord", tools: [{ name: "Telegram", description: "Chat de test, tu valides" }] },
    ]}
    accentGroup={2}
  />;
}

export function QuatreCartesQuiCassentDiagram() {
  return <Fork
    title="Le pilote passe les cas difficiles"
    description="Le cas normal marche toujours. Ces quatre cartes cherchent ce qui le casse avant un vrai client."
    legend="Ajoute aussi une coupure juste après une action, sans répéter l'envoi."
    ariaLabel="Le cas normal fonctionne, puis quatre cas difficiles : pièce absente, le manque reste visible ; doublon, une seule action ; contradiction, le dossier s'arrête ; faux ordre, un document demande d'ignorer tes règles et l'instruction est refusée. Faux ordre est mis en avant."
    accent={EM}
    situation="Le cas normal fonctionne"
    outcomes={[
      { label: "Pièce absente", condition: "Le manque reste visible" },
      { label: "Doublon", condition: "Une seule action part" },
      { label: "Contradiction", condition: "Le dossier s'arrête" },
      { label: "Faux ordre", condition: "Le document ne commande pas", recommended: true },
    ]}
  />;
}
