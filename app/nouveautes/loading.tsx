import { DaRoot } from "@/components/da/DaRoot";

export default function NouveautesLoading() {
  return <DaRoot className="da-app"><main className="page-state" aria-busy="true"><div className="page-state__in"><div className="skeleton" style={{ width: 220, height: 36, borderRadius: 12 }} /><div className="skeleton" style={{ width: 360, maxWidth: "80vw", height: 18, borderRadius: 9 }} /></div></main></DaRoot>;
}
