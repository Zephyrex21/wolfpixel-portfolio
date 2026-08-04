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
  // point. Deliberately NOT using the View Transitions API here: that
  // API rasterizes the *entire page* into an image on every toggle,
  // which measured ~800ms+ on this page (images, blur, gradients) and
  // was the actual source of the click lag. This version just grows a
  // plain colored circle via `clip-path` — no page snapshot involved —
  // then swaps the real theme underneath once it fully covers the
  // screen, so the swap itself is imperceptible.
  const toggleTheme = useCallback((e?: React.MouseEvent) => {
    const next: Theme = themeRef.current === "dark" ? "light" : "dark";
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!e || prefersReducedMotion) {
      setTheme(next);
      return;
    }

    const x = e.clientX;
    const y = e.clientY;
    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y),
    );

    // Matches the light/dark --color-background values in index.css.
    const nextBg = next === "dark" ? "rgb(13,13,13)" : "rgb(246,245,242)";

    const overlay = document.createElement("div");
    overlay.style.position = "fixed";
    overlay.style.inset = "0";
    overlay.style.zIndex = "9999";
    overlay.style.pointerEvents = "none";
    overlay.style.backgroundColor = nextBg;
    overlay.style.clipPath = `circle(0px at ${x}px ${y}px)`;
    overlay.style.willChange = "clip-path";
    document.body.appendChild(overlay);

    // Double rAF so the browser paints the overlay's zero-radius state
    // before the growth transition starts (avoids the two writes
    // collapsing into a single frame with no visible starting point).
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        overlay.style.transition = "clip-path 0.5s cubic-bezier(0.22, 1, 0.36, 1)";
        overlay.style.clipPath = `circle(${endRadius}px at ${x}px ${y}px)`;
      });
    });

    // Swap the real theme once the overlay has fully covered the
    // screen — the flip is instant but hidden behind matching color.
    setTimeout(() => {
      setTheme(next);
      overlay.remove();
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
