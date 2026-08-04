import React, { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

interface CountUpProps {
  target: number;
  suffix?: string;
  duration?: number; // seconds
}

/**
 * Counts up from 0 to `target` once the element scrolls into view.
 * Uses a plain rAF loop with an ease-out cubic curve rather than a
 * spring, since a monotonically-increasing counter reads better
 * without overshoot/bounce.
 */
const CountUp: React.FC<CountUpProps> = ({
  target,
  suffix = "",
  duration = 2.6,
}) => {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.6 });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!isInView) return;

    let start: number | null = null;
    let raf: number;

    const step = (ts: number) => {
      if (start === null) start = ts;
      const progress = Math.min((ts - start) / (duration * 1000), 1);
      // Gentle ease-out (quadratic, not cubic) — keeps the count
      // visually ticking through the whole duration instead of
      // front-loading most of the motion in the first few frames.
      const eased = 1 - Math.pow(1 - progress, 1.8);
      setDisplay(Math.round(eased * target));
      if (progress < 1) raf = requestAnimationFrame(step);
    };

    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [isInView, target, duration]);

  return (
    <span ref={ref}>
      {display}
      {suffix}
    </span>
  );
};

export default CountUp;
