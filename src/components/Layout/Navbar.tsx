import { lazy, Suspense, useEffect, useState } from "react";
import { Github, Linkedin, Mail, Moon, Sun, Code2, Command } from "lucide-react";
import { SocialLink, Theme } from "../../utils/constants";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { EASE_PREMIUM } from "../../utils/animations";
import { acquireScrollLock, releaseScrollLock } from "../../utils/scrollLock";

// Lazy-loaded: pulls in GSAP, which desktop visitors never need since this
// only ever renders below the 768px breakpoint.
const StaggeredMenu = lazy(() => import("./StaggeredMenu"));

/* ===================== ANIMATIONS ===================== */

const navbarVariants: Variants = {
  hidden: { opacity: 0, y: -20, filter: "blur(4px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 1, ease: EASE_PREMIUM },
  },
};

const navItemVariants: Variants = {
  hidden: { opacity: 0, y: -10 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.1 + i * 0.05, duration: 0.8, ease: EASE_PREMIUM },
  }),
};

/**
 * A stable, top-level component (not defined inline inside Navbar) so React
 * can tell it's the *same* component across re-renders and only remounts it
 * when it's actually removed from the tree — otherwise the icon-morph
 * animation below would restart from scratch on every scroll-triggered
 * Navbar re-render instead of playing once, on an actual theme change.
 */
const ThemeToggleButton: React.FC<{
  theme: Theme;
  onToggleTheme: () => void;
  compact?: boolean;
}> = ({ theme, onToggleTheme, compact = false }) => (
  <motion.button
    onClick={onToggleTheme}
    whileTap={{ scale: 0.9 }}
    aria-label={
      theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
    }
    className={`relative flex items-center justify-center overflow-hidden rounded-full border border-[var(--color-border)] text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] hover:border-[var(--color-foreground)] transition-colors cursor-pointer ${
      compact ? "w-8 h-8" : "w-9 h-9"
    }`}
  >
    <AnimatePresence mode="wait" initial={false}>
      <motion.span
        key={theme}
        initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
        animate={{ rotate: 0, opacity: 1, scale: 1 }}
        exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
        transition={{ duration: 0.3, ease: EASE_PREMIUM }}
        className="flex items-center justify-center"
      >
        {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
      </motion.span>
    </AnimatePresence>
  </motion.button>
);

interface NavbarProps {
  theme: Theme;
  onToggleTheme: () => void;
}

const SECTION_IDS = ["home", "projects", "tools", "skills", "about", "contact"];

/* ===================== COMPONENT ===================== */

const Navbar: React.FC<NavbarProps> = ({ theme, onToggleTheme }) => {
  const [scrolled, setScrolled] = useState<boolean>(false);
  const [windowWidth, setWindowWidth] = useState<number>(window.innerWidth);
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [activeSection, setActiveSection] = useState<string>("home");

  useEffect(() => {
    const sections = SECTION_IDS.map((id) => document.getElementById(id)).filter(
      (el): el is HTMLElement => el !== null,
    );
    if (sections.length === 0) return;

    // Shrinks the effective viewport used for intersection down to a thin
    // band near the top of the screen, so a section only counts as
    // "active" once it's reached roughly where a person's eye actually is
    // while scrolling — not just whenever any sliver of it is visible
    // (which, for tall sections, would mean several are "visible" at
    // once and the nav flickers between them).
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length === 0) return;
        const topMost = visible.reduce((a, b) =>
          a.boundingClientRect.top < b.boundingClientRect.top ? a : b,
        );
        setActiveSection(topMost.target.id);
      },
      { rootMargin: "-20% 0px -70% 0px", threshold: 0 },
    );

    sections.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let ticking = false;

    const update = () => {
      setScrolled(window.scrollY > 20);
      setWindowWidth(window.innerWidth);
      ticking = false;
    };

    const onScrollOrResize = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };

    window.addEventListener("scroll", onScrollOrResize, { passive: true });
    window.addEventListener("resize", onScrollOrResize);

    return () => {
      window.removeEventListener("scroll", onScrollOrResize);
      window.removeEventListener("resize", onScrollOrResize);
    };
  }, []);

  useEffect(() => {
    if (menuOpen) {
      acquireScrollLock();
    } else {
      releaseScrollLock();
    }
  }, [menuOpen]);

  useEffect(() => {
    if (windowWidth >= 768) setMenuOpen(false);
  }, [windowWidth]);

  const links = ["Projects", "Tools", "Skills", "About", "Contact"];

  const socials: SocialLink[] = [
    {
      href: "https://github.com/Zephyrex21",
      icon: <Github />,
      label: "GitHub",
    },
    {
      href: "https://www.linkedin.com/in/saurabh-raj-shekhar-8a92b73b0/",
      icon: <Linkedin />,
      label: "LinkedIn",
    },
    {
      href: "https://leetcode.com/u/Zephyrex_21/",
      icon: <Code2 />,
      label: "LeetCode",
    },
    {
      href: "mailto:shekharsaurabhraj@gmail.com",
      icon: <Mail />,
      label: "Email",
    },
  ];

  const menuItems = links.map((item) => ({
    label: item,
    ariaLabel: item,
    link: `#${item.toLowerCase()}`,
  }));

  const staggeredSocials = socials.map((s) => ({
    label: s.label,
    link: s.href,
  }));

  // Monochrome "curtain peel" wipe colors for the mobile panel reveal —
  // derived from the current theme so it settles into the panel's own
  // background color rather than flashing an off-palette color.
  const menuColors =
    theme === "dark" ? ["#f2f2ef", "#0d0d0d"] : ["#1c1c1c", "#f6f5f2"];
  const toggleColor =
    theme === "dark" ? "rgba(240,240,238,1)" : "rgba(24,24,24,1)";

  /* Desktop navbar width logic */
  let maxWidth = windowWidth;
  let marginLeft = 0;

  if (scrolled && windowWidth >= 768) {
    if (windowWidth >= 1440) maxWidth = windowWidth * 0.6;
    else if (windowWidth >= 1024) maxWidth = windowWidth * 0.8;
    else maxWidth = windowWidth * 0.95;

    marginLeft = (windowWidth - maxWidth) / 2;
  }

  return (
    <>
      {/* ================= DESKTOP / TABLET ================= */}
      {windowWidth >= 768 && (
        <motion.header
          variants={navbarVariants}
          initial="hidden"
          animate="visible"
          className={`fixed ${scrolled ? "top-5" : "top-0"} left-0 z-50`}
          style={{
            width: "100%",
            maxWidth,
            marginLeft,
            padding: scrolled ? "1rem 2rem" : "1.5rem 2rem",
            borderRadius: scrolled ? "2.5rem" : "0rem",
            backgroundColor: scrolled
              ? theme === "dark"
                ? "rgba(20,20,20,0.55)"
                : "rgba(255,255,255,0.35)"
              : "var(--color-background)",
            backdropFilter: scrolled ? "blur(18px)" : "none",
            boxShadow: scrolled ? "0 12px 32px rgba(0,0,0,0.12)" : "none",
            border: scrolled
              ? theme === "dark"
                ? "1px solid rgba(255,255,255,0.12)"
                : "1px solid rgba(255,255,255,0.5)"
              : "none",
            transition:
              "background-color 0.5s cubic-bezier(0.22, 1, 0.36, 1), border-radius 0.5s cubic-bezier(0.22, 1, 0.36, 1), padding 0.5s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.5s cubic-bezier(0.22, 1, 0.36, 1), top 0.5s cubic-bezier(0.22, 1, 0.36, 1), max-width 0.5s cubic-bezier(0.22, 1, 0.36, 1)",
          }}
        >
          <div className="w-full xl:max-w-7xl mx-auto flex items-center justify-between">
            <motion.a
              href="#home"
              custom={0}
              variants={navItemVariants}
              initial="hidden"
              animate="visible"
              className="font-funnel text-lg font-extrabold tracking-tight"
            >
              Saurabh
            </motion.a>

            <ul className="flex md:gap-5 xl:gap-6 text-base font-medium">
              {links.map((item, i) => {
                const id = item.toLowerCase();
                const isActive = activeSection === id;
                return (
                  <motion.li
                    key={item}
                    custom={i + 1}
                    variants={navItemVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <a
                      href={`#${id}`}
                      className={`relative pb-1 transition-colors ${
                        isActive
                          ? "text-[var(--color-foreground)]"
                          : "text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)]"
                      }`}
                    >
                      {item}
                      {isActive && (
                        <motion.span
                          layoutId="nav-active-indicator"
                          className="absolute left-0 right-0 -bottom-0.5 h-[2px] rounded-full bg-[var(--color-foreground)]"
                          transition={{ type: "spring", stiffness: 380, damping: 32 }}
                        />
                      )}
                    </a>
                  </motion.li>
                );
              })}
            </ul>

            <div className="flex items-center md:gap-3 xl:gap-4">
              {socials.map(({ href, icon, label }, i) => (
                <motion.a
                  key={label}
                  custom={links.length + i + 1}
                  variants={navItemVariants}
                  initial="hidden"
                  animate="visible"
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] transition [&>svg]:w-[18px] [&>svg]:h-[18px]"
                >
                  {icon}
                </motion.a>
              ))}
              <motion.button
                custom={links.length + socials.length + 1}
                variants={navItemVariants}
                initial="hidden"
                animate="visible"
                onClick={() =>
                  window.dispatchEvent(new CustomEvent("open-command-palette"))
                }
                aria-label="Open command palette"
                whileTap={{ scale: 0.95 }}
                className="hidden md:flex items-center gap-1.5 rounded-full border border-[var(--color-border)] px-2.5 py-1 text-[11px] text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] hover:border-[var(--color-foreground)] transition-colors cursor-pointer"
              >
                <Command size={12} />
                K
              </motion.button>
              <motion.div
                custom={links.length + socials.length + 2}
                variants={navItemVariants}
                initial="hidden"
                animate="visible"
              >
                <ThemeToggleButton theme={theme} onToggleTheme={onToggleTheme} />
              </motion.div>
            </div>
          </div>
        </motion.header>
      )}

      {/* ================= MOBILE ================= */}
      {windowWidth < 768 && (
        <Suspense fallback={null}>
          <StaggeredMenu
            items={menuItems}
            socialItems={staggeredSocials}
            colors={menuColors}
            menuButtonColor={toggleColor}
            openMenuButtonColor={toggleColor}
            changeMenuColorOnOpen={false}
            onMenuOpen={() => setMenuOpen(true)}
            onMenuClose={() => setMenuOpen(false)}
            themeToggle={<ThemeToggleButton theme={theme} onToggleTheme={onToggleTheme} compact />}
          />
        </Suspense>
      )}
    </>
  );
};

export default Navbar;
