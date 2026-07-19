import { Check, Bell } from "lucide-react";

/* Fenêtre type macOS - base commune des mockups */
function WindowFrame({
  title,
  children,
  className = "",
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-b from-white/[0.045] to-white/[0.015] backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.07)] ${className}`}
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/12 to-transparent" />
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-white/[0.06] bg-white/[0.02]">
        <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]/80" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]/80" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]/80" />
        <span className="ml-2 text-[11px] text-white/40 font-medium">{title}</span>
      </div>
      {children}
    </div>
  );
}

/* Le problème : consommer l'IA en mode question-réponse */
export function ChatConsumerMock() {
  return (
    <WindowFrame title="ChatGPT">
      <div className="p-4 flex flex-col gap-3">
        <div className="self-end max-w-[85%] bg-[#e8d5b0]/12 border border-[#e8d5b0]/15 rounded-2xl rounded-br-md px-3.5 py-2.5">
          <p className="text-[13px] text-[#f0ede8]/85 leading-snug">
            Écris-moi un post LinkedIn sur l&apos;IA
          </p>
        </div>
        <div className="self-start max-w-[85%] bg-white/[0.04] border border-white/[0.06] rounded-2xl rounded-bl-md px-3.5 py-2.5">
          <p className="text-[13px] text-white/55 leading-snug">
            Bien sûr ! Voici un post engageant : &laquo; L&apos;IA transforme notre façon de travailler... &raquo;
          </p>
        </div>
        <div className="self-end max-w-[85%] bg-[#e8d5b0]/12 border border-[#e8d5b0]/15 rounded-2xl rounded-br-md px-3.5 py-2.5">
          <p className="text-[13px] text-[#f0ede8]/85 leading-snug">Refais-le, plus court</p>
        </div>
        <p className="text-[11px] text-white/25 text-center pt-1">
          Copier. Coller. Recommencer demain. Rien ne reste.
        </p>
      </div>
    </WindowFrame>
  );
}

/* La situation désirée : diriger des systèmes qui construisent */
export function ClaudeCodeMock() {
  return (
    <WindowFrame title="Claude Code - terminal">
      <div className="p-4 font-mono text-[12.5px] leading-relaxed">
        <p className="text-white/60">
          <span className="text-[#e8d5b0]">&gt;</span> construis la page de vente avec mon skill oracle-site-web
        </p>
        <p className="text-white/40 mt-2">
          <span className="text-[#c9b48a]">⏺</span> Skill chargé : ton positionnement, ta structure, tes règles
        </p>
        <p className="text-white/40">
          <span className="text-[#c9b48a]">⏺</span> Page générée : hero, offre, pricing, FAQ
        </p>
        <p className="text-[#7dc98a] mt-2 flex items-center gap-1.5">
          <Check className="w-3.5 h-3.5" strokeWidth={2.5} /> En ligne sur ton domaine en 42 secondes
        </p>
      </div>
    </WindowFrame>
  );
}

/* Codex : la compétence tourne sur n'importe quel modèle */
export function CodexMock() {
  return (
    <WindowFrame title="Codex - terminal">
      <div className="p-4 font-mono text-[12.5px] leading-relaxed">
        <p className="text-white/60">
          <span className="text-[#e8d5b0]">$</span> codex &quot;même skill, autre modèle&quot;
        </p>
        <p className="text-[#7dc98a] mt-2 flex items-center gap-1.5">
          <Check className="w-3.5 h-3.5" strokeWidth={2.5} /> Ton système tourne. La pioche change, toi tu restes.
        </p>
      </div>
    </WindowFrame>
  );
}

/* Notification de paiement Stripe */
export function StripeNotifMock({ amount, label }: { amount: string; label: string }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-b from-white/[0.05] to-white/[0.02] backdrop-blur-xl px-4 py-3.5 flex items-center gap-3.5 shadow-[0_12px_40px_rgba(0,0,0,0.45),inset_0_1px_0_rgba(255,255,255,0.08)]">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/12 to-transparent" />
      <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-[#635bff]/90 flex items-center justify-center shadow-[0_2px_10px_rgba(99,91,255,0.35),inset_0_1px_0_rgba(255,255,255,0.25)]">
        <span className="text-white font-bold text-lg leading-none">S</span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-semibold text-[#f0ede8]">Stripe</p>
        <p className="text-[12px] text-white/45 truncate">{label}</p>
      </div>
      <p className="text-[15px] font-bold text-[#7dc98a] whitespace-nowrap">{amount}</p>
    </div>
  );
}

/* Icône notification générique (livraison client, etc.) */
export function NotifMock({ title, label }: { title: string; label: string }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-b from-white/[0.05] to-white/[0.02] backdrop-blur-xl px-4 py-3.5 flex items-center gap-3.5 shadow-[0_12px_40px_rgba(0,0,0,0.45),inset_0_1px_0_rgba(255,255,255,0.08)]">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/12 to-transparent" />
      <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-[#e8d5b0]/15 border border-[#e8d5b0]/25 flex items-center justify-center">
        <Bell className="w-4 h-4 text-[#e8d5b0]" strokeWidth={1.5} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-semibold text-[#f0ede8]">{title}</p>
        <p className="text-[12px] text-white/45 truncate">{label}</p>
      </div>
    </div>
  );
}
