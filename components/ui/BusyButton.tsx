"use client";

import { motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState, type ButtonHTMLAttributes, type ReactNode } from "react";
import { runOutcomeFeedback } from "@/lib/ui/feedback";
import { showAppToast } from "@/lib/ui/toast";
import styles from "./BusyButton.module.css";

export type BusyButtonState = "idle" | "waiting" | "busy" | "success" | "error";

type BusyButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children" | "onClick"> & {
  children: ReactNode;
  action: (button: HTMLButtonElement) => Promise<unknown>;
  pendingText?: ReactNode;
  successText?: ReactNode;
  errorText?: ReactNode;
  successToast?: string;
  errorToast?: string;
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
};

const wait = (duration: number) => new Promise<void>((resolve) => setTimeout(resolve, duration));

export function BusyButton({
  children,
  action,
  pendingText = "En cours",
  successText = "Fait",
  errorText = "Réessayer",
  successToast,
  errorToast,
  onSuccess,
  onError,
  className = "",
  disabled,
  type = "button",
  ...props
}: BusyButtonProps) {
  const [state, setState] = useState<BusyButtonState>("idle");
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => () => {
    if (resetTimer.current) clearTimeout(resetTimer.current);
  }, []);

  const run = async () => {
    const button = buttonRef.current;
    if (!button || state !== "idle" || disabled) return;
    const startedAt = performance.now();
    let spinnerShown = false;
    setState("waiting");
    const spinnerTimer = setTimeout(() => {
      spinnerShown = true;
      setState("busy");
    }, 120);
    try {
      await action(button);
      clearTimeout(spinnerTimer);
      if (spinnerShown) await wait(Math.max(0, 420 - (performance.now() - startedAt)));
      setState("success");
      runOutcomeFeedback(button, "success");
      if (successToast) showAppToast(successToast, "success");
      onSuccess?.();
      resetTimer.current = setTimeout(() => setState("idle"), 1_100);
    } catch (error) {
      clearTimeout(spinnerTimer);
      if (spinnerShown) await wait(Math.max(0, 420 - (performance.now() - startedAt)));
      setState("error");
      runOutcomeFeedback(button, "error");
      if (errorToast) showAppToast(errorToast, "error");
      onError?.(error);
      resetTimer.current = setTimeout(() => setState("idle"), 1_800);
    }
  };

  const visible = state === "waiting" ? "idle" : state;
  const slot = (name: "idle" | "busy" | "success" | "error", content: ReactNode) => (
    <span className={`${styles.state} ${visible === name ? "" : styles.hidden}`} aria-hidden={visible !== name}>{content}</span>
  );

  return (
    <button
      {...props}
      ref={buttonRef}
      type={type}
      className={`${styles.button} ${className}`.trim()}
      data-state={state}
      aria-busy={state === "busy" || undefined}
      disabled={disabled || state !== "idle"}
      onClick={(event) => {
        if (type === "submit") event.preventDefault();
        void run();
      }}
    >
      <span className={styles.stack}>
        {slot("idle", children)}
        {slot("busy", <><span className={styles.spinner} aria-hidden="true" /><span className="sr">{pendingText}</span></>)}
        {slot("success", <><svg className={styles.check} viewBox="0 0 24 24" aria-hidden="true"><motion.path d="m5 12.5 4.5 4.5L19 7.5" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: reduce ? 0 : .38, ease: [.3, .9, .3, 1] }} /></svg><span>{successText}</span></>)}
        {slot("error", <><svg className={styles.errorIcon} viewBox="0 0 24 24" aria-hidden="true"><path d="M12 8v5m0 3.5v.01M10.3 3.9 2.5 17.5a2 2 0 0 0 1.7 3h15.6a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" /></svg><span>{errorText}</span></>)}
      </span>
    </button>
  );
}
