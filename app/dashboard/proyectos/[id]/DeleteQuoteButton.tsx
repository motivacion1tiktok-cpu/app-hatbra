"use client";

import { useState, useTransition } from "react";
import { Trash2, Loader2 } from "lucide-react";
import { deleteQuoteAction } from "./actions";

interface DeleteQuoteButtonProps {
  quoteId: string;
}

export function DeleteQuoteButton({ quoteId }: DeleteQuoteButtonProps) {
  const [isPending, startTransition] = useTransition();
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDelete = () => {
    startTransition(async () => {
      try {
        const res = await deleteQuoteAction(quoteId);
        if (!res.ok) alert(res.error || "Error al eliminar");
      } catch (error) {
        console.error("Error al eliminar el presupuesto:", error);
        alert("Ocurrió un error al intentar eliminar el presupuesto.");
      }
    });
  };

  if (showConfirm) {
    return (
      <div className="flex items-center gap-1">
        <button
          onClick={handleDelete}
          disabled={isPending}
          className="rounded bg-red-600 px-2 py-1 text-xs text-white hover:bg-red-700 disabled:opacity-50 flex items-center gap-1"
        >
          {isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : "Confirmar"}
        </button>
        <button
          onClick={() => setShowConfirm(false)}
          disabled={isPending}
          className="rounded bg-slate-200 px-2 py-1 text-xs text-slate-700 hover:bg-slate-300"
        >
          Cancelar
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setShowConfirm(true)}
      title="Eliminar presupuesto (Solo Staff)"
      className="p-1 text-slate-400 hover:text-red-600 transition-colors rounded"
    >
      <Trash2 className="h-4 w-4" />
    </button>
  );
}
