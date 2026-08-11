import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { staggerContainer, fadeUp } from "../utils/animations";

const Error404: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <motion.div
      className="h-[100svh] w-full bg-background flex items-center justify-center px-6"
      variants={staggerContainer}
      initial="hidden"
      animate="show"
      exit={{ opacity: 0, transition: { duration: 0.5 } }}
    >
      <div className="flex flex-col items-center text-center gap-12 max-w-xl">
        {/* Error Code */}
        <motion.h1
          variants={fadeUp}
          className="font-funnel text-[clamp(5rem,18vw,9rem)] font-extrabold tracking-tight leading-none"
        >
          404
        </motion.h1>

        {/* System Message */}
        <motion.p
          variants={fadeUp}
          className="font-jost text-[11px] tracking-[0.45em] uppercase text-muted-foreground"
        >
          Route Not Found
        </motion.p>

        {/* Divider */}
        <motion.div variants={fadeUp} className="w-40 h-[1px] bg-border" />

        {/* Explanation */}
        <motion.p
          variants={fadeUp}
          className="font-jost text-base text-muted-foreground leading-relaxed"
        >
          The requested path does not exist or has been moved.
          <br />
          The system could not resolve the destination.
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          variants={fadeUp}
          className="mt-4 flex flex-col sm:flex-row gap-4"
        >
          <button
            onClick={() => navigate(-1)}
            className="px-10 py-4 border border-border rounded-full hover:bg-foreground/5 transition hover:cursor-pointer hover:scale-95"
          >
            ← Return to previous page
          </button>
          <button
            onClick={() => navigate("/")}
            className="px-10 py-4 bg-foreground text-background rounded-full hover:opacity-90 transition hover:cursor-pointer hover:scale-95 btn-glow"
          >
            Go home
          </button>
        </motion.div>

        {/* Ambient system hint */}
        <motion.span
          variants={fadeUp}
          className="mt-8 font-mono text-[10px] tracking-widest text-muted-foreground"
        >
          SYSTEM AWAITING INPUT
        </motion.span>
      </div>
    </motion.div>
  );
};

export default Error404;
