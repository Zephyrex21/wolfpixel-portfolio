import React, { useEffect, useRef, useState, memo } from "react";
import { motion, Variants } from "framer-motion";
import {
  Code,
  Braces,
  Database,
  Server,
  Wind,
  GitBranch,
  Github,
  Cloud,
  Layers,
  Box,
  Cpu,
  Sparkles,
  Zap,
} from "lucide-react";
import { EASE_PREMIUM } from "../../utils/animations";

export interface TechStackItem {
  name: string;
  icon: React.ReactNode;
}

interface TechCategory {
  label: string;
  items: TechStackItem[];
}

// Grouped by what they actually are, not just a flat icon soup — and
// includes the tools that were previously missing despite being central
// to the actual work: Framer Motion + GSAP (this entire site runs on
// both) and Redis (from the Context Engineering Toolkit's production
// hardening pass — rate limiting, real infra, not just CRUD).
const techCategories: TechCategory[] = [
  {
    label: "Languages",
    items: [
      { name: "JavaScript", icon: <Code /> },
      { name: "TypeScript", icon: <Braces /> },
      { name: "Python", icon: <Code /> },
      { name: "C++", icon: <Cpu /> },
    ],
  },
  {
    label: "Frontend & Motion",
    items: [
      { name: "React", icon: <Layers /> },
      { name: "Tailwind CSS", icon: <Wind /> },
      { name: "Framer Motion", icon: <Sparkles /> },
      { name: "GSAP", icon: <Zap /> },
    ],
  },
  {
    label: "Backend & Data",
    items: [
      { name: "Node.js", icon: <Server /> },
      { name: "Express.js", icon: <Server /> },
      { name: "FastAPI", icon: <Zap /> },
      { name: "MongoDB", icon: <Database /> },
      { name: "Supabase", icon: <Database /> },
      { name: "Redis", icon: <Database /> },
    ],
  },
  {
    label: "DevOps & Tooling",
    items: [
      { name: "Docker", icon: <Box /> },
      { name: "Git", icon: <GitBranch /> },
      { name: "GitHub", icon: <Github /> },
      { name: "Vercel", icon: <Cloud /> },
      { name: "Render", icon: <Cloud /> },
    ],
  },
];

/* ------------------------------ Animations ------------------------------ */
const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 1, ease: EASE_PREMIUM } },
};

// Outer: cascades each category block in turn.
const categoryListVariants: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.18,
      delayChildren: 0.1,
    },
  },
};

const categoryBlockVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: EASE_PREMIUM },
  },
};

// Inner: staggers the individual chips within a category, once that
// category's block has started revealing.
const itemContainerVariants: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
};

const techItemVariants: Variants = {
  hidden: { opacity: 0, y: 14, scale: 0.96 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
  },
};

/* ------------------------- Dock-style proximity magnification ------------------------- */
// Distance (px) beyond which an icon is unaffected by the cursor, and
// the peak scale applied when the cursor sits exactly on an icon.
const INFLUENCE_RADIUS = 140;
const MAX_SCALE = 1.32;

// Radius of the soft cursor-tracking spotlight behind the whole grid —
// reuses the exact same rAF loop and mouse-position ref as the dock
// effect above, so it's effectively free: no second animation system,
// no extra event listeners, just one more style write per frame.
const SPOTLIGHT_SIZE = 480;

/* ------------------------------ Skills Component ------------------------------ */
const Skills: React.FC = () => {
  // Helper: calculate responsive icon size
  const getIconSize = () => {
    if (typeof window !== "undefined") {
      const width = window.innerWidth;
      if (width < 640) return 22; // mobile
      if (width < 1024) return 26; // tablet
      return 30; // desktop
    }
    return 30;
  };

  const [iconSize, setIconSize] = useState(getIconSize());

  useEffect(() => {
    const handleResize = () => setIconSize(getIconSize());
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const gridRef = useRef<HTMLDivElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const rafId = useRef<number | null>(null);
  const mousePos = useRef({ x: -9999, y: -9999 });
  const gridRectCache = useRef<{ left: number; top: number } | null>(null);
  const itemCenters = useRef<{ x: number; y: number }[]>([]);

  // Measures the grid and every item's position exactly once, when the
  // cursor enters — the grid's layout doesn't change mid-hover, so
  // there's no need to re-read it on every mousemove or every frame of
  // the dock animation (previously ~19 getBoundingClientRect calls per
  // frame, 60 times a second, while hovering).
  const measurePositions = () => {
    const grid = gridRef.current;
    if (!grid) return;
    const gridRect = grid.getBoundingClientRect();
    gridRectCache.current = { left: gridRect.left, top: gridRect.top };

    itemCenters.current = itemRefs.current.map((el) => {
      if (!el) return { x: 0, y: 0 };
      const rect = el.getBoundingClientRect();
      return {
        x: rect.left - gridRect.left + rect.width / 2,
        y: rect.top - gridRect.top + rect.height / 2,
      };
    });
  };

  const runDockLoop = () => {
    itemRefs.current.forEach((el, i) => {
      if (!el) return;
      const center = itemCenters.current[i];
      if (!center) return;
      const dist = Math.hypot(
        mousePos.current.x - center.x,
        mousePos.current.y - center.y,
      );
      const proximity = Math.max(0, 1 - dist / INFLUENCE_RADIUS);
      const scale = 1 + proximity * (MAX_SCALE - 1);
      el.style.transform = `scale(${scale})`;
    });

    if (spotlightRef.current) {
      spotlightRef.current.style.setProperty("--spot-x", `${mousePos.current.x}px`);
      spotlightRef.current.style.setProperty("--spot-y", `${mousePos.current.y}px`);
    }

    rafId.current = requestAnimationFrame(runDockLoop);
  };

  const handleMouseEnter = () => {
    measurePositions();
    if (rafId.current) cancelAnimationFrame(rafId.current);
    rafId.current = requestAnimationFrame(runDockLoop);
    if (spotlightRef.current) spotlightRef.current.style.opacity = "1";
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = gridRectCache.current;
    if (!rect) return;
    mousePos.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const handleMouseLeave = () => {
    if (rafId.current) cancelAnimationFrame(rafId.current);
    rafId.current = null;
    mousePos.current = { x: -9999, y: -9999 };
    itemRefs.current.forEach((el) => {
      if (el) el.style.transform = "scale(1)";
    });
    if (spotlightRef.current) spotlightRef.current.style.opacity = "0";
  };

  useEffect(() => {
    return () => {
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, []);

  // Flat running index across nested category/item maps, so each icon
  // still gets a stable slot in the single shared itemRefs array the
  // dock effect and spotlight both rely on.
  let flatIdx = 0;

  return (
    <section id="skills" className="pb-6 pt-24 lg:pt-26 scroll-mt-14">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Heading + Description */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.25 }}
          variants={sectionVariants}
        >
          <motion.h2
            variants={sectionVariants}
            className="text-[clamp(3.3rem,8vw,6rem)] font-black leading-[1] tracking-tight"
          >
            Skills &<br />
            <span className="mt-2 block font-light text-muted-foreground">
              Technologies
            </span>
          </motion.h2>
          <motion.p
            variants={sectionVariants}
            className="mt-10 text-lg sm:text-xl text-muted-foreground leading-relaxed"
          >
            A focused stack I use to design, build and ship scalable,
            maintainable software — from DSA fundamentals to production
            AI/ML systems.
          </motion.p>
        </motion.div>

        {/* Tech Categories */}
        <motion.div
          ref={gridRef}
          onMouseEnter={handleMouseEnter}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="relative mt-15 space-y-14"
          variants={categoryListVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
        >
          {/* Cursor-tracking ambient spotlight — same rAF loop and mouse
              position as the dock-magnify effect below, so this is one
              extra style write per frame, not a second animation system. */}
          <div
            ref={spotlightRef}
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500"
            style={{
              background: `radial-gradient(${SPOTLIGHT_SIZE}px circle at var(--spot-x, 50%) var(--spot-y, 50%), color-mix(in srgb, var(--color-foreground) 6%, transparent), transparent 70%)`,
            }}
          />

          {techCategories.map((category) => (
            <motion.div key={category.label} variants={categoryBlockVariants}>
              <p className="mb-6 text-xs sm:text-sm tracking-[0.3em] uppercase text-muted-foreground/70">
                {category.label}
              </p>

              <motion.div
                className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-y-8 gap-x-12"
                variants={itemContainerVariants}
              >
                {category.items.map((tech) => {
                  const idx = flatIdx++;
                  return (
                    <motion.div
                      key={tech.name}
                      className="cursor-default"
                      variants={techItemVariants}
                    >
                      {/* Separate node for the proximity scale so it never
                          fights the entrance animation's own transform. */}
                      <div
                        ref={(el) => {
                          itemRefs.current[idx] = el;
                        }}
                        className="group flex items-center gap-3 md:gap-4"
                        style={{
                          transition: "transform 0.15s ease-out",
                          transformOrigin: "center",
                        }}
                      >
                        <span
                          className="flex items-center justify-center rounded-2xl border border-border p-2.5 md:p-3 transition-colors duration-300 group-hover:border-foreground/50 group-hover:bg-foreground/[0.04]"
                        >
                          <span className="text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                            {React.cloneElement(tech.icon as React.ReactElement, {
                              size: iconSize,
                              strokeWidth: 1.5,
                            })}
                          </span>
                        </span>
                        <span className="text-[clamp(0.95rem,2.6vw,1.25rem)] font-medium tracking-tight">
                          {tech.name}
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default memo(Skills);
