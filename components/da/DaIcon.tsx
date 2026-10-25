import type { ReactNode } from "react";

/** Tracés exacts du kit TV v1, sans bibliothèque d'icônes secondaire. */
const ICONS = {
  check: <path d="M5 12.5l4.5 4.5L19 7.5" />,
  x: <path d="M6.5 6.5l11 11M17.5 6.5l-11 11" />,
  plus: <path d="M12 5v14M5 12h14" />,
  play: <path d="M7 4.6v14.8a1 1 0 0 0 1.5.86l12-7.4a1 1 0 0 0 0-1.72l-12-7.4A1 1 0 0 0 7 4.6z" />,
  arrow: <path d="M5 12h14M13 6l6 6-6 6" />,
  chevron: <path d="M9 5l7 7-7 7" />,
  chevronLeft: <path d="M15 5l-7 7 7 7" />,
  search: <><circle cx="11" cy="11" r="6.5" /><path d="M20 20l-4.2-4.2" /></>,
  volume: <><path d="M4 9.5v5h3.5L12 18.5v-13L7.5 9.5H4z" /><path d="M16 9a4.2 4.2 0 0 1 0 6M18.6 6.5a8 8 0 0 1 0 11" /></>,
  mute: <><path d="M4 9.5v5h3.5L12 18.5v-13L7.5 9.5H4z" /><path d="M16.5 9.5l5 5M21.5 9.5l-5 5" /></>,
  home: <path d="M4 11l8-7 8 7v8a1 1 0 0 1-1 1h-4v-6h-6v6H5a1 1 0 0 1-1-1z" />,
  grid: <><rect x="4" y="4" width="6.5" height="6.5" rx="1.6" /><rect x="13.5" y="4" width="6.5" height="6.5" rx="1.6" /><rect x="4" y="13.5" width="6.5" height="6.5" rx="1.6" /><rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1.6" /></>,
  news: <><rect x="3.5" y="5" width="17" height="14" rx="3" /><path d="M10 9.5v5l4.2-2.5z" /></>,
  skill: <><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" /><path d="M14 3v5h5M9 13h6M9 17h4" /></>,
  user: <><circle cx="12" cy="8.5" r="3.6" /><path d="M5 20a7 7 0 0 1 14 0" /></>,
  creditCard: <><rect x="3" y="5.5" width="18" height="13" rx="3" /><path d="M3 10h18M7 15h3" /></>,
  plug: <path d="M9 3v5M15 3v5M6.5 8h11v3a5.5 5.5 0 0 1-11 0zM12 16.5V21" />,
  phone: <path d="M6.8 4.5h2.3l1.4 4.2-2.3 1.6a13.2 13.2 0 0 0 5.5 5.5l1.6-2.3 4.2 1.4v2.3a2 2 0 0 1-2.1 2A14.3 14.3 0 0 1 4.8 6.6a2 2 0 0 1 2-2.1z" />,
  logout: <path d="M10 4H6.5A2.5 2.5 0 0 0 4 6.5v11A2.5 2.5 0 0 0 6.5 20H10M15 8l4 4-4 4M19 12H9.5" />,
  lock: <><rect x="5" y="10.5" width="14" height="10" rx="2.6" /><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" /></>,
  external: <path d="M14 4h6v6M20 4l-9 9M18 14v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4" />,
} satisfies Record<string, ReactNode>;

export type DaIconName = keyof typeof ICONS;

export function DaIcon({ name, className = "" }: { name: DaIconName; className?: string }) {
  const filled = name === "play";
  return <svg className={`ic${filled ? " ic--f" : ""} ${className}`.trim()} viewBox="0 0 24 24" aria-hidden="true" focusable="false">{ICONS[name]}</svg>;
}
