import React, { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Home,
  FolderGit2,
  Terminal,
  Sparkles,
  User,
  Mail,
  Github,
  Linkedin,
  Code2,
  Copy,
  Check,
  Download,
  Moon,
  Sun,
  Search,
  CornerDownLeft,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { scrollToTarget, getLenis } from "../utils/smoothScroll";
import { Theme } from "../utils/constants";
import { EASE_PREMIUM } from "../utils/animations";

interface CommandPaletteProps {
  theme: Theme;
  onToggleTheme: () => void;
}

interface CommandItem {
  id: string;
  label: string;
  group: "Navigate" | "Social" | "Actions";
  icon: React.ReactNode;
  keywords?: string;
  action: () => void;
  keepOpen?: boolean;
}

const CommandPalette: React.FC<CommandPaletteProps> = ({
  theme,
  onToggleTheme,
}) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const close = () => {
    setOpen(false);
    setQuery("");
    setSelectedIndex(0);
  };

  const commands: CommandItem[] = useMemo(
    () => [
      {
        id: "nav-home",
        label: "Go to Home",
        group: "Navigate",
        icon: <Home size={16} />,
        action: () => scrollToTarget("#home"),
      },
      {
        id: "nav-projects",
        label: "Go to Projects",
        group: "Navigate",
        icon: <FolderGit2 size={16} />,
        action: () => scrollToTarget("#projects"),
      },
      {
        id: "nav-tools",
        label: "Go to Tools",
        group: "Navigate",
        icon: <Terminal size={16} />,
        action: () => scrollToTarget("#tools"),
      },
      {
        id: "nav-skills",
        label: "Go to Skills",
        group: "Navigate",
        icon: <Sparkles size={16} />,
        action: () => scrollToTarget("#skills"),
      },
      {
        id: "nav-about",
        label: "Go to About",
        group: "Navigate",
        icon: <User size={16} />,
        action: () => scrollToTarget("#about"),
      },
      {
        id: "nav-contact",
        label: "Go to Contact",
        group: "Navigate",
        icon: <Mail size={16} />,
        action: () => scrollToTarget("#contact"),
      },
      {
        id: "social-github",
        label: "Open GitHub",
        group: "Social",
        icon: <Github size={16} />,
        keywords: "code repos repository",
        action: () =>
          window.open(
            "https://github.com/Zephyrex21",
            "_blank",
            "noopener,noreferrer",
          ),
      },
      {
        id: "social-linkedin",
        label: "Open LinkedIn",
        group: "Social",
        icon: <Linkedin size={16} />,
        keywords: "profile connect network",
        action: () =>
          window.open(
            "https://www.linkedin.com/in/saurabh-raj-shekhar-8a92b73b0/",
            "_blank",
            "noopener,noreferrer",
          ),
      },
      {
        id: "social-leetcode",
        label: "Open LeetCode",
        group: "Social",
        icon: <Code2 size={16} />,
        keywords: "dsa problems competitive",
        action: () =>
          window.open(
            "https://leetcode.com/u/Zephyrex_21/",
            "_blank",
            "noopener,noreferrer",
          ),
      },
      {
        id: "action-copy-email",
        label: copied ? "Email copied!" : "Copy email address",
        group: "Actions",
        icon: copied ? <Check size={16} /> : <Copy size={16} />,
        keywords: "contact mail gmail",
        keepOpen: true,
        action: () => {
          navigator.clipboard.writeText("shekharsaurabhraj@gmail.com");
          setCopied(true);
          window.setTimeout(() => {
            setCopied(false);
            close();
          }, 900);
        },
      },
      {
        id: "action-resume",
        label: "Download résumé",
        group: "Actions",
        icon: <Download size={16} />,
        keywords: "cv pdf download",
        action: () => {
          const a = document.createElement("a");
          a.href = "/assets/resume.pdf";
          a.download = "Saurabh_Raj_Shekhar_Resume.pdf";
          a.click();
        },
      },
      {
        id: "action-theme",
        label: theme === "dark" ? "Switch to light mode" : "Switch to dark mode",
        group: "Actions",
        icon: theme === "dark" ? <Sun size={16} /> : <Moon size={16} />,
        keywords: "dark light appearance theme",
        action: () => onToggleTheme(),
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [theme, copied],
  );

  const filtered = useMemo(() => {
    if (!query.trim()) return commands;
    const q = query.toLowerCase();
    return commands.filter(
      (c) =>
        c.label.toLowerCase().includes(q) ||
        (c.keywords && c.keywords.toLowerCase().includes(q)),
    );
  }, [commands, query]);

  const executeCommand = (cmd: CommandItem) => {
    if (cmd.keepOpen) {
      cmd.action();
      return;
    }
    close();
    requestAnimationFrame(() => cmd.action());
  };

  // Open via Cmd/Ctrl+K from anywhere, or via a dispatched custom event
  // (used by the visible ⌘K button in the navbar) — close on Escape.
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      } else if (e.key === "Escape") {
        setOpen(false);
      }
    };
    const openHandler = () => setOpen(true);

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("open-command-palette", openHandler);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("open-command-palette", openHandler);
    };
  }, []);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  useEffect(() => {
    if (open) {
      requestAnimationFrame(() => inputRef.current?.focus());
      document.body.style.overflow = "hidden";
      getLenis()?.stop();
    } else {
      document.body.style.overflow = "";
      getLenis()?.start();
      setQuery("");
    }
  }, [open]);

  useEffect(() => {
    itemRefs.current[selectedIndex]?.scrollIntoView({ block: "nearest" });
  }, [selectedIndex]);

  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((i) => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const cmd = filtered[selectedIndex];
      if (cmd) executeCommand(cmd);
    }
  };

  const groups: CommandItem["group"][] = ["Navigate", "Social", "Actions"];
  let runningIndex = -1;

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[999] flex items-start justify-center pt-[12vh] px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={close}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Command palette"
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.25, ease: EASE_PREMIUM }}
            className="relative w-full max-w-lg bg-background border border-border rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Input */}
            <div className="flex items-center gap-3 px-4 py-4 border-b border-border">
              <Search size={18} className="text-muted-foreground shrink-0" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleInputKeyDown}
                placeholder="Type a command or search..."
                aria-label="Search commands"
                className="flex-1 bg-transparent outline-none text-base placeholder:text-muted-foreground/60"
              />
              <kbd className="hidden sm:block text-[10px] tracking-wide text-muted-foreground border border-border rounded px-1.5 py-0.5">
                ESC
              </kbd>
            </div>

            {/* Results */}
            <div
              role="listbox"
              className="max-h-[60vh] overflow-y-auto py-2"
            >
              {filtered.length === 0 && (
                <p className="px-4 py-8 text-center text-sm text-muted-foreground">
                  No matching commands.
                </p>
              )}

              {groups.map((group) => {
                const items = filtered.filter((c) => c.group === group);
                if (items.length === 0) return null;

                return (
                  <div key={group} className="mb-2 last:mb-0">
                    <p className="px-4 py-1.5 text-[11px] tracking-widest uppercase text-muted-foreground/70">
                      {group}
                    </p>
                    {items.map((cmd) => {
                      runningIndex += 1;
                      const idx = runningIndex;
                      const isSelected = idx === selectedIndex;
                      return (
                        <button
                          key={cmd.id}
                          ref={(el) => {
                            itemRefs.current[idx] = el;
                          }}
                          onClick={() => executeCommand(cmd)}
                          onMouseEnter={() => setSelectedIndex(idx)}
                          role="option"
                          aria-selected={isSelected}
                          className={`w-full flex items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors ${
                            isSelected
                              ? "bg-foreground text-background"
                              : "text-foreground"
                          }`}
                        >
                          <span
                            className={
                              isSelected
                                ? "text-background/80"
                                : "text-muted-foreground"
                            }
                          >
                            {cmd.icon}
                          </span>
                          {cmd.label}
                        </button>
                      );
                    })}
                  </div>
                );
              })}
            </div>

            {/* Footer hints */}
            <div className="hidden sm:flex items-center gap-4 px-4 py-3 border-t border-border text-[11px] text-muted-foreground">
              <span className="flex items-center gap-1">
                <ArrowUp size={12} />
                <ArrowDown size={12} />
                navigate
              </span>
              <span className="flex items-center gap-1">
                <CornerDownLeft size={12} />
                select
              </span>
              <span className="flex items-center gap-1">esc close</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CommandPalette;
