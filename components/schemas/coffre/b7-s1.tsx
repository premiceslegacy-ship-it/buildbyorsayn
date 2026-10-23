import { Compare, FileCard, Fork, Steps } from "../kit";
import type { HandcraftedVisual } from "./types";

const EM = "#22d96e";

export function DeuxFoisPuisObserverDiagram() {
  return <Steps
    title="Observe avant d'écrire"
    description="Une action qui revient deux fois mérite d'abord un regard, pas encore un document."
    legend="Écris le travail tel qu'il se passe, pas tel qu'il devrait se passer."
    ariaLabel="Quatre étapes. Première fois, tu le fais de tête. Deuxième fois, tu vois que ça revient. Observe, tu notes ce que tu ouvres et ce que tu décides, étape mise en avant. Écris, la SOP vient après."
    accent={EM}
    accentIndex={2}
    items={[
      { label: "Première fois", detail: "Tu le fais de tête" },
      { label: "Deuxième fois", detail: "Tu vois que ça revient" },
      { label: "Observe", detail: "Note ce que tu ouvres et décides" },
      { label: "Écris", detail: "La SOP vient après" },
    ]}
  />;
}

export function AnatomieSopDiagram() {
  return <Steps
    title="Six questions, une SOP"
    description="Une SOP complète répond à six questions, du contexte jusqu'à la reprise après un échec."
    legend="Chaque étape commence par un verbe et finit sur une preuve."
    ariaLabel="Les six parties d'une SOP. Contexte, quand et pourquoi la suivre. Entrées, accès, environnement et version. Étapes, un verbe par geste. Pièges, ce qui casse souvent. Résultat, la preuve que c'est fini, partie mise en avant. Reprise, que faire si ça échoue."
    accent={EM}
    accentIndex={4}
    items={[
      { label: "Contexte", detail: "Quand et pourquoi la suivre" },
      { label: "Entrées", detail: "Accès, environnement, version" },
      { label: "Étapes", detail: "Un verbe par geste" },
      { label: "Pièges", detail: "Ce qui casse souvent" },
      { label: "Résultat", detail: "La preuve que c'est fini" },
      { label: "Reprise", detail: "Que faire si ça échoue" },
    ]}
  />;
}

export function TesterLeSiteAvantApresDiagram() {
  return <Compare
    title="Un verbe vague devient un parcours"
    description="Trois consignes vagues réécrites pour que n'importe qui fasse le même test."
    legend="Une bonne consigne nomme le geste et le résultat attendu."
    ariaLabel="Trois consignes avant et après. Tester le site devient envoie une demande et relis la confirmation. Vérifier les accès devient connecte le compte client et vérifie qu'il ne voit que son projet. Préparer la livraison devient note le domaine, les accès, la sauvegarde et le contact."
    accent={EM}
    beforeTitle="Consigne vague"
    afterTitle="Parcours visible"
    rows={[
      { before: "Tester le site", after: "Envoie une demande, relis la confirmation" },
      { before: "Vérifier les accès", after: "Connecte le client, il ne voit que son projet" },
      { before: "Préparer la livraison", after: "Note domaine, accès, sauvegarde et contact" },
    ]}
  />;
}

export function NoteSopOuSkillDiagram() {
  return <Fork
    title="Note, SOP ou skill"
    description="La forme du document suit la stabilité du geste et le jugement qu'il demande."
    legend="Choisis la forme qui ressemble au travail, pas celle qui impressionne."
    ariaLabel="Un geste revient dans ton travail. S'il change encore chaque semaine, garde une note. Si les mêmes étapes reviennent, écris une SOP. Si le bon choix dépend du cas, prépare un skill."
    accent={EM}
    situation="Un geste revient dans ton travail"
    outcomes={[
      { label: "Note", condition: "Il change encore chaque semaine" },
      { label: "SOP", condition: "Les mêmes étapes reviennent" },
      { label: "Skill", condition: "Le bon choix dépend du cas" },
    ]}
  />;
}

export function SopLivraisonAnnoteeDiagram() {
  return <FileCard
    title="Une SOP de livraison"
    description="Exemple : la livraison d'un site client, où chaque étape porte sa preuve et sa reprise."
    legend="Fais-la suivre par quelqu'un d'autre : chaque question révèle un trou."
    ariaLabel="Un fichier de procédure pour livrer un site client. Les prérequis viennent d'abord. Le parcours critique est testé sur mobile, avec la confirmation reçue comme preuve. La reprise remet la version précédente en cas d'échec, et un responsable est nommé."
    accent={EM}
    filename="livrer-un-site.md"
    tool="Vercel"
    lines={[
      { text: "# Livrer un site client", tone: "heading" },
      { text: "Prérequis : accès Vercel, version validée" },
      { text: "1. Vérifie les variables de production" },
      { text: "2. Branche le domaine, attends le HTTPS" },
      { text: "3. Envoie une demande depuis un mobile" },
      { text: "   Preuve : confirmation reçue" },
      { text: "4. Transmets les accès au client" },
      { text: "5. Note la sauvegarde et sa date" },
      { text: "Si échec : remets la version précédente" },
      { text: "Responsable : toi, joignable le jour J" },
    ]}
    annotations={[
      { line: 2, label: "Les prérequis avant tout" },
      { line: 5, label: "Le parcours critique, sur mobile" },
      { line: 6, label: "La preuve que l'étape est finie" },
      { line: 9, label: "La reprise si quelque chose casse" },
      { line: 10, label: "La personne à appeler" },
    ]}
  />;
}

export const b7_s1_VISUALS = [
  { name: "DeuxFoisPuisObserver", kind: "schema", chapter: "b7-s1", component: DeuxFoisPuisObserverDiagram },
  { name: "AnatomieSop", kind: "schema", chapter: "b7-s1", component: AnatomieSopDiagram },
  { name: "TesterLeSiteAvantApres", kind: "schema", chapter: "b7-s1", component: TesterLeSiteAvantApresDiagram },
  { name: "NoteSopOuSkill", kind: "schema", chapter: "b7-s1", component: NoteSopOuSkillDiagram },
  { name: "SopLivraisonAnnotee", kind: "maquette", chapter: "b7-s1", component: SopLivraisonAnnoteeDiagram },
] as const satisfies readonly HandcraftedVisual[];
