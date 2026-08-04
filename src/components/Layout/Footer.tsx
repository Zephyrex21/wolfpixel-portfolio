import React, { memo } from "react";
import { motion } from "framer-motion";
import { Github, Linkedin, Mail, Code2, MapPin } from "lucide-react";
import { staggerContainer, fadeUp } from "../../utils/animations";

/* ===================== COMPONENT ===================== */

const Footer: React.FC = () => {
  return (
    <footer className="relative mt-10 border-t border-border overflow-hidden">
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={{
          once: true,
          amount: 0.2,
        }}
        className="
          max-w-7xl mx-auto
          px-4 lg:px-8
          py-10 md:py-15
        "
      >
        {/* STATEMENT */}
        <motion.h2
          variants={fadeUp}
          className="
            font-funnel font-extrabold
            text-[clamp(3.5rem,8vw,6rem)]
            leading-[1.05]
            tracking-tight
            max-w-4xl
          "
        >
          Let's build something <br className="hidden sm:block" />
          worth shipping.
        </motion.h2>

        <motion.p
          variants={fadeUp}
          className="
            mt-6 sm:mt-8
            max-w-2xl
            text-base md:text-lg
            text-muted-foreground
            leading-relaxed
          "
        >
          I'm Saurabh Raj Shekhar — a full-stack developer and CSE (Data
          Science) student at NSUT Delhi. I build MERN applications, AI/ML
          tools, and agentic systems, and I ship most of what I learn.
        </motion.p>

        {/* LINKS */}
        <motion.div
          variants={staggerContainer}
          className="
            mt-8
            grid grid-cols-1
            gap-8 md:gap-16 lg:gap-20
            md:grid-cols-3
          "
        >
          {/* CONTACT */}
          <motion.div variants={fadeUp} className="space-y-5">
            <h4 className="text-xs md:text-sm lg:text-lg tracking-widest uppercase text-muted-foreground">
              Contact
            </h4>
            <a
              href="mailto:shekharsaurabhraj@gmail.com"
              className="
                flex items-center gap-2 md:gap-3
                text-foreground/80
                hover:text-foreground
                transition-colors
              "
            >
              <Mail className="w-4 h-4 shrink-0" />
              shekharsaurabhraj@gmail.com
            </a>
            <span
              className="
                flex items-center gap-2 md:gap-3
                text-foreground/80
              "
            >
              <MapPin className="w-4 h-4 shrink-0" />
              New Delhi, India
            </span>
          </motion.div>

          {/* SOCIALS */}
          <motion.div variants={fadeUp} className="space-y-5">
            <h4 className="text-xs md:text-sm lg:text-lg tracking-widest uppercase text-muted-foreground">
              Online
            </h4>

            <div className="flex flex-col gap-3 text-foreground/80">
              <a
                href="https://github.com/Zephyrex21"
                target="_blank"
                className="flex items-center gap-3 hover:text-foreground transition-colors"
                rel="noreferrer"
              >
                <Github className="w-4 h-4" /> GitHub
              </a>

              <a
                href="https://www.linkedin.com/in/saurabh-raj-shekhar-8a92b73b0/"
                target="_blank"
                className="flex items-center gap-3 hover:text-foreground transition-colors"
                rel="noreferrer"
              >
                <Linkedin className="w-4 h-4" /> LinkedIn
              </a>

              <a
                href="https://leetcode.com/u/Zephyrex_21/"
                target="_blank"
                className="flex items-center gap-3 hover:text-foreground transition-colors"
                rel="noreferrer"
              >
                <Code2 className="w-4 h-4" /> LeetCode
              </a>
            </div>
          </motion.div>

          {/* NAV */}
          <motion.div variants={fadeUp} className="space-y-5">
            <h4 className="text-xs md:text-sm lg:text-lg tracking-widest uppercase text-muted-foreground">
              Explore
            </h4>

            <div className="flex flex-col gap-3 text-foreground/80">
              <a
                href="#projects"
                className="hover:text-foreground transition-colors"
              >
                Projects
              </a>
              <a
                href="#tools"
                className="hover:text-foreground transition-colors"
              >
                Toolbox
              </a>
              <a
                href="#skills"
                className="hover:text-foreground transition-colors"
              >
                Skills
              </a>
              <a
                href="#about"
                className="hover:text-foreground transition-colors"
              >
                My Journey
              </a>
              <a
                href="#contact"
                className="hover:text-foreground transition-colors"
              >
                Get In Touch
              </a>
            </div>
          </motion.div>
        </motion.div>

        {/* BOTTOM */}
        <motion.div
          variants={fadeUp}
          className="
            mt-10 
            pt-6 sm:pt-8
            border-t border-border
            flex flex-col sm:flex-row
            items-center justify-between
            gap-4
            text-sm md:text-base
            text-muted-foreground font-funnel
          "
        >
          <p>© {new Date().getFullYear()} Saurabh Raj Shekhar</p>
          <p>First, solve the problem. Then, write the code.</p>
        </motion.div>
      </motion.div>
    </footer>
  );
};

export default memo(Footer);
