import { Compare, Steps, Workflow } from "../kit";
import type { HandcraftedVisual } from "../coffre/types";

const EM = "#22d96e";

function DoctrineCommeAtelierDiagram() {
  return <Compare
    title="Préparer avant d'agir"
    description="La même demande, lancée telle quelle à un agent, puis préparée comme une vraie mission."
    legend="Si une autre personne ne peut pas reprendre, la mission n'est pas prête."
    ariaLabel="Comparaison. À gauche, « gère les demandes clients » : aucun dossier désigné, des droits flous, un « fait » sans preuve, personne pour reprendre. À droite, une mission préparée : le fil Gmail de la demande est nommé, l'agent prépare un brouillon sans rien envoyer, la fin attendue est un brouillon relu avec sa source, et tu reprends s'il doute."
    accent={EM}
    beforeTitle="« Gère les demandes »"
    afterTitle="Une mission préparée"
    rows={[
      { before: "Aucun dossier désigné", after: "Lis le fil Gmail de la demande" },
      { before: "Des droits flous", after: "Prépare un brouillon, n'envoie rien" },
      { before: "Un « fait » sans preuve", after: "Fin : brouillon relu, source citée" },
      { before: "Personne pour reprendre", after: "S'il doute, c'est toi qui reprends" },
    ]}
  />;
}

function TroisObjetsTroisRolesDiagram() {
  return <Steps
    title="Trois objets, trois rôles"
    description="Exemple : une demande de devis. Le workflow porte le trajet, le skill la méthode, la mémoire un fait."
    legend="Aucun des trois ne donne le droit d'agir : la permission reste à part."
    ariaLabel="Trois objets séparés sur une demande de devis. Le workflow, le trajet de l'e-mail reçu au devis accepté. Le skill, la fiche recette pour chiffrer une pose, chargée quand elle sert, mise en avant. La mémoire, un fait durable : le client préfère être appelé."
    accent={EM}
    accentIndex={1}
    items={[
      { label: "Workflow", detail: "De l'e-mail au devis accepté", tools: ["Gmail", "Notion"] },
      { label: "Skill", detail: "La recette pour chiffrer une pose", tools: ["Hermes Agent"] },
      { label: "Mémoire", detail: "« Le client préfère l'appel »" },
    ]}
  />;
}

function CinqPartiesUnDossierDiagram() {
  return <Workflow
    title="Cinq parties, un seul dossier"
    description="Chaque partie de la Doctrine se ferme sur un objet que la partie suivante reprend."
    legend="Tu ne tournes pas une page pour avoir lu : tu repars avec un objet."
    ariaLabel="Cinq parties en relais. Observer le travail donne une carte. Préparer le contexte et les limites donne un contrat. Vérifier et transmettre donne une méthode. Relier l'offre donne une première valeur. Faire circuler le dossier entre plusieurs métiers, mis en avant, permet une reprise."
    accent={EM}
    accentIndex={4}
    actors={[]}
    steps={[
      { actor: 0, label: "Observer" },
      { actor: 0, label: "Préparer", transfer: "une carte" },
      { actor: 0, label: "Vérifier", transfer: "un contrat" },
      { actor: 0, label: "Relier l'offre", transfer: "une méthode" },
      { actor: 0, label: "Faire circuler", transfer: "une valeur" },
    ]}
  />;
}

export const doctrine01 = [
  { name: "DoctrineCommeAtelier", kind: "schema", chapter: "README.md", component: DoctrineCommeAtelierDiagram },
  { name: "TroisObjetsTroisRoles", kind: "schema", chapter: "README.md", component: TroisObjetsTroisRolesDiagram },
  { name: "CinqPartiesUnDossier", kind: "schema", chapter: "README.md", component: CinqPartiesUnDossierDiagram },
] as const satisfies readonly HandcraftedVisual[];
