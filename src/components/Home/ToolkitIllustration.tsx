import React, { useId } from "react";
import { motion, useReducedMotion } from "framer-motion";

/**
 * A small animated terminal illustration. Second pass on this one — the
 * first version typed in abstract gray bars instead of real text, which
 * read as a generic "here's a terminal" placeholder rather than
 * something that's actually theirs. This version types real commands
 * and references real numbers from the rest of the site (24 projects
 * shipped, 208 passing tests on the AI Data Analyst Agent) — small
 * detail, but it's the difference between a stock illustration and one
 * that's specifically about this person's work.
 */

interface Line {
  prompt: "$" | "✓";
  text: string;
  clipWidth: number; // wide enough to reveal the full string at this font-size, with a small margin
  delay: number;
}

const LINES: Line[] = [
  { prompt: "$", text: "npm run build", clipWidth: 118, delay: 0 },
  { prompt: "✓", text: "24 projects shipped", clipWidth: 168, delay: 0.9 },
  { prompt: "$", text: "git push origin main", clipWidth: 178, delay: 1.8 },
  { prompt: "✓", text: "208 tests passing", clipWidth: 152, delay: 2.7 },
];

const ROW_START_Y = 68;
const ROW_GAP = 34;

const ToolkitIllustration: React.FC = () => {
  const prefersReducedMotion = useReducedMotion();
  const uid = useId();

  const TerminalChrome = () => (
    <>
      <defs>
        <linearGradient id={`${uid}-header`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.1" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0.03" />
        </linearGradient>
      </defs>
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
      <rect x="1" y="1" width="318" height="36" rx="14" fill={`url(#${uid}-header)`} />
      <line x1="1" y1="37" x2="319" y2="37" stroke="currentColor" strokeOpacity="0.15" />
      <circle cx="24" cy="19" r="5" fill="currentColor" fillOpacity="0.25" />
      <circle cx="42" cy="19" r="5" fill="currentColor" fillOpacity="0.25" />
      <circle cx="60" cy="19" r="5" fill="currentColor" fillOpacity="0.25" />
    </>
  );

  if (prefersReducedMotion) {
    return (
      <div className="relative w-full h-full flex items-center justify-center select-none">
        <svg
          viewBox="0 0 320 220"
          className="relative w-full max-w-[320px] h-auto"
          style={{ filter: "drop-shadow(0 12px 24px rgba(0,0,0,0.12))" }}
          aria-hidden="true"
        >
          <TerminalChrome />
          {LINES.map((line, i) => (
            <g key={i} transform={`translate(28, ${ROW_START_Y + i * ROW_GAP})`}>
              <text
                x="-14"
                y="5"
                fontFamily="monospace"
                fontSize="13"
                fill="currentColor"
                fillOpacity={line.prompt === "✓" ? 0.6 : 0.4}
              >
                {line.prompt}
              </text>
              <text
                x="6"
                y="5"
                fontFamily="monospace"
                fontSize="12.5"
                fill="currentColor"
                fillOpacity={line.prompt === "✓" ? 0.6 : 0.45}
              >
                {line.text}
              </text>
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
      <motion.div
        animate={{ y: [0, -8, 0], rotate: [0, -8, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1.2 }}
        className="absolute top-1/2 -left-3 w-6 h-6 border border-background/15"
        style={{ transform: "rotate(45deg)" }}
      />

      {/* Terminal window */}
      <svg
        viewBox="0 0 320 220"
        className="relative w-full max-w-[320px] h-auto"
        style={{ filter: "drop-shadow(0 12px 24px rgba(0,0,0,0.12))" }}
        aria-hidden="true"
      >
        <TerminalChrome />

        {LINES.map((line, i) => {
          const clipId = `${uid}-clip-${i}`;
          return (
            <g key={i} transform={`translate(28, ${ROW_START_Y + i * ROW_GAP})`}>
              {/* Prompt symbol — always visible, doesn't type in */}
              <text
                x="-14"
                y="5"
                fontFamily="monospace"
                fontSize="13"
                fill="currentColor"
                fillOpacity={line.prompt === "✓" ? 0.6 : 0.4}
              >
                {line.prompt}
              </text>

              {/* Real command/result text, revealed left-to-right via an
                  animated clip-path — same proven wipe technique already
                  used for the project screenshot reveals, applied to
                  text instead of an image. */}
              <clipPath id={clipId}>
                <motion.rect
                  x="0"
                  y="-10"
                  height="18"
                  initial={{ width: 0 }}
                  animate={{ width: [0, line.clipWidth, line.clipWidth, 0] }}
                  transition={{
                    duration: 3.6,
                    times: [0, 0.3, 0.85, 1],
                    repeat: Infinity,
                    repeatDelay: 2.4,
                    delay: line.delay,
                    ease: "easeInOut",
                  }}
                />
              </clipPath>
              <text
                clipPath={`url(#${clipId})`}
                x="6"
                y="5"
                fontFamily="monospace"
                fontSize="12.5"
                fill="currentColor"
                fillOpacity={line.prompt === "✓" ? 0.6 : 0.45}
              >
                {line.text}
              </text>
            </g>
          );
        })}

        {/* Thin blinking cursor, resting at the end of the last line */}
        <motion.rect
          x={28 + 6 + 152 + 4}
          y={ROW_START_Y + 3 * ROW_GAP - 9}
          width="1.5"
          height="15"
          fill="currentColor"
          animate={{ opacity: [1, 1, 0, 0] }}
          transition={{ duration: 1, repeat: Infinity, times: [0, 0.5, 0.51, 1] }}
        />
      </svg>
    </div>
  );
};

export default ToolkitIllustration;
