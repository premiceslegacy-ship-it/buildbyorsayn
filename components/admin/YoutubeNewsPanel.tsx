"use client";

import { Link2, Youtube } from "lucide-react";
import { type FormEvent, useRef, useState, useTransition } from "react";
import { addYoutubeNewsAction } from "@/app/admin/actions";
import { animateAppElement } from "@/lib/ui/motion";
import { playAppSound } from "@/lib/ui/sound";

export function YoutubeNewsPanel() {
  const [url, setUrl] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [pending, startTransition] = useTransition();
  const resultRef = useRef<HTMLParagraphElement>(null);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage(null);
    setSuccess(false);
    startTransition(async () => {
      const result = await addYoutubeNewsAction(url);
      setMessage(result.message);
      setSuccess(result.ok);
      if (result.ok) setUrl("");
      requestAnimationFrame(() => {
        if (resultRef.current) animateAppElement(resultRef.current, [{ opacity: 0, transform: "translateY(6px)" }, { opacity: 1, transform: "none" }], "doux");
      });
      void playAppSound(result.ok ? "confirm" : "error");
    });
  };

  return (
    <section className="adm-youtube-panel" aria-labelledby="youtube-news-title">
      <div className="adm-youtube-icon" aria-hidden="true"><Youtube /></div>
      <div>
        <h3 id="youtube-news-title">Ajouter une vidéo YouTube</h3>
        <p>Colle un lien de vidéo longue publiée sur ta chaîne.</p>
      </div>
      <form onSubmit={submit}>
        <label>
          <span className="sr">Lien YouTube</span>
          <Link2 aria-hidden="true" />
          <input
            type="url"
            value={url}
            onChange={(event) => setUrl(event.target.value)}
            placeholder="https://www.youtube.com/watch?v=..."
            required
          />
        </label>
        <button type="submit" className="adm-ghost-button" disabled={pending || !url.trim()}>
          {pending ? "Vérification en cours" : "Ajouter au flux"}
        </button>
      </form>
      {pending ? <div className="adm-waiting" role="status"><i aria-hidden="true" />YouTube répond, garde cette vue ouverte.</div> : null}
      {message ? <p ref={resultRef} className={success ? "adm-success" : "adm-inline-error"} role={success ? "status" : "alert"}>{message}</p> : null}
    </section>
  );
}
