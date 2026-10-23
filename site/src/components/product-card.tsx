"use client";

import { useRef, useState } from "react";
import { Link } from "next-view-transitions";
import { motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import { Check, Pause, Plus, Play } from "@phosphor-icons/react";
import type { Product } from "@/content/site";
import { ProductCover } from "./product-cover";
import { SaveBadge } from "./price";

const MotionLink = motion.create(Link);

let activePreview: HTMLAudioElement | null = null;

function AudioPreviewButton({ src, title }: { src: string; title: string }) {
  const ref = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);

  const toggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const el = ref.current;
    if (!el) return;
    if (playing) {
      el.pause();
      return;
    }
    if (activePreview && activePreview !== el) activePreview.pause();
    activePreview = el;
    el.currentTime = 0;
    el.play().catch(() => {});
  };

  return (
    <>
      <audio
        ref={ref}
        src={src}
        preload="none"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => setPlaying(false)}
      />
      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? `Pause preview of ${title}` : `Hear ${title}`}
        className="absolute bottom-3 right-3 z-10 flex size-9 items-center justify-center rounded-full border border-line-strong bg-bg/90 text-ink backdrop-blur-sm transition-transform duration-150 active:scale-95 hover:border-accent-bright"
      >
        {playing ? (
          <Pause size={13} weight="fill" aria-hidden="true" />
        ) : (
          <Play size={13} weight="fill" aria-hidden="true" />
        )}
      </button>
    </>
  );
}

function BundleToggle({ selected, onToggle }: { selected: boolean; onToggle: () => void }) {
  const onClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onToggle();
  };
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`flex items-center gap-1.5 rounded-[6px] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] backdrop-blur-sm transition-colors duration-150 ${
        selected ? "bg-accent text-accent-ink" : "bg-bg/90 text-ink hover:text-accent-bright"
      }`}
    >
      {selected ? (
        <Check size={11} weight="bold" aria-hidden="true" />
      ) : (
        <Plus size={11} weight="bold" aria-hidden="true" />
      )}
      {selected ? "In bundle" : "Add to bundle"}
    </button>
  );
}

export function ProductCard({
  product,
  bundle,
}: {
  product: Product;
  bundle?: { selected: boolean; onToggle: () => void };
}) {
  const href =
    product.type === "service"
      ? product.category === "photoVideo"
        ? "/photo-video"
        : "/mixing-mastering"
      : `/store/${product.slug}`;
  const reduce = useReducedMotion();

  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const rotateX = useSpring(rx, { stiffness: 260, damping: 22 });
  const rotateY = useSpring(ry, { stiffness: 260, damping: 22 });

  const onPointerMove = (e: React.PointerEvent<HTMLAnchorElement>) => {
    if (reduce || e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    ry.set(((e.clientX - r.left) / r.width - 0.5) * 7);
    rx.set(-((e.clientY - r.top) / r.height - 0.5) * 7);
  };
  const resetTilt = () => {
    rx.set(0);
    ry.set(0);
  };

  return (
    <MotionLink
      href={href}
      onPointerMove={onPointerMove}
      onPointerLeave={resetTilt}
      onBlur={resetTilt}
      style={reduce ? undefined : { rotateX, rotateY, transformPerspective: 900 }}
      className="card card-flush card-interactive group relative block"
    >
      <div className="absolute right-3 top-3 z-10 flex flex-col items-end gap-1.5">
        {bundle && <BundleToggle selected={bundle.selected} onToggle={bundle.onToggle} />}
        <SaveBadge price={product.price} compareAtPrice={product.compareAtPrice} />
        {product.soldOut && (
          <span className="rounded-[6px] bg-bg/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-muted backdrop-blur-sm">
            Coming back
          </span>
        )}
        {product.badge && (
          <span className="badge-on-card rounded-[6px] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] backdrop-blur-sm">
            {product.badge}
          </span>
        )}
      </div>
      <ProductCover product={product} />
      {product.audioAfter && <AudioPreviewButton src={product.audioAfter} title={product.title} />}
    </MotionLink>
  );
}
