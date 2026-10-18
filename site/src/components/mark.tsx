import { Aperture } from "@phosphor-icons/react/dist/ssr";

export function BrandMark({
  size = 36,
  className = "",
  logo,
}: {
  size?: number;
  className?: string;
  logo?: string;
}) {
  if (logo) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={logo}
        alt=""
        style={{ height: size, width: "auto" }}
        className={`shrink-0 object-contain ${className}`}
        aria-hidden="true"
      />
    );
  }
  return (
    <span
      className={`inline-grid shrink-0 place-items-center rounded-full ${className}`}
      style={{
        width: size,
        height: size,
        background: "oklch(0.225 0.006 25)",
        boxShadow: "inset 0 0 0 1.5px oklch(1 0 0 / 22%)",
      }}
      aria-hidden="true"
    >
      <Aperture size={Math.round(size * 0.78)} weight="duotone" color="var(--color-accent-bright)" />
    </span>
  );
}

export function BrandLockup({
  shortName,
  logo,
  markSize = 34,
  textClassName = "text-[19px]",
}: {
  shortName: string;
  logo?: string;
  markSize?: number;
  textClassName?: string;
}) {
  return (
    <span className="flex items-center gap-2.5">
      <BrandMark size={markSize} logo={logo} />
      {!logo && (
        <span className={`h-poster leading-none ${textClassName}`}>{shortName}</span>
      )}
    </span>
  );
}
