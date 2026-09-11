"use client";

import { Frame, Box, Arrow, SUBTEXT, GOLD } from "@/components/ui/diagram-primitives";

export function PromptContextDiagram() {
  const x = 30, y = 90, w = 660, h = 70;
  const forgotten = 160, loaded = 340;
  return (
    <Frame
      title="La fenêtre de contexte se remplit, puis oublie"
      explainer="Un modèle IA ne lit pas un dossier entier en mémoire permanente : tout ce que tu lui donnes occupe une place limitée. Quand cette place est pleine, ce qui a été dit en premier commence à s'effacer."
      caption="Lecture : la fenêtre se lit de gauche à droite comme une file d'attente - ce qui entre en dernier (la conversation en cours) reste, ce qui est entré en premier sort. Toute la ligne représente la limite du modèle : rien ne dépasse à droite."
      viewBox="0 0 720 200"
    >
      <text x={x + w / 2} y={y - 22} textAnchor="middle" fontSize="10.5" fontWeight={600} letterSpacing="0.06em" fill="#c4bfb799">
        LA FENÊTRE DE CONTEXTE, DE GAUCHE À DROITE
      </text>
      <rect x={x} y={y} width={forgotten} height={h} rx={8} fill="#ffffff06" stroke="#ffffff1a" strokeWidth={1} />
      <text x={x + forgotten / 2} y={y + h / 2 + 4} textAnchor="middle" fontSize="11" fill="#d9d5cf55">oublié</text>

      <rect x={x + forgotten} y={y} width={loaded} height={h} rx={0} fill="#e8d5b01f" stroke={GOLD} strokeWidth={1.25} />
      <text x={x + forgotten + loaded / 2} y={y + h / 2 - 5} textAnchor="middle" fontSize="12.5" fontWeight={600} fill="#f0ede8">Contexte chargé</text>
      <text x={x + forgotten + loaded / 2} y={y + h / 2 + 13} textAnchor="middle" fontSize="10.5" fill={SUBTEXT}>fichiers de projet, règles, standards</text>

      <rect x={x + forgotten + loaded} y={y} width={w - forgotten - loaded} height={h} rx={8} fill="#ffffff0a" stroke="#ffffff26" strokeWidth={1} />
      <text x={x + forgotten + loaded + (w - forgotten - loaded) / 2} y={y + h / 2 - 5} textAnchor="middle" fontSize="10.5" fill={SUBTEXT}>conversation</text>
      <text x={x + forgotten + loaded + (w - forgotten - loaded) / 2} y={y + h / 2 + 11} textAnchor="middle" fontSize="10.5" fill={SUBTEXT}>en cours</text>
    </Frame>
  );
}

export function ApiFlowDiagram() {
  const w = 156, h = 76, gap = 24, y = 50;
  const steps = [
    { label: "Mon app", sub: "le client, qui a faim" },
    { label: "Requête (API)", sub: "la commande passée" },
    { label: "Service tiers", sub: "la cuisine qui prépare" },
    { label: "Réponse (JSON)", sub: "le plat livré" },
  ];
  return (
    <Frame
      title="Une API, comme un serveur au restaurant"
      explainer="Ton application ne parle jamais directement à la « cuisine » (le service tiers) : elle passe une commande (la requête), attend, et reçoit un plat (la réponse) - sans jamais voir comment il a été préparé."
      caption="Lecture : la flèche pointillée du bas montre que la réponse revient exactement au client qui a passé la commande, pas à un autre."
      viewBox="0 0 720 200"
    >
      {steps.map((s, i) => (
        <g key={s.label}>
          <Box x={10 + i * (w + gap)} y={y} w={w} h={h} label={s.label} sub={s.sub} accent={i === 0 || i === 3} />
          {i < steps.length - 1 && (
            <Arrow x1={10 + i * (w + gap) + w} y1={y + h / 2} x2={10 + (i + 1) * (w + gap)} y2={y + h / 2} />
          )}
        </g>
      ))}
      <path
        d={`M${10 + w / 2} ${y + h + 10} C ${10 + w / 2} ${y + h + 48}, ${10 + 3 * (w + gap) + w / 2} ${y + h + 48}, ${10 + 3 * (w + gap) + w / 2} ${y + h + 10}`}
        fill="none"
        stroke="#e8d5b088"
        strokeWidth={1.25}
        strokeDasharray="3 4"
        markerEnd="url(#apiflow-return-arrow)"
      />
      <defs>
        <marker id="apiflow-return-arrow" markerWidth="9" markerHeight="9" refX="7" refY="3.5" orient="auto">
          <path d="M0,0.7 L7,3.5 L0,6.3 Z" fill="#e8d5b0aa" />
        </marker>
      </defs>
      <text x={360} y={y + h + 70} textAnchor="middle" fontSize="10.5" fill={SUBTEXT}>la réponse revient toujours au client qui a passé la commande</text>
    </Frame>
  );
}

export function ProjectPipelineDiagram() {
  const w = 158, h = 74, gap = 20, y = 76;
  const steps = [
    { label: "No-code (brouillon)", sub: "premier jet visuel, sans compte" },
    { label: "GitHub (sauvegarde)", sub: "le code est versionné" },
    { label: "IDE + IA", sub: "on ajuste et on corrige" },
    { label: "Hébergeur (en ligne)", sub: "le site devient accessible" },
  ];
  return (
    <Frame
      title="De l'idée à l'URL en ligne"
      explainer="Quatre étapes distinctes, chacune avec son propre outil - inutile de tout savoir faire à la main dès le départ, il suffit de comprendre ce que chaque étape apporte."
      caption="Attention : les clés API (mots de passe techniques) ne doivent jamais être écrites directement dans le code, même en brouillon - un dépôt public les expose immédiatement."
      viewBox="0 0 720 230"
    >
      <text x={10 + w / 2} y={y - 24} textAnchor="middle" fontSize="10.5" fill="#d9d5cf70">pas de comptes, pas de paiements</text>
      {steps.map((s, i) => (
        <g key={s.label}>
          <Box x={10 + i * (w + gap)} y={y} w={w} h={h} label={s.label} sub={s.sub} accent={i === steps.length - 1} />
          {i < steps.length - 1 && (
            <Arrow x1={10 + i * (w + gap) + w} y1={y + h / 2} x2={10 + (i + 1) * (w + gap)} y2={y + h / 2} />
          )}
        </g>
      ))}
      <rect x={10 + 2 * (w + gap) - 8} y={y + h + 20} width={w + 16} height={44} rx={8} fill="#ef444414" stroke="#ef444450" strokeWidth={1} />
      <text x={10 + 2 * (w + gap) + w / 2} y={y + h + 38} textAnchor="middle" fontSize={10.5} fill="#f87171cc" fontWeight={600}>
        clés API :
      </text>
      <text x={10 + 2 * (w + gap) + w / 2} y={y + h + 53} textAnchor="middle" fontSize={10.5} fill="#f87171cc" fontWeight={600}>
        jamais dans le code
      </text>
    </Frame>
  );
}

export function ContextFilesDiagram() {
  const fileX = 20, fileW = 240, fileH = 58, gapY = 18, y0 = 30;
  const files = [
    { name: "BRIEF.md", sub: "projet et objectif" },
    { name: "PRD.md", sub: "fonctionnalités, critères de fin" },
  ];
  const sessionX = 380, sessionY = 90, sessionW = 170, sessionH = 76;
  const codeX = 600, codeY = 90, codeW = 106, codeH = 76;
  return (
    <Frame
      title="Le dossier /docs qui cadre chaque session - le strict minimum"
      explainer="Sans ces fichiers, chaque nouvelle session IA repart de zéro et produit un résultat générique. Avec eux, l'IA connaît le projet avant même la première question. Un vrai projet va bien plus loin (dossier fondateur complet, index canonique) - voir Oracle by Orsayn."
      caption="Lecture : les fichiers alimentent la session IA, qui produit ensuite le code - le code ne modifie jamais directement les fichiers de cadrage."
      viewBox="0 0 720 230"
    >
      {files.map((f, i) => {
        const fy = y0 + i * (fileH + gapY);
        return (
          <g key={f.name}>
            <Box x={fileX} y={fy} w={fileW} h={fileH} label={f.name} sub={f.sub} />
            <Arrow x1={fileX + fileW} y1={fy + fileH / 2} x2={sessionX} y2={sessionY + sessionH / 2} />
          </g>
        );
      })}
      <Box x={sessionX} y={sessionY} w={sessionW} h={sessionH} label="Session IA" accent />
      <Arrow x1={sessionX + sessionW} y1={sessionY + sessionH / 2} x2={codeX} y2={codeY + codeH / 2} />
      <Box x={codeX} y={codeY} w={codeW} h={codeH} label="Code du projet" accent />
    </Frame>
  );
}

export function FounderDossierDiagram() {
  const columns = [
    {
      label: "01 - Cadrage",
      items: ["ORSAYN-PROJECT.md", "BRIEF.md", "ASSUMPTIONS.md", "CAPABILITY-MAP.md"],
    },
    {
      label: "02 - Expérience",
      items: ["BRAND-SYSTEM.md", "COPY-SYSTEM.md", "DESIGN-SYSTEM.md", "USER-FLOWS.md"],
    },
    {
      label: "03 à 07 - Runtime",
      items: ["DATA-MODEL.md", "SECURITY-MODEL.md", "PRD.md", "EXPERIMENTATION.md"],
    },
    {
      label: "10/11 - Marché",
      items: ["GO-TO-MARKET.md", "INDEX.md (carte)", "plans d'exécution", "..."],
    },
  ];
  const viewW = 720, sideMargin = 10, colGap = 18, rowH = 44, rowGap = 8, y0 = 20;
  const colW = (viewW - sideMargin * 2 - colGap * (columns.length - 1)) / columns.length;
  return (
    <Frame
      title="Le dossier fondateur complet - ce que formalise Oracle by Orsayn"
      explainer="Deux fichiers cadrent une session. Un vrai projet (app, SaaS, outil métier) a besoin de bien plus : un dossier fondateur numéroté dans l'ordre réel de construction, du cadrage jusqu'au go-to-market, avec un INDEX.md qui fait carte canonique."
      caption="Lecture : chaque colonne est un pôle numéroté. L'ordre suit la dépendance de construction, pas l'alphabet - le brand et le design ne se décident qu'une fois le cadrage posé, la donnée et la sécurité qu'une fois l'expérience validée."
      viewBox={`0 0 ${viewW} 270`}
    >
      {columns.map((col, ci) => {
        const cx = sideMargin + ci * (colW + colGap);
        return (
          <g key={col.label}>
            <rect x={cx} y={y0} width={colW} height={8 + col.items.length * (rowH + rowGap) + 34} rx={8} fill="#ffffff05" stroke="#ffffff14" strokeWidth={1} />
            <text x={cx + colW / 2} y={y0 + 22} textAnchor="middle" fontSize="11" fontWeight={600} fill={GOLD}>{col.label}</text>
            {col.items.map((item, ii) => (
              <Box
                key={item}
                x={cx + 8}
                y={y0 + 36 + ii * (rowH + rowGap)}
                w={colW - 16}
                h={rowH}
                label={item}
                tone="muted"
              />
            ))}
          </g>
        );
      })}
    </Frame>
  );
}
