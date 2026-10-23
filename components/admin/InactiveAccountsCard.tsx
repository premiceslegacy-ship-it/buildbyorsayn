"use client";

import { AlertTriangle, Check, Trash2, X } from "lucide-react";
import { useState, useTransition } from "react";
import {
  deleteInactiveAccountsAction,
  previewInactiveAccountsAction,
} from "@/app/admin/actions";
import { MAX_INACTIVE_ACCOUNT_BATCH } from "@/app/admin/inactiveAccounts";
import { animateAppElement } from "@/lib/ui/motion";
import { playAppSound } from "@/lib/ui/sound";

type Preview = { count: number; confirmation: string; message: string };

export function InactiveAccountsCard({
  candidateCount,
  onShowCandidates,
}: {
  candidateCount: number;
  onShowCandidates: () => void;
}) {
  const [preview, setPreview] = useState<Preview | null>(null);
  const [confirmation, setConfirmation] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [pending, startTransition] = useTransition();

  const openConfirmation = () => {
    setMessage(null);
    startTransition(async () => {
      const result = await previewInactiveAccountsAction();
      if (!result.ok) {
        setMessage(result.message);
        void playAppSound("error");
        return;
      }
      if (!result.count || !result.confirmation) {
        setSuccess(true);
        setMessage(result.message);
        void playAppSound("confirm");
        return;
      }
      setPreview({ count: result.count, confirmation: result.confirmation, message: result.message });
      setConfirmation("");
      requestAnimationFrame(() => {
        const dialog = document.querySelector(".adm-clean-dialog");
        if (dialog) animateAppElement(dialog, [{ opacity: 0, transform: "translateY(18px) scale(.98)" }, { opacity: 1, transform: "none" }], "vif");
      });
      void playAppSound("open");
    });
  };

  const confirmDeletion = () => {
    if (!preview) return;
    setMessage(null);
    startTransition(async () => {
      const result = await deleteInactiveAccountsAction({ expectedCount: preview.count, confirmation });
      if (!result.ok) {
        if (typeof result.count === "number" && result.count > 0 && result.confirmation) {
          setPreview({ count: result.count, confirmation: result.confirmation, message: result.message });
          setConfirmation("");
        }
        setMessage(result.message);
        void playAppSound("error");
        return;
      }
      setPreview(null);
      setSuccess(true);
      setMessage(result.message);
      void playAppSound("confirm");
    });
  };

  return (
    <>
      <section className="adm-clean-card" data-success={success || undefined} aria-labelledby="inactive-accounts-title">
        <span className="adm-clean-icon" aria-hidden="true">{success ? <Check /> : <Trash2 />}</span>
        <div>
          <h2 id="inactive-accounts-title">
            {success ? "Nettoyage terminé" : `${candidateCount} compte${candidateCount > 1 ? "s" : ""} gratuit${candidateCount > 1 ? "s" : ""} inactif${candidateCount > 1 ? "s" : ""} à vérifier`}
          </h2>
          <p>{success
            ? message ?? "Aucun compte gratuit inactif ne reste dans ce lot."
            : `Pas connecté${candidateCount > 1 ? "s" : ""} depuis plus de trois mois et créé${candidateCount > 1 ? "s" : ""} depuis au moins quatorze jours. Le contrôle exact vérifie aussi Stripe et les accompagnements.`}</p>
          {!success && candidateCount > MAX_INACTIVE_ACCOUNT_BATCH ? <small>Le prochain lot est limité à {MAX_INACTIVE_ACCOUNT_BATCH} comptes.</small> : null}
          {!preview && message && !success ? <p className="adm-inline-error" role="alert">{message}</p> : null}
        </div>
        {!success ? (
          <div className="adm-clean-actions">
            <button type="button" className="adm-ghost-button" onClick={onShowCandidates}>Voir ces comptes</button>
            <button type="button" className="adm-danger-button" onClick={openConfirmation} disabled={pending || candidateCount === 0}>
              <Trash2 aria-hidden="true" />{pending ? "Vérification" : "Préparer la suppression"}
            </button>
          </div>
        ) : null}
      </section>

      {preview ? (
        <div className="adm-dialog-layer" role="presentation">
          <button className="adm-dialog-scrim" type="button" aria-label="Fermer la confirmation" onClick={() => setPreview(null)} />
          <section className="adm-clean-dialog" role="dialog" aria-modal="true" aria-labelledby="inactive-dialog-title">
            <div className="adm-dialog-head">
              <span><AlertTriangle aria-hidden="true" /></span>
              <div><h2 id="inactive-dialog-title">Supprimer {preview.count} compte{preview.count > 1 ? "s" : ""} ?</h2><p>{preview.message}</p></div>
              <button type="button" onClick={() => setPreview(null)} aria-label="Fermer"><X aria-hidden="true" /></button>
            </div>
            <p>Le serveur vient de recalculer le lot. Aucun compte payé, administrateur ou accompagné n'en fait partie. Tu ne pourras pas revenir en arrière.</p>
            <label>
              Écris <b>{preview.confirmation}</b> pour confirmer.
              <input value={confirmation} onChange={(event) => setConfirmation(event.target.value)} autoComplete="off" />
            </label>
            {message ? <p className="adm-inline-error" role="alert">{message}</p> : null}
            <div className="adm-dialog-actions">
              <button type="button" className="adm-ghost-button" onClick={() => setPreview(null)}>Annuler</button>
              <button
                type="button"
                className="adm-danger-button"
                disabled={pending || confirmation !== preview.confirmation}
                onClick={confirmDeletion}
              >
                <Trash2 aria-hidden="true" />{pending ? "Suppression" : `Supprimer ${preview.count}`}
              </button>
            </div>
          </section>
        </div>
      ) : null}
    </>
  );
}
