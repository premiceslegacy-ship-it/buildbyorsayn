import { DaRoot } from "@/components/da/DaRoot";

export default function DashboardLoading() {
  return <DaRoot className="da-app"><main className="page-state" aria-busy="true"><div className="page-state__in"><div className="skeleton" style={{ width: 420, maxWidth: "84vw", height: 240, borderRadius: 28 }} /></div></main></DaRoot>;
}
