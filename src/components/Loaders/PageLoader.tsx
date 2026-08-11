import React from "react";
import { motion } from "framer-motion";
import { EASE_PREMIUM } from "../../utils/animations";

const overlay = {
  hidden: { y: 40, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.8, ease: EASE_PREMIUM },
  },
  exit: {
    y: 40,
    opacity: 0,
    transition: { duration: 0.8, ease: EASE_PREMIUM },
  },
};

const PageLoader: React.FC = () => {
  return (
    <motion.div
      className="fixed inset-0 z-[9999] bg-background"
      variants={overlay}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <div className="relative h-full w-full flex flex-col items-center justify-center gap-8">
        <div className="flex flex-col items-center gap-3">
          <h1 className="font-funnel text-[clamp(2.5rem,7vw,5.5rem)] font-extrabold tracking-tight">
            Saurabh Raj Shekhar
          </h1>
          <p className="font-jost text-[11px] tracking-[0.45em] uppercase text-muted-foreground">
            Full-Stack &amp; AI/ML Developer
          </p>
        </div>

        <div className="relative w-64 h-[2px] bg-border overflow-hidden">
          <motion.div
            className="absolute inset-y-0 left-0 bg-foreground"
            initial={{ width: "0%" }}
            animate={{ width: ["0%", "100%"] }}
            transition={{
              duration: 2.4,
              ease: EASE_PREMIUM,
              repeat: Infinity,
            }}
          />
        </div>

        <motion.span
          className="font-mono text-[10px] tracking-widest text-muted-foreground"
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          INITIALISING SYSTEM
        </motion.span>
      </div>
    </motion.div>
  );
};

export default PageLoader;
