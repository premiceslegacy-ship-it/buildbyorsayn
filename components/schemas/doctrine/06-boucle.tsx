import { Chat, Rings, Workflow } from "../kit";
import type { HandcraftedVisual } from "../coffre/types";

const EM = "#22d96e";

export function SignalVersDossierDiagram() {
  return <Workflow
    title="Le signal ouvre un dossier"
    description="Une demande réveille le travail, mais elle est vérifiée avant de devenir un dossier suivi."
    legend="Une phrase hostile dans une pièce jointe reste une donnée, pas une règle."
    ariaLabel="Un relais dans l'ordre. Le client envoie une demande par Gmail. Ton agent vérifie son origine et son objet, mis en avant. Il cherche si elle a déjà été traitée. Puis il ouvre un dossier avec un identifiant dans Notion."
    accent={EM}
    accentIndex={1}
    actors={["Le client", "Ton agent"]}
    steps={[
      { actor: 0, label: "Demande reçue", tool: "Gmail" },
      { actor: 1, label: "Vérifier l'origine", transfer: "le message", tool: "Hermes Agent" },
      { actor: 1, label: "Déjà traitée ?", transfer: "l'objet" },
      { actor: 1, label: "Dossier ouvert", transfer: "un identifiant", tool: "Notion" },
    ]}
  />;
}

export function ComptoirInboxDiagram() {
  return <Chat
    title="L'Inbox montre ce qui attend"
    description="Ton agent te présente seulement ce qui demande ta main : décider, répondre ou reprendre."
    legend="Tu vois la pièce manquante et le prochain choix, pas toutes les machines."
    ariaLabel="Une conversation Telegram avec ton agent, à 8 h 30. Il annonce trois points en attente : une remise inhabituelle à décider, une date de pose à donner au client, un envoi incertain après une coupure. Tu valides la remise. En coulisse : la remise est appliquée dans HubSpot après ton accord, l'envoi incertain est relu dans Gmail avant toute reprise, les journaux complets restent à part."
    accent={EM}
    platform="Telegram"
    contact="Ton agent"
    messages={[
      { from: "agent", text: "Trois points t'attendent ce matin.", time: "08:30" },
      { from: "agent", text: "Décider : remise inhabituelle sur le devis cuisine.", time: "08:30" },
      { from: "agent", text: "Répondre : le client demande une date de pose.", time: "08:31" },
      { from: "agent", text: "Reprendre : envoi incertain après une coupure.", time: "08:31" },
      { from: "person", text: "Remise validée. Je réponds pour la date.", time: "08:42" },
    ]}
    backstageTitle="En coulisse"
    actions={[
      { label: "Remise appliquée après ton accord", tool: "HubSpot", humanValidation: true },
      { label: "Envoi incertain relu avant reprise", tool: "Gmail" },
      { label: "Journaux complets gardés à part" },
    ]}
  />;
}

export function TroisProtectionsDiagram() {
  return <Rings
    title="Trois protections différentes"
    description="Trois problèmes distincts entourent l'envoi du devis, chacun avec sa propre protection."
    legend="Si l'effet est incertain, relis la cible avant de recommencer."
    ariaLabel="Trois couches autour de l'envoi du devis. Doublon : la même demande vue deux fois est ignorée. Concurrence : un seul écrit à la fois. Répétition, mise en avant : la boîte d'envoi est relue avant de rejouer."
    accent={EM}
    core="L'envoi"
    accentIndex={2}
    rings={[
      { label: "Doublon", detail: "Même demande vue deux fois" },
      { label: "Concurrence", detail: "Un seul écrit à la fois" },
      { label: "Répétition", detail: "Relire l'envoi avant de rejouer" },
    ]}
  />;
}

export const doctrine06 = [
  { name: "SignalVersDossier", kind: "schema", chapter: "04-evenements-inbox-execution.md", component: SignalVersDossierDiagram },
  { name: "ComptoirInbox", kind: "schema", chapter: "04-evenements-inbox-execution.md", component: ComptoirInboxDiagram },
  { name: "TroisProtections", kind: "schema", chapter: "04-evenements-inbox-execution.md", component: TroisProtectionsDiagram },
] as const satisfies readonly HandcraftedVisual[];
