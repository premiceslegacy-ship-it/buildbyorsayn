"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";
import { DaIcon } from "@/components/da/DaIcon";
import { animateAppElement, installAppMotionTokens, motionAllowed } from "@/lib/ui/motion";
import { playAppSound } from "@/lib/ui/sound";
import { purchaseRevealSchedule, type PurchaseState } from "./purchaseModel";

export function PurchaseConfirmation({ state }: { state: PurchaseState }) {
  const router = useRouter();
  const timers = useRef<number[]>([]);
  const badge = useRef<SVGSVGElement>(null);
  const [copyVisible, setCopyVisible] = useState(false);
  const [revealed, setRevealed] = useState(0);
  const [opened, setOpened] = useState(0);
  const [actionVisible, setActionVisible] = useState(false);
  const [refreshing, startRefresh] = useTransition();

  useEffect(() => {
    installAppMotionTokens();
    const activeTimers = timers.current;
    return () => activeTimers.forEach((timer) => window.clearTimeout(timer));
  }, []);

  useEffect(() => {
    if (state.kind !== "confirmed") return;
    const at = (delay: number, effect: () => void) => {
      const timer = window.setTimeout(effect, delay);
      timers.current.push(timer);
    };

    if (!motionAllowed()) {
      at(0, () => {
        setCopyVisible(true);
        setRevealed(state.entries.length);
        setOpened(state.entries.length);
        setActionVisible(true);
        void playAppSound("confirm");
      });
      return;
    }

    const schedule = purchaseRevealSchedule(state.entries.length);
    const circle = badge.current?.querySelector("circle");
    const check = badge.current?.querySelector("path");
    if (!circle || !check) return;
    const checkAnimation = check.animate([{ strokeDashoffset: 72 }, { strokeDashoffset: 0 }], { duration: 380, delay: 380, easing: "cubic-bezier(.3,.9,.3,1)", fill: "both" });
    const popAnimation = animateAppElement(check, [{ transform: "scale(.82)" }, { transform: "none" }], "rebond", 380);
    const animations = [
      circle.animate([{ strokeDashoffset: 315 }, { strokeDashoffset: 0 }], { duration: 520, easing: "cubic-bezier(.3,.9,.3,1)", fill: "both" }),
      checkAnimation,
      ...(popAnimation ? [popAnimation] : []),
    ];
    let live = true;
    void checkAnimation.finished.then(() => {
      if (!live) return;
      setCopyVisible(true);
      void playAppSound("confirm");
      schedule.rows.forEach((row, index) => {
        at(row.revealAt - schedule.copyAt, () => setRevealed(index + 1));
        at(row.openAt - schedule.copyAt, () => {
          setOpened(index + 1);
          void playAppSound("select");
        });
      });
      at(schedule.actionAt - schedule.copyAt, () => setActionVisible(true));
    }).catch(() => {
      // Une navigation peut annuler l'animation avant sa fin.
    });
    return () => {
      live = false;
      animations.forEach((animation) => animation.cancel());
    };
  }, [state]);

  if (state.kind === "error") return <main className="purchase-state"><div className="purchase-state__in"><span className="purchase-badge purchase-badge--error"><DaIcon name="x" /></span><h1 className="t-1">Ton accès ne peut pas être vérifié.</h1><p className="t-lede">Aucun accès n&apos;est annoncé tant que la vérification du compte échoue.</p><button className="btn btn--p" type="button" disabled={refreshing} onClick={() => startRefresh(() => router.refresh())}>{refreshing ? "Vérification…" : "Réessayer"}</button></div></main>;

  if (state.kind === "pending") return <main className="purchase-state"><div className="purchase-state__in"><span className="purchase-badge purchase-badge--pending" aria-hidden="true"><i /><i /><i /></span><h1 className="t-1">Paiement en cours de confirmation.</h1><p className="t-lede">{state.authenticated ? "Stripe a peut-être déjà reçu ton paiement. BUILD attend encore la confirmation serveur avant d’ouvrir ton accès." : "Connecte-toi avec le compte utilisé pour l’achat afin que BUILD puisse vérifier ton accès."}</p>{state.authenticated ? <button className="btn btn--p" type="button" disabled={refreshing} onClick={() => { void playAppSound("click"); startRefresh(() => router.refresh()); }}>{refreshing ? "Vérification…" : "Vérifier à nouveau"}</button> : <Link className="btn btn--p" href="/login?next=%2Ffin">Se connecter</Link>}<small>Tu ne seras jamais renvoyé vers un nouveau paiement depuis cet écran.</small></div></main>;

  return <main className="purchase-state"><div className="purchase-confirmed">
    <span className="purchase-badge purchase-badge--confirmed" aria-hidden="true"><svg ref={badge} viewBox="0 0 112 112"><circle cx="56" cy="56" r="50" /><path d="M31 57l16 16 34-36" /></svg></span>
    <h1 className="t-aff" data-visible={copyVisible}>C&apos;est débloqué.</h1>
    <p className="t-lede" data-visible={copyVisible}>{state.label} est activé sur ton compte. Voici ce qui vient de s&apos;ouvrir.</p>
    <ul className="purchase-list" aria-label="Ce qui vient de s’ouvrir">{state.entries.map((entry, index) => <li key={entry.id} data-visible={index < revealed} data-open={index < opened}>
      <Image src={entry.image} alt="" width={224} height={126} /><span><small>{entry.label}</small><b>{entry.title}</b></span><i aria-hidden="true"><svg className="purchase-lock" viewBox="0 0 24 24"><rect x="5" y="10.5" width="14" height="10" rx="2.6" /><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" /></svg></i><span className="sr">{index < opened ? "Déverrouillé" : "Verrouillé"}</span>
    </li>)}</ul>
    <div className="purchase-action" data-visible={actionVisible}>{actionVisible ? <Link className="btn btn--p" href={state.destination} onClick={() => void playAppSound("open")}>Commencer <DaIcon name="arrow" /></Link> : null}<span aria-live="polite">{actionVisible ? `${state.entries.length} accès ouverts.` : ""}</span></div>
  </div></main>;
}
