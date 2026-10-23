import { ArrowRight } from "lucide-react";
import { COFFRE_LABEL, UPGRADE_PATH, UPGRADE_PRICE, formatEuro } from "@/lib/pricing";

export function FoundationUpgradeCard() {
  return (
    <section className="mt-12 rounded-[var(--r-l)] bg-[var(--carte)] p-6 sm:p-8" aria-labelledby="foundation-upgrade-title">
      <div className="mx-auto flex max-w-xl flex-col gap-5 text-center">
        <div>
          <h2 id="foundation-upgrade-title" className="text-xl font-semibold text-[var(--encre)]">
            Continuer avec une méthode complète
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-[var(--t2)]">
            Passe à {COFFRE_LABEL} quand tu veux. Tu paies seulement le complément.
          </p>
        </div>
        <a className="btn btn--p" href={UPGRADE_PATH}>
          Passer à {COFFRE_LABEL}, {formatEuro(UPGRADE_PRICE)}
          <ArrowRight aria-hidden="true" />
        </a>
      </div>
    </section>
  );
}
