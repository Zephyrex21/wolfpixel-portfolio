import { Mail, Linkedin, Github, Code2, ArrowUpRight } from "lucide-react";
import React from "react";
import { motion } from "framer-motion";
import { staggerContainer, fadeUp, hoverScale } from "../../utils/animations";

/* =======================
   COMPONENT
   ======================= */

const Contact: React.FC = () => {
  const socialLinks = [
    {
      platform: "Email",
      handle: "shekharsaurabhraj@gmail.com",
      action: "Fastest reply",
      icon: <Mail strokeWidth={1.5} className="w-6 h-6" />,
      href: "mailto:shekharsaurabhraj@gmail.com",
      isPrimary: true,
    },
    {
      platform: "LinkedIn",
      handle: "Professional profile",
      action: "Connect",
      icon: <Linkedin strokeWidth={1.5} className="w-6 h-6" />,
      href: "https://www.linkedin.com/in/saurabh-raj-shekhar-8a92b73b0/",
      isPrimary: false,
    },
    {
      platform: "GitHub",
      handle: "34+ repos, all open",
      action: "Browse",
      icon: <Github strokeWidth={1.5} className="w-6 h-6" />,
      href: "https://github.com/Zephyrex21",
      isPrimary: false,
    },
    {
      platform: "LeetCode",
      handle: "150+ problems solved",
      action: "View profile",
      icon: <Code2 strokeWidth={1.5} className="w-6 h-6" />,
      href: "https://leetcode.com/u/Zephyrex_21/",
      isPrimary: false,
    },
  ];

  return (
    <section
      id="contact"
      className="scroll-mt-14 py-8 lg:py-16 sm:px-2 relative z-20"
    >
      <div className="bg-foreground text-background rounded-2xl px-6 py-8 sm:py-10 sm:px-10 md:py-14">
        <div className="mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-22 items-start opacity-100">
          {/* ================= LEFT — EDITORIAL ================= */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.35 }}
          >
            <motion.h2
              variants={fadeUp}
              className="font-funnel max-w-xl text-[clamp(3.5rem,8vw,6rem)]
                       font-black leading-[1] tracking-tight"
            >
              Let's build
              <br />
              something
              <span className="mt-2 block font-light text-background/70">
                worth shipping
              </span>
            </motion.h2>

            <motion.p
              variants={fadeUp}
              className="mt-10 max-w-lg text-lg sm:text-xl text-background/80 leading-relaxed"
            >
              Whether it's a project, an internship opportunity, or a
              complex engineering problem — I'm always open to thoughtful
              conversations.
            </motion.p>

            <motion.p
              variants={fadeUp}
              className="mt-6 text-base tracking-wide text-background/80"
            >
              Expect a reply within 24 hours.
            </motion.p>
          </motion.div>

          {/* ================= RIGHT — SOCIAL CARDS ================= */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            className="relative"
          >
            {/* Depth outline */}
            <div
              className="absolute inset-0 -translate-x-4 -translate-y-4
                          rounded-3xl border border-border/40 hidden sm:block"
            />

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="relative rounded-3xl sm:border border-border
                       sm:p-8 lg:p-10 space-y-4 bg-foreground flex flex-col justify-center h-full"
            >
              {socialLinks.map((link) => (
                <motion.a
                  key={link.platform}
                  href={link.href}
                  target={link.platform === "Email" ? "_self" : "_blank"}
                  rel="noopener noreferrer"
                  variants={fadeUp}
                  whileHover={hoverScale}
                  whileTap={{ scale: 0.98 }}
                  className="group relative flex items-center justify-between
                           w-full rounded-2xl border border-border/50 px-6 py-5
                           bg-transparent text-background transition-all duration-300
                           hover:bg-background hover:text-foreground hover:border-transparent cursor-pointer"
                >
                  <div className="flex items-center gap-5">
                    <span className="p-2 rounded-full border border-border/20 group-hover:border-foreground/20 transition-colors">
                      {link.icon}
                    </span>
                    <div>
                      <h3 className="text-lg font-bold leading-tight">
                        {link.platform}
                      </h3>
                      <p className="text-sm opacity-60 font-light group-hover:opacity-80">
                        {link.handle}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {link.isPrimary && (
                      <span
                        className="hidden sm:flex px-3 py-1 text-[10px] uppercase tracking-wider
                                     font-bold rounded-full bg-background text-foreground
                                     group-hover:bg-foreground group-hover:text-background transition-colors"
                      >
                        {link.action}
                      </span>
                    )}
                    <ArrowUpRight className="w-5 h-5 opacity-40 group-hover:opacity-100 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
                  </div>

                  {/* Mobile Pulse for Primary */}
                  {link.isPrimary && (
                    <span className="absolute top-3 right-3 flex h-2 w-2 sm:hidden">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                    </span>
                  )}
                </motion.a>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
