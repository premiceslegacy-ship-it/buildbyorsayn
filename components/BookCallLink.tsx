import { BOOK_CALL_URL } from "@/lib/bookCall";

export function BookCallLink({ className = "btn btn--g", label = "Réserver un appel" }: { className?: string; label?: string }) {
  return <a className={className} href={BOOK_CALL_URL} target="_blank" rel="noopener noreferrer">{label}</a>;
}
