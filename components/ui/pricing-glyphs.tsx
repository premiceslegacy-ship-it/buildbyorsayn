type GlyphProps = { className?: string };

export function FondationsGlyph({ className }: GlyphProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M4 19h16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M6 19v-6M10 19v-8M14 19v-8M18 19v-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M4 10 12 5l8 5" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}

export function CoffreGlyph({ className }: GlyphProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M4 11c0-3.5 3-6 8-6s8 2.5 8 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <rect x="3.5" y="11" width="17" height="8" rx="1.4" stroke="currentColor" strokeWidth="1.5" />
      <path d="M3.5 15h17" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="12" cy="15" r="1.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M5.5 19v1.3M18.5 19v1.3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function CheckGlyph({ className }: GlyphProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M4 12.5 9.5 18 20 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function LockGlyph({ className }: GlyphProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <rect x="5" y="11" width="14" height="9" rx="1.4" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="12" cy="15.2" r="1.2" fill="currentColor" />
    </svg>
  );
}

export function MarkGlyph({ className }: GlyphProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path d="M12 3.5l2.1 4.6 5 .6-3.7 3.4.9 5-4.3-2.4-4.3 2.4.9-5-3.7-3.4 5-.6z" fill="currentColor" />
    </svg>
  );
}
