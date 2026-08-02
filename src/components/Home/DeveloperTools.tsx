import React from "react";
import { motion, Variants } from "framer-motion";
import { Terminal, Github } from "lucide-react";
import { toolItem } from "../../utils/constants";

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

/* ===================== Component ===================== */

const DeveloperTools: React.FC = () => {
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
          <motion.div
            variants={fadeUp}
            className="bg-foreground rounded-2xl text-background shadow-xl"
          >
            <div
              className="
                grid grid-cols-1 gap-10 px-4 py-8 sm:px-6 sm:py-12
                lg:grid-cols-[1fr_1.3fr]
              "
            >
              {/* Left */}
              <motion.div variants={fadeUp}>
                <h3 className="text-[clamp(1.6rem,4vw,2.2rem)] font-semibold tracking-tight">
                  Toolkits & CLI Tools
                </h3>

                <p className="mt-4 leading-relaxed max-w-md text-background/90">
                  Small, focused tools built with Node.js, TypeScript, and
                  Python. Designed to be practical, well-tested, and genuinely
                  reusable.
                </p>
              </motion.div>

              {/* Right */}
              <motion.div variants={stagger} className="space-y-7">
                {tools.map((tool) => (
                  <motion.div
                    key={tool.name}
                    variants={fadeUp}
                    className="
                      flex flex-col md:flex-row
                      md:items-start md:justify-between
                      lg:flex-col xl:flex-row
                      gap-5
                    "
                  >
                    <div>
                      <div className="flex items-center gap-3">
                        <Terminal size={14} />
                        <span className="font-mono text-sm break-all">
                          {tool.name}
                        </span>
                      </div>

                      <p className="mt-2 text-sm leading-relaxed text-background/90">
                        {tool.description}
                      </p>
                    </div>

                    {/* CTA */}
                    <a
                      href={tool.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="
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
                ))}
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default DeveloperTools;
