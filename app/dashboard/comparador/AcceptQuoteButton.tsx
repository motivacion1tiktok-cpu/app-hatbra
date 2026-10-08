"use client";

import { useState } from "react";
import { acceptQuoteAction } from "./actions";
import { CheckCircle2, Loader2 } from "lucide-react";

interface AcceptQuoteButtonProps {
  quoteId: string;
  isAccepted: boolean;
  isDisabled: boolean;
}

export function AcceptQuoteButton({
  quoteId,
  isAccepted,
  isDisabled,
}: AcceptQuoteButtonProps) {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function handleAccept() {
    const confirmAccept = window.confirm(
      "¿Estás seguro de que deseas aceptar este presupuesto? Esta acción adjudicará la obra a este profesional y rechazará el resto de ofertas recibidas."
    );

    if (!confirmAccept) return;

    setLoading(true);
    setErrorMsg(null);

    const result = await acceptQuoteAction(quoteId);

    if (!result.success) {
      setErrorMsg(result.error || "Error al aceptar el presupuesto.");
      setLoading(false);
    }
  }

  if (isAccepted) {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-100 text-emerald-800 font-bold text-xs">
        <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Presupuesto Aceptado
      </span>
    );
  }

  return (
    <div className="space-y-1">
      <button
        type="button"
        onClick={handleAccept}
        disabled={loading || isDisabled}
        className="inline-flex items-center justify-center gap-2 w-full bg-brand-600 hover:bg-brand-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition shadow-sm"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin text-white" />
            Aceptando...
          </>
        ) : (
          "Aceptar Presupuesto"
        )}
      </button>
      {errorMsg && <p className="text-[11px] text-red-600 mt-1">{errorMsg}</p>}
    </div>
  );
}
