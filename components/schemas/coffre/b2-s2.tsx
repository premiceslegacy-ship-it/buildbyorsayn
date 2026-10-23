import { Steps, ToolMap } from "../kit";
import type { HandcraftedVisual } from "./types";

const EM = "#22d96e";

export function CarteDesOutilsParRoleDiagram() {
  return <ToolMap
    title="Six rôles, puis les outils"
    description="Tu poses d'abord les rôles du projet, puis un outil principal pour chacun, jamais l'inverse."
    legend="Une marque ne reçoit jamais un rôle avant que le projet en ait besoin."
    ariaLabel="Carte des outils par rôle : chercher avec NotebookLM, réfléchir avec Claude ou ChatGPT, dessiner avec Figma, construire avec Cursor ou Claude Code, versionner avec GitHub, livrer avec Vercel."
    accent={EM}
    accentGroup={-1}
    groups={[
      { role: "Chercher", tools: [{ name: "NotebookLM", description: "Interroge tes sources" }] },
      { role: "Réfléchir", tools: [{ name: "Claude", description: "Raisonne sur la tâche" }, { name: "ChatGPT", description: "Compare sa sortie" }] },
      { role: "Dessiner", tools: [{ name: "Figma", description: "Pose l'interface" }] },
      { role: "Construire", tools: [{ name: "Cursor", description: "Montre le code" }, { name: "Claude Code", description: "Exécute au terminal" }] },
      { role: "Versions", tools: [{ name: "GitHub", description: "Garde les versions" }] },
      { role: "Livrer", tools: [{ name: "Vercel", description: "Met le site en ligne" }] },
    ]}
  />;
}

export function StackSiteEditorialDiagram() {
  return <ToolMap
    title="La stack d'un site simple"
    description="Exemple : un site éditorial part du contenu et n'a besoin que de quatre rôles pour vivre."
    legend="Cloudflare attend tant qu'aucun besoin d'hébergement différent n'apparaît."
    ariaLabel="La stack d'un site éditorial simple, en quatre rôles : construire avec Next.js, habiller avec Tailwind CSS et shadcn/ui, versionner avec GitHub, mettre en ligne avec Vercel. Cloudflare reste en attente d'un besoin réseau."
    accent={EM}
    accentGroup={-1}
    groups={[
      { role: "Construire", tools: [{ name: "Next.js", description: "Les pages du site" }] },
      { role: "Habiller", tools: [{ name: "Tailwind CSS", description: "Le style" }, { name: "shadcn/ui", description: "Les composants" }] },
      { role: "Versionner", tools: [{ name: "GitHub", description: "Chaque changement gardé" }] },
      { role: "Mettre en ligne", tools: [{ name: "Vercel", description: "Le site public" }, { name: "Cloudflare", description: "Attend un vrai besoin" }] },
    ]}
  />;
}

export function StackPortailClientDiagram() {
  return <ToolMap
    title="Le portail ajoute des rôles"
    description="Exemple : chaque fonction d'un portail client fait entrer un service, avec ses données et son suivi."
    legend="Pas de paiement dans le projet, pas de Stripe dans la stack."
    ariaLabel="La stack d'un portail client en six rôles : données et comptes avec Supabase ou Neon, paiement avec Stripe, messages avec Resend, erreurs avec Sentry, usage avec PostHog, suivi avec Notion et Linear."
    accent={EM}
    accentGroup={-1}
    groups={[
      { role: "Données et comptes", tools: [{ name: "Supabase", description: "Base et connexion" }, { name: "Neon", description: "Autre offre PostgreSQL" }] },
      { role: "Paiement", tools: [{ name: "Stripe", description: "Seulement s'il y a paiement" }] },
      { role: "Messages", tools: [{ name: "Resend", description: "E-mails transactionnels" }] },
      { role: "Erreurs", tools: [{ name: "Sentry", description: "Reçoit les erreurs" }] },
      { role: "Usage", tools: [{ name: "PostHog", description: "Observe l'usage" }] },
      { role: "Suivi", tools: [{ name: "Notion", description: "Garde les briefs" }, { name: "Linear", description: "Suit les changements" }] },
    ]}
  />;
}

export function OutilsQuiAttendentDiagram() {
  return <Steps
    title="Un outil entre sur besoin"
    description="Exemple : Stripe reste sur l'étagère jusqu'au jour où un client doit vraiment payer en ligne."
    legend="Tant qu'il attend, l'outil ne te coûte ni réglage ni suivi."
    ariaLabel="Le chemin d'un outil vers le projet, avec Stripe en exemple : il attend sur l'étagère, un besoin réel apparaît, un paiement d'essai le teste, puis il entre avec un rôle et des droits écrits. Le besoin réel est mis en avant."
    accent={EM}
    accentIndex={1}
    items={[
      { label: "Sur l'étagère", detail: "Hors du projet", tools: ["Stripe"] },
      { label: "Besoin réel", detail: "Un client doit payer" },
      { label: "Test", detail: "Un paiement d'essai" },
      { label: "Il entre", detail: "Rôle et droits écrits", tools: ["Stripe"] },
    ]}
  />;
}

export const b2_s2_VISUALS = [
  { name: "CarteDesOutilsParRole", kind: "schema", chapter: "b2-s2", component: CarteDesOutilsParRoleDiagram },
  { name: "StackSiteEditorial", kind: "schema", chapter: "b2-s2", component: StackSiteEditorialDiagram },
  { name: "StackPortailClient", kind: "schema", chapter: "b2-s2", component: StackPortailClientDiagram },
  { name: "OutilsQuiAttendent", kind: "schema", chapter: "b2-s2", component: OutilsQuiAttendentDiagram },
] as const satisfies readonly HandcraftedVisual[];
