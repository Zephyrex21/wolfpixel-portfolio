import React, { useEffect, useRef, memo } from "react";
import {
  motion,
  Variants,
  useMotionValue,
  useTransform,
} from "framer-motion";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
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
  Bot,
  Gauge,
  Network,
  TrendingUp,
} from "lucide-react";
import { EASE_PREMIUM } from "../../utils/animations";
import SplitText from "../SplitText";

export interface TechStackItem {
  name: string;
  icon: React.ReactNode;
}

interface TechCategory {
  label: string;
  items: TechStackItem[];
}

// Grouped by what they actually are, and pulled from real, current project
// work — not a one-time-use kitchen sink, but the tools that show up
// repeatedly: Gemini/Groq/Pinecone across the RAG assistant, GitHub radar,
// and Mind Forge; XGBoost from the ISRO hackathon submission; Framer
// Motion + GSAP, which this entire site runs on; Redis from the Context
// Engineering Toolkit's production hardening pass.
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
    label: "AI & ML",
    items: [
      { name: "Gemini", icon: <Bot /> },
      { name: "Groq", icon: <Gauge /> },
      { name: "Pinecone", icon: <Network /> },
      { name: "XGBoost", icon: <TrendingUp /> },
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

const allTools = techCategories.flatMap((c) => c.items);
const totalTools = allTools.length;

/* ------------------------------ Animations ------------------------------ */
const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 1, ease: EASE_PREMIUM } },
};

const categoryListVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};

const categoryBlockVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE_PREMIUM } },
};

const pillContainerVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.04, delayChildren: 0.05 } },
};

const pillVariants: Variants = {
  hidden: { opacity: 0, scale: 0.85, y: 8 },
  show: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 22 },
  },
};

/* ------------------------- Magnetic tilt pill ------------------------- */
// Each pill tilts toward the cursor within its own bounds, independently —
// driven by Framer Motion's own motion values (not a shared rAF loop
// mutating the DOM directly), so there's no risk of one global system
// getting out of sync with the layout the way a hand-rolled version could.
const TILT_RANGE = 10; // degrees at the pill's edge

const TechPill: React.FC<{ tech: TechStackItem }> = ({ tech }) => {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-24, 24], [TILT_RANGE, -TILT_RANGE]);
  const rotateY = useTransform(x, [-24, 24], [-TILT_RANGE, TILT_RANGE]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    x.set(e.clientX - rect.left - rect.width / 2);
    y.set(e.clientY - rect.top - rect.height / 2);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      variants={pillVariants}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={{ scale: 1.06, y: -4 }}
      transition={{ type: "spring", stiffness: 350, damping: 20 }}
      style={{ rotateX, rotateY, transformPerspective: 500 }}
      className="inline-flex items-center gap-2.5 rounded-full border border-border bg-foreground/[0.02] px-4 py-2.5 sm:px-5 sm:py-3 transition-colors duration-300 hover:border-foreground/40 hover:bg-foreground/[0.06] cursor-default [transform-style:preserve-3d]"
    >
      <span className="text-muted-foreground">
        {React.cloneElement(tech.icon as React.ReactElement, {
          size: 17,
          strokeWidth: 1.75,
        })}
      </span>
      <span className="text-sm sm:text-base font-medium tracking-tight whitespace-nowrap">
        {tech.name}
      </span>
    </motion.div>
  );
};

/* ------------------------- Continuous ticker strip ------------------------- */
// Same proven technique as the Services marquee (tripled content,
// xPercent loop, paused via IntersectionObserver off-screen) — reused
// deliberately rather than a new mechanism, since that one is already
// known to run smoothly on this exact page.
const TechTicker: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rowRef = useRef<HTMLDivElement>(null);
  const tweenRef = useRef<gsap.core.Tween | null>(null);
  const row = [...allTools, ...allTools, ...allTools];

  useGSAP(
    () => {
      tweenRef.current = gsap.to(rowRef.current, {
        xPercent: -100 / 3,
        ease: "none",
        repeat: -1,
        duration: 55,
      });
    },
    { scope: containerRef },
  );

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) tweenRef.current?.play();
        else tweenRef.current?.pause();
      },
      { threshold: 0 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative overflow-hidden w-full [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]"
    >
      <div ref={rowRef} className="flex gap-3 w-max">
        {row.map((tech, i) => (
          <div
            key={`${tech.name}-${i}`}
            className="inline-flex items-center gap-2 rounded-full border border-border/60 px-4 py-2 flex-shrink-0"
          >
            <span className="text-muted-foreground/70">
              {React.cloneElement(tech.icon as React.ReactElement, {
                size: 15,
                strokeWidth: 1.75,
              })}
            </span>
            <span className="text-sm text-muted-foreground/70 whitespace-nowrap">
              {tech.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ------------------------------ Skills Component ------------------------------ */
const Skills: React.FC = () => {
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
          <h2 className="text-[clamp(3.3rem,8vw,6rem)] font-black leading-[1] tracking-tight">
            <SplitText as="span" className="block">Skills &</SplitText>
            <SplitText as="span" className="mt-2 block font-light text-muted-foreground">
              Technologies
            </SplitText>
          </h2>
          <motion.p
            variants={sectionVariants}
            className="mt-10 text-lg sm:text-xl text-muted-foreground leading-relaxed"
          >
            {totalTools} tools across {techCategories.length} domains — from
            DSA fundamentals to production AI/ML systems, the stack I
            actually reach for, not a resume list.
          </motion.p>
        </motion.div>

        {/* Continuous ticker */}
        <motion.div
          variants={sectionVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.25 }}
          className="mt-12"
        >
          <TechTicker />
        </motion.div>

        {/* Tech Categories */}
        <motion.div
          className="mt-16 space-y-12"
          variants={categoryListVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
        >
          {techCategories.map((category, catIdx) => (
            <motion.div key={category.label} variants={categoryBlockVariants}>
              <div className="mb-5 flex items-baseline gap-4">
                <span className="font-mono text-sm text-foreground/25">
                  {String(catIdx + 1).padStart(2, "0")}
                </span>
                <p className="text-xs sm:text-sm tracking-[0.3em] uppercase text-muted-foreground/70">
                  {category.label}
                </p>
                <span className="text-xs text-foreground/30">
                  {category.items.length} tools
                </span>
              </div>

              <motion.div
                className="flex flex-wrap gap-3"
                style={{ perspective: 500 }}
                variants={pillContainerVariants}
              >
                {category.items.map((tech) => (
                  <TechPill key={tech.name} tech={tech} />
                ))}
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default memo(Skills);
