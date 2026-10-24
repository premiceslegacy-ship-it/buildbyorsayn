/**
 * Verre liquide : le script commun de l'écosystème (apple-ux-ui-type-color-materials/assets/verre-liquide.js),
 * porté à l'identique pour un élément React. Ce n'est pas un verre dépoli : le fond est réfracté sur le pourtour
 * (carte de déplacement SVG calculée à la taille exacte de l'élément), le rouge et le bleu ne dévient pas pareil
 * (dispersion), une arête lumineuse en haut à gauche et une plus faible en bas à droite.
 *
 * Chromium applique la réfraction. Ailleurs (Safari, Firefox), le filtre de déplacement n'existe pas sur le fond :
 * il reste la lumière calculée et un flou léger, comme dans le script d'origine.
 * La forme vient de `border-radius` ; l'élément ne porte ni ombre ni bordure, le verre tient par sa réfraction.
 */
export type LiquidGlassOptions = {
  /** Largeur du bord bombé, part du petit côté. */
  bord?: number;
  /** Déviation du fond sur le bord. */
  force?: number;
  /** Flou du fond, en pixels (au-delà de 4, on retombe dans le verre dépoli). */
  flou?: number;
  /** Liseré coloré : 0 pour l'enlever. */
  dispersion?: number;
  /** Intensité des arêtes lumineuses. */
  reflet?: number;
  /** D'où vient la lumière, en degrés : 0 du haut, -37 du haut à gauche. */
  angle?: number;
  /** Teinte du verre ; sur fond sombre : rgba(0,0,0,.18). */
  teinte?: string;
};

const NS = "http://www.w3.org/2000/svg";
let counter = 0;

function isChromium() {
  return /Chrome\/|Chromium\//.test(navigator.userAgent);
}

function render(el: HTMLElement, opts: LiquidGlassOptions, previous: SVGSVGElement | null): SVGSVGElement | null {
  const w = Math.round(el.offsetWidth);
  const h = Math.round(el.offsetHeight);
  if (w < 8 || h < 8) return previous;
  const cs = getComputedStyle(el);
  const rad = Math.min(parseFloat(cs.borderTopLeftRadius) || 0, w / 2, h / 2);
  const petit = Math.min(w, h);
  const b = Math.min(Math.max(petit * (opts.bord ?? (petit <= 80 ? 0.34 : 0.12)), 12), petit / 2);
  const R2 = Math.min(Math.max(rad, b * 1.08), petit / 2); // rayon de calcul au moins égal au bord : normale continue dans les angles
  const force = opts.force ?? (petit <= 80 ? 1.5 : 1);
  const flou = opts.flou ?? 1.2;
  const disp = opts.dispersion ?? 1;
  const reflet = opts.reflet ?? 1;
  const ang = ((opts.angle ?? -37) * Math.PI) / 180;
  const lx = -Math.sin(ang);
  const ly = Math.cos(ang);

  const c = document.createElement("canvas");
  const s = document.createElement("canvas");
  c.width = s.width = w;
  c.height = s.height = h;
  const cx = c.getContext("2d");
  const sx = s.getContext("2d");
  if (!cx || !sx) return previous;
  const im = cx.createImageData(w, h);
  const sp = sx.createImageData(w, h);
  const d = im.data;
  const e = sp.data;

  for (let Y = 0; Y < h; Y++) {
    for (let X = 0; X < w; X++) {
      const px = X + 0.5 - w / 2;
      const py = Y + 0.5 - h / 2;
      const k = (Y * w + X) * 4;
      const qx = Math.abs(px) - (w / 2 - R2);
      const qy = Math.abs(py) - (h / 2 - R2);
      let nx = 0;
      let ny = 0;
      const dist = -(Math.hypot(Math.max(qx, 0), Math.max(qy, 0)) + Math.min(Math.max(qx, qy), 0) - R2); // distance au bord, vers l'intérieur
      if (qx > 0 && qy > 0) {
        const l = Math.hypot(qx, qy) || 1;
        nx = ((px < 0 ? -1 : 1) * qx) / l;
        ny = ((py < 0 ? -1 : 1) * qy) / l;
      } else if (qx > qy) nx = px < 0 ? -1 : 1;
      else ny = py < 0 ? -1 : 1;
      const u = Math.max(0, Math.min(1, 1 - dist / b));
      const m = 1 - Math.sqrt(1 - u * u); // bord en quart de cercle : la déviation suit la pente du verre
      d[k] = 128 - 127 * nx * m;
      d[k + 1] = 128 - 127 * ny * m;
      d[k + 2] = 128;
      d[k + 3] = 255;

      // Reflets : vraie distance à l'arête de l'élément (rayon réel), pour un filet d'un pixel et demi.
      const ax = Math.abs(px) - (w / 2 - rad);
      const ay = Math.abs(py) - (h / 2 - rad);
      const da = -(Math.hypot(Math.max(ax, 0), Math.max(ay, 0)) + Math.min(Math.max(ax, ay), 0) - rad);
      let mx = 0;
      let my = 0;
      if (ax > 0 && ay > 0) {
        const l2 = Math.hypot(ax, ay) || 1;
        mx = ((px < 0 ? -1 : 1) * ax) / l2;
        my = ((py < 0 ? -1 : 1) * ay) / l2;
      } else if (ax > ay) mx = px < 0 ? -1 : 1;
      else my = py < 0 ? -1 : 1;
      const lum = -(mx * lx + my * ly);
      const haut = Math.max(lum, 0);
      const bas = Math.max(-lum, 0);
      const dd = Math.max(da, 0);
      const arete = Math.exp(-dd / 1.3);
      const nappe = Math.exp(-dd / (b * 0.42));
      let clair = arete * (0.3 + 0.7 * Math.pow(haut, 1.5) + 0.62 * Math.pow(bas, 2));
      clair += nappe * 0.16 * Math.pow(haut, 1.2) + nappe * 0.1 * Math.pow(bas, 2.2) + Math.exp(-Math.pow(dd - b * 0.62, 2) / (2 * Math.pow(b * 0.2, 2))) * 0.03;
      const v = clair * reflet;
      e[k] = e[k + 1] = e[k + 2] = 255;
      e[k + 3] = Math.min(255, 255 * v);
    }
  }
  cx.putImageData(im, 0, 0);
  sx.putImageData(sp, 0, 0);

  const id = `vliq-${++counter}-${Math.random().toString(36).slice(2, 7)}`;
  const diag = Math.sqrt((w * w + h * h) / 2);
  const sc = (b * 1.15 * force) / diag;
  const passe = (k2: number, mat: string, res: string) =>
    `<feDisplacementMap in="b" in2="map" scale="${(sc * k2).toFixed(4)}" xChannelSelector="R" yChannelSelector="G"/><feColorMatrix type="matrix" values="${mat}" result="${res}"/>`;
  let corps = `<feImage href="${c.toDataURL()}" x="0" y="0" width="1" height="1" preserveAspectRatio="none" result="map"/><feGaussianBlur in="SourceGraphic" stdDeviation="${(flou / w).toFixed(5)} ${(flou / h).toFixed(5)}" result="b"/>`;
  corps += disp > 0
    ? passe(1 + 0.07 * disp, "1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0", "r")
      + passe(1, "0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0", "g")
      + passe(1 - 0.07 * disp, "0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0", "bl")
      + '<feComposite in="r" in2="g" operator="arithmetic" k2="1" k3="1" result="rg"/><feComposite in="rg" in2="bl" operator="arithmetic" k2="1" k3="1"/>'
    : `<feDisplacementMap in="b" in2="map" scale="${sc.toFixed(4)}" xChannelSelector="R" yChannelSelector="G"/>`;

  previous?.remove();
  let svg: SVGSVGElement | null = document.createElementNS(NS, "svg");
  svg.setAttribute("style", "position:absolute;width:0;height:0;pointer-events:none");
  svg.setAttribute("aria-hidden", "true");
  svg.innerHTML = `<filter id="${id}" color-interpolation-filters="sRGB" primitiveUnits="objectBoundingBox" x="0" y="0" width="1" height="1">${corps}</filter>`;
  document.body.appendChild(svg);

  let filter = `url(#${id}) saturate(1.35) brightness(1.06)`;
  if (!isChromium()) {
    // Hors Chromium, le filtre de déplacement n'existe pas sur le fond : on garde la lumière et un flou léger.
    filter = `blur(${Math.max(6, Math.round(petit * 0.16))}px) saturate(1.6) brightness(1.08)`;
    svg.remove();
    svg = null;
  }
  el.style.backdropFilter = filter;
  el.style.setProperty("-webkit-backdrop-filter", filter);
  el.style.backgroundImage = `url(${s.toDataURL()})`;
  el.style.backgroundSize = "100% 100%";
  el.style.backgroundRepeat = "no-repeat";
  el.style.backgroundColor = opts.teinte ?? "rgba(255,255,255,.05)";
  el.style.boxShadow = "none";
  el.style.border = "0";
  return svg;
}

/** Applique le verre liquide à un élément et le recalcule quand sa taille change. Retourne le nettoyage. */
export function applyLiquidGlass(el: HTMLElement, opts: LiquidGlassOptions = {}): () => void {
  let svg: SVGSVGElement | null = null;
  let frame = 0;
  const run = () => {
    frame = 0;
    svg = render(el, opts, svg);
  };
  const schedule = () => {
    if (!frame) frame = requestAnimationFrame(run);
  };
  const observer = new ResizeObserver(schedule);
  observer.observe(el);
  schedule();
  return () => {
    observer.disconnect();
    if (frame) cancelAnimationFrame(frame);
    svg?.remove();
    for (const property of ["backdropFilter", "backgroundImage", "backgroundSize", "backgroundRepeat", "backgroundColor", "boxShadow", "border"] as const) el.style[property] = "";
    el.style.removeProperty("-webkit-backdrop-filter");
  };
}
