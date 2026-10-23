import type { Product } from "@/content/site";

// "Mix & match": pick any BUNDLE_MIN_ITEMS or more eligible presets/templates
// and every item in the bundle drops by BUNDLE_DISCOUNT.
export const BUNDLE_MIN_ITEMS = 3;
export const BUNDLE_DISCOUNT = 0.2;

export function isBundleEligible(product: Pick<Product, "type" | "bundleEligible">): boolean {
  return product.type !== "service" && product.bundleEligible !== false;
}

export function bundleItemAmount(price: number): number {
  return Math.round(price * (1 - BUNDLE_DISCOUNT) * 100) / 100;
}

export function bundlePricing(prices: number[]): {
  subtotal: number;
  total: number;
  savings: number;
  unlocked: boolean;
} {
  const subtotal = Math.round(prices.reduce((s, p) => s + p, 0) * 100) / 100;
  const unlocked = prices.length >= BUNDLE_MIN_ITEMS;
  const total = unlocked
    ? Math.round(prices.reduce((s, p) => s + bundleItemAmount(p), 0) * 100) / 100
    : subtotal;
  return { subtotal, total, savings: Math.round((subtotal - total) * 100) / 100, unlocked };
}
