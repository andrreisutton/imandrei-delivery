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

export function Waveform({
  seed,
  bars = 48,
  className = "",
  mode = "ambient",
  color = "currentColor",
}: {
  seed: string;
  bars?: number;
  className?: string;
  mode?: "live" | "ambient" | "static";
  color?: string;
}) {
  const rand = seeded(seed);
  const items = Array.from({ length: bars }, (_, i) => ({
    h: 0.18 + rand() * 0.82,
    delay: `${(i % 12) * 0.13}s`,
    duration: `${(3.2 + rand() * 2.2).toFixed(2)}s`,
  }));
  const w = 3;
  const gap = 3;
  const H = 64;
  const barClass = mode === "live" ? "wave-bar" : mode === "ambient" ? "wave-bar-soft" : undefined;
  return (
    <svg
      viewBox={`0 0 ${bars * (w + gap)} ${H}`}
      className={className}
      aria-hidden="true"
      preserveAspectRatio="none"
    >
      {items.map((bar, i) => (
        <rect
          key={i}
          className={barClass}
          style={
            barClass
              ? mode === "ambient"
                ? ({ animationDelay: bar.delay, "--wave-d": bar.duration } as React.CSSProperties)
                : { animationDelay: bar.delay }
              : undefined
          }
          x={i * (w + gap)}
          y={(H - bar.h * H) / 2}
          width={w}
          height={bar.h * H}
          rx={w / 2}
          fill={color}
        />
      ))}
    </svg>
  );
}
