import { DaRoot } from "@/components/da/DaRoot";
import { AppState } from "@/components/ui/AppState";
import { navIdentity } from "@/lib/auth/navIdentity.server";

export default async function NotFound() {
  const identity = await navIdentity();
  const homeAction = identity ? { label: "Retour à Aujourd'hui", href: "/dashboard" } : { label: "Retour à l'accueil", href: "/" };
  return <DaRoot className="da-app"><main><AppState object="offre" title="Cette page n'existe pas." detail="Le lien est peut-être ancien ou incomplet. Retourne à l'accueil pour continuer." action={homeAction} secondary={identity ? { label: "Retour à l'accueil", href: "/" } : undefined} /></main></DaRoot>;
}
