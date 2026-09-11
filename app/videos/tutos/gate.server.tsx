import "server-only";
import Link from "next/link";
import { ArrowLeft, Lock } from "lucide-react";
import { redirect } from "next/navigation";
import { doctrineAccessStatus } from "@/lib/doctrine/access.server";
import { readPublishedDoctrine } from "@/lib/doctrine/storage";
import type { DoctrineFile } from "../../doctrine/markdown";
import { COFFRE_LABEL, COFFRE_PRICE } from "@/lib/pricing";

export function GateShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#1c1c1f] via-[#0e0e0f] to-[#0e0e0f] text-[#f0ede8] font-sans">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <Link href="/skills" className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-white/90 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Retour aux skills
        </Link>
        {children}
      </div>
    </main>
  );
}

function LockedGate() {
  return (
    <GateShell>
      <div className="mt-10 rounded-2xl border border-[#e8d5b0]/15 bg-[#e8d5b0]/[0.04] p-8">
        <div className="w-12 h-12 rounded-full bg-[#e8d5b0]/10 flex items-center justify-center mb-6">
          <Lock className="w-5 h-5 text-[#e8d5b0]" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">Hermes Agent - doctrine agentique</h1>
        <p className="mt-4 text-white/60 leading-relaxed">
          Comment décomposer un métier en agents, borner leur autorité et rendre une entreprise entière AI-first - en capitalisant sur sa connaissance et ses process pour les rendre accessibles à des agents IA. Ce contenu est réservé à {COFFRE_LABEL}.
        </p>
        <Link
          href="/checkout"
          className="mt-6 inline-flex items-center justify-center rounded-xl bg-[#e8d5b0] px-5 py-3 text-sm font-semibold text-[#0e0e0f] hover:bg-[#f0dfc0] transition-colors"
        >
          Prendre {COFFRE_LABEL} - {COFFRE_PRICE}€
        </Link>
      </div>
    </GateShell>
  );
}

function UnavailableGate() {
  return (
    <GateShell>
      <h1 className="mt-10 text-2xl sm:text-3xl font-semibold">Doctrine momentanément indisponible</h1>
      <p className="mt-4 text-white/60">Réessaie plus tard. Aucun contenu non vérifié ne sera affiché.</p>
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
    const files = await readPublishedDoctrine();
    return { ok: true, render: null, files };
  } catch {
    return { ok: false, render: <UnavailableGate />, files: null };
  }
}
