import type { Product } from "@/content/site";
import type { ProductFile } from "./product-files";
import { onSiteCheckoutReady } from "./stripe";

export function isDeliverable(product: Product, files: Record<string, ProductFile>): boolean {
  if (product.type === "service") return true;
  return !!files[product.slug];
}

export function isBuyable(product: Product, files: Record<string, ProductFile>): boolean {
  return !product.soldOut && product.price > 0 && isDeliverable(product, files);
}

export type ProductSale = { kind: "site" } | { kind: "gumroad"; url: string } | { kind: "none" };

// A download sells on the site only when its file is uploaded in /admin and the
// checkout takes real money. Until then, anything that is also on Gumroad sells
// there, so a buyer is never charged and then handed a page asking them to pay again.
export function productSale(
  product: Product,
  files: Record<string, ProductFile>,
  deliveryUrls: Record<string, string>
): ProductSale {
  if (product.soldOut || !(product.price > 0)) return { kind: "none" };
  if (isBuyable(product, files) && (product.type === "service" || onSiteCheckoutReady())) {
    return { kind: "site" };
  }
  const url = deliveryUrls[product.slug];
  if (product.type !== "service" && url && /gumroad\.com/.test(url)) return { kind: "gumroad", url };
  return { kind: "none" };
}
