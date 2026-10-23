import { Compare, Fork, Ladder } from "../kit";

const EM = "#22d96e";

export function CeQueTuPossedesDiagram() {
  return <Compare
    title="Où vit ton dernier projet ?"
    description="Regarde où se trouvent le brief, les choix, le code, les accès et la procédure de reprise."
    legend="Chaque ligne restée à gauche sera à reconstruire au prochain changement d'outil."
    ariaLabel="Dans le chat, le brief se perd dans le fil, les choix sont à retrouver à la main, le code reste chez l'outil et aucune procédure n'existe. Dans ton dossier, il y a brief.md, choix.md daté, le dépôt GitHub et reprise.md."
    accent={EM}
    beforeTitle="Dans le chat"
    afterTitle="Dans ton dossier"
    rows={[
      { before: "Le brief, perdu dans le fil", after: "brief.md" },
      { before: "Les choix, à retrouver à la main", after: "choix.md, daté" },
      { before: "Le code, chez l'outil", after: "Le dépôt GitHub" },
      { before: "Aucune procédure de reprise", after: "reprise.md" },
    ]}
  />;
}

export function PremierProjetVersMethodeDiagram() {
  return <Ladder
    title="Chaque projet ajoute une marche"
    description="Exemple d'Hugo, vidéaste : ce qu'il range après chaque vidéo client devient un skill réutilisable."
    legend="Le skill prépare et rappelle les contrôles : Hugo garde le client et le montage."
    ariaLabel="Cinq marches montent du premier projet à la méthode : les questions de brief, les règles de montage, les exports de référence, la liste de contrôles, puis le skill, mis en avant."
    accent={EM}
    lowLabel="Premier projet"
    highLabel="Méthode"
    accentIndex={4}
    rungs={[
      { label: "Questions", detail: "Celles de son brief client" },
      { label: "Règles", detail: "Ses règles de montage" },
      { label: "Exemples", detail: "Ses exports de référence" },
      { label: "Contrôles", detail: "Sa liste avant livraison" },
      { label: "Skill", detail: "Prépare la structure du projet" },
    ]}
  />;
}

export function DeuxPortesDuSeuilDiagram() {
  return <Fork
    title="Deux portes après les Fondations"
    description="Tu peux repartir d'une conversation neuve à chaque projet, ou garder ce que tu as déjà construit."
    legend="La porte verte demande du travail : relire, trier et retirer ce qui ne tient pas."
    ariaLabel="Ton prochain projet ouvre deux portes : repartir de zéro dans une nouvelle conversation avec les mêmes erreurs, ou garder ta méthode en ajoutant une règle après chaque mission, chemin conseillé."
    accent={EM}
    situation="Ton prochain projet"
    outcomes={[
      { label: "Repartir de zéro", condition: "Nouvelle conversation, mêmes erreurs", rejected: true },
      { label: "Garder ta méthode", condition: "Une règle de plus après chaque mission", recommended: true },
    ]}
  />;
}
