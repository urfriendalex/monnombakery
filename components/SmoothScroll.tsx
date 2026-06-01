"use client";

import Lenis from "lenis";
import { useEffect, type ReactNode } from "react";

export function SmoothScroll({ children }: { children: ReactNode }) {
  useEffect(() => {
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );
    const coarsePointer = window.matchMedia("(pointer: coarse)");
    const useLenis = !reducedMotion.matches && !coarsePointer.matches;

    const lenis = useLenis
      ? new Lenis({
          anchors: true,
          autoRaf: true,
        })
      : null;

    const scrollToPosition = (event: Event) => {
      const { top, immediate = false, onComplete } = (
        event as CustomEvent<{
          top: number;
          immediate?: boolean;
          onComplete?: () => void;
        }>
      ).detail;

      if (lenis) {
        lenis.scrollTo(top, {
          immediate,
          force: true,
          programmatic: true,
          onComplete: onComplete ? () => onComplete() : undefined,
        });
        return;
      }

      window.scrollTo({
        top,
        behavior: immediate ? "instant" : "smooth",
      });
      onComplete?.();
    };

    window.addEventListener("smooth-scroll:scroll-to", scrollToPosition);

    if (!lenis) {
      return () => {
        window.removeEventListener("smooth-scroll:scroll-to", scrollToPosition);
      };
    }

    const updateScrollState = (event: Event) => {
      const { stopped } = (event as CustomEvent<{ stopped: boolean }>).detail;

      if (stopped) {
        lenis.stop();
      } else {
        lenis.start();
      }
    };

    window.addEventListener("smooth-scroll:set-stopped", updateScrollState);

    return () => {
      window.removeEventListener("smooth-scroll:set-stopped", updateScrollState);
      window.removeEventListener("smooth-scroll:scroll-to", scrollToPosition);
      lenis.destroy();
    };
  }, []);

  return children;
}
