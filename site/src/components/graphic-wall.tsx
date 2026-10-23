import Image from "next/image";
import type { GraphicPiece } from "@/content/site";
import { GradeCompare } from "./grade-compare";

function GraphicTile({ piece }: { piece: GraphicPiece }) {
  const aspect = piece.aspect === "square" ? "aspect-square" : "aspect-[4/5]";

  if (piece.before) {
    return (
      <div>
        <GradeCompare
          hue={25}
          idKey={`design-${piece.id}`}
          set={{
            kind: "image",
            before: piece.before,
            after: piece.after,
            beforeLabel: piece.beforeLabel ?? "Rough",
            afterLabel: piece.afterLabel ?? "Final",
            aspect: piece.aspect === "square" ? "video" : "portrait",
            caption: "",
          }}
        />
        <p className="mt-2.5 px-1 text-sm">
          <span className="credential font-bold">{piece.title}</span>{" "}
          <span className="text-faint">· {piece.note}</span>
        </p>
      </div>
    );
  }

  const cover = (
    <div className={`relative overflow-hidden rounded-[12px] border border-line bg-surface ${aspect}`}>
      <Image
        src={piece.after}
        alt={piece.title}
        fill
        sizes="(min-width: 768px) 33vw, 50vw"
        className="object-cover"
      />
    </div>
  );

  return (
    <div>
      {piece.href ? (
        <a href={piece.href} target="_blank" rel="noopener" className="block">
          {cover}
        </a>
      ) : (
        cover
      )}
      <p className="mt-2.5 px-1 text-sm">
        <span className="credential font-bold">{piece.title}</span>{" "}
        <span className="text-faint">· {piece.note}</span>
      </p>
    </div>
  );
}

export function GraphicWall({ pieces, className = "" }: { pieces: GraphicPiece[]; className?: string }) {
  if (!pieces.length) return null;
  return (
    <div className={`grid grid-cols-2 gap-5 sm:grid-cols-3 ${className}`}>
      {pieces.map((piece) => (
        <GraphicTile key={piece.id} piece={piece} />
      ))}
    </div>
  );
}
