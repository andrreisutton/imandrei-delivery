import { CSSProperties } from "react";

function seeded(seed: string) {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return () => {
    h = Math.imul(h ^ (h >>> 15), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return ((h ^= h >>> 16) >>> 0) / 4294967296;
  };
}

const CHANNELS = [
  { label: "R", color: "0.66 0.215 27", gain: 1 },
  { label: "G", color: "0.72 0.16 150", gain: 0.34 },
  { label: "B", color: "0.62 0.15 262", gain: 0.34 },
];

export function HeroScope({ bars = 42 }: { bars?: number }) {
  const rand = seeded("andrei-parade");
  const silhouette = Array.from({ length: bars }, (_, i) => {
    const center = Math.abs(i / bars - 0.5) * 2;
    return (0.22 + rand() * 0.72) * (1 - center * 0.3);
  });
  const w = 3;
  const gap = 4;
  const panelW = bars * (w + gap);
  const panelGap = 26;
  const H = 100;
  const totalW = panelW * 3 + panelGap * 2;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 bottom-0 h-[30vh] min-h-40"
      style={{
        maskImage:
          "linear-gradient(to top, black 35%, transparent), linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
        maskComposite: "intersect",
        WebkitMaskImage:
          "linear-gradient(to top, black 35%, transparent), linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
        WebkitMaskComposite: "source-in",
      }}
    >
      <svg viewBox={`0 0 ${totalW} ${H}`} preserveAspectRatio="none" className="h-full w-full">
        {CHANNELS.map((ch, c) => {
          const x0 = c * (panelW + panelGap);
          return (
            <g key={ch.label}>
              {silhouette.map((base, i) => {
                const gain = 0.72 + rand() * 0.55;
                const h = Math.min(1, base * gain);
                const hot = rand() > 0.88;
                return (
                  <rect
                    key={i}
                    className="wave-bar-rise"
                    style={
                      {
                        animationDelay: `${(rand() * 4).toFixed(2)}s`,
                        "--wave-d": `${(2.4 + rand() * 5).toFixed(2)}s`,
                      } as CSSProperties
                    }
                    x={x0 + i * (w + gap)}
                    y={H - h * H}
                    width={w}
                    height={h * H}
                    rx={1}
                    fill={`oklch(${ch.color} / ${((hot ? 0.42 : 0.15) * ch.gain).toFixed(3)})`}
                  />
                );
              })}
              <text
                x={x0 + 2}
                y={H - 5}
                fontSize="7"
                fontFamily="var(--font-sans)" fontWeight="600"
                fill={`oklch(${ch.color} / ${(0.55 * ch.gain).toFixed(2)})`}
              >
                {ch.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
