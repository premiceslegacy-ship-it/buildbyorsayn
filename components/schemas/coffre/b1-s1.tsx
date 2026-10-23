import { Fork, Workflow } from "../kit";
import type { HandcraftedVisual } from "./types";

const EM = "#22d96e";

export function VisiteDuTravailDiagram() {
  return <Workflow
    title="Suis le dernier dossier"
    description="Tu observes un dossier réel du début à la fin, pas la procédure racontée de mémoire."
    legend="Arrête-toi là où l'information attend ou se recopie : le vrai métier est là."
    ariaLabel="Le dernier dossier traité est suivi en cinq passages : le dossier ouvert, l'information qui arrive par WhatsApp, ce qui est recopié, la décision prise par la personne, puis le résultat envoyé. La décision est mise en avant."
    accent={EM}
    actors={["La personne"]}
    accentIndex={3}
    steps={[
      { actor: 0, label: "Dernier cas" },
      { actor: 0, label: "Info qui arrive", transfer: "photos", tool: "WhatsApp" },
      { actor: 0, label: "Ce qui est recopié", transfer: "mesures" },
      { actor: 0, label: "Qui décide", transfer: "brouillon", humanValidation: true },
      { actor: 0, label: "Résultat", transfer: "devis validé" },
    ]}
  />;
}

export function TroisRolesDiagram() {
  return <Workflow
    title="Un rôle clair pour chacun"
    description="L'IA prépare, la personne vérifie et décide, puis le client reçoit un document validé."
    legend="Aller vite ne sert à rien si personne ne répond de la décision."
    ariaLabel="Trois acteurs se passent le travail : l'IA classe les photos et prépare un brouillon, la personne vérifie et décide, le client reçoit le document validé. La vérification de la personne est mise en avant."
    accent={EM}
    actors={["L'IA", "La personne", "Le client"]}
    accentIndex={2}
    steps={[
      { actor: 0, label: "Classe" },
      { actor: 0, label: "Prépare", transfer: "photos classées" },
      { actor: 1, label: "Vérifie, décide", transfer: "brouillon", humanValidation: true },
      { actor: 2, label: "Reçoit", transfer: "document validé" },
    ]}
  />;
}

export function FeuDesDecisionsDiagram() {
  return <Fork
    title="Trois feux pour chaque geste"
    description="Avant de brancher quoi que ce soit, chaque geste du métier tombe dans une des trois zones."
    legend="Une remise inhabituelle ou un engagement client ne sont jamais en vert."
    ariaLabel="Un geste du métier se classe en trois zones : vert, il part seul avec une règle claire ; orange, il attend ta validation ; rouge, il s'arrête, comme une remise inhabituelle ou un engagement envoyé au client."
    accent={EM}
    situation="Un geste du métier"
    outcomes={[
      { label: "Zone verte", condition: "Une règle claire, il part seul" },
      { label: "Zone orange", condition: "Il attend ta validation" },
      { label: "Zone rouge", condition: "Remise, engagement : on s'arrête", rejected: true },
    ]}
  />;
}

export const b1_s1_VISUALS = [
  { name: "VisiteDuTravail", kind: "schema", chapter: "b1-s1", component: VisiteDuTravailDiagram },
  { name: "TroisRoles", kind: "schema", chapter: "b1-s1", component: TroisRolesDiagram },
  { name: "FeuDesDecisions", kind: "schema", chapter: "b1-s1", component: FeuDesDecisionsDiagram },
] as const satisfies readonly HandcraftedVisual[];
