export type AppToastTone = "success" | "error" | "neutral";
export type AppToast = { id: number; message: string; tone: AppToastTone };

let current: AppToast | null = null;
let nextId = 1;
let dismissal: ReturnType<typeof setTimeout> | null = null;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

export function subscribeToasts(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function toastSnapshot() {
  return current;
}

export function showAppToast(message: string, tone: AppToastTone = "success") {
  current = { id: nextId++, message, tone };
  if (dismissal) clearTimeout(dismissal);
  emit();
  dismissal = setTimeout(() => {
    current = null;
    dismissal = null;
    emit();
  }, 2_000);
}
