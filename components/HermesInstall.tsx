"use client";

import { useState } from "react";
import { Check, Copy, ExternalLink } from "lucide-react";
import { AppleIcon, WindowsIcon, LinuxIcon } from "@/components/ui/os-icons";

const COMMANDS = [
  {
    os: "macOS - Linux - WSL2",
    icons: [AppleIcon, LinuxIcon, WindowsIcon],
    cmd: "curl -fsSL https://hermes-agent.nousresearch.com/install.sh | bash",
  },
  {
    os: "Windows PowerShell",
    icons: [WindowsIcon],
    cmd: "iex (irm https://hermes-agent.nousresearch.com/install.ps1)",
  },
] as const;

const DESKTOP_URL = "https://hermes-agent.nousresearch.com/desktop";

function CopyRow({
  os,
  icons,
  cmd,
}: {
  os: string;
  icons: readonly React.ComponentType<{ className?: string }>[];
  cmd: string;
}) {
  const [copied, setCopied] = useState(false);

  return (
    <div>
      <p className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.14em] text-white/35 mb-1.5">
        <span className="flex items-center gap-1 text-white/45">
          {icons.map((Icon, i) => (
            <Icon key={i} className="w-3 h-3" />
          ))}
        </span>
        {os}
      </p>
      <div className="relative group">
        <pre className="bg-black/40 border border-white/10 py-2.5 pl-3 pr-11 text-[12px] font-mono text-[#e8d5b0]/85 overflow-x-auto whitespace-pre">
          {cmd}
        </pre>
        <button
          type="button"
          onClick={() => {
            navigator.clipboard.writeText(cmd);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
          }}
          aria-label={`Copier la commande ${os}`}
          className="absolute top-1/2 -translate-y-1/2 right-2 border border-white/10 bg-white/10 p-1.5 text-white/60 hover:bg-white/20 hover:text-[#e8d5b0] transition-colors cursor-pointer"
        >
          {copied ? (
            <Check className="w-3.5 h-3.5 text-[#e8d5b0]" strokeWidth={2.5} />
          ) : (
            <Copy className="w-3.5 h-3.5" />
          )}
        </button>
      </div>
    </div>
  );
}

export function HermesInstall() {
  return (
    <section
      aria-labelledby="hermes-install"
      className="border border-[#e8d5b0]/12 bg-[#e8d5b0]/[0.03] p-5 sm:p-6"
    >
      <h2 id="hermes-install" className="text-base font-semibold text-[#f0ede8] mb-1">
        Installer Hermes Agent
      </h2>
      <p className="text-xs text-white/45 leading-relaxed mb-5 max-w-2xl">
        Gratuit et open source (licence MIT). Deux façons de l'installer : le terminal si tu veux l'agent en CLI dans tes projets, l'application desktop si tu préfères une interface.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-0">
        <div className="md:pr-6">
          <p className="text-sm font-semibold text-[#f0ede8] mb-3">Terminal</p>
          <div className="flex flex-col gap-3">
            {COMMANDS.map((c) => (
              <CopyRow key={c.os} {...c} />
            ))}
          </div>
        </div>

        <div className="md:pl-6 md:border-l md:border-white/[0.06] flex flex-col">
          <p className="text-sm font-semibold text-[#f0ede8] mb-3">Application desktop</p>
          <p className="flex items-center gap-2 text-xs text-white/45 leading-relaxed mb-4">
            <span className="flex items-center gap-1.5 text-white/45">
              <AppleIcon className="w-3.5 h-3.5" />
              <WindowsIcon className="w-3.5 h-3.5" />
              <LinuxIcon className="w-3.5 h-3.5" />
            </span>
            macOS 12+, Windows 10/11 et Linux. La page de téléchargement détecte ton système et te sert la bonne version.
          </p>
          <a
            href={DESKTOP_URL}
            target="_blank"
            rel="noreferrer noopener"
            className="mt-auto inline-flex items-center justify-center gap-2 bg-[#e8d5b0] px-4 py-2.5 text-[13px] font-semibold text-[#0e0e0f] hover:bg-[#f0dfc0] transition-colors w-fit"
          >
            Télécharger l'app <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </section>
  );
}
