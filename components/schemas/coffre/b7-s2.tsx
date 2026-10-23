import { BigNumber, Chat, FileCard, Ladder, Workflow } from "../kit";
import type { HandcraftedVisual } from "./types";

const EM = "#22d96e";

export function VoirLeTravailReelDiagram() {
  return <Workflow
    title="Le dernier cas, montré en vrai"
    description="La personne refait son dernier cas devant toi, écran après écran, avec ses détours."
    legend="Les copies et les attentes n'apparaissent jamais dans le récit idéal."
    ariaLabel="Un cas réel en cinq gestes. La personne ouvre le mail dans Gmail, cherche le devis à partir de la demande, le copie deux fois, attend une réponse à une question, étape mise en avant, puis termine le dossier une fois la réponse reçue."
    accent={EM}
    actors={[]}
    accentIndex={3}
    steps={[
      { actor: 0, label: "Ouvre le mail", tool: "Gmail" },
      { actor: 0, label: "Cherche", transfer: "le devis" },
      { actor: 0, label: "Copie", transfer: "deux fois" },
      { actor: 0, label: "Attend", transfer: "une réponse" },
      { actor: 0, label: "Termine", transfer: "le dossier" },
    ]}
  />;
}

export function DemandeVersTableurDiagram() {
  return <Chat
    title="Toutes les demandes, mêmes champs"
    description="Exemple : une demande WhatsApp passe par un formulaire commun avant d'arriver dans le tableur."
    legend="Le client garde son canal ; ce sont les champs qui deviennent communs."
    ariaLabel="Un client écrit sur WhatsApp pour une fuite sous l'évier. L'entreprise lui envoie un formulaire qui demande l'adresse, une photo et ses disponibilités. Ensuite, une ligne complète arrive dans le tableur sans recopie, et le patron décide seul de l'urgence."
    accent={EM}
    platform="WhatsApp"
    contact="Un client"
    messages={[
      { from: "person", text: "Bonjour, j'ai une fuite sous l'évier. Vous passez quand ?", time: "09:12" },
      { from: "agent", text: "Bonjour ! Remplissez ce court formulaire : adresse, photo et disponibilités.", time: "09:14" },
      { from: "person", text: "C'est fait, la photo est dedans.", time: "09:21" },
    ]}
    backstageTitle="Ensuite, sans recopie"
    actions={[
      { label: "Le formulaire réunit adresse, photo et dispo" },
      { label: "Une ligne complète arrive dans le tableur" },
      { label: "Le patron décide seul de l'urgence", humanValidation: true },
    ]}
  />;
}

export function MesureAvantApresDiagram() {
  return <BigNumber
    title="Mesure le même résultat"
    description="Exemple : le même devis chronométré avant et après, jusqu'à la version acceptée."
    legend="Compte préparation, contrôle, correction et reprise, pas seulement le brouillon."
    ariaLabel="Exemple de mesure de départ. Avant, cinquante minutes : le devis est écrit à la main et relu une fois. Après, quarante-cinq minutes : le brouillon sort en deux minutes, puis demande quarante-trois minutes de contrôle. Le travail s'est déplacé vers la vérification."
    accent={EM}
    before={{ value: "50 min", label: "Écrit à la main, relu une fois" }}
    after={{ value: "45 min", label: "Brouillon en 2 min, puis 43 min de contrôle" }}
    sentence="Le brouillon va vite ; le travail s'est surtout déplacé vers la vérification."
  />;
}

export function EchelleDesReponsesDiagram() {
  return <Ladder
    title="La plus petite réponse qui suffit"
    description="Six réponses possibles à un problème, de la règle simple au workflow adaptatif."
    legend="Monte d'une marche seulement si la précédente ne suffit pas."
    ariaLabel="Une échelle de six réponses, de la plus simple à la plus complexe. Règle, une consigne claire, marche mise en avant. Mieux utiliser l'outil actuel. Connecter deux outils. Automatiser un enchaînement fixe. Assister avec un brouillon à valider. Adapter avec un workflow qui s'ajuste."
    accent={EM}
    accentIndex={0}
    lowLabel="Plus simple"
    highLabel="Plus complexe"
    rungs={[
      { label: "Règle", detail: "Une consigne claire" },
      { label: "Mieux utiliser", detail: "L'outil actuel, bien réglé" },
      { label: "Connecter", detail: "Deux outils reliés" },
      { label: "Automatiser", detail: "Un enchaînement fixe" },
      { label: "Assister", detail: "Un brouillon à valider" },
      { label: "Adapter", detail: "Un workflow qui s'ajuste" },
    ]}
  />;
}

export function PiloteSansEffetExterneDiagram() {
  return <FileCard
    title="Un pilote sans effet dehors"
    description="Exemple : un pilote de relances tourne sur des cas préparés, avec les envois bloqués."
    legend="Ouvre ensuite un seul geste à la fois, quand le résultat tient."
    ariaLabel="Le fichier d'un pilote de relances de paiement. Les données sont des cas préparés, sans vrai client. L'envoi d'e-mails et l'écriture dans le logiciel sont bloqués. Trois cas montrent une relance proposée, un litige écarté et un paiement déjà reçu. Une personne relit chaque résultat."
    accent={EM}
    filename="pilote-relances.md"
    lines={[
      { text: "# Pilote : relances de paiement", tone: "heading" },
      { text: "Données : cas préparés, aucun vrai client" },
      { text: "Envoi d'e-mails : bloqué" },
      { text: "Écriture dans le logiciel : bloquée" },
      { text: "" },
      { text: "Cas A : relance proposée, à relire" },
      { text: "Cas B : litige repéré, pas de relance" },
      { text: "Cas C : déjà payé, pas de relance" },
      { text: "Chaque résultat est relu par une personne" },
    ]}
    annotations={[
      { line: 2, label: "Des cas préparés, pas de vrais clients" },
      { line: 3, label: "Rien ne part dehors" },
      { line: 7, label: "Le litige reste hors des relances" },
      { line: 9, label: "Une personne regarde tout" },
    ]}
  />;
}

export const b7_s2_VISUALS = [
  { name: "VoirLeTravailReel", kind: "schema", chapter: "b7-s2", component: VoirLeTravailReelDiagram },
  { name: "DemandeVersTableur", kind: "schema", chapter: "b7-s2", component: DemandeVersTableurDiagram },
  { name: "MesureAvantApres", kind: "schema", chapter: "b7-s2", component: MesureAvantApresDiagram },
  { name: "EchelleDesReponses", kind: "schema", chapter: "b7-s2", component: EchelleDesReponsesDiagram },
  { name: "PiloteSansEffetExterne", kind: "maquette", chapter: "b7-s2", component: PiloteSansEffetExterneDiagram },
] as const satisfies readonly HandcraftedVisual[];
