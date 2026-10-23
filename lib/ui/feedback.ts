import { animateAppElement, motionAllowed } from "@/lib/ui/motion";
import { playAppSound, type AppSound } from "@/lib/ui/sound";

export type PressSound = AppSound | "none";

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
