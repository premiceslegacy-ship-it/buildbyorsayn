"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const REFERENCE_WIDTH = 1280;
const REFERENCE_HEIGHT = 720;
const CARD_WIDTH = 860;
const CARD_LEFT = (REFERENCE_WIDTH - CARD_WIDTH) / 2;
const CARD_IDLE_TOP = 300;
const CARD_CONVERSATION_TOP = 500;

const PROMPT =
  "Je veux lancer un SaaS pour les artisans du bâtiment. J'ai une idée, mais je ne sais pas quoi construire en premier.";
const ANSWER =
  "Commence par les demandes de devis qui se perdent entre WhatsApp, email et téléphone. Vérifie cette scène avec trois artisans, puis montre un flux simple pour suivre une demande, une relance et le résultat.";
const PLACEHOLDER = "Essaie : rédiger un email · résumer un document · planifier ta semaine";

type DemoStage = "idle" | "typing" | "sending" | "searching" | "answering" | "complete";
type IconProps = { size: number | string; color: string };

function ChevronDown({ size, color }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M6 9l6 6 6-6" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PlusIcon({ size, color }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 5v14M5 12h14" stroke={color} strokeWidth={2} strokeLinecap="round" />
    </svg>
  );
}

function MicIcon({ size, color }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x={9} y={3} width={6} height={11} rx={3} stroke={color} strokeWidth={1.8} />
      <path d="M5.5 11a6.5 6.5 0 0013 0M12 17.5V21M9 21h6" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function WaveformIcon({ size, color }: IconProps) {
  const bars = [
    { x: 4, h: 8 },
    { x: 9, h: 16 },
    { x: 14, h: 12 },
    { x: 19, h: 20 },
  ];

  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      {bars.map((bar) => (
        <rect key={bar.x} x={bar.x - 1} y={(24 - bar.h) / 2} width={2.4} height={bar.h} rx={1.2} fill={color} />
      ))}
    </svg>
  );
}

function SendIcon({ size }: { size: number | string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 19V5M12 5l-6 6M12 5l6 6" stroke="#FFFFFF" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SearchIcon({ size, color }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="11" cy="11" r="6.5" stroke={color} strokeWidth={1.8} />
      <path d="M16 16l4 4" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
    </svg>
  );
}

function IconButton({ size, border, children }: { size: number; border: string; children: ReactNode }) {
  return (
    <span
      aria-hidden="true"
      style={{
        width: size,
        height: size,
        borderRadius: "100%",
        border: `1px solid ${border}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      {children}
    </span>
  );
}

function ClaudeComposer({
  conversation,
  text,
  showSend,
  sendPressed,
  reducedMotion,
}: {
  conversation: boolean;
  text: string;
  showSend: boolean;
  sendPressed: boolean;
  reducedMotion: boolean;
}) {
  const theme = {
    cardBg: "#FFFFFF",
    cardBorder: "#E8E5DD",
    fg: "#1F1E1D",
    fgMuted: "#73726C",
    placeholder: "#A3A097",
    iconBtnBorder: "#E0DDD4",
  };

  return (
    <div
      data-mcp-composer="true"
      className="absolute"
      style={{
        left: CARD_LEFT,
        top: conversation ? CARD_CONVERSATION_TOP : CARD_IDLE_TOP,
        width: CARD_WIDTH,
        background: theme.cardBg,
        border: `1px solid ${theme.cardBorder}`,
        borderRadius: 24,
        boxShadow: "0 8px 30px -12px rgba(31,30,29,0.12)",
        transition: reducedMotion ? "none" : "top 420ms cubic-bezier(.2,.8,.2,1)",
      }}
    >
      <div
        data-mcp-composer-text="true"
        style={{
          padding: "26px 28px",
          minHeight: 58,
          fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
          fontSize: 21,
          lineHeight: 1.3,
          display: "flex",
          alignItems: "center",
        }}
      >
        {text ? (
          <span style={{ color: theme.fg }}>
            {text}
            <span
              className="motion-safe:animate-pulse"
              style={{ display: "inline-block", width: 2, height: 24, marginLeft: 1, background: theme.fg, verticalAlign: "text-bottom" }}
              aria-hidden="true"
            />
          </span>
        ) : (
          <span style={{ color: theme.placeholder, display: "inline-flex", alignItems: "center" }}>
            <span
              className="motion-safe:animate-pulse"
              style={{ display: "inline-block", width: 2, height: 24, marginRight: 2, background: theme.fg, verticalAlign: "text-bottom" }}
              aria-hidden="true"
            />
            {PLACEHOLDER}
          </span>
        )}
      </div>

      <div style={{ padding: "14px 18px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <IconButton size={36} border={theme.iconBtnBorder}>
          <PlusIcon size={20} color={theme.fg} />
        </IconButton>

        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
            <span style={{ fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", fontSize: 18, fontWeight: 500, color: theme.fg }}>
              Opus 5.5
            </span>
            <span style={{ fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", fontSize: 18, fontWeight: 400, color: theme.fgMuted }}>
              Max
            </span>
            <ChevronDown size={16} color={theme.fgMuted} />
          </div>

          <IconButton size={36} border={theme.iconBtnBorder}>
            <MicIcon size={20} color={theme.fg} />
          </IconButton>

          <span style={{ position: "relative", width: 40, height: 40, display: "block", flexShrink: 0 }}>
            <span
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "100%",
                border: `1px solid ${theme.iconBtnBorder}`,
                opacity: showSend ? 0 : 1,
                transform: showSend ? "scale(.9)" : "scale(1)",
                transition: reducedMotion ? "none" : "opacity 180ms ease, transform 180ms ease",
              }}
            >
              <WaveformIcon size={22} color={theme.fg} />
            </span>
            <span
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 10,
                background: "#D97757",
                opacity: showSend ? 1 : 0,
                transform: sendPressed ? "scale(.88)" : showSend ? "scale(1)" : "scale(.8)",
                transition: reducedMotion ? "none" : "opacity 180ms ease, transform 180ms ease",
              }}
            >
              <SendIcon size={22} />
              {sendPressed && (
                <span
                  aria-hidden="true"
                  style={{ position: "absolute", inset: -8, border: "2px solid #D97757", borderRadius: "100%", opacity: 0.55, animation: reducedMotion ? "none" : "mcp-send-pulse 360ms ease-out forwards" }}
                />
              )}
            </span>
          </span>
        </div>
      </div>
    </div>
  );
}

function HermesAvatar() {
  return (
    <span
      data-mcp-assistant-avatar="hermes-agent"
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: 36,
        height: 36,
        padding: 4,
        borderRadius: 12,
        background: "#1F1E1D",
        border: "1px solid #E8E5DD",
        flexShrink: 0,
        overflow: "hidden",
      }}
    >
      <Image
        src="/brand-logos/hermes-agent-mark.png"
        alt="Hermes Agent"
        width={28}
        height={28}
        unoptimized
        loading="eager"
        style={{ width: "100%", height: "100%", objectFit: "contain" }}
        draggable={false}
      />
    </span>
  );
}

function ClaudeConversation({ stage, answer }: { stage: DemoStage; answer: string }) {
  if (stage === "idle" || stage === "typing" || stage === "sending") return null;

  return (
    <div
      className="absolute"
      style={{ left: CARD_LEFT, top: 66, width: CARD_WIDTH, color: "#1F1E1D", fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
        <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 36, height: 36, borderRadius: 12, background: "#1F1E1D", color: "#FFFFFF", fontSize: 12, fontWeight: 700, flexShrink: 0 }}>
          Toi
        </span>
        <p style={{ margin: 0, maxWidth: 760, fontSize: 21, lineHeight: 1.4 }}>{PROMPT}</p>
      </div>

      <div style={{ display: "flex", alignItems: "flex-start", gap: 16, marginTop: 28 }}>
        <HermesAvatar />
        <div style={{ minWidth: 0, maxWidth: 760 }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 9 }}>
            <p style={{ margin: 0, fontSize: 21, fontWeight: 600 }}>Claude</p>
            <span style={{ color: "#73726C", fontSize: 16 }}>avec le contexte BUILD</span>
          </div>

          {stage === "searching" ? (
            <div role="status" aria-live="polite" style={{ marginTop: 18, display: "inline-flex", alignItems: "center", gap: 10, padding: "14px 16px", border: "1px solid #E8E5DD", borderRadius: 14, background: "rgba(255,255,255,.58)", color: "#73726C", fontSize: 17 }}>
              <SearchIcon size={20} color="#D97757" />
              <span>Recherche dans le MCP BUILD</span>
            </div>
          ) : (
            <div aria-live={stage === "answering" ? "polite" : undefined} style={{ marginTop: 18, color: "#1F1E1D", fontSize: 20, lineHeight: 1.48, maxWidth: 760 }}>
              {answer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function McpConnectorShowcase() {
  const stageRef = useRef<HTMLDivElement>(null);
  const [stageScale, setStageScale] = useState(1);
  const [stage, setStage] = useState<DemoStage>("idle");
  const [visiblePrompt, setVisiblePrompt] = useState("");
  const [visibleAnswer, setVisibleAnswer] = useState("");
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const preload = document.createElement("img");
    preload.src = "/brand-logos/hermes-agent-mark.png";
  }, []);

  useEffect(() => {
    const element = stageRef.current;
    if (!element) return;

    const updateScale = () => {
      setStageScale(Math.min(element.clientWidth / REFERENCE_WIDTH, element.clientHeight / REFERENCE_HEIGHT));
    };

    updateScale();
    const observer = new ResizeObserver(updateScale);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(media.matches);
    update();
    media.addEventListener?.("change", update);
    return () => media.removeEventListener?.("change", update);
  }, []);

  useEffect(() => {
    let active = true;
    const timeouts: number[] = [];
    const intervals: number[] = [];

    const clearAll = () => {
      timeouts.forEach((timer) => window.clearTimeout(timer));
      intervals.forEach((timer) => window.clearInterval(timer));
    };

    const reset = () => {
      setStage("idle");
      setVisiblePrompt("");
      setVisibleAnswer("");
    };

    if (reducedMotion) {
      setStage("complete");
      setVisiblePrompt(PROMPT);
      setVisibleAnswer(ANSWER);
      return () => {
        active = false;
        clearAll();
      };
    }

    function startAnswer() {
      if (!active) return;
      setStage("answering");
      let index = 0;
      const timer = window.setInterval(() => {
        if (!active) return;
        index += 1;
        setVisibleAnswer(ANSWER.slice(0, index));
        if (index >= ANSWER.length) {
          window.clearInterval(timer);
          setStage("complete");
          timeouts.push(window.setTimeout(() => {
            if (!active) return;
            reset();
            timeouts.push(window.setTimeout(startTyping, 850));
          }, 5600));
        }
      }, 17);
      intervals.push(timer);
    }

    function startSearch() {
      if (!active) return;
      setStage("searching");
      timeouts.push(window.setTimeout(startAnswer, 1750));
    }

    function startSending() {
      if (!active) return;
      setStage("sending");
      timeouts.push(window.setTimeout(startSearch, 420));
    }

    function startTyping() {
      if (!active) return;
      setStage("typing");
      let index = 0;
      const timer = window.setInterval(() => {
        if (!active) return;
        index += 1;
        setVisiblePrompt(PROMPT.slice(0, index));
        if (index >= PROMPT.length) {
          window.clearInterval(timer);
          timeouts.push(window.setTimeout(startSending, 520));
        }
      }, 45);
      intervals.push(timer);
    }

    reset();
    timeouts.push(window.setTimeout(startTyping, 850));

    return () => {
      active = false;
      clearAll();
    };
  }, [reducedMotion]);

  const conversation = stage === "searching" || stage === "answering" || stage === "complete";
  const typing = stage === "typing" || stage === "sending";

  return (
    <section aria-labelledby="mcp-connector-title" className="mt-16 py-10 sm:py-14">
      <style>{`@keyframes mcp-send-pulse { from { opacity: .55; transform: scale(.92); } to { opacity: 0; transform: scale(1.35); } }`}</style>
      <div className="mb-10 h-px bg-white/[0.08] sm:mb-14" aria-hidden="true" />

      <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-[minmax(0,1.18fr)_minmax(300px,0.82fr)] lg:gap-14">
        <div className="w-full max-w-[680px] lg:justify-self-start">
          <div
            ref={stageRef}
            data-mcp-stage={stage}
            role="region"
            aria-labelledby="mcp-connector-title"
            aria-describedby="mcp-demo-note"
            className="relative aspect-video w-full overflow-hidden"
            style={{ background: "#F5F4EF" }}
          >
            <p className="sr-only" aria-live="polite">
              {stage === "sending" ? "Envoi de la question." : stage === "searching" ? "Recherche du contexte BUILD en cours." : stage === "answering" ? "Réponse en cours." : stage === "complete" ? "Réponse terminée." : ""}
            </p>
            <div
              className="absolute left-1/2 top-1/2"
              style={{ width: REFERENCE_WIDTH, height: REFERENCE_HEIGHT, transform: `translate(-50%, -50%) scale(${stageScale})`, transformOrigin: "center center" }}
            >
              <ClaudeConversation stage={stage} answer={visibleAnswer} />
              <ClaudeComposer conversation={conversation} text={typing ? visiblePrompt : ""} showSend={typing && visiblePrompt.length > 0} sendPressed={stage === "sending"} reducedMotion={reducedMotion} />
            </div>
          </div>
        </div>

        <div className="max-w-xl lg:justify-self-end">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.16em] text-[#c9b48a]">Inclus dans les deux offres</p>
          <h3 id="mcp-connector-title" className="text-3xl font-semibold leading-[1.08] tracking-tight text-[#f0ede8] sm:text-4xl">
            Tu n&apos;apprends plus seul.
          </h3>
          <p className="mt-4 text-[15px] leading-6 text-white/60">
            Quand tu bloques, ton assistant retrouve le contenu BUILD utile, te l&apos;explique avec ton projet et t&apos;aide à choisir la prochaine étape.
          </p>
          <p className="mt-3 text-xs leading-5 text-white/38">Le contenu visible dépend de ton offre.</p>
          <Link
            href="/mcp/start"
            className="group mt-7 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-md bg-[#e8d5b0] px-5 py-3 text-sm font-bold text-[#0a0908] shadow-[0_3px_0_rgba(100,76,36,0.9),inset_0_1px_0_rgba(255,255,255,0.5)] transition-[transform,box-shadow,background-color] duration-[80ms] hover:bg-[#f0dfc0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f0dfc0] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0e0e0f] active:translate-y-[2px] active:shadow-[0_1px_0_rgba(100,76,36,0.9)] sm:w-auto"
          >
            Connecter mon assistant
            <ArrowRight className="h-4 w-4 transition-transform duration-150 group-hover:translate-x-0.5" aria-hidden="true" />
          </Link>
          <p id="mcp-demo-note" className="mt-3 text-[11px] text-white/35">Aperçu animé, pas une réponse en direct.</p>
        </div>
      </div>

      <div className="mt-10 h-px bg-white/[0.08] sm:mt-14" aria-hidden="true" />
    </section>
  );
}
