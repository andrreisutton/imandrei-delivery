"use client";

import { motion, useReducedMotion } from "motion/react";
import { MusicNote, MusicNotes, FilmSlate, Aperture } from "@phosphor-icons/react";

function seeded(seed: string) {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return () => {
    h = Math.imul(h ^ (h >>> 15), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return ((h ^= h >>> 16) >>> 0) / 4294967296;
  };
}

const GLYPHS = [MusicNote, FilmSlate, MusicNotes, Aperture];

const COLORS = [
  "oklch(0.66 0.215 27)",
  "oklch(0.50 0.19 22)",
  "oklch(0.92 0.02 60)",
  "oklch(0.66 0.215 27)",
];

export function HeroNotes({ count = 11 }: { count?: number }) {
  const reduce = useReducedMotion();
  const rand = seeded("andrei-hero-notes");
  const notes = Array.from({ length: count }, (_, i) => {
    const depth = rand();
    return {
      Glyph: GLYPHS[i % GLYPHS.length],
      color: COLORS[Math.floor(rand() * COLORS.length)],
      left: 4 + rand() * 92,
      top: 10 + rand() * 64,
      size: Math.round(12 + depth * 30),
      peak: 0.11 + depth * 0.20,
      restBlur: (1 - depth) * 2.6 + 0.3,
      rise: 40 + depth * 75,
      duration: rand() > 0.74 ? 2.6 + rand() * 1.8 : 13 - depth * 5,
      delay: rand() * 2.2,
      repeatDelay: 1.5 + rand() * 3,
      drift: (rand() - 0.5) * (40 + depth * 50),
    };
  });

  if (reduce) return null;

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {notes.map((n, i) => (
        <motion.span
          key={i}
          className="absolute"
          style={{ left: `${n.left}%`, top: `${n.top}%`, color: n.color }}
          initial={{ opacity: 0, y: 26, filter: "blur(7px)", rotate: -8 }}
          animate={{
            opacity: [0, n.peak, n.peak, 0],
            y: [26, -n.rise],
            x: [0, n.drift],
            rotate: [-8, 10],
            filter: [
              "blur(7px)",
              `blur(${n.restBlur}px)`,
              `blur(${n.restBlur}px)`,
              "blur(8px)",
            ],
          }}
          transition={{
            duration: n.duration,
            delay: n.delay,
            repeat: Infinity,
            repeatDelay: n.repeatDelay,
            ease: "easeInOut",
            times: [0, 0.25, 0.75, 1],
          }}
        >
          <n.Glyph size={n.size} weight="fill" />
        </motion.span>
      ))}
    </div>
  );
}
