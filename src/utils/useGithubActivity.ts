import { useEffect, useState } from "react";

const GITHUB_USERNAME = "Zephyrex21";
const CACHE_KEY = "gh_activity_v1";
const CACHE_TTL = 1000 * 60 * 30; // 30 min — activity is more time-sensitive than repo count

export interface GithubActivity {
  repo: string; // short repo name, e.g. "kaira-ai-agent"
  timestamp: number; // ms epoch
}

interface CachedActivity {
  activity: GithubActivity | null;
  ts: number;
}

/**
 * Fetches the most recent push event from the public GitHub events feed —
 * used to show a real "last commit: 2h ago on X" status instead of a
 * static claim. Same defensive pattern as useGithubStats: silent fallback
 * to `null` (component decides what to render when there's nothing to
 * show) on any failure — rate limit, network error, no recent activity —
 * never a visible error state.
 */
export function useGithubActivity() {
  const [activity, setActivity] = useState<GithubActivity | null>(null);
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const cachedRaw = sessionStorage.getItem(CACHE_KEY);
        if (cachedRaw) {
          const cached: CachedActivity = JSON.parse(cachedRaw);
          if (Date.now() - cached.ts < CACHE_TTL) {
            if (!cancelled) {
              setActivity(cached.activity);
              setIsLive(true);
            }
            return;
          }
        }

        const res = await fetch(
          `https://api.github.com/users/${GITHUB_USERNAME}/events/public?per_page=10`,
        );
        if (!res.ok) return;

        const events = await res.json();
        if (!Array.isArray(events)) return;

        // PushEvent is the closest signal to "actively writing code" —
        // other event types (WatchEvent/ForkEvent/etc.) don't represent
        // the person's own commits.
        const push = events.find((e) => e.type === "PushEvent");
        const result: GithubActivity | null = push
          ? {
              repo: String(push.repo?.name ?? "").split("/").pop() ?? "",
              timestamp: new Date(push.created_at).getTime(),
            }
          : null;

        sessionStorage.setItem(
          CACHE_KEY,
          JSON.stringify({ activity: result, ts: Date.now() } as CachedActivity),
        );

        if (!cancelled) {
          setActivity(result);
          setIsLive(true);
        }
      } catch {
        // Rate limit, network error, CORS — keep null, render nothing.
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return { activity, isLive };
}

/** "2h ago", "3d ago", "just now" — no external date library needed for this. */
export function formatRelativeTime(timestamp: number): string {
  const diffMs = Date.now() - timestamp;
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  return `${months}mo ago`;
}
