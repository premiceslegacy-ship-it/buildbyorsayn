export const MAX_CHILD_OUTPUT_CHARS = 256_000;

export function appendBoundedOutput(
  current: string,
  chunk: string
): { output: string; overflow: boolean } {
  const remaining = MAX_CHILD_OUTPUT_CHARS - current.length;
  if (chunk.length > remaining) {
    return {
      output: current + chunk.slice(0, Math.max(0, remaining)),
      overflow: true,
    };
  }
  return { output: current + chunk, overflow: false };
}
