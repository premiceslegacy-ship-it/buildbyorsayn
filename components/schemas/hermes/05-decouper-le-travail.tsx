import { FileCard, Rings, Workflow } from "../kit";

export function DecompositionDiagram() {
  return <Rings title="Du résultat aux lots de travail" description="Chaque lot laisse une sortie visible et vérifiable." ariaLabel="Le résultat visible contient quatre lots : Pièces, Besoin, Brouillon et Validation." core="Résultat visible" rings={[
    { label: "Pièces", detail: "Les sources reçues" },
    { label: "Besoin", detail: "Ce qui doit être compris" },
    { label: "Brouillon", detail: "La sortie préparée" },
    { label: "Validation", detail: "La décision humaine" },
  ]} accentIndex={3} />;
}

export function DevisEnQuatreLotsDiagram() {
  return <Workflow title="Quatre lots rendent le devis contrôlable" description="Le même dossier passe de plateau en plateau." ariaLabel="Les pièces WhatsApp deviennent un besoin, un brouillon Gmail, puis une validation humaine suivie dans Notion." actors={["Entrée", "Analyse", "Préparation", "Toi"]} steps={[
    { actor: 0, label: "Pièces", tool: "WhatsApp" },
    { actor: 1, label: "Besoin", tool: "Hermes Agent", transfer: "dossier" },
    { actor: 2, label: "Brouillon", tool: "Gmail", transfer: "besoin" },
    { actor: 3, label: "Validation", tool: "Notion", humanValidation: true, transfer: "devis" },
  ]} accentIndex={3} />;
}

export function CarteContratDuLotDiagram() {
  return <FileCard title="Le contrat court du lot" description="Six réponses rendent le travail reprenable." ariaLabel="Une fiche de travail contient Entrée, Sortie, Source, Interdit, Validation et Arrêt. Sortie est mise en avant." filename="contrat-du-lot.md" lines={[
    { text: "Entrée : dossier reçu" },
    { text: "Sortie : brouillon visible", tone: "heading" },
    { text: "Source : message d'origine" },
    { text: "Interdit : aucun envoi" },
    { text: "Validation : responsable du devis" },
    { text: "Arrêt : information contradictoire" },
  ]} annotations={[
    { line: 1, label: "Ce qui entre" },
    { line: 2, label: "Ce qui sort" },
    { line: 6, label: "Quand s'arrêter" },
  ]} />;
}
