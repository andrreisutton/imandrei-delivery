"use client";

import { Link } from "next-view-transitions";
import { AnimatePresence, motion } from "motion/react";
import { X } from "@phosphor-icons/react";
import type { Product } from "@/content/site";
import { BUNDLE_MIN_ITEMS, bundlePricing } from "@/lib/bundle";

export function BundleTray({
  items,
  onRemove,
  onClear,
}: {
  items: Product[];
  onRemove: (slug: string) => void;
  onClear: () => void;
}) {
  const pricing = bundlePricing(items.map((p) => p.price));
  const remaining = Math.max(0, BUNDLE_MIN_ITEMS - items.length);

  return (
    <AnimatePresence>
      {items.length > 0 && (
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 40, opacity: 0 }}
          transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
          className="fixed inset-x-4 bottom-4 z-40 sm:inset-x-auto sm:right-6"
        >
          <div className="card card-pad-tight w-full border-line-strong bg-raised/95 shadow-[0_20px_50px_-12px_oklch(0_0_0_/_60%)] backdrop-blur-md sm:w-[380px]">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-bold text-ink">
                  Bundle: {items.length} {items.length === 1 ? "item" : "items"}
                </p>
                <p className="mt-0.5 text-xs text-muted">
                  {remaining > 0
                    ? `Add ${remaining} more to unlock 20% off`
                    : `20% off unlocked — save $${pricing.savings.toFixed(2)}`}
                </p>
              </div>
              <button
                type="button"
                onClick={onClear}
                aria-label="Clear bundle"
                className="shrink-0 text-faint transition-colors hover:text-ink"
              >
                <X size={16} weight="bold" />
              </button>
            </div>

            <ul className="mt-3 flex flex-col gap-1.5">
              {items.map((p) => (
                <li
                  key={p.slug}
                  className="flex items-center justify-between gap-2 rounded-[6px] bg-bg/60 px-2.5 py-1.5 text-xs"
                >
                  <span className="truncate text-muted">{p.title}</span>
                  <button
                    type="button"
                    onClick={() => onRemove(p.slug)}
                    aria-label={`Remove ${p.title} from bundle`}
                    className="shrink-0 text-faint transition-colors hover:text-accent-bright"
                  >
                    <X size={12} weight="bold" />
                  </button>
                </li>
              ))}
            </ul>

            <div className="mt-4 flex items-center justify-between gap-3 border-t border-line pt-3">
              <span className="inline-flex items-baseline gap-2">
                {pricing.unlocked && (
                  <s className="text-sm text-faint">${pricing.subtotal.toFixed(0)}</s>
                )}
                <span className="text-xl font-semibold text-ink">
                  ${pricing.total.toFixed(2).replace(/\.00$/, "")}
                </span>
              </span>
              {pricing.unlocked ? (
                <Link
                  href={`/store/bundle?items=${items.map((p) => p.slug).join(",")}`}
                  className="btn btn-primary"
                >
                  Review bundle
                </Link>
              ) : (
                <span
                  className="btn btn-ghost pointer-events-none opacity-60"
                  aria-disabled="true"
                >
                  Review bundle
                </span>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
