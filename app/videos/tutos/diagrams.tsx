import type { ReactNode } from "react";

const GOLD = "#e8d5b0";
const GOLD_DIM = "#e8d5b0aa";
const LINE = "#ffffff26";
const TEXT = "#f0ede8";
const SUBTEXT = "#d9d5cf";

function Frame({ title, children, viewBox = "0 0 640 220" }: { title: string; children: ReactNode; viewBox?: string }) {
  return (
    <figure className="my-6 rounded-xl border border-white/[0.08] bg-white/[0.02] p-4 sm:p-5">
      <svg viewBox={viewBox} className="w-full h-auto" role="img" aria-label={title}>
        {children}
      </svg>
      <figcaption className="mt-3 text-[11px] uppercase tracking-[0.14em] text-white/35">{title}</figcaption>
    </figure>
  );
}

function Box({ x, y, w, h, label, sub, accent }: { x: number; y: number; w: number; h: number; label: string; sub?: string; accent?: boolean }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={10} fill={accent ? "#e8d5b01a" : "#ffffff0a"} stroke={accent ? GOLD : LINE} strokeWidth={1.25} />
      <text x={x + w / 2} y={y + h / 2 + (sub ? -4 : 5)} textAnchor="middle" fontSize="12.5" fontWeight={600} fill={TEXT}>{label}</text>
      {sub && <text x={x + w / 2} y={y + h / 2 + 13} textAnchor="middle" fontSize="10" fill={SUBTEXT}>{sub}</text>}
    </g>
  );
}

function Arrow({ x1, y1, x2, y2 }: { x1: number; y1: number; x2: number; y2: number }) {
  const id = `arrow-${x1}-${y1}-${x2}-${y2}`;
  return (
    <g>
      <defs>
        <marker id={id} markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" fill={GOLD_DIM} />
        </marker>
      </defs>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={GOLD_DIM} strokeWidth={1.25} markerEnd={`url(#${id})`} />
    </g>
  );
}

export function DiagnosticDiagram() {
  const steps = [
    { label: "Symptôme observé", sub: "« on répond trop lentement »" },
    { label: "Flux réel", sub: "déclencheur, étapes, exceptions" },
    { label: "Cause", sub: "info, règle, respo ou intégration ?" },
    { label: "Réponse minimale", sub: "clarifier avant d'automatiser" },
  ];
  const w = 148, gap = 12, h = 74, y = 90;
  return (
    <Frame title="Du symptôme à la réponse minimale" viewBox="0 0 640 200">
      {steps.map((s, i) => (
        <g key={s.label}>
          <Box x={8 + i * (w + gap)} y={y} w={w} h={h} label={s.label} sub={s.sub} accent={i === steps.length - 1} />
          {i < steps.length - 1 && <Arrow x1={8 + i * (w + gap) + w} y1={y + h / 2} x2={8 + (i + 1) * (w + gap)} y2={y + h / 2} />}
        </g>
      ))}
    </Frame>
  );
}

export function DecompositionDiagram() {
  return (
    <Frame title="Décomposer sans dessiner un organigramme" viewBox="0 0 640 230">
      <Box x={240} y={8} w={160} h={50} label="Résultat attendu" accent />
      <Arrow x1={320} y1={58} x2={320} y2={82} />
      <Box x={180} y={84} w={280} h={44} label="Domaines nécessaires" />
      <Arrow x1={320} y1={128} x2={320} y2={152} />
      {["Lot 1", "Lot 2", "Lot 3"].map((label, i) => (
        <g key={label}>
          <Box x={60 + i * 180} y={154} w={150} h={60} label={label} sub="entrées · livrable · critère" />
        </g>
      ))}
      <Arrow x1={320} y1={128} x2={135} y2={150} />
      <Arrow x1={320} y1={128} x2={505} y2={150} />
    </Frame>
  );
}

export function KnowledgeLayersDiagram() {
  const rows = [
    "Sources",
    "Connaissance qualifiée",
    "Contexte de projet",
    "Mémoire opérationnelle",
    "Capital d'exécution",
    "Vues de navigation",
  ];
  const h = 30, gap = 6, x = 40, w = 560;
  return (
    <Frame title="Six couches, six responsabilités distinctes" viewBox={`0 0 640 ${rows.length * (h + gap) + 20}`}>
      {rows.map((label, i) => (
        <Box key={label} x={x} y={10 + i * (h + gap)} w={w} h={h} label={label} accent={i === 0} />
      ))}
    </Frame>
  );
}

export function ExecutionLoopDiagram() {
  const cx = 320, cy = 110, r = 90;
  const labels = ["Percevoir", "Décider", "Exécuter", "Tracer"];
  return (
    <Frame title="La boucle ne s'arrête pas à une réponse produite" viewBox="0 0 640 240">
      {labels.map((label, i) => {
        const angle = (Math.PI * 2 * i) / labels.length - Math.PI / 2;
        const x = cx + r * Math.cos(angle);
        const y = cy + r * Math.sin(angle);
        return <Box key={label} x={x - 65} y={y - 22} w={130} h={44} label={label} accent={i === 0} />;
      })}
      {labels.map((_, i) => {
        const a1 = (Math.PI * 2 * i) / labels.length - Math.PI / 2;
        const a2 = (Math.PI * 2 * (i + 1)) / labels.length - Math.PI / 2;
        const r2 = r - 46;
        return <Arrow key={i} x1={cx + r2 * Math.cos(a1)} y1={cy + r2 * Math.sin(a1)} x2={cx + r2 * Math.cos(a2)} y2={cy + r2 * Math.sin(a2)} />;
      })}
      <text x={cx} y={cy + 5} textAnchor="middle" fontSize="10.5" fill="#d9d5cf88">Mesurer · apprendre</text>
    </Frame>
  );
}

export function AuthorityLayersDiagram() {
  return (
    <Frame title="Trois couches à vérifier séparément" viewBox="0 0 640 190">
      <Box x={20} y={16} w={185} h={60} label="Politique écrite" sub="« ne publie rien sans accord »" />
      <Arrow x1={205} y1={46} x2={228} y2={46} />
      <Box x={228} y={16} w={185} h={60} label="Contrôle technique" sub="l'appel est-il intercepté ?" accent />
      <Arrow x1={413} y1={46} x2={436} y2={46} />
      <Box x={436} y={16} w={185} h={60} label="Preuve de refus" sub="le cas interdit est bloqué" />
      <text x={320} y={110} textAnchor="middle" fontSize="11" fill={SUBTEXT}>Une règle écrite n&apos;est pas une barrière technique.</text>
      <text x={320} y={132} textAnchor="middle" fontSize="11" fill={SUBTEXT}>Chaque couche se teste indépendamment.</text>
    </Frame>
  );
}

export function ProofLayersDiagram() {
  const rows = ["Analyse statique", "Test local", "Relecture de la cible", "Acceptation humaine", "Mesure métier"];
  const h = 32, gap = 8, x = 90, w = 460;
  return (
    <Frame title="Une preuve ne remplace pas automatiquement les autres" viewBox={`0 0 640 ${rows.length * (h + gap) + 16}`}>
      {rows.map((label, i) => (
        <Box key={label} x={x} y={8 + i * (h + gap)} w={w} h={h} label={label} accent={i === rows.length - 1} />
      ))}
    </Frame>
  );
}

export function TransmissionDiagram() {
  const steps = ["Terrain", "Preuve tracée", "Méthode distillée", "Actif transmissible"];
  const w = 148, gap = 12, h = 66, y = 40;
  return (
    <Frame title="Du terrain à l'actif réutilisable" viewBox="0 0 640 150">
      {steps.map((label, i) => (
        <g key={label}>
          <Box x={8 + i * (w + gap)} y={y} w={w} h={h} label={label} accent={i === steps.length - 1} />
          {i < steps.length - 1 && <Arrow x1={8 + i * (w + gap) + w} y1={y + h / 2} x2={8 + (i + 1) * (w + gap)} y2={y + h / 2} />}
        </g>
      ))}
    </Frame>
  );
}

export function WorkshopDiagram() {
  const items = ["Diagnostic", "Mission & délégation", "Événement & passation", "Expérience", "Incident & promotion"];
  return (
    <Frame title="Cinq fiches, un seul dossier de pilote" viewBox="0 0 640 170">
      <Box x={250} y={8} w={140} h={40} label="Dossier de pilote" accent />
      {items.map((label, i) => {
        const x = 8 + i * 125;
        return (
          <g key={label}>
            <Box x={x} y={100} w={112} h={54} label={label} />
            <Arrow x1={x + 56} y1={100} x2={320} y2={50} />
          </g>
        );
      })}
    </Frame>
  );
}

export function FederatedBrainDiagram() {
  const quadrants = [
    { label: "Orientation", sub: "doctrine, décisions" },
    { label: "Connaissance", sub: "notes qualifiées, index" },
    { label: "Opération", sub: "systèmes métier, registre" },
    { label: "Exécution", sub: "outils bornés, contrôles" },
  ];
  const w = 280, h = 80, gapX = 24, gapY = 16, x0 = 40, y0 = 10;
  return (
    <Frame title="Quatre responsabilités, pas un super-agent" viewBox="0 0 640 200">
      {quadrants.map((q, i) => {
        const col = i % 2, row = Math.floor(i / 2);
        return <Box key={q.label} x={x0 + col * (w + gapX)} y={y0 + row * (h + gapY)} w={w} h={h} label={q.label} sub={q.sub} accent={i === 0} />;
      })}
    </Frame>
  );
}

export function MissionFlowDiagram() {
  const steps = ["Objectif accepté", "Domaines", "Sources & autorité", "Compétences & lots", "Contexte minimal", "Décision & autorisation", "Exécution", "Passation", "Mesure"];
  const w = 122, h = 50, gap = 8, perRow = 3;
  return (
    <Frame title="Une mission qui circule sans tout partager" viewBox={`0 0 640 ${Math.ceil(steps.length / perRow) * (h + 30) + 10}`}>
      {steps.map((label, i) => {
        const col = i % perRow, row = Math.floor(i / perRow);
        const x = 20 + col * (w + gap + 40);
        const y = 10 + row * (h + 30);
        return (
          <g key={label}>
            <Box x={x} y={y} w={w} h={h} label={label} accent={i === 0} />
            {col < perRow - 1 && i < steps.length - 1 && <Arrow x1={x + w} y1={y + h / 2} x2={x + w + 40} y2={y + h / 2} />}
          </g>
        );
      })}
    </Frame>
  );
}

export function PoleMapDiagram() {
  const poles = ["Direction", "Marketing", "Vente", "Relation client", "Opérations", "Produit", "Finance", "RH", "Juridique", "IT & données"];
  const cols = 5, w = 108, h = 46, gapX = 10, gapY = 10;
  return (
    <Frame title="Cartographier les pôles réellement présents" viewBox={`0 0 640 ${Math.ceil(poles.length / cols) * (h + gapY) + 10}`}>
      {poles.map((label, i) => {
        const col = i % cols, row = Math.floor(i / cols);
        return <Box key={label} x={8 + col * (w + gapX)} y={8 + row * (h + gapY)} w={w} h={h} label={label} />;
      })}
    </Frame>
  );
}

export function DataFormatsDiagram() {
  const rows = [
    { label: "Doctrine & méthode", sub: "Markdown versionné" },
    { label: "Objets métier vivants", sub: "application ou base adaptée" },
    { label: "Contrat d'échange", sub: "JSON / schéma structuré" },
    { label: "Index de recherche", sub: "projection dérivée, pas autorité" },
  ];
  const h = 46, gap = 10, x = 60, w = 520;
  return (
    <Frame title="Un format par responsabilité, pas par habitude" viewBox={`0 0 640 ${rows.length * (h + gap) + 12}`}>
      {rows.map((r, i) => (
        <Box key={r.label} x={x} y={8 + i * (h + gap)} w={w} h={h} label={r.label} sub={r.sub} accent={i === 0} />
      ))}
    </Frame>
  );
}

export function SkillsSopDiagram() {
  return (
    <Frame title="Métier, compétence, procédure, exécutant" viewBox="0 0 640 130">
      <Box x={10} y={40} w={140} h={50} label="Métier" sub="vente, finance…" />
      <Arrow x1={150} y1={65} x2={172} y2={65} />
      <Box x={172} y={40} w={140} h={50} label="Compétence" sub="savoir-faire" accent />
      <Arrow x1={312} y1={65} x2={334} y2={65} />
      <Box x={334} y={40} w={140} h={50} label="Procédure / SOP" sub="chemin stable" />
      <Arrow x1={474} y1={65} x2={496} y2={65} />
      <Box x={496} y={40} w={134} h={50} label="Exécutant" sub="humain ou agent" />
    </Frame>
  );
}

export function ToolAccessDiagram() {
  return (
    <Frame title="Une connexion réussie ne prouve pas l'opération" viewBox="0 0 640 190">
      <Box x={20} y={20} w={170} h={50} label="API / CLI / MCP" sub="porte d'accès" />
      <Arrow x1={190} y1={45} x2={222} y2={45} />
      <Box x={222} y={20} w={200} h={50} label="Contrôle technique" sub="interposé devant l'action" accent />
      <Arrow x1={422} y1={45} x2={454} y2={45} />
      <Box x={454} y={20} w={166} h={50} label="Action réelle" sub="testée, refus vérifié" />
      <text x={320} y={110} textAnchor="middle" fontSize="11" fill={SUBTEXT}>Une interdiction rencontrée par une porte</text>
      <text x={320} y={130} textAnchor="middle" fontSize="11" fill={SUBTEXT}>reste une interdiction sur les autres portes.</text>
    </Frame>
  );
}

export function WorkflowCrossPoleDiagram() {
  const steps = ["Demande", "Qualification", "Faisabilité", "Proposition", "Acceptation", "Livraison", "Facturation", "Apprentissage"];
  const w = 132, h = 50, gap = 10, y = 30;
  const perRow = 4;
  return (
    <Frame title="Un résultat qui traverse plusieurs pôles" viewBox={`0 0 640 ${Math.ceil(steps.length / perRow) * (h + 40) + 10}`}>
      {steps.map((label, i) => {
        const col = i % perRow, row = Math.floor(i / perRow);
        const x = 8 + col * (w + gap);
        const yy = y + row * (h + 40) - 20;
        return (
          <g key={label}>
            <Box x={x} y={yy} w={w} h={h} label={label} accent={i === 0} />
            {col < perRow - 1 && i < steps.length - 1 && <Arrow x1={x + w} y1={yy + h / 2} x2={x + w + gap} y2={yy + h / 2} />}
          </g>
        );
      })}
    </Frame>
  );
}

export function AdoptionLaddersDiagram() {
  const steps = ["Diagnostic", "Préparation", "Assistance isolée", "Pilote supervisé", "Extension limitée", "Exploitation suivie"];
  const w = 100, gap = 6;
  return (
    <Frame title="Avancer par paliers réversibles" viewBox="0 0 640 200">
      {steps.map((label, i) => {
        const x = 8 + i * (w + gap);
        const barH = 30 + i * 22;
        const y = 170 - barH;
        return (
          <g key={label}>
            <rect x={x} y={y} width={w} height={barH} rx={8} fill={i === steps.length - 1 ? "#e8d5b01a" : "#ffffff0a"} stroke={i === steps.length - 1 ? GOLD : LINE} strokeWidth={1.25} />
            <text x={x + w / 2} y={188} textAnchor="middle" fontSize="9.5" fill={SUBTEXT}>{label}</text>
          </g>
        );
      })}
    </Frame>
  );
}

export function TemplateTreeDiagram() {
  return (
    <Frame title="Un dossier de départ, pas une configuration" viewBox="0 0 640 170">
      <Box x={250} y={8} w={140} h={38} label="entreprise-exemple/" accent />
      {["connaissance/", "procedures/", "projets/", "apprentissage/"].map((label, i) => {
        const x = 20 + i * 155;
        return (
          <g key={label}>
            <Box x={x} y={100} w={135} h={44} label={label} />
            <Arrow x1={320} y1={46} x2={x + 67} y2={100} />
          </g>
        );
      })}
    </Frame>
  );
}
