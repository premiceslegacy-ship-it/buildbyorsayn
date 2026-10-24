"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { DaIcon } from "@/components/da/DaIcon";
import { LiquidGlassNav } from "@/components/ui/LiquidGlass";

export const MEMBER_NAV = [
  { label: "Aujourd'hui", href: "/dashboard", icon: "home" as const },
  { label: "Programme", href: "/programme", icon: "grid" as const },
  { label: "Skills", href: "/skills", icon: "skill" as const },
  { label: "Nouveautés", href: "/nouveautes", icon: "news" as const },
];

type Rect = { left: number; top: number; width: number; height: number };

// La barre est remontée à chaque changement de page (écran de chargement, puis page). Ces deux mémoires
// de module survivent aux remontages : la pastille part de l'onglet quitté et glisse vers l'onglet touché,
// sans repartir de zéro.
let pending: { href: string; from: string; at: number } | null = null;
const PENDING_MS = 4000;
let lastPill: Rect | null = null;

function isCurrent(pathname: string, href: string) {
  return pathname === href || (href === "/skills" && pathname.startsWith("/skills"));
}

export function MemberTabbar({ unseen }: { unseen?: { label: string; count: number } | null }) {
  const pathname = usePathname();
  const [pendingHref, setPendingHref] = useState<string | null>(() => (pending && pending.from === pathname && Date.now() - pending.at <= PENDING_MS ? pending.href : null));
  const slider = useRef<HTMLSpanElement>(null);
  const active = pendingHref ?? MEMBER_NAV.find((item) => isCurrent(pathname, item.href))?.href ?? null;

  // La page a changé (ou l'on revient en arrière) : l'onglet touché n'est plus en attente.
  const [seenPath, setSeenPath] = useState(pathname);
  if (seenPath !== pathname) {
    setSeenPath(pathname);
    setPendingHref(null);
  }
  useEffect(() => { pending = null; }, [pathname]);

  // À la disparition de la barre (écran de chargement, puis page), on garde la position VISIBLE de la pastille,
  // même en plein glissement : la barre suivante repart de là et finit le mouvement, sans saut.
  useLayoutEffect(() => {
    const pill = slider.current;
    const host = pill?.parentElement;
    return () => {
      if (!pill || !host) return;
      const from = pill.getBoundingClientRect();
      const frame = host.getBoundingClientRect();
      if (from.width > 0) lastPill = { left: from.left - frame.left, top: from.top - frame.top, width: from.width, height: from.height };
    };
  }, []);

  useEffect(() => {
    const pill = slider.current;
    const host = pill?.parentElement;
    if (!pill || !host) return;
    const place = (rect: Rect) => {
      pill.style.width = `${rect.width}px`;
      pill.style.height = `${rect.height}px`;
      pill.style.transform = `translate(${rect.left}px, ${rect.top}px)`;
    };
    const measure = (): Rect | null => {
      const link = host.querySelector<HTMLElement>('a[data-active="true"]');
      return link ? { left: link.offsetLeft, top: link.offsetTop, width: link.offsetWidth, height: link.offsetHeight } : null;
    };
    const target = measure();
    if (!target) { pill.style.opacity = "0"; return; }
    pill.style.opacity = "1";
    if (!pill.dataset.ready && lastPill) {
      place(lastPill);
      void pill.offsetWidth;
    }
    const frame = requestAnimationFrame(() => {
      pill.dataset.ready = "true";
      place(target);
    });
    const observer = new ResizeObserver(() => {
      const next = measure();
      if (!next) return;
      place(next);
    });
    observer.observe(host);
    return () => { cancelAnimationFrame(frame); observer.disconnect(); };
  }, [active]);

  return (
    <LiquidGlassNav className="tabbar" aria-label="Navigation mobile" glass={{ teinte: "rgba(0,0,0,.5)", reflet: 0.9, bord: 0.44, force: 1.9, dispersion: 0.6, angle: -28, flou: 2.4 }}>
      <span className="slider" ref={slider} aria-hidden="true" />
      {MEMBER_NAV.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={active === item.href ? "on" : undefined}
          data-active={active === item.href ? "true" : undefined}
          aria-current={isCurrent(pathname, item.href) ? "page" : undefined}
          onClick={() => { pending = { href: item.href, from: pathname, at: Date.now() }; setPendingHref(item.href); }}
        >
          <DaIcon name={item.icon} />
          <span className="tabbar__label">{item.label}</span>
          {item.href === "/nouveautes" && unseen ? <span className="nav-unseen nav-unseen--mobile" data-testid="nouveautes-badge" aria-label={`${unseen.count} nouveautés non vues`}>{unseen.label}</span> : null}
        </Link>
      ))}
    </LiquidGlassNav>
  );
}
