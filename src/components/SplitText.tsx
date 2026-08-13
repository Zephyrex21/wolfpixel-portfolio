import React from "react";
import { motion, Variants, HTMLMotionProps } from "framer-motion";

const splitContainerVariants: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.045, delayChildren: 0.04 },
  },
};

const wordVariants: Variants = {
  hidden: { y: "110%", opacity: 0 },
  show: {
    y: "0%",
    opacity: 1,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
  },
};

type SplitTag = "span" | "h1" | "h2" | "h3" | "p";

interface SplitTextProps extends Omit<HTMLMotionProps<"span">, "children"> {
  children: string;
  as?: SplitTag;
}

/**
 * Reveals text word-by-word, each word masked inside an overflow-hidden
 * wrapper and sliding up into place. Deliberately doesn't manage its own
 * viewport trigger — it has a `variants` prop with the standard
 * "hidden"/"show" names, so it picks up state from whatever ancestor
 * `motion` component already runs `initial="hidden" whileInView="show"`
 * for the section (Framer Motion propagates variant state through plain,
 * non-motion HTML in between). That also means it slots naturally into an
 * existing `staggerChildren` sequence alongside sibling paragraphs — no
 * manual timing coordination needed between this and the rest of a
 * section's reveal.
 */
const SplitText: React.FC<SplitTextProps> = ({
  children,
  as = "span",
  className = "",
  ...rest
}) => {
  const words = children.split(" ");
  const MotionTag = motion[as] as React.ElementType;

  return (
    <MotionTag
      className={className}
      variants={splitContainerVariants}
      {...rest}
    >
      {words.map((word, i) => (
        <span
          key={`${word}-${i}`}
          className="inline-block overflow-hidden pb-[0.08em] align-bottom"
        >
          <motion.span variants={wordVariants} className="inline-block">
            {word}
            {i < words.length - 1 ? "\u00A0" : ""}
          </motion.span>
        </span>
      ))}
    </MotionTag>
  );
};

export default SplitText;
