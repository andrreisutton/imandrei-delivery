import type { Product } from "@/content/site";
import { ApertureDisc } from "./aperture-disc";
import {
  BinTree,
  ChannelStrip,
  ColorWheels,
  DevelopPanel,
  KineticTitles,
  KitStack,
  Loudness,
  MixFaders,
  MixMaster,
} from "./cover-visuals";

function RecognitionVisual({ product }: { product: Product }) {
  const hue = product.coverHue;
  const id = product.slug;
  switch (product.slug) {
    case "everyday-powergrade":
      return <ColorWheels hue={hue} idKey={id} />;
    case "go-to-lightroom-presets":
      return <DevelopPanel hue={hue} idKey={id} />;
    case "premiere-project-template":
      return <BinTree hue={hue} idKey={id} />;
    case "social-animation-template":
      return <KineticTitles hue={hue} idKey={id} />;
    case "vocal-presets-starter":
      return <ChannelStrip hue={hue} idKey={id} modules={1} />;
    case "vocal-presets-pro":
      return <ChannelStrip hue={hue} idKey={id} modules={3} />;
    case "artist-promo-kit":
      return <KitStack hue={hue} idKey={id} />;
    case "custom-mix":
      return <MixFaders hue={hue} idKey={id} />;
    case "custom-mix-master":
      return <MixMaster hue={hue} idKey={id} />;
    case "master-only":
      return <Loudness hue={hue} idKey={id} />;
  }
  return <ChannelStrip hue={hue} idKey={id} modules={2} />;
}

export function ProductCover({ product, priority = false }: { product: Product; priority?: boolean }) {
  return (
    <div className="relative aspect-[4/5] overflow-hidden rounded-t-[12px]">
      <GeneratedCover product={product} priority={priority} />
    </div>
  );
}

function GeneratedCover({ product, priority }: { product: Product; priority?: boolean }) {
  const hue = product.coverHue;
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
      <div className="absolute inset-y-0 left-0 z-[2] flex w-6 flex-col items-center justify-evenly border-r border-line bg-[oklch(0.11_0.006_60_/_0.85)]">
        {Array.from({ length: 8 }, (_, i) => (
          <span
            key={i}
            className="block h-3 w-2 rounded-[2px] bg-[oklch(0.06_0.004_60)] shadow-[inset_0_1px_0_oklch(0_0_0/60%),0_1px_0_oklch(1_0_0/6%)]"
          />
        ))}
      </div>

      {product.image ? (
        <>
          <ApertureDisc
            hue={hue}
            labelImage={product.image}
            idKey={product.slug}
            className="absolute left-[58%] top-[39%] w-[60%] -translate-x-1/2 -translate-y-1/2 drop-shadow-[0_18px_30px_oklch(0_0_0_/_50%)]"
          />
          {priority && <link rel="preload" as="image" href={product.image} />}
        </>
      ) : (
        <div className="absolute left-[56%] top-[35%] w-[74%] -translate-x-1/2 -translate-y-1/2 drop-shadow-[0_16px_28px_oklch(0_0_0_/_45%)]">
          <RecognitionVisual product={product} />
        </div>
      )}
      <div className="absolute inset-0 z-[2] flex flex-col justify-between p-5 pl-10">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/brand/andrei-logo-white.png"
          alt=""
          aria-hidden="true"
          className="h-[22px] w-auto max-w-[54%] object-contain object-left opacity-95"
          draggable={false}
        />
        <div>
          <h3 className="h-poster text-[30px] leading-[0.98] text-ink">
            {product.title}
          </h3>
          <p className="mt-1.5 text-[13px] font-medium" style={{ color: `oklch(0.8 0.09 ${hue})` }}>
            {product.subtitle}
          </p>
          <div className="mt-4 flex gap-1.5">
            <span className="h-1.5 flex-[1.2] rounded-[2px]" style={{ background: `oklch(0.30 0.09 ${hue})` }} />
            <span className="h-1.5 flex-[2] rounded-[2px]" style={{ background: `oklch(0.55 0.13 ${hue})` }} />
            <span className="h-1.5 flex-1 rounded-[2px]" style={{ background: `oklch(0.82 0.10 ${hue})` }} />
          </div>
        </div>
      </div>
    </div>
  );
}
