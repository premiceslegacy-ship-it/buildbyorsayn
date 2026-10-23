import { Compare, Fork, Ladder, Steps } from "../kit";

const EM = "#22d96e";

export function CroyanceVersQuestionDiagram() {
  return <Fork
    title="Ouvre la croyance"
    description="Une phrase fermée devient trois questions que tu peux vérifier."
    ariaLabel="La croyance marché saturé s'ouvre sur qui, quel moment et quel problème, mis en avant."
    accent={EM}
    situation="Marché saturé"
    outcomes={[
      { label: "Qui ?", condition: "Une personne réelle" },
      { label: "Quel moment ?", condition: "Une scène précise" },
      { label: "Quel problème ?", condition: "Une gêne vécue", recommended: true },
    ]}
  />;
}

export function PetitTestTroisSortiesDiagram() {
  return <Fork
    title="Un test, trois sorties"
    description="Le test choisit une direction au lieu de défendre ton idée."
    ariaLabel="Un petit test mène à continuer, modifier ou arrêter, avec modifier mis en avant."
    accent={EM}
    situation="Petit test"
    outcomes={[
      { label: "Continuer", condition: "La réponse est nette" },
      { label: "Modifier", condition: "Un élément bloque", recommended: true },
      { label: "Arrêter", condition: "Le besoin manque", rejected: true },
    ]}
  />;
}

export function UneSeuleChoseChangeDiagram() {
  return <Compare
    title="Change une seule chose"
    description="Les deux essais gardent la même base pour révéler la différence."
    ariaLabel="Deux essais gardent la même personne, la même offre et le même canal, puis changent seulement le message."
    accent={EM}
    beforeTitle="Essai 1"
    afterTitle="Essai 2"
    rows={[
      { before: "Même personne", after: "Même personne" },
      { before: "Même offre", after: "Même offre" },
      { before: "Même canal", after: "Même canal" },
      { before: "Ancien message", after: "Nouveau message" },
    ]}
  />;
}

export function EchelleEngagementDiagram() {
  return <Ladder
    title="Le geste parle plus fort"
    description="Chaque marche demande un engagement plus réel que la précédente."
    ariaLabel="Cinq marches montent de intéressé à paie, avec demande mise en avant."
    accent={EM}
    lowLabel="Parole"
    highLabel="Action"
    accentIndex={3}
    rungs={[
      { label: "Intéressé", detail: "Il le dit" },
      { label: "Raconte", detail: "Il ouvre sa journée" },
      { label: "Partage", detail: "Il donne un élément" },
      { label: "Demande", detail: "Il veut avancer" },
      { label: "Paie", detail: "Il choisit" },
    ]}
  />;
}

export function CeQueTuGardesDiagram() {
  return <Steps
    title="Ton prochain projet commence ici"
    description="Chaque test remplit un dossier qui sert encore demain."
    ariaLabel="Question, réponse, décision et fichiers préparent ensemble le prochain projet."
    accent={EM}
    accentIndex={4}
    items={[
      { label: "Question", detail: "Ce que tu vérifies" },
      { label: "Réponse", detail: "Ce que tu entends" },
      { label: "Décision", detail: "Ce que tu choisis" },
      { label: "Fichiers", detail: "Ce que tu ranges" },
      { label: "Prochain projet", detail: "Tu repars plus haut" },
    ]}
  />;
}
