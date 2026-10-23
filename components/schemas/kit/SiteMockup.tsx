import { ArrowRight, Check, ChevronDown, ChevronLeft, ChevronRight, Lock, Plus, Rocket, Share, ShieldCheck, Sparkles, Star, Upload, X, Zap } from "lucide-react";
import type { CSSProperties, ReactNode } from "react";
import { KitFrame, SITE_DESIGN_DISCLAIMER } from "./KitFrame";
import type { KitBaseProps } from "./types";
import styles from "./site.module.css";

/* ---------------------------------------------------------------------------------------------
   SiteMockup : une vraie page web, dessinée en HTML, avec des pastilles numérotées et, pour chaque
   pastille, un rôle, la raison du choix et une autre option. `quality: "slop"` reproduit fidèlement
   les gabarits générés par IA, `premium` applique les règles de la maison (air, une action, preuve).
   --------------------------------------------------------------------------------------------- */

export type SiteTheme = {
  bg: string;
  ink: string;
  muted: string;
  accent: string;
  accentInk: string;
  card: string;
  line: string;
  serif?: boolean;
};

export const SITE_THEMES = {
  chaux: { bg: "#ffffff", ink: "#1d1d1f", muted: "#6e6e73", accent: "#b4532a", accentInk: "#ffffff", card: "#f5f5f7", line: "rgba(29,29,31,.14)" },
  bois: { bg: "#ffffff", ink: "#1d1d1f", muted: "#6e6e73", accent: "#7a4a21", accentInk: "#ffffff", card: "#f5f5f7", line: "rgba(29,29,31,.14)" },
  sauge: { bg: "#ffffff", ink: "#1d1d1f", muted: "#6e6e73", accent: "#2f6b4f", accentInk: "#ffffff", card: "#f5f5f7", line: "rgba(29,29,31,.14)" },
  encre: { bg: "#ffffff", ink: "#1d1d1f", muted: "#6e6e73", accent: "#0066cc", accentInk: "#ffffff", card: "#f5f5f7", line: "rgba(29,29,31,.12)" },
  nuit: { bg: "#0d100e", ink: "#f3f1ea", muted: "#a2aaa4", accent: "#22d96e", accentInk: "#04120a", card: "#171b18", line: "rgba(243,241,234,.14)" },
  braise: { bg: "#17110d", ink: "#f6ece1", muted: "#b6a595", accent: "#e8a15a", accentInk: "#1a0f06", card: "#241a13", line: "rgba(246,236,225,.14)" },
  slopNuit: { bg: "#0b0820", ink: "#ffffff", muted: "#a9a6c9", accent: "#7c5cff", accentInk: "#ffffff", card: "#161237", line: "rgba(255,255,255,.12)" },
  slopClair: { bg: "#f7f7ff", ink: "#16163a", muted: "#6b6b8f", accent: "#6d4aff", accentInk: "#ffffff", card: "#ffffff", line: "rgba(22,22,58,.1)" },
} as const satisfies Record<string, SiteTheme>;

export type SiteThemeName = keyof typeof SITE_THEMES;

export type SiteSlot =
  | "section" | "nav" | "eyebrow" | "title" | "text" | "cta" | "cta2" | "note" | "image" | "screen"
  | "quote" | "figures" | "logos" | "plans" | "badge" | "steps" | "items" | "fields" | "faq";

/** Pastilles d'une section : emplacement vers numéro de pastille. */
export type SitePins = Partial<Record<SiteSlot, number>>;

export type SiteScreen = {
  title: string;
  rows: readonly { left: string; right?: string; state?: "ok" | "warn" | "todo" }[];
  footer?: string;
};

export type SiteNav = { brand: string; links?: readonly string[]; cta?: string; overlay?: boolean; pins?: SitePins };

export type SiteSection =
  | {
    kind: "hero";
    variant: "editorial" | "split" | "product" | "centered";
    eyebrow?: string;
    title: string;
    /** Mot du titre mis en valeur (couleur de marque en premium, dégradé en slop). */
    accent?: string;
    text?: string;
    cta: string;
    cta2?: string;
    note?: string;
    /** Chemin d'une photo, ou « orbs » pour la tache floue des gabarits IA. */
    image?: string;
    imageAlt?: string;
    caption?: string;
    screen?: SiteScreen;
    glow?: boolean;
    pins?: SitePins;
  }
  | {
    kind: "story";
    title: string;
    text: string;
    image: string;
    imageAlt?: string;
    reverse?: boolean;
    cta?: string;
    pins?: SitePins;
  }
  | {
    kind: "proof";
    title?: string;
    quote?: { text: string; author: string; role?: string; stars?: boolean };
    figures?: readonly { value: string; label: string; source?: string }[];
    logos?: readonly string[];
    pins?: SitePins;
  }
  | {
    kind: "cards";
    eyebrow?: string;
    title: string;
    text?: string;
    items: readonly { title: string; text: string; icon?: "zap" | "shield" | "sparkles" | "rocket" }[];
    pins?: SitePins;
  }
  | {
    kind: "gallery";
    title: string;
    images: readonly { src: string; caption: string; alt?: string }[];
    pins?: SitePins;
  }
  | {
    kind: "steps";
    eyebrow?: string;
    title: string;
    numbered?: boolean;
    steps: readonly { title: string; text: string; image?: string; screen?: SiteScreen }[];
    pins?: SitePins;
  }
  | {
    kind: "offer";
    title: string;
    text?: string;
    plans: readonly { name: string; price: string; detail?: string; points?: readonly string[]; featured?: boolean; badge?: string; cta?: string }[];
    note?: string;
    pins?: SitePins;
  }
  | {
    kind: "faq";
    title: string;
    items: readonly { q: string; a?: string }[];
    pins?: SitePins;
  }
  | {
    kind: "form";
    title: string;
    text?: string;
    fields: readonly { label: string; value?: string; kind?: "text" | "file" | "select" | "area" }[];
    button: string;
    note?: string;
    pins?: SitePins;
  }
  | {
    kind: "footer";
    brand: string;
    line?: string;
    links?: readonly string[];
    legal?: string;
    columns?: readonly { title: string; links: readonly string[] }[];
    pins?: SitePins;
  };

export type SiteSpec = {
  url: string;
  theme?: SiteThemeName | SiteTheme;
  nav?: SiteNav;
  sections: readonly SiteSection[];
};

export type SiteNote = {
  pin: number;
  /** Rôle de l'élément (2 à 5 mots). */
  role: string;
  /** Pourquoi il est dessiné ainsi. */
  why: string;
  /** Une autre option, ou ce qu'il faut faire à la place. */
  alt?: string;
};

export type SiteMockupProps = KitBaseProps & {
  quality: "premium" | "slop";
  site: SiteSpec;
  notes: readonly SiteNote[];
};

type Quality = "premium" | "slop";
type Mode = "gutter" | "corner" | "inside";

const SLOT_MODE: Record<SiteSlot, Mode> = {
  section: "gutter", nav: "gutter", eyebrow: "corner", title: "gutter", text: "gutter", cta: "corner", cta2: "corner", note: "gutter",
  image: "inside", screen: "inside", quote: "gutter", figures: "gutter", logos: "gutter", plans: "gutter", badge: "corner",
  steps: "gutter", items: "gutter", fields: "gutter", faq: "gutter",
};

function Pin({ n, q }: { n: number; q: Quality }) {
  return <span className={styles.pin} data-quality={q} aria-hidden="true">{n}</span>;
}

/** Entoure un élément et lui accroche sa pastille (gouttière, coin ou intérieur d'une image). */
function Pinned({ pins, slot, q, className, children }: { pins?: SitePins; slot: SiteSlot; q: Quality; className?: string; children: ReactNode }) {
  const n = pins?.[slot];
  const mode = SLOT_MODE[slot];
  if (n === undefined) return <>{children}</>;
  return <div className={`${styles.pinned} ${styles[`pin_${mode}`]} ${className ?? ""}`}>{children}<Pin n={n} q={q} /></div>;
}

function themeOf(spec: SiteSpec, quality: Quality): SiteTheme {
  const t = spec.theme ?? (quality === "slop" ? "slopNuit" : "chaux");
  return typeof t === "string" ? SITE_THEMES[t] : t;
}

type ThemeStyle = CSSProperties & Record<`--${string}`, string>;

function isDark(hex: string): boolean {
  const n = Number.parseInt(hex.slice(1), 16);
  return ((n >> 16) & 255) * 0.299 + ((n >> 8) & 255) * 0.587 + (n & 255) * 0.114 < 110;
}

function themeStyle(t: SiteTheme): ThemeStyle {
  return {
    "--s-bg": t.bg, "--s-ink": t.ink, "--s-muted": t.muted, "--s-accent": t.accent, "--s-accent-ink": t.accentInk,
    "--s-card": t.card, "--s-line": t.line, "--s-surface": isDark(t.bg) ? t.card : "#ffffff",
    "--s-display": t.serif ? "\"Iowan Old Style\", \"Palatino Linotype\", Palatino, Georgia, serif" : "-apple-system, \"SF Pro Display\", \"Inter\", system-ui, sans-serif",
  };
}

function Title({ text, accent, q }: { text: string; accent?: string; q: Quality }) {
  if (!accent || !text.includes(accent)) return <>{text}</>;
  const [before, ...rest] = text.split(accent);
  return <>{before}<em className={q === "slop" ? styles.gradientWord : styles.accentWord}>{accent}</em>{rest.join(accent)}</>;
}

function Photo({ src, alt, className }: { src: string; alt?: string; className?: string }) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img className={className} src={src} alt={alt ?? ""} loading="lazy" draggable={false} />;
}

function Screen({ screen }: { screen: SiteScreen }) {
  return <div className={styles.screen}>
    <div className={styles.screenBar}><i /><i /><i /><span>{screen.title}</span></div>
    <ul>{screen.rows.map((row) => <li key={row.left}>
      <span className={styles.screenDot} data-state={row.state ?? "todo"} />
      <b>{row.left}</b>
      {row.right ? <span>{row.right}</span> : null}
    </li>)}</ul>
    {screen.footer ? <p>{screen.footer}</p> : null}
  </div>;
}

function Orbs() {
  return <div className={styles.orbs} aria-hidden="true"><i /><i /><i /></div>;
}

const ICONS = { zap: Zap, shield: ShieldCheck, sparkles: Sparkles, rocket: Rocket } as const;

function Nav({ nav, q }: { nav: SiteNav; q: Quality }) {
  return <Pinned pins={nav.pins} slot="nav" q={q}>
    <nav className={styles.nav} data-overlay={nav.overlay ? "" : undefined}>
      <strong>{nav.brand}</strong>
      {nav.links?.length ? <ul>{nav.links.map((link) => <li key={link}>{link}</li>)}</ul> : null}
      {nav.cta ? <span className={styles.navCta}>{nav.cta}</span> : <span className={styles.navBurger} aria-hidden="true"><i /><i /></span>}
    </nav>
  </Pinned>;
}

function Cta({ pins, q, children, secondary }: { pins?: SitePins; q: Quality; children: ReactNode; secondary?: boolean }) {
  return <Pinned pins={pins} slot={secondary ? "cta2" : "cta"} q={q}>
    <span className={secondary ? styles.ctaSecondary : styles.cta}>{children}{secondary ? (q === "slop" ? null : <ChevronRight aria-hidden="true" />) : q === "slop" ? <ArrowRight aria-hidden="true" /> : null}</span>
  </Pinned>;
}

function Hero({ s, q }: { s: Extract<SiteSection, { kind: "hero" }>; q: Quality }) {
  const p = s.pins;
  const copy = <div className={styles.heroCopy}>
    {s.eyebrow ? <Pinned pins={p} slot="eyebrow" q={q}><span className={q === "slop" ? styles.pill : styles.eyebrow}>{s.eyebrow}</span></Pinned> : null}
    <Pinned pins={p} slot="title" q={q}><h4 className={styles.heroTitle}><Title text={s.title} accent={s.accent} q={q} /></h4></Pinned>
    {s.text ? <Pinned pins={p} slot="text" q={q}><p className={styles.heroText}>{s.text}</p></Pinned> : null}
    <div className={styles.ctaRow}>
      <Cta pins={p} q={q}>{s.cta}</Cta>
      {s.cta2 ? <Cta pins={p} q={q} secondary>{s.cta2}</Cta> : null}
    </div>
    {s.note ? <Pinned pins={p} slot="note" q={q}><small className={styles.heroNote}>{s.note}</small></Pinned> : null}
  </div>;
  const visual = s.screen
    ? <Pinned pins={p} slot="screen" q={q}><Screen screen={s.screen} /></Pinned>
    : s.image === "orbs"
      ? <Pinned pins={p} slot="image" q={q}><Orbs /></Pinned>
      : s.image
        ? <Pinned pins={p} slot="image" q={q}><div className={styles.heroFigure}><Photo src={s.image} alt={s.imageAlt} />{s.caption ? <span className={styles.heroCaption}>{s.caption}</span> : null}</div></Pinned>
        : null;

  if (s.variant === "editorial") {
    return <header className={styles.heroEditorial}>
      {s.image && s.image !== "orbs" ? <Photo className={styles.heroBackdrop} src={s.image} alt={s.imageAlt} /> : null}
      <div className={styles.heroScrim} />
      {p?.image !== undefined ? <Pin n={p.image} q={q} /> : null}
      {copy}
    </header>;
  }
  if (s.variant === "split") {
    return <header className={`${styles.hero} ${styles.heroSplit}`}>{copy}{visual}</header>;
  }
  if (s.variant === "product") {
    return <header className={`${styles.hero} ${styles.heroProduct}`}>{copy}{visual}</header>;
  }
  return <header className={`${styles.hero} ${styles.heroCentered}`} data-glow={s.glow ? "" : undefined}>
    {s.glow ? <Orbs /> : null}
    {copy}
    {visual && s.image !== "orbs" ? visual : null}
  </header>;
}

function Section({ s, q }: { s: SiteSection; q: Quality }) {
  switch (s.kind) {
    case "hero":
      return <Hero s={s} q={q} />;
    case "story": {
      const p = s.pins;
      return <section className={styles.block} data-reverse={s.reverse ? "" : undefined}>
        <div className={styles.storyGrid}>
          <div className={styles.storyCopy}>
            <Pinned pins={p} slot="title" q={q}><h4 className={styles.h2}>{s.title}</h4></Pinned>
            <Pinned pins={p} slot="text" q={q}><p className={styles.lead}>{s.text}</p></Pinned>
            {s.cta ? <Cta pins={p} q={q}>{s.cta}</Cta> : null}
          </div>
          <Pinned pins={p} slot="image" q={q}><div className={styles.storyFigure}><Photo src={s.image} alt={s.imageAlt} /></div></Pinned>
        </div>
      </section>;
    }
    case "proof": {
      const p = s.pins;
      return <section className={styles.block} data-band>
        {s.title ? <Pinned pins={p} slot="title" q={q}><h4 className={styles.h3}>{s.title}</h4></Pinned> : null}
        {s.quote ? <Pinned pins={p} slot="quote" q={q}>
          <blockquote className={q === "slop" ? styles.quoteSlop : styles.quote}>
            {s.quote.stars ? <span className={styles.stars} aria-hidden="true">{[0, 1, 2, 3, 4].map((i) => <Star key={i} />)}</span> : null}
            <p>{s.quote.text}</p>
            <footer>{s.quote.stars ? <span className={styles.avatar} aria-hidden="true">{s.quote.author.slice(0, 1)}</span> : null}<span><b>{s.quote.author}</b>{s.quote.role ? <small>{s.quote.role}</small> : null}</span></footer>
          </blockquote>
        </Pinned> : null}
        {s.figures?.length ? <Pinned pins={p} slot="figures" q={q}><dl className={styles.figures}>{s.figures.map((f) => <div key={f.label}><dt>{f.value}</dt><dd>{f.label}{f.source ? <small>{f.source}</small> : null}</dd></div>)}</dl></Pinned> : null}
        {s.logos?.length ? <Pinned pins={p} slot="logos" q={q}><ul className={styles.logos}>{s.logos.map((l) => <li key={l}>{l}</li>)}</ul></Pinned> : null}
      </section>;
    }
    case "cards": {
      const p = s.pins;
      return <section className={styles.block} data-center>
        {s.eyebrow ? <span className={q === "slop" ? styles.pill : styles.eyebrow}>{s.eyebrow}</span> : null}
        <Pinned pins={p} slot="title" q={q}><h4 className={styles.h2}>{s.title}</h4></Pinned>
        {s.text ? <p className={styles.lead}>{s.text}</p> : null}
        <Pinned pins={p} slot="items" q={q}>
          <ul className={styles.cards}>{s.items.map((item) => {
            const Icon = ICONS[item.icon ?? "sparkles"];
            return <li key={item.title}><span className={styles.cardIcon}><Icon aria-hidden="true" /></span><b>{item.title}</b><p>{item.text}</p></li>;
          })}</ul>
        </Pinned>
      </section>;
    }
    case "gallery": {
      const p = s.pins;
      return <section className={styles.block}>
        <Pinned pins={p} slot="title" q={q}><h4 className={styles.h2}>{s.title}</h4></Pinned>
        <Pinned pins={p} slot="image" q={q}><ul className={styles.gallery}>{s.images.map((image) => <li key={image.src}><Photo src={image.src} alt={image.alt} /><span>{image.caption}</span></li>)}</ul></Pinned>
      </section>;
    }
    case "steps": {
      const p = s.pins;
      return <section className={styles.block}>
        {s.eyebrow ? <span className={q === "slop" ? styles.pill : styles.eyebrow}>{s.eyebrow}</span> : null}
        <Pinned pins={p} slot="title" q={q}><h4 className={styles.h2}>{s.title}</h4></Pinned>
        <Pinned pins={p} slot="steps" q={q}>
          <ol className={styles.steps} data-numbered={s.numbered ? "" : undefined}>{s.steps.map((step, i) => <li key={step.title}>
            {step.image ? <Photo src={step.image} alt="" /> : step.screen ? <Screen screen={step.screen} /> : null}
            <div>{s.numbered ? <span className={styles.stepNo}>{String(i + 1).padStart(2, "0")}</span> : null}<b>{step.title}</b><p>{step.text}</p></div>
          </li>)}</ol>
        </Pinned>
      </section>;
    }
    case "offer": {
      const p = s.pins;
      return <section className={styles.block}>
        <Pinned pins={p} slot="title" q={q}><h4 className={styles.h2}>{s.title}</h4></Pinned>
        {s.text ? <p className={styles.lead}>{s.text}</p> : null}
        <Pinned pins={p} slot="plans" q={q}>
          <ul className={styles.plans}>{s.plans.map((plan) => <li key={plan.name} data-featured={plan.featured ? "" : undefined}>
            {plan.badge ? <span className={styles.badge}>{plan.badge}</span> : null}
            <b>{plan.name}</b>
            <strong>{plan.price}</strong>
            {plan.detail ? <p>{plan.detail}</p> : null}
            {plan.points?.length ? <ul>{plan.points.map((point) => <li key={point}><Check aria-hidden="true" />{point}</li>)}</ul> : null}
            {plan.cta ? <span className={plan.featured ? styles.cta : styles.ctaSecondary}>{plan.cta}</span> : null}
          </li>)}</ul>
        </Pinned>
        {s.note ? <small className={styles.noteLine}>{s.note}</small> : null}
      </section>;
    }
    case "faq": {
      const p = s.pins;
      return <section className={styles.block}>
        <Pinned pins={p} slot="title" q={q}><h4 className={styles.h2}>{s.title}</h4></Pinned>
        <Pinned pins={p} slot="faq" q={q}>
          <ul className={styles.faq}>{s.items.map((item) => <li key={item.q} data-open={item.a ? "" : undefined}>
            <div><b>{item.q}</b>{item.a ? <ChevronDown aria-hidden="true" /> : <Plus aria-hidden="true" />}</div>
            {item.a ? <p>{item.a}</p> : null}
          </li>)}</ul>
        </Pinned>
      </section>;
    }
    case "form": {
      const p = s.pins;
      return <section className={styles.block}>
        <Pinned pins={p} slot="title" q={q}><h4 className={styles.h2}>{s.title}</h4></Pinned>
        {s.text ? <Pinned pins={p} slot="text" q={q}><p className={styles.lead}>{s.text}</p></Pinned> : null}
        <Pinned pins={p} slot="fields" q={q}>
          <div className={styles.form}>{s.fields.map((field) => <div key={field.label} data-kind={field.kind ?? "text"}>
            <small>{field.label}</small>
            <span>{field.kind === "file" ? <Upload aria-hidden="true" /> : null}{field.value ?? ""}{field.kind === "select" ? <ChevronDown aria-hidden="true" /> : null}</span>
          </div>)}</div>
        </Pinned>
        <Cta pins={p} q={q}>{s.button}</Cta>
        {s.note ? <Pinned pins={p} slot="note" q={q}><small className={styles.noteLine}>{s.note}</small></Pinned> : null}
      </section>;
    }
    case "footer": {
      const p = s.pins;
      return <footer className={styles.footer}>
        <Pinned pins={p} slot="section" q={q}>
          <div className={styles.footerTop}>
            <div><strong>{s.brand}</strong>{s.line ? <p>{s.line}</p> : null}</div>
            {s.columns?.length
              ? <div className={styles.footerCols}>{s.columns.map((c) => <ul key={c.title}><li><b>{c.title}</b></li>{c.links.map((l) => <li key={l}>{l}</li>)}</ul>)}</div>
              : s.links?.length ? <ul className={styles.footerLinks}>{s.links.map((l) => <li key={l}>{l}</li>)}</ul> : null}
          </div>
        </Pinned>
        {s.legal ? <small>{s.legal}</small> : null}
      </footer>;
    }
  }
}

export function SiteWindow({ site, quality }: { site: SiteSpec; quality: Quality }) {
  const theme = themeOf(site, quality);
  const nav = site.nav;
  return <div className={styles.window} data-quality={quality}>
    <div className={styles.chrome}>
      <span className={styles.lights} aria-hidden="true"><i /><i /><i /></span>
      <span className={styles.chromeNav} aria-hidden="true"><ChevronLeft /><ChevronRight /></span>
      <span className={styles.address}><Lock aria-hidden="true" />{site.url}</span>
      <span className={styles.chromeNav} aria-hidden="true"><Share /></span>
    </div>
    <div className={styles.page} style={themeStyle(theme)} data-quality={quality} data-serif={theme.serif ? "" : undefined}>
      {nav ? <Nav nav={nav} q={quality} /> : null}
      {site.sections.map((section, i) => <Section key={`${section.kind}-${i}`} s={section} q={quality} />)}
    </div>
  </div>;
}

export function SiteNotes({ notes, quality }: { notes: readonly SiteNote[]; quality: Quality }) {
  return <ol className={styles.notes} data-quality={quality}>
    {notes.map((note) => <li key={note.pin}>
      <span className={styles.noteNo} data-quality={quality}>{note.pin}</span>
      <div>
        <h5>{note.role}</h5>
        <p><b>{quality === "slop" ? "Pourquoi ça se voit" : "Pourquoi ainsi"}</b>{note.why}</p>
        {note.alt ? <p><b>{quality === "slop" ? "À la place" : "Autre choix"}</b>{note.alt}</p> : null}
      </div>
    </li>)}
  </ol>;
}

const KEYS_PREMIUM = { swatch: "accent", label: "Chaque pastille renvoie à une décision de design" } as const;
const KEYS_SLOP = { swatch: "accent", label: "Chaque pastille renvoie à un défaut ou à un choix" } as const;

export function SiteMockup({ quality, site, notes, ...frame }: SiteMockupProps) {
  return <KitFrame {...frame} kind="site-mockup" keys={[quality === "slop" ? KEYS_SLOP : KEYS_PREMIUM]} disclaimer={SITE_DESIGN_DISCLAIMER}>
    <div className={styles.single}>
      <SiteWindow site={site} quality={quality} />
      <SiteNotes notes={notes} quality={quality} />
    </div>
  </KitFrame>;
}

export type SiteCompareProps = KitBaseProps & {
  slopTitle: string;
  premiumTitle: string;
  slop: SiteSpec;
  premium: SiteSpec;
  slopNotes: readonly SiteNote[];
  premiumNotes: readonly SiteNote[];
};

export function SiteCompare({ slopTitle, premiumTitle, slop, premium, slopNotes, premiumNotes, ...frame }: SiteCompareProps) {
  return <KitFrame {...frame} kind="site-compare" keys={[{ swatch: "accent", label: "Même entreprise, même message, deux traitements" }]} disclaimer={SITE_DESIGN_DISCLAIMER}>
    <div className={styles.compare}>
      <section><h4 className={styles.sideTitle} data-quality="slop"><X aria-hidden="true" />{slopTitle}</h4><SiteWindow site={slop} quality="slop" /><SiteNotes notes={slopNotes} quality="slop" /></section>
      <section><h4 className={styles.sideTitle} data-quality="premium"><Check aria-hidden="true" />{premiumTitle}</h4><SiteWindow site={premium} quality="premium" /><SiteNotes notes={premiumNotes} quality="premium" /></section>
    </div>
  </KitFrame>;
}
