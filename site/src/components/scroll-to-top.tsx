"use client";

import { useLayoutEffect } from "react";
import { usePathname } from "next/navigation";

const ENFORCE_MS = 600;

export function ScrollToTop() {
  const pathname = usePathname();

  useLayoutEffect(() => {
    let raf = 0;
    let cancelled = false;
    const started = performance.now();

    const release = () => {
      cancelled = true;
    };
    window.addEventListener("wheel", release, { passive: true, once: true });
    window.addEventListener("touchmove", release, { passive: true, once: true });
    window.addEventListener("keydown", release, { once: true });

    const pin = () => {
      if (cancelled) return;
      if (window.scrollY !== 0) window.scrollTo(0, 0);
      if (performance.now() - started < ENFORCE_MS) raf = requestAnimationFrame(pin);
    };

    window.scrollTo(0, 0);
    raf = requestAnimationFrame(pin);

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      window.removeEventListener("wheel", release);
      window.removeEventListener("touchmove", release);
      window.removeEventListener("keydown", release);
    };
  }, [pathname]);

  return null;
}
