import type { Product } from "@/content/site";
import { VinylDisc } from "./vinyl-disc";
import { Price } from "./price";

export function ProductCover({ product }: { product: Product }) {
  return (
    <div data-sleeve className="sleeve-stage relative aspect-square overflow-hidden">
      {product.coverImage ? (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={product.coverImage}
            alt=""
            className="absolute inset-0 size-full object-cover"
            draggable={false}
            loading="lazy"
            decoding="async"
          />
          <h3 className="sr-only">{product.title}</h3>
          <div className="absolute bottom-3 left-3 z-[2] rounded-[6px] bg-bg/80 px-2.5 py-1 backdrop-blur-sm">
            {product.priceLabel === "quote" ? (
              <span className="text-sm font-semibold text-ink">Quote</span>
            ) : (
              <Price price={product.price} compareAtPrice={product.compareAtPrice} />
            )}
          </div>
        </>
      ) : (
        <GeneratedCover product={product} />
      )}
    </div>
  );
}

function GeneratedCover({ product }: { product: Product }) {
  const daws = product.daw ? [product.daw] : [];
  return (
    <div className="grain-panel absolute inset-0" aria-hidden="true">
      <VinylDisc daws={daws} idKey={product.slug} className="absolute inset-0 size-full" />
      <div className="absolute inset-0 z-[2] flex flex-col justify-between p-4">
        <h3 className="font-sans max-w-[46%] text-[19px] font-bold leading-[1.1] tracking-tight text-ink">
          {product.title}
        </h3>
        <p className="max-w-[46%] text-[12px] italic leading-snug text-muted">
          {product.subtitle}
        </p>
        <div className="flex max-w-[46%] flex-col items-start gap-1.5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/brand/andrei-logo-white.png"
            alt=""
            className="h-[15px] w-auto object-contain object-left opacity-95"
            draggable={false}
          />
          {product.priceLabel === "quote" ? (
            <span className="text-lg font-semibold text-ink">Quote</span>
          ) : (
            <Price price={product.price} compareAtPrice={product.compareAtPrice} />
          )}
        </div>
      </div>
    </div>
  );
}
