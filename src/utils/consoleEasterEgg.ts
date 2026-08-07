/**
 * Prints a small styled banner to the browser console. Purely a fun
 * touch for the developers/recruiters who actually pop devtools open —
 * which, on a portfolio like this, is a meaningful chunk of visitors.
 */
export function printConsoleEasterEgg() {
  const lines = [
    "",
    "Hey, curious developer \u{1F44B}",
    "",
    "Since you're here digging around in devtools —",
    "I'm always up for interesting conversations.",
    "",
    "GitHub    -> github.com/Zephyrex21",
    "LinkedIn  -> linkedin.com/in/saurabh-raj-shekhar-8a92b73b0",
    "Email     -> shekharsaurabhraj@gmail.com",
    "",
  ];

  const width = Math.max(...lines.map((l) => l.length)) + 2;
  const top = "\u250C" + "\u2500".repeat(width + 2) + "\u2510";
  const bottom = "\u2514" + "\u2500".repeat(width + 2) + "\u2518";
  const body = lines
    .map((l) => "\u2502 " + l.padEnd(width) + " \u2502")
    .join("\n");

  console.log(
    "%c" + [top, body, bottom].join("\n"),
    "font-family: 'JetBrains Mono', monospace; color: #999; font-size: 12px; line-height: 1.6;",
  );
  console.log(
    "%cBuilt with React, TypeScript, Tailwind, Framer Motion, GSAP, and Lenis.",
    "font-family: 'JetBrains Mono', monospace; color: #666; font-size: 11px;",
  );
}
