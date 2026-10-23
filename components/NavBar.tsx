"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { DaIcon } from "@/components/da/DaIcon";
import { SearchDialog } from "@/components/da/SearchDialog";
import { useNouveautesUnseenCount } from "@/components/nouveautes/useNouveautesUnseenCount";
import { normalizeProfileTier } from "@/lib/mcpAccess";
import { formatNouveautesBadge } from "@/lib/nouveautes/seen";
import { animateAppElement, installAppMotionTokens, motionAllowed } from "@/lib/ui/motion";
import { playAppSound, useAppSound } from "@/lib/ui/sound";

interface NavBarProps {
  activeLink?: "dashboard" | "beginner" | "sources" | "skills" | "nouveautes" | "protocole" | "videos-tutos" | "accompagnement";
  tier?: string | null;
  isAdmin?: boolean;
  displayName?: string;
  displayEmail?: string;
  initials?: string;
  onFondationsClick?: () => void;
  onStackClick?: () => void;
}

const NAV = [
  { label: "Aujourd'hui", href: "/dashboard", icon: "home" as const },
  { label: "Programme", href: "/programme", icon: "grid" as const },
  { label: "Skills", href: "/skills", icon: "skill" as const },
  { label: "Nouveautés", href: "/nouveautes", icon: "news" as const },
];

function tierLabel(tier: string | null | undefined) {
  const normalized = normalizeProfileTier(tier);
  if (normalized === "full") return "LE COFFRE";
  if (normalized === "beginner") return "Fondations";
  if (normalized === "preview") return "Aperçu";
  return "Gratuit";
}

export function NavBar({ tier, isAdmin = false, displayName, displayEmail, initials }: NavBarProps) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuClosing, setMenuClosing] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menu = useRef<HTMLDivElement>(null);
  const avatar = useRef<HTMLButtonElement>(null);
  const menuAnimation = useRef<Animation | null>(null);
  const { enabled, setEnabled } = useAppSound();
  const unseenCount = useNouveautesUnseenCount();
  const unseenLabel = formatNouveautesBadge(unseenCount);

  useEffect(() => {
    installAppMotionTokens();
    const onScroll = () => setScrolled(window.scrollY > 18);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const selector = '[data-sfx], a[href], button, [role="tab"], summary, .chip';
    let pressed = false;
    const kindOf = (target: HTMLElement) => target.dataset.sfx || (target.closest('[role="tablist"], .tabs, .seg') ? "select" : "click");
    const pointer = (event: PointerEvent) => {
      const target = (event.target as Element | null)?.closest<HTMLElement>(selector);
      pressed = false;
      if (!target || target.matches(":disabled") || target.getAttribute("aria-disabled") === "true") return;
      const kind = kindOf(target);
      if (kind === "none") return;
      pressed = true;
      void playAppSound(kind as "click" | "select" | "open" | "confirm" | "error");
    };
    const click = (event: MouseEvent) => {
      const target = (event.target as Element | null)?.closest<HTMLElement>(selector);
      if (!target || target.matches(":disabled")) return;
      if (!pressed && event.detail === 0) {
        const kind = kindOf(target);
        if (kind !== "none") void playAppSound(kind as "click" | "select" | "open" | "confirm" | "error");
      }
      pressed = false;
    };
    document.addEventListener("pointerdown", pointer, true);
    document.addEventListener("click", click);
    return () => { document.removeEventListener("pointerdown", pointer, true); document.removeEventListener("click", click); };
  }, []);

  const closeMenu = useCallback((focusBack = false) => {
    if (!menu.current) { setMenuOpen(false); return; }
    menuAnimation.current?.cancel();
    if (!motionAllowed()) { setMenuOpen(false); if (focusBack) avatar.current?.focus(); return; }
    setMenuClosing(true);
    menuAnimation.current = menu.current.animate([{ opacity: 1 }, { opacity: 0, transform: "scale(.97)" }], { duration: 140, easing: "cubic-bezier(.4,0,.6,1)" });
    menuAnimation.current.onfinish = () => { setMenuOpen(false); setMenuClosing(false); menuAnimation.current = null; };
    if (focusBack) avatar.current?.focus({ preventScroll: true });
  }, []);
  const closeSearch = useCallback(() => setSearchOpen(false), []);
  useEffect(() => {
    if (!menuOpen) return;
    menuAnimation.current?.cancel();
    if (menu.current) {
      menuAnimation.current = animateAppElement(menu.current, [{ opacity: 0, transform: "scale(.92) translateY(-8px)" }, { opacity: 1, transform: "none" }], "doux");
      menu.current.querySelector<HTMLElement>('[role^="menuitem"]')?.focus({ preventScroll: true });
    }
    const outside = (event: PointerEvent) => {
      const target = event.target as Node;
      if (!menu.current?.contains(target) && !avatar.current?.contains(target)) closeMenu(false);
    };
    const key = (event: KeyboardEvent) => {
      if (event.key === "Escape") { event.preventDefault(); closeMenu(true); return; }
      if (event.key === "Tab") { closeMenu(false); return; }
      const items = [...(menu.current?.querySelectorAll<HTMLElement>('[role^="menuitem"]') ?? [])];
      const current = items.indexOf(document.activeElement as HTMLElement);
      if (event.key === "ArrowDown") { event.preventDefault(); items[(current + 1) % items.length]?.focus(); }
      if (event.key === "ArrowUp") { event.preventDefault(); items[(current + items.length - 1) % items.length]?.focus(); }
      if (event.key === "Home") { event.preventDefault(); items[0]?.focus(); }
      if (event.key === "End") { event.preventDefault(); items.at(-1)?.focus(); }
    };
    document.addEventListener("pointerdown", outside);
    document.addEventListener("keydown", key);
    return () => { document.removeEventListener("pointerdown", outside); document.removeEventListener("keydown", key); };
  }, [closeMenu, menuOpen]);

  useEffect(() => {
    const shortcut = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;
      if (target.matches("input, textarea, [contenteditable=true]")) return;
      if (((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") || event.key === "/") {
        event.preventDefault();
        setSearchOpen(true);
        void playAppSound("open");
      }
    };
    document.addEventListener("keydown", shortcut);
    return () => document.removeEventListener("keydown", shortcut);
  }, []);

  const openMenu = () => {
    if (menuClosing) {
      menuAnimation.current?.cancel();
      setMenuClosing(false);
      if (menu.current) menuAnimation.current = animateAppElement(menu.current, [{ opacity: 0, transform: "scale(.92) translateY(-8px)" }, { opacity: 1, transform: "none" }], "doux");
      void playAppSound("open");
      return;
    }
    if (menuOpen) { closeMenu(true); return; }
    setMenuOpen(true);
    void playAppSound("open");
  };
  const openSearch = () => { setSearchOpen(true); void playAppSound("open"); };
  const isCurrent = (href: string) => pathname === href || (href === "/skills" && pathname.startsWith("/skills"));
  const signedIn = Boolean(displayEmail || displayName);

  return (
    <div className="da da-app nav-shell">
      <header className={`navbar${scrolled ? " solid" : ""}`}>
        <Link className="navbar__logo" href={signedIn ? "/dashboard" : "/"} aria-label="BUILD"><Image src="/da/logo-sombre.svg" alt="BUILD" width={112} height={28} priority /></Link>
        <nav className="navbar__nav" aria-label="Principal">{NAV.map((item) => <Link key={item.href} href={item.href} className={isCurrent(item.href) ? "on" : undefined} aria-current={isCurrent(item.href) ? "page" : undefined}>{item.label}{item.href === "/nouveautes" && unseenLabel ? <span className="nav-unseen" data-testid="nouveautes-badge" aria-label={`${unseenCount} nouveautés non vues`}>{unseenLabel}</span> : null}</Link>)}</nav>
        <div className="navbar__r">
          {signedIn && <button className="navbar__ib" type="button" aria-label="Rechercher" data-sfx="none" onClick={openSearch}><DaIcon name="search" /></button>}
          {signedIn && <button className="navbar__ib" type="button" aria-label="Sons de l'interface" aria-pressed={enabled} data-sfx="none" onClick={() => { setEnabled(!enabled); void playAppSound("select"); }}><DaIcon name={enabled ? "volume" : "mute"} /></button>}
          {signedIn ? <button ref={avatar} className="avatar" type="button" aria-label="Compte" aria-haspopup="menu" aria-expanded={menuOpen && !menuClosing} data-sfx="none" onClick={openMenu}>{initials || displayName?.slice(0, 2).toUpperCase() || "?"}</button> : <Link className="btn btn--g btn--s" href="/login">Se connecter</Link>}
        </div>
      </header>
      {signedIn && menuOpen && <div className="amenu" ref={menu} role="menu" aria-label="Compte">
        <div className="amenu__h"><span className="avatar amenu__av">{initials || displayName?.slice(0, 2).toUpperCase()}</span><span className="amenu__id"><b>{displayName}</b><small>{displayEmail}</small></span><span className="pastille amenu__tier"><b />{tierLabel(tier)}</span></div>
        <div className="amenu__l">
          <Link role="menuitem" href="/compte"><DaIcon name="user" />Compte</Link>
          <Link role="menuitem" href="/checkout"><DaIcon name="creditCard" />Abonnement</Link>
          <Link role="menuitem" href="/dashboard/mcp"><DaIcon name="plug" />Connexion IA</Link>
          {isAdmin && <Link role="menuitem" href="/admin"><DaIcon name="grid" />Administration</Link>}
          <button role="menuitemcheckbox" aria-checked={enabled} type="button" data-sfx="none" onClick={() => { setEnabled(!enabled); void playAppSound("select"); }}><DaIcon name={enabled ? "volume" : "mute"} />Sons<span className="amenu__sw" /></button>
        </div>
        <div className="amenu__l amenu__l--b"><form action="/api/signout" method="post"><button role="menuitem" type="submit"><DaIcon name="logout" />Se déconnecter</button></form></div>
      </div>}
      {signedIn && <nav className="tabbar" aria-label="Navigation mobile">{NAV.map((item) => <Link key={item.href} href={item.href} className={isCurrent(item.href) ? "on" : undefined} aria-current={isCurrent(item.href) ? "page" : undefined}><DaIcon name={item.icon} /><span className="tabbar__label">{item.label}</span>{item.href === "/nouveautes" && unseenLabel ? <span className="nav-unseen nav-unseen--mobile" data-testid="nouveautes-badge" aria-label={`${unseenCount} nouveautés non vues`}>{unseenLabel}</span> : null}</Link>)}</nav>}
      {signedIn && <SearchDialog open={searchOpen} onClose={closeSearch} />}
    </div>
  );
}
