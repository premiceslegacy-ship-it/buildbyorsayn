import { BigNumber, Fork, Workflow } from "../kit";
import type { HandcraftedVisual } from "../coffre/types";

const EM = "#22d96e";

function ChaqueObjetSaMaisonDiagram() {
  return <Fork
    title="Chaque information a sa maison"
    description="Le format suit la responsabilité : méthode, objet vivant, photo datée ou vue de recherche."
    legend="Une seule source fait foi, les autres sont des copies à invalider."
    ariaLabel="Pour ranger une information : en Markdown si c'est une méthode, dans une base si c'est un dossier qui change d'état, en CSV si c'est une photo datée, dans un index si c'est une vue pour chercher."
    accent={EM}
    situation="Où ranger cette information ?"
    outcomes={[
      { label: "Markdown", condition: "Une méthode qui se relit" },
      { label: "Base", condition: "Un dossier qui change d'état" },
      { label: "CSV", condition: "Une photo datée" },
      { label: "Index", condition: "Une vue pour chercher" },
    ]}
  />;
}

function DeuxHorlogesDiagram() {
  return <BigNumber
    title="Deux dates, deux questions"
    description="Exemple : un tarif fournisseur contrôlé le 2 octobre et valable jusqu'au 31 décembre."
    legend="La date de lecture ne dit pas combien de temps l'information reste vraie."
    ariaLabel="Exemple d'un tarif fournisseur : vu le 2 octobre, date du contrôle, et valable jusqu'au 31 décembre, date fixée par la règle ; après cette date, il faut relire la source."
    accent={EM}
    before={{ value: "2 oct.", label: "Vu le : quand tu as contrôlé" }}
    after={{ value: "31 déc.", label: "Valable jusqu'à : la règle l'accepte" }}
    sentence="Passé le 31 décembre, relis la source avant de t'en servir."
  />;
}

function BibliothequeEtPorteDiagram() {
  return <Workflow
    title="Retrouver ne donne pas le droit"
    description="Le RAG retrouve, MCP ouvre une porte, le serveur contrôle encore l'identité."
    legend="Quand une source change, vide aussi caches, index et réponses gardées."
    ariaLabel="Ton agent retrouve un passage, puis demande une action par MCP ; le serveur vérifie l'identité et l'action avant de l'autoriser."
    accent={EM}
    actors={["Ton agent", "Le serveur"]}
    accentIndex={2}
    steps={[
      { actor: 0, label: "Retrouver", tool: "Hermes Agent" },
      { actor: 0, label: "Demander", transfer: "un passage" },
      { actor: 1, label: "Autoriser", transfer: "une demande" },
    ]}
  />;
}

export const doctrine15 = [
  { name: "ChaqueObjetSaMaison", kind: "schema", chapter: "entreprise-formats.md", component: ChaqueObjetSaMaisonDiagram },
  { name: "DeuxHorloges", kind: "schema", chapter: "entreprise-formats.md", component: DeuxHorlogesDiagram },
  { name: "BibliothequeEtPorte", kind: "schema", chapter: "entreprise-formats.md", component: BibliothequeEtPorteDiagram },
] as const satisfies readonly HandcraftedVisual[];
