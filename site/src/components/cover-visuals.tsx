export type Palette = {
  skyHi: string;
  skyLo: string;
  glow: string;
  sun: string;
  sunCore: string;
  far: string;
  near: string;
  mist: string;
};

export function graded(hue: number): Palette {
  return {
    skyHi: `oklch(0.38 0.10 ${hue})`,
    skyLo: `oklch(0.66 0.15 ${hue})`,
    glow: `oklch(0.80 0.14 ${hue} / 0.55)`,
    sun: "oklch(0.88 0.12 70)",
    sunCore: "oklch(0.97 0.05 85)",
    far: `oklch(0.30 0.07 ${hue})`,
    near: `oklch(0.17 0.045 ${hue})`,
    mist: `oklch(0.72 0.10 ${hue} / 0.22)`,
  };
}

export const LOG: Palette = {
  skyHi: "oklch(0.52 0.008 90)",
  skyLo: "oklch(0.60 0.010 90)",
  glow: "oklch(0.66 0.012 90 / 0.4)",
  sun: "oklch(0.70 0.014 90)",
  sunCore: "oklch(0.76 0.014 90)",
  far: "oklch(0.46 0.010 90)",
  near: "oklch(0.38 0.008 90)",
  mist: "oklch(0.60 0.010 90 / 0.18)",
};

export function Scene({ id, p }: { id: string; p: Palette }) {
  return (
    <g>
      <defs>
        <linearGradient id={`${id}-sky`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={p.skyHi} />
          <stop offset="78%" stopColor={p.skyLo} />
        </linearGradient>
        <radialGradient id={`${id}-bloom`} cx="0.66" cy="0.42" r="0.55">
          <stop offset="0%" stopColor={p.glow} />
          <stop offset="100%" stopColor={p.glow.replace(/ \/ [\d.]+\)/, " / 0)")} />
        </radialGradient>
        <linearGradient id={`${id}-far`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={p.far} />
          <stop offset="100%" stopColor={p.near} />
        </linearGradient>
        <linearGradient id={`${id}-mist`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={p.mist} />
          <stop offset="100%" stopColor={p.mist.replace(/ \/ [\d.]+\)/, " / 0)")} />
        </linearGradient>
      </defs>
      <rect width="160" height="90" fill={`url(#${id}-sky)`} />
      <rect width="160" height="90" fill={`url(#${id}-bloom)`} />
      <circle cx="106" cy="38" r="17" fill={p.sun} opacity="0.55" />
      <circle cx="106" cy="38" r="11" fill={p.sunCore} />
      <rect x="82" y="35" width="52" height="2.4" fill={p.skyLo} opacity="0.8" />
      <rect x="88" y="42" width="46" height="1.6" fill={p.skyLo} opacity="0.65" />
      <polygon points="58,90 104,46 160,90" fill={`url(#${id}-far)`} />
      <polyline points="58,90 104,46 132,68" fill="none" stroke={p.sunCore} strokeWidth="0.8" opacity="0.5" />
      <polygon points="0,90 48,34 106,90" fill={p.near} />
      <rect x="0" y="74" width="160" height="16" fill={`url(#${id}-mist)`} />
    </g>
  );
}

const ink = (hue: number, l: number, c = 0.02, a = 1) =>
  `oklch(${l} ${c} ${hue} / ${a})`;

function Panel({ hue, r = 3 }: { hue: number; r?: number }) {
  return (
    <>
      <rect width="160" height="90" fill={ink(hue, 0.12, 0.012)} />
      <rect
        x="6"
        y="6"
        width="148"
        height="78"
        rx={r}
        fill={ink(hue, 0.16, 0.014)}
        stroke={ink(hue, 0.95, 0.004, 0.09)}
        strokeWidth="0.7"
      />
    </>
  );
}

function Cover({ children }: { children: React.ReactNode }) {
  return (
    <svg viewBox="0 0 160 90" className="size-full" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      {children}
    </svg>
  );
}

export function ColorWheels({ hue, idKey = "cw" }: { hue: number; idKey?: string }) {
  const wheels = [
    { cx: 42, label: 0.34 },
    { cx: 80, label: 0.5 },
    { cx: 118, label: 0.66 },
  ];
  return (
    <Cover>
      <Panel hue={hue} />
      {wheels.map((w, i) => (
        <g key={i}>
          <circle cx={w.cx} cy="40" r="19" fill="none" stroke={ink(hue, 0.95, 0.004, 0.14)} strokeWidth="0.7" />
          <circle cx={w.cx} cy="40" r="15" fill={`oklch(${0.30 + i * 0.06} ${0.09 + i * 0.03} ${hue})`} />
          <circle cx={w.cx} cy="40" r="15" fill={`url(#${idKey}-sheen)`} />
          <circle
            cx={w.cx + (i === 0 ? -4 : i === 1 ? 3 : 6)}
            cy={40 + (i === 0 ? 3 : i === 1 ? -4 : 2)}
            r="2.6"
            fill={ink(hue, 0.99, 0.01)}
          />
          <rect x={w.cx - 13} y="64" width="26" height="2" rx="1" fill={ink(hue, 0.95, 0.004, 0.16)} />
          <rect x={w.cx - 13} y="64" width={9 + i * 6} height="2" rx="1" fill={`oklch(0.66 0.20 ${hue})`} />
        </g>
      ))}
      <defs>
        <radialGradient id={`${idKey}-sheen`} cx="0.35" cy="0.3" r="0.8">
          <stop offset="0%" stopColor="oklch(1 0 0 / 0.22)" />
          <stop offset="100%" stopColor="oklch(1 0 0 / 0)" />
        </radialGradient>
      </defs>
      <rect x="14" y="15" width="18" height="2.2" rx="1.1" fill={ink(hue, 0.95, 0.004, 0.2)} />
    </Cover>
  );
}

export function DevelopPanel({ hue, idKey = "dp" }: { hue: number; idKey?: string }) {
  const bars = [3, 5, 8, 13, 19, 26, 31, 34, 33, 29, 25, 22, 24, 27, 24, 18, 13, 9, 6, 4];
  return (
    <Cover>
      <Panel hue={hue} />
      <defs>
        <linearGradient id={`${idKey}-hist`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={`oklch(0.78 0.16 ${hue})`} />
          <stop offset="100%" stopColor={`oklch(0.45 0.12 ${hue} / 0.35)`} />
        </linearGradient>
      </defs>
      {bars.map((h, i) => (
        <rect
          key={i}
          x={14 + i * 6.6}
          y={46 - h}
          width="5"
          height={h}
          rx="0.8"
          fill={`url(#${idKey}-hist)`}
        />
      ))}
      <rect x="14" y="46" width="132" height="0.7" fill={ink(hue, 0.95, 0.004, 0.22)} />
      {[0.62, 0.38, 0.74, 0.5].map((v, i) => (
        <g key={i}>
          <rect x="14" y={55 + i * 7} width="132" height="1.6" rx="0.8" fill={ink(hue, 0.95, 0.004, 0.14)} />
          <rect x="14" y={55 + i * 7} width={132 * v} height="1.6" rx="0.8" fill={`oklch(0.68 0.17 ${hue})`} />
          <circle cx={14 + 132 * v} cy={55.8 + i * 7} r="2.4" fill={ink(hue, 0.99, 0.01)} />
        </g>
      ))}
    </Cover>
  );
}

export function BinTree({ hue, idKey = "bt" }: { hue: number; idKey?: string }) {
  const rows = [
    { d: 0, w: 46, folder: true },
    { d: 1, w: 38, folder: true },
    { d: 2, w: 30, folder: false },
    { d: 2, w: 34, folder: false },
    { d: 1, w: 42, folder: true },
    { d: 2, w: 28, folder: false },
    { d: 1, w: 36, folder: true },
  ];
  return (
    <Cover>
      <Panel hue={hue} />
      {rows.map((r, i) => {
        const x = 18 + r.d * 10;
        const y = 17 + i * 8.6;
        return (
          <g key={i}>
            {r.d > 0 && (
              <path
                d={`M${x - 5} ${y - 6} V${y + 2.6} H${x - 1}`}
                fill="none"
                stroke={ink(hue, 0.95, 0.004, 0.16)}
                strokeWidth="0.6"
              />
            )}
            {r.folder ? (
              <path
                d={`M${x} ${y} h4 l1.4 1.6 h4.6 a1 1 0 0 1 1 1 v3.4 a1 1 0 0 1 -1 1 h-10 a1 1 0 0 1 -1 -1 v-5 a1 1 0 0 1 1 -1 z`}
                fill={`oklch(0.62 0.17 ${hue})`}
              />
            ) : (
              <rect x={x} y={y} width="8" height="6.4" rx="1" fill={ink(hue, 0.55, 0.03)} />
            )}
            <rect x={x + 13} y={y + 1.6} width={r.w} height="2.6" rx="1.3" fill={ink(hue, 0.95, 0.004, r.folder ? 0.32 : 0.18)} />
          </g>
        );
      })}
      <rect x="112" y="17" width="34" height="56" rx="2" fill={ink(hue, 0.2, 0.02)} stroke={ink(hue, 0.95, 0.004, 0.1)} strokeWidth="0.6" />
      <rect x="117" y="24" width="24" height="14" rx="1.4" fill={ink(hue, 0.34, 0.06)} />
      <rect x="117" y="42" width="24" height="2.2" rx="1.1" fill={ink(hue, 0.95, 0.004, 0.16)} />
      <rect x="117" y="47" width="16" height="2.2" rx="1.1" fill={ink(hue, 0.95, 0.004, 0.12)} />
    </Cover>
  );
}

export function KineticTitles({ hue, idKey = "kt" }: { hue: number; idKey?: string }) {
  return (
    <Cover>
      <Panel hue={hue} />
      <defs>
        <linearGradient id={`${idKey}-phone`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={`oklch(0.34 0.09 ${hue})`} />
          <stop offset="100%" stopColor={`oklch(0.18 0.05 ${hue})`} />
        </linearGradient>
      </defs>
      <rect x="59" y="12" width="42" height="66" rx="5" fill={`url(#${idKey}-phone)`} stroke={ink(hue, 0.95, 0.004, 0.16)} strokeWidth="0.7" />
      <rect x="74" y="15" width="12" height="1.6" rx="0.8" fill={ink(hue, 0.95, 0.004, 0.25)} />
      {[
        { y: 40, w: 30, on: true },
        { y: 48, w: 22, on: false },
        { y: 56, w: 26, on: true },
      ].map((t, i) => (
        <g key={i}>
          <rect x="64" y={t.y} width={t.w} height="5" rx="1.2" fill={t.on ? `oklch(0.66 0.20 ${hue})` : ink(hue, 0.95, 0.004, 0.2)} />
        </g>
      ))}
      <path
        d="M14 66 C24 66 26 34 36 34 C44 34 46 52 54 52"
        fill="none"
        stroke={`oklch(0.7 0.16 ${hue})`}
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      {[
        [14, 66],
        [36, 34],
        [54, 52],
      ].map(([x, y], i) => (
        <rect key={i} x={x - 1.8} y={y - 1.8} width="3.6" height="3.6" rx="0.6" fill={ink(hue, 0.99, 0.01)} transform={`rotate(45 ${x} ${y})`} />
      ))}
      <rect x="110" y="30" width="34" height="4" rx="2" fill={ink(hue, 0.95, 0.004, 0.14)} />
      <rect x="110" y="38" width="24" height="4" rx="2" fill={ink(hue, 0.95, 0.004, 0.1)} />
      <rect x="110" y="46" width="30" height="4" rx="2" fill={ink(hue, 0.95, 0.004, 0.12)} />
    </Cover>
  );
}

export function ChannelStrip({
  hue,
  idKey = "cs",
  modules = 3,
}: {
  hue: number;
  idKey?: string;
  modules?: number;
}) {
  return (
    <Cover>
      <Panel hue={hue} />
      <defs>
        <linearGradient id={`${idKey}-eq`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={`oklch(0.72 0.17 ${hue} / 0.55)`} />
          <stop offset="100%" stopColor={`oklch(0.5 0.12 ${hue} / 0)`} />
        </linearGradient>
      </defs>
      <path
        d="M14 44 C30 44 30 26 46 26 C60 26 62 40 76 40 C90 40 92 30 106 32 C118 34 124 44 146 42 L146 56 L14 56 Z"
        fill={`url(#${idKey}-eq)`}
      />
      <path
        d="M14 44 C30 44 30 26 46 26 C60 26 62 40 76 40 C90 40 92 30 106 32 C118 34 124 44 146 42"
        fill="none"
        stroke={`oklch(0.76 0.18 ${hue})`}
        strokeWidth="1.3"
        strokeLinecap="round"
      />
      {[46, 76, 106].slice(0, modules).map((x, i) => (
        <circle key={i} cx={x} cy={i === 0 ? 26 : i === 1 ? 40 : 32} r="2.4" fill={ink(hue, 0.99, 0.01)} />
      ))}
      {Array.from({ length: modules }, (_, i) => (
        <g key={i}>
          <rect x="14" y={62 + i * 7} width="96" height="4.6" rx="1.4" fill={ink(hue, 0.24, 0.03)} stroke={ink(hue, 0.95, 0.004, 0.1)} strokeWidth="0.5" />
          <rect x="16.5" y={63.6 + i * 7} width={18 + i * 10} height="1.6" rx="0.8" fill={`oklch(0.66 0.19 ${hue})`} />
        </g>
      ))}
      <rect x="126" y="60" width="18" height="18" rx="2" fill={ink(hue, 0.22, 0.03)} stroke={ink(hue, 0.95, 0.004, 0.1)} strokeWidth="0.5" />
      <rect x="134" y="62" width="2" height="14" rx="1" fill={ink(hue, 0.95, 0.004, 0.18)} />
      <rect x="130.5" y={66 + (3 - modules) * 2} width="9" height="3" rx="1.2" fill={ink(hue, 0.95, 0.01)} />
    </Cover>
  );
}

export function KitStack({ hue, idKey = "ks" }: { hue: number; idKey?: string }) {
  return (
    <Cover>
      <Panel hue={hue} />
      <defs>
        <linearGradient id={`${idKey}-top`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={`oklch(0.46 0.14 ${hue})`} />
          <stop offset="100%" stopColor={`oklch(0.26 0.08 ${hue})`} />
        </linearGradient>
      </defs>
      <g transform="rotate(-9 80 46)">
        <rect x="44" y="26" width="72" height="42" rx="3" fill={ink(hue, 0.22, 0.04)} stroke={ink(hue, 0.95, 0.004, 0.09)} strokeWidth="0.6" />
      </g>
      <g transform="rotate(-4 80 46)">
        <rect x="46" y="24" width="72" height="42" rx="3" fill={ink(hue, 0.27, 0.05)} stroke={ink(hue, 0.95, 0.004, 0.11)} strokeWidth="0.6" />
      </g>
      <rect x="48" y="22" width="72" height="42" rx="3" fill={`url(#${idKey}-top)`} stroke={ink(hue, 0.95, 0.004, 0.18)} strokeWidth="0.7" />
      <rect x="54" y="30" width="30" height="2.6" rx="1.3" fill={ink(hue, 0.99, 0.01, 0.85)} />
      <rect x="54" y="36" width="20" height="2.2" rx="1.1" fill={ink(hue, 0.95, 0.004, 0.4)} />
      {[0, 1, 2].map((i) => (
        <rect key={i} x={54 + i * 21} y="48" width="17" height="4" rx="1.4" fill={`oklch(${0.4 + i * 0.13} ${0.1 + i * 0.04} ${hue})`} />
      ))}
    </Cover>
  );
}

export function MixFaders({ hue, idKey = "mf" }: { hue: number; idKey?: string }) {
  const levels = [0.55, 0.72, 0.4, 0.66, 0.3, 0.6, 0.48, 0.78];
  return (
    <Cover>
      <Panel hue={hue} />
      {levels.map((v, i) => {
        const x = 20 + i * 16;
        return (
          <g key={i}>
            <rect x={x} y="18" width="3" height="52" rx="1.5" fill={ink(hue, 0.95, 0.004, 0.12)} />
            <rect x={x} y={18 + 52 * (1 - v)} width="3" height={52 * v} rx="1.5" fill={`oklch(${0.5 + v * 0.2} 0.16 ${hue})`} />
            <rect x={x - 3.6} y={18 + 52 * (1 - v) - 3} width="10" height="6" rx="1.6" fill={ink(hue, 0.9, 0.01)} />
            <rect x={x - 2} y="74" width="7" height="2" rx="1" fill={ink(hue, 0.95, 0.004, 0.14)} />
          </g>
        );
      })}
    </Cover>
  );
}

export function MixMaster({ hue, idKey = "mm" }: { hue: number; idKey?: string }) {
  const levels = [0.58, 0.7, 0.44, 0.64, 0.34];
  return (
    <Cover>
      <Panel hue={hue} />
      {levels.map((v, i) => {
        const x = 18 + i * 14;
        return (
          <g key={i}>
            <rect x={x} y="20" width="2.6" height="48" rx="1.3" fill={ink(hue, 0.95, 0.004, 0.12)} />
            <rect x={x} y={20 + 48 * (1 - v)} width="2.6" height={48 * v} rx="1.3" fill={`oklch(${0.5 + v * 0.18} 0.15 ${hue})`} />
            <rect x={x - 3.2} y={20 + 48 * (1 - v) - 2.6} width="9" height="5.2" rx="1.4" fill={ink(hue, 0.88, 0.01)} />
          </g>
        );
      })}
      <path d="M92 44 H100" stroke={ink(hue, 0.95, 0.004, 0.25)} strokeWidth="0.8" />
      {[0, 1, 2].map((i) => (
        <rect key={i} x="102" y={24 + i * 15} width="42" height="11" rx="2" fill={ink(hue, 0.24, 0.04)} stroke={ink(hue, 0.95, 0.004, 0.12)} strokeWidth="0.6" />
      ))}
      {[0, 1, 2].map((i) => (
        <rect key={i} x="106" y={28 + i * 15} width={12 + i * 9} height="2.4" rx="1.2" fill={`oklch(0.68 0.19 ${hue})`} />
      ))}
      <path d="M100 44 H102" stroke={ink(hue, 0.95, 0.004, 0.25)} strokeWidth="0.8" />
    </Cover>
  );
}

export function Loudness({ hue, idKey = "ld" }: { hue: number; idKey?: string }) {
  const wave = Array.from({ length: 46 }, (_, i) => {
    const t = i / 45;
    const env = 0.55 + 0.45 * Math.sin(t * Math.PI * 3.1);
    const detail = 0.7 + 0.3 * Math.sin(t * Math.PI * 17);
    return Math.min(1, env * detail);
  });
  return (
    <Cover>
      <Panel hue={hue} />
      <rect x="14" y="24" width="104" height="0.8" fill={`oklch(0.7 0.2 ${hue} / 0.7)`} />
      <rect x="14" y="63" width="104" height="0.8" fill={`oklch(0.7 0.2 ${hue} / 0.7)`} />
      {wave.map((v, i) => {
        const h = 36 * v;
        return (
          <rect
            key={i}
            x={15 + i * 2.24}
            y={44 - h / 2}
            width="1.4"
            height={h}
            rx="0.7"
            fill={`oklch(${0.52 + v * 0.24} ${0.13 + v * 0.06} ${hue})`}
          />
        );
      })}
      <rect x="126" y="20" width="18" height="50" rx="2" fill={ink(hue, 0.2, 0.03)} stroke={ink(hue, 0.95, 0.004, 0.1)} strokeWidth="0.6" />
      {Array.from({ length: 9 }, (_, i) => (
        <rect
          key={i}
          x="129"
          y={64 - i * 5.4}
          width="12"
          height="3.2"
          rx="1"
          fill={i > 6 ? `oklch(0.72 0.21 ${hue})` : i > 3 ? `oklch(0.6 0.17 ${hue})` : `oklch(0.44 0.1 ${hue})`}
          opacity={i > 7 ? 0.35 : 1}
        />
      ))}
    </Cover>
  );
}
