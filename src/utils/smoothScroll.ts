import Lenis from "lenis";

let lenisInstance: Lenis | null = null;
let rafHandle: number | null = null;

/**
 * Initializes the shared Lenis smooth-scroll instance and starts its
 * animation loop. No-ops (returns null) if the user prefers reduced
 * motion — falls back to native scrolling entirely in that case.
 */
export function initSmoothScroll(): Lenis | null {
  if (typeof window === "undefined") return null;

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  if (prefersReducedMotion) return null;

  lenisInstance = new Lenis({
    duration: 1.1,
    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  });

  const raf = (time: number) => {
    lenisInstance?.raf(time);
    rafHandle = requestAnimationFrame(raf);
  };
  rafHandle = requestAnimationFrame(raf);

  return lenisInstance;
}

export function destroySmoothScroll() {
  if (rafHandle) cancelAnimationFrame(rafHandle);
  lenisInstance?.destroy();
  lenisInstance = null;
  rafHandle = null;
}

export function getLenis(): Lenis | null {
  return lenisInstance;
}

/** Scrolls to a selector or element, routed through Lenis when active. */
export function scrollToTarget(
  target: string | HTMLElement,
  offset = -90,
) {
  if (lenisInstance) {
    lenisInstance.scrollTo(target, { offset, duration: 1.2 });
    return;
  }
  const el =
    typeof target === "string" ? document.querySelector(target) : target;
  el?.scrollIntoView({ behavior: "smooth" });
}
