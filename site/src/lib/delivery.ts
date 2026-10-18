import type { Product } from "@/content/site";
import { placeholderZips } from "./downloads-data";

export function isDeliverable(product: Product, deliveryUrls: Record<string, string>): boolean {
  if (product.type === "service") return true;
  return !!deliveryUrls[product.slug] || !!placeholderZips[product.slug];
}

export function isBuyable(product: Product, deliveryUrls: Record<string, string>): boolean {
  return !product.soldOut && product.price > 0 && isDeliverable(product, deliveryUrls);
}
