"use client";

import { useId, useRef, useState } from "react";
import { upload } from "@vercel/blob/client";
import { CheckCircle, FileAudio, UploadSimple, WarningCircle, X } from "@phosphor-icons/react";

type FileState = {
  key: string;
  name: string;
  size: number;
  progress: number;
  status: "uploading" | "done" | "error";
  url?: string;
  error?: string;
};

function formatBytes(bytes: number): string {
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function StemsUpload({
  name,
  label = "Files (optional)",
  hint = "Stems, a mix bounce, reference tracks — zip a folder first if it's a lot.",
  onBusyChange,
}: {
  name: string;
  label?: string;
  hint?: string;
  onBusyChange?: (busy: boolean) => void;
}) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<FileState[]>([]);
  const [dragOver, setDragOver] = useState(false);

  const urls = files.filter((f) => f.status === "done" && f.url).map((f) => f.url!);

  function setBusy(delta: number) {
    onBusyChange?.(delta > 0);
  }

  async function addFiles(list: FileList | null) {
    if (!list || list.length === 0) return;
    const incoming = Array.from(list);
    setBusy(1);
    await Promise.all(
      incoming.map(async (file) => {
        const key = `${file.name}-${file.size}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
        setFiles((prev) => [
          ...prev,
          { key, name: file.name, size: file.size, progress: 0, status: "uploading" },
        ]);
        try {
          const blob = await upload(`stems/${Date.now()}-${file.name}`, file, {
            access: "private",
            handleUploadUrl: "/api/upload-stems",
            multipart: file.size > 8 * 1024 * 1024,
            onUploadProgress: ({ percentage }) => {
              setFiles((prev) =>
                prev.map((f) => (f.key === key ? { ...f, progress: percentage } : f))
              );
            },
          });
          setFiles((prev) =>
            prev.map((f) => (f.key === key ? { ...f, status: "done", url: blob.url, progress: 100 } : f))
          );
        } catch (e) {
          setFiles((prev) =>
            prev.map((f) =>
              f.key === key
                ? { ...f, status: "error", error: e instanceof Error ? e.message : "Upload failed" }
                : f
            )
          );
        }
      })
    );
    setBusy(-1);
  }

  function removeFile(key: string) {
    setFiles((prev) => prev.filter((f) => f.key !== key));
  }

  const anyUploading = files.some((f) => f.status === "uploading");

  return (
    <div className="field">
      <label htmlFor={inputId}>{label}</label>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          void addFiles(e.dataTransfer.files);
        }}
        onClick={() => inputRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
        }}
        className={`flex cursor-pointer flex-col items-center gap-2 rounded-[8px] border border-dashed px-4 py-6 text-center transition-colors ${
          dragOver ? "border-accent bg-accent-dim" : "border-line-strong hover:border-line-strong"
        }`}
      >
        <UploadSimple size={22} className="text-faint" />
        <p className="text-sm font-medium">Drop files here, or click to browse</p>
        <p className="text-xs text-faint">{hint}</p>
        <input
          ref={inputRef}
          id={inputId}
          type="file"
          multiple
          className="sr-only"
          onChange={(e) => {
            void addFiles(e.target.files);
            e.target.value = "";
          }}
        />
      </div>

      {files.length > 0 && (
        <ul className="grid gap-2">
          {files.map((f) => (
            <li
              key={f.key}
              className="flex items-center gap-2.5 rounded-[8px] border border-line bg-surface px-3 py-2 text-sm"
            >
              <FileAudio size={18} className="shrink-0 text-faint" />
              <span className="min-w-0 flex-1 truncate">{f.name}</span>
              <span className="shrink-0 text-xs text-faint">{formatBytes(f.size)}</span>
              {f.status === "uploading" && (
                <span className="shrink-0 text-xs text-faint">{f.progress}%</span>
              )}
              {f.status === "done" && (
                <CheckCircle size={18} weight="fill" className="shrink-0 text-accent-bright" />
              )}
              {f.status === "error" && (
                <span className="flex shrink-0 items-center gap-1 text-xs text-accent-bright" title={f.error}>
                  <WarningCircle size={16} weight="fill" />
                  Failed
                </span>
              )}
              <button
                type="button"
                onClick={() => removeFile(f.key)}
                aria-label={`Remove ${f.name}`}
                className="shrink-0 text-faint transition-colors hover:text-ink"
              >
                <X size={16} />
              </button>
            </li>
          ))}
        </ul>
      )}

      <input type="hidden" name={name} value={JSON.stringify(urls)} />
      {anyUploading && <p className="text-xs text-faint">Uploading… hang tight before you submit.</p>}
    </div>
  );
}
