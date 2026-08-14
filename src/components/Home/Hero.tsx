import React, { memo } from "react";
import { motion } from "framer-motion";
import { Github, Linkedin, Mail, Code2 } from "lucide-react";
import YourImg from "/assets/photo-cutout.webp";
import CVPDF from "/assets/resume.pdf";
import { SocialLink } from "../../utils/constants";
import { scrollToTarget } from "../../utils/smoothScroll";
import CountUp from "../CountUp";
import TypewriterRoles from "./TypewriterRoles";
import SplitText from "../SplitText";
import { useGithubStats } from "../../utils/useGithubStats";
import {
  staggerContainerSlow,
  fadeUp,
  scaleReveal,
  hoverScale,
} from "../../utils/animations";

/* ===================== COMPONENT ===================== */

const Hero: React.FC = () => {
  const { repoCount } = useGithubStats();

  const socials: SocialLink[] = [
    { href: "https://github.com/Zephyrex21", icon: <Github />, label: "GitHub" },
    {
      href: "https://www.linkedin.com/in/saurabh-raj-shekhar-8a92b73b0/",
      icon: <Linkedin />,
      label: "LinkedIn",
    },
    {
      href: "https://leetcode.com/u/Zephyrex_21/",
      icon: <Code2 />,
      label: "LeetCode",
    },
    { href: "mailto:shekharsaurabhraj@gmail.com", icon: <Mail />, label: "Email" },
  ];

  return (
    <section id="home" className="relative mb-10 sm:mb-0 sm:h-[94vh] overflow-hidden">
      <div className="xl:max-w-7xl mx-auto px-4 sm:px-6 w-full h-full">
        <div className="flex gap-20 h-full lg:items-center">
          {/* LEFT — TEXT */}
          <motion.div
            variants={staggerContainerSlow}
            initial="hidden"
            animate="show"
            className="w-full max-w-2xl z-10 relative"
          >
            <motion.p
              variants={fadeUp}
              className="font-jost text-xs ml:text-sm tracking-widest text-muted-foreground mb-4"
            >
              HELLO, I AM
            </motion.p>

            <h1
              className="
                text-[clamp(3rem,9vw,7rem)]
                font-funnel
                font-extrabold
                leading-[1.08]
                tracking-tight
                mb-6 md:mb-8
              "
            >
              <SplitText as="span" className="block">Saurabh Raj</SplitText>
              <SplitText as="span" className="block">Shekhar</SplitText>
            </h1>

            <motion.p
              variants={fadeUp}
              className="sm:max-w-sm lg:max-w-xl font-jost text-lg ml:text-xl sm:text-lg md:text-xl tracking-widest text-muted-foreground mb-4 md:mb-6 uppercase min-h-[1.6em] sm:min-h-[1.4em]"
            >
              <TypewriterRoles />
            </motion.p>

            <motion.p
              variants={fadeUp}
              className="sm:max-w-sm md:max-w-md lg:max-w-xl text-base ml:text-lg xsm:text-xl sm:text-lg lg:text-xl text-muted-foreground leading-relaxed mb-4 md:mb-8"
            >
              3rd-year CSE (Data Science) student at NSUT Delhi. I build MERN
              applications and AI/ML systems — from agentic tools and RAG
              pipelines to algorithm visualizers — and I ship most of what I
              learn.
            </motion.p>

            <motion.div
              variants={fadeUp}
              className="
    mt-6
    mb-5
    sm:mb-6
    gap-10
    flex
    justify-center
    sm:justify-start
    text-foreground
    text-center
  "
            >
              <div>
                <p className="text-3xl sm:text-5xl font-funnel font-bold leading-none">
                  <CountUp target={24} suffix="+" duration={2.2} />
                </p>
                <p className="mt-1 text-xs tracking-widest text-muted-foreground uppercase">
                  Projects Shipped
                </p>
              </div>

              <div>
                <p className="text-3xl sm:text-5xl font-funnel font-bold leading-none">
                  <CountUp target={repoCount} suffix="+" duration={2.6} />
                </p>
                <p className="mt-1 text-xs tracking-widest text-muted-foreground uppercase">
                  GitHub Repos
                </p>
              </div>

              <div>
                <p className="text-3xl sm:text-5xl font-funnel font-bold leading-none">
                  {/* 85 LeetCode + 132 Code360 + 18 GeeksforGeeks = 235.
                      No official public API for any of these three, so
                      this is a hand-maintained total — update it here
                      when the count changes meaningfully. */}
                  <CountUp target={235} suffix="+" duration={3.2} />
                </p>
                <p className="mt-1 text-xs tracking-widest text-muted-foreground uppercase">
                  DSA Problems
                </p>
              </div>
            </motion.div>

            <motion.div
              variants={fadeUp}
              className="flex flex-col sm:flex-row gap-4 sm:gap-6"
            >
              <motion.button
                whileHover={hoverScale}
                whileTap={{ scale: 0.98 }}
                onClick={() => scrollToTarget("#contact")}
                className="px-10 py-4 bg-foreground text-background rounded-full hover:opacity-85 transition cursor-pointer btn-glow"
              >
                Let's collaborate
              </motion.button>

              <motion.a
                whileHover={hoverScale}
                whileTap={{ scale: 0.98 }}
                href={CVPDF}
                download
                className="px-10 py-4 border border-border rounded-full hover:bg-foreground/5 transition text-center"
              >
                Download CV
              </motion.a>
            </motion.div>

            <motion.div
              variants={fadeUp}
              className="flex justify-center sm:justify-start items-center gap-6 sm:gap-4 md:gap-5 lg:gap-8 xl:gap-10 mt-8"
            >
              {socials.map(({ href, icon, label }, i) => (
                <a
                  key={i}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="text-muted-foreground hover:text-foreground transition"
                >
                  {icon}
                </a>
              ))}
            </motion.div>
          </motion.div>

          {/* FLOATING HERO IMAGE */}
          <motion.div
            variants={scaleReveal}
            initial="hidden"
            animate="show"
            className="
              hidden
              sm:block
              absolute
              sm:-right-[20%]
              md:-right-[15%]
              lg:-right-[5%]
              xl:right-0
              top-0
              h-full
              z-0
            "
          >
            <div className="relative h-full flex items-end justify-center overflow-hidden">
              {/* Ambient glow — reads as a soft dark blob in light mode,
                  a soft light blob in dark mode; grounds the cutout so it
                  doesn't float as a flat sticker on the page background. */}
              <div
                className="
                  pointer-events-none
                  absolute
                  left-1/2 bottom-[6%]
                  -translate-x-1/2
                  w-[85%] h-[70%]
                  rounded-full
                  bg-foreground/[0.07]
                  blur-3xl
                  z-0
                "
              />

              <img
                src={YourImg}
                alt="Saurabh Raj Shekhar"
                loading="eager"
                fetchPriority="high"
                className="
                  relative
                  z-10
                  h-[88%]
                  w-auto
                  object-contain
                  drop-shadow-[0_25px_45px_rgba(0,0,0,0.25)]
                  transition-transform
                  duration-700
                  hover:scale-[1.02]
                "
                style={{
                  maskImage:
                    "linear-gradient(to bottom, black 90%, transparent 100%)",
                  WebkitMaskImage:
                    "linear-gradient(to bottom, black 90%, transparent 100%)",
                }}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default memo(Hero);
