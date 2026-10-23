import "server-only";
import Link from "next/link";
import { ArrowLeft, Lock } from "lucide-react";
import { redirect } from "next/navigation";
import { doctrineAccessStatus } from "@/lib/doctrine/access.server";
import { readPublishedDoctrine } from "@/lib/doctrine/storage";
import { allHermesMarkdown } from "@/lib/hermes/content";
import type { DoctrineFile } from "../../doctrine/markdown";
import { COFFRE_LABEL, COFFRE_PRICE } from "@/lib/pricing";
import { DaRoot } from "@/components/da/DaRoot";
import "@/app/ui3.css";

export function GateShell({ children }: { children: React.ReactNode }) {
  return (
    <DaRoot><main className="ui3-state"><div className="ui3-access-card"><Link href="/skills" className="ui3-text-link"><ArrowLeft aria-hidden="true" /> Retour aux skills</Link>{children}</div></main></DaRoot>
  );
}

function LockedGate() {
  return (
    <GateShell>
      <div>
        <Lock aria-hidden="true" />
        <h1 className="t-2">Hermes Agent : organiser le travail avec l&apos;IA</h1>
        <p>
          Comment partir d&apos;un vrai problème, répartir les rôles, ranger les bonnes informations et donner à chaque outil seulement les accès dont il a besoin. Ce contenu est réservé à {COFFRE_LABEL}.
        </p>
        <Link
          href="/checkout"
          className="btn btn--p"
        >
          Prendre {COFFRE_LABEL} à {COFFRE_PRICE}&nbsp;€
        </Link>
      </div>
    </GateShell>
  );
}

function UnavailableGate() {
  return (
    <GateShell>
      <h1 className="t-2">Parcours momentanément indisponible</h1>
      <p>Réessaie plus tard. Aucun contenu non vérifié n’est affiché.</p>
    </GateShell>
  );
}

export type HermesGateResult =
  | { ok: true; render: null; files: readonly DoctrineFile[] }
  | { ok: false; render: React.ReactNode; files: null };

/**
 * Shared server-side gate + doctrine read for both the Hermes Agent grid
 * (page.tsx) and each chapter's detail route ([chapterSlug]/page.tsx) - the
 * same access check and file verification must run identically on both.
 */
export async function hermesGate(): Promise<HermesGateResult> {
  const status = await doctrineAccessStatus();
  if (status === 401) redirect("/login");
  if (status !== 200) return { ok: false, render: <LockedGate />, files: null };

  try {
    await readPublishedDoctrine();
    return { ok: true, render: null, files: allHermesMarkdown() };
  } catch {
    return { ok: false, render: <UnavailableGate />, files: null };
  }
}
