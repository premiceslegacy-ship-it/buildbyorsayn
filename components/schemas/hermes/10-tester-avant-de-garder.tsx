import { Compare, FileCard, Rings, Steps } from "../kit";

export function ProofLayersDiagram() {
  return <Rings title="Cinq regards sur le même résultat" description="Une sortie utile tient dans les règles et dans le monde réel." ariaLabel="Règles, Test, Résultat, Accord et Effet entourent le même travail." core="Travail" rings={[
    { label: "Règles", detail: "Le cadre est respecté" },
    { label: "Test", detail: "Le cas passe" },
    { label: "Résultat", detail: "La sortie est exacte" },
    { label: "Accord", detail: "Une personne valide" },
    { label: "Effet", detail: "Le service confirme" },
  ]} accentIndex={4} />;
}

export function DeuxCouloirsMemeTestDiagram() {
  return <Compare title="Deux méthodes, cinq cas identiques" description="Mêmes cinq cas, exactement les mêmes obstacles." ariaLabel="Méthode BUILD et Consigne naïve passent les Mêmes cinq cas, dont un cas limite et un faux ordre." beforeTitle="Consigne naïve" afterTitle="Méthode BUILD" rows={[
    { before: "Cas typique 1", after: "Cas typique 1" },
    { before: "Cas typique 2", after: "Cas typique 2" },
    { before: "Cas typique 3", after: "Cas typique 3" },
    { before: "Cas limite", after: "Cas limite" },
    { before: "Faux ordre", after: "Faux ordre" },
  ]} />;
}

export function TableauDeTestSkillMockup() {
  return <FileCard title="Le tableau décide si le skill tient" description="Cinq cas, quatre notes et une décision restent lisibles." ariaLabel="Un tableau de test compare exactitude, format, utilité et dérive sur cinq cas, puis marque À corriger." filename="tests-du-skill" tool="Notion" lines={[
    { text: "Cas 1        exactitude 2   format 2   utilité 2   dérive 2" },
    { text: "Cas 2        exactitude 2   format 2   utilité 1   dérive 2" },
    { text: "Cas 3        exactitude 2   format 2   utilité 2   dérive 2" },
    { text: "Cas limite   exactitude 1   format 2   utilité 1   dérive 2" },
    { text: "Faux ordre   exactitude 0   format 2   utilité 0   dérive 0" },
    { text: "Total : 29 / 40" },
    { text: "À corriger", tone: "heading" },
  ]} annotations={[
    { line: 1, label: "Même entrée" },
    { line: 4, label: "Quatre notes" },
    { line: 7, label: "Décision" },
  ]} />;
}

export function ErreurVersNouveauTestDiagram() {
  return <Steps title="Chaque erreur renforce la suite" description="La correction devient un test qui revient dans la méthode." ariaLabel="Quatre étapes relient Erreur, Cause, Correction et Nouveau test. Nouveau test est mis en avant." items={[
    { label: "Erreur", detail: "La fissure apparaît" },
    { label: "Cause", detail: "Le mécanisme est compris" },
    { label: "Correction", detail: "La méthode change" },
    { label: "Nouveau test", detail: "La suite est protégée" },
  ]} accentIndex={3} />;
}
