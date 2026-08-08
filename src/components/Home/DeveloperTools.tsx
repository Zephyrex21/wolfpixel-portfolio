import React, { useEffect, useRef, useState, memo } from "react";
import { motion, useInView, useReducedMotion, Variants } from "framer-motion";
import { Terminal, Github, Copy, Check } from "lucide-react";
import { toolItem } from "../../utils/constants";
import ToolkitIllustration from "./ToolkitIllustration";

/* ===================== Data ===================== */

const tools: toolItem[] = [
  {
    name: "context-engineering-toolkit",
    description:
      "RAG context/token-optimization pipeline with local transformers.js embeddings, a full production hardening pass (Zod, 48 unit tests, Docker, OpenAPI spec), rated 9/10 production-grade.",
    link: "https://github.com/Zephyrex21/context-engineering-toolkit",
  },
  {
    name: "dev-tools-suite",
    description:
      "30 client-side developer utilities — JWT decoding, JSON formatting, hashing, and more — running entirely in the browser.",
    link: "https://github.com/Zephyrex21/dev-tools-suite",
  },
  {
    name: "claude-leetcode-helper",
    description:
      "A Claude Code Skill that turns LeetCode problems into optimized, well-explained C++ solutions.",
    link: "https://github.com/Zephyrex21/claude-leetcode-helper",
  },
  {
    name: "cors-toolkit",
    description:
      "A focused debugging tool for diagnosing and fixing CORS errors during API development.",
    link: "https://github.com/Zephyrex21/cors-toolkit",
  },
];

/* ===================== Animations ===================== */

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
  },
};

const stagger: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12, delayChildren: 0.15 },
  },
};

/* ===================== Tool Row ===================== */

const TILT_MAX_DEG = 5;

const ToolRow: React.FC<{ tool: toolItem }> = ({ tool }) => {
  const rowRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(rowRef, { once: true, amount: 0.6 });

  const [typed, setTyped] = useState("");
  const [copied, setCopied] = useState(false);

  // One-time typewriter effect when the row scrolls into view.
  useEffect(() => {
    if (!isInView) return;
    let i = 0;
    const text = tool.name;
    const id = setInterval(() => {
      i += 1;
      setTyped(text.slice(0, i));
      if (i >= text.length) clearInterval(id);
    }, 32);
    return () => clearInterval(id);
  }, [isInView, tool.name]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = rowRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const rotateY = (x / rect.width - 0.5) * TILT_MAX_DEG * 2;
    const rotateX = (y / rect.height - 0.5) * -TILT_MAX_DEG * 2;

    el.style.setProperty("--x", `${x}px`);
    el.style.setProperty("--y", `${y}px`);
    el.style.transform = `perspective(700px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.015)`;
  };

  const handleMouseLeave = () => {
    const el = rowRef.current;
    if (!el) return;
    el.style.transform = "perspective(700px) rotateX(0deg) rotateY(0deg) scale(1)";
  };

  const handleCopy = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(`git clone ${tool.link}.git`);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      // Clipboard API unavailable in this context — fail silently.
    }
  };

  const isTyping = typed.length < tool.name.length;

  return (
    <motion.div
      ref={rowRef}
      variants={fadeUp}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="
        tool-row-tilt
        group
        relative
        overflow-hidden
        rounded-xl
        border border-background/10
        px-5 py-5
        flex flex-col md:flex-row
        md:items-start md:justify-between
        lg:flex-col xl:flex-row
        gap-5
      "
    >
      {/* Cursor-tracked spotlight */}
      <div
        className="tool-spotlight pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        aria-hidden="true"
      />

      <div className="relative">
        <div className="flex items-center gap-3">
          <Terminal size={14} className="shrink-0" />
          <span className="font-mono text-sm break-all">
            {typed}
            {isTyping && <span className="typewriter-cursor h-4 align-middle" />}
          </span>

          <button
            onClick={handleCopy}
            aria-label={`Copy git clone command for ${tool.name}`}
            className="
              shrink-0 p-1 rounded-md
              text-background/50 hover:text-background
              hover:bg-background/10
              transition-colors duration-200
              cursor-pointer
            "
          >
            {copied ? <Check size={13} /> : <Copy size={13} />}
          </button>
        </div>

        <p className="mt-2 text-sm leading-relaxed text-background/90 max-w-md">
          {tool.description}
        </p>
      </div>

      {/* CTA */}
      <a
        href={tool.link}
        target="_blank"
        rel="noopener noreferrer"
        className="
          relative
          inline-flex items-center gap-2
          rounded-full
          border border-background/25
          bg-background/10
          px-4 py-2
          text-[11px] font-medium tracking-wide
          text-background
          transition-all duration-300
          hover:bg-background/20
          hover:scale-[1.03]
          self-start shrink-0
        "
        aria-label={`View ${tool.name} on GitHub`}
      >
        View Repo
        <Github size={14} />
      </a>
    </motion.div>
  );
};

/* ===================== Component ===================== */

const DeveloperTools: React.FC = () => {
  const prefersReducedMotion = useReducedMotion();
  return (
    <section id="tools" className="scroll-mt-14 py-8 lg:py-16">
      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        className="mx-auto max-w-6xl"
      >
        {/* Header */}
        <motion.div variants={fadeUp} className="mb-10 lg:mb-15 px-4 sm:px-6">
          <h2 className="text-[clamp(3.2rem,7vw,5.5rem)] font-black leading-[1.1] tracking-tight">
            Developer
            <br />
            <span className="font-light text-muted-foreground">
              Tools & Open Source
            </span>
          </h2>

          <p className="mt-8 max-w-2xl text-lg sm:text-xl text-muted-foreground leading-relaxed">
            Open-source utilities and toolkits focused on developer
            experience, productivity, and real-world usage.
          </p>
        </motion.div>

        {/* Content */}
        <motion.div variants={stagger} className="px-2 sm:px-6">
          <motion.div variants={fadeUp}>
            <motion.div
              animate={prefersReducedMotion ? undefined : { y: [0, -10, 0] }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="bg-foreground rounded-2xl text-background shadow-xl"
            >
              <div
                className="
                  grid grid-cols-1 gap-10 px-4 py-8 sm:px-6 sm:py-12
                  lg:grid-cols-[1fr_1.3fr]
                "
              >
                {/* Left */}
                <motion.div variants={fadeUp} className="flex flex-col">
                  <div>
                    <h3 className="text-[clamp(1.6rem,4vw,2.2rem)] font-semibold tracking-tight">
                      Toolkits & CLI Tools
                    </h3>

                    <p className="mt-4 leading-relaxed max-w-md text-background/90">
                      Small, focused tools built with Node.js, TypeScript, and
                      Python. Designed to be practical, well-tested, and
                      genuinely reusable.
                    </p>
                  </div>

                  <div className="flex-1 mt-8 min-h-[200px] text-background/70">
                    <ToolkitIllustration />
                  </div>
                </motion.div>

                {/* Right */}
                <motion.div variants={stagger} className="space-y-4">
                  {tools.map((tool) => (
                    <ToolRow key={tool.name} tool={tool} />
                  ))}
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default memo(DeveloperTools);
