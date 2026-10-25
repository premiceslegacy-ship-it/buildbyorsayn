"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type Device = "desktop" | "phone";
type Scheme = "light" | "dark";
type Format = "html" | "text";

/**
 * Aperçu d'un e-mail : le HTML réellement généré par le gabarit, dans une iframe isolée (aucun script).
 * Le mail est sombre par construction ; « Clair » et « Sombre » simulent la boîte de réception autour de lui
 * (Gmail, Apple Mail et Outlook en mode clair ou sombre), pour vérifier qu'il tient dans les deux.
 */
export function MailPreview({ subject, html, text, from }: { subject: string; html: string; text: string; from: string }) {
  const [device, setDevice] = useState<Device>("desktop");
  const [scheme, setScheme] = useState<Scheme>("light");
  const [format, setFormat] = useState<Format>("html");
  const [frameHeight, setFrameHeight] = useState(0);
  const frameRef = useRef<HTMLIFrameElement>(null);

  const observerRef = useRef<ResizeObserver | null>(null);

  /** La hauteur suit le contenu du mail, y compris quand la largeur change (ordinateur, téléphone). */
  const watchFrame = useCallback(() => {
    observerRef.current?.disconnect();
    const body = frameRef.current?.contentDocument?.body;
    if (!body) return;
    const measure = () => setFrameHeight(body.offsetHeight);
    measure();
    observerRef.current = new ResizeObserver(measure);
    observerRef.current.observe(body);
  }, []);

  useEffect(() => () => observerRef.current?.disconnect(), []);

  return (
    <div className="ml-preview-box">
      <div className="ml-preview-bar" role="group" aria-label="Réglages de l'aperçu">
        <div className="ml-device">
          <button type="button" aria-pressed={scheme === "light"} onClick={() => setScheme("light")}>Clair</button>
          <button type="button" aria-pressed={scheme === "dark"} onClick={() => setScheme("dark")}>Sombre</button>
        </div>
        <div className="ml-device">
          <button type="button" aria-pressed={device === "desktop"} onClick={() => setDevice("desktop")}>Ordinateur</button>
          <button type="button" aria-pressed={device === "phone"} onClick={() => setDevice("phone")}>Téléphone</button>
        </div>
        <div className="ml-device">
          <button type="button" aria-pressed={format === "html"} onClick={() => setFormat("html")}>HTML</button>
          <button type="button" aria-pressed={format === "text"} onClick={() => setFormat("text")}>Texte</button>
        </div>
      </div>
      <div className="ml-window" data-scheme={scheme} data-device={device}>
        <dl className="ml-window-meta">
          <div><dt>De</dt><dd>{from}</dd></div>
          <div><dt>Objet</dt><dd>{subject}</dd></div>
        </dl>
        <div className="ml-stage">
          {format === "html" ? (
            <iframe
              ref={frameRef}
              className="ml-frame"
              data-device={device}
              style={frameHeight ? { height: frameHeight } : undefined}
              title={`Aperçu de l'e-mail : ${subject}`}
              sandbox="allow-same-origin"
              srcDoc={html}
              onLoad={watchFrame}
            />
          ) : (
            <pre className="ml-plain" data-device={device}>{text}</pre>
          )}
        </div>
      </div>
    </div>
  );
}
