import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { 
  Building2, 
  Calculator, 
  Clock, 
  HardHat, 
  CheckCircle2, 
  XCircle, 
  ArrowLeft
} from "lucide-react";
import { AcceptQuoteButton } from "./AcceptQuoteButton";

interface Quote {
  id: string;
  request_id: string;
  provider_id: string | null;
  provider_name: string | null;
  total_amount: number;
  estimated_days: number | null;
  description: string | null;
  status: string;
  created_at: string;
  profiles?: {
    full_name: string | null;
  } | null;
}

interface RequestItem {
  id: string;
  title: string;
  category?: string;
  status: string;
  created_at: string;
  quotes: Quote[];
}

export default async function ComparadorPage() {
  const supabase = await createClient();

  // 1. Obtener usuario de la sesión
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/auth/login");
  }

  // 2. Consultar solicitudes del usuario (client_id) con sus presupuestos
  const { data: requestsData, error: requestsError } = await supabase
    .from("requests")
    .select(`
      id,
      title,
      status,
      created_at,
      quotes (
        id,
        request_id,
        provider_id,
        provider_name,
        total_amount,
        estimated_days,
        description,
        status,
        created_at,
        profiles:provider_id (
          full_name
        )
      )
    `)
    .eq("client_id", user.id)
    .order("created_at", { ascending: false });

  if (requestsError) {
    console.error("Error al cargar datos del comparador:", requestsError);
  }

  const requests = (requestsData as unknown as RequestItem[]) || [];

  return (
    <div className="max-w-6xl mx-auto space-y-8 p-4">
      {/* Cabecera HATBRA */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 text-white p-6 md:p-8 rounded-3xl shadow-md relative overflow-hidden">
        <div className="relative z-10 space-y-2">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Volver al panel
          </Link>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-brand-500 text-xs font-medium">
            <Calculator className="w-3.5 h-3.5" /> Comparador de Presupuestos
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            Compara y Acepta Ofertas
          </h1>
          <p className="text-slate-300 text-xs md:text-sm max-w-xl">
            Revisa las propuestas enviadas por los profesionales para tus obras solicitadas. Acepta la que mejor se adapte a tus necesidades.
          </p>
        </div>

        {/* Resplandor decorativo */}
        <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-brand-600/15 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Lista de Solicitudes y Presupuestos */}
      {requests.length === 0 ? (
        <div className="py-12 text-center space-y-3 bg-white rounded-2xl border border-dashed border-slate-200 shadow-sm p-6">
          <Building2 className="w-10 h-10 text-slate-400 mx-auto" />
          <h3 className="font-bold text-slate-900 text-sm">No tienes solicitudes publicadas</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Crea tu primera solicitud de reforma para empezar a recibir propuestas de los profesionales.
          </p>
          <Link
            href="/dashboard/nuevo-proyecto"
            className="inline-flex items-center gap-2 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl text-xs transition shadow-sm"
          >
            Crear Solicitud
          </Link>
        </div>
      ) : (
        <div className="space-y-8">
          {requests.map((req) => (
            <div key={req.id} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md">
                    {req.category || "Reforma"}
                  </span>
                  <h2 className="text-lg font-bold text-slate-900 mt-1">{req.title}</h2>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
                    Estado: <span className="capitalize">{req.status}</span>
                  </span>
                </div>
              </div>

              {/* Grid de Presupuestos para esta solicitud */}
              {req.quotes && req.quotes.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {req.quotes.map((q) => {
                    const isAccepted = q.status === "accepted";
                    const isRejected = q.status === "rejected";
                    const isRequestClosed = req.status === "in_process" || req.status === "completed";
                    const professionalName = q.profiles?.full_name || q.provider_name || "Profesional HATBRA";

                    return (
                      <div
                        key={q.id}
                        className={`p-5 rounded-xl border transition-all space-y-4 flex flex-col justify-between ${
                          isAccepted
                            ? "bg-emerald-50/50 border-emerald-300 ring-1 ring-emerald-300"
                            : isRejected
                            ? "bg-slate-50 border-slate-200 opacity-60"
                            : "bg-white border-slate-200 hover:border-brand-500 hover:shadow-md"
                        }`}
                      >
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                              <HardHat className="w-4 h-4 text-brand-600" />
                              {professionalName}
                            </span>
                            {isAccepted && (
                              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                                <CheckCircle2 className="w-3 h-3" /> Aceptado
                              </span>
                            )}
                            {isRejected && (
                              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-500 bg-slate-200 px-2 py-0.5 rounded-full">
                                <XCircle className="w-3 h-3" /> Rechazado
                              </span>
                            )}
                          </div>

                          <div className="text-2xl font-black text-slate-900">
                            {q.total_amount ? `${q.total_amount.toLocaleString("es-ES")} €` : "0 €"}
                          </div>

                          {q.estimated_days && (
                            <p className="text-xs text-slate-500 flex items-center gap-1.5">
                              <Clock className="w-3.5 h-3.5 text-slate-400" />
                              Plazo estimado: <span className="font-semibold text-slate-700">{q.estimated_days} días</span>
                            </p>
                          )}

                          {q.description && (
                            <div className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                              <p className="line-clamp-3">{q.description}</p>
                            </div>
                          )}
                        </div>

                        <div className="pt-2 border-t border-slate-100">
                          {isAccepted ? (
                            <p className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
                              <CheckCircle2 className="w-4 h-4" /> Presupuesto adjudicado
                            </p>
                          ) : isRejected ? (
                            <p className="text-xs font-medium text-slate-400">Presupuesto no seleccionado</p>
                          ) : (
                            <AcceptQuoteButton quoteId={q.id} disabled={isRequestClosed} />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="py-6 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
                  <p className="text-xs text-slate-500">Aún no hay presupuestos recibidos para esta solicitud.</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}