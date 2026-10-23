"use client";

import { Copy } from "lucide-react";
import { BusyButton } from "@/components/ui/BusyButton";

export function CopyBuildSyncCommand({ label, command }: { label: string; command: string }) {
  return (
    <BusyButton
      type="button"
      aria-label={`Copier ${label}`}
      title="Copier"
      action={async () => navigator.clipboard.writeText(command)}
      pendingText="Copie en cours"
      successText={<span className="sr">Copiée</span>}
      errorText={<span className="sr">Réessayer</span>}
      successToast="Commande copiée."
      errorToast="La copie a échoué. Réessaie."
      className="flex size-11 shrink-0 items-center justify-center rounded-full border border-border bg-text/10 text-text-secondary transition hover:border-border-hover hover:text-accent"
    >
      <Copy data-icon="inline-start" size={16} />
    </BusyButton>
  );
}
