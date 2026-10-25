import { BookCallLink } from "@/components/BookCallLink";
import { DaIcon } from "@/components/da/DaIcon";

/** Carte de réservation partagée par le tableau de bord et le compte. */
export function BookCallCard({ className = "" }: { className?: string }) {
  return (
    <article className={`book-call-card ${className}`.trim()} aria-labelledby="book-call-title">
      <div className="book-call-card__copy">
        <span className="book-call-card__icon" aria-hidden="true"><DaIcon name="phone" /></span>
        <div className="book-call-card__text">
          <h2 id="book-call-title">Réserver un appel</h2>
          <p>Présente ton projet et pose tes questions à Samuel pendant un échange dédié.</p>
        </div>
      </div>
      <BookCallLink className="btn btn--g book-call-card__cta" />
    </article>
  );
}
