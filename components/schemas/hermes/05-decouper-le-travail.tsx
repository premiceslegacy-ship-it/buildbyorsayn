import { Compare, FileCard, Workflow } from "../kit";

const EM = "#22d96e";

export function DecompositionDiagram() {
  return <Compare
    title="Une grosse mission, des petits lots"
    description="Exemple : « gère mes prospects » mélange recherche, tri, réponse, devis et relance."
    legend="Quand le résultat est mauvais, tu sais enfin quel lot corriger."
    ariaLabel="À gauche, la mission Gère mes prospects mélange tout, ne laisse aucune sortie visible, cache l'erreur et ne permet pas de reprendre. À droite, les petits lots ont un résultat chacun, une sortie à ouvrir, une erreur localisée et un responsable."
    accent={EM}
    beforeTitle="« Gère mes prospects »"
    afterTitle="Petits lots"
    rows={[
      { before: "Tout est mélangé", after: "Un lot par résultat" },
      { before: "Aucune sortie visible", after: "Une sortie à ouvrir" },
      { before: "Erreur introuvable", after: "Le lot fautif se voit" },
      { before: "Personne ne reprend", after: "Un responsable par lot" },
    ]}
  />;
}

export function DevisEnQuatreLotsDiagram() {
  return <Workflow
    title="Un devis en quatre lots"
    description="Chaque lot rend un objet que tu peux ouvrir : liste des pièces, fiche besoin, brouillon."
    legend="Tu découpes par résultat, pas par personnage."
    ariaLabel="Ton agent vérifie les pièces reçues sur WhatsApp, relève les besoins à partir de la liste des pièces, prépare un brouillon dans Gmail à partir de la fiche besoin, puis tu valides le devis."
    accent={EM}
    actors={["Ton agent", "Toi"]}
    steps={[
      { actor: 0, label: "Pièces vérifiées", tool: "WhatsApp" },
      { actor: 0, label: "Besoins relevés", tool: "Hermes Agent", transfer: "liste des pièces" },
      { actor: 0, label: "Brouillon prêt", tool: "Gmail", transfer: "fiche besoin" },
      { actor: 1, label: "Devis validé", humanValidation: true, transfer: "brouillon" },
    ]}
    accentIndex={3}
  />;
}

export function CarteContratDuLotDiagram() {
  return <FileCard
    title="Six lignes par lot"
    description="Comme un bon de travail, ces six lignes disent quoi faire ici, avec quelles pièces et qui signe."
    legend="Si deux lots lisent la même donnée, ils pointent vers la même source."
    ariaLabel="Le contrat du lot Vérifier les pièces contient six lignes : l'entrée, la sortie, la source qui fait foi, l'interdit, la personne qui valide et la raison d'arrêter."
    accent={EM}
    filename="lot-1-pieces.md"
    lines={[
      { text: "# Lot 1 : vérifier les pièces", tone: "heading" },
      { text: "Entrée : message et photos du prospect" },
      { text: "Sortie : pièces reçues et pièces manquantes" },
      { text: "Source : le message d'origine" },
      { text: "Interdit : aucun envoi, aucun prix" },
      { text: "Validation : responsable du devis" },
      { text: "Arrêt : deux mesures contradictoires" },
    ]}
    annotations={[
      { line: 3, label: "Ce qui doit sortir" },
      { line: 4, label: "Une seule source" },
      { line: 7, label: "Quand s'arrêter" },
    ]}
  />;
}
