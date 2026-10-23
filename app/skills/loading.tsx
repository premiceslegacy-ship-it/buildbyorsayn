import { DaRoot } from "@/components/da/DaRoot";
import "@/app/ui3.css";

export default function SkillsLoading() {
  return <DaRoot><main className="ui3-state" aria-busy="true"><div><div className="ui3-auth-success-mark skeleton" aria-hidden="true" /><h1 className="t-2">Chargement de tes skills</h1><p>BUILD vérifie ton accès et les versions disponibles.</p></div></main></DaRoot>;
}
