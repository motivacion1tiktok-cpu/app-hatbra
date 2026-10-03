"use client";

import { useRef, useState } from "react";
import { FileUp, Loader2, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export function AttachmentsField({
  value,
  onChange,
}: {
  value: string[];
  onChange: (paths: string[]) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFiles(files: FileList | null) {
    if (!files?.length) return;
    setUploading(true);
    setError(null);
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Sesión no válida.");

      const uploaded: string[] = [];
      for (const file of Array.from(files)) {
        const safeName = file.name.replace(/[^\w.\-]+/g, "_");
        const path = `${user.id}/${Date.now()}_${safeName}`;
        const { error: upErr } = await supabase.storage
          .from("request-files")
          .upload(path, file, { upsert: false });
        if (upErr) throw upErr;
        uploaded.push(path);
      }
      onChange([...value, ...uploaded]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al subir archivos.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="inline-flex items-center gap-2 rounded-lg border border-dashed border-slate-300 px-4 py-2.5 text-sm text-slate-600 hover:border-brand-400 hover:text-brand-700 disabled:opacity-60 transition"
      >
        {uploading ? <Loader2 className="h-4 w-4 animate-spin text-brand-600" /> : <FileUp className="h-4 w-4" />}
        {uploading ? "Subiendo…" : "Añadir fotos, planos o documentos"}
      </button>
      <input
        ref={inputRef}
        type="file"
        multiple
        className="hidden"
        accept="image/*,.pdf,.dwg,.doc,.docx"
        onChange={(e) => handleFiles(e.target.files)}
      />
      {error && <p className="text-xs text-red-600">{error}</p>}
      {value.length > 0 && (
        <ul className="space-y-1">
          {value.map((p) => (
            <li key={p} className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-1.5 text-xs text-slate-600 border border-slate-100">
              <span className="truncate max-w-[250px]">{p.split("/").pop()}</span>
              <button
                type="button"
                onClick={() => onChange(value.filter((x) => x !== p))}
                className="ml-2 text-slate-400 hover:text-red-600 transition"
                aria-label="Quitar archivo"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}