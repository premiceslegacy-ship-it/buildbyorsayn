import { Chat, Fork, Workflow } from "../kit";
import type { HandcraftedVisual } from "../coffre/types";

const EM = "#22d96e";

export function CleQuiNOuvreQuUnePorteDiagram() {
  return <Fork
    title="Une clé pour une seule porte"
    description="Exemple : la mission permet de lire un devis précis et refuse tout le reste."
    legend="Teste l'action permise et l'action refusée, pas seulement la connexion."
    ariaLabel="Situation : mission, lire le devis D-12. Lire ce devis, conseillé : c'est l'opération permise. Lire un autre dossier, refusé explicitement. Ajouter un outil, refusé : l'agent ne peut pas agrandir son cadre."
    accent={EM}
    situation="Mission : lire le devis D-12"
    outcomes={[
      { label: "Lire ce devis", condition: "L'opération permise", recommended: true },
      { label: "Lire un autre dossier", condition: "Refus explicite", rejected: true },
      { label: "Ajouter un outil", condition: "Le cadre ne grandit pas", rejected: true },
    ]}
  />;
}

export function TamponSurLaBonneVersionDiagram() {
  return <Chat
    title="L'accord suit la version"
    description="Ton accord porte sur un message précis. S'il change, ton agent revient te demander."
    legend="Le silence n'autorise jamais un envoi sensible."
    ariaLabel="Une conversation Telegram. Ton agent propose la relance du devis, version 1, et tu l'acceptes. Le client change d'adresse : le message devient la version 2. Ton agent explique que ton accord portait sur la version 1 et redemande. Tu valides la version 2. En coulisse, l'accord sur la version 1 est annulé, puis seule la version 2 part par Gmail après ton accord."
    accent={EM}
    platform="Telegram"
    contact="Ton agent"
    messages={[
      { from: "agent", text: "Relance du devis prête (v1). Je l'envoie ?", time: "10:02" },
      { from: "person", text: "Oui, envoie.", time: "10:05" },
      { from: "agent", text: "Le client a changé d'adresse, j'ai modifié le message (v2). Ton accord portait sur la v1 : tu valides la v2 ?", time: "10:06" },
      { from: "person", text: "Validé pour la v2.", time: "10:09" },
    ]}
    actions={[
      { label: "Accord v1 annulé, message modifié" },
      { label: "Envoi de la v2 après ton accord", tool: "Gmail", humanValidation: true },
    ]}
  />;
}

export function CoffreDerriereLeGuichetDiagram() {
  return <Workflow
    title="Le secret reste au guichet"
    description="Ton agent demande une opération limitée. La clé d'API reste derrière l'outil, jamais dans le prompt."
    legend="La clé ne va ni dans le prompt, ni dans le skill, ni dans le journal."
    ariaLabel="Un relais dans l'ordre. Ton agent demande à lire un paiement. Le guichet vérifie que l'opération est permise et utilise la clé, mis en avant. Le service Stripe répond à cet appel limité. Ton agent reçoit seulement le statut « payé », sans jamais voir la clé."
    accent={EM}
    accentIndex={1}
    actors={["Ton agent", "Le guichet", "Le service"]}
    steps={[
      { actor: 0, label: "Demande", tool: "Hermes Agent" },
      { actor: 1, label: "Utilise la clé", transfer: "lire un paiement" },
      { actor: 2, label: "Répond", transfer: "un appel limité", tool: "Stripe" },
      { actor: 0, label: "Reçoit", transfer: "« payé »" },
    ]}
  />;
}

export const doctrine07 = [
  { name: "CleQuiNOuvreQuUnePorte", kind: "schema", chapter: "05-autorite-outils-couts.md", component: CleQuiNOuvreQuUnePorteDiagram },
  { name: "TamponSurLaBonneVersion", kind: "schema", chapter: "05-autorite-outils-couts.md", component: TamponSurLaBonneVersionDiagram },
  { name: "CoffreDerriereLeGuichet", kind: "schema", chapter: "05-autorite-outils-couts.md", component: CoffreDerriereLeGuichetDiagram },
] as const satisfies readonly HandcraftedVisual[];
