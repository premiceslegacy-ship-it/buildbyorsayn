import { Rings, Steps, ToolMap, Workflow } from "../kit";

export function AuthorityLayersDiagram() {
  return <Steps title="Écrire, bloquer, tester" description="Une règle existe dans le texte, le réglage et le test du refus." ariaLabel="Consigne, Réglage et Test du refus forment trois protections successives." items={[
    { label: "Consigne", detail: "La limite est écrite" },
    { label: "Réglage", detail: "Le droit est bloqué" },
    { label: "Test du refus", detail: "Le blocage est prouvé" },
  ]} accentIndex={2} />;
}

export function TrousseauMinimalDiagram() {
  return <ToolMap title="Une clé ouvre une seule porte" description="Le compte reçoit seulement le droit utile à sa mission." ariaLabel="Support est la seule porte active. Paiement, Code et Messagerie restent fermés." groups={[
    { role: "Support", tools: [{ name: "Gmail", description: "Lire et préparer" }] },
    { role: "Paiement", tools: [{ name: "Stripe", description: "Porte fermée" }] },
    { role: "Code", tools: [{ name: "GitHub", description: "Porte fermée" }] },
    { role: "Messagerie", tools: [{ name: "Telegram", description: "Porte fermée" }] },
  ]} accentGroup={0} />;
}

export function MainAvantLeMondeExterieurDiagram() {
  return <Workflow title="Ta main avant le monde extérieur" description="Toute action sensible attend une validation humaine." ariaLabel="Hermes cherche et prépare. Tu valides avant que Gmail ou Instagram envoie." actors={["Agent", "Toi", "Extérieur"]} steps={[
    { actor: 0, label: "Chercher", tool: "Hermes Agent" },
    { actor: 0, label: "Préparer", tool: "Hermes Agent" },
    { actor: 1, label: "Tu valides", humanValidation: true, transfer: "brouillon" },
    { actor: 2, label: "Envoyer", tool: "Gmail", transfer: "accord" },
    { actor: 2, label: "Publier", tool: "Instagram" },
  ]} accentIndex={2} />;
}

export function CompteurDeMissionDiagram() {
  return <Rings title="Le coût vient de toute la mission" description="Le total additionne le modèle, la recherche, les outils et les sous-tâches." ariaLabel="Quatre segments entourent le Total : Modèle, Recherche, Outils et Sous-tâches." core="Total" rings={[
    { label: "Modèle", detail: "Hermes Agent" },
    { label: "Recherche", detail: "Perplexity et Treg" },
    { label: "Outils", detail: "Appels externes" },
    { label: "Sous-tâches", detail: "Travaux délégués" },
  ]} accentIndex={3} />;
}
