import React from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Github } from "lucide-react";
import { miniProjectItem } from "../../utils/constants";
import { staggerContainer, fadeUp } from "../../utils/animations";

const MoreProjects: React.FC<{ projects: miniProjectItem[] }> = ({
  projects,
}) => {
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
          {projects.map((project) => (
            <motion.div
              key={project.title}
              variants={fadeUp}
              className="group relative rounded-2xl border border-border p-6 transition-colors duration-300 hover:border-foreground/50"
            >
              <div className="flex items-start justify-between gap-3">
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

              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                {project.description}
              </p>

              <p className="mt-4 font-mono text-[11px] tracking-wide text-muted-foreground/70">
                {project.stack}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default MoreProjects;
