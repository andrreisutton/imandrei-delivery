"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function ScrollReveal() {
  const pathname = usePathname();

  useEffect(() => {
    const nodes = Array.from(
      document.querySelectorAll<HTMLElement>("[data-reveal], [data-sleeve]")
    );
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
          if (!e.isIntersecting) {
            // A fast flick can carry an element clear past the viewport without
            // ever reporting it as intersecting. Left alone it would sit at its
            // first frame for good, so anything already above the fold counts
            // as seen.
            if (e.boundingClientRect.bottom < 0) {
              e.target.setAttribute("data-seen", "");
              io.unobserve(e.target);
            }
            continue;
          }
          e.target.setAttribute("data-seen", "");
          io.unobserve(e.target);
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" },
    );

    nodes.forEach((n) => {
      if (n.getBoundingClientRect().top < window.innerHeight) {
        n.setAttribute("data-seen", "");
        return;
      }
      io.observe(n);
    });

    // Belt and suspenders: a section whose own layout keeps shifting (an
    // embed resizing, a late image) can dodge every intersection check the
    // observer ever runs and just sit at opacity 0 forever. Nothing on this
    // page should stay invisible for more than a few seconds, so force
    // everything visible once this fires regardless of what the observer saw.
    const fallback = setTimeout(showAll, 4000);

    return () => {
      io.disconnect();
      clearTimeout(fallback);
    };
  }, [pathname]);

  return null;
}
