import React from "react";
import { motion, useReducedMotion } from "framer-motion";

/**
 * A small animated terminal illustration — lines "type" in on a loop,
 * a cursor blinks, and a couple of soft geometric shapes drift behind
 * it for depth. Pure SVG/CSS, monochrome, no image asset.
 */
const ToolkitIllustration: React.FC = () => {
  const prefersReducedMotion = useReducedMotion();

  const lines = [
    { width: 132, delay: 0 },
    { width: 96, delay: 0.15 },
    { width: 150, delay: 0.3 },
    { width: 70, delay: 0.45 },
  ];

  if (prefersReducedMotion) {
    return (
      <div className="relative w-full h-full flex items-center justify-center select-none">
        <svg
          viewBox="0 0 320 220"
          className="relative w-full max-w-[320px] h-auto"
          aria-hidden="true"
        >
          <rect
            x="1"
            y="1"
            width="318"
            height="218"
            rx="14"
            fill="none"
            stroke="currentColor"
            strokeOpacity="0.22"
          />
          <rect
            x="1"
            y="1"
            width="318"
            height="36"
            rx="14"
            fill="currentColor"
            fillOpacity="0.06"
          />
          <line x1="1" y1="37" x2="319" y2="37" stroke="currentColor" strokeOpacity="0.15" />
          <circle cx="24" cy="19" r="5" fill="currentColor" fillOpacity="0.25" />
          <circle cx="42" cy="19" r="5" fill="currentColor" fillOpacity="0.25" />
          <circle cx="60" cy="19" r="5" fill="currentColor" fillOpacity="0.25" />
          {lines.map((line, i) => (
            <g key={i} transform={`translate(28, ${68 + i * 34})`}>
              <text x="-14" y="5" fontFamily="monospace" fontSize="13" fill="currentColor" fillOpacity="0.35">
                &gt;
              </text>
              <rect x="6" y="-8" width={line.width} height="14" rx="3" fill="currentColor" fillOpacity="0.28" />
            </g>
          ))}
        </svg>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full flex items-center justify-center select-none">
      {/* Drifting background shapes */}
      <motion.div
        animate={{ y: [0, -14, 0], rotate: [0, 6, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-2 right-6 w-16 h-16 rounded-2xl border border-background/15"
      />
      <motion.div
        animate={{ y: [0, 12, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        className="absolute bottom-4 left-2 w-10 h-10 rounded-full border border-background/15"
      />

      {/* Terminal window */}
      <svg
        viewBox="0 0 320 220"
        className="relative w-full max-w-[320px] h-auto"
        aria-hidden="true"
      >
        <rect
          x="1"
          y="1"
          width="318"
          height="218"
          rx="14"
          fill="none"
          stroke="currentColor"
          strokeOpacity="0.22"
        />
        <rect
          x="1"
          y="1"
          width="318"
          height="36"
          rx="14"
          fill="currentColor"
          fillOpacity="0.06"
        />
        <line
          x1="1"
          y1="37"
          x2="319"
          y2="37"
          stroke="currentColor"
          strokeOpacity="0.15"
        />
        <circle cx="24" cy="19" r="5" fill="currentColor" fillOpacity="0.25" />
        <circle cx="42" cy="19" r="5" fill="currentColor" fillOpacity="0.25" />
        <circle cx="60" cy="19" r="5" fill="currentColor" fillOpacity="0.25" />

        {lines.map((line, i) => (
          <g key={i} transform={`translate(28, ${68 + i * 34})`}>
            <text
              x="-14"
              y="5"
              fontFamily="monospace"
              fontSize="13"
              fill="currentColor"
              fillOpacity="0.35"
            >
              &gt;
            </text>
            <motion.rect
              x="6"
              y="-8"
              height="14"
              rx="3"
              fill="currentColor"
              fillOpacity="0.28"
              initial={{ width: 0 }}
              animate={{ width: [0, line.width, line.width, 0] }}
              transition={{
                duration: 3.2,
                times: [0, 0.35, 0.85, 1],
                repeat: Infinity,
                repeatDelay: 1.4,
                delay: line.delay,
                ease: "easeInOut",
              }}
            />
          </g>
        ))}

        {/* Blinking cursor on the last line */}
        <motion.rect
          x="34"
          y={68 + 3 * 34 - 8}
          width="8"
          height="14"
          rx="1.5"
          fill="currentColor"
          animate={{ opacity: [1, 1, 0, 0] }}
          transition={{ duration: 1, repeat: Infinity, times: [0, 0.5, 0.51, 1] }}
        />
      </svg>
    </div>
  );
};

export default ToolkitIllustration;
