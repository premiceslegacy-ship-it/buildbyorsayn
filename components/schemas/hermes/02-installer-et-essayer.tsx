import { FileCard, Steps } from "../kit";

const EM = "#22d96e";

export function TerminalInstallationHermesMockup() {
  return <FileCard
    title="Installer, recharger, puis vérifier"
    description="La commande officielle installe l'outil en une ligne, puis trois commandes confirment qu'il répond."
    legend="Lis le domaine avant de coller, car cette ligne peut changer ta machine."
    ariaLabel="Un terminal Ghostty montre la commande officielle d'installation pour Linux, macOS ou WSL2, le rechargement du terminal, puis les commandes hermes --version, hermes doctor et hermes status --all."
    accent={EM}
    filename="Terminal"
    tool="Ghostty"
    lines={[
      { text: "# Linux, macOS ou WSL2", tone: "muted" },
      { text: "$ curl -fsSL \\" },
      { text: "https://hermes-agent.nousresearch.com/install.sh" },
      { text: "# Recharge ton terminal", tone: "muted" },
      { text: "$ hermes --version" },
      { text: "$ hermes doctor" },
      { text: "$ hermes status --all" },
    ]}
    annotations={[
      { line: 3, label: "Vérifie le domaine" },
      { line: 4, label: "Recharge avant de tester" },
      { line: 5, label: "Trois vérifications" },
    ]}
  />;
}

export function TroisVoyantsInstallationDiagram() {
  return <Steps
    title="Trois commandes, trois réponses"
    description="Lance version, doctor puis status : chaque commande vérifie une partie différente de l'installation."
    legend="Une clé acceptée prouve seulement que la connexion marche."
    ariaLabel="Trois commandes dans l'ordre : hermes --version confirme la version installée, hermes doctor fait ressortir les problèmes de configuration, hermes status --all affiche l'état complet sans montrer les clés. La deuxième est mise en avant."
    accent={EM}
    items={[
      { label: "Version", detail: "La version installée répond" },
      { label: "Diagnostic", detail: "Les problèmes de réglage ressortent" },
      { label: "État complet", detail: "Tout s'affiche, clés masquées" },
    ]}
    accentIndex={1}
  />;
}

export function PremierEssaiTerminalMockup() {
  return <FileCard
    title="Un essai qui ne peut rien envoyer"
    description="Exemple : trois demandes fictives de peinture deviennent chacune une fiche, sans prix ni envoi."
    legend="Tu vois tout de suite si l'outil marche, sans exposer un vrai client."
    ariaLabel="Une fiche produite à partir de trois demandes fictives : un appartement, un commerce et une cage d'escalier. La fiche de la cage d'escalier liste les faits, les manques, la décision attendue et la source, et confirme qu'aucun envoi n'a eu lieu."
    accent={EM}
    filename="fiche-escalier.md"
    tool="Hermes Agent"
    lines={[
      { text: "Lus : appartement.txt, commerce.txt, escalier.txt", tone: "muted" },
      { text: "# Cage d'escalier", tone: "heading" },
      { text: "Faits : photos reçues, trois étages" },
      { text: "Manques : surface, date souhaitée" },
      { text: "Décision : le prix reste à toi" },
      { text: "Source : escalier.txt" },
      { text: "Envoi : aucun. Modification : aucune.", tone: "muted" },
    ]}
    annotations={[
      { line: 1, label: "Trois faux dossiers" },
      { line: 4, label: "Le manque reste visible" },
      { line: 6, label: "Le bon fichier lu" },
      { line: 7, label: "Rien n'est parti" },
    ]}
  />;
}
