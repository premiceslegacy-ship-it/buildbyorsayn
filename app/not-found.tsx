import { DaRoot } from "@/components/da/DaRoot";
import { RouteState } from "@/components/ui5/RouteState";

export default function NotFound() {
  return <DaRoot className="da-app"><RouteState code="404" title="Cette page n’existe pas." message="Le lien est peut-être ancien ou incomplet." /></DaRoot>;
}
