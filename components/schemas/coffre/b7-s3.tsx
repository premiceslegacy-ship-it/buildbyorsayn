import { Chat, FileCard, Ladder, Rings, Workflow } from "../kit";
import type { HandcraftedVisual } from "./types";

const EM = "#22d96e";

export function QuatreModesOrchestrationDiagram() {
  return <Ladder
    title="Quatre façons de faire circuler"
    description="Direct, aiguillage, parallèle ou orchestrateur : chaque mode ajoute des transmissions."
    legend="Une tâche prévisible reste directe ; un travail ouvert justifie un chef."
    ariaLabel="Quatre modes, du plus simple au plus coordonné. Direct, une tâche claire d'un trait, mode mis en avant. Aiguillage, chaque cas part vers sa route. Parallèle, des lots séparés avancent en même temps. Orchestrateur, un chef découpe le travail."
    accent={EM}
    accentIndex={0}
    lowLabel="Simple"
    highLabel="Coordonné"
    rungs={[
      { label: "Direct", detail: "Une tâche claire, d'un trait" },
      { label: "Aiguillage", detail: "Chaque cas vers sa route" },
      { label: "Parallèle", detail: "Des lots séparés en même temps" },
      { label: "Orchestrateur", detail: "Un chef découpe le travail" },
    ]}
  />;
}

export function EquipeMinimaleAutourDuResultatDiagram() {
  return <Rings
    title="Une équipe juste assez grande"
    description="L'équipe se construit depuis le résultat, une décision nécessaire après l'autre."
    legend="Chaque membre existe pour une décision précise et une preuve de fin."
    ariaLabel="Trois couches autour du résultat. D'abord les décisions, ce qu'il faut trancher, couche mise en avant. Ensuite les spécialistes, seulement si leur méthode ou leurs sources sont à part. Enfin le contrôle, une preuve de fin commune."
    accent={EM}
    core="Résultat"
    accentIndex={0}
    rings={[
      { label: "Décisions", detail: "Ce qu'il faut trancher" },
      { label: "Spécialistes", detail: "Seulement si leur méthode est à part" },
      { label: "Contrôle", detail: "Une preuve de fin commune" },
    ]}
  />;
}

export function ContratTravailleurAnnoteDiagram() {
  return <FileCard
    title="Le contrat d'un travailleur"
    description="Exemple : le contrat de l'agent qui rédige le brouillon d'une proposition commerciale."
    legend="Le skill garde la méthode ; le contrat garde la mission du jour."
    ariaLabel="Le contrat d'un agent rédacteur. Il nomme l'objectif, l'entrée, les sources, les outils permis, les interdits comme envoyer ou fixer un prix final, la sortie, le contrôle commun avec le devis et la condition d'arrêt quand une pièce manque."
    accent={EM}
    filename="contrat-redacteur.md"
    lines={[
      { text: "# Rédiger le brouillon de proposition", tone: "heading" },
      { text: "Objectif : un brouillon prêt à relire" },
      { text: "Entrée : pièces vérifiées du dossier" },
      { text: "Sources : skill commercial, grille de prix" },
      { text: "Outils permis : lecture du dossier" },
      { text: "Interdits : envoyer, fixer un prix final" },
      { text: "Sortie : un brouillon en Markdown" },
      { text: "Contrôle : même offre que le devis" },
      { text: "Arrêt : pièce manquante, il te prévient" },
    ]}
    annotations={[
      { line: 3, label: "Ce qu'il reçoit" },
      { line: 6, label: "Ce qu'il ne fait jamais" },
      { line: 7, label: "Ce qu'il rend" },
      { line: 8, label: "Le contrôle commun aux lots" },
      { line: 9, label: "Où il s'arrête" },
    ]}
  />;
}

export function HumainDeterministeAgentiqueDiagram() {
  return <Workflow
    title="Répéter, adapter, trancher"
    description="Exemple : une proposition passe par une règle fixe, puis un agent, puis une personne."
    legend="Automatise la répétition, encadre l'adaptation, garde les engagements humains."
    ariaLabel="Une proposition commerciale en trois mains. Une règle fixe vérifie les pièces. Un agent rédige le brouillon à partir des pièces. Une personne valide le prix et les clauses du brouillon, étape mise en avant."
    accent={EM}
    actors={["Règle fixe", "Agent", "Humain"]}
    accentIndex={2}
    steps={[
      { actor: 0, label: "Vérifie les pièces" },
      { actor: 1, label: "Rédige le brouillon", transfer: "les pièces" },
      { actor: 2, label: "Valide prix et clauses", transfer: "le brouillon", humanValidation: true },
    ]}
  />;
}

export function PropositionCommercialeIntegreeDiagram() {
  return <Chat
    title="Réunis tout avant l'envoi"
    description="Les lots avancent séparés, puis une personne relit la proposition entière avant l'envoi."
    legend="La relecture vérifie que l'ensemble raconte la même offre."
    ariaLabel="Une conversation entre le responsable et le système. Le brouillon réunit pièces, texte et engagements. Le responsable repère que le délai du texte diffère de celui du devis, et le système le corrige partout. En coulisse, un script vérifie les pièces, l'agent rédige avec le skill commercial, les engagements sont contrôlés, puis une relecture complète précède l'envoi."
    accent={EM}
    platform="Neutre"
    contact="Proposition cuisine"
    messages={[
      { from: "agent", text: "Brouillon prêt : pièces, texte et engagements réunis.", time: "10:02" },
      { from: "person", text: "Le délai du texte n'est pas celui du devis.", time: "10:15" },
      { from: "agent", text: "Corrigé : le même délai partout.", time: "10:17" },
    ]}
    backstageTitle="Les lots réunis"
    actions={[
      { label: "Un script vérifie les pièces" },
      { label: "L'agent rédige avec le skill commercial" },
      { label: "Les engagements sont contrôlés" },
      { label: "Relecture complète avant l'envoi", humanValidation: true },
    ]}
  />;
}

export const b7_s3_VISUALS = [
  { name: "QuatreModesOrchestration", kind: "schema", chapter: "b7-s3", component: QuatreModesOrchestrationDiagram },
  { name: "EquipeMinimaleAutourDuResultat", kind: "schema", chapter: "b7-s3", component: EquipeMinimaleAutourDuResultatDiagram },
  { name: "ContratTravailleurAnnote", kind: "maquette", chapter: "b7-s3", component: ContratTravailleurAnnoteDiagram },
  { name: "HumainDeterministeAgentique", kind: "schema", chapter: "b7-s3", component: HumainDeterministeAgentiqueDiagram },
  { name: "PropositionCommercialeIntegree", kind: "maquette", chapter: "b7-s3", component: PropositionCommercialeIntegreeDiagram },
] as const satisfies readonly HandcraftedVisual[];
