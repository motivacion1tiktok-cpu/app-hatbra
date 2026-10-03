"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Send, Loader2, DollarSign, Clock, FileText, Check } from "lucide-react";
import { submitQuote } from "./actions";

export function QuoteFormModal({
  requestId,
  requestTitle,
}: {
  requestId: string;
  requestTitle: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [days, setDays] = useState("");
  const [description, setDescription] = useState("");
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const router = useRouter();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    startTransition(async () => {
      const res = await submitQuote({
        requestId,
        totalAmount: parseFloat(amount),
        estimatedDays: parseInt(days) || 0,
        description,
      });

      if (!res.ok) {
        setError(res.error ?? "No se pudo enviar el presupuesto.");
        return;
      }

      setSent(true);
      setTimeout(() => {
        setIsOpen(false);
        setSent(false);
        setAmount("");
        setDays("");
        setDescription("");
        router.refresh();
      }, 1500);
    });
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="w-full inline-flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs py-2.5 px-4 rounded-xl transition shadow-sm"
      >
        <Send className="w-3.5 h-3.5" /> Enviar Presupuesto
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-xl border border-slate-100 space-y-6">
            <div>
              <h3 className="font-extrabold text-slate-900 text-lg">Enviar Presupuesto</h3>
              <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">Para: {requestTitle}</p>
            </div>

            {sent ? (
              <div className="py-8 text-center space-y-2">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <Check className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-slate-900 text-sm">¡Presupuesto enviado!</h4>
                <p className="text-xs text-slate-500">El cliente lo recibirá en su comparador.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Importe Total (€)
                  </label>
                  <div className="relative">
                    <DollarSign className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="number"
                      step="0.01"
                      required
                      placeholder="Ej. 2450"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:border-brand-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Plazo Estimado (Días)
                  </label>
                  <div className="relative">
                    <Clock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="number"
                      required
                      placeholder="Ej. 5"
                      value={days}
                      onChange={(e) => setDays(e.target.value)}
                      className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:border-brand-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Detalles de la Propuesta / Desglose
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Describe los trabajos incluidos, mano de obra o materiales..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-brand-600"
                  />
                </div>

                {error && <p className="text-xs text-red-600">{error}</p>}

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-700"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={pending}
                    className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs py-2 px-4 rounded-xl transition disabled:opacity-50"
                  >
                    {pending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                    {pending ? "Enviando..." : "Confirmar y Enviar"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}