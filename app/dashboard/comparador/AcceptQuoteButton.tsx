"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Check, Loader2 } from "lucide-react";
import { acceptQuote } from "./actions";
import { cn } from "@/lib/utils";

export function AcceptQuoteButton({
  quoteId,
  disabled,
}: {
  quoteId: string;
  disabled?: boolean;
}) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [accepted, setAccepted] = useState(false);
  const router = useRouter();

  function handleAccept() {
    setError(null);
    startTransition(async () => {
      const res = await acceptQuote(quoteId);
      if (!res.ok) {
        setError(res.error ?? "No se pudo aceptar.");
        return;
      }
      setAccepted(true);
      router.refresh();
    });
  }

  if (accepted) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-700">
        <Check className="h-4 w-4" /> Aceptado
      </span>
    );
  }

  return (
    <div className="space-y-1.5">
      <button
        type="button"
        onClick={handleAccept}
        disabled={pending || disabled}
        className={cn(
          "inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white",
          "transition-colors hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
        )}
      >
        {pending && <Loader2 className="h-4 w-4 animate-spin" />}
        {pending ? "Aceptando…" : "Aceptar presupuesto"}
      </button>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}