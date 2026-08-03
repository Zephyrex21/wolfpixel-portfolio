import {
  useEffect,
  useLayoutEffect,
  useState,
  useCallback,
  useRef,
} from "react";
import { flushSync } from "react-dom";
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

  // Keep <html data-theme> and localStorage in sync. This runs as a
  // *layout* effect (synchronous, pre-paint) rather than a passive one,
  // because the view-transition toggle below needs the DOM to have
  // fully updated before it captures the "after" snapshot.
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

  // Theme toggle — wrapped in the View Transitions API when available,
  // animating a circular wipe expanding from the click point. Falls
  // back to an instant swap for unsupported browsers or when the
  // person prefers reduced motion.
  const toggleTheme = useCallback((e?: React.MouseEvent) => {
    const next: Theme = themeRef.current === "dark" ? "light" : "dark";

    const supportsViewTransitions =
      typeof document !== "undefined" && "startViewTransition" in document;
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!e || !supportsViewTransitions || prefersReducedMotion) {
      setTheme(next);
      return;
    }

    const x = e.clientX;
    const y = e.clientY;
    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y),
    );

    const transition = document.startViewTransition!(() => {
      flushSync(() => setTheme(next));
    });

    transition.ready.then(() => {
      document.documentElement.animate(
        {
          clipPath: [
            `circle(0px at ${x}px ${y}px)`,
            `circle(${endRadius}px at ${x}px ${y}px)`,
          ],
        },
        {
          duration: 550,
          easing: "ease-in-out",
          pseudoElement: "::view-transition-new(root)",
        },
      );
    });
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
