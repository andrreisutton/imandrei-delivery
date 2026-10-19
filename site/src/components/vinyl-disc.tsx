function frameSrc(src: string): string {
  if (!/^https:\/\/cdn\.sanity\.io\//.test(src)) return src;
  const [base] = src.split("?");
  return `${base}?w=360&h=360&fit=crop&crop=entropy&auto=format`;
}

type Props = {
  hue: number;
  className?: string;
  labelImage?: string;
  idKey?: string;
};

/**
 * A record sleeve with the vinyl slid halfway out from behind it. The sleeve
 * carries the title typography and the compatible-app badges (drawn by the
 * caller, in HTML, over this SVG); the record itself stays plain — grooves,
 * sheen, and a label showing the cover art when there is one.
 */
export function VinylDisc({ hue, className = "", labelImage, idKey = "vinyl" }: Props) {
  const W = 200;
  const H = 250;
  const sleeveW = W * 0.6;
  const r = W * 0.293;
  const recordCx = sleeveW + r * 0.35;
  const recordCy = H * 0.235 + r;
  const labelR = r * 0.3;
  const grooves = [0.55, 0.66, 0.77, 0.88, 0.97];
  const clipId = `${idKey}-label-clip`;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className={className} aria-hidden="true">
      <defs>
        <clipPath id={clipId}>
          <circle cx={recordCx} cy={recordCy} r={labelR} />
        </clipPath>
        <radialGradient id={`${idKey}-vinyl`} cx="0.34" cy="0.26" r="0.95">
          <stop offset="0%" stopColor="oklch(0.40 0.01 60)" />
          <stop offset="45%" stopColor="oklch(0.19 0.008 60)" />
          <stop offset="100%" stopColor="oklch(0.08 0.004 60)" />
        </radialGradient>
        <linearGradient id={`${idKey}-sheen`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="oklch(1 0 0 / 0.22)" />
          <stop offset="35%" stopColor="oklch(1 0 0 / 0)" />
        </linearGradient>
        <radialGradient id={`${idKey}-label-fallback`} cx="0.35" cy="0.3" r="0.9">
          <stop offset="0%" stopColor={`oklch(0.42 0.05 ${hue})`} />
          <stop offset="100%" stopColor={`oklch(0.24 0.03 ${hue})`} />
        </radialGradient>
        <linearGradient id={`${idKey}-sleeve`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={`oklch(0.20 0.015 ${hue})`} />
          <stop offset="100%" stopColor={`oklch(0.13 0.012 ${hue})`} />
        </linearGradient>
      </defs>

      {/* contact shadow */}
      <ellipse cx={recordCx + 2} cy={recordCy + r + 5} rx={r * 0.7} ry="5" fill="oklch(0 0 0 / 0.35)" />

      {/* record: drawn before the sleeve so the sleeve hides its left half */}
      <circle
        cx={recordCx}
        cy={recordCy}
        r={r}
        fill={`url(#${idKey}-vinyl)`}
        stroke="oklch(0.95 0.02 60 / 0.4)"
        strokeWidth="0.8"
      />
      {grooves.map((g) => (
        <circle
          key={g}
          cx={recordCx}
          cy={recordCy}
          r={r * g}
          fill="none"
          stroke="oklch(1 0 0 / 0.07)"
          strokeWidth="0.5"
        />
      ))}
      <circle cx={recordCx} cy={recordCy} r={r} fill={`url(#${idKey}-sheen)`} />

      {/* label: product art when we have it, otherwise a plain color field */}
      <circle cx={recordCx} cy={recordCy} r={labelR + 1.6} fill="oklch(0 0 0 / 0.4)" />
      {labelImage ? (
        <image
          href={frameSrc(labelImage)}
          x={recordCx - labelR}
          y={recordCy - labelR}
          width={labelR * 2}
          height={labelR * 2}
          preserveAspectRatio="xMidYMid slice"
          clipPath={`url(#${clipId})`}
        />
      ) : (
        <circle cx={recordCx} cy={recordCy} r={labelR} fill={`url(#${idKey}-label-fallback)`} />
      )}
      <circle cx={recordCx} cy={recordCy} r={labelR} fill="none" stroke="oklch(0.95 0.02 60 / 0.4)" strokeWidth="0.8" />
      <circle cx={recordCx} cy={recordCy} r="1.8" fill="oklch(0.07 0 0)" />

      {/* sleeve, opaque, occludes the hidden half of the record */}
      <rect x="0" y="0" width={sleeveW} height={H} fill={`url(#${idKey}-sleeve)`} />
      <rect x={sleeveW - 0.5} y="0" width="1" height={H} fill="oklch(1 0 0 / 0.06)" />
    </svg>
  );
}
