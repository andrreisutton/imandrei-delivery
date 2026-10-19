import type { Product } from "@/content/site";
import { VinylDisc } from "./vinyl-disc";

export function ProductCover({ product }: { product: Product }) {
  return (
    <div className="relative aspect-[4/5] overflow-hidden rounded-t-[12px]">
      <GeneratedCover product={product} />
    </div>
  );
}

function GeneratedCover({ product }: { product: Product }) {
  const daws = product.daw ? [product.daw] : [];
  return (
    <div className="grain-panel absolute inset-0" aria-hidden="true">
      <VinylDisc daws={daws} idKey={product.slug} className="absolute inset-0 size-full" />
      <div className="absolute inset-0 z-[2] flex flex-col justify-between p-5">
        <h3 className="h-poster max-w-[58%] text-[25px] leading-[0.98] text-ink">
          {product.title}
        </h3>
        <p className="max-w-[58%] text-[13px] italic leading-snug text-muted">
          {product.subtitle}
        </p>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/brand/andrei-logo-white.png"
          alt=""
          className="h-[16px] w-auto max-w-[50%] object-contain object-left opacity-95"
          draggable={false}
        />
      </div>
    </div>
  );
}
