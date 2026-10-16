"use client";

import { useState } from "react";
import { Trash2, Loader2 } from "lucide-react";
import { deleteRequestAction } from "./actions";

export function DeleteRequestButton({ requestId }: { requestId: string }) {
  const [loading, setLoading] = useState(false);
  const [confirming, setConfirming] = useState(false);

  const handleDelete = async () => {
    if (!confirming) {
      setConfirming(true);
      return;
    }
    setLoading(true);
    const res = await deleteRequestAction(requestId);
    setLoading(false);
    if (!res.ok) {
      alert(res.error || "Error al eliminar la solicitud");
      setConfirming(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className={`p-1.5 rounded-lg transition-colors flex items-center gap-1 text-xs font-medium ${
        confirming
          ? "bg-red-600 text-white hover:bg-red-700"
          : "text-slate-400 hover:text-red-600 hover:bg-slate-100"
      }`}
      title={confirming ? "¿Confirmar eliminación?" : "Eliminar solicitud"}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <Trash2 className="w-4 h-4" />
      )}
      {confirming && <span>¿Borrar?</span>}
    </button>
  );
}