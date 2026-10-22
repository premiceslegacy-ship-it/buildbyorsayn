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
      {lesson.chapters && lesson.chapters.length > 1 && (
        <div>
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/40">Repères</p>
          <ol className="space-y-1 text-[14px] text-white/65">
            {lesson.chapters.map((chapter) => (
              <li key={`${chapter.index}-${chapter.startSeconds}`}>
                {formatChapterTime(chapter.startSeconds)} : {chapter.title}
              </li>
            ))}
          </ol>
        </div>
      )}
      {lesson.transcript && (
        <details className="rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3">
          <summary className="cursor-pointer text-[15px] font-medium text-white/70">Transcription de la vidéo</summary>
          <div className="mt-4 whitespace-pre-wrap text-[15px] leading-relaxed text-white/65">{lesson.transcript}</div>
        </details>
      )}
    </div>
  );
}

function formatChapterTime(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remainder = seconds % 60;
  return `${minutes}:${String(remainder).padStart(2, "0")}`;
}
