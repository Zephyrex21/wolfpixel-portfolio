import { useEffect, useLayoutEffect, useState, useCallback, useRef } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import PageLoader from "./components/Loaders/PageLoader";
import { AnimatePresence } from "framer-motion";
import { Theme, ThemeToggleOrigin, THEME_BG } from "./utils/constants";
import { initSmoothScroll, destroySmoothScroll, scrollToTarget } from "./utils/smoothScroll";
import { printConsoleEasterEgg } from "./utils/consoleEasterEgg";
import CommandPalette from "./components/CommandPalette";
import ScrollProgress from "./components/ScrollProgress";
import BackToTop from "./components/BackToTop";
import ThemeRipple from "./components/ThemeRipple";

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
  const [rippleOrigin, setRippleOrigin] = useState<ThemeToggleOrigin | null>(null);
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

  // Theme toggle — a circle grows from wherever the toggle was clicked,
  // filled with the *destination* theme's actual background color, while
  // every element on the real page repaints its own colors underneath via
  // a scoped CSS transition (unchanged from before). The two are timed
  // together, so by the time the circle finishes covering the viewport the
  // page has already fully become the new theme — the circle just fades
  // out with nothing left to reveal, instead of sitting there as a cover.
  //
  // Two earlier approaches were tried and rejected before this one:
  //  - View Transitions API: rasterizes the *entire page* into an image on
  //    every toggle, measured ~800ms+ of real blocking work on this page
  //    (photos, blur, gradients) before anything even moved. Felt frozen.
  //  - A flat full-screen wipe in one hardcoded color: cheap, but reads as
  //    a loading flash rather than a theme change, since it just parks a
  //    solid color over the real content instead of revealing it.
  //
  // Using the actual destination background color, originating from the
  // click point, and keeping it in sync with the real content transition
  // avoids both: it's just a CSS transform + a small fixed div, and it
  // never has anything to hide because the truth is already underneath it.
  const toggleTheme = useCallback((origin?: ThemeToggleOrigin) => {
    const next: Theme = themeRef.current === "dark" ? "light" : "dark";
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
      setTheme(next);
      return;
    }

    document.documentElement.classList.add("theme-transitioning");
    void document.documentElement.offsetHeight; // forced reflow, see note below

    setTheme(next);
    setRippleOrigin(
      origin ?? { x: window.innerWidth - 48, y: 32 }, // sensible default for keyboard-triggered toggles (e.g. command palette)
    );

    window.setTimeout(() => {
      document.documentElement.classList.remove("theme-transitioning");
    }, 550);
  }, []);

  // Forced reflow above: a synchronous style flush guarantees the
  // transition rule is committed *before* the value change — instant
  // (same tick), unlike waiting on animation frames, which added a
  // perceptible ~30ms delay before the click visibly did anything.

  const handleRippleComplete = useCallback(() => {
    setRippleOrigin(null);
  }, []);

  if (loading)
    return (
      <AnimatePresence>
        <PageLoader />
      </AnimatePresence>
    );

  return (
    <Router>
      <ScrollProgress />
      <ThemeRipple
        origin={rippleOrigin}
        color={THEME_BG[theme]}
        onComplete={handleRippleComplete}
      />
      <CommandPalette theme={theme} onToggleTheme={toggleTheme} />
      <AppRoutes theme={theme} onToggleTheme={toggleTheme} />
      <BackToTop />
    </Router>
  );
}

export default App;
