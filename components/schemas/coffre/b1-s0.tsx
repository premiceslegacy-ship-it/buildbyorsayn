import { Compare, Curves, FileCard } from "../kit";
import type { HandcraftedVisual } from "./types";

const EM = "#22d96e";

export function MemeDemandeDeuxFutursDiagram() {
  return <Curves
    title="Même demande, deux futurs"
    description="Exemple illustratif : deux entreprises reçoivent la même demande de devis, puis leur écart grandit."
    legend="L'écart ne vient pas du premier devis, il vient de ce que chacune garde ensuite."
    ariaLabel="Deux courbes partent du même point au premier projet. L'entreprise qui garde ses corrections monte à chaque projet, celle qui recommence tout reste à plat jusqu'au cinquième projet."
    accent={EM}
    labels={["Projet 1", "Projet 2", "Projet 3", "Projet 4", "Projet 5"]}
    series={[
      { name: "Garde ses choix", values: [1, 2, 3.2, 4.6, 6.2], accent: true },
      { name: "Recommence tout", values: [1, 1.1, 1, 1.1, 1] },
    ]}
    annotations={[
      { series: 0, point: 2, label: "Corrections gardées" },
      { series: 1, point: 2, label: "Page blanche" },
    ]}
  />;
}

export function CapitalQuiResteDiagram() {
  return <FileCard
    title="Ce qui reste après la mission"
    description="Exemple : le dossier de chantier d'un électricien garde quatre choses concrètes pour le devis suivant."
    legend="Si l'outil change demain, ce dossier reste à toi."
    ariaLabel="Un dossier de chantier d'électricien garde quatre lignes : les mots exacts du client, le choix validé, l'erreur comprise devenue une règle, et la photo du tableau rangée pour le prochain devis."
    accent={EM}
    filename="dossier-chantier.md"
    lines={[
      { text: "# Chantier, tableau électrique", tone: "heading" },
      { text: "Mots du client : « ça saute le soir »" },
      { text: "Choix validé : ligne du four séparée" },
      { text: "Erreur comprise : toujours noter la mesure" },
      { text: "Fichier utile : photo du tableau" },
    ]}
    annotations={[
      { line: 2, label: "Ses mots exacts" },
      { line: 3, label: "Ce qui a été tranché" },
      { line: 4, label: "Devenue une règle simple" },
      { line: 5, label: "Prêt pour le prochain devis" },
    ]}
  />;
}

export function SceneAvantOutilDiagram() {
  return <Compare
    title="Regarde avant de proposer"
    description="Avant tout outil, trois questions sur la scène de travail évitent de rater le vrai blocage."
    legend="Tant que tu ne sais pas qui tranche, ne propose encore rien."
    ariaLabel="À gauche, proposer tout de suite : une démo brillante, un outil choisi d'avance, le vrai blocage raté. À droite, regarder d'abord : ce qui déclenche le travail, où arrivent les informations, qui tranche."
    accent={EM}
    beforeTitle="Proposer tout de suite"
    afterTitle="Regarder d'abord"
    rows={[
      { before: "Une démo brillante", after: "Ce qui déclenche le travail" },
      { before: "Un outil choisi d'avance", after: "Où arrivent les infos" },
      { before: "Le vrai blocage raté", after: "Qui tranche" },
    ]}
  />;
}

export const b1_s0_VISUALS = [
  { name: "MemeDemandeDeuxFuturs", kind: "schema", chapter: "b1-s0", component: MemeDemandeDeuxFutursDiagram },
  { name: "CapitalQuiReste", kind: "schema", chapter: "b1-s0", component: CapitalQuiResteDiagram },
  { name: "SceneAvantOutil", kind: "schema", chapter: "b1-s0", component: SceneAvantOutilDiagram },
] as const satisfies readonly HandcraftedVisual[];
