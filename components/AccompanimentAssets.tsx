import Link from "next/link";
import type { ReactNode } from "react";
import type { AccompanimentTheme } from "@/lib/siteWebAccompagnement";

const softButton =
  "inline-flex min-h-10 items-center justify-center rounded-[3px] border border-[#9a7d49] bg-[#e8d5b0] px-4 text-xs font-bold text-[#15120e] shadow-[0_3px_0_#8b6b38,0_8px_18px_rgba(0,0,0,0.18),inset_0_1px_0_rgba(255,255,255,0.65)] transition-[transform,box-shadow,background-color] duration-100 hover:bg-[#f0dfc0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e8d5b0] focus-visible:ring-offset-2 focus-visible:ring-offset-[#121213] active:translate-y-[2px] active:shadow-[0_1px_0_#8b6b38,0_4px_10px_rgba(0,0,0,0.18),inset_0_1px_0_rgba(255,255,255,0.65)]";

type BrandId = "chatgpt" | "codex" | "claudeCode" | "vercel" | "stripe" | "supabase";

type BrandMarkProps = {
  brand: BrandId;
  dark?: boolean;
  compact?: boolean;
};

const BRANDS: Record<BrandId, { label: string; src: string }> = {
  chatgpt: { label: "ChatGPT", src: "/brand-logos/chatgpt.svg" },
  codex: { label: "Codex", src: "/brand-logos/codex.svg" },
  claudeCode: { label: "Claude Code", src: "/brand-logos/claude-code.svg" },
  vercel: { label: "Vercel", src: "/brand-logos/vercel.svg" },
  stripe: { label: "Stripe", src: "/brand-logos/stripe.svg" },
  supabase: { label: "Supabase", src: "/brand-logos/supabase.svg" },
};

function SurfaceLabel({ children, dark = false }: { children: ReactNode; dark?: boolean }) {
  return (
    <span
      className={`text-[10px] font-bold uppercase tracking-[0.2em] ${
        dark ? "text-[#746a5a]" : "text-[#e8d5b0]"
      }`}
    >
      {children}
    </span>
  );
}

function BrandMark({ brand, dark = true, compact = false }: BrandMarkProps) {
  const item = BRANDS[brand];
  return (
    <span className={`inline-flex items-center gap-2 ${compact ? "text-[9px]" : "text-[10px]"} font-semibold ${dark ? "text-[#d2c9bc]" : "text-[#302c27]"}`}>
      <span className={`flex ${compact ? "h-5 w-5 p-1" : "h-6 w-6 p-1.5"} items-center justify-center bg-[#f0ede8]`}>
        <img src={item.src} alt="" className="h-full w-full object-contain" />
      </span>
      <span>{item.label}</span>
    </span>
  );
}

function FlowArrow({ dark = true }: { dark?: boolean }) {
  return (
    <span aria-hidden="true" className={`hidden shrink-0 px-1 text-lg ${dark ? "text-[#c9a86d]" : "text-[#8d744e]"} sm:inline`}>
      →
    </span>
  );
}

function FieldLine({ label, value, dark = true }: { label: string; value: string; dark?: boolean }) {
  return (
    <div className={`flex items-center justify-between gap-4 border-b py-2 last:border-b-0 ${dark ? "border-white/[0.1]" : "border-black/[0.1]"}`}>
      <span className={`text-[10px] uppercase tracking-[0.12em] ${dark ? "text-[#777169]" : "text-[#786e60]"}`}>{label}</span>
      <span className={`text-right text-xs font-medium ${dark ? "text-[#d7d0c4]" : "text-[#302c27]"}`}>{value}</span>
    </div>
  );
}

function BriefCard() {
  return (
    <div className="border-b border-white/[0.1] p-5 sm:p-7 lg:border-b-0 lg:border-r">
      <div className="flex items-center justify-between gap-3">
        <SurfaceLabel>Entrée / projet réel</SurfaceLabel>
        <span className="text-[10px] font-semibold text-[#8ed39f]">compris</span>
      </div>
      <h3 className="mt-6 max-w-sm text-2xl font-medium leading-[1.05] tracking-[-0.045em] text-[#f0ede8]">
        Un brief qui donne à l'IA quelque chose de précis à construire.
      </h3>
      <div className="mt-7 border-l border-[#e8d5b0]/60 pl-4">
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#8f887d]">Contexte gardé</p>
        <p className="mt-2 text-sm leading-6 text-[#aaa59c]">
          Activité, client, offre, message, contraintes et action attendue.
        </p>
      </div>
      <div className="mt-7 border border-white/[0.1] bg-white/[0.025] p-4">
        <FieldLine label="Pour qui" value="un client réel" />
        <FieldLine label="À produire" value="un site clair" />
        <FieldLine label="À obtenir" value="une demande" />
      </div>
      <div className="mt-5 flex items-center justify-between text-xs text-[#777169]">
        <span>La matière de départ</span>
        <span className="text-[#e8d5b0]">3 décisions</span>
      </div>
    </div>
  );
}

function WorkflowNode({
  step,
  brand,
  verb,
  detail,
}: {
  step: string;
  brand: BrandId;
  verb: string;
  detail: string;
}) {
  return (
    <div className="min-h-[148px] border border-white/[0.12] bg-[#171719] p-4 shadow-[0_8px_18px_rgba(0,0,0,0.16)]">
      <div className="flex items-center justify-between gap-3">
        <span className="flex h-6 w-6 items-center justify-center border border-[#e8d5b0]/50 text-[10px] font-bold text-[#e8d5b0]">{step}</span>
        <BrandMark brand={brand} compact />
      </div>
      <p className="mt-5 text-sm font-semibold text-[#f0ede8]">{verb}</p>
      <p className="mt-2 text-xs leading-5 text-[#8f887d]">{detail}</p>
    </div>
  );
}

function MiniSitePreview({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`overflow-hidden border border-black/15 bg-[#f0ede8] text-[#1a1713] shadow-[8px_8px_0_#b8a17a] ${compact ? "p-3" : "p-4"}`}>
      <div className="flex items-center justify-between border-b border-black/10 pb-2 text-[8px] font-bold uppercase tracking-[0.16em] text-[#756d62]">
        <span>site / accueil</span>
        <span className="flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-[#4f9b70]" /> en ligne</span>
      </div>
      <div className="grid gap-4 pt-4 sm:grid-cols-[1fr_0.62fr] sm:items-end">
        <div>
          <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-[#8a7b65]">Une offre claire</p>
          <p className={`${compact ? "text-lg" : "text-xl"} mt-3 max-w-[220px] font-semibold leading-[0.98] tracking-[-0.05em]`}>
            Ton activité mérite mieux qu'une vitrine muette.
          </p>
          <p className="mt-3 max-w-[210px] text-[10px] leading-5 text-[#655f56]">
            Comprendre. Se projeter. Faire le prochain pas.
          </p>
          <span className={`${softButton} mt-5`}>Demander un devis</span>
        </div>
        <div className="hidden items-end justify-end sm:flex">
          <div className="h-28 w-24 border border-[#bdab8d] bg-[#d9c8a8] p-2">
            <div className="h-full border border-black/10 bg-[#eee5d4] p-2">
              <div className="h-1 w-8 bg-[#1a1713]/70" />
              <div className="mt-3 h-1 w-12 bg-[#1a1713]/20" />
              <div className="mt-1 h-1 w-9 bg-[#1a1713]/20" />
              <div className="mt-7 h-7 w-full border border-[#8d744e]/50 bg-[#c9a86d]/40" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DeliveryNode({ brand, title, detail }: { brand: BrandId; title: string; detail: string }) {
  return (
    <div className="flex items-start gap-3 border border-white/[0.1] bg-white/[0.025] p-3">
      <BrandMark brand={brand} compact />
      <div>
        <p className="text-xs font-semibold text-[#f0ede8]">{title}</p>
        <p className="mt-1 text-[11px] leading-5 text-[#777169]">{detail}</p>
      </div>
    </div>
  );
}

export function BuildCreationAsset() {
  return (
    <div className="relative overflow-hidden border border-white/[0.12] bg-[#121213] shadow-[0_22px_50px_rgba(0,0,0,0.32)]">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.1] px-4 py-3 sm:px-6">
        <div className="flex items-center gap-3">
          <span className="h-2 w-2 rounded-full bg-[#e8d5b0] shadow-[0_0_0_3px_rgba(232,213,176,0.1)]" />
          <SurfaceLabel>BUILD / chaîne de production</SurfaceLabel>
        </div>
        <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#777169]">Projet réel / version 04</span>
      </div>

      <div className="grid lg:grid-cols-[0.74fr_1.26fr]">
        <BriefCard />

        <div className="p-5 sm:p-7">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <SurfaceLabel>La méthode en action</SurfaceLabel>
              <h3 className="mt-3 max-w-xl text-2xl font-medium leading-tight tracking-[-0.04em] text-[#f0ede8] sm:text-3xl">
                Les outils produisent. BUILD donne la direction.
              </h3>
            </div>
            <span className="border border-[#e8d5b0]/35 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#e8d5b0]">à relire</span>
          </div>

          <div className="mt-6 grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
            <WorkflowNode step="01" brand="chatgpt" verb="Clarifier" detail="Faire émerger l'offre, le message et l'action." />
            <WorkflowNode step="02" brand="codex" verb="Construire" detail="Assembler une vraie page à partir du contexte." />
            <WorkflowNode step="03" brand="claudeCode" verb="Relire" detail="Reprendre le code, les détails et les incohérences." />
            <WorkflowNode step="04" brand="vercel" verb="Mettre en ligne" detail="Rendre le site accessible et montrable." />
          </div>

          <div className="mt-6 grid gap-4 border-t border-white/[0.1] pt-6 sm:grid-cols-[0.78fr_1.22fr] sm:items-center">
            <div>
              <SurfaceLabel>Sortie visible</SurfaceLabel>
              <p className="mt-3 max-w-xs text-lg font-medium leading-tight tracking-[-0.035em] text-[#d9d0c2]">
                Un site qui porte une offre, pas une page qui remplit un écran.
              </p>
              <div className="mt-5 flex flex-wrap items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.13em] text-[#8f887d]">
                <span className="border-t border-[#e8d5b0]/60 pt-2">Message compris</span>
                <span className="border-t border-white/15 pt-2">Page livrable</span>
                <span className="border-t border-white/15 pt-2">Action mesurable</span>
              </div>
            </div>
            <MiniSitePreview />
          </div>
        </div>
      </div>

      <div className="border-t border-white/[0.1] px-5 py-5 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <SurfaceLabel>Après la mise en ligne</SurfaceLabel>
            <p className="mt-2 max-w-xl text-xs leading-5 text-[#777169]">Les connexions arrivent seulement si elles servent vraiment le résultat.</p>
          </div>
          <span className="text-[10px] uppercase tracking-[0.16em] text-[#777169]">optionnel / utile</span>
        </div>
        <div className="mt-5 grid gap-2 sm:grid-cols-2">
          <DeliveryNode brand="supabase" title="Connecter si nécessaire" detail="Comptes, données ou formulaires quand le projet le demande." />
          <DeliveryNode brand="stripe" title="Faire payer" detail="Relier une offre à un paiement quand il y a quelque chose à vendre." />
        </div>
      </div>
    </div>
  );
}

function OutcomeFlow() {
  return (
    <div className="border border-black/15 bg-[#f1ece3] p-4 text-[#171513] sm:p-5">
      <div className="flex items-center justify-between border-b border-black/10 pb-3">
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#786e60]">Un livrable qui avance</span>
        <span className="text-[10px] text-[#786e60]">projet / réel</span>
      </div>
      <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:items-center">
        <div className="min-w-0 flex-1 border border-black/10 bg-white/60 p-3">
          <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-[#90734b]">Entrée</p>
          <p className="mt-2 text-sm font-semibold">Une offre à rendre claire</p>
          <p className="mt-1 text-[10px] leading-5 text-[#655f56]">client, activité ou nouveau métier</p>
        </div>
        <FlowArrow dark={false} />
        <div className="min-w-0 flex-1 border border-[#9a7d49]/45 bg-[#e4d3b3] p-3 shadow-[4px_4px_0_rgba(141,116,78,0.35)]">
          <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-[#90734b]">Transformation</p>
          <p className="mt-2 text-sm font-semibold">Un site construit et relu</p>
          <p className="mt-1 text-[10px] leading-5 text-[#655f56]">message, page, action</p>
        </div>
        <FlowArrow dark={false} />
        <div className="min-w-0 flex-1 border border-black/10 bg-white/60 p-3">
          <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-[#90734b]">Sortie</p>
          <p className="mt-2 text-sm font-semibold">Une demande ou une vente</p>
          <p className="mt-1 text-[10px] leading-5 text-[#655f56]">quelque chose à montrer et à mesurer</p>
        </div>
      </div>
    </div>
  );
}

export function SiteWebOutcomeAsset() {
  return (
    <div className="overflow-hidden border border-black/15 bg-[#e8e2d6] text-[#171513] shadow-[10px_10px_0_rgba(195,179,149,0.45)]">
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-black/15 px-5 py-5 sm:px-7">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#786e60]">Le livrable</p>
          <h3 className="mt-3 max-w-2xl text-2xl font-semibold leading-tight tracking-[-0.045em] sm:text-4xl">
            Un site que tu peux vendre ou utiliser.
          </h3>
        </div>
        <span className="border border-black/15 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#786e60]">pas une maquette</span>
      </div>

      <div className="grid min-w-0 gap-4 p-4 sm:p-6 lg:grid-cols-[minmax(0,0.78fr)_minmax(0,1.22fr)]">
        <div className="border border-black/10 bg-[#f1ece3] p-4 sm:p-5">
          <div className="flex items-center justify-between border-b border-black/10 pb-3">
            <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#90734b]">Ce que le site porte</span>
            <span className="text-[10px] text-[#786e60]">offre / action</span>
          </div>
          <div className="mt-5">
            <FieldLine dark={false} label="Message" value="compréhensible" />
            <FieldLine dark={false} label="Page" value="livrable" />
            <FieldLine dark={false} label="Suite" value="mesurable" />
          </div>
          <MiniSitePreview compact />
        </div>

        <div className="min-w-0 space-y-4">
          <OutcomeFlow />
          <div className="grid gap-2 sm:grid-cols-3">
            <div className="border border-black/10 bg-[#f1ece3] p-3">
              <BrandMark brand="chatgpt" dark={false} compact />
              <p className="mt-3 text-xs font-semibold">Le message</p>
              <p className="mt-1 text-[10px] leading-5 text-[#655f56]">clarifier ce qui mérite d'être compris</p>
            </div>
            <div className="border border-black/10 bg-[#f1ece3] p-3">
              <BrandMark brand="codex" dark={false} compact />
              <p className="mt-3 text-xs font-semibold">La page</p>
              <p className="mt-1 text-[10px] leading-5 text-[#655f56]">construire ce que l'on peut montrer</p>
            </div>
            <div className="border border-black/10 bg-[#f1ece3] p-3">
              <BrandMark brand="claudeCode" dark={false} compact />
              <p className="mt-3 text-xs font-semibold">La reprise</p>
              <p className="mt-1 text-[10px] leading-5 text-[#655f56]">relire ce qui doit vraiment fonctionner</p>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-black/15 px-5 py-4 sm:px-7">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs leading-5 text-[#655f56]">La méthode rend les outils remplaçables, mais le résultat compréhensible et transmissible.</p>
          <div className="flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-2 border border-black/10 bg-[#f1ece3] px-2.5 py-2 text-[10px] font-semibold text-[#302c27]"><BrandMark brand="vercel" dark={false} compact /></span>
            <span className="inline-flex items-center gap-2 border border-black/10 bg-[#f1ece3] px-2.5 py-2 text-[10px] font-semibold text-[#302c27]"><BrandMark brand="stripe" dark={false} compact /></span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function WorkCycleAsset() {
  return (
    <div className="border border-white/[0.12] bg-[#121213] shadow-[0_18px_35px_rgba(0,0,0,0.24)]">
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-white/[0.1] px-5 py-5 sm:px-7">
        <div>
          <SurfaceLabel>Le cycle réel</SurfaceLabel>
          <h3 className="mt-3 text-2xl font-medium tracking-[-0.04em] text-[#f0ede8] sm:text-3xl">
            L'IA produit. Tu décides ce qui mérite de rester.
          </h3>
        </div>
        <p className="max-w-xs text-xs leading-5 text-[#777169]">Chaque passage réduit l'écart entre une page plausible et un site utile.</p>
      </div>

      <div className="grid gap-px bg-white/[0.1] sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-[#121213] p-5 sm:p-6">
          <div className="flex items-center justify-between gap-3"><span className="text-[10px] font-bold text-[#e8d5b0]">01</span><BrandMark brand="chatgpt" compact /></div>
          <p className="mt-7 text-sm font-bold uppercase tracking-[0.16em] text-[#e8d5b0]">Cadrer</p>
          <p className="mt-3 text-sm leading-6 text-[#aaa59c]">Le projet, l'offre et le message deviennent exploitables.</p>
        </div>
        <div className="bg-[#121213] p-5 sm:p-6">
          <div className="flex items-center justify-between gap-3"><span className="text-[10px] font-bold text-[#e8d5b0]">02</span><BrandMark brand="codex" compact /></div>
          <p className="mt-7 text-sm font-bold uppercase tracking-[0.16em] text-[#e8d5b0]">Construire</p>
          <p className="mt-3 text-sm leading-6 text-[#aaa59c]">Une vraie partie du site est produite, pas seulement commentée.</p>
        </div>
        <div className="bg-[#121213] p-5 sm:p-6">
          <div className="flex items-center justify-between gap-3"><span className="text-[10px] font-bold text-[#e8d5b0]">03</span><BrandMark brand="claudeCode" compact /></div>
          <p className="mt-7 text-sm font-bold uppercase tracking-[0.16em] text-[#e8d5b0]">Relire</p>
          <p className="mt-3 text-sm leading-6 text-[#aaa59c]">Le code, le mobile, le message et les détails sont repris.</p>
        </div>
        <div className="bg-[#121213] p-5 sm:p-6">
          <div className="flex items-center justify-between gap-3"><span className="text-[10px] font-bold text-[#e8d5b0]">04</span><BrandMark brand="vercel" compact /></div>
          <p className="mt-7 text-sm font-bold uppercase tracking-[0.16em] text-[#e8d5b0]">Publier</p>
          <p className="mt-3 text-sm leading-6 text-[#aaa59c]">Le résultat sort de l'atelier et peut être montré, utilisé ou vendu.</p>
        </div>
      </div>

      <div className="grid gap-2 border-t border-white/[0.1] p-5 sm:grid-cols-2 sm:p-6">
        <DeliveryNode brand="supabase" title="Connecter quand c'est utile" detail="Données, comptes et formulaires ne sont pas ajoutés pour faire joli." />
        <DeliveryNode brand="stripe" title="Monétiser quand c'est nécessaire" detail="Le paiement intervient quand l'offre et le parcours sont prêts." />
      </div>
    </div>
  );
}

type RouteKind = "sell" | "activity" | "agency" | "experience" | "reconversion";

type RouteSpec = {
  from: string;
  middle: string;
  to: string;
  accent: string;
};

const ROUTE_SPECS: Record<RouteKind, RouteSpec> = {
  sell: { from: "Brief client", middle: "Site livrable", to: "Prestation", accent: "Codex" },
  activity: { from: "Offre", middle: "Page claire", to: "Demande", accent: "ChatGPT" },
  agency: { from: "Règles BUILD", middle: "Équipe", to: "Livraisons", accent: "Claude Code" },
  experience: { from: "Workflow", middle: "Relecture", to: "Version fiable", accent: "Vercel" },
  reconversion: { from: "Projet réel", middle: "Portfolio", to: "Nouveau métier", accent: "ChatGPT" },
};

function RouteSketch({ kind }: { kind: RouteKind }) {
  const spec = ROUTE_SPECS[kind];
  const brand = Object.entries(BRANDS).find(([, value]) => value.label === spec.accent)?.[0] as BrandId;
  return (
    <div className="min-w-0 w-full border border-white/[0.1] bg-[#171719] p-3" aria-label={`${spec.from} vers ${spec.middle} vers ${spec.to}`}>
      <div className="flex items-center gap-1.5">
        <div className="min-w-0 flex-1 border border-white/[0.12] px-2 py-2"><span className="block truncate text-[9px] font-semibold uppercase tracking-[0.1em] text-[#aaa59c]">{spec.from}</span></div>
        <span aria-hidden="true" className="text-[#c9a86d]">→</span>
        <div className="min-w-0 flex-1 border border-[#e8d5b0]/35 bg-[#e8d5b0]/10 px-2 py-2"><span className="block truncate text-[9px] font-semibold uppercase tracking-[0.1em] text-[#e8d5b0]">{spec.middle}</span></div>
        <span aria-hidden="true" className="text-[#c9a86d]">→</span>
        <div className="min-w-0 flex-1 border border-white/[0.12] px-2 py-2"><span className="block truncate text-[9px] font-semibold uppercase tracking-[0.1em] text-[#aaa59c]">{spec.to}</span></div>
      </div>
      <div className="mt-3 flex items-center justify-between border-t border-white/[0.1] pt-3">
        <span className="text-[9px] uppercase tracking-[0.14em] text-[#777169]">outil mobilisé</span>
        <BrandMark brand={brand} compact />
      </div>
    </div>
  );
}

const AUDIENCE_ROUTES: Array<{ label: string; title: string; text: string; outcome: string; kind: RouteKind }> = [
  {
    label: "Je veux vendre des sites",
    title: "Passer d'un brief client à une prestation claire",
    text: "Tu construis, tu relis et tu sais montrer ce que le client achète.",
    outcome: "Un site livrable et une offre à présenter",
    kind: "sell",
  },
  {
    label: "Je lance mon activité",
    title: "Faire du site un support pour ta propre offre",
    text: "Le site explique ce que tu fais et donne une prochaine étape aux bonnes personnes.",
    outcome: "Une présence qui peut faire avancer l'activité",
    kind: "activity",
  },
  {
    label: "Je développe une agence",
    title: "Transformer ta façon de faire en système d'équipe",
    text: "Les règles, les rôles et les relectures sortent de ta tête pour devenir transmissibles.",
    outcome: "Une production plus régulière",
    kind: "agency",
  },
  {
    label: "J'ai déjà de l'expérience",
    title: "Gagner en vitesse sans livrer du plausible",
    text: "Tu gardes ton jugement et tu accélères les parties répétitives qui ne méritent pas de repartir de zéro.",
    outcome: "Un workflow fiable et réutilisable",
    kind: "experience",
  },
  {
    label: "Je me reconvertis",
    title: "Apprendre par un projet que tu peux montrer",
    text: "Tu ne collectionnes pas des notions. Tu construis une base concrète pour changer de métier.",
    outcome: "Un premier actif professionnel",
    kind: "reconversion",
  },
];

export function AudienceRoutesAsset() {
  return (
    <div className="min-w-0 overflow-hidden border border-white/[0.12] bg-[#121213] shadow-[0_22px_50px_rgba(0,0,0,0.32)]">
      <div className="border-b border-white/[0.1] px-5 py-6 sm:px-7">
        <div className="flex flex-wrap items-end justify-between gap-5">
          <div>
            <SurfaceLabel>Les capacités selon le départ</SurfaceLabel>
            <h3 className="mt-3 max-w-2xl text-2xl font-medium leading-tight tracking-[-0.04em] text-[#f0ede8] sm:text-4xl">
              Même savoir-faire. Une sortie qui change selon ton projet.
            </h3>
          </div>
          <p className="max-w-sm text-xs leading-5 text-[#777169]">Chaque scène montre ce que l'accompagnement rend possible, pas seulement à qui il s'adresse.</p>
        </div>
      </div>
      <div className="grid min-w-0 gap-px bg-white/[0.1] md:grid-cols-6">
        {AUDIENCE_ROUTES.map((route, index) => (
          <div key={route.label} className={`min-w-0 bg-[#121213] p-5 sm:p-7 ${index < 3 ? "md:col-span-2" : "md:col-span-3"}`}>
            <div className="flex items-center gap-3">
              <span className="h-2 w-2 rounded-full border border-[#e8d5b0] bg-[#e8d5b0]/20" />
              <SurfaceLabel>{route.label}</SurfaceLabel>
            </div>
            <h4 className="mt-6 max-w-full break-words text-xl font-medium leading-tight tracking-[-0.035em] text-[#f0ede8]">{route.title}</h4>
            <p className="mt-3 max-w-xl text-sm leading-6 text-[#aaa59c]">{route.text}</p>
            <div className="mt-6">
              <RouteSketch kind={route.kind} />
            </div>
            <p className="mt-5 border-t border-white/[0.1] pt-4 text-xs font-semibold uppercase tracking-[0.13em] text-[#e8d5b0]">
              Sortie : <span className="text-[#c2bbae]">{route.outcome}</span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ThemeAtlas({ themes, user }: { themes: AccompanimentTheme[]; user: boolean }) {
  return (
    <div className="relative overflow-hidden border border-black/15 bg-[#e8e2d6] text-[#171513] shadow-[10px_10px_0_rgba(195,179,149,0.45)]">
      <div className="flex flex-wrap items-end justify-between gap-5 border-b border-black/15 px-5 py-6 sm:px-7">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#786e60]">Le fil du projet</p>
          <h3 className="mt-3 max-w-xl text-2xl font-semibold leading-tight tracking-[-0.045em] sm:text-4xl">
            De l'idée à un site qui travaille.
          </h3>
        </div>
        <p className="max-w-xs text-xs leading-5 text-[#655f56]">Les thèmes se suivent selon le projet, pas selon un calendrier imposé.</p>
      </div>

      <div className="grid gap-px bg-black/15 sm:grid-cols-2 lg:grid-cols-3">
        {themes.map((theme, index) => {
          const href = user
            ? `/accompagnement/espace#${theme.id}`
            : `/login?next=${encodeURIComponent("/accompagnement/espace")}&phase=${encodeURIComponent(theme.id)}`;
          return (
            <Link
              key={theme.id}
              href={href}
              className="group relative min-h-[205px] bg-[#e8e2d6] p-5 transition-colors hover:bg-[#f1ece3] focus-visible:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8b6b38] focus-visible:ring-inset sm:p-6"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="h-2.5 w-2.5 rounded-full border border-[#9a7d49] bg-[#c9a86d] shadow-[0_0_0_3px_rgba(154,125,73,0.12)]" />
                <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#786e60]">{index === 0 ? "Départ" : index === themes.length - 1 ? "Suite" : "À travailler"}</span>
              </div>
              <h4 className="mt-8 max-w-[250px] text-xl font-semibold leading-tight tracking-[-0.035em]">{theme.title}</h4>
              <p className="mt-3 max-w-[280px] text-sm leading-6 text-[#655f56]">{theme.promise}</p>
              <span className="absolute bottom-5 left-5 text-xs font-bold underline decoration-black/25 underline-offset-4 transition-colors group-hover:decoration-black sm:bottom-6 sm:left-6">
                Ouvrir le thème
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
