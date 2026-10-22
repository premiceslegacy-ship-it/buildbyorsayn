/**
 * Texte exact que l'acheteur confirme sur la page de paiement Stripe (case à cocher obligatoire).
 * Les CGV l'affichent mot pour mot : le texte configuré dans Stripe (lien de paiement, conditions de service)
 * doit être identique à celui-ci, sinon la preuve du consentement ne correspond plus aux CGV.
 * Code de la consommation, article L221-28, 13° : accord préalable exprès à l'exécution immédiate et renoncement exprès à la rétractation.
 */
export const CHECKOUT_CONSENT_TEXT =
  "Je demande l'accès immédiat à mon contenu numérique BUILD. Je reconnais que, dès que l'accès est ouvert, je perds mon droit de rétractation de 14 jours. J'ai lu et j'accepte les conditions générales de vente.";
