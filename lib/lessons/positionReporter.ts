const LESSON_REPORT_INTERVAL_MS = 15_000;
const LESSON_COMPLETION_RATIO = 0.9;

export type LessonPositionSnapshot = { positionSeconds: number; completed: boolean };

export type PositionReporterDeps = {
  save: (snapshot: LessonPositionSnapshot) => Promise<void>;
  onCompleted: () => void;
  now?: () => number;
};

/**
 * Throttled, idempotent progress reporting for one lesson.
 * - at most one save per interval unless `force` (pause / end);
 * - never two saves in flight, except a forced one, which must not be lost;
 * - `onCompleted` fires once, the first time 90% of the video is reached;
 * - invalid readings (NaN, zero duration) are ignored.
 */
export function createPositionReporter({ save, onCompleted, now = Date.now }: PositionReporterDeps) {
  let lastSentAt = 0;
  let completed = false;
  let notified = false;
  let inFlight = false;

  return function report(currentTime: number, duration: number, force = false): void {
    if (!Number.isFinite(currentTime) || !Number.isFinite(duration) || duration <= 0) return;

    if (currentTime / duration >= LESSON_COMPLETION_RATIO) {
      completed = true;
      if (!notified) {
        notified = true;
        onCompleted();
      }
    }

    const at = now();
    if (!force && (at - lastSentAt < LESSON_REPORT_INTERVAL_MS || inFlight)) return;
    lastSentAt = at;
    inFlight = true;
    save({ positionSeconds: Math.floor(Math.max(0, currentTime)), completed })
      .catch((error) => console.error("Erreur lors de l'enregistrement de la lecture:", error))
      .finally(() => { inFlight = false; });
  };
}
