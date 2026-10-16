"use client";

import { useState, useTransition } from "react";
import { Trash2, Loader2 } from "lucide-react";
import { deleteRequestAction } from "./actions";

interface DeleteRequestButtonProps {
  requestId: string;
}

export function DeleteRequestButton({ requestId }: DeleteRequestButtonProps) {
  const [isPending, startTransition] = useTransition();
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    startTransition(async () => {
      try {
        const res = await deleteRequestAction(requestId);
        if (!res.ok) alert(res.error || "Error al eliminar la solicitud");
      } catch (error) {
        console.error("Error al eliminar la solicitud:", error);
        alert("Ocurrió un error al intentar eliminar la solicitud.");
      }
    });
  };

  if (showConfirm) {
    return (
      <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={handleDelete}
          disabled={isPending}
          className="rounded bg-red-600 px-2 py-1 text-xs text-white hover:bg-red-700 disabled:opacity-50 flex items-center gap-1"
        >
          {isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : "Borrar"}
        </button>
        <button
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShowConfirm(false); }}
          disabled={isPending}
          className="rounded bg-slate-200 px-2 py-1 text-xs text-slate-700 hover:bg-slate-300"
        >
          X
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShowConfirm(true); }}
      title="Eliminar solicitud (Solo Owner)"
      className="p-1 text-slate-400 hover:text-red-600 transition-colors rounded"
    >
      <Trash2 className="h-4 w-4" />
    </button>
  );
}