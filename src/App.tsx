import { useEffect, useLayoutEffect, useState, useCallback, useRef } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import PageLoader from "./components/Loaders/PageLoader";
import { AnimatePresence } from "framer-motion";
import { Theme } from "./utils/constants";
import { initSmoothScroll, destroySmoothScroll, scrollToTarget } from "./utils/smoothScroll";

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

  // Theme toggle — a lightweight circular wipe expanding from the click
  // Theme toggle — lets the browser's own CSS transition engine smoothly
  // interpolate the actual theme colors in place (background, text,
  // borders), instead of faking a transition with an overlay.
  //
  // Two previous approaches were tried and rejected:
  //  - View Transitions API: rasterizes the *entire page* into an
  //    image on every toggle, measured ~800ms+ of real blocking work
  //    on this page (photos, blur, gradients) before anything even
  //    moved. Felt frozen.
  //  - A JS-driven "circle wipe" overlay: cheap, but it's a flat solid
  //    color sweeping across the screen, covering the real content
  //    underneath — reads as a loading flash, not a theme change.
  //
  // This version does neither: it adds a scoped class that gives every
  // element a short `transition` on color/background/border, flips the
  // theme, then removes the class once the transition finishes. The
  // real page content is visible and repainting its own colors the
  // entire time — no snapshot, no cover, no flash.
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

    // Let the browser paint once with the transition rule active
    // *before* the actual color values change — otherwise adding the
    // class and flipping the theme collapse into the same frame and
    // there's no "before" state to animate from, so it just jumps.
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setTheme(next);
      });
    });

    window.setTimeout(() => {
      document.documentElement.classList.remove("theme-transitioning");
    }, 500);
  }, []);

  if (loading)
    return (
      <AnimatePresence>
        <PageLoader />
      </AnimatePresence>
    );

  return (
    <Router>
      <AppRoutes theme={theme} onToggleTheme={toggleTheme} />
    </Router>
  );
}

export default App;
