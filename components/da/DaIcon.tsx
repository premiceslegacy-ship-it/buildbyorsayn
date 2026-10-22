/** Icônes au trait (un seul style, bouts ronds). Aucune dépendance : les tracés sont écrits ici. */
const PATHS = {
  check: "M5 12.5l4.5 4.5L19 7.5",
  x: "M6.5 6.5l11 11M17.5 6.5l-11 11",
  plus: "M12 5v14M5 12h14",
  play: "M8 5.2v13.6a.8.8 0 0 0 1.2.7l11-6.8a.8.8 0 0 0 0-1.4l-11-6.8A.8.8 0 0 0 8 5.2z",
  arrow: "M5 12h14M13 6l6 6-6 6",
} as const;

export type DaIconName = keyof typeof PATHS;

export function DaIcon({ name, className = "" }: { name: DaIconName; className?: string }) {
  return (
    <svg className={`ic ${className}`.trim()} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d={PATHS[name]} />
    </svg>
  );
}
