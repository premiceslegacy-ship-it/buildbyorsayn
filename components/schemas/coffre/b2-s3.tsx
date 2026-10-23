import { Compare, Fork, Rings, ToolMap } from "../kit";
import type { HandcraftedVisual } from "./types";

const EM = "#22d96e";

export function QuatrePortesDiagram() {
  return <ToolMap
    title="Quatre portes, quatre rôles"
    description="CLI, API, MCP et skill ne répondent pas à la même question. Sous chaque porte, un exemple réel."
    legend="La connexion donne un accès, le skill une méthode, aucun ne donne une permission."
    ariaLabel="Quatre portes avec un exemple chacune : la CLI de GitHub lance une commande dans le terminal, l'API de Stripe sert de guichet entre deux logiciels, MCP expose les outils de Notion à une IA, un skill de Claude Code décrit la méthode pour s'en servir."
    accent={EM}
    accentGroup={-1}
    groups={[
      { role: "CLI", tools: [{ name: "GitHub", description: "Une commande dans le terminal" }] },
      { role: "API", tools: [{ name: "Stripe", description: "Un guichet entre logiciels" }] },
      { role: "MCP", tools: [{ name: "Notion", description: "Des outils exposés à l'IA" }] },
      { role: "Skill", tools: [{ name: "Claude Code", description: "La méthode pour s'en servir" }] },
    ]}
  />;
}

export function PlusPetitePorteDiagram() {
  return <Fork
    title="La plus petite porte suffit"
    description="Tu pars d'une opération exacte, puis tu choisis la surface la plus simple qui la couvre."
    legend="Pas d'ordre absolu : la bonne porte dépend de l'opération, pas de la mode."
    ariaLabel="Depuis une opération exacte, trois portes possibles : la CLI quand une commande officielle couvre l'opération, l'API quand ton produit doit intégrer le service, MCP quand l'agent doit découvrir plusieurs outils."
    accent={EM}
    situation="Une opération exacte, écrite"
    outcomes={[
      { label: "CLI", condition: "Une commande officielle la couvre" },
      { label: "API", condition: "Ton produit intègre le service" },
      { label: "MCP", condition: "L'agent découvre plusieurs outils" },
    ]}
  />;
}

export function AccesJugementPermissionDiagram() {
  return <Rings
    title="Trois couches qui s'empilent"
    description="Exemple d'une fleuriste : l'accès, la méthode et les droits jouent trois rôles qui ne se remplacent pas."
    legend="Le compte garde le dernier mot : sans droit, l'agent ne peut rien faire."
    ariaLabel="Le travail utile de l'agent est au centre de trois couches : le jugement apporté par le skill pour repérer les commandes à préparer, l'accès donné par la connexion pour lire les commandes du jour, et la permission du compte qui interdit d'annuler ou de toucher un paiement. La permission est mise en avant."
    accent={EM}
    core="Travail"
    accentIndex={2}
    rings={[
      { label: "Jugement", detail: "Le skill : quoi préparer" },
      { label: "Accès", detail: "Lire les commandes du jour" },
      { label: "Permission", detail: "Ni annuler, ni payer" },
    ]}
  />;
}

export function CleProtegeeDiagram() {
  return <Compare
    title="La clé reste derrière la porte"
    description="Où vit la clé d'accès à un service : à gauche à la vue de tous, à droite rangée et limitée."
    legend="Teste le refus : une action interdite doit vraiment échouer."
    ariaLabel="Deux façons de gérer une clé d'accès. Exposée : collée dans le prompt, écrite dans le skill, visible dans les journaux, sur un compte qui peut tout faire. Protégée : gardée dans un coffre, absente du skill, des journaux sans secret, un compte limité à une action, et un refus testé."
    accent={EM}
    beforeTitle="Clé exposée"
    afterTitle="Clé protégée"
    rows={[
      { before: "Collée dans le prompt", after: "Gardée dans un coffre" },
      { before: "Écrite dans le skill", after: "Le skill ne la voit pas" },
      { before: "Visible dans les journaux", after: "Journaux sans secret" },
      { before: "Compte qui peut tout faire", after: "Compte limité à une action" },
    ]}
  />;
}

export const b2_s3_VISUALS = [
  { name: "QuatrePortes", kind: "schema", chapter: "b2-s3", component: QuatrePortesDiagram },
  { name: "PlusPetitePorte", kind: "schema", chapter: "b2-s3", component: PlusPetitePorteDiagram },
  { name: "AccesJugementPermission", kind: "schema", chapter: "b2-s3", component: AccesJugementPermissionDiagram },
  { name: "CleProtegee", kind: "schema", chapter: "b2-s3", component: CleProtegeeDiagram },
] as const satisfies readonly HandcraftedVisual[];
