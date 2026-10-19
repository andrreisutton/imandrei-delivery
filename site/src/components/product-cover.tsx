import type { Product } from "@/content/site";
import { VinylDisc } from "./vinyl-disc";
import { Price } from "./price";

export function ProductCover({ product }: { product: Product }) {
  return (
    <div className="relative aspect-square overflow-hidden">
      <GeneratedCover product={product} />
    </div>
  );
}

function GeneratedCover({ product }: { product: Product }) {
  const daws = product.daw ? [product.daw] : [];
  return (
    <div className="grain-panel absolute inset-0" aria-hidden="true">
      <VinylDisc daws={daws} idKey={product.slug} className="absolute inset-0 size-full" />
      <div className="absolute inset-0 z-[2] flex flex-col justify-between p-4">
        <h3 className="font-sans max-w-[58%] text-[21px] font-bold leading-[1.08] tracking-tight text-ink">
          {product.title}
        </h3>
        <p className="max-w-[58%] text-[12px] italic leading-snug text-muted">
          {product.subtitle}
        </p>
        <div className="flex max-w-[58%] items-end justify-between gap-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/brand/andrei-logo-white.png"
            alt=""
            className="h-[15px] w-auto object-contain object-left opacity-95"
            draggable={false}
          />
          <Price price={product.price} compareAtPrice={product.compareAtPrice} />
        </div>
      </div>
    </div>
  );
}
