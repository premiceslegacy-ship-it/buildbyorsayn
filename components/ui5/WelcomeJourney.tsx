"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { DaIcon } from "@/components/da/DaIcon";
import type { McpTier } from "@/lib/mcpAccess";
import { animateAppElement, installAppMotionTokens } from "@/lib/ui/motion";
import { playAppSound } from "@/lib/ui/sound";
import { welcomeTierLabel, type WelcomeChoice } from "./welcomeModel";

export function WelcomeJourney({ displayName, tier, choices }: { displayName: string; tier: McpTier; choices: readonly WelcomeChoice[] }) {
  const [step, setStep] = useState(0);
  const [selectedId, setSelectedId] = useState(choices[0]?.id ?? "");
  const panelRef = useRef<HTMLElement>(null);
  const selected = choices.find((choice) => choice.id === selectedId) ?? choices[0];

  useEffect(() => { installAppMotionTokens(); }, []);
  useEffect(() => {
    if (!panelRef.current) return;
    animateAppElement(panelRef.current, [
      { opacity: 0, transform: "translateY(18px) scale(.985)" },
      { opacity: 1, transform: "none" },
    ], "doux");
  }, [step]);

  function advance() {
    void playAppSound(step === 1 ? "select" : "click");
    setStep((current) => Math.min(2, current + 1));
  }
  function back() {
    void playAppSound("click");
    setStep((current) => Math.max(0, current - 1));
  }
  function choose(id: string) {
    setSelectedId(id);
    void playAppSound("select");
  }

  const title = step === 0 ? `Bienvenue${displayName ? `, ${displayName}` : ""}.` : step === 1 ? "Choisis ton premier pas." : "Ton parcours est prêt.";
  const lede = step === 0
    ? "On vérifie ton accès, puis tu choisis où commencer."
    : step === 1
      ? "Chaque choix ci-dessous mène vers un contenu réellement inclus dans ton accès."
      : "Tu peux commencer maintenant ou retrouver tout le programme.";

  return <main className="welcome-shell">
    <header className="welcome-logo"><Link href="/" aria-label="BUILD, accueil"><Image src="/da/logo-sombre.svg" alt="BUILD" width={104} height={30} priority /></Link></header>
    <div className="welcome-column">
      <ol className="welcome-progress" aria-label={`Étape ${step + 1} sur 3`}>{[0, 1, 2].map((index) => <li key={index} data-state={index <= step ? "done" : "todo"} />)}</ol>
      <h1 className="t-1" tabIndex={-1}>{title}</h1>
      <p className="t-lede">{lede}</p>

      {step === 0 ? <section ref={panelRef} className="welcome-panel" aria-label="Ton compte BUILD">
        <span className="welcome-status"><DaIcon name="check" />Compte reconnu</span>
        <dl className="welcome-facts"><div><dt>Ton accès</dt><dd>{welcomeTierLabel(tier)}</dd></div><div><dt>Étape suivante</dt><dd>Choisir un point de départ</dd></div></dl>
        <div className="welcome-actions"><button className="btn btn--p" type="button" onClick={advance}>Continuer</button><Link className="btn btn--l" href="/dashboard">Aller à Aujourd&apos;hui</Link></div>
      </section> : null}

      {step === 1 ? <section ref={panelRef} className="welcome-panel" aria-label="Choisir ton point de départ">
        <fieldset className="welcome-choices"><legend className="sr">Point de départ</legend>{choices.map((choice) => <button key={choice.id} className="welcome-choice" data-selected={selectedId === choice.id} type="button" aria-pressed={selectedId === choice.id} onClick={() => choose(choice.id)}>
          <Image src={choice.image} alt="" width={320} height={180} /><span><b>{choice.title}</b><small>{choice.meta}</small><em>{choice.description}</em></span><i aria-hidden="true"><DaIcon name="check" /></i>
        </button>)}</fieldset>
        <div className="welcome-actions"><button className="btn btn--p" type="button" onClick={advance}>Continuer</button><button className="btn btn--l" type="button" onClick={back}>Retour</button></div>
      </section> : null}

      {step === 2 && selected ? <section ref={panelRef} className="welcome-panel welcome-final" aria-label="Premier contenu">
        <span className="welcome-ready"><DaIcon name="check" />Ton accès est prêt.</span>
        <article className="welcome-first"><Image src={selected.image} alt="" width={720} height={405} priority /><div><span>{selected.meta}</span><h2>{selected.title}</h2><p>{selected.description}</p></div></article>
        <div className="welcome-actions"><Link className="btn btn--p" href={selected.href} onClick={() => void playAppSound("confirm")}>Commencer <DaIcon name="arrow" /></Link><Link className="btn btn--l" href="/programme">Voir tout le programme</Link><button className="btn btn--l" type="button" onClick={back}>Retour</button></div>
      </section> : null}
    </div>
  </main>;
}
