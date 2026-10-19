import Image from "next/image";

const COLS = 4;

// Portrait source photos get cropped hard by the aspect-video tiles below;
// these bias the crop toward the subject's face instead of the default center.
const OBJECT_POSITIONS: Record<string, string> = {
  "flics-01": "center 42%",
  "flics-02": "center 21%",
  "flics-03": "center 21%",
  "flics-04": "35% 45%",
  "flics-05": "center 31%",
  "flics-06": "center 50%",
  "flics-07": "center 47%",
  "flics-08": "center 31%",
  "flics-09": "center 39%",
  "flics-10": "center 47%",
  "flics-11": "center 31%",
  "flics-12": "center 28%",
  "flics-13": "center 42%",
  "flics-14": "center 26%",
  "flics-15": "center 31%",
};

const POOL = [
  "flics-01",
  "flics-02",
  "flics-03",
  "flics-04",
  "flics-05",
  "flics-06",
  "flics-07",
  "flics-08",
  "flics-09",
  "flics-10",
  "flics-11",
  "flics-12",
  "flics-13",
  "flics-14",
  "flics-15",
];

// Cycled to 32 slots. With COLS = 4 and 15 names, a name only repeats in the
// same scroll column once every lcm(4, 15) = 60 slots, so this never puts the
// same photo twice in one column.
const WALL: string[] = Array.from({ length: 32 }, (_, i) => POOL[i % POOL.length]);

function columns(): string[][] {
  const MIN_PER_COLUMN = 8;
  if (WALL.length < COLS * MIN_PER_COLUMN) {
    throw new Error(
      `The hero wall needs at least ${COLS * MIN_PER_COLUMN} frames to fill ${COLS} columns; ` +
        `hero-wall.tsx lists ${WALL.length}. Add frames or drop a column.`,
    );
  }
  const cols: string[][] = Array.from({ length: COLS }, () => []);
  WALL.forEach((name, i) => cols[i % COLS].push(name));
  return cols;
}

export function HeroWall({ scrims = true }: { scrims?: boolean } = {}) {
  const cols = columns();

  return (
    <div className="absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
      <div className="grid h-full grid-cols-2 gap-1.5 sm:grid-cols-3 lg:grid-cols-4">
        {cols.map((col, i) => (
          <div
            key={i}
            className={`wall-col ${i % 2 === 0 ? "wall-up" : "wall-down"} ${
              i === 2 ? "hidden sm:flex" : i === 3 ? "hidden lg:flex" : "flex"
            }`}
            style={{ "--wall-dur": `${74 + i * 9}s` } as React.CSSProperties}
          >
            {[0, 1].map((pass) =>
              col.map((name, idx) => (
                <div key={`${pass}-${name}`} className="relative aspect-video w-full shrink-0">
                  <Image
                    src={`/wall/${name}.jpg`}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 25vw, (min-width: 640px) 34vw, 50vw"
                    className="object-cover"
                    style={{ objectPosition: OBJECT_POSITIONS[name] ?? "center" }}
                    priority={pass === 0 && (i < 2 ? idx < 2 : idx < 1)}
                  />
                </div>
              )),
            )}
          </div>
        ))}
      </div>

      {scrims && (
        <>
          <div className="wall-wash" />
          <div className="wall-ramp" />
          <div className="wall-pool" />
          <div className="wall-burn" />
        </>
      )}
    </div>
  );
}
