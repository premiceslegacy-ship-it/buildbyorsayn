import { Compare, Rings, ToolMap } from "../kit";
import type { HandcraftedVisual } from "../coffre/types";

const EM = "#22d96e";

function EntrepriseSansSuperAgentDiagram() {
  return <Rings
    title="Quatre rôles, aucun super-agent"
    description="Autour d'un objet partagé, chaque responsabilité reste à sa place."
    legend="AI-first : le logiciel aide dès le départ, pas un modèle dans chaque geste."
    ariaLabel="Autour de l'objet partagé, quatre couches séparées : les outils appliquent les droits, le système métier garde l'état, la connaissance explique, la direction donne le pourquoi."
    accent={EM}
    core="Objet"
    accentIndex={0}
    rings={[
      { label: "Outils", detail: "Appliquent les droits" },
      { label: "Système métier", detail: "Garde l'état" },
      { label: "Connaissance", detail: "Explique la méthode" },
      { label: "Direction", detail: "Donne le pourquoi" },
    ]}
  />;
}

function ArchipelDesAutoritesDiagram() {
  return <ToolMap
    title="Chaque source garde son état"
    description="Le CRM, le planning et la comptabilité font foi chacun pour un état différent."
    legend="Relie par identifiant stable : deux noms identiques ne prouvent rien."
    ariaLabel="HubSpot fait foi sur l'opportunité, Notion sur la charge des opérations, Stripe sur le paiement, et ton agent les relie par identifiant sans recopier leurs données."
    accent={EM}
    accentGroup={3}
    groups={[
      { role: "L'opportunité", tools: [{ name: "HubSpot", description: "Le CRM fait foi" }] },
      { role: "La charge", tools: [{ name: "Notion", description: "Le planning des opérations" }] },
      { role: "Le paiement", tools: [{ name: "Stripe", description: "La facture et l'encaissement" }] },
      { role: "Le lien", tools: [{ name: "Hermes Agent", description: "Lit par identifiant, sans copier" }] },
    ]}
  />;
}

function ProjectionSansDossierCompletDiagram() {
  return <Compare
    title="Voir le blocage, pas le dossier"
    description="La vue de direction montre l'état, la raison et la personne, sans ouvrir les pièces."
    legend="Montre juste assez pour savoir qui relancer."
    ariaLabel="Le conseil juridique, les pièces du client et les échanges internes restent fermés ; la vue de direction affiche seulement bloqué, validation juridique manquante et la responsable."
    accent={EM}
    beforeTitle="Reste fermé"
    afterTitle="Vue de direction"
    rows={[
      { before: "Le conseil juridique complet", after: "Bloqué" },
      { before: "Les pièces du client", after: "Validation juridique manquante" },
      { before: "Les échanges internes", after: "Qui : la juriste" },
    ]}
  />;
}

export const doctrine13 = [
  { name: "EntrepriseSansSuperAgent", kind: "schema", chapter: "entreprise-01-cerveau-federe.md", component: EntrepriseSansSuperAgentDiagram },
  { name: "ArchipelDesAutorites", kind: "schema", chapter: "entreprise-01-cerveau-federe.md", component: ArchipelDesAutoritesDiagram },
  { name: "ProjectionSansDossierComplet", kind: "schema", chapter: "entreprise-01-cerveau-federe.md", component: ProjectionSansDossierCompletDiagram },
] as const satisfies readonly HandcraftedVisual[];
