import { useEffect, useState } from "react";

const GITHUB_USERNAME = "Zephyrex21";
const FALLBACK_REPO_COUNT = 37; // matches live count as of this update — see api.github.com/users/Zephyrex21
const CACHE_KEY = "gh_stats_v1";
const CACHE_TTL = 1000 * 60 * 60; // 1 hour

interface CachedStats {
  repoCount: number;
  ts: number;
}

/**
 * Fetches the real public repo count from the GitHub REST API.
 * Falls back silently to a static number if the request fails or the
 * unauthenticated rate limit is hit — this should never show an error
 * state or a visible glitch, just quietly use the last-known-good
 * number. Caches in sessionStorage so navigating around the site
 * doesn't re-fetch on every mount.
 */
export function useGithubStats() {
  const [repoCount, setRepoCount] = useState<number>(FALLBACK_REPO_COUNT);
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const cachedRaw = sessionStorage.getItem(CACHE_KEY);
        if (cachedRaw) {
          const cached: CachedStats = JSON.parse(cachedRaw);
          if (Date.now() - cached.ts < CACHE_TTL) {
            if (!cancelled) {
              setRepoCount(cached.repoCount);
              setIsLive(true);
            }
            return;
          }
        }

        const res = await fetch(
          `https://api.github.com/users/${GITHUB_USERNAME}`,
        );
        if (!res.ok) return; // keep fallback, silently

        const data = await res.json();
        const count = data?.public_repos;
        if (typeof count !== "number") return;

        sessionStorage.setItem(
          CACHE_KEY,
          JSON.stringify({ repoCount: count, ts: Date.now() } as CachedStats),
        );

        if (!cancelled) {
          setRepoCount(count);
          setIsLive(true);
        }
      } catch {
        // Network error, CORS issue, rate limit — keep the fallback,
        // no visible error state.
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return { repoCount, isLive };
}
