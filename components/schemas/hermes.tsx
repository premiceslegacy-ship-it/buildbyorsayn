import "server-only";

import { Diagram, Edge, Node } from "./primitives";
import { FlowDiagram, StackDiagram, type FlowItem } from "./layouts";

export function DiagnosticDiagram() {
  return <FlowDiagram id="diagnostic" title="Du symptôme à la réponse minimale" says="Tu vérifies le problème avant de choisir un outil ou une automatisation." caption="Chaque étape doit être vérifiée avant la suivante." items={[
    { num: "01", label: "Symptôme observé", sub: "ce qui bloque" },
    { num: "02", label: "Flux réel", sub: "étapes et exceptions" },
    { num: "03", label: "Cause", sub: "information, règle ou accès" },
    { num: "04", label: "Réponse minimale", sub: "clarifier avant d'automatiser", accent: true },
  ]} />;
}

export function DecompositionDiagram() {
  return <StackDiagram id="decomposition" title="Décomposer sans dessiner un organigramme" says="Tu pars du résultat attendu, puis tu crées des lots indépendants et vérifiables." caption="Chaque lot peut être livré et vérifié sans attendre les autres." items={[
    { label: "Ce qui doit sortir", sub: "résultat observable", accent: true },
    { label: "Domaines nécessaires", sub: "compétences, pas personnes" },
    { label: "Lots indépendants", sub: "entrées, sortie, critère de fin" },
    { label: "Vérification", sub: "chaque lot est relu seul" },
  ]} />;
}

export function KnowledgeLayersDiagram() {
  return <StackDiagram id="connaissance" title="Six couches, six responsabilités distinctes" says="Chaque couche a un rôle. Une source brute ne devient pas une connaissance qualifiée sans contrôle." items={[
    { label: "Sources", sub: "documents et données brutes", accent: true },
    { label: "Connaissance qualifiée", sub: "relue, vérifiée, datée" },
    { label: "Contexte de projet", sub: "ce qui s'applique ici" },
    { label: "Mémoire opérationnelle", sub: "décisions et actions passées" },
    { label: "Capital d'exécution", sub: "outils, accès, procédures" },
    { label: "Vues de navigation", sub: "projections, jamais l'autorité" },
  ]} />;
}

export function ExecutionLoopDiagram() {
  return <FlowDiagram id="boucle-execution" title="La boucle ne s'arrête pas à une réponse produite" says="La trace ferme la boucle. Elle permet de mesurer le résultat et d'améliorer le tour suivant." caption="Percevoir, décider, exécuter, tracer, puis recommencer." items={[
    { label: "Percevoir", sub: "un événement entre" },
    { label: "Décider", sub: "règle ou arbitrage" },
    { label: "Exécuter", sub: "action bornée" },
    { label: "Tracer", sub: "fait et résultat", accent: true },
  ]} />;
}

export function AuthorityLayersDiagram() {
  return <FlowDiagram id="autorite" title="Trois couches à vérifier séparément" says="Une consigne écrite ne bloque pas une action. Le contrôle technique et la preuve de refus se testent séparément." items={[
    { label: "Politique écrite", sub: "la règle annoncée" },
    { label: "Contrôle technique", sub: "l'appel est intercepté", accent: true },
    { label: "Preuve de refus", sub: "le cas interdit bloque" },
  ]} />;
}

export function ProofLayersDiagram() {
  return <StackDiagram id="preuves" title="Une preuve ne remplace pas automatiquement les autres" says="Chaque preuve répond à une question différente, du code jusqu'à l'effet métier." items={[
    { label: "Analyse statique", sub: "les règles connues sont respectées" },
    { label: "Test local", sub: "le comportement est reproduit" },
    { label: "Relecture de la cible", sub: "le résultat répond à la demande" },
    { label: "Acceptation humaine", sub: "une personne responsable valide" },
    { label: "Mesure métier", sub: "l'effet est confirmé en usage", accent: true },
  ]} />;
}

export function TransmissionDiagram() {
  return <FlowDiagram id="transmission" title="Du terrain à l'actif réutilisable" says="Tu pars d'un fait vécu, tu le traces, puis tu le transformes en méthode transmissible." items={[
    { label: "Terrain", sub: "vécu et observé" },
    { label: "Preuve tracée", sub: "faits conservés" },
    { label: "Méthode distillée", sub: "principe généralisé" },
    { label: "Actif transmissible", sub: "réutilisable par une autre personne", accent: true },
  ]} />;
}

export function WorkshopDiagram() {
  return <StackDiagram id="atelier" title="Cinq fiches, un seul dossier de pilote" says="Les fiches couvrent des moments différents du pilote et rejoignent le même dossier de preuve." caption="Les fiches peuvent être remplies séparément. Le dossier les réunit." items={[
    { label: "Diagnostic" },
    { label: "Mission et délégation" },
    { label: "Événement et passation" },
    { label: "Expérience" },
    { label: "Incident et promotion" },
    { label: "Dossier de pilote", accent: true },
  ]} />;
}

function GridDiagram({ id, title, says, caption, items, accentIndex = 0 }: { id: string; title: string; says: string; caption?: string; items: readonly FlowItem[]; accentIndex?: number }) {
  const wideColumns = items.length > 8 ? 5 : 2;
  const wideRows = Math.ceil(items.length / wideColumns);
  const wideGap = wideColumns === 5 ? 16 : 24;
  const wideWidth = wideColumns === 5 ? 120 : 320;
  const wideStart = 8;
  const wideHeight = wideRows * 80 + (wideRows - 1) * wideGap;
  const compactColumns = 2;
  const compactRows = Math.ceil(items.length / compactColumns);
  const compactGap = 16;
  const compactWidth = 152;
  const compactHeight = compactRows * 80 + (compactRows - 1) * compactGap;
  const description = items.map((item) => item.label).join(" ; ");
  return <Diagram id={id} title={title} says={says} caption={caption} description={description} wideHeight={wideHeight} compactHeight={compactHeight}
    wide={<>{items.map((item, index) => {
      const column = index % wideColumns;
      const row = Math.floor(index / wideColumns);
      return <Node key={item.label} {...item} accent={index === accentIndex} x={wideStart + column * (wideWidth + wideGap)} y={row * 96} w={wideWidth} h={80} step={index} />;
    })}</>}
    compact={<>{items.map((item, index) => {
      const column = index % compactColumns;
      const row = Math.floor(index / compactColumns);
      return <Node key={item.label} {...item} accent={index === accentIndex} x={column * 176} y={row * 96} w={compactWidth} h={80} step={index} />;
    })}</>}
  />;
}

export function FederatedBrainDiagram() {
  return <GridDiagram id="cerveau-federe" title="Quatre responsabilités, pas un super-agent" says="L'équipe sépare qui oriente, qui sait, qui opère et qui exécute." caption="Un exécutant ne fixe jamais seul l'orientation." items={[
    { label: "Orientation", sub: "doctrine et décisions" },
    { label: "Connaissance", sub: "notes qualifiées" },
    { label: "Opération", sub: "systèmes métier" },
    { label: "Exécution", sub: "outils et contrôles" },
  ]} />;
}

export function PoleMapDiagram() {
  return <GridDiagram id="poles" title="Cartographier les pôles réellement présents" says="Tu représentes le terrain réel avant de décider où un agent peut aider." caption="C'est un inventaire, pas une hiérarchie." accentIndex={-1} items={[
    { label: "Direction" }, { label: "Marketing" }, { label: "Vente" }, { label: "Relation client" }, { label: "Opérations" },
    { label: "Produit" }, { label: "Finance" }, { label: "RH" }, { label: "Juridique" }, { label: "IT et données" },
  ]} />;
}

export function DataFormatsDiagram() {
  return <StackDiagram id="formats" title="Un format par responsabilité, pas par habitude" says="La source d'autorité, l'échange et l'index de recherche n'ont pas le même rôle." items={[
    { label: "Doctrine et méthode", sub: "Markdown versionné", accent: true },
    { label: "Objets métier vivants", sub: "application ou base adaptée" },
    { label: "Contrat d'échange", sub: "JSON ou schéma structuré" },
    { label: "Index de recherche", sub: "projection dérivée" },
  ]} />;
}

export function SkillsSopDiagram() {
  return <FlowDiagram id="skills-sop" title="Métier, compétence, procédure, exécutant" says="La procédure rend une compétence transmissible à une personne ou à un agent." items={[
    { label: "Métier", sub: "domaine de travail" },
    { label: "Compétence", sub: "savoir-faire précis", accent: true },
    { label: "Procédure", sub: "chemin stable et écrit" },
    { label: "Exécutant", sub: "personne ou agent" },
  ]} />;
}

export function ToolAccessDiagram() {
  return <FlowDiagram id="acces-outils" title="Une connexion réussie ne prouve pas l'opération" says="L'accès ouvre une porte. Le contrôle technique et le test du refus prouvent ce qui est réellement permis." items={[
    { label: "API, CLI ou MCP", sub: "une porte d'accès" },
    { label: "Contrôle technique", sub: "placé avant l'action", accent: true },
    { label: "Action réelle", sub: "autorisée ou refusée" },
  ]} />;
}

export function WorkflowCrossPoleDiagram() {
  return <StackDiagram id="workflow-interpoles" title="Un résultat qui traverse plusieurs pôles" says="Une demande passe de la qualification à la livraison, puis revient nourrir l'apprentissage collectif." items={[
    { num: "01", label: "Demande" }, { num: "02", label: "Qualification" }, { num: "03", label: "Faisabilité" }, { num: "04", label: "Proposition" },
    { num: "05", label: "Acceptation" }, { num: "06", label: "Livraison" }, { num: "07", label: "Facturation" }, { num: "08", label: "Apprentissage", accent: true },
  ]} />;
}

export function AdoptionLaddersDiagram() {
  return <StackDiagram id="paliers-adoption" title="Avancer par paliers réversibles" says="Tu élargis l'autorité seulement après avoir prouvé le palier précédent." caption="L'engagement augmente à chaque palier. Tu gardes une possibilité de retour." items={[
    { num: "01", label: "Diagnostic", sub: "observer" },
    { num: "02", label: "Préparation", sub: "cadrer" },
    { num: "03", label: "Assistance isolée", sub: "un cas supervisé" },
    { num: "04", label: "Pilote supervisé", sub: "plusieurs cas" },
    { num: "05", label: "Extension limitée", sub: "périmètre borné" },
    { num: "06", label: "Exploitation suivie", sub: "mesure continue", accent: true },
  ]} />;
}

export function TemplateTreeDiagram() {
  const children = ["connaissance/", "procedures/", "projets/", "apprentissage/"];
  return <Diagram id="arborescence" title="Un dossier de départ, pas une configuration" says="Le dossier racine contient quatre espaces. Les traits montrent une arborescence, rien ne circule." caption="Un contenant et son contenu, sans flèche." description={`entreprise-exemple contient ${children.join(", ")}`} wideHeight={256} compactHeight={496}
    wide={<>
      <Node x={232} y={0} w={216} h={64} label="entreprise-exemple/" accent step={0} />
      <Edge points={[[340, 64], [340, 104], [76, 104], [76, 144]]} head={false} step={0} />
      <Edge points={[[340, 104], [252, 104], [252, 144]]} head={false} step={0} />
      <Edge points={[[340, 104], [428, 104], [428, 144]]} head={false} step={0} />
      <Edge points={[[340, 104], [604, 104], [604, 144]]} head={false} step={0} />
      {children.map((label, index) => <Node key={label} x={index * 176} y={144} w={152} h={72} label={label} step={index + 1} />)}
    </>}
    compact={<>
      <Node x={24} y={0} w={280} h={72} label="entreprise-exemple/" accent step={0} />
      {children.map((label, index) => {
        const y = 104 + index * 96;
        return <g key={label}><Edge points={[[164, index === 0 ? 72 : y - 32], [164, y]]} head={false} step={index} /><Node x={24} y={y} w={280} h={64} label={label} align="start" step={index + 1} /></g>;
      })}
    </>}
  />;
}
