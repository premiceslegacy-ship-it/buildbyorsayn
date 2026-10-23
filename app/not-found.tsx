import { DaRoot } from "@/components/da/DaRoot";
import { AppState } from "@/components/ui/AppState";

export default function NotFound() {
  return <DaRoot className="da-app"><main><AppState object="offre" title="Cette page n’existe pas." detail="Le lien est peut-être ancien ou incomplet. Retourne à Aujourd’hui pour continuer." action={{ label: "Retour à Aujourd’hui", href: "/dashboard" }} secondary={{ label: "Retour à l’accueil", href: "/" }} /></main></DaRoot>;
}
