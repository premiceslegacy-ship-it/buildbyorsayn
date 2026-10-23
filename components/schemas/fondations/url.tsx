import { Cycle, Fork, Steps, Workflow } from "../kit";

const EM = "#22d96e";

export function DuDossierAuDomaineDiagram() {
  return <Steps
    title="Chaque objet garde son rôle"
    description="Le dossier avance jusqu'à l'enseigne publique sans se confondre avec elle."
    ariaLabel="Une ligne de montage va du dossier au domaine par Git, GitHub et Vercel."
    accent={EM}
    accentIndex={4}
    items={[
      { label: "Dossier", detail: "Vit sur l'ordinateur" },
      { label: "Git", detail: "Garde l'histoire" },
      { label: "GitHub", detail: "Conserve le dépôt", tools: ["GitHub"] },
      { label: "Vercel", detail: "Publie la version", tools: ["Vercel"] },
      { label: "Domaine", detail: "Allume l'adresse" },
    ]}
  />;
}

export function OuvrirOuClonerMockup() {
  return <Fork
    title="Où est le projet ?"
    description="Tu ouvres ce qui existe ici ou tu clones ce qui vit sur GitHub."
    ariaLabel="Deux portes distinguent un dossier déjà sur l'ordinateur d'un dépôt seulement sur GitHub, puis demandent de vérifier le chemin."
    accent={EM}
    situation="Où est le projet ?"
    outcomes={[
      { label: "Open Folder", condition: "Déjà sur cet ordinateur" },
      { label: "Clone Repository", condition: "Seulement sur GitHub" },
      { label: "Vérifie le chemin", condition: "Dossier principal et branche", recommended: true },
    ]}
  />;
}

export function BouclePetiteTacheDiagram() {
  return <Cycle
    title="Une petite tâche tourne jusqu'au vrai test"
    description="La main reprend l'écran après chaque modification."
    ariaLabel="La boucle lit, modifie, ouvre, teste et corrige, avec ouvrir mis en avant."
    accent={EM}
    entryIndex={2}
    centerLabel="Premier écran"
    steps={[
      { label: "Lire", detail: "Comprendre le brief" },
      { label: "Modifier", detail: "Changer en petit", tool: "Codex" },
      { label: "Ouvrir", detail: "Voir le rendu", tool: "Claude Code" },
      { label: "Tester", detail: "Faire le geste" },
      { label: "Corriger", detail: "Reprendre ce qui casse" },
    ]}
  />;
}

export function DepotVersHebergeurDiagram() {
  return <Workflow
    title="Publie une version connue"
    description="Le trajet se termine seulement quand l'adresse publique est testée."
    ariaLabel="Un commit est poussé vers GitHub, construit par Vercel, ouvert à son adresse publique puis testé."
    accent={EM}
    actors={["Dépôt", "GitHub", "Vercel", "Public"]}
    accentIndex={4}
    steps={[
      { actor: 0, label: "Commit", transfer: "tampon" },
      { actor: 1, label: "Push", tool: "GitHub" },
      { actor: 2, label: "Construire", tool: "Vercel" },
      { actor: 3, label: "Adresse publique", transfer: "téléphone" },
      { actor: 3, label: "Tester", humanValidation: true },
    ]}
  />;
}

export function InfrastructurePriveeDiagram() {
  return <Steps
    title="Une tour qui reste entretenue"
    description="Chaque étage protège une responsabilité compréhensible."
    ariaLabel="Une infrastructure privée empile le compte, le réseau privé, l'agent, les journaux et la sauvegarde."
    accent={EM}
    accentIndex={4}
    items={[
      { label: "Compte", detail: "Qui peut entrer" },
      { label: "Réseau privé", detail: "La porte principale", tools: ["Tailscale", "Cloudflare"] },
      { label: "Agent", detail: "Ce qui agit", tools: ["Hermes Agent"] },
      { label: "Journaux", detail: "Ce qui s'est passé" },
      { label: "Sauvegarde", detail: "La copie restaurée" },
    ]}
  />;
}

export function RemiseDesClesDiagram() {
  return <Steps
    title="Le client repart avec les clés"
    description="Chaque accès ouvre un objet précis et la procédure explique les gestes."
    ariaLabel="La remise contient le dépôt, l'hébergement, le domaine, la mesure et une procédure mise en avant."
    accent={EM}
    accentIndex={4}
    items={[
      { label: "Dépôt", detail: "Compte du client", tools: ["GitHub"] },
      { label: "Hébergement", detail: "Projet transféré", tools: ["Vercel"] },
      { label: "Domaine", detail: "Adresse contrôlée" },
      { label: "Mesure", detail: "Recherche et usage", tools: ["Search Console", "PostHog"] },
      { label: "Procédure", detail: "Refaire les gestes" },
    ]}
  />;
}
