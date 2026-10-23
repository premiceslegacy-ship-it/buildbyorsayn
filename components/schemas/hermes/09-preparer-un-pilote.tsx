import { FileCard, Fork, Steps, ToolMap } from "../kit";

export function WorkshopDiagram() {
  return <Steps title="Cinq fiches dans le même dossier" description="Le pilote devient lisible avant d'être lancé." ariaLabel="Cinq fiches ordonnent Mission, Sources, Droits, Tests et Arrêt." items={[
    { label: "Mission", detail: "Le résultat attendu" },
    { label: "Sources", detail: "Ce qui fait foi" },
    { label: "Droits", detail: "Ce qui est permis" },
    { label: "Tests", detail: "Ce qui doit passer" },
    { label: "Arrêt", detail: "Quand reprendre la main" },
  ]} accentIndex={3} />;
}

export function FicheMissionRemplieMockup() {
  return <FileCard title="Une mission remplie sans inventer" description="Le manque visible bloque le départ." ariaLabel="Une fiche de mission contient huit champs. Responsable du prix est inconnu et le départ est bloqué." filename="mission.md" lines={[
    { text: "Problème : devis ralentis" },
    { text: "Résultat : brouillon complet" },
    { text: "Responsable du prix : inconnu", tone: "heading" },
    { text: "Sources : messages et photos" },
    { text: "Interdits : aucun envoi" },
    { text: "Validation : responsable du prix" },
    { text: "Preuve : deux dossiers relus" },
    { text: "Arrêt : contradiction" },
    { text: "Départ bloqué", tone: "heading" },
  ]} annotations={[
    { line: 2, label: "Ce qui sort" },
    { line: 3, label: "Qui décide" },
    { line: 9, label: "Ce qui bloque" },
  ]} />;
}

export function TroisPortesDuPiloteDiagram() {
  return <ToolMap title="Trois portes, trois droits" description="Chaque connexion donne une opération différente." ariaLabel="Gmail permet Lire les devis-test, Notion permet Écrire le brouillon et Telegram permet Demander l'accord." groups={[
    { role: "Lire les devis-test", tools: [{ name: "Gmail", description: "Lecture seule" }] },
    { role: "Écrire le brouillon", tools: [{ name: "Notion", description: "Dossier de test" }] },
    { role: "Demander l'accord", tools: [{ name: "Telegram", description: "Validation humaine" }] },
  ]} accentGroup={2} />;
}

export function QuatreCartesQuiCassentDiagram() {
  return <Fork title="Le pilote passe aussi les cas difficiles" description="Quatre cartes révèlent ce qui casse le chemin normal." ariaLabel="Pièce absente, Doublon, Contradiction et Faux ordre testent le pilote. Faux ordre est mis en avant." situation="Le cas normal fonctionne" outcomes={[
    { label: "Pièce absente", condition: "Le manque reste visible" },
    { label: "Doublon", condition: "Une seule action" },
    { label: "Contradiction", condition: "Le dossier s'arrête" },
    { label: "Faux ordre", condition: "L'instruction est refusée", recommended: true },
  ]} />;
}
