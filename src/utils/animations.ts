import { Variants } from "framer-motion";

/* =========================================
   CONSTANTS
   ========================================= */

// Premium, editorial-style easing
// [0.22, 1, 0.36, 1] is a classic "easeOutExpo" variation that feels very premium
export const EASE_PREMIUM: [number, number, number, number] = [
  0.22, 1, 0.36, 1,
];

// Slower, more deliberate standard duration
export const DURATION_FAST = 0.6;
export const DURATION_MEDIUM = 0.9;
export const DURATION_SLOW = 1.2;
export const DURATION_VERY_SLOW = 1.5;

export const TRANSITION_DEFAULT = {
  duration: DURATION_MEDIUM,
  ease: EASE_PREMIUM,
};

/* =========================================
   VARIANTS
   ========================================= */

/**
 * Standard container stagger
 * Use this on parent elements (sections, lists)
 */
export const staggerContainer: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

/**
 * Slower stagger for hero/intro sections
 */
export const staggerContainerSlow: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.4,
    },
  },
};

/**
 * Standard fade up reveal
 * Low Y-offset, clean opacity fade
 */
export const fadeUp: Variants = {
  hidden: {
    opacity: 0,
    y: 20, // Reduced from typical 40-50px for subtlety
    filter: "blur(4px)",
  },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: DURATION_MEDIUM,
      ease: EASE_PREMIUM,
    },
  },
};

/**
 * Slower fade up for headings or hero elements
 */
export const fadeUpSlow: Variants = {
  hidden: {
    opacity: 0,
    y: 30,
    filter: "blur(8px)",
  },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: DURATION_SLOW,
      ease: EASE_PREMIUM,
    },
  },
};

/**
 * Subtle scale reveal (for images, cards)
 */
export const scaleReveal: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.96, // Very subtle scale from 0.96
    filter: "blur(4px)",
  },
  show: {
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
    transition: {
      duration: DURATION_SLOW,
      ease: EASE_PREMIUM,
    },
  },
};

/**
 * Line separator reveal (width 0 -> 100%)
 */
export const lineReveal: Variants = {
  hidden: {
    scaleX: 0,
    originX: 0,
    opacity: 0,
  },
  show: {
    scaleX: 1,
    opacity: 1,
    transition: {
      duration: DURATION_SLOW,
      ease: EASE_PREMIUM,
    },
  },
};

/**
 * Hover Animations (Use inline whileHover or these variants)
 */
export const hoverScale = {
  scale: 1.02,
  transition: { duration: 0.4, ease: EASE_PREMIUM },
};

export const hoverFade = {
  opacity: 0.7,
  transition: { duration: 0.3, ease: EASE_PREMIUM },
};
