"use client";

import * as React from "react";
import { ArrowUp } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

const EASE_OUT = [0.22, 1, 0.36, 1] as const;

const ScrollToTop = () => {
  const [visible, setVisible] = React.useState(false);
  const reduceMotion = useReducedMotion();

  React.useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 2);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          type="button"
          aria-label="Remonter en haut"
          onClick={scrollToTop}
          initial={{ opacity: 0, y: 8, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 8, scale: 0.9 }}
          transition={{ duration: reduceMotion ? 0 : 0.2, ease: EASE_OUT }}
          className="fixed bottom-24 right-4 md:bottom-6 md:right-6 z-50 flex h-11 w-11 items-center justify-center rounded-full border border-[#e8d5b0]/15 bg-[#0e0e0f]/80 text-[#e8d5b0]/70 shadow-lg backdrop-blur-md transition-colors hover:border-[#e8d5b0]/30 hover:text-[#e8d5b0] cursor-pointer"
        >
          <ArrowUp className="h-4 w-4" />
        </motion.button>
      )}
    </AnimatePresence>
  );
};

export { ScrollToTop };
export default ScrollToTop;
