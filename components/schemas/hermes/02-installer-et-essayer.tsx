import { FileCard, Steps } from "../kit";

export function TerminalInstallationHermesMockup() {
  return <FileCard title="La commande au bon endroit" description="Tu contrôles le domaine, tu colles une fois, puis tu recharges le terminal." ariaLabel="Un terminal Ghostty montre la commande officielle d'installation Hermes et trois repères de contrôle." filename="Terminal" tool="Ghostty" lines={[
    { text: "$ curl -fsSL https://hermes-agent.nousresearch.com/install.sh | bash" },
    { text: "Téléchargement de Hermes Agent", tone: "muted" },
    { text: "Installation terminée", tone: "heading" },
    { text: "$ hermes --version" },
  ]} annotations={[
    { line: 1, label: "Vérifie le domaine" },
    { line: 3, label: "Colle une seule fois" },
    { line: 4, label: "Recharge le terminal" },
  ]} />;
}

export function TroisVoyantsInstallationDiagram() {
  return <Steps title="Trois voyants, trois réponses" description="Chaque commande vérifie une partie différente de l'installation." ariaLabel="Version confirme l'installation, Diagnostic cherche les problèmes et État complet confirme la configuration." items={[
    { label: "Version", detail: "L'outil répond", tools: ["Hermes Agent"] },
    { label: "Diagnostic", detail: "Les problèmes ressortent", tools: ["Hermes Agent"] },
    { label: "État complet", detail: "La configuration est lisible", tools: ["Hermes Agent"] },
  ]} accentIndex={1} />;
}

export function PremierEssaiTerminalMockup() {
  return <FileCard title="Trois faux dossiers, une sortie vérifiable" description="Le test travaille sur des sources fictives et ne peut rien envoyer." ariaLabel="Un terminal montre trois fichiers fictifs et une fiche Faits, Manques, Décision et Source sans action extérieure." filename="exemples/" tool="Hermes Agent" lines={[
    { text: "Aucun client réel", tone: "heading" },
    { text: "demande-01.txt   demande-02.txt   demande-03.txt" },
    { text: "Faits : informations présentes" },
    { text: "Manques : éléments absents" },
    { text: "Décision : validation attendue" },
    { text: "Source : demande-01.txt" },
    { text: "Aucun envoi", tone: "heading" },
  ]} annotations={[
    { line: 2, label: "Sources fictives" },
    { line: 7, label: "Interdits écrits" },
    { line: 3, label: "Sortie vérifiable" },
  ]} />;
}
