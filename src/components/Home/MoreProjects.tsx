import React, { memo, useRef, useState } from "react";
import { motion, Variants } from "framer-motion";
import { ArrowUpRight, Github } from "lucide-react";
import { miniProjectItem } from "../../utils/constants";
import { staggerContainer, fadeUp } from "../../utils/animations";

const TILT_MAX_DEG = 4;

const cardReveal: Variants = {
  hidden: { opacity: 0, y: 26, scale: 0.96 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

/* ===================== Card ===================== */

interface MoreProjectCardProps {
  project: miniProjectItem;
  isDimmed: boolean;
  onHoverStart: () => void;
  onHoverEnd: () => void;
}

const MoreProjectCard: React.FC<MoreProjectCardProps> = ({
  project,
  isDimmed,
  onHoverStart,
  onHoverEnd,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const rectCache = useRef<DOMRect | null>(null);

  const handleMouseEnter = () => {
    rectCache.current = cardRef.current?.getBoundingClientRect() ?? null;
    onHoverStart();
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = rectCache.current ?? el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const rotateY = (x / rect.width - 0.5) * TILT_MAX_DEG * 2;
    const rotateX = (y / rect.height - 0.5) * -TILT_MAX_DEG * 2;

    el.style.setProperty("--x", `${x}px`);
    el.style.setProperty("--y", `${y}px`);
    el.style.transform = `perspective(700px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
  };

  const handleMouseLeave = () => {
    const el = cardRef.current;
    if (el) {
      el.style.transform =
        "perspective(700px) rotateX(0deg) rotateY(0deg) translateY(0px)";
    }
    rectCache.current = null;
    onHoverEnd();
  };

  return (
    <motion.div variants={cardReveal}>
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          opacity: isDimmed ? 0.55 : 1,
          transition:
            "opacity 0.35s ease, transform 0.2s cubic-bezier(0.22, 1, 0.36, 1), border-color 0.3s ease",
        }}
        className="tool-row-tilt group relative rounded-2xl border border-border p-6 overflow-hidden hover:border-foreground/50"
      >
        <div
          className="card-spotlight pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"
          aria-hidden="true"
        />

        <div className="relative flex items-start justify-between gap-3">
          <h4 className="font-funnel text-lg font-bold leading-snug tracking-tight">
            {project.title}
          </h4>
          <div className="flex items-center gap-1 shrink-0 -mt-1 -mr-1">
            <a
              href={project.codeLink}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${project.title} source code`}
              className="p-1.5 text-muted-foreground hover:text-foreground transition-colors"
            >
              <Github size={15} />
            </a>
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${project.title} live site`}
              className="p-1.5 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowUpRight
                size={16}
                className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
              />
            </a>
          </div>
        </div>

        <p className="relative mt-2 text-sm text-muted-foreground leading-relaxed">
          {project.description}
        </p>

        <p className="relative mt-4 font-mono text-[11px] tracking-wide text-muted-foreground/70">
          {project.stack}
        </p>
      </div>
    </motion.div>
  );
};

/* ===================== Section ===================== */

const MoreProjects: React.FC<{ projects: miniProjectItem[] }> = ({
  projects,
}) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  return (
    <section className="scroll-mt-14 py-8 lg:py-16">
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.1 }}
        className="mx-auto max-w-6xl px-4 sm:px-6"
      >
        <motion.p
          variants={fadeUp}
          className="mb-8 text-xs sm:text-sm tracking-[0.35em] uppercase text-muted-foreground"
        >
          Also Built
        </motion.p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project, idx) => (
            <MoreProjectCard
              key={project.title}
              project={project}
              isDimmed={hoveredIdx !== null && hoveredIdx !== idx}
              onHoverStart={() => setHoveredIdx(idx)}
              onHoverEnd={() => setHoveredIdx(null)}
            />
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default memo(MoreProjects);
