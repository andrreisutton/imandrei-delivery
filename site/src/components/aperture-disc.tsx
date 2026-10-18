import { Aperture } from "@phosphor-icons/react/dist/ssr";

type Props = {
  hue: number;
  className?: string;
  labelImage?: string;
  idKey?: string;
};

function frameSrc(src: string): string {
  if (!/^https:\/\/cdn\.sanity\.io\//.test(src)) return src;
  const [base] = src.split("?");
  return `${base}?w=360&h=360&fit=crop&crop=entropy&auto=format`;
}

export function ApertureDisc({ hue, className = "", labelImage, idKey = "iris" }: Props) {
  if (labelImage) {
    const clipId = `iris-frame-${idKey}`;
    return (
      <svg viewBox="0 0 200 200" className={className} aria-hidden="true">
        <circle cx="100" cy="100" r="96" fill={`oklch(0.145 0.006 ${hue})`} stroke="oklch(1 0 0 / 12%)" />
        <defs>
          <clipPath id={clipId}>
            <circle cx="100" cy="100" r="84" />
          </clipPath>
        </defs>
        <image
          href={frameSrc(labelImage)}
          x="16"
          y="16"
          width="168"
          height="168"
          preserveAspectRatio="xMidYMid slice"
          clipPath={`url(#${clipId})`}
        />
        <circle cx="100" cy="100" r="84" fill={`oklch(0.45 0.13 ${hue} / 0.20)`} />
        <circle cx="100" cy="100" r="84" fill="none" stroke="oklch(0 0 0 / 45%)" strokeWidth="8" />
        <circle cx="100" cy="100" r="84" fill="none" stroke="oklch(1 0 0 / 16%)" />
      </svg>
    );
  }
  return (
    <div className={`aspect-square ${className}`} aria-hidden="true">
      <Aperture size="100%" weight="duotone" color={`oklch(0.62 0.195 ${hue})`} className="iris-spin" />
    </div>
  );
}
