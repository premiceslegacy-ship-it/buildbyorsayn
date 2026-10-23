import { Ladder, Steps, WebPage, Workflow } from "../kit";

const EM = "#22d96e";

export function CarteDuMessageDiagram() {
  return <Steps
    title="Ta carte en cinq cases"
    description="Exemple : un plaquiste. Chaque case répond à la question que le lecteur se pose à ce moment-là."
    legend="Si une case reste vide, un adjectif viendra la remplir : complète-la avant d'écrire."
    ariaLabel="La carte du message d'un plaquiste suit cinq cases : le moment, il pose une cloison quand un client appelle ; le problème, les photos arrivent sans nom de chantier ; le changement, une demande complète d'un coup ; le comment, un formulaire avec photos ; le geste, préparer ma demande. Le moment est mis en avant."
    accent={EM}
    accentIndex={0}
    items={[
      { label: "Moment", detail: "Il pose une cloison, le client appelle" },
      { label: "Problème", detail: "Photos sans nom de chantier" },
      { label: "Changement", detail: "Une demande complète d'un coup" },
      { label: "Comment", detail: "Un formulaire avec photos" },
      { label: "Geste", detail: "« Préparer ma demande »" },
    ]}
  />;
}

export function MemeOffreQuatreMomentsDiagram() {
  return <Ladder
    title="Le texte suit ce que la personne sait"
    description="Plus la personne connaît son problème, moins tu racontes la scène et plus tu donnes de détails."
    legend="Repère la marche de ton lecteur, puis écris seulement ce qu'elle demande."
    ariaLabel="Quatre marches : un post vu au hasard montre la scène, une page ouverte après une recherche explique le chemin, la comparaison détaille tes limites et conditions, mise en avant, et le devis relu répond aux dernières questions."
    accent={EM}
    lowLabel="Découvre le problème"
    highLabel="Prête à choisir"
    accentIndex={2}
    rungs={[
      { label: "Découvre", detail: "Post vu au hasard : la scène" },
      { label: "Cherche", detail: "Page après recherche : le chemin" },
      { label: "Compare", detail: "Tes limites et tes conditions" },
      { label: "Décide", detail: "Devis relu : les dernières réponses" },
    ]}
  />;
}

export function MecanismeVisibleDiagram() {
  return <Workflow
    title="Montre comment ça marche"
    description="Exemple de Mehdi, réparateur de vélos : ce qui entre, les étapes, qui valide et ce qui ressort."
    legend="Remplace « on optimise » par ces quatre cartes : le lecteur voit le travail réel."
    ariaLabel="Le client dépose son vélo, l'atelier fait le diagnostic et rédige le devis, le client donne son accord, mis en avant, puis l'atelier répare et rend le vélo."
    accent={EM}
    actors={["Client", "Atelier"]}
    accentIndex={2}
    steps={[
      { actor: 0, label: "Dépôt" },
      { actor: 1, label: "Diagnostic", transfer: "le vélo" },
      { actor: 0, label: "Accord", transfer: "le devis", humanValidation: true },
      { actor: 1, label: "Réparation", transfer: "le feu vert" },
    ]}
  />;
}

export function PreuveAuBonEndroitDiagram() {
  return <WebPage
    title="Chaque doute trouve sa preuve"
    description="Exemple : la page de Mehdi. Chaque preuve est posée juste à côté de la question qu'elle règle."
    legend="Pas de bloc « avis » à part : la preuve vit près de la phrase qu'elle soutient."
    ariaLabel="La page d'un atelier vélo place une fiche de diagnostic réelle sur l'image pour répondre à ton travail, une scène précise dans le titre pour répondre à mon cas, et le devis avant réparation dans le sous-titre pour répondre à pour moi."
    accent={EM}
    page={{
      nav: "Atelier de Mehdi",
      heading: "Ton vélo fait un bruit quand tu forces ? Je le trouve sous 48 h",
      subtitle: "Dépose-le. Je vérifie, tu valides le devis avant que je touche à quoi que ce soit.",
      button: "Demander un diagnostic",
      photo: "velo",
    }}
    annotations={[
      { number: 1, target: "image", label: "Ton travail ? Une vraie fiche remise", why: "Une photo de l'atelier répond à « est‑ce du vrai travail ? » avant toute phrase.", alt: "Une photo de la fiche de diagnostic remise au client." },
      { number: 2, target: "heading", label: "Mon cas ? Sa scène exacte", why: "Le bruit que le client a déjà entendu : il se reconnaît en une ligne.", alt: "Le nom du vélo ou du modèle." },
      { number: 3, target: "subtitle", label: "Pour moi ? Ce qui se passe ensuite", why: "Déposer, vérifier, valider le devis, réparer : les quatre gestes dans l'ordre.", alt: "Un délai : réponse sous 48 h." },
    ]}
  />;
}
