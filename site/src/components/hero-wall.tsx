import Image from "next/image";

const COLS = 4;

// Portrait source photos get cropped hard by the aspect-video tiles below;
// these bias the crop toward the rider instead of the default center.
const OBJECT_POSITIONS: Record<string, string> = {
  "moto-sunset-portrait": "center 25%",
  "moto-front-sunset": "center 43%",
  "moto-rear-closeup": "center 30%",
  "moto-over-shoulder": "center 18%",
  "moto-helmet-closeup": "center 16%",
  "moto-trees": "center 28%",
  "moto-behind-trees": "center 30%",
  "moto-helmet-mount": "center 25%",
  "moto-street": "center 43%",
};

const WALL: string[] = [
  "lilskies-recap",
  "laroi-show",
  "singer-portrait-color",
  "singer-portrait-bw",
  "ian-tour-recap",
  "babytron-recap",
  "singer-portrait-blue",
  "singer-portrait-green",
  "laroi-chicago",
  "moto-helmet-mount",
  "fl-preset",
  "moto-sunset-portrait",
  "moto-trees",
  "ian-tulsa",
  "moto-lying-back",
  "laroi-hours",
  "colorado-video",
  "gone-video",
  "laroi-song",
  "laroi-fl",
  "singer-portrait-color",
  "moto-helmet-closeup",
  "song-live",
  "song-for-album",
  "missouri",
  "moto-behind-trees",
  "johnnyphilp",
  "dream-car",
  "moto-front-sunset",
  "moto-street",
  "moto-rear-closeup",
  "spec-ad",
];

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
