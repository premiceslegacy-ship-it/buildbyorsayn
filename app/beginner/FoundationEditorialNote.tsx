import type { ReactNode } from "react";

export function FoundationEditorialNote({
  label = "À retenir",
  children,
  className = "",
}: {
  label?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <aside className={`my-10 border-y border-[#e8d5b0]/20 py-6 sm:py-7 ${className}`}>
      <div className="grid gap-3 sm:grid-cols-[9rem_minmax(0,1fr)] sm:gap-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#e8d5b0]/65">
          {label}
        </p>
        <div className="max-w-2xl text-[15px] leading-7 text-[#f0ede8]/85">{children}</div>
      </div>
    </aside>
  );
}
