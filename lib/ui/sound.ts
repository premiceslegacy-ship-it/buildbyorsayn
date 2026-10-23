"use client";

import { useSyncExternalStore } from "react";

export type AppSound = "click" | "select" | "open" | "confirm" | "error";
export const SOUND_STORAGE_KEY = "btv-sfx";
export const APP_SOUNDS: Record<AppSound, { file: string; volume: number; rate: number }> = {
  click: { file: "ref-ui-click.wav", volume: 0.34, rate: 1 },
  select: { file: "selection-1.wav", volume: 0.3, rate: 1 },
  open: { file: "ref-soft-woosh.wav", volume: 0.22, rate: 1 },
  confirm: { file: "ref-confirm-bubble.wav", volume: 0.3, rate: 1 },
  error: { file: "ref-ui-click.wav", volume: 0.3, rate: 0.66 },
};

let enabled = true;
let hydrated = false;
let context: AudioContext | null = null;
const buffers = new Map<string, AudioBuffer>();
let preload: Promise<void> | null = null;
const listeners = new Set<() => void>();

function hydrate() {
  if (hydrated || typeof window === "undefined") return;
  hydrated = true;
  enabled = window.localStorage.getItem(SOUND_STORAGE_KEY) !== "0";
}

function emit() { listeners.forEach((listener) => listener()); }
function subscribe(listener: () => void) { listeners.add(listener); return () => listeners.delete(listener); }
function snapshot() { hydrate(); return enabled; }
function serverSnapshot() { return true; }

export function setSoundEnabled(next: boolean) {
  hydrate();
  enabled = next;
  window.localStorage.setItem(SOUND_STORAGE_KEY, next ? "1" : "0");
  emit();
}

export function useAppSound() {
  const isEnabled = useSyncExternalStore(subscribe, snapshot, serverSnapshot);
  return { enabled: isEnabled, setEnabled: setSoundEnabled, play: playAppSound };
}

async function audioBuffer(file: string) {
  context ??= new AudioContext();
  if (context.state === "suspended") await context.resume();
  const cached = buffers.get(file);
  if (cached) return cached;
  const response = await fetch(`/sfx/${file}`);
  if (!response.ok) throw new Error(`SFX ${response.status}`);
  const decoded = await context.decodeAudioData(await response.arrayBuffer());
  buffers.set(file, decoded);
  return decoded;
}

function preloadAll() {
  preload ??= Promise.all([...new Set(Object.values(APP_SOUNDS).map((sound) => sound.file))].map((file) => audioBuffer(file))).then(() => undefined);
  return preload;
}

export async function playAppSound(name: AppSound) {
  hydrate();
  if (!enabled || typeof AudioContext === "undefined") return;
  const config = APP_SOUNDS[name];
  try {
    const selected = audioBuffer(config.file);
    void preloadAll();
    const buffer = await selected;
    if (!context) return;
    const source = context.createBufferSource();
    const gain = context.createGain();
    source.buffer = buffer;
    source.playbackRate.value = config.rate * (0.97 + Math.random() * 0.06);
    gain.gain.value = config.volume;
    source.connect(gain).connect(context.destination);
    source.start();
  } catch {
    // Le son est un renfort. Une indisponibilité audio ne bloque jamais l'action.
  }
}
