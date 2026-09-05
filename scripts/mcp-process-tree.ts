import type { ChildProcess } from "node:child_process";

export type ProcessTreeSignal = "SIGTERM" | "SIGKILL";

export function signalProcessTree(child: ChildProcess, signal: ProcessTreeSignal): void {
  if (process.platform === "win32") {
    throw new Error("MCP process-tree cleanup requires POSIX process groups.");
  }
  if (!child.pid) {
    throw new Error("MCP process-tree cleanup has no child PID.");
  }
  try {
    process.kill(-child.pid, signal);
  } catch (error) {
    const code = error instanceof Error && "code" in error
      ? (error as NodeJS.ErrnoException).code
      : undefined;
    if (code === "ESRCH") return;
    throw new Error("MCP process-group signaling failed.");
  }
}

export function isProcessGroupAlive(pid: number | undefined): boolean {
  if (!pid || process.platform === "win32") return false;
  try {
    process.kill(-pid, 0);
    return true;
  } catch (error) {
    const code = error instanceof Error && "code" in error
      ? (error as NodeJS.ErrnoException).code
      : undefined;
    return code !== "ESRCH";
  }
}
