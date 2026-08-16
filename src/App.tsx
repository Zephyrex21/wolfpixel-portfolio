import { useEffect, useLayoutEffect, useState, useCallback, useRef, lazy, Suspense } from "react";
import AppRoutes from "./routes/AppRoutes";
import PageLoader from "./components/Loaders/PageLoader";
import { AnimatePresence } from "framer-motion";
import { Theme } from "./utils/constants";
import { initSmoothScroll, destroySmoothScroll, scrollToTarget } from "./utils/smoothScroll";
import { printConsoleEasterEgg } from "./utils/consoleEasterEgg";
import CommandPalette from "./components/CommandPalette";
import ScrollProgress from "./components/ScrollProgress";
import BackToTop from "./components/BackToTop";

// Lazy-loaded: a hidden Easter egg most visitors never trigger, so it
// shouldn't cost anything in the main bundle for the ones who don't.
const SortVisualizer = lazy(() => import("./components/SortVisualizer"));

function getInitialTheme(): Theme {
  if (typeof window === "undefined") return "light";
  const stored = window.localStorage.getItem("theme");
  if (stored === "dark" || stored === "light") return stored;
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function App() {
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState<Theme>(getInitialTheme);
  const themeRef = useRef(theme);
  themeRef.current = theme;

  // Fun touch for anyone who actually opens devtools — a meaningful
  // chunk of this site's real audience.
  useEffect(() => {
    printConsoleEasterEgg();
  }, []);

  // Handle full page load (images/fonts) before revealing the site
  useEffect(() => {
    const handleLoad = () => setLoading(false);

    if (document.readyState === "complete") {
      handleLoad();
    } else {
      window.addEventListener("load", handleLoad);
    }

    return () => {
      window.removeEventListener("load", handleLoad);
    };
  }, []);

  // Keep <html data-theme> and localStorage in sync.
  useLayoutEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    window.localStorage.setItem("theme", theme);
  }, [theme]);

  // Smooth scroll (Lenis) + a single delegated handler so every
  // `href="#section"` link sitewide (navbar, footer, mobile menu)
  // routes through it consistently.
  useEffect(() => {
    initSmoothScroll();

    const handleAnchorClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement)?.closest?.(
        'a[href^="#"]',
      ) as HTMLAnchorElement | null;
      if (!anchor) return;
      const hash = anchor.getAttribute("href");
      if (!hash || hash === "#") return;
      const el = document.querySelector(hash);
      if (!el) return;
      e.preventDefault();
      scrollToTarget(el as HTMLElement, -90);
    };

    document.addEventListener("click", handleAnchorClick);

    return () => {
      document.removeEventListener("click", handleAnchorClick);
      destroySmoothScroll();
    };
  }, []);

  // Theme toggle — third attempt, and this one stays deliberately simple.
  //
  // What was tried and why each was rejected:
  //  1. View Transitions API: rasterizes the *entire page* into an image
  //     on every toggle — ~800ms+ of real blocking work on this page
  //     (photos, blur, gradients) before anything even moved. Froze.
  //  2. A flat full-screen color wipe: cheap, but a plain overlay parked
  //     on top of real content just reads as a loading flash.
  //  3. A click-originated circle (matching the destination theme's real
  //     color) growing via Framer Motion, layered on top of this same
  //     CSS transition: looked right in isolation, but running *two*
  //     animation systems at once — the browser's CSS transition engine
  //     repainting every element's colors, and a separate rAF-driven
  //     transform animating a giant overlay — meant both were competing
  //     for the same frames. Under that load the JS-driven side lost
  //     frames first, which is exactly what "laggy" looks like. And
  //     because a CSS transition and a JS transform run on two
  //     independent clocks, keeping them frame-locked to each other was
  //     never fully reliable — any drift shows up as a visible seam.
  //
  // The fix: one mechanism, not two. A scoped class gives every element a
  // short, native CSS transition on its own color/background — the
  // browser handles the interpolation directly, there's no second system
  // competing with it, and nothing can drift out of sync with itself.
  // The visual flourish moved to where it can't cost anything: a small
  // icon-morph on the toggle button itself (see Navbar.tsx) — one tiny
  // element, cheap regardless of what the rest of the page is doing.
  const toggleTheme = useCallback(() => {
    const next: Theme = themeRef.current === "dark" ? "light" : "dark";
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
      setTheme(next);
      return;
    }

    document.documentElement.classList.add("theme-transitioning");

    // Forced reflow: a synchronous style flush guarantees the transition
    // rule above is committed *before* the value change below — instant
    // (same tick), unlike waiting on an animation frame, which added a
    // perceptible delay before the click visibly did anything.
    void document.documentElement.offsetHeight;

    setTheme(next);

    window.setTimeout(() => {
      document.documentElement.classList.remove("theme-transitioning");
    }, 350);
  }, []);

  if (loading)
    return (
      <AnimatePresence>
        <PageLoader />
      </AnimatePresence>
    );

  return (
    <>
      <ScrollProgress />
      <CommandPalette theme={theme} onToggleTheme={toggleTheme} />
      <Suspense fallback={null}>
        <SortVisualizer />
      </Suspense>
      <AppRoutes theme={theme} onToggleTheme={toggleTheme} />
      <BackToTop />
    </>
  );
}

export default App;
