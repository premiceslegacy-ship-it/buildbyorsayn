import Image from "next/image";
import { BookCallLink } from "@/components/BookCallLink";

/** Carte de réservation partagée par le tableau de bord et le compte. */
export function BookCallCard({ className = "" }: { className?: string }) {
  return (
    <article className={`book-call-card ${className}`.trim()} aria-labelledby="book-call-title">
      <div className="book-call-card__visual" aria-hidden="true">
        <Image className="book-call-card__image" src="/logos3d/google-calendar.png" alt="" width={160} height={160} />
      </div>
      <div className="book-call-card__text">
        <h2 id="book-call-title">Réserver un appel</h2>
        <p>Choisis un créneau pour parler de ton projet.</p>
      </div>
      <BookCallLink className="btn btn--g book-call-card__cta" />
    </article>
  );
}
