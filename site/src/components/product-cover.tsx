import type { Daw, Product } from "@/content/site";
import { VinylDisc } from "./vinyl-disc";

const DAW_LOGO: Record<Daw, { src: string; bg: string }> = {
  "DaVinci Resolve": { src: "/logos/davinci-resolve.svg", bg: "oklch(0.99 0 0)" },
  "Premiere Pro": { src: "/logos/premiere-pro.svg", bg: "oklch(0.99 0 0)" },
  "Lightroom": { src: "/logos/lightroom.svg", bg: "oklch(0.99 0 0)" },
  "FL Studio": { src: "/logos/fl-studio.png", bg: "oklch(0.1 0 0)" },
};

export function ProductCover({ product, priority = false }: { product: Product; priority?: boolean }) {
  return (
    <div className="relative aspect-[4/5] overflow-hidden rounded-t-[12px]">
      <GeneratedCover product={product} priority={priority} />
    </div>
  );
}

function GeneratedCover({ product, priority }: { product: Product; priority?: boolean }) {
  const hue = product.coverHue;
  const logo = product.daw ? DAW_LOGO[product.daw] : undefined;
  return (
    <div
      className="grain-panel absolute inset-0"
      style={{
        background: `
          radial-gradient(130% 100% at 85% -12%, oklch(0.42 0.12 ${hue} / 0.5), transparent 58%),
          radial-gradient(110% 85% at 0% 115%, oklch(0.30 0.09 ${hue} / 0.45), transparent 55%),
          oklch(0.17 0.01 ${hue})
        `,
      }}
      aria-hidden="true"
    >
      <VinylDisc hue={hue} labelImage={product.image} idKey={product.slug} className="absolute inset-0 size-full" />
      {product.image && priority && <link rel="preload" as="image" href={product.image} />}
      <div className="absolute inset-0 z-[2] flex flex-col justify-between p-5">
        <div className="max-w-[58%]">
          <h3 className="h-poster text-[32px] leading-[0.92] text-ink">
            {product.title}
          </h3>
          <p className="mt-2.5 text-[13px] font-medium" style={{ color: `oklch(0.8 0.09 ${hue})` }}>
            {product.subtitle}
          </p>
        </div>
        <div className="flex max-w-[58%] items-center gap-2.5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/brand/andrei-logo-white.png"
            alt=""
            aria-hidden="true"
            className="h-[18px] w-auto object-contain opacity-95"
            draggable={false}
          />
          {logo && (
            <>
              <span className="h-4 w-px shrink-0 bg-white/15" aria-hidden="true" />
              <span
                className="flex size-6 shrink-0 items-center justify-center rounded-[6px] p-1 ring-1 ring-white/10"
                style={{ background: logo.bg }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={logo.src} alt={product.daw} className="size-full object-contain" draggable={false} />
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
