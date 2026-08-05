import React, { useEffect, useState } from "react";

const ROLES = [
  "Full-Stack Developer",
  "MERN Stack Developer",
  "AI/ML Enthusiast",
  "DSA & CP Problem Solver",
];

const TYPE_SPEED = 55; // ms per character while typing
const DELETE_SPEED = 28; // ms per character while deleting
const HOLD_DURATION = 1500; // ms to sit fully typed before deleting
const GAP_DURATION = 400; // ms of empty string before typing the next role

type Phase = "typing" | "deleting";

/**
 * Cycles through ROLES with a classic type → hold → delete → next
 * loop. Respects prefers-reduced-motion by just showing the first
 * role statically, no animation.
 */
const TypewriterRoles: React.FC = () => {
  const [roleIndex, setRoleIndex] = useState(0);
  const [text, setText] = useState("");
  const [phase, setPhase] = useState<Phase>("typing");
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    setReducedMotion(
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    );
  }, []);

  useEffect(() => {
    if (reducedMotion) {
      setText(ROLES[0]);
      return;
    }

    const current = ROLES[roleIndex];
    let timeout: number;

    if (phase === "typing") {
      if (text.length < current.length) {
        timeout = window.setTimeout(
          () => setText(current.slice(0, text.length + 1)),
          TYPE_SPEED,
        );
      } else {
        // Fully typed — hold, then start deleting.
        timeout = window.setTimeout(() => setPhase("deleting"), HOLD_DURATION);
      }
    } else {
      // phase === "deleting"
      if (text.length > 0) {
        timeout = window.setTimeout(
          () => setText(current.slice(0, text.length - 1)),
          DELETE_SPEED,
        );
      } else {
        // Fully deleted — brief gap, then move to the next role.
        timeout = window.setTimeout(() => {
          setRoleIndex((i) => (i + 1) % ROLES.length);
          setPhase("typing");
        }, GAP_DURATION);
      }
    }

    return () => window.clearTimeout(timeout);
  }, [text, phase, roleIndex, reducedMotion]);

  return (
    <span className="inline-flex items-center">
      {text}
      {!reducedMotion && (
        <span className="typewriter-cursor h-[0.9em] ml-1 align-middle" />
      )}
    </span>
  );
};

export default TypewriterRoles;
