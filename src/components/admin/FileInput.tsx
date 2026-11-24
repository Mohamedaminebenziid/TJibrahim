"use client";
import { useRef, useState } from "react";

export default function FileInput({
  name,
  accept = "image/*,video/*",
  multiple = true,
  label = "Choose files",
}: {
  name: string;
  accept?: string;
  multiple?: boolean;
  label?: string;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<string[]>([]);

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={() => ref.current?.click()}
        className="inline-flex items-center gap-2 px-5 py-3 border border-black/20 hover:bg-black hover:text-white text-[11px] tracking-[0.25em] uppercase transition"
      >
        {label}
      </button>
      <input
        ref={ref}
        name={name}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={(e) => setFiles(Array.from(e.target.files ?? []).map((f) => `${f.name} (${(f.size / 1024 / 1024).toFixed(1)} MB)`))}
        className="sr-only"
      />
      {files.length > 0 && (
        <ul className="text-xs text-black/60 space-y-1 max-h-32 overflow-auto">
          {files.map((f, i) => <li key={i} className="truncate">• {f}</li>)}
        </ul>
      )}
      {files.length === 0 && (
        <div className="text-[11px] text-black/40">No file selected yet.</div>
      )}
    </div>
  );
}
