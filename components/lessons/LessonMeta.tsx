import type { SectionLesson } from "@/lib/blocCatalog";

export function formatLessonDuration(durationSeconds: number): string {
  return `${Math.max(1, Math.round(durationSeconds / 60))} min`;
}

export function LessonMeta({ lesson }: { lesson: SectionLesson }) {
  return (
    <div data-testid="lesson-meta" className="space-y-4">
      <p className="text-[13px] text-white/40">{formatLessonDuration(lesson.durationSeconds)}</p>
      {lesson.deliverables.length > 0 && (
        <div>
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/40">Ce que tu livres</p>
          <ul className="list-disc space-y-1 pl-5 text-[15px] text-white/70">
            {lesson.deliverables.map((deliverable) => <li key={deliverable}>{deliverable}</li>)}
          </ul>
        </div>
      )}
    </div>
  );
}
