"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";
import { DaIcon } from "@/components/da/DaIcon";
import { installAppMotionTokens, motionAllowed } from "@/lib/ui/motion";
import { playAppSound } from "@/lib/ui/sound";
import type { PurchaseState } from "./purchaseModel";

export function PurchaseConfirmation({ state }: { state: PurchaseState }) {
  const router = useRouter();
  const timers = useRef<number[]>([]);
  const [revealed, setRevealed] = useState(0);
  const [started, setStarted] = useState(false);
  const [refreshing, startRefresh] = useTransition();

  useEffect(() => {
    installAppMotionTokens();
    const activeTimers = timers.current;
    return () => activeTimers.forEach((timer) => window.clearTimeout(timer));
  }, []);

  if (state.kind === "error") return <main className="purchase-state"><div className="purchase-state__in"><span className="purchase-badge purchase-badge--error"><DaIcon name="x" /></span><h1 className="t-1">Ton accès ne peut pas être vérifié.</h1><p className="t-lede">Aucun accès n&apos;est annoncé tant que la vérification du compte échoue.</p><button className="btn btn--p" type="button" disabled={refreshing} onClick={() => startRefresh(() => router.refresh())}>{refreshing ? "Vérification…" : "Réessayer"}</button></div></main>;

  if (state.kind === "pending") return <main className="purchase-state"><div className="purchase-state__in"><span className="purchase-badge purchase-badge--pending" aria-hidden="true"><i /><i /><i /></span><h1 className="t-1">Paiement en cours de confirmation.</h1><p className="t-lede">{state.authenticated ? "Stripe a peut-être déjà reçu ton paiement. BUILD attend encore la confirmation serveur avant d’ouvrir ton accès." : "Connecte-toi avec le compte utilisé pour l’achat afin que BUILD puisse vérifier ton accès."}</p>{state.authenticated ? <button className="btn btn--p" type="button" disabled={refreshing} onClick={() => { void playAppSound("click"); startRefresh(() => router.refresh()); }}>{refreshing ? "Vérification…" : "Vérifier à nouveau"}</button> : <Link className="btn btn--p" href="/login?next=%2Ffin">Se connecter</Link>}<small>Tu ne seras jamais renvoyé vers un nouveau paiement depuis cet écran.</small></div></main>;

  function reveal() {
    if (started || state.kind !== "confirmed") return;
    setStarted(true);
    void playAppSound("confirm");
    if (!motionAllowed()) {
      setRevealed(state.entries.length);
      return;
    }
    state.entries.forEach((_, index) => {
      const timer = window.setTimeout(() => {
        setRevealed(index + 1);
        void playAppSound("select");
      }, 260 + index * 115);
      timers.current.push(timer);
    });
  }

  const done = started && revealed === state.entries.length;
  return <main className="purchase-state"><div className="purchase-confirmed">
    <span className={`purchase-badge${started ? " is-confirmed" : ""}`} aria-hidden="true"><DaIcon name="check" /></span>
    <h1 className="t-aff">C&apos;est débloqué.</h1>
    <p className="t-lede">Paiement confirmé. Ton accès {state.label} est actif.</p>
    <ul className="purchase-list" aria-label="Ce qui est ouvert">{state.entries.map((entry, index) => <li key={entry.id} data-open={index < revealed}>
      <Image src={entry.image} alt="" width={192} height={108} /><span><b>{entry.title}</b><small>{entry.meta}</small></span><i aria-hidden="true"><DaIcon name={index < revealed ? "check" : "lock"} /></i>
    </li>)}</ul>
    <div className="purchase-action">{done ? <Link className="btn btn--p" href={state.destination} onClick={() => void playAppSound("open")}>Commencer <DaIcon name="arrow" /></Link> : <button className="btn btn--p" type="button" onClick={reveal} disabled={started}>{started ? "Ouverture…" : "Voir mes accès"}</button>}<span aria-live="polite">{done ? `${state.entries.length} accès ouverts.` : ""}</span></div>
  </div></main>;
}
