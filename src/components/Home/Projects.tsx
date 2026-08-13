import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, ChevronDown, Github } from "lucide-react";
import { projectItem, Theme } from "../../utils/constants";
import { staggerContainer, fadeUp, EASE_PREMIUM } from "../../utils/animations";
import { useMediaQuery } from "../../utils/useMediaQuery";
import SplitText from "../SplitText";

/* ===================== ANIMATIONS ===================== */

const bgFill = {
  hidden: { scaleX: 0 },
  show: {
    scaleX: 1,
    transition: {
      duration: 0.35,
      ease: EASE_PREMIUM,
    },
  },
};

/* ===================== PREVIEW (real screenshot, else generated gradient) ===================== */

const ProjectPreview: React.FC<{
  project: projectItem;
  theme: Theme;
  /** Plays a left-to-right clip-path wipe on mount — used when a project
      card expands (a deliberate reveal moment), skipped for the
      cursor-following floating preview (which needs to feel instant,
      not staged). */
  revealOnMount?: boolean;
}> = ({ project, theme, revealOnMount = false }) => {
  const [errored, setErrored] = useState(false);
  const src = project.image?.[theme];

  const wipeProps = revealOnMount
    ? {
        initial: { clipPath: "inset(0 100% 0 0)" },
        animate: { clipPath: "inset(0 0% 0 0)" },
        transition: { duration: 0.7, ease: EASE_PREMIUM },
      }
    : {};

  if (src && !errored) {
    return (
      <motion.div
        {...wipeProps}
        className="relative aspect-video overflow-hidden rounded-xl border border-border"
      >
        <img
          src={src}
          alt={`${project.title} preview`}
          loading="lazy"
          onError={() => setErrored(true)}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 hover:scale-[1.04]"
        />
      </motion.div>
    );
  }

  // Generated fallback — keeps every row feeling intentional even
  // without a captured screenshot.
  return (
    <motion.div
      {...wipeProps}
      className="relative aspect-video overflow-hidden rounded-xl border border-border flex items-center justify-center"
      style={{
        backgroundImage: `linear-gradient(135deg, ${project.gradientFrom}, ${project.gradientTo})`,
      }}
    >
      <div
        className="absolute inset-0 opacity-[0.15]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, currentColor 0, currentColor 1px, transparent 1px, transparent 12px)",
          color: "#fff",
        }}
      />
      <span className="relative font-funnel text-2xl sm:text-3xl font-bold text-white/90 tracking-tight px-4 text-center">
        {project.title}
      </span>
    </motion.div>
  );
};

/* ===================== COMPONENT ===================== */

const Projects: React.FC<{ projects: projectItem[]; theme: Theme }> = ({
  projects,
  theme,
}) => {
  const [hovered, setHovered] = useState<number | null>(null);
  const [expanded, setExpanded] = useState<number | null>(null);

  const isDesktop = useMediaQuery("(min-width: 1024px)");

  // ===== Floating cursor-follow preview (desktop only) =====
  // Shows a peek of the project image/gradient near the cursor while
  // hovering a row, before the person even clicks to expand it.
  const floatingRef = useRef<HTMLDivElement>(null);
  const hoveredRef = useRef<number | null>(null);
  const expandedRef = useRef<number | null>(null);
  const targetPos = useRef({ x: 0, y: 0 });
  const currentPos = useRef({ x: 0, y: 0 });
  const rafId = useRef<number | null>(null);

  useEffect(() => {
    expandedRef.current = expanded;
  }, [expanded]);

  const followLoop = () => {
    currentPos.current.x += (targetPos.current.x - currentPos.current.x) * 0.16;
    currentPos.current.y += (targetPos.current.y - currentPos.current.y) * 0.16;

    const shouldShow =
      hoveredRef.current !== null && hoveredRef.current !== expandedRef.current;

    if (floatingRef.current) {
      floatingRef.current.style.transform = `translate3d(${currentPos.current.x}px, ${currentPos.current.y}px, 0) scale(${shouldShow ? 1 : 0.92})`;
      floatingRef.current.style.opacity = shouldShow ? "1" : "0";
    }

    rafId.current = requestAnimationFrame(followLoop);
  };

  const handleListMouseMove = (e: React.MouseEvent) => {
    targetPos.current = { x: e.clientX + 26, y: e.clientY - 100 };
    if (!rafId.current) {
      currentPos.current = { ...targetPos.current };
      rafId.current = requestAnimationFrame(followLoop);
    }
  };

  const handleListMouseLeave = () => {
    hoveredRef.current = null;
    setHovered(null);
    setTimeout(() => {
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
        rafId.current = null;
      }
    }, 400);
  };

  useEffect(() => {
    return () => {
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, []);

  return (
    <section id="projects" className="scroll-mt-14 py-8 lg:py-16">
      {/* Cursor-follow floating preview */}
      <div
        ref={floatingRef}
        className="fixed top-0 left-0 z-50 pointer-events-none hidden lg:block w-56 xl:w-64 opacity-0"
      >
        <div className="aspect-video rounded-xl overflow-hidden border border-border shadow-2xl bg-background">
          {hovered !== null && (
            <ProjectPreview project={projects[hovered]} theme={theme} />
          )}
        </div>
      </div>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        className="mx-auto max-w-6xl px-4 sm:px-6"
      >
        {/* ===== HEADER ===== */}
        <motion.div variants={fadeUp} className="mb-10 lg:mb-15">
          <h2 className="text-[clamp(3.5rem,8vw,6rem)] font-black leading-[1]">
            <SplitText as="span" className="block">Selected</SplitText>
            <SplitText as="span" className="block font-light text-muted-foreground">
              Projects
            </SplitText>
          </h2>

          <p className="mt-8 max-w-2xl text-lg sm:text-xl text-muted-foreground leading-relaxed">
            A curated selection of products, tools, and AI/ML systems I've
            built — focused on real-world usability and engineering depth.
          </p>
        </motion.div>

        {/* ===== PROJECT LIST ===== */}
        <motion.div
          className="divide-y divide-border border-b border-border"
          variants={{ hidden: {}, show: {} }}
          onMouseMove={(e) => isDesktop && handleListMouseMove(e)}
          onMouseLeave={() => isDesktop && handleListMouseLeave()}
        >
          {projects.map((project, idx) => {
            const isHovered = hovered === idx;
            const isExpanded = expanded === idx;

            return (
              <motion.div
                key={project.title}
                variants={fadeUp}
                className="relative"
                onMouseEnter={() => {
                  if (!isDesktop) return;
                  setHovered(idx);
                  hoveredRef.current = idx;
                }}
              >
                {/* Hover Background */}
                <motion.div
                  variants={bgFill}
                  initial="hidden"
                  animate={isHovered ? "show" : "hidden"}
                  className="lg:absolute inset-0 origin-left bg-foreground"
                />

                {/* ================= ROW ================= */}
                <div
                  onClick={() => setExpanded(isExpanded ? null : idx)}
                  className={`
      relative z-10
      flex flex-col sm:flex-row sm:items-center lg:grid lg:grid-cols-[70px_1.4fr_1.6fr_auto_24px]
     gap-2 sm:gap-6
      px-2 py-4 md:px-4 md:py-6
      lg:px-6 lg:py-8
      cursor-pointer
      transition-colors duration-300
      ${isHovered ? "text-background" : "text-foreground"}
    `}
                >
                  {/* Index */}
                  <span
                    className={`font-funnel text-sm ${
                      isHovered ? "text-background/60" : "text-muted-foreground"
                    }`}
                  >
                    {String(idx + 1).padStart(2, "0")}
                  </span>

                  <div className="flex gap-4 items-end justify-between">
                    {/* Title + Meta Pills */}
                    <div>
                      <h3 className="font-funnel text-[clamp(2rem,3vw,3rem)] font-bold leading-tight">
                        {project.title}
                      </h3>

                      <div className="mt-3 flex gap-2">
                        {/* Project Type */}
                        <span
                          className={`
            rounded-full px-3 py-[5px]
            text-[11px] font-medium tracking-wide
            border
            ${
              isHovered
                ? "border-background/40 text-background"
                : "border-border text-muted-foreground"
            }
          `}
                        >
                          {project.projectType === "personal"
                            ? "Personal"
                            : "Client"}
                        </span>

                        {/* Status */}
                        <span
                          className={`
            rounded-full px-3 py-[5px]
            text-[11px] font-medium tracking-wide
            border
            ${
              isHovered
                ? "border-background/40 text-background"
                : "border-border text-muted-foreground"
            }
          `}
                        >
                          {project.status === "completed"
                            ? "Completed"
                            : "In Progress"}
                        </span>
                      </div>
                    </div>

                    {/* Chevron for smaller screens */}
                    <motion.span
                      animate={{ rotate: isExpanded ? 180 : 0 }}
                      transition={{ duration: 0.3, ease: EASE_PREMIUM }}
                      className="sm:hidden flex items-center justify-center"
                    >
                      <ChevronDown
                        size={18}
                        className={
                          isHovered
                            ? "text-background/60"
                            : "text-muted-foreground"
                        }
                      />
                    </motion.span>
                  </div>

                  {/* Tech Pills (MAIN ROW – hidden when expanded) */}
                  <motion.div
                    animate={{
                      opacity: isExpanded ? 0 : 1,
                      height: isExpanded ? 0 : "auto",
                    }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    className="hidden lg:flex flex-wrap gap-2 overflow-hidden"
                  >
                    {project.tech.slice(0, 4).map((t) => (
                      <span
                        key={t}
                        className={`
            rounded-full px-3 py-[5px]
            text-[11px] font-medium tracking-wide
            border
            ${
              isHovered
                ? "border-background/40 text-background"
                : "border-border text-muted-foreground"
            }
          `}
                      >
                        {t}
                      </span>
                    ))}
                  </motion.div>

                  {/* View Project */}
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className={`
        rounded-full px-4 py-[7px]
        text-[11px] font-medium tracking-wide
        border transition-colors
        flex items-center gap-2 max-w-max sm:ml-auto
        ${
          isHovered
            ? "border-background text-background"
            : "border-border text-muted-foreground"
        }
      `}
                  >
                    View Project <ExternalLink size={14} />
                  </a>

                  {/* Chevron for larger screens */}
                  <motion.span
                    animate={{ rotate: isExpanded ? 180 : 0 }}
                    transition={{ duration: 0.3, ease: EASE_PREMIUM }}
                    className="hidden sm:flex items-center justify-center"
                  >
                    <ChevronDown
                      size={18}
                      className={
                        isHovered
                          ? "text-background/60"
                          : "text-muted-foreground"
                      }
                    />
                  </motion.span>
                </div>

                {/* ================= EXPANDED CONTENT ================= */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.45, ease: EASE_PREMIUM }}
                      className="relative z-10 overflow-hidden"
                    >
                      <div
                        className="
        max-w-6xl
        px-4 py-6
        grid grid-cols-1 lg:grid-cols-12
        gap-6 lg:gap-10
      "
                      >
                        {/* Preview */}
                        <div className="lg:col-span-5">
                          <ProjectPreview project={project} theme={theme} revealOnMount />
                        </div>

                        {/* Description + Tech */}
                        <div className="lg:col-span-7 flex flex-col justify-between">
                          <p
                            className={`
            text-sm md:text-base
            leading-relaxed
            mb-6
            transition-colors
            ${isHovered ? "text-background/80" : "text-muted-foreground"}
          `}
                          >
                            {project.description}
                          </p>

                          <div className="flex flex-wrap gap-2 mb-4">
                            {project.tech.map((t) => (
                              <span
                                key={t}
                                className={`
                rounded-full
                px-3 py-[5px]
                text-[11px]
                font-medium
                tracking-wide
                border
                transition-colors
                ${
                  isHovered
                    ? "border-background/40 text-background"
                    : "border-border text-muted-foreground"
                }
              `}
                              >
                                {t}
                              </span>
                            ))}
                          </div>

                          <a
                            href={project.codeLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className={`
                rounded-full px-4 py-[7px]
                text-[11px] font-medium tracking-wide
                border transition-colors
                flex items-center gap-2 max-w-max
                ${
                  isHovered
                    ? "border-background text-background"
                    : "border-border text-muted-foreground"
                }
              `}
                          >
                            <Github size={14} /> View Code
                          </a>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Projects;
