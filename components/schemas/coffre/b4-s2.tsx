import { Compare, FileCard, Fork, Steps, Workflow } from "../kit";
import type { HandcraftedVisual } from "./types";

const EM = "#22d96e";

export function SkillsEnDossiersParentsDiagram() {
  return <Fork
    title="Le dossier design oriente"
    description="Un dossier parent envoie vers le bon skill proche, sans recopier leurs instructions."
    legend="Comme un standard téléphonique : il passe l'appel au bon service, sans faire son travail."
    ariaLabel="Une demande de design arrive dans le dossier parent Design. Pour une marque à créer, il oriente vers le skill identité. Pour un écran à dessiner, vers le skill interface. Pour un rendu à relire, vers le skill revue visuelle."
    accent={EM}
    situation="Une demande de design arrive"
    outcomes={[
      { label: "Identité", condition: "Une marque à créer" },
      { label: "Interface", condition: "Un écran à dessiner" },
      { label: "Revue visuelle", condition: "Un rendu à relire" },
    ]}
  />;
}

export function ChaineSkillsProduitDiagram() {
  return <Workflow
    title="Un fichier sur chaque flèche"
    description="Exemple : chaque skill remet un fichier nommé et versionné au skill suivant."
    legend="Si une flèche dit « contexte » ou « stratégie », remplace-la par un vrai fichier."
    ariaLabel="Une chaîne de cinq skills. La recherche remet RECHERCHE.md au cadrage. Le cadrage remet BRIEF.md en version 2 au design. Le design remet les écrans en version 1 à la construction. La construction remet un produit testé, que tu valides avant la mise en ligne."
    accent={EM}
    actors={["Tes skills", "Toi"]}
    accentIndex={2}
    steps={[
      { actor: 0, label: "Recherche" },
      { actor: 0, label: "Cadrage", transfer: "RECHERCHE.md" },
      { actor: 0, label: "Design", transfer: "BRIEF.md v2" },
      { actor: 0, label: "Construction", transfer: "écrans v1" },
      { actor: 1, label: "Mise en ligne", transfer: "produit testé", humanValidation: true },
    ]}
  />;
}

export function PassationAnnoteeMockup() {
  return <FileCard
    title="Une passation qui répond d'avance"
    description="Exemple : le cadrage passe le brief au design avec tout ce qu'il faut pour continuer."
    legend="Le destinataire reçoit de quoi continuer sans inventer, pas le projet entier."
    ariaLabel="Un fichier de passation du cadrage vers le design. Il nomme le livrable BRIEF.md, sa version 3 qui remplace la 2, la décision d'une seule offre en page d'accueil, le prix qui reste à confirmer, le contrôle déjà fait et la personne destinataire."
    accent={EM}
    filename="PASSATION.md"
    lines={[
      { text: "# Du cadrage vers le design", tone: "heading" },
      { text: "Livrable : BRIEF.md" },
      { text: "Version : v3, remplace la v2" },
      { text: "Décidé : une seule offre en accueil" },
      { text: "À confirmer : le prix affiché" },
      { text: "Contrôle fait : brief relu et validé" },
      { text: "Pour : la personne qui dessine" },
    ]}
    annotations={[
      { line: 2, label: "Quel fichier ouvrir" },
      { line: 3, label: "Quelle version lire" },
      { line: 5, label: "Ce qui reste ouvert" },
      { line: 6, label: "Ce qui est déjà vérifié" },
      { line: 7, label: "Pour qui" },
    ]}
  />;
}

export function UneSourceOuCinqCopiesDiagram() {
  return <Compare
    title="Une source, pas cinq copies"
    description="Le même brief recopié dans cinq dossiers, ou gardé à un seul endroit que tous lisent."
    legend="Chaque ligne montre ce qui se passe le jour où une phrase du brief change."
    ariaLabel="Comparaison. Avec cinq copies du brief, une phrase change dans quatre copies seulement, chaque dossier croit avoir raison et les contradictions arrivent en silence. Avec une source et cinq liens, la phrase change à un seul endroit, chaque dossier lit la même version et n'ajoute que ses propres décisions."
    accent={EM}
    beforeTitle="Cinq copies du brief"
    afterTitle="Une source, cinq liens"
    rows={[
      { before: "Corrigé dans quatre copies", after: "Corrigé à un seul endroit" },
      { before: "Chaque dossier croit avoir raison", after: "Chaque dossier lit la même version" },
      { before: "Contradictions en silence", after: "Chacun ajoute ses seules décisions" },
    ]}
  />;
}

export function CabinetComptableDeBoutEnBoutDiagram() {
  return <Steps
    title="Toute la chaîne d'un cabinet comptable"
    description="Exemple : la chaîne complète d'un logiciel qui prépare les rendez-vous d'un cabinet."
    legend="Chaque étape reprend la décision d'avant au lieu de la réinventer."
    ariaLabel="Six étapes pour un cabinet comptable qui veut préparer ses rendez-vous. La recherche décrit les questions fréquentes. Le cadrage choisit le premier usage. Le design dessine le parcours. La construction relie les dossiers. La qualité vérifie les comptes et les refus. La prise en main reprend seulement les fonctions livrées."
    accent={EM}
    accentIndex={5}
    items={[
      { label: "Recherche", detail: "Les questions fréquentes" },
      { label: "Cadrage", detail: "Le premier usage choisi" },
      { label: "Design", detail: "Le parcours dessiné" },
      { label: "Construction", detail: "Les dossiers reliés" },
      { label: "Qualité", detail: "Comptes et refus vérifiés" },
      { label: "Prise en main", detail: "Seulement ce qui est livré" },
    ]}
  />;
}

export const b4_s2_VISUALS = [
  { name: "SkillsEnDossiersParents", kind: "schema", chapter: "b4-s2", component: SkillsEnDossiersParentsDiagram },
  { name: "ChaineSkillsProduit", kind: "schema", chapter: "b4-s2", component: ChaineSkillsProduitDiagram },
  { name: "PassationAnnotee", kind: "maquette", chapter: "b4-s2", component: PassationAnnoteeMockup },
  { name: "UneSourceOuCinqCopies", kind: "schema", chapter: "b4-s2", component: UneSourceOuCinqCopiesDiagram },
  { name: "CabinetComptableDeBoutEnBout", kind: "schema", chapter: "b4-s2", component: CabinetComptableDeBoutEnBoutDiagram },
] as const satisfies readonly HandcraftedVisual[];
