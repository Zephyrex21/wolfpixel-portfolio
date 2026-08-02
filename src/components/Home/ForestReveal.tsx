import React from "react";

/* ===================== HELPERS ===================== */

// Deterministic pseudo-random so the scene is stable across re-renders
// (no visual "jump" on React updates).
const seededRandom = (seed: number) => {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
};

// A simple tiered conifer silhouette, centered on cx with its base at baseY.
const pineSilhouette = (
  cx: number,
  baseY: number,
  h: number,
  w: number,
): string => {
  const topY = baseY - h;
  const tier1Y = baseY - h * 0.64;
  const tier2Y = baseY - h * 0.34;
  const w1 = w * 0.26;
  const w2 = w * 0.4;
  const w3 = w * 0.5;
  const trunkW = w * 0.07;
  const trunkH = h * 0.1;

  return `
    M ${cx} ${topY}
    L ${cx + w1} ${tier1Y}
    L ${cx + w1 * 0.5} ${tier1Y}
    L ${cx + w2} ${tier2Y}
    L ${cx + w2 * 0.55} ${tier2Y}
    L ${cx + w3} ${baseY - trunkH}
    L ${cx + trunkW} ${baseY - trunkH}
    L ${cx + trunkW} ${baseY}
    L ${cx - trunkW} ${baseY}
    L ${cx - trunkW} ${baseY - trunkH}
    L ${cx - w3} ${baseY - trunkH}
    L ${cx - w2 * 0.55} ${tier2Y}
    L ${cx - w2} ${tier2Y}
    L ${cx - w1 * 0.5} ${tier1Y}
    L ${cx - w1} ${tier1Y}
    Z
  `;
};

interface TreeRowProps {
  count: number;
  yBase: number;
  minH: number;
  maxH: number;
  fill: string;
  opacity: number;
  blur?: number;
  seedOffset: number;
  spread?: [number, number];
}

const TreeRow: React.FC<TreeRowProps> = ({
  count,
  yBase,
  minH,
  maxH,
  fill,
  opacity,
  blur = 0,
  seedOffset,
  spread = [-40, 640],
}) => {
  const [start, end] = spread;
  const trees = Array.from({ length: count }).map((_, i) => {
    const seed = i * 12.9898 + seedOffset;
    const jitterX = (seededRandom(seed) - 0.5) * 46;
    const hRand = seededRandom(seed + 3.71);
    const cx = start + (i / Math.max(count - 1, 1)) * (end - start) + jitterX;
    const h = minH + hRand * (maxH - minH);
    const w = h * 0.6;
    return <path key={i} d={pineSilhouette(cx, yBase, h, w)} fill={fill} />;
  });

  return (
    <g opacity={opacity} style={blur ? { filter: `blur(${blur}px)` } : undefined}>
      {trees}
    </g>
  );
};

/* ===================== COMPONENT ===================== */

const ForestReveal: React.FC = () => {
  return (
    <svg
      viewBox="0 0 600 800"
      preserveAspectRatio="xMidYMid slice"
      className="w-full h-full"
      style={{ display: "block" }}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="forestSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e7e6e3" />
          <stop offset="42%" stopColor="#9a9a96" />
          <stop offset="75%" stopColor="#4a4946" />
          <stop offset="100%" stopColor="#181716" />
        </linearGradient>
        <linearGradient id="forestMist" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0.5" />
        </linearGradient>
      </defs>

      <rect x="0" y="0" width="600" height="800" fill="url(#forestSky)" />

      {/* Furthest row — lightest, softest */}
      <TreeRow
        count={10}
        yBase={420}
        minH={80}
        maxH={140}
        fill="#8c8c88"
        opacity={0.5}
        blur={7}
        seedOffset={1}
      />

      {/* Mid row */}
      <TreeRow
        count={7}
        yBase={540}
        minH={150}
        maxH={230}
        fill="#4a4944"
        opacity={0.82}
        blur={2.5}
        seedOffset={17}
      />

      {/* Nearest row — darkest, sharpest */}
      <TreeRow
        count={5}
        yBase={690}
        minH={230}
        maxH={340}
        fill="#131210"
        opacity={0.97}
        seedOffset={41}
        spread={[-20, 620]}
      />

      {/* Ground mist */}
      <rect x="0" y="540" width="600" height="260" fill="url(#forestMist)" />

      {/* Drifting fog wisps */}
      <ellipse cx="140" cy="470" rx="130" ry="26" fill="#ffffff" opacity="0.2" style={{ filter: "blur(16px)" }} />
      <ellipse cx="430" cy="560" rx="160" ry="30" fill="#ffffff" opacity="0.16" style={{ filter: "blur(20px)" }} />
      <ellipse cx="300" cy="660" rx="190" ry="34" fill="#ffffff" opacity="0.14" style={{ filter: "blur(22px)" }} />
    </svg>
  );
};

export default ForestReveal;
