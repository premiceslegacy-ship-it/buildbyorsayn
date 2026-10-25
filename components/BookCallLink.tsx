import { BOOK_CALL_URL } from "@/lib/bookCall";

export function BookCallLink({ className = "btn btn--g" }: { className?: string }) {
  return <a className={className} href={BOOK_CALL_URL} target="_blank" rel="noopener noreferrer">Réserver un appel</a>;
}
