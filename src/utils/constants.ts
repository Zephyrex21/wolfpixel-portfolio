import React from "react";

export type SocialLink = {
  href: string;
  icon: React.ReactNode;
  label: string;
};

export type Theme = "light" | "dark";

/** Viewport coordinates a theme toggle was triggered from — used to origin the reveal ripple. */
export type ThemeToggleOrigin = { x: number; y: number };

/**
 * Real `--t-bg` value per theme, kept in sync with the tokens defined in
 * `index.css`. Used by the toggle's reveal ripple so the growing circle is
 * the actual destination background color, not an approximation.
 */
export const THEME_BG: Record<Theme, string> = {
  light: "rgba(246, 245, 242, 1)",
  dark: "rgba(13, 13, 13, 1)",
};

/**
 * Selected / flagship projects — rendered in the main expandable
 * project list. `image` is optional: when omitted (or when the file
 * fails to load) the row falls back to a generated gradient card
 * using `gradientFrom` / `gradientTo`, so every project looks
 * intentional even without a captured screenshot.
 */
export type projectItem = {
  title: string;
  description: string;
  tech: string[];
  link: string;
  codeLink: string;
  image?: { dark: string; light: string };
  gradientFrom: string;
  gradientTo: string;
  status: "completed" | "in-progress";
  projectType: "personal" | "client";
};

/** Compact grid -- the "Also Built" section for everything else. */
export type miniProjectItem = {
  title: string;
  description: string;
  stack: string;
  link: string;
  codeLink: string;
};

export type toolItem = {
  name: string;
  description: string;
  link: string;
};

export type journeyItem = {
  period: string;
  title: string;
  details: string;
};

export type serviceItem = {
  icon: string;
  title: string;
};
