"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Loader2 } from "lucide-react";
import { acceptQuote } from "./actions";
import { cn } from "@/lib/utils";

interface AcceptQuoteButtonProps {
  quoteId: string;
  isAccepted?: boolean;
  isDisabled?: boolean;
  className?: string;
}

export function AcceptQuoteButton({
  quoteId,
  isAccepted = false,
  isDisabled = false,
  className
}: AcceptQuoteButtonProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleAccept() {
    if (loading || isDisabled || isAccepted) return;
    setLoading(true);

    try {
      const res = await acceptQuote(quoteId);
      if (res.ok) {
        router.refresh();
      } else {
        alert(res.error || "Error al aceptar el presupuesto");
      }
    } catch (err) {
      alert("Error de conexión al aceptar presupuesto");
    } finally {
      setLoading(false);
    }
  }

  if (isAccepted) {
    return (
      <span className={cn("inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-500 border border-emerald-500/20", className)}>
        <Check className="w-3.5 h-3.5" /> Presupuesto Aceptado
      </span>
    );
  }

  return (
    <button
      onClick={handleAccept}
      disabled={loading || isDisabled}
      className={cn(
        "inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all",
        "bg-emerald-600 text-white hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed",
        className
      )}
    >
      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
      Aceptar Presupuesto
    </button>
  );
}
