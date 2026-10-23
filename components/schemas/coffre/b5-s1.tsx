import { Compare, FileCard, Ladder } from "../kit";
import type { HandcraftedVisual } from "./types";

const EM = "#22d96e";

export function ToiOuLeClientDiagram() {
  return <Compare
    title="Le travail du client guide"
    description="Ton goût propose des fonctions. Le travail du client dit lesquelles servent vraiment."
    legend="Garde une idée seulement si elle sert la colonne de droite."
    ariaLabel="Une comparaison oppose ce qui te plaît, une belle interface, un agent de plus et ta stack préférée, à ce que le client doit faire : retrouver le dossier demain matin, relancer la bonne pièce et faire avancer son équipe."
    accent={EM}
    beforeTitle="Ce qui te plaît"
    afterTitle="Ce qu'il doit faire"
    rows={[
      { before: "Une interface élégante", after: "Retrouver le dossier demain matin" },
      { before: "Un agent de plus", after: "Relancer la bonne pièce à temps" },
      { before: "Ta stack préférée", after: "Savoir qui valide le devis" },
    ]}
  />;
}

export function DernierCasSurLaTableDiagram() {
  return <FileCard
    title="Un dossier récent dit vrai"
    description="Tes notes sur le dernier devis bloqué, rangées en faits, en paroles et en inconnues."
    legend="Ne mélange jamais ce que tu vois avec ce qu'on te raconte."
    ariaLabel="Un fichier de notes sur le dernier devis bloqué note le déclencheur, la décision, un fait observé, une déclaration de la gérante et une inconnue à mesurer."
    accent={EM}
    filename="dernier-cas.md"
    lines={[
      { text: "# Dernier devis bloqué", tone: "heading" },
      { text: "Déclencheur : demande reçue lundi par e-mail" },
      { text: "Décision : la gérante valide le prix" },
      { text: "## Ce que je vois", tone: "heading" },
      { text: "Le devis attend la photo du compteur" },
      { text: "## Ce qu'on me raconte", tone: "heading" },
      { text: "« On relance toujours trop tard »" },
      { text: "## Ce qui manque", tone: "heading" },
      { text: "Le temps réel perdu : à mesurer", tone: "muted" },
    ]}
    annotations={[
      { line: 2, label: "Ce qui lance le travail" },
      { line: 3, label: "Qui décide" },
      { line: 5, label: "Un fait observé" },
      { line: 7, label: "Une déclaration" },
      { line: 9, label: "Une inconnue, pas un chiffre" },
    ]}
  />;
}

export function DefinitionDuSuccesDiagram() {
  return <Compare
    title="Un succès que tu peux voir"
    description="Le client décrit un état reconnaissable au lieu d'un adjectif sur l'outil."
    legend="Si personne ne peut le constater demain, ce n'est pas encore un résultat."
    ariaLabel="Une comparaison oppose des succès vagues, un outil moderne, plus de rapidité et une équipe soulagée, à des états visibles : un dossier accepté du premier coup, aucune pièce manquante au rendez-vous et le prochain responsable affiché."
    accent={EM}
    beforeTitle="Ce qu'il dit"
    afterTitle="Ce qu'il verra"
    rows={[
      { before: "Un outil moderne", after: "Le dossier accepté du premier coup" },
      { before: "Plus de rapidité", after: "Aucune pièce manquante au rendez-vous" },
      { before: "Une équipe soulagée", after: "Le prochain responsable affiché" },
    ]}
  />;
}

export function PlusPetiteReponseDiagram() {
  return <Ladder
    title="La plus petite réponse utile"
    description="Exemple d'un cabinet de courtage : une pièce expirée sans relance appelle une liste, pas un agent."
    legend="Monte d'une marche seulement si la précédente ne traite pas la cause."
    ariaLabel="Une échelle monte de écrire la règle à liste de pièces, relance programmée puis agent rédacteur. La liste de pièces avec un responsable est mise en avant comme réponse à la cause observée."
    accent={EM}
    accentIndex={1}
    lowLabel="Simple"
    highLabel="Lourd"
    rungs={[
      { label: "Écrire la règle", detail: "Qui relance quelle pièce" },
      { label: "Liste de pièces", detail: "Un responsable par pièce" },
      { label: "Relance programmée", detail: "Un rappel avant l'échéance" },
      { label: "Agent rédacteur", detail: "Attend une preuve d'utilité" },
    ]}
  />;
}

export const b5_s1_VISUALS = [
  { name: "ToiOuLeClient", kind: "schema", chapter: "b5-s1", component: ToiOuLeClientDiagram },
  { name: "DernierCasSurLaTable", kind: "schema", chapter: "b5-s1", component: DernierCasSurLaTableDiagram },
  { name: "DefinitionDuSucces", kind: "schema", chapter: "b5-s1", component: DefinitionDuSuccesDiagram },
  { name: "PlusPetiteReponse", kind: "schema", chapter: "b5-s1", component: PlusPetiteReponseDiagram },
] as const satisfies readonly HandcraftedVisual[];
