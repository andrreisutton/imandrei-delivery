import type { Daw } from "@/content/site";

const DAW_LOGO: Record<Daw, string> = {
  "DaVinci Resolve": "/logos/davinci-resolve.svg",
  "Premiere Pro": "/logos/premiere-pro.svg",
  "Lightroom": "/logos/lightroom.svg",
  "FL Studio": "/logos/fl-studio.png",
};

type Props = {
  daws?: Daw[];
  className?: string;
  idKey?: string;
};

/**
 * A record sleeve with the vinyl slid just slightly out from behind it:
 * plain charcoal cover and spine, compatible-app badges stacked down the
 * spine (their own icon art, no added chip), and a sliver of glossy black
 * record showing past the spine's edge. Nothing is drawn on the vinyl
 * itself. Title/description/brand mark are layered on top in HTML by the
 * caller, confined to the cover panel's width.
 */
export function VinylDisc({ daws = [], className = "", idKey = "vinyl" }: Props) {
  const W = 200;
  const H = 200;
  const coverW = W * 0.52;
  const spineW = W * 0.17;
  const spineEnd = coverW + spineW;
  const r = W * 0.27;
  const exposedW = W * 0.19;
  const recordCx = spineEnd + exposedW - r;
  const recordCy = H * 0.47;
  const grooves = Array.from({ length: 20 }, (_, i) => 0.35 + i * (0.63 / 19));

  const icons = daws.map((d) => DAW_LOGO[d]);
  const iconSlot = Math.min(H * 0.62, 46) / Math.max(icons.length, 1);
  const iconSize = Math.min(spineW * 0.78, iconSlot * 0.8);
  const stackTop = H / 2 - (icons.length * iconSlot) / 2;

  const hiCx = recordCx + r * 0.62;
  const hiCy = recordCy - r * 0.15;
  const sheenX1 = spineEnd + 2;
  const sheenY1 = recordCy - r * 0.55;
  const sheenX2 = recordCx + r * 0.95;
  const sheenY2 = recordCy + r * 0.55;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className={className} aria-hidden="true">
      <defs>
        <radialGradient id={`${idKey}-vinyl`} gradientUnits="userSpaceOnUse" cx={hiCx} cy={hiCy} r={r * 0.85}>
          <stop offset="0%" stopColor="oklch(0.62 0.004 60)" />
          <stop offset="30%" stopColor="oklch(0.32 0.002 60)" />
          <stop offset="65%" stopColor="oklch(0.18 0.002 60)" />
          <stop offset="100%" stopColor="oklch(0.07 0 60)" />
        </radialGradient>
        <linearGradient id={`${idKey}-sheen`} gradientUnits="userSpaceOnUse" x1={sheenX1} y1={sheenY1} x2={sheenX2} y2={sheenY2}>
          <stop offset="0%" stopColor="oklch(1 0 0 / 0)" />
          <stop offset="35%" stopColor="oklch(1 0 0 / 0)" />
          <stop offset="48%" stopColor="oklch(1 0 0 / 0.5)" />
          <stop offset="60%" stopColor="oklch(1 0 0 / 0)" />
          <stop offset="100%" stopColor="oklch(1 0 0 / 0)" />
        </linearGradient>
        <linearGradient id={`${idKey}-cover`} x1="0" y1="0" x2="0.3" y2="1">
          <stop offset="0%" stopColor="oklch(0.27 0.004 60)" />
          <stop offset="100%" stopColor="oklch(0.19 0.004 60)" />
        </linearGradient>
        <linearGradient id={`${idKey}-spine`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="oklch(0.16 0.003 60)" />
          <stop offset="100%" stopColor="oklch(0.24 0.003 60)" />
        </linearGradient>
      </defs>

      <rect x="0" y="0" width={W} height={H} fill="oklch(0.045 0.002 60)" />

      {/* contact shadow */}
      <ellipse cx={recordCx + 2} cy={recordCy + r + 7} rx={r * 0.75} ry="6" fill="oklch(0 0 0 / 0.5)" />

      {/* record, plain: grooves and a specular sweep, nothing printed on it */}
      <circle cx={recordCx} cy={recordCy} r={r} fill={`url(#${idKey}-vinyl)`} />
      {grooves.map((g) => (
        <circle
          key={g}
          cx={recordCx}
          cy={recordCy}
          r={r * g}
          fill="none"
          stroke={`oklch(1 0 0 / ${g > 0.9 ? 0.05 : 0.09})`}
          strokeWidth="0.35"
        />
      ))}
      <circle cx={recordCx} cy={recordCy} r={r} fill="none" stroke="oklch(1 0 0 / 0.22)" strokeWidth="0.8" />
      <circle cx={recordCx} cy={recordCy} r={r} fill={`url(#${idKey}-sheen)`} />

      {/* cover */}
      <rect x="0" y="0" width={coverW} height={H} fill={`url(#${idKey}-cover)`} />

      {/* spine, carrying the compatible-app badges top to bottom */}
      <rect x={coverW} y="0" width={spineW} height={H} fill={`url(#${idKey}-spine)`} />
      <rect x={coverW - 0.4} y="0" width="0.8" height={H} fill="oklch(0 0 0 / 0.4)" />
      <rect x={spineEnd - 0.4} y="0" width="0.8" height={H} fill="oklch(1 0 0 / 0.08)" />
      {icons.map((href, i) => {
        const cy = stackTop + iconSlot * i + iconSlot / 2;
        return (
          <image
            key={href}
            href={href}
            x={coverW + spineW / 2 - iconSize / 2}
            y={cy - iconSize / 2}
            width={iconSize}
            height={iconSize}
            preserveAspectRatio="xMidYMid meet"
          />
        );
      })}
    </svg>
  );
}
