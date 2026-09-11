"use client";

import {
  Frame,
  Box,
  Arrow,
  ElbowArrow,
  BranchLine,
  Bracket,
  StepBadge,
  GOLD,
  LINE,
  SUBTEXT,
} from "@/components/ui/diagram-primitives";

export function DiagnosticDiagram() {
  const steps = [
    { label: "Symptôme observé", sub: "« on répond trop lentement »" },
    { label: "Flux réel", sub: "déclencheur, étapes, exceptions" },
    { label: "Cause", sub: "info, règle, responsable ou intégration ?" },
    { label: "Réponse minimale", sub: "clarifier avant d'automatiser" },
  ];
  const w = 156, gap = 22, h = 96, y = 60;
  return (
    <Frame
      title="Du symptôme à la réponse minimale"
      explainer="Un problème mal diagnostiqué produit une automatisation mal ciblée. Chaque étape doit être vérifiée avant de passer à la suivante."
      caption="Lecture : on avance uniquement de gauche à droite - impossible de sauter une étape pour aller plus vite."
      viewBox="0 0 720 180"
    >
      {steps.map((s, i) => (
        <g key={s.label}>
          <StepBadge x={12 + i * (w + gap) + w / 2} y={y - 20} n={i + 1} />
          <Box x={12 + i * (w + gap)} y={y} w={w} h={h} label={s.label} sub={s.sub} accent={i === steps.length - 1} />
          {i < steps.length - 1 && (
            <Arrow x1={12 + i * (w + gap) + w} y1={y + h / 2} x2={12 + (i + 1) * (w + gap)} y2={y + h / 2} />
          )}
        </g>
      ))}
    </Frame>
  );
}

export function DecompositionDiagram() {
  return (
    <Frame
      title="Décomposer sans dessiner un organigramme"
      explainer="On ne part pas des personnes disponibles mais du résultat visé, qu'on découpe ensuite en lots indépendants et vérifiables."
      caption="Chaque lot doit pouvoir être livré et vérifié seul, sans attendre les deux autres."
      viewBox="0 0 720 330"
    >
      <Box x={270} y={12} w={180} h={64} label="Résultat attendu" accent />
      <Arrow x1={360} y1={76} x2={360} y2={112} />
      <Box x={190} y={114} w={340} h={58} label="Domaines nécessaires" sub="compétences requises, pas des personnes" />
      <Arrow x1={278} y1={172} x2={140} y2={210} />
      <Arrow x1={360} y1={172} x2={360} y2={210} />
      <Arrow x1={442} y1={172} x2={580} y2={210} />
      {["Lot 1", "Lot 2", "Lot 3"].map((label, i) => (
        <Box key={label} x={40 + i * 220} y={212} w={190} h={90} label={label} sub="entrées reçues · livrable attendu · critère de fin" />
      ))}
    </Frame>
  );
}

export function KnowledgeLayersDiagram() {
  const rows = [
    { label: "Sources", sub: "documents et données brutes, non vérifiées" },
    { label: "Connaissance qualifiée", sub: "relue, vérifiée, datée" },
    { label: "Contexte de projet", sub: "ce qui s'applique à cette mission précise" },
    { label: "Mémoire opérationnelle", sub: "ce qui a déjà été décidé et fait" },
    { label: "Capital d'exécution", sub: "outils, accès et procédures réutilisables" },
    { label: "Vues de navigation", sub: "projections d'affichage, jamais l'autorité" },
  ];
  const h = 56, gap = 14, x = 40, w = 640;
  return (
    <Frame
      title="Six couches, six responsabilités distinctes"
      explainer="Chaque couche a un rôle précis. Mélanger « source brute » et « connaissance qualifiée », par exemple, fait remonter une information non vérifiée comme si elle l'était."
      caption="Lecture : de haut en bas, chaque couche s'appuie sur celle du dessus - une information ne descend jamais deux couches à la fois."
      viewBox={`0 0 720 ${rows.length * (h + gap) + 20}`}
    >
      {rows.map((r, i) => (
        <g key={r.label}>
          <Box x={x} y={10 + i * (h + gap)} w={w} h={h} label={r.label} sub={r.sub} accent={i === 0} />
          {i < rows.length - 1 && (
            <Arrow x1={x + w / 2} y1={10 + i * (h + gap) + h} x2={x + w / 2} y2={10 + (i + 1) * (h + gap)} />
          )}
        </g>
      ))}
    </Frame>
  );
}

export function ExecutionLoopDiagram() {
  const cx = 360, cy = 200, r = 140;
  const labels = [
    { label: "Percevoir", sub: "un événement entre" },
    { label: "Décider", sub: "règle ou arbitrage humain" },
    { label: "Exécuter", sub: "l'action bornée est lancée" },
    { label: "Tracer", sub: "ce qui a été fait est noté" },
  ];
  const boxW = 168, boxH = 66;
  return (
    <Frame
      title="La boucle ne s'arrête pas à une réponse produite"
      explainer="Un agent qui répond puis oublie n'apprend jamais. La boucle ne se referme qu'une fois la trace écrite - c'est elle qui nourrit la mesure et l'amélioration du cycle suivant."
      caption="Lecture : suivre les flèches dans le sens horaire, en partant de « Percevoir » en haut. Le centre rappelle que chaque tour de boucle doit être mesuré."
      viewBox="0 0 720 400"
    >
      <circle cx={cx} cy={cy} r={r - 40} fill="none" stroke={LINE} strokeWidth={1} strokeDasharray="2 6" />
      {labels.map((item, i) => {
        const angle = (Math.PI * 2 * i) / labels.length - Math.PI / 2;
        const x = cx + r * Math.cos(angle);
        const y = cy + r * Math.sin(angle);
        return (
          <Box
            key={item.label}
            x={x - boxW / 2}
            y={y - boxH / 2}
            w={boxW}
            h={boxH}
            label={item.label}
            sub={item.sub}
            accent={i === 0}
          />
        );
      })}
      {labels.map((_, i) => {
        const a1 = (Math.PI * 2 * i) / labels.length - Math.PI / 2;
        const a2 = (Math.PI * 2 * (i + 1)) / labels.length - Math.PI / 2;
        // Start/end the connecting arc just outside each box's edge along
        // the circle, not at the box center, so it never dips under a Box.
        const startAngle = a1 + 0.62;
        const endAngle = a2 - 0.62;
        const rArc = r;
        const x1 = cx + rArc * Math.cos(startAngle);
        const y1 = cy + rArc * Math.sin(startAngle);
        const x2 = cx + rArc * Math.cos(endAngle);
        const y2 = cy + rArc * Math.sin(endAngle);
        const largeArc = 0;
        const sweep = 1;
        return (
          <path
            key={i}
            d={`M${x1} ${y1} A${rArc} ${rArc} 0 ${largeArc} ${sweep} ${x2} ${y2}`}
            fill="none"
            stroke={GOLD}
            strokeWidth={1.5}
            markerEnd="url(#execloop-arrowhead)"
          />
        );
      })}
      <defs>
        <marker id="execloop-arrowhead" markerWidth="9" markerHeight="9" refX="7" refY="3.5" orient="auto">
          <path d="M0,0.7 L7,3.5 L0,6.3 Z" fill={GOLD} />
        </marker>
      </defs>
      <text x={cx} y={cy - 4} textAnchor="middle" fontSize="11.5" fontWeight={600} fill="#d9d5cfcc">Mesurer</text>
      <text x={cx} y={cy + 12} textAnchor="middle" fontSize="11.5" fontWeight={600} fill="#d9d5cfcc">apprendre</text>
    </Frame>
  );
}

export function AuthorityLayersDiagram() {
  return (
    <Frame
      title="Trois couches à vérifier séparément"
      explainer="Écrire « ne publie rien sans accord » dans un document ne bloque rien techniquement. Il faut un contrôle qui intercepte réellement l'appel, puis une preuve que le refus a bien eu lieu."
      caption="Lecture : les trois couches ne se déduisent pas l'une de l'autre. Vérifier la première ne dit rien sur les deux suivantes."
      viewBox="0 0 720 260"
    >
      <Box x={20} y={20} w={210} h={90} label="Politique écrite" sub="« ne publie rien sans accord »" />
      <Arrow x1={230} y1={65} x2={262} y2={65} />
      <Box x={262} y={20} w={210} h={90} label="Contrôle technique" sub="l'appel est-il vraiment intercepté ?" accent />
      <Arrow x1={472} y1={65} x2={504} y2={65} />
      <Box x={504} y={20} w={196} h={90} label="Preuve de refus" sub="le cas interdit est bloqué, et on peut le montrer" />
      <text x={360} y={150} textAnchor="middle" fontSize="12.5" fontWeight={600} fill={SUBTEXT}>Une règle écrite n&apos;est pas une barrière technique.</text>
      <text x={360} y={172} textAnchor="middle" fontSize="12.5" fill="#c4bfb7cc">Chaque couche doit être testée pour elle-même, indépendamment des deux autres.</text>
    </Frame>
  );
}

export function ProofLayersDiagram() {
  const rows = [
    { label: "Analyse statique", sub: "le code respecte les règles connues" },
    { label: "Test local", sub: "le comportement attendu est reproduit" },
    { label: "Relecture de la cible", sub: "le résultat correspond à la demande réelle" },
    { label: "Acceptation humaine", sub: "une personne responsable valide" },
    { label: "Mesure métier", sub: "l'effet se confirme une fois en usage" },
  ];
  const h = 60, gap = 16, x = 90, w = 540;
  return (
    <Frame
      title="Une preuve ne remplace pas automatiquement les autres"
      explainer="Un test qui passe ne dit rien sur si le résultat sert vraiment l'objectif métier. Les cinq preuves répondent à des questions différentes et s'empilent, elles ne se substituent pas."
      caption="Lecture : la dernière couche (mesure métier) est celle qui compte le plus, mais elle ne s'obtient qu'après les quatre précédentes."
      viewBox={`0 0 720 ${rows.length * (h + gap) + 20}`}
    >
      {rows.map((r, i) => (
        <g key={r.label}>
          <Box x={x} y={10 + i * (h + gap)} w={w} h={h} label={r.label} sub={r.sub} accent={i === rows.length - 1} />
          {i < rows.length - 1 && (
            <Arrow x1={x + w / 2} y1={10 + i * (h + gap) + h} x2={x + w / 2} y2={10 + (i + 1) * (h + gap)} />
          )}
        </g>
      ))}
    </Frame>
  );
}

export function TransmissionDiagram() {
  const steps = [
    { label: "Terrain", sub: "ce qui a été vécu et observé" },
    { label: "Preuve tracée", sub: "ce qui a marché, noté avec des faits" },
    { label: "Méthode distillée", sub: "le principe général, détaché du cas" },
    { label: "Actif transmissible", sub: "réutilisable par quelqu'un d'autre" },
  ];
  const w = 156, gap = 22, h = 90, y = 46;
  return (
    <Frame
      title="Du terrain à l'actif réutilisable"
      explainer="Une expérience isolée ne vaut rien pour quelqu'un d'autre tant qu'elle n'a pas été distillée en méthode, puis packagée en actif que l'on peut transmettre sans réexpliquer le contexte."
      caption="Lecture : chaque étape retire un peu du contexte spécifique pour ne garder que ce qui se généralise."
      viewBox="0 0 720 180"
    >
      {steps.map((s, i) => (
        <g key={s.label}>
          <Box x={12 + i * (w + gap)} y={y} w={w} h={h} label={s.label} sub={s.sub} accent={i === steps.length - 1} />
          {i < steps.length - 1 && (
            <Arrow x1={12 + i * (w + gap) + w} y1={y + h / 2} x2={12 + (i + 1) * (w + gap)} y2={y + h / 2} />
          )}
        </g>
      ))}
    </Frame>
  );
}

export function WorkshopDiagram() {
  const items = [
    "Diagnostic",
    "Mission & délégation",
    "Événement & passation",
    "Expérience",
    "Incident & promotion",
  ];
  const boxW = 190, boxH = 76, gapX = 20;
  const totalW = items.length * boxW + (items.length - 1) * gapX;
  const startX = (720 - totalW) / 2;
  const topY = 220;
  const hubX = 360, hubY = 40, hubW = 220, hubH = 64;
  return (
    <Frame
      title="Cinq fiches, un seul dossier de pilote"
      explainer="Chaque fiche couvre un moment différent d'un essai en conditions réelles. Toutes se rassemblent dans le même dossier, qui devient la preuve qu'on peut montrer à quelqu'un d'autre."
      caption="Lecture : les cinq fiches sont indépendantes et peuvent être remplies dans n'importe quel ordre - seul le dossier final les régroupe."
      viewBox="0 0 720 340"
    >
      <Box x={hubX - hubW / 2} y={hubY} w={hubW} h={hubH} label="Dossier de pilote" accent />
      {items.map((label, i) => {
        const x = startX + i * (boxW + gapX);
        const cx = x + boxW / 2;
        return (
          <g key={label}>
            <ElbowArrow x1={cx} y1={topY} x2={hubX} y2={hubY + hubH} bendAt={0.35} />
            <Box x={x} y={topY} w={boxW} h={boxH} label={label} />
          </g>
        );
      })}
    </Frame>
  );
}

export function FederatedBrainDiagram() {
  const quadrants = [
    { label: "Orientation", sub: "doctrine et décisions qui cadrent le reste" },
    { label: "Connaissance", sub: "notes qualifiées, index de recherche" },
    { label: "Opération", sub: "systèmes métier, registre des faits" },
    { label: "Exécution", sub: "outils bornés, contrôles techniques" },
  ];
  const w = 320, h = 110, gapX = 30, gapY = 24, x0 = 40, y0 = 60;
  return (
    <Frame
      title="Quatre responsabilités, pas un super-agent"
      explainer="Une entreprise AI-first n'est pas un agent unique qui fait tout : elle sépare qui oriente, qui sait, qui opère et qui exécute - comme quatre rôles distincts dans une équipe humaine."
      caption="Lecture : les quatre responsabilités coexistent en continu, aucune ne remplace les autres - un agent d'exécution ne doit jamais fixer seul l'orientation."
      viewBox="0 0 720 320"
    >
      <text x={360} y={30} textAnchor="middle" fontSize="11" fontWeight={600} letterSpacing="0.08em" fill="#c4bfb799">
        QUATRE RESPONSABILITÉS SÉPARÉES
      </text>
      {quadrants.map((q, i) => {
        const col = i % 2, row = Math.floor(i / 2);
        return (
          <Box
            key={q.label}
            x={x0 + col * (w + gapX)}
            y={y0 + row * (h + gapY)}
            w={w}
            h={h}
            label={q.label}
            sub={q.sub}
            accent={i === 0}
          />
        );
      })}
    </Frame>
  );
}

export function PoleMapDiagram() {
  const poles = [
    "Direction",
    "Marketing",
    "Vente",
    "Relation client",
    "Opérations",
    "Produit",
    "Finance",
    "RH",
    "Juridique",
    "IT & données",
  ];
  const cols = 5, w = 128, h = 62, gapX = 14, gapY = 14, x0 = 20, y0 = 44;
  return (
    <Frame
      title="Cartographier les pôles réellement présents"
      explainer="Avant de décider où poser un agent, on liste tous les pôles qui existent vraiment dans l'entreprise - pas un agent par métier théorique, mais une carte fidèle du terrain."
      caption="Lecture : cette carte est un inventaire, pas une hiérarchie - aucun pôle n'est « au-dessus » d'un autre ici."
      viewBox={`0 0 720 ${Math.ceil(poles.length / cols) * (h + gapY) + y0 + 10}`}
    >
      <text x={20} y={26} fontSize="11" fontWeight={600} letterSpacing="0.08em" fill="#c4bfb799">
        PÔLES IDENTIFIÉS DANS L&apos;ENTREPRISE
      </text>
      {poles.map((label, i) => {
        const col = i % cols, row = Math.floor(i / cols);
        return <Box key={label} x={x0 + col * (w + gapX)} y={y0 + row * (h + gapY)} w={w} h={h} label={label} />;
      })}
    </Frame>
  );
}

export function DataFormatsDiagram() {
  const rows = [
    { label: "Doctrine & méthode", sub: "Markdown versionné, relu par des humains" },
    { label: "Objets métier vivants", sub: "dans l'application ou la base adaptée" },
    { label: "Contrat d'échange", sub: "JSON ou schéma structuré entre systèmes" },
    { label: "Index de recherche", sub: "une projection dérivée - jamais la source d'autorité" },
  ];
  const h = 62, gap = 16, x = 60, w = 600;
  return (
    <Frame
      title="Un format par responsabilité, pas par habitude"
      explainer="Utiliser le même format partout par confort crée des ambiguïtés : un index de recherche n'a pas la même autorité qu'une doctrine versionnée, même s'il est plus rapide à consulter."
      caption="Lecture : plus on descend, plus le format sert à la vitesse d'accès - mais seul le haut du tableau fait autorité en cas de désaccord."
      viewBox={`0 0 720 ${rows.length * (h + gap) + 16}`}
    >
      {rows.map((r, i) => (
        <Box key={r.label} x={x} y={8 + i * (h + gap)} w={w} h={h} label={r.label} sub={r.sub} accent={i === 0} />
      ))}
    </Frame>
  );
}

export function SkillsSopDiagram() {
  const steps = [
    { label: "Métier", sub: "vente, finance, support…" },
    { label: "Compétence", sub: "le savoir-faire précis identifié" },
    { label: "Procédure / SOP", sub: "le chemin stable, écrit, reproductible" },
    { label: "Exécutant", sub: "humain ou agent, peu importe qui suit le SOP" },
  ];
  const w = 156, gap = 22, h = 90, y = 40;
  return (
    <Frame
      title="Métier, compétence, procédure, exécutant"
      explainer="Un métier contient plusieurs compétences. Chaque compétence bien maîtrisée peut être formalisée en procédure stable, que n'importe quel exécutant - humain ou agent - peut ensuite suivre."
      caption="Lecture : c'est la procédure (SOP) qui rend une compétence transmissible, pas l'inverse - sans elle, le savoir reste dans la tête d'une seule personne."
      viewBox="0 0 720 170"
    >
      {steps.map((s, i) => (
        <g key={s.label}>
          <Box x={12 + i * (w + gap)} y={y} w={w} h={h} label={s.label} sub={s.sub} accent={i === 1} />
          {i < steps.length - 1 && (
            <Arrow x1={12 + i * (w + gap) + w} y1={y + h / 2} x2={12 + (i + 1) * (w + gap)} y2={y + h / 2} />
          )}
        </g>
      ))}
    </Frame>
  );
}

export function ToolAccessDiagram() {
  return (
    <Frame
      title="Une connexion réussie ne prouve pas l'opération"
      explainer="Avoir accès à une API, une CLI ou un serveur MCP n'est qu'une porte. Ce qui compte, c'est le contrôle technique interposé devant l'action, et la preuve que l'action interdite a bien été refusée."
      caption="Lecture : une interdiction vérifiée sur une porte (API) ne garantit rien sur une autre porte (CLI) - chaque accès doit être testé séparément."
      viewBox="0 0 720 240"
    >
      <Box x={20} y={24} w={200} h={90} label="API / CLI / MCP" sub="une porte d'accès parmi d'autres" />
      <Arrow x1={220} y1={69} x2={252} y2={69} />
      <Box x={252} y={24} w={216} h={90} label="Contrôle technique" sub="interposé devant l'action, pas après" accent />
      <Arrow x1={468} y1={69} x2={500} y2={69} />
      <Box x={500} y={24} w={200} h={90} label="Action réelle" sub="testée, le refus est vérifié en pratique" />
      <text x={360} y={155} textAnchor="middle" fontSize="12.5" fontWeight={600} fill={SUBTEXT}>Une interdiction vérifiée sur une porte</text>
      <text x={360} y={177} textAnchor="middle" fontSize="12.5" fill="#c4bfb7cc">ne dit rien sur les autres portes - chacune se teste pour elle-même.</text>
    </Frame>
  );
}

export function WorkflowCrossPoleDiagram() {
  const steps = [
    "Demande",
    "Qualification",
    "Faisabilité",
    "Proposition",
    "Acceptation",
    "Livraison",
    "Facturation",
    "Apprentissage",
  ];
  const w = 156, h = 72, gapX = 20, gapY = 40;
  const perRow = 4;
  const rows = Math.ceil(steps.length / perRow);
  return (
    <Frame
      title="Un résultat qui traverse plusieurs pôles"
      explainer="Une vente ne reste jamais dans un seul pôle : elle part du marketing ou de la vente, passe par les opérations, la finance, puis revient nourrir l'apprentissage collectif."
      caption="Lecture : suivre la numérotation en continu - la fin de la première ligne (Proposition) rejoint le début de la seconde (Acceptation)."
      viewBox={`0 0 720 ${rows * (h + gapY) + 20}`}
    >
      {steps.map((label, i) => {
        const col = i % perRow, row = Math.floor(i / perRow);
        const x = 12 + col * (w + gapX);
        const y = 14 + row * (h + gapY);
        const isRowEnd = col === perRow - 1;
        const isLast = i === steps.length - 1;
        return (
          <g key={label}>
            <StepBadge x={x + 16} y={y - 4} n={i + 1} />
            <Box x={x} y={y} w={w} h={h} label={label} accent={i === 0} />
            {!isRowEnd && !isLast && (
              <Arrow x1={x + w} y1={y + h / 2} x2={x + w + gapX} y2={y + h / 2} />
            )}
            {isRowEnd && !isLast && (
              <ElbowArrow x1={x + w / 2} y1={y + h} x2={12 + w / 2} y2={y + h + gapY} bendAt={0.5} />
            )}
          </g>
        );
      })}
    </Frame>
  );
}

function wrapPlain(text: string, maxCharsPerLine: number): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let current = "";
  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (candidate.length > maxCharsPerLine && current) {
      lines.push(current);
      current = word;
    } else {
      current = candidate;
    }
  }
  if (current) lines.push(current);
  return lines;
}

export function AdoptionLaddersDiagram() {
  const steps = [
    { label: "Diagnostic", sub: "observer avant d'agir" },
    { label: "Préparation", sub: "cadrer le premier essai" },
    { label: "Assistance isolée", sub: "un seul cas, supervisé de près" },
    { label: "Pilote supervisé", sub: "plusieurs cas, contrôle rapproché" },
    { label: "Extension limitée", sub: "périmètre élargi, encore borné" },
    { label: "Exploitation suivie", sub: "en production, mesurée en continu" },
  ];
  const w = 128, gap = 16;
  const baseY = 280, maxBarH = 200;
  const totalW = steps.length * (w + gap) - gap;
  return (
    <Frame
      title="Avancer par paliers réversibles"
      explainer="Chaque palier engage un peu plus, mais reste réversible : on peut revenir en arrière sans dégât jusqu'au pilote supervisé. Ce n'est qu'à partir de l'extension limitée que l'engagement devient plus difficile à annuler."
      caption="Lecture : la hauteur des barres représente le niveau d'engagement, pas la durée - un palier peut être court et déjà très engageant."
      viewBox={`0 0 ${totalW + 24} 360`}
    >
      <Bracket x={12 + 3 * (w + gap) - gap / 2} y1={16} y2={baseY - maxBarH * (3 / 6)} label="rien n'est encore engagé" reach={10} />
      {steps.map((s, i) => {
        const x = 12 + i * (w + gap);
        const barH = 30 + i * 32;
        const y = baseY - barH;
        const subLines = wrapPlain(s.sub, 20);
        return (
          <g key={s.label}>
            <rect
              x={x}
              y={y}
              width={w}
              height={barH}
              rx={8}
              fill={i === steps.length - 1 ? "#e8d5b022" : "#ffffff0a"}
              stroke={i === steps.length - 1 ? GOLD : LINE}
              strokeWidth={1.25}
            />
            <text x={x + w / 2} y={baseY + 22} textAnchor="middle" fontSize="11.5" fontWeight={600} fill={SUBTEXT}>
              {s.label}
            </text>
            {subLines.map((line, li) => (
              <text key={li} x={x + w / 2} y={baseY + 39 + li * 13} textAnchor="middle" fontSize="9.5" fill="#c4bfb799">
                {line}
              </text>
            ))}
          </g>
        );
      })}
    </Frame>
  );
}

export function TemplateTreeDiagram() {
  const children = ["connaissance/", "procedures/", "projets/", "apprentissage/"];
  const rootW = 220, rootH = 52, rootX = (720 - 220) / 2, rootY = 16;
  const rootCx = rootX + rootW / 2;
  const rootBottomY = rootY + rootH;
  const childW = 150, childH = 64, gapX = 20;
  const totalW = children.length * childW + (children.length - 1) * gapX;
  const startX = (720 - totalW) / 2;
  const childY = 150;
  const trunkY = rootBottomY + 30;
  return (
    <Frame
      title="Un dossier de départ, pas une configuration"
      explainer="C'est une arborescence de dossiers, pas un flux : « entreprise-exemple/ » contient les quatre dossiers ci-dessous, ils ne « pointent » pas vers lui."
      caption="Lecture : les traits sont des branches d'arborescence (contenant → contenu), sans flèche - rien ne « circule », un dossier en contient simplement d'autres."
      viewBox="0 0 720 250"
    >
      <Box x={rootX} y={rootY} w={rootW} h={rootH} label="entreprise-exemple/" accent />
      <BranchLine x1={rootCx} y1={rootBottomY} x2={rootCx} y2={trunkY} />
      <BranchLine x1={startX + childW / 2} y1={trunkY} x2={startX + totalW - childW / 2} y2={trunkY} />
      {children.map((label, i) => {
        const x = startX + i * (childW + gapX);
        const cx = x + childW / 2;
        return (
          <g key={label}>
            <BranchLine x1={cx} y1={trunkY} x2={cx} y2={childY} />
            <Box x={x} y={childY} w={childW} h={childH} label={label} />
          </g>
        );
      })}
    </Frame>
  );
}
