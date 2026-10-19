import Link from "next/link";
import { formatNouveautesBadge } from "@/lib/nouveautes/seen";

type NouveautesNavLinkProps = { count: number | null; className?: string; onClick?: () => void };

export function NouveautesBadge({ count }: { count: number | null }) {
  const label = formatNouveautesBadge(count);
  if (!label) return null;
  return (
    <span data-testid="nouveautes-badge" className="ml-1.5 inline-flex min-w-4 items-center justify-center rounded-full bg-[#e8d5b0] px-1 text-[10px] font-semibold leading-4 text-[#0e0e0f]">
      {label}
    </span>
  );
}

export function NouveautesNavLink({ count, className, onClick }: NouveautesNavLinkProps) {
  return (
    <Link
      href="/nouveautes"
      className={className}
      onClick={onClick}
      aria-label={count ? `Nouveautés, ${count} nouvelle${count === 1 ? "" : "s"}` : undefined}
    >
      Nouveautés
      <NouveautesBadge count={count} />
    </Link>
  );
}
