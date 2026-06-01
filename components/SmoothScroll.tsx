"use client";

import Lenis from "lenis";
import { useEffect, type ReactNode } from "react";

export function SmoothScroll({ children }: { children: ReactNode }) {
  useEffect(() => {
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );
    const coarsePointer = window.matchMedia("(pointer: coarse)");

    if (reducedMotion.matches || coarsePointer.matches) {
      return;
    }

    const lenis = new Lenis({
      anchors: true,
      autoRaf: true,
    });

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
      lenis.destroy();
    };
  }, []);

  return children;
}
