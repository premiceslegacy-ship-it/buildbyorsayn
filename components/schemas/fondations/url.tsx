import { Cycle, Fork, Rings, Steps, Workflow } from "../kit";

const EM = "#22d96e";

export function DuDossierAuDomaineDiagram() {
  return <Steps
    title="Du dossier au domaine"
    description="Exemple : Maison Lila. Chaque pièce a son rôle, et l'adresse publique n'est que le dernier maillon."
    legend="Lis de gauche à droite : un commit, un push, une publication, puis l'adresse."
    ariaLabel="Le dossier maison-lila vit sur l'ordinateur, Git nomme chaque version par un commit, GitHub garde le dépôt, Vercel publie la version choisie et le domaine maisonlila.fr y conduit, mis en avant."
    accent={EM}
    accentIndex={4}
    items={[
      { label: "Dossier", detail: "maison-lila, sur l'ordinateur" },
      { label: "Git", detail: "Un commit par version" },
      { label: "GitHub", detail: "Garde le dépôt", tools: ["GitHub"] },
      { label: "Vercel", detail: "Publie la version", tools: ["Vercel"] },
      { label: "Domaine", detail: "maisonlila.fr" },
    ]}
  />;
}

export function OuvrirOuClonerMockup() {
  return <Fork
    title="Où est le projet ?"
    description="Dans Antigravity, tu ouvres ce qui existe sur ton ordinateur ou tu clones ce qui vit sur GitHub."
    legend="Dans les deux cas, ouvre seulement le dossier du projet, jamais tout ton Bureau."
    ariaLabel="Deux boutons d'Antigravity : Open Folder quand le dossier maison-lila est déjà sur l'ordinateur, Clone Repository quand le projet existe seulement sur GitHub."
    accent={EM}
    situation="Où vit maison-lila ?"
    outcomes={[
      { label: "Open Folder", condition: "Le dossier est déjà sur ton ordinateur" },
      { label: "Clone Repository", condition: "Le projet existe seulement sur GitHub" },
    ]}
  />;
}

export function BouclePetiteTacheDiagram() {
  return <Cycle
    title="Une petite tâche, puis le vrai test"
    description="Exemple : l'en-tête de Maison Lila. L'outil modifie, toi tu ouvres la page et tu testes avant la suite."
    legend="Passe à la partie suivante seulement quand un tour se termine sans correction."
    ariaLabel="La boucle lit le résumé de mission, modifie l'en-tête avec Claude Code, ouvre la page en local, teste les liens, le bouton et le mobile, puis corrige avec un retour précis avant de recommencer."
    accent={EM}
    entryIndex={0}
    centerLabel="Partie suivante"
    steps={[
      { label: "Lire", detail: "Mission et fichiers touchés" },
      { label: "Modifier", detail: "L'en-tête seulement", tool: "Claude Code" },
      { label: "Ouvrir", detail: "La page en local" },
      { label: "Tester", detail: "Liens, bouton, mobile" },
      { label: "Corriger", detail: "Un retour précis" },
    ]}
  />;
}

export function DepotVersHebergeurDiagram() {
  return <Workflow
    title="Publie une version connue"
    description="Exemple : Maison Lila. Le commit relu part sur GitHub, Vercel le construit, puis tu testes l'adresse."
    legend="Ouvre GitHub après le push : le bon commit doit y apparaître avant la publication."
    ariaLabel="Tu fais un commit relu, tu le pousses sur GitHub, Vercel construit le dépôt et le met en ligne, puis tu testes l'adresse publique, mis en avant."
    accent={EM}
    actors={["Toi", "GitHub", "Vercel"]}
    accentIndex={4}
    steps={[
      { actor: 0, label: "Commit" },
      { actor: 1, label: "Push", transfer: "le commit", tool: "GitHub" },
      { actor: 2, label: "Build", transfer: "le dépôt", tool: "Vercel" },
      { actor: 2, label: "En ligne", transfer: "le site" },
      { actor: 0, label: "Test", transfer: "l'adresse", humanValidation: true },
    ]}
  />;
}

export function InfrastructurePriveeDiagram() {
  return <Rings
    title="Ce qui entoure ton serveur"
    description="Un VPS garde ton agent disponible, à condition d'entretenir chaque couche autour de lui."
    legend="Tailscale ne remplace ni les mises à jour ni le pare-feu : chaque couche compte."
    ariaLabel="Autour de l'agent installé sur un VPS, cinq couches : un compte sans droits administrateur, une clé SSH, le réseau privé Tailscale mis en avant, un pare-feu qui ferme les accès inutiles et une sauvegarde pour récupérer."
    accent={EM}
    core="Agent"
    accentIndex={2}
    rings={[
      { label: "Compte", detail: "Sans droits administrateur" },
      { label: "Clé SSH", detail: "Pas de mot de passe" },
      { label: "Tailscale", detail: "Administration hors du web" },
      { label: "Pare-feu", detail: "Accès inutiles fermés" },
      { label: "Sauvegarde", detail: "Une voie de récupération" },
    ]}
  />;
}

export function RemiseDesClesDiagram() {
  return <Steps
    title="Le client repart avec les clés"
    description="Exemple : Maison Lila reçoit chaque compte à son nom, plus la procédure pour continuer sans toi."
    legend="Le site est remis quand la fleuriste publie seule un bouquet de test."
    ariaLabel="Maison Lila récupère le dépôt dans son organisation GitHub, le projet Vercel à son nom, son domaine, la mesure avec Search Console et PostHog, et la procédure de reprise, mise en avant."
    accent={EM}
    accentIndex={4}
    items={[
      { label: "Dépôt", detail: "Son organisation", tools: ["GitHub"] },
      { label: "Hébergement", detail: "Projet à son nom", tools: ["Vercel"] },
      { label: "Domaine", detail: "maisonlila.fr reste à elle" },
      { label: "Mesure", detail: "Recherche et visites", tools: ["Search Console", "PostHog"] },
      { label: "Procédure", detail: "Publier, restaurer, appeler" },
    ]}
  />;
}
