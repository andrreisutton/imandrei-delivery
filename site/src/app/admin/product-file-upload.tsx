"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { upload } from "@vercel/blob/client";
import { UploadSimple } from "@phosphor-icons/react";
import { adminKeepProductFile } from "./actions";

export function ProductFileUpload({ slug, hasFile }: { slug: string; hasFile: boolean }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const [progress, setProgress] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function send(file: File) {
    setError(null);
    setProgress(0);
    try {
      const safeName = file.name.replace(/[^\w.\- ]+/g, "_");
      const blob = await upload(`downloads/${slug}/${safeName}`, file, {
        access: "private",
        handleUploadUrl: "/api/admin/product-upload",
        multipart: file.size > 8 * 1024 * 1024,
        onUploadProgress: ({ percentage }) => setProgress(percentage),
      });
      await adminKeepProductFile(slug, blob.pathname);
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setProgress(null);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="flex flex-col items-start gap-1.5">
      <input
        ref={inputRef}
        type="file"
        className="sr-only"
        id={`file-${slug}`}
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) send(f);
        }}
        disabled={progress !== null}
      />
      <label
        htmlFor={`file-${slug}`}
        className={`btn ${hasFile ? "btn-ghost" : "btn-primary"} !px-4 !py-2 text-sm`}
        aria-disabled={progress !== null}
      >
        <UploadSimple size={15} weight="bold" />
        <span className="grid">
          <span className={`[grid-area:1/1] ${progress === null ? "" : "invisible"}`}>
            {hasFile ? "Replace file" : "Upload file"}
          </span>
          <span className={`[grid-area:1/1] tabular-nums ${progress === null ? "invisible" : ""}`}>
            Uploading {Math.round(progress ?? 0)}%
          </span>
        </span>
      </label>
      {error && (
        <p role="alert" className="text-xs font-medium text-accent-bright">
          {error}
        </p>
      )}
    </div>
  );
}
