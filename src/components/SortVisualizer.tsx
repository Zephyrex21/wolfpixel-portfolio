import React, { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Play, Pause, Shuffle, RotateCcw } from "lucide-react";
import { acquireScrollLock, releaseScrollLock } from "../utils/scrollLock";
import { EASE_PREMIUM } from "../utils/animations";

/* ===================== Step model ===================== */

interface SortStep {
  array: number[];
  comparing?: [number, number];
  pivot?: number;
  sortedIndices?: number[];
}

const BAR_COUNT = 14;

function randomArray(): number[] {
  return Array.from({ length: BAR_COUNT }, () => 8 + Math.floor(Math.random() * 92));
}

/** Real bubble sort — every comparison and swap is recorded as a step. */
function bubbleSortSteps(input: number[]): SortStep[] {
  const a = [...input];
  const steps: SortStep[] = [];
  const n = a.length;
  const sorted: number[] = [];

  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - 1 - i; j++) {
      steps.push({ array: [...a], comparing: [j, j + 1], sortedIndices: [...sorted] });
      if (a[j] > a[j + 1]) {
        [a[j], a[j + 1]] = [a[j + 1], a[j]];
        steps.push({ array: [...a], comparing: [j, j + 1], sortedIndices: [...sorted] });
      }
    }
    sorted.unshift(n - 1 - i);
  }
  sorted.unshift(0);
  steps.push({ array: [...a], sortedIndices: Array.from({ length: n }, (_, i) => i) });
  return steps;
}

/** Real quicksort (Lomuto partition) — pivot and comparisons both tracked. */
function quickSortSteps(input: number[]): SortStep[] {
  const a = [...input];
  const steps: SortStep[] = [];
  const n = a.length;
  const sortedSet = new Set<number>();

  function partition(lo: number, hi: number): number {
    const pivotVal = a[hi];
    let i = lo;
    for (let j = lo; j < hi; j++) {
      steps.push({
        array: [...a],
        comparing: [j, hi],
        pivot: hi,
        sortedIndices: [...sortedSet],
      });
      if (a[j] < pivotVal) {
        [a[i], a[j]] = [a[j], a[i]];
        steps.push({
          array: [...a],
          comparing: [i, j],
          pivot: hi,
          sortedIndices: [...sortedSet],
        });
        i++;
      }
    }
    [a[i], a[hi]] = [a[hi], a[i]];
    steps.push({ array: [...a], pivot: i, sortedIndices: [...sortedSet] });
    return i;
  }

  function run(lo: number, hi: number) {
    if (lo < hi) {
      const p = partition(lo, hi);
      sortedSet.add(p);
      run(lo, p - 1);
      run(p + 1, hi);
    } else if (lo === hi) {
      sortedSet.add(lo);
    }
  }

  run(0, n - 1);
  steps.push({ array: [...a], sortedIndices: Array.from({ length: n }, (_, i) => i) });
  return steps;
}

type Algorithm = "bubble" | "quick";

const ALGO_LABEL: Record<Algorithm, string> = {
  bubble: "Bubble Sort",
  quick: "Quick Sort",
};

/* ===================== Component ===================== */

const SortVisualizer: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [algorithm, setAlgorithm] = useState<Algorithm>("bubble");
  const [array, setArray] = useState<number[]>(randomArray);
  const [steps, setSteps] = useState<SortStep[] | null>(null);
  const [stepIndex, setStepIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const intervalRef = useRef<number | null>(null);

  const close = () => {
    setOpen(false);
    setPlaying(false);
    setSteps(null);
    setStepIndex(0);
  };

  const shuffle = () => {
    setPlaying(false);
    setSteps(null);
    setStepIndex(0);
    setArray(randomArray());
  };

  const play = () => {
    const computed = steps ?? (algorithm === "bubble" ? bubbleSortSteps(array) : quickSortSteps(array));
    if (!steps) setSteps(computed);
    if (stepIndex >= computed.length - 1) setStepIndex(0);
    setPlaying(true);
  };

  const pause = () => setPlaying(false);

  const changeAlgorithm = (next: Algorithm) => {
    setAlgorithm(next);
    setPlaying(false);
    setSteps(null);
    setStepIndex(0);
  };

  // Playback loop
  useEffect(() => {
    if (!playing || !steps) return;
    intervalRef.current = window.setInterval(() => {
      setStepIndex((i) => {
        if (i >= steps.length - 1) {
          setPlaying(false);
          return i;
        }
        return i + 1;
      });
    }, 110);
    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
    };
  }, [playing, steps]);

  // Open via the command palette's dispatched event, close on Escape —
  // same self-contained open/close pattern as CommandPalette itself.
  useEffect(() => {
    const openHandler = () => setOpen(true);
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("open-sort-visualizer", openHandler);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("open-sort-visualizer", openHandler);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    if (open) acquireScrollLock();
    else releaseScrollLock();
  }, [open]);

  const displayArray = steps ? steps[stepIndex].array : array;
  const comparing = steps ? steps[stepIndex].comparing : undefined;
  const pivot = steps ? steps[stepIndex].pivot : undefined;
  const sortedIndices = useMemo(
    () => new Set(steps ? steps[stepIndex].sortedIndices ?? [] : []),
    [steps, stepIndex],
  );
  const isDone = steps ? stepIndex === steps.length - 1 : false;
  const maxVal = Math.max(...displayArray, 1);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center px-4">
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
            aria-label="Sort visualizer"
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.25, ease: EASE_PREMIUM }}
            className="relative w-full max-w-xl bg-background border border-border rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-border">
              <div>
                <p className="text-sm font-medium">{ALGO_LABEL[algorithm]}</p>
                <p className="text-xs text-muted-foreground">
                  A hidden one — since this is the actual specialty.
                </p>
              </div>
              <button
                onClick={close}
                aria-label="Close"
                className="p-1.5 rounded-full text-muted-foreground hover:text-foreground hover:bg-foreground/5 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Bars */}
            <div className="px-5 pt-8 pb-4 h-56 flex items-end justify-center gap-1.5 sm:gap-2">
              {displayArray.map((val, i) => {
                const isComparing = comparing?.includes(i);
                const isPivot = pivot === i;
                const isSorted = sortedIndices.has(i) || isDone;
                return (
                  <motion.div
                    key={i}
                    layout
                    transition={{ duration: 0.09, ease: "easeOut" }}
                    className={`w-full max-w-8 rounded-t-sm ${
                      isPivot
                        ? "bg-foreground border-2 border-dashed border-foreground"
                        : isComparing
                          ? "bg-foreground"
                          : isSorted
                            ? "bg-foreground/60"
                            : "bg-foreground/25"
                    }`}
                    style={{ height: `${(val / maxVal) * 100}%` }}
                  />
                );
              })}
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between gap-3 px-5 py-4 border-t border-border">
              <div className="flex items-center gap-1.5">
                {(["bubble", "quick"] as Algorithm[]).map((a) => (
                  <button
                    key={a}
                    onClick={() => changeAlgorithm(a)}
                    className={`px-3 py-1.5 rounded-full text-xs border transition-colors cursor-pointer ${
                      algorithm === a
                        ? "border-foreground bg-foreground text-background"
                        : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/40"
                    }`}
                  >
                    {ALGO_LABEL[a]}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={shuffle}
                  aria-label="Shuffle array"
                  className="p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-foreground/5 transition-colors cursor-pointer"
                >
                  <Shuffle size={16} />
                </button>
                <button
                  onClick={() => {
                    setPlaying(false);
                    setSteps(null);
                    setStepIndex(0);
                  }}
                  aria-label="Reset"
                  className="p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-foreground/5 transition-colors cursor-pointer"
                >
                  <RotateCcw size={16} />
                </button>
                <button
                  onClick={playing ? pause : play}
                  aria-label={playing ? "Pause" : "Play"}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-foreground text-background text-xs font-medium hover:opacity-85 transition-opacity cursor-pointer"
                >
                  {playing ? <Pause size={14} /> : <Play size={14} />}
                  {playing ? "Pause" : isDone ? "Replay" : "Sort"}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default SortVisualizer;
