import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { ThemeToggleOrigin } from "../utils/constants";

interface ThemeRippleProps {
  /** Present while a ripple should be playing; null hides it. */
  origin: ThemeToggleOrigin | null;
  /** Solid color the ripple grows in — the destination theme's real background. */
  color: string;
  /** Called once the reveal has fully covered the viewport and can be unmounted. */
  onComplete: () => void;
}

const BASE_SIZE = 32; // px — starting circle diameter before scaling up

/**
 * A circle that expands from the theme toggle's click point, filling the
 * viewport in the *destination* theme's actual background color. The real
 * page underneath is already flipping to that theme at the same moment
 * (via the scoped CSS color-transition), so by the time the circle finishes
 * growing there's nothing left to reveal — it just fades out cleanly rather
 * than sitting on screen like a loading cover.
 */
const ThemeRipple: React.FC<ThemeRippleProps> = ({ origin, color, onComplete }) => {
  // Radius needed for the circle to fully clear the viewport from this
  // origin — the farthest corner sets the distance, computed straight from
  // the click point so there's no extra render pass before it's correct.
  let targetScale = 1;
  if (origin) {
    const maxX = Math.max(origin.x, window.innerWidth - origin.x);
    const maxY = Math.max(origin.y, window.innerHeight - origin.y);
    const maxRadius = Math.hypot(maxX, maxY);
    targetScale = (maxRadius * 2) / BASE_SIZE;
  }

  return (
    <AnimatePresence>
      {origin && (
        <motion.div
          key={`${origin.x}-${origin.y}-${color}`}
          aria-hidden
          initial={{ scale: 0, opacity: 1 }}
          animate={{ scale: targetScale, opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.2, ease: "easeOut" } }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          onAnimationComplete={onComplete}
          className="fixed z-[9990] rounded-full pointer-events-none"
          style={{
            left: origin.x - BASE_SIZE / 2,
            top: origin.y - BASE_SIZE / 2,
            width: BASE_SIZE,
            height: BASE_SIZE,
            backgroundColor: color,
          }}
        />
      )}
    </AnimatePresence>
  );
};

export default ThemeRipple;
