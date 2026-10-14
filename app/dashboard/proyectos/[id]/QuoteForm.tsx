"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function QuoteForm({
  requestId,
  providerName,
}: {
  requestId: string;
  providerName: string;
}) {
  const router = useRouter();
  const [form, setForm] = useState({ monto: "", dias: "", descripcion: "" });
  const [sending, setSending] = useState(false);
  const [ok, setOk] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);
    setOk(null);
    setError(null);

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setError("Sesión no válida. Inicia sesión de nuevo.");
      setSending(false);
      return;
    }

    // Columnas canónicas según convención AGENTS.md
    const { error } = await supabase.from("quotes").insert({
      request_id: requestId,
      user_id: user.id,
      provider_id: user.id,
      provider_name: providerName,
      total_amount: Number(form.monto.replace(",", ".")),
      description: form.descripcion,
      estimated_days: form.dias ? parseInt(form.dias) : null,
      status: "sent",
    });

    if (error) {
      setError(error.message);
    } else {
      setOk("✅ Presupuesto enviado. El cliente ya puede verlo y aceptarlo.");
      setForm({ monto: "", dias: "", descripcion: "" });
      router.refresh(); // re-renderiza el Server Component con el quote nuevo
    }
    setSending(false);
  }

  const input =
    "w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none";

  return (
    <form onSubmit={submit} className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6">
      <h2 className="text-lg font-semibold text-slate-900">Emitir presupuesto</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600">
            Monto (€) *
          </label>
          <input
            type="number" min="0" step="0.01" required
            value={form.monto} onChange={(e) => setForm({ ...form, monto: e.target.value })}
            className={input} placeholder="Ej.: 1200"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600">
            Días estimados
          </label>
          <input
            type="number" min="1"
            value={form.dias} onChange={(e) => setForm({ ...form, dias: e.target.value })}
            className={input} placeholder="Ej.: 15"
          />
        </div>
      </div>
      <div>
        <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600">
          Detalles de la propuesta *
        </label>
        <textarea
          required rows={4}
          value={form.descripcion} onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
          className={input} placeholder="Materiales, plazos de ejecución, condiciones…"
        />
      </div>
      {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
      {ok && <p className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{ok}</p>}
      <button
        type="submit" disabled={sending}
        className="w-full rounded-lg bg-brand-600 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-700 disabled:opacity-60"
      >
        {sending ? "Enviando…" : "Emitir presupuesto"}
      </button>
    </form>
  );
}