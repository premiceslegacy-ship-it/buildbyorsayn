import { DaRoot } from "@/components/da/DaRoot";

export function Ui5Loading({ label }: { label: string }) {
  return <DaRoot className="da-app"><main className="page-state" aria-busy="true"><div className="page-state__in"><span className="skeleton" style={{ width: 76, height: 76, borderRadius: "50%" }} /><h1 className="t-1">{label}</h1><p>BUILD vérifie les informations nécessaires.</p></div></main></DaRoot>;
}
