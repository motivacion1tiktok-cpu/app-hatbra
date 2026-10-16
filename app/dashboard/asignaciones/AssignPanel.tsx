"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Trash2, UserPlus, X } from "lucide-react";
import {
  assignAction, unassignAction, deleteRequestAction,
} from "./actions";

interface Req {
  id: string; title: string; description: string | null;
  status: string; category: string | null; created_at: string;
}
interface Pro { id: string; full_name: string | null; }
interface Asg { id: string; request_id: string; professional_id: string; }

export function AssignPanel({
  requests, verificados, assignments,
}: {
  requests: Req[];
  verificados: Pro[];
  assignments: Asg[];
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [seleccion, setSeleccion] = useState<Record<string, string[]>>({});
  const [msg, setMsg] = useState<string | null>(null);

  function togglePro(reqId: string, proId: string) {
    setSeleccion((prev) => {
      const actuales = prev[reqId] ?? [];
      return {
        ...prev,
        [reqId]: actuales.includes(proId)
          ? actuales.filter((x) => x !== proId)
          : [...actuales, proId],
      };
    });
  }

  function run(fn: () => Promise<{ ok: boolean; error?: string }>) {
    setMsg(null);
    startTransition(async () => {
      const res = await fn();
      if (!res.ok) setMsg(res.error ?? "Error inesperado");
      router.refresh();
    });
  }

  return (
    <div className="space-y-4">
      {msg && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{msg}</p>}

      {requests.length === 0 && (
        <p className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-400">
          No hay solicitudes todavía.
        </p>
      )}

      {requests.map((r) => {
        const asignados = assignments.filter((a) => a.request_id === r.id);
        const sel = seleccion[r.id] ?? [];
        return (
          <div key={r.id} className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold uppercase text-slate-600">
                  {r.category || "General"} · {r.status}
                </span>
                <h3 className="mt-2 font-semibold text-slate-900">{r.title}</h3>
                <p className="text-sm text-slate-500 line-clamp-2">{r.description}</p>
              </div>
              <button
                onClick={() => run(() => deleteRequestAction(r.id))}
                className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600"
                aria-label="Eliminar solicitud"
                title="Eliminar solicitud"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>

            {/* Asignados */}
            {asignados.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {asignados.map((a) => {
                  const pro = verificados.find((v) => v.id === a.professional_id);
                  return (
                    <span
                      key={a.id}
                      className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1 text-xs font-medium text-brand-800"
                    >
                      {pro?.full_name || a.professional_id.slice(0, 8)}
                      <button
                        onClick={() => run(() => unassignAction(r.id, a.professional_id))}
                        className="text-brand-400 hover:text-red-600"
                        aria-label={`Quitar a ${pro?.full_name ?? "profesional"}`}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  );
                })}
              </div>
            )}

            {/* Invitar */}
            <div className="mt-4 border-t border-slate-100 pt-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Invitar a presupuestar (2-3 recomendado)
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {verificados.length === 0 && (
                  <p className="text-xs text-slate-400">
                    No hay profesionales verificados todavía — apruébalos en Validaciones.
                  </p>
                )}
                {verificados.map((p) => {
                  const yaAsignado = asignados.some((a) => a.professional_id === p.id);
                  const elegido = sel.includes(p.id);
                  return (
                    <button
                      key={p.id}
                      disabled={yaAsignado}
                      onClick={() => togglePro(r.id, p.id)}
                      className={cnChip(yaAsignado, elegido)}
                    >
                      {p.full_name || p.id.slice(0, 8)}
                      {yaAsignado && " ✓"}
                    </button>
                  );
                })}
              </div>
              {sel.length > 0 && (
                <button
                  onClick={() => {
                    run(() => assignAction(r.id, sel));
                    setSeleccion((p) => ({ ...p, [r.id]: [] }));
                  }}
                  disabled={pending}
                  className="mt-3 inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-60"
                >
                  {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserPlus className="h-4 w-4" />}
                  Invitar ({sel.length}) a presupuestar
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function cnChip(ya: boolean, elegido: boolean) {
  if (ya) return "cursor-default rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-500";
  return elegido
    ? "cursor-pointer rounded-full bg-brand-600 px-3 py-1 text-xs font-medium text-white"
    : "cursor-pointer rounded-full border border-slate-300 px-3 py-1 text-xs text-slate-700 hover:border-brand-400 hover:text-brand-700";
}