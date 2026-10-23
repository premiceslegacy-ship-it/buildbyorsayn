import { DaRoot } from "@/components/da/DaRoot";
import "@/app/ui3.css";

export function AuthRouteLoading({ title }: { title: string }) {
  return (
    <DaRoot>
      <main className="ui3-state" aria-busy="true">
        <div>
          <h1 className="t-2">{title}</h1>
          <p>BUILD prépare cet écran.</p>
        </div>
      </main>
    </DaRoot>
  );
}
