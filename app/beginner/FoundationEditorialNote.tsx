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
    <aside className={`my-10 rounded-[var(--r-m)] bg-[var(--carte)] p-5 sm:p-6 ${className}`}>
      <div className="grid min-w-0 gap-3 sm:grid-cols-[9rem_minmax(0,1fr)] sm:gap-8">
        <span className="text-sm font-semibold text-[var(--em)]">
          {label}
        </span>
        <div className="min-w-0 max-w-2xl text-[17px] leading-[1.64] text-[var(--t1)]">{children}</div>
      </div>
    </aside>
  );
}
