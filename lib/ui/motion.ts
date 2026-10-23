export type SpringCurve = { duration: number; easing: string };

// Même calcul que build-tv.js. Une courbe linéaire échantillonnée garde le rendu
// déterministe et utilisable par Web Animations comme par CSS.
export function spring(durationSeconds: number, bounce: number): SpringCurve {
  const stiffness = ((2 * Math.PI) / durationSeconds) ** 2;
  const damping = (4 * Math.PI * (1 - bounce)) / durationSeconds;
  const step = 1 / 240;
  let position = 0;
  let velocity = 0;
  let elapsed = 0;
  let calm = 0;
  const points: number[] = [];
  while (elapsed < durationSeconds * 4) {
    velocity += (-stiffness * (position - 1) - damping * velocity) * step;
    position += velocity * step;
    elapsed += step;
    points.push(position);
    if (Math.abs(position - 1) < 0.001 && Math.abs(velocity) < 0.01) {
      calm += 1;
      if (calm > 12) break;
    } else calm = 0;
  }
  const sampled = Array.from({ length: 41 }, (_, index) => Number(points[Math.round((index / 40) * (points.length - 1))].toFixed(4)));
  sampled[40] = 1;
  return { duration: Math.round(elapsed * 1000), easing: `linear(${sampled.join(", ")})` };
}

export const APP_SPRINGS = {
  doux: spring(0.5, 0),
  vif: spring(0.5, 0.15),
  rebond: spring(0.5, 0.3),
} as const;

export const MOTION_SPRINGS = {
  doux: { type: "spring", stiffness: 157.9, damping: 25.13, mass: 1 },
  vif: { type: "spring", stiffness: 157.9, damping: 21.36, mass: 1 },
  rebond: { type: "spring", stiffness: 157.9, damping: 17.59, mass: 1 },
} as const;

export const CASCADE_GAP_MS = 60;
export const REDUCED_MOTION_DURATION_MS = 120;

export function installAppMotionTokens(root: HTMLElement = document.documentElement) {
  root.style.setProperty("--sp-doux", APP_SPRINGS.doux.easing);
  root.style.setProperty("--sp-doux-d", `${APP_SPRINGS.doux.duration}ms`);
  root.style.setProperty("--sp-vif", APP_SPRINGS.vif.easing);
  root.style.setProperty("--sp-vif-d", `${APP_SPRINGS.vif.duration}ms`);
  root.style.setProperty("--sp-rebond", APP_SPRINGS.rebond.easing);
  root.style.setProperty("--sp-rebond-d", `${APP_SPRINGS.rebond.duration}ms`);
}

export function motionAllowed() {
  return typeof window !== "undefined" && !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function animateAppElement(element: Element, keyframes: Keyframe[], springName: keyof typeof APP_SPRINGS = "vif", delay = 0) {
  if (!motionAllowed()) {
    return element.animate([{ opacity: 0 }, { opacity: 1 }], {
      duration: REDUCED_MOTION_DURATION_MS,
      fill: "both",
    });
  }
  const curve = APP_SPRINGS[springName];
  return element.animate(keyframes, { duration: curve.duration, easing: curve.easing, delay, fill: "both" });
}

export function animateEntryCascade(elements: Iterable<Element>, gap = CASCADE_GAP_MS) {
  return [...elements].map((element, index) => animateAppElement(
    element,
    [{ opacity: 0, transform: "translateY(8px)" }, { opacity: 1, transform: "none" }],
    "doux",
    motionAllowed() ? index * gap : 0,
  ));
}
