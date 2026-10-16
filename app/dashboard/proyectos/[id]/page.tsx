import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { QuoteForm } from "./QuoteForm";
import { AcceptQuoteButton } from "../../comparador/AcceptQuoteButton";
import { DeleteQuoteButton } from "./DeleteQuoteButton";

export const dynamic = "force-dynamic";

function euro(v: number | string | null) {
  if (v === null || v === "") return "A consultar";
  const n = Number(v);
  return Number.isFinite(n)
    ? n.toLocaleString("es-ES", { style: "currency", currency: "EUR", maximumFractionDigits: 2 })
    : "A consultar";
}

export default async function ProyectoDetallePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, full_name")
    .eq("id", user?.id ?? "")
    .maybeSingle();

  const role = profile?.role ?? "client";
  const isPro = role === "professional" || role === "owner" || role === "admin";
  const isStaff = role === "owner" || role === "admin";

  // SIN JOIN: la fila de requests trae todo lo que la vista necesita
  const { data: request } = await supabase
    .from("requests")
    .select("id, title, description, status, created_at, category, client_id")
    .eq("id", id)
    .maybeSingle();

  // 404 SOLO si la fila no existe de verdad â€” nunca por un join roto
  if (!request) notFound();

  const isOwner = request.client_id === user?.id;

  const { data: quotes } = await supabase
    .from("quotes")
    .select("id, total_amount, description, estimated_days, status, user_id, created_at")
    .eq("request_id", id)
    .order("created_at", { ascending: false });

  const providerName = profile?.full_name?.trim() || user?.email?.split("@")[0] || "Profesional";

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Link href="/dashboard/proyectos" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800">
        <ArrowLeft className="h-4 w-4" /> Volver a proyectos
      </Link>

      {/* Solicitud */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-brand-50 px-2.5 py-0.5 text-xs font-semibold text-brand-700">
            {request.category || "General"}
          </span>
          <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium capitalize text-slate-600">
            {request.status}
          </span>
          <span className="text-xs text-slate-400">
            {new Date(request.created_at).toLocaleDateString("es-ES")}
          </span>
        </div>
        <h1 className="mt-3 text-2xl font-bold text-slate-900">{request.title}</h1>
        {request.description && <p className="mt-2 text-slate-600">{request.description}</p>}
      </div>

      {/* Profesional: emite presupuesto */}
      {isPro && !isOwner && (
        <QuoteForm requestId={request.id} providerName={providerName} />
      )}

      {/* Cliente dueÃ±o (o staff): presupuestos recibidos + aceptaciÃ³n */}
      {(isOwner || isStaff) && (
        <div className="space-y-3 rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-slate-900">
            Presupuestos recibidos{" "}
            <span className="text-sm font-normal text-slate-400">({quotes?.length ?? 0})</span>
            {isStaff && (
              <span className="ml-2 text-xs font-normal text-slate-400">
                Â· modo gestiÃ³n: puedes eliminar presupuestos
              </span>
            )}
          </h2>
          {!quotes || quotes.length === 0 ? (
            <p className="text-sm text-slate-400">AÃºn no hay presupuestos para esta solicitud.</p>
          ) : (
            quotes.map((q) => (
              <div key={q.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-100 p-4">
                <div className="min-w-0">
                  <p className="font-semibold text-slate-900">{euro(q.total_amount)}</p>
                  {q.description && <p className="text-xs text-slate-500 line-clamp-1">{q.description}</p>}
                  {q.estimated_days != null && (
                    <p className="mt-0.5 text-xs text-slate-400">Plazo: {q.estimated_days} dÃ­as</p>
                  )}
                  {q.status !== "sent" && (
                    <span className="text-xs font-medium capitalize text-slate-400">{q.status}</span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <AcceptQuoteButton quoteId={q.id} isAccepted={q.status === "accepted"} isDisabled={q.status !== "sent"} />
                  {isStaff && <DeleteQuoteButton quoteId={q.id} />}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
