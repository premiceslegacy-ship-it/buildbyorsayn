import { Compare, FileCard, Steps, Workflow } from "../kit";
import type { HandcraftedVisual } from "./types";

const EM = "#22d96e";

export function OffreVersFilmDiagram() {
  return <Workflow
    title="De l'offre au film"
    description="Le film part de la phrase de l'offre, passe par les scènes et les médias, puis par ton regard."
    legend="Commence par l'offre : avant, ce que tu changes, après. Les effets viennent ensuite."
    ariaLabel="Quatre passages : tu écris la phrase de l'offre, tu dessines les scènes, les outils fabriquent les médias à partir du storyboard, puis tu relis le film terminé avant de le montrer. La phrase de l'offre est mise en avant."
    accent={EM}
    actors={["Toi", "Les outils"]}
    accentIndex={0}
    steps={[
      { actor: 0, label: "Phrase d'offre" },
      { actor: 0, label: "Scènes", transfer: "avant, après" },
      { actor: 1, label: "Médias", transfer: "storyboard" },
      { actor: 0, label: "Relecture", transfer: "film monté", humanValidation: true },
    ]}
  />;
}

export function StoryboardDePreuveDiagram() {
  return <FileCard
    title="Une preuve par scène"
    description="Exemple : le storyboard d'un portail pour syndics, où chaque scène porte une preuve visible."
    legend="Si une scène n'a pas de preuve, coupe-la ou remplace-la."
    ariaLabel="Un storyboard en trois scènes : trois demandes dispersées par mail, appel et message, puis la fiche qui se remplit, puis la gestionnaire qui valide la pièce manquante. Chaque scène a sa preuve annotée : le problème, le passage, la main."
    accent={EM}
    filename="storyboard.md"
    lines={[
      { text: "# Film du portail, trois scènes", tone: "heading" },
      { text: "Scène 1 : trois demandes dispersées" },
      { text: "Preuve : mail, appel, message", tone: "muted" },
      { text: "Scène 2 : la fiche se remplit" },
      { text: "Preuve : une seule fiche à jour", tone: "muted" },
      { text: "Scène 3 : la gestionnaire valide" },
      { text: "Preuve : la pièce manquante vue", tone: "muted" },
    ]}
    annotations={[
      { line: 3, label: "Le problème" },
      { line: 5, label: "Le passage" },
      { line: 7, label: "La main qui valide" },
    ]}
  />;
}

export function DeuxEcoutesDiagram() {
  return <Steps
    title="Deux revues, deux sens"
    description="Après le contrôle technique, tu regardes le film sans le son, puis tu l'écoutes sans l'image."
    legend="Le contrôle trouve un fichier cassé, ton regard juge si le film explique l'offre."
    ariaLabel="Trois revues du film terminé : le contrôle technique trouve un fichier cassé, la revue sans le son vérifie le récit visuel, la revue sans l'image juge la voix et la musique. La revue sans le son est mise en avant."
    accent={EM}
    accentIndex={1}
    items={[
      { label: "Contrôle", detail: "Trouve un fichier cassé" },
      { label: "Sans le son", detail: "Le récit visuel tient seul" },
      { label: "Sans l'image", detail: "Voix et musique justes" },
    ]}
  />;
}

export function FormatsQuiRespirentDiagram() {
  return <Compare
    title="Recompose chaque format"
    description="Une vidéo verticale ne reprend pas le centre de la version large : mots et objets changent de place."
    legend="Choisis le format avant de produire les médias pour ne pas couper la preuve."
    ariaLabel="À gauche, recadrer le centre : la preuve coupée en vertical, un texte trop petit en carré, un format choisi au dernier moment. À droite, recomposer : mots et objets replacés, une idée par plan, le format choisi avant les médias."
    accent={EM}
    beforeTitle="Recadrer le centre"
    afterTitle="Recomposer"
    rows={[
      { before: "Vertical : preuve coupée", after: "Vertical : objets replacés" },
      { before: "Carré : texte trop petit", after: "Carré : une idée par plan" },
      { before: "Format choisi à la fin", after: "Format choisi avant" },
    ]}
  />;
}

export const b1_s4b_VISUALS = [
  { name: "OffreVersFilm", kind: "schema", chapter: "b1-s4b", component: OffreVersFilmDiagram },
  { name: "StoryboardDePreuve", kind: "schema", chapter: "b1-s4b", component: StoryboardDePreuveDiagram },
  { name: "DeuxEcoutes", kind: "schema", chapter: "b1-s4b", component: DeuxEcoutesDiagram },
  { name: "FormatsQuiRespirent", kind: "schema", chapter: "b1-s4b", component: FormatsQuiRespirentDiagram },
] as const satisfies readonly HandcraftedVisual[];
