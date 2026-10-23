"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useSyncExternalStore } from "react";
import { MOTION_SPRINGS } from "@/lib/ui/motion";
import { subscribeToasts, toastSnapshot } from "@/lib/ui/toast";
import styles from "./ToastViewport.module.css";

export function ToastViewport() {
  const toast = useSyncExternalStore(subscribeToasts, toastSnapshot, () => null);
  const reduce = useReducedMotion();
  return (
    <div className={styles.viewport} aria-live="polite" aria-atomic="true">
      <AnimatePresence>
        {toast ? (
          <motion.div
            key={toast.id}
            role="status"
            className={`${styles.toast} ${styles[toast.tone]}`}
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 16, scale: .96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={reduce ? { duration: .12 } : MOTION_SPRINGS.doux}
          >
            <svg className={styles.icon} viewBox="0 0 24 24" aria-hidden="true">
              {toast.tone === "error" ? <path d="M12 7v6m0 4h.01M4.6 20h14.8a2 2 0 0 0 1.74-3L13.74 4a2 2 0 0 0-3.48 0L2.86 17a2 2 0 0 0 1.74 3Z" /> : <path d="m5 12.5 4.5 4.5L19 7.5" />}
            </svg>
            <span>{toast.message}</span>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
