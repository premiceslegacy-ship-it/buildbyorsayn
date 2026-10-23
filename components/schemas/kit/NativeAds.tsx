import { Check, ChevronLeft, Share } from "lucide-react";
import { KitFrame } from "./KitFrame";
import type { KitBaseProps } from "./types";
import styles from "./native.module.css";

/* ---------------------------------------------------------------------------------------------
   NativeAds : les publicités qui ne ressemblent pas à des publicités. Six formats que la personne
   a l'habitude de lire (article, note de téléphone, réponse de story, message, tableau blanc,
   comparaison à bulles), recréés pour un même métier, avec la raison pour laquelle chacun passe
   et le moment où l'utiliser. La mention « Sponsorisé » reste visible : le format imite un
   contenu, jamais le fait que c'est une publicité.
   --------------------------------------------------------------------------------------------- */

type Base = { name: string; why: string; when: string; sponsor: string };

export type NativeFormat = Base & (
  | { kind: "press"; source: string; headline: string; image: string; caption: string }
  | { kind: "notes"; date: string; title: string; items: readonly { text: string; struck: string }[]; image: string }
  | { kind: "story"; account: string; image: string; question: string; answer: readonly string[] }
  | { kind: "dm"; image: string; from: string; messages: readonly string[] }
  | { kind: "whiteboard"; left: string; right: string; middle: string; caption: string }
  | { kind: "versus"; leftTitle: string; rightTitle: string; bubbles: readonly string[]; image: string; caption: string }
);

export type NativeAdsProps = KitBaseProps & { formats: readonly NativeFormat[] };

function Tag({ children }: { children: string }) {
  return <span className={styles.sponsor}>{children}</span>;
}

function Creative({ f }: { f: NativeFormat }) {
  switch (f.kind) {
    case "press":
      return <div className={styles.press}>
        <header><strong>{f.source}</strong><Tag>{f.sponsor}</Tag></header>
        <h5>{f.headline}</h5>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={f.image} alt="" loading="lazy" draggable={false} />
        <p>{f.caption}</p>
      </div>;
    case "notes":
      return <div className={styles.notes}>
        <div className={styles.notesBar}><span><ChevronLeft aria-hidden="true" />Notes</span><Share aria-hidden="true" /></div>
        <small>{f.date}</small>
        <h5>{f.title}</h5>
        <ul>{f.items.map((item) => <li key={item.text}>
          <span className={styles.tick}><Check aria-hidden="true" /></span>
          <div><b>{item.text}</b><s>{item.struck}</s></div>
        </li>)}</ul>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={f.image} alt="" loading="lazy" draggable={false} />
        <Tag>{f.sponsor}</Tag>
      </div>;
    case "story":
      return <div className={styles.story}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={f.image} alt="" loading="lazy" draggable={false} />
        <div className={styles.storyTop}><span aria-hidden="true">{f.account.charAt(0)}</span><strong>{f.account}</strong><Tag>{f.sponsor}</Tag></div>
        <div className={styles.storyQuestion}><small>Pose-moi une question</small><p>{f.question}</p></div>
        <div className={styles.storyAnswer}>{f.answer.map((line) => <p key={line}>{line}</p>)}</div>
      </div>;
    case "dm":
      return <div className={styles.dm}>
        <div className={styles.dmHead}><Tag>{f.sponsor}</Tag><small>Réponse à ta story</small></div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={f.image} alt="" loading="lazy" draggable={false} />
        <ul>{f.messages.map((m) => <li key={m}>{m}</li>)}</ul>
        <small className={styles.dmFrom}>{f.from}</small>
      </div>;
    case "whiteboard":
      return <div className={styles.board}>
        <div className={styles.boardSurface}>
          <svg viewBox="0 0 200 130" aria-hidden="true"><ellipse cx="72" cy="62" rx="58" ry="50" /><ellipse cx="128" cy="62" rx="58" ry="50" /></svg>
          <p data-pos="l">{f.left}</p>
          <p data-pos="r">{f.right}</p>
          <p data-pos="m">{f.middle}</p>
        </div>
        <div className={styles.boardTray}><span /><span /></div>
        <footer><Tag>{f.sponsor}</Tag><small>{f.caption}</small></footer>
      </div>;
    case "versus":
      return <div className={styles.versus}>
        <div><h5 data-side="l">{f.leftTitle}</h5><ul>{f.bubbles.map((b) => <li key={b}>{b}</li>)}</ul></div>
        <div><h5 data-side="r">{f.rightTitle}</h5>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={f.image} alt="" loading="lazy" draggable={false} />
          <p>{f.caption}</p>
        </div>
        <Tag>{f.sponsor}</Tag>
      </div>;
  }
}

export function NativeAds({ formats, ...frame }: NativeAdsProps) {
  return <KitFrame {...frame} kind="native-ads" keys={[{ swatch: "accent", label: "Même métier, six façons de ne pas ressembler à une publicité" }]}>
    <ul className={styles.grid}>
      {formats.map((f) => <li key={f.name}>
        <figure className={styles.stage} data-kind={f.kind}><Creative f={f} /></figure>
        <div className={styles.caption}>
          <h5>{f.name}</h5>
          <p><b>Pourquoi ça passe</b>{f.why}</p>
          <p><b>Quand l'utiliser</b>{f.when}</p>
        </div>
      </li>)}
    </ul>
  </KitFrame>;
}
