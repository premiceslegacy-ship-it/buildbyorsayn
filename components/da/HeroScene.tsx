/* eslint-disable @next/next/no-img-element -- icônes SVG décoratives de petite taille, aucune optimisation utile */
import type { CSSProperties } from "react";
import { DaIcon } from "./DaIcon";

const STEPS = [
  { logo: "claude", title: "Offre", note: "Claire et prête", doing: false },
  { logo: "cursor", title: "Site", note: "En ligne", doing: false },
  { logo: "stripe", title: "Vente", note: "Paiement prêt", doing: false },
  { logo: "notion", title: "Livraison", note: "En cours", doing: true },
] as const;

/**
 * Premier écran : la scène des réels BUILD. Une fenêtre de travail (les étapes de la personne avec l'outil de chacune, et la page qui se construit : une vraie photo, un titre, un bouton)
 * et un iPhone dont l'écran verrouillé montre un paiement Stripe et un message. Décoratif : le titre de la page dit déjà tout.
 * La scène est dessinée à taille fixe (1000 x 620) puis réduite par `zoom` selon la largeur (voir landing.css).
 * Les noms, la somme et l'adresse sont des exemples : aucune donnée réelle.
 */
export function HeroScene() {
  return (
    <div className="hs-wrap" aria-hidden="true">
      <div className="hs">
        <div className="fen">
          <div className="fen__barre">
            <span className="fen__points"><i /><i /><i /></span>
            <span className="fen__titre">Mon business</span>
          </div>
          <div className="fen__corps">
            <ul className="fen__etapes">
              {STEPS.map((step) => (
                <li key={step.title} className={step.doing ? "on" : undefined}>
                  <div className="tuile"><img src={`/da/logos/${step.logo}.svg`} alt="" width={64} height={64} /></div>
                  <div><b>{step.title}</b><small>{step.note}</small></div>
                  {step.doing
                    ? <span className="fen__etat fen__etat--cours" />
                    : <span className="fen__etat"><DaIcon name="check" /></span>}
                </li>
              ))}
            </ul>
            <div className="fen__apercu">
              <div className="pg pg--dark">
                <div className="pg__img" style={{ backgroundImage: "url(/da/site-lumen.jpg)" }} />
                <div className="pg__nav"><b>◐ Lumen</b><span>Offre</span><span>Méthode</span><span>Avis</span><em>Réserver</em></div>
                <div className="pg__t">
                  <h3>Lance ton offre<br /><i>en dix jours.</i></h3>
                  <p>De l&apos;idée à la page qui vend, sans repartir de zéro.</p>
                  <span className="pg__bt">Commencer</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="tel">
          <i className="bt g1" /><i className="bt g2" /><i className="bt g3" /><i className="bt d1" />
          <div className="ecran">
            <svg className="fond" viewBox="0 0 256 536" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
              <defs>
                <radialGradient id="w-a" cx=".5" cy=".5" r=".5"><stop offset="0" stopColor="#B9F5CF" /><stop offset=".35" stopColor="#22D96E" /><stop offset="1" stopColor="#0E8A43" stopOpacity="0" /></radialGradient>
                <linearGradient id="w-ruban" x1="0" y1="0" x2="1" y2=".3"><stop offset="0" stopColor="#0E8A43" stopOpacity="0" /><stop offset=".35" stopColor="#22D96E" /><stop offset=".62" stopColor="#B9F5CF" /><stop offset="1" stopColor="#22D96E" stopOpacity=".2" /></linearGradient>
                <linearGradient id="w-ombre" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#010A05" stopOpacity="0" /><stop offset="1" stopColor="#010A05" stopOpacity=".9" /></linearGradient>
                <filter id="w-f1" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="26" /></filter>
                <filter id="w-f2" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="5" /></filter>
                <filter id="w-f3" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="1.2" /></filter>
              </defs>
              <rect width="256" height="536" fill="#021A0B" />
              <ellipse cx="190" cy="250" rx="150" ry="120" fill="url(#w-a)" filter="url(#w-f1)" opacity=".75" />
              <ellipse cx="40" cy="110" rx="110" ry="70" fill="#0E8A43" filter="url(#w-f1)" opacity=".55" />
              <path d="M-40 360C30 250 120 210 300 200L300 250C150 262 70 300 -10 420Z" fill="url(#w-ruban)" filter="url(#w-f2)" opacity=".85" />
              <path d="M-30 330C40 232 130 190 300 176L300 186C140 202 52 246 -20 340Z" fill="#E6FFEF" filter="url(#w-f3)" opacity=".55" />
              <path d="M-40 470C60 380 170 350 300 352L300 420C180 410 80 440 -40 540Z" fill="#0E8A43" filter="url(#w-f2)" opacity=".5" />
              <rect y="330" width="256" height="206" fill="url(#w-ombre)" />
            </svg>
            <div className="ile" />
            <div className="etat">
              <span>9:41</span>
              <div>
                <svg viewBox="0 0 18 11"><rect x="0" y="7" width="3" height="4" rx="1" /><rect x="5" y="5" width="3" height="6" rx="1" /><rect x="10" y="2.5" width="3" height="8.5" rx="1" /><rect x="15" y="0" width="3" height="11" rx="1" /></svg>
                <svg viewBox="0 0 26 12"><rect x=".5" y=".5" width="22" height="11" rx="3.5" fill="none" stroke="#fff" strokeOpacity=".5" /><rect x="2.5" y="2.5" width="16" height="7" rx="2" /><rect x="24" y="4" width="1.6" height="4" rx=".8" fillOpacity=".5" /></svg>
              </div>
            </div>
            <div className="date">mardi 22 octobre</div>
            <div className="heure">9:41</div>
            <div className="notifs">
              <div className="grp">
                <div className="ntf" style={{ "--d": ".4s" } as CSSProperties}>
                  <span className="app"><img src="/da/logos/stripe-blanc.svg" alt="" width={21} height={21} /></span>
                  <div><header>Stripe<span>maintenant</span></header><p>Paiement reçu : 1&nbsp;500,00&nbsp;€<small>de Camille Roux</small></p></div>
                </div>
                <i className="pile p1" /><i className="pile p2" />
              </div>
              <div className="grp">
                <div className="ntf" style={{ "--d": ".9s" } as CSSProperties}>
                  <span className="app app--mail"><img src="/da/logos/gmail.svg" alt="" width={24} height={24} /></span>
                  <div><header>Gmail<span>il y a 2 min</span></header><p>Camille Roux<small>Parfait, on démarre quand ?</small></p></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
