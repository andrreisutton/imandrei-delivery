"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function ScrollReveal() {
  const pathname = usePathname();

  useEffect(() => {
    const nodes = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    if (!nodes.length) return;

    const showAll = () => nodes.forEach((n) => n.setAttribute("data-seen", ""));

    if (
      typeof IntersectionObserver === "undefined" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      showAll();
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          e.target.setAttribute("data-seen", "");
          io.unobserve(e.target);
        }
      },
      { threshold: 0.05, rootMargin: "0px 0px -8% 0px" },
    );

    nodes.forEach((n) => {
      if (n.getBoundingClientRect().top < window.innerHeight) {
        n.setAttribute("data-seen", "");
        return;
      }
      io.observe(n);
    });

    return () => io.disconnect();
  }, [pathname]);

  return null;
}
