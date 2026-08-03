import React, { useEffect, useRef, useState } from "react";
import { motion, Variants } from "framer-motion";
import {
  Code,
  Braces,
  Database,
  Server,
  Globe,
  GitBranch,
  Github,
  Cloud,
  Layers,
  Box,
  Cpu,
} from "lucide-react";

export interface TechStackItem {
  name: string;
  icon: React.ReactNode;
}

const techStack: TechStackItem[] = [
  { name: "JavaScript", icon: <Code /> },
  { name: "TypeScript", icon: <Braces /> },
  { name: "Python", icon: <Code /> },
  { name: "C++", icon: <Cpu /> },

  { name: "React", icon: <Layers /> },
  { name: "Tailwind CSS", icon: <Globe /> },
  { name: "Node.js", icon: <Server /> },
  { name: "Express.js", icon: <Server /> },

  { name: "FastAPI", icon: <Server /> },
  { name: "MongoDB", icon: <Database /> },
  { name: "Supabase", icon: <Database /> },
  { name: "Docker", icon: <Box /> },

  { name: "Git", icon: <GitBranch /> },
  { name: "GitHub", icon: <Github /> },
  { name: "Vercel", icon: <Cloud /> },
  { name: "Render", icon: <Cloud /> },
];

/* ------------------------------ Animations ------------------------------ */
const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 1, ease: [0.22, 1, 0.36, 1] } },
};

const techContainerVariants: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.08,
    },
  },
};

const techItemVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 14,
    scale: 0.96,
  },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.9,
      ease: [0.16, 1, 0.3, 1], // editorial / premium easing
    },
  },
};

/* ------------------------- Dock-style proximity magnification ------------------------- */
// Distance (px) beyond which an icon is unaffected by the cursor, and
// the peak scale applied when the cursor sits exactly on an icon.
const INFLUENCE_RADIUS = 140;
const MAX_SCALE = 1.32;

/* ------------------------------ Skills Component ------------------------------ */
const Skills: React.FC = () => {
  // Helper: calculate responsive icon size
  const getIconSize = () => {
    if (typeof window !== "undefined") {
      const width = window.innerWidth;
      if (width < 640) return 24; // mobile
      if (width < 1024) return 30; // tablet
      return 36; // desktop
    }
    return 36;
  };

  const [iconSize, setIconSize] = useState(getIconSize());

  useEffect(() => {
    const handleResize = () => setIconSize(getIconSize());
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const gridRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const rafId = useRef<number | null>(null);
  const mousePos = useRef({ x: -9999, y: -9999 });

  const runDockLoop = () => {
    const grid = gridRef.current;
    if (!grid) return;
    const gridRect = grid.getBoundingClientRect();

    itemRefs.current.forEach((el) => {
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const centerX = rect.left - gridRect.left + rect.width / 2;
      const centerY = rect.top - gridRect.top + rect.height / 2;
      const dist = Math.hypot(
        mousePos.current.x - centerX,
        mousePos.current.y - centerY,
      );
      const proximity = Math.max(0, 1 - dist / INFLUENCE_RADIUS);
      const scale = 1 + proximity * (MAX_SCALE - 1);
      el.style.transform = `scale(${scale})`;
    });

    rafId.current = requestAnimationFrame(runDockLoop);
  };

  const handleMouseEnter = () => {
    if (rafId.current) cancelAnimationFrame(rafId.current);
    rafId.current = requestAnimationFrame(runDockLoop);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = gridRef.current?.getBoundingClientRect();
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
  };

  useEffect(() => {
    return () => {
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, []);

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

        {/* Tech Grid */}
        <motion.div
          ref={gridRef}
          onMouseEnter={handleMouseEnter}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="mt-15 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-y-10 gap-x-16"
          variants={techContainerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
        >
          {techStack.map((tech, idx) => (
            <motion.div
              key={tech.name}
              className={`cursor-default ${
                idx % 2 === 0 ? "translate-y-0" : "translate-y-2 md:translate-y-0"
              }`}
              variants={techItemVariants}
            >
              {/* Separate node for the proximity scale so it never
                  fights the entrance animation's own transform. */}
              <div
                ref={(el) => {
                  itemRefs.current[idx] = el;
                }}
                className="group flex items-center gap-2 md:gap-4"
                style={{
                  transition: "transform 0.15s ease-out",
                  transformOrigin: "center",
                }}
              >
                <span className="text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                  {React.cloneElement(tech.icon as React.ReactElement, {
                    size: iconSize,
                    strokeWidth: 1.5,
                  })}
                </span>
                <span className="text-[clamp(1rem,3vw,1.5rem)] font-medium tracking-tight">
                  {tech.name}
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Skills;
