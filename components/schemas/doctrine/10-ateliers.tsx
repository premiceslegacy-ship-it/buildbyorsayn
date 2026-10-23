import { FileCard, Steps } from "../kit";
import type { HandcraftedVisual } from "../coffre/types";

const EM = "#22d96e";

export function ArmoireDuPiloteDiagram() {
  return <FileCard
    title="L'armoire garde les bons liens"
    description="Le dossier du pilote range méthodes, décisions et projet, et garde des liens vers les données."
    legend="Copier un document ne copie jamais le droit d'accès à sa source."
    ariaLabel="Une arborescence de dossier. Connaissance : doctrine, décisions, méthodes, et un catalogue de données qui contient des liens, pas des copies. Procédures : un fichier SKILL.md et ses tests. Projets : le pilote avec mission, baseline et revue. Les secrets et les données vivantes restent dans leurs systèmes."
    accent={EM}
    filename="entreprise-exemple/"
    lines={[
      { text: "connaissance/", tone: "heading" },
      { text: "  doctrine/  decisions/  methodes/" },
      { text: "  catalogue-donnees/  # des liens" },
      { text: "procedures/preparation-dossier/", tone: "heading" },
      { text: "  SKILL.md   tests/" },
      { text: "projets/pilote-dossier/", tone: "heading" },
      { text: "  mission.md   baseline.md   revue.md" },
      { text: "# secrets et données vivantes : ailleurs", tone: "muted" },
    ]}
    annotations={[
      { line: 3, label: "Des références, pas des copies" },
      { line: 7, label: "Le pilote à relire" },
      { line: 8, label: "Les secrets restent dehors" },
    ]}
  />;
}

export function TrouQuiBloqueDiagram() {
  return <FileCard
    title="Un inconnu critique bloque"
    description="Exemple : un contrat de mission où le montant maximal manque encore. Le pilote ne démarre pas."
    legend="Ne demande jamais au modèle de remplir les trous."
    ariaLabel="Un fichier contrat-mission.md. Résultat : brouillon de relance. Source : CRM, lu le 12 octobre. Fraîcheur : relire chaque semaine. Montant maximal : A_RENSEIGNER. Statut : bloqué, limite critique vide."
    accent={EM}
    filename="contrat-mission.md"
    lines={[
      { text: "# Contrat de mission", tone: "heading" },
      { text: "Résultat : brouillon de relance" },
      { text: "Source : CRM, lu le 12 octobre" },
      { text: "Fraîcheur : relire chaque semaine" },
      { text: "Montant maximal : A_RENSEIGNER" },
      { text: "Statut : bloqué, limite critique vide", tone: "muted" },
    ]}
    annotations={[
      { line: 3, label: "Quand la donnée a été lue" },
      { line: 5, label: "Le trou reste visible" },
      { line: 6, label: "L'activation attend" },
    ]}
  />;
}

export function CinqCartesDeTestDiagram() {
  return <Steps
    title="Cinq cas avant d'activer"
    description="Le pilote affronte le cas normal puis quatre cas qui cassent, avec des données fictives."
    legend="Le mot « simulation » ne rend pas un script sûr : isole avant de tester."
    ariaLabel="Cinq cas de test sur une demande de devis fictive. Normal : le cas prévu. Pièce manquante : le métré est absent. Doublon : la même demande deux fois. Hostile, mis en avant : une pièce jointe donne des ordres. Coupure : arrêt juste après l'appel."
    accent={EM}
    accentIndex={3}
    items={[
      { label: "Normal", detail: "Le cas prévu" },
      { label: "Manque", detail: "Le métré est absent" },
      { label: "Doublon", detail: "La même demande deux fois" },
      { label: "Hostile", detail: "Une pièce jointe donne des ordres" },
      { label: "Coupure", detail: "Arrêt juste après l'appel" },
    ]}
  />;
}

export const doctrine10 = [
  { name: "ArmoireDuPilote", kind: "schema", chapter: "08-dossier-final-et-passation.md", component: ArmoireDuPiloteDiagram },
  { name: "TrouQuiBloque", kind: "schema", chapter: "08-pilote-comprehensible.md", component: TrouQuiBloqueDiagram },
  { name: "CinqCartesDeTest", kind: "schema", chapter: "08-pilote-comprehensible.md", component: CinqCartesDeTestDiagram },
] as const satisfies readonly HandcraftedVisual[];
