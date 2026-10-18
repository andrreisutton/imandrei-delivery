"use client";

import { useState } from "react";
import { motion } from "motion/react";
import type { Product } from "@/content/site";
import { ProductCard } from "@/components/product-card";
import { Select } from "@/components/select";

const TYPE_FILTERS = [
  { id: "all", label: "All" },
  { id: "preset", label: "Presets & grades" },
  { id: "template", label: "Templates" },
] as const;

export function PresetGrid({ items }: { items: Product[] }) {
  const daws = Array.from(new Set(items.map((p) => p.daw).filter(Boolean))) as string[];
  const [type, setType] = useState<string>("all");
  const [daw, setDaw] = useState<string>("all");

  const filtered = items.filter(
    (p) => (type === "all" || p.type === type) && (daw === "all" || p.daw === daw)
  );

  return (
    <>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div
          className="inline-flex w-fit items-center gap-0.5 rounded-[8px] border border-line bg-bg p-1 shadow-[inset_0_1px_3px_oklch(0_0_0_/_45%)]"
          role="group"
          aria-label="Filter by product type"
        >
          {TYPE_FILTERS.map((f) => {
            const active = type === f.id;
            return (
              <button
                key={f.id}
                type="button"
                onClick={() => setType(f.id)}
                aria-pressed={active}
                className={`relative rounded-[6px] px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                  active ? "text-ink" : "text-muted hover:text-ink"
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="type-filter-active"
                    transition={{ type: "spring", bounce: 0.18, duration: 0.5 }}
                    className="absolute inset-0 rounded-[6px] bg-raised shadow-[inset_0_1px_0_oklch(1_0_0_/_10%),0_1px_3px_oklch(0_0_0_/_50%)]"
                    aria-hidden="true"
                  />
                )}
                <span className="relative z-10">{f.label}</span>
              </button>
            );
          })}
        </div>
        {daws.length > 1 && (
          <div className="field sm:w-56">
            <Select
              ariaLabel="Filter by app"
              value={daw}
              onValueChange={setDaw}
              items={[
                { value: "all", label: "All apps" },
                ...daws.map((d) => ({ value: d, label: d })),
              ]}
            />
          </div>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="card card-pad mt-16 text-center">
          <p className="text-lg font-semibold">Nothing matches that combination yet.</p>
          <p className="mt-2 text-muted">
            Try a different app, or clear the filters to see everything.
          </p>
          <button
            type="button"
            className="btn btn-ghost mt-6"
            onClick={() => {
              setType("all");
              setDaw("all");
            }}
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {filtered.map((p, i) => (
            <ProductCard key={p.slug} product={p} priority={i < 4} />
          ))}
        </div>
      )}
    </>
  );
}
