"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import {
  Bot,
  ChartNoAxesCombined,
  ChevronLeft,
  Mail,
  Menu,
  MessageSquareText,
  Newspaper,
  Users,
  Video,
  X,
} from "lucide-react";
import { animateAppElement, installAppMotionTokens } from "@/lib/ui/motion";
import { playAppSound } from "@/lib/ui/sound";

export type AdminViewKey = "overview" | "users" | "videos" | "agent" | "news" | "emails" | "accompaniment";

type Props = {
  userLabel: string;
  counts: { users: number; accompaniment: number };
  views: Record<AdminViewKey, ReactNode>;
};

const NAV_ITEMS: Array<{
  key: AdminViewKey;
  label: string;
  icon: typeof Users;
  group: "Pilotage" | "Production" | "Communication";
}> = [
  { key: "overview", label: "Vue d'ensemble", icon: ChartNoAxesCombined, group: "Pilotage" },
  { key: "users", label: "Utilisateurs", icon: Users, group: "Pilotage" },
  { key: "videos", label: "Vidéos", icon: Video, group: "Production" },
  { key: "agent", label: "Agent", icon: Bot, group: "Production" },
  { key: "news", label: "Nouveautés", icon: Newspaper, group: "Production" },
  { key: "emails", label: "E-mails", icon: Mail, group: "Communication" },
  { key: "accompaniment", label: "Accompagnements", icon: MessageSquareText, group: "Communication" },
];

const HASH_TO_VIEW: Record<string, AdminViewKey> = {
  vue: "overview",
  utilisateurs: "users",
  videos: "videos",
  agent: "agent",
  nouveautes: "news",
  mails: "emails",
  accompagnements: "accompaniment",
};

const VIEW_TO_HASH = Object.fromEntries(
  Object.entries(HASH_TO_VIEW).map(([hash, view]) => [view, hash]),
) as Record<AdminViewKey, string>;

function viewFromHash(): AdminViewKey {
  if (typeof window === "undefined") return "overview";
  return HASH_TO_VIEW[window.location.hash.replace(/^#\/?/, "")] ?? "overview";
}

export function shouldCloseAdminMenu(key: string, menuOpen: boolean) {
  return menuOpen && key === "Escape";
}

export function AdminShell({ userLabel, counts, views }: Props) {
  const [activeView, setActiveView] = useState<AdminViewKey>("overview");
  const [menuOpen, setMenuOpen] = useState(false);
  const activePanel = useRef<HTMLDivElement>(null);
  const menuButton = useRef<HTMLButtonElement>(null);
  const closeMenuButton = useRef<HTMLButtonElement>(null);
  const activeItem = NAV_ITEMS.find((item) => item.key === activeView) ?? NAV_ITEMS[0];

  useEffect(() => {
    installAppMotionTokens();
    const syncHash = () => setActiveView(viewFromHash());
    syncHash();
    window.addEventListener("hashchange", syncHash);
    return () => window.removeEventListener("hashchange", syncHash);
  }, []);

  useEffect(() => {
    if (!activePanel.current) return;
    animateAppElement(
      activePanel.current,
      [{ opacity: 0, transform: "translateY(12px)" }, { opacity: 1, transform: "none" }],
      "doux",
    );
  }, [activeView]);

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (!shouldCloseAdminMenu(event.key, menuOpen)) return;
      event.preventDefault();
      setMenuOpen(false);
      window.requestAnimationFrame(() => menuButton.current?.focus());
      void playAppSound("select");
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return;
    window.requestAnimationFrame(() => closeMenuButton.current?.focus());
  }, [menuOpen]);

  const selectView = (view: AdminViewKey) => {
    if (view === activeView) {
      setMenuOpen(false);
      return;
    }
    setActiveView(view);
    setMenuOpen(false);
    window.history.replaceState(null, "", `#/` + VIEW_TO_HASH[view]);
  };

  const toggleMenu = () => {
    setMenuOpen((current) => {
      if (current) window.requestAnimationFrame(() => menuButton.current?.focus());
      return !current;
    });
    void playAppSound("open");
  };

  return (
    <div className="adm-shell">
      <a className="adm-skip" href="#admin-main">Aller au contenu</a>
      <aside id="admin-navigation" className="adm-sidebar" data-open={menuOpen || undefined} aria-label="Administration">
        <div className="adm-side-head">
          <Link href="/admin#/vue" className="adm-logo" aria-label="BUILD, vue d'ensemble">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/da/logo-sombre.svg" alt="BUILD" width={104} height={30} />
          </Link>
          <button ref={closeMenuButton} className="adm-side-close" type="button" onClick={toggleMenu} aria-label="Fermer le menu">
            <X aria-hidden="true" />
          </button>
        </div>

        {(["Pilotage", "Production", "Communication"] as const).map((group) => (
          <nav className="adm-nav-group" aria-label={group} key={group}>
            <p>{group}</p>
            {NAV_ITEMS.filter((item) => item.group === group).map((item) => {
              const Icon = item.icon;
              const badge = item.key === "users"
                ? counts.users
                : item.key === "accompaniment" && counts.accompaniment > 0
                  ? counts.accompaniment
                  : null;
              return (
                <button
                  type="button"
                  key={item.key}
                  className="adm-nav-item"
                  aria-current={activeView === item.key ? "page" : undefined}
                  onClick={() => selectView(item.key)}
                >
                  <Icon aria-hidden="true" />
                  <span>{item.label}</span>
                  {badge !== null ? <small aria-label={`${badge} éléments`}>{badge}</small> : null}
                </button>
              );
            })}
          </nav>
        ))}

        <div className="adm-identity">
          <span className="adm-avatar" aria-hidden="true">SM</span>
          <span><b>{userLabel}</b><small>Administrateur</small></span>
          <Link href="/dashboard"><ChevronLeft aria-hidden="true" />Retour à BUILD</Link>
        </div>
      </aside>

      <button
        className="adm-nav-scrim"
        type="button"
        aria-label="Fermer le menu"
        data-open={menuOpen || undefined}
        onClick={toggleMenu}
      />

      <div className="adm-workspace">
        <header className="adm-toolbar">
          <button
            ref={menuButton}
            className="adm-menu-button"
            type="button"
            onClick={toggleMenu}
            aria-expanded={menuOpen}
            aria-controls="admin-navigation"
            aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
          >
            <Menu aria-hidden="true" />
          </button>
          <h1>{activeItem.label}</h1>
        </header>

        <main id="admin-main" className="adm-main" tabIndex={-1}>
          {(Object.keys(views) as AdminViewKey[]).map((key) => (
            <div
              key={key}
              ref={key === activeView ? activePanel : undefined}
              className="adm-view"
              hidden={key !== activeView}
              aria-hidden={key !== activeView}
            >
              {views[key]}
            </div>
          ))}
        </main>
      </div>
    </div>
  );
}
