import { animateAppElement, motionAllowed } from "@/lib/ui/motion";
import { playAppSound, type AppSound } from "@/lib/ui/sound";

export type PressSound = AppSound | "none";

const EXPLICIT_SOUNDS: Record<PressSound, true> = { none: true, click: true, select: true, open: true, confirm: true, error: true };
const SELECTION_CONTROL = [
  '[role="tab"]',
  '[role="radio"]',
  '[role="option"]',
  '[role="menuitemradio"]',
  '[role="switch"]',
  '[role="menuitemcheckbox"]',
  '[aria-pressed]',
  '[aria-selected]',
  '[aria-current]',
  'input[type="radio"]',
  'input[type="checkbox"]',
  "select",
  ".chip",
  ".tabbar a",
  ".navbar__nav a",
  ".adm-nav-item",
  ".adm-filterbar button",
  ".adm-template-tabs",
  ".adm-audience-tabs",
].join(", ");

const SELECTION_CONTAINER = [
  '[role="tablist"]',
  ".tabs",
  ".seg",
  ".tabbar",
  ".navbar__nav",
  ".adm-nav-item",
  ".adm-filterbar",
  ".adm-template-tabs",
  ".adm-audience-tabs",
].join(", ");

export function soundKindFor(element: Element): PressSound {
  const explicit = element.getAttribute("data-sfx");
  if (explicit && EXPLICIT_SOUNDS[explicit as PressSound]) return explicit as PressSound;
  if (element.matches(SELECTION_CONTROL) || element.closest(SELECTION_CONTAINER)) return "select";
  return "click";
}

type PressDependencies = {
  animate: (element: HTMLElement) => Animation | null;
  play: (sound: AppSound) => void | Promise<void>;
};

const pressAnimations = new WeakMap<HTMLElement, Animation>();

function animatePressStart(element: HTMLElement) {
  if (!motionAllowed()) return null;
  const animation = element.animate([{ scale: "1" }, { scale: ".97" }], {
    duration: 100,
    easing: "linear",
    fill: "forwards",
  });
  pressAnimations.set(element, animation);
  return animation;
}

export function startPressFeedback(
  element: HTMLElement,
  sound: PressSound,
  dependencies: PressDependencies = { animate: animatePressStart, play: playAppSound },
) {
  const animation = dependencies.animate(element);
  if (sound !== "none") void dependencies.play(sound);
  return animation;
}

export function finishPressFeedback(element: HTMLElement) {
  const current = pressAnimations.get(element);
  current?.cancel();
  pressAnimations.delete(element);
  if (!motionAllowed()) return null;
  return element.animate([{ scale: ".97" }, { scale: "1" }], {
    duration: 100,
    easing: "linear",
    fill: "forwards",
  });
}

export function pulsePressFeedback(element: HTMLElement, sound: PressSound) {
  const animation = startPressFeedback(element, sound, {
    animate: (target) => motionAllowed() ? target.animate(
      [{ scale: "1" }, { scale: ".97", offset: .45 }, { scale: "1" }],
      { duration: 200, easing: "linear" },
    ) : null,
    play: playAppSound,
  });
  return animation;
}

export function runOutcomeFeedback(element: HTMLElement, outcome: "success" | "error") {
  const sound: AppSound = outcome === "success" ? "confirm" : "error";
  const animation = outcome === "success"
    ? animateAppElement(element, [{ transform: "scale(.94)" }, { transform: "scale(1)" }], "rebond")
    : animateAppElement(element, [
      { transform: "translateX(0)" },
      { transform: "translateX(-6px)" },
      { transform: "translateX(6px)" },
      { transform: "translateX(-3px)" },
      { transform: "none" },
    ], "vif");
  void playAppSound(sound);
  return animation;
}
