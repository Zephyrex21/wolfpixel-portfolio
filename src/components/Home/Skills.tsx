import React, { memo } from "react";
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
  Bot,
  Gauge,
  Network,
  TrendingUp,
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

const totalTools = techCategories.reduce((sum, c) => sum + c.items.length, 0);

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
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
};

const categoryBlockVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: EASE_PREMIUM },
  },
};

// Inner: pops each pill in, once its category block starts revealing.
const pillContainerVariants: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.04,
      delayChildren: 0.05,
    },
  },
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
            {totalTools} tools across {techCategories.length} domains — from
            DSA fundamentals to production AI/ML systems, the stack I
            actually reach for, not a resume list.
          </motion.p>
        </motion.div>

        {/* Tech Categories */}
        <motion.div
          className="mt-16 space-y-12"
          variants={categoryListVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
        >
          {techCategories.map((category) => (
            <motion.div key={category.label} variants={categoryBlockVariants}>
              <p className="mb-4 flex items-baseline gap-2 text-xs sm:text-sm tracking-[0.3em] uppercase text-muted-foreground/70">
                {category.label}
                <span className="text-foreground/30 tracking-normal normal-case">
                  · {category.items.length}
                </span>
              </p>

              <motion.div
                className="flex flex-wrap gap-3"
                variants={pillContainerVariants}
              >
                {category.items.map((tech) => (
                  <motion.div
                    key={tech.name}
                    variants={pillVariants}
                    whileHover={{
                      y: -4,
                      transition: { type: "spring", stiffness: 400, damping: 18 },
                    }}
                    className="inline-flex items-center gap-2.5 rounded-full border border-border bg-foreground/[0.02] px-4 py-2.5 sm:px-5 sm:py-3 transition-colors duration-300 hover:border-foreground/40 hover:bg-foreground/[0.06] cursor-default"
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
