import React from "react";
import { motion, useScroll, useSpring } from "framer-motion";

/**
 * A thin bar fixed to the very top of the viewport that fills left to
 * right as the person scrolls through the page. Spring-smoothed so it
 * doesn't feel like it's stepping.
 */
const ScrollProgress: React.FC = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 200,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[2px] bg-foreground origin-left z-[998]"
      style={{ scaleX }}
    />
  );
};

export default ScrollProgress;
