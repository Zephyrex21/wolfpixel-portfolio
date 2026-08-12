import { useState, useRef, memo } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { Plus } from "lucide-react";
import {
  staggerContainer,
  staggerContainerSlow,
  fadeUp,
  EASE_PREMIUM,
} from "../../utils/animations";
import { journeyItem } from "../../utils/constants";
import { useMediaQuery } from "../../utils/useMediaQuery";

/* ===================== DATA ===================== */

const dsaPlatforms = [
  { name: "LeetCode", solved: 85, href: "https://leetcode.com/u/Zephyrex_21/" },
  { name: "Code360", solved: 132, href: "https://www.naukri.com/code360/profile/Zephyrex" },
  { name: "GeeksforGeeks", solved: 18, href: "https://www.geeksforgeeks.org/profile/shekharsagbw7" },
];

// Grounded in actual repo history from github.com/Zephyrex21
const journeyItems: journeyItem[] = [
  {
    period: "Aug 2025",
    title: "First Portfolio & Web Foundations",
    details:
      "Built my first portfolio and small UI experiments while learning React fundamentals — the starting point for everything after.",
  },
  {
    period: "Oct – Nov 2025",
    title: "Data Structures, Made Visual",
    details:
      "Built a CPU scheduling simulator and a red-black tree visualizer to internalize DSA by watching the algorithms run, not just reading pseudocode.",
  },
  {
    period: "Apr 2026",
    title: "Theory of Computation, Visualized",
    details:
      "Shipped interactive explainers for automata theory, CFG/Earley parsing, and CSP backtracking (Sudoku, N-Queens, graph coloring) alongside a quantum computing walkthrough.",
  },
  {
    period: "May – Jun 2026",
    title: "MERN Stack, For Real",
    details:
      "Rebuilt MERN fundamentals from scratch with JWT auth and Express/Mongoose starters, then shipped full products: a botanical sanctuary app, token-based file sharing, an OSS discovery tool, and an ISRO Bharatiya Antariksh Hackathon 2026 submission.",
  },
  {
    period: "Jul 2026",
    title: "Into AI & Agentic Systems",
    details:
      "Moved from full-stack apps into LLM-powered tools — a RAG context-engineering toolkit with a full production hardening pass, an agentic RAG assistant with verifiable citations, an in-browser data analyst agent, and a Grad-CAM interpretability studio.",
  },
  {
    period: "Aug 2026 — Now",
    title: "Agents and Full-Stack, in Parallel",
    details:
      "Currently building a multimodal AI agent with wake-word detection, autonomous coding tools, and persistent memory — alongside a full MERN platform for my own class section, with three-role auth, Docker + CI, and 40+ tests. Two different kinds of production-grade, at the same time.",
  },
];

const certifications = [
  { name: "AWS — Fundamentals of ML & AI", date: "Nov 2025" },
  { name: "AWS — Designing Blockchain Solutions", date: "Nov 2025" },
  { name: "NPTEL — Soft Skills & Personality Development", date: "Aug–Nov 2025" },
];

/* ===================== COMPONENT ===================== */

const About = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const journeyRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: journeyRef,
    offset: ["start 0.8", "end 0.65"],
  });
  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  const isDesktop = useMediaQuery("(min-width: 1024px)");

  const toggleItem = (idx: number) => {
    setActiveIndex((prev) => (prev === idx ? null : idx));
  };

  return (
    <section id="about" className="py-8 lg:py-16 scroll-mt-14">
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.05 }}
        className="max-w-6xl mx-auto px-4 sm:px-6"
      >
        {/* TITLE */}
        <motion.h2
          variants={fadeUp}
          className="font-funnel font-extrabold text-[clamp(3.5rem,9vw,7rem)] leading-[1.02] tracking-tight max-w-4xl"
        >
          About Me
        </motion.h2>

        {/* DESCRIPTION */}
        <motion.p
          variants={fadeUp}
          className="mt-6 md:mt-8 max-w-3xl text-base sm:text-xl leading-[1.9] text-muted-foreground"
        >
          I'm a 3rd-year CSE (Data Science) student at NSUT Delhi who learns
          by shipping, not by watching tutorials. This past year that's meant
          full MERN platforms with real auth and test coverage, an ISRO
          hackathon submission, and — most recently — a shift into agentic
          AI: RAG pipelines with verifiable citations, an in-browser data
          analyst agent, and vision-model interpretability tooling.
          <br />
          <br />
          Underneath all of it is 235+ solved DSA problems across LeetCode,
          Code360, and GeeksforGeeks. Competitive programming isn't a
          separate hobby from the software — it's the other half of how I
          think about writing it.
        </motion.p>

        {/* DSA PRACTICE */}
        <motion.div variants={fadeUp} className="mt-8 md:mt-10">
          <p className="mb-3 text-xs sm:text-sm tracking-[0.35em] uppercase text-muted-foreground/70">
            DSA Practice
          </p>
          <div className="flex flex-wrap gap-3">
            {dsaPlatforms.map((platform) => (
              <a
                key={platform.name}
                href={platform.href}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-full border border-border text-xs sm:text-sm text-muted-foreground hover:border-foreground/40 hover:text-foreground transition-colors"
              >
                {platform.name}{" "}
                <span className="text-foreground/40">
                  · {platform.solved} solved
                </span>
              </a>
            ))}
          </div>
        </motion.div>

        {/* CERTIFICATIONS */}
        <motion.div
          variants={fadeUp}
          className="mt-6 md:mt-8 flex flex-wrap gap-3"
        >
          {certifications.map((cert) => (
            <span
              key={cert.name}
              className="px-4 py-2 rounded-full border border-border text-xs sm:text-sm text-muted-foreground"
            >
              {cert.name}{" "}
              <span className="text-foreground/40">· {cert.date}</span>
            </span>
          ))}
        </motion.div>

        {/* JOURNEY */}
        <motion.div variants={staggerContainerSlow} className="mt-12 lg:mt-24">
          <motion.p
            variants={fadeUp}
            className="mb-10 text-xs sm:text-sm tracking-[0.35em] uppercase text-muted-foreground"
          >
            Journey
          </motion.p>

          <div ref={journeyRef} className="relative">
            {/* Track — always visible, faint */}
            <div className="hidden lg:block absolute left-[9.25rem] top-2 bottom-2 w-px bg-border" />
            {/* Fill — draws in as the section scrolls through view */}
            <motion.div
              className="hidden lg:block absolute left-[9.25rem] top-2 w-px bg-foreground"
              style={{ height: lineHeight }}
            />

            <div className="space-y-10 md:space-y-14 lg:space-y-20">
              {journeyItems.map((item, idx) => {
              const isActive = activeIndex === idx;

              return (
                <motion.div
                  key={idx}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, amount: 0.4 }}
                  onHoverStart={() => isDesktop && setActiveIndex(idx)}
                  onHoverEnd={() => isDesktop && setActiveIndex(null)}
                  className="relative"
                >
                  {/* HEADER */}
                  <motion.div
                    onClick={() => !isDesktop && toggleItem(idx)}
                    whileHover={isDesktop ? { scale: 1.015 } : undefined}
                    transition={{ type: "spring", stiffness: 260, damping: 24 }}
                    className="cursor-pointer py-2 sm:py-3 lg:py-4"
                  >
                    {/* MOBILE */}
                    <div className="lg:hidden space-y-2">
                      <span className="font-funnel text-sm sm:text-base text-muted-foreground mb-2">
                        {item.period}
                      </span>

                      <div className="flex items-center justify-between gap-6 mt-2">
                        <h4 className="font-semibold text-xl sm:text-3xl leading-tight tracking-tight text-foreground">
                          {item.title}
                        </h4>

                        <motion.span
                          animate={{ rotate: isActive ? 45 : 0 }}
                          transition={{
                            type: "spring",
                            stiffness: 360,
                            damping: 22,
                          }}
                          className="text-muted-foreground shrink-0"
                        >
                          <Plus size={24} />
                        </motion.span>
                      </div>
                    </div>

                    {/* DESKTOP */}
                    <div className="hidden lg:flex items-center justify-between gap-10">
                      <div className="flex items-center gap-10">
                        <span className="font-mono text-sm text-muted-foreground w-32 shrink-0">
                          {item.period}
                        </span>

                        <h4 className="font-semibold text-[clamp(1.9rem,3vw,2.5rem)] leading-tight tracking-tight text-foreground max-w-3xl">
                          {item.title}
                        </h4>
                      </div>

                      <motion.span
                        animate={{ rotate: isActive ? 45 : 0 }}
                        transition={{
                          type: "spring",
                          stiffness: 360,
                          damping: 22,
                        }}
                        className="text-muted-foreground shrink-0"
                      >
                        <Plus size={26} />
                      </motion.span>
                    </div>
                  </motion.div>

                  {/* DETAILS */}
                  <AnimatePresence initial={false}>
                    {isActive && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{
                          height: "auto",
                          opacity: 1,
                          transition: {
                            height: { duration: 0.5, ease: EASE_PREMIUM },
                            opacity: { duration: 0.3, delay: 0.1 },
                          },
                        }}
                        exit={{
                          height: 0,
                          opacity: 0,
                          transition: { duration: 0.3 },
                        }}
                        className="overflow-hidden"
                      >
                        <p className="mt-3 max-w-3xl text-muted-foreground text-base sm:text-lg leading-[1.85] lg:pl-[10.5rem]">
                          {item.details}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* LINE */}
                  <div className="mt-4 lg:mt-8 h-px bg-border" />
                </motion.div>
              );
            })}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default memo(About);
