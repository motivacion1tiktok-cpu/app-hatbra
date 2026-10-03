import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { AcceptQuoteButton } from "./AcceptQuoteButton";
import { Calculator, Clock, FileText, UserCheck } from "lucide-react";

export const dynamic = "force-dynamic";

interface QuoteItem {
  id: string;
  request_id: string;
  provider_name?: string;
  total_amount: number;
  description?: string;
  breakdown?: any;
  status: string;
  created_at: string;
  estimated_days?: number;
}

interface RequestWithQuotes {
  id: string;
  title: string;
  category: string;
  status: string;
  quotes: QuoteItem[];
}

export default async function ComparadorPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  // Consulta adaptada exactamente a la columna client_id
  const { data: requestsData, error } = await supabase
    .from("requests")
    .select(`
      id,
      title,
      category,
      status,
      quotes (
        id,
        request_id,
        provider_name,
        total_amount,
        description,
        breakdown,
        status,
        created_at,
        estimated_days
      )
    `)
    .eq("client_id", user.id)
    .order("created_at", { ascending: false });

  const requests = (requestsData as unknown as RequestWithQuotes[]) || [];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          Comparador de Presupuestos 📊
        </h1>
        <p className="text-xs text-slate-500">
          Analiza y compara los presupuestos recibidos para tus solicitudes de reforma.
        </p>
      </div>

      {error ? (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-xs rounded-2xl">
          Error al cargar los presupuestos: {error.message}
        </div>
      ) : requests.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-3 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
            <Calculator className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-sm text-slate-800">No tienes presupuestos pendientes</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Publica una nueva solicitud para comenzar a recibir ofertas de profesionales.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {requests.map((req) => {
            const hasAcceptedQuote = req.quotes.some((q) => q.status === "accepted");

            return (
              <div
                key={req.id}
                className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
                  <div>
                    <span className="inline-block text-[10px] font-extrabold uppercase tracking-wider text-brand-600 bg-brand-50 px-2.5 py-0.5 rounded-full mb-1">
                      {req.category}
                    </span>
                    <h2 className="text-base font-bold text-slate-900">{req.title}</h2>
                  </div>
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 text-slate-700 w-fit">
                    Estado: {req.status}
                  </span>
                </div>

                {req.quotes.length === 0 ? (
                  <p className="text-xs text-slate-400 italic py-2">
                    Esperando presupuestos de profesionales...
                  </p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
                    {req.quotes.map((quote) => {
                      const isAccepted = quote.status === "accepted";

                      return (
                        <div
                          key={quote.id}
                          className={`p-5 rounded-2xl border transition space-y-4 flex flex-col justify-between ${
                            isAccepted
                              ? "border-emerald-500 bg-emerald-50/30 ring-1 ring-emerald-500"
                              : "border-slate-200 bg-white hover:border-slate-300"
                          }`}
                        >
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-xs text-slate-800 flex items-center gap-1.5">
                                <UserCheck className="w-4 h-4 text-brand-600" />
                                {quote.provider_name || "Profesional Verificado"}
                              </span>
                              <span className="text-lg font-extrabold text-slate-900">
                                {Number(quote.total_amount).toLocaleString("es-ES", {
                                  style: "currency",
                                  currency: "EUR",
                                })}
                              </span>
                            </div>

                            {quote.description && (
                              <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
                                {quote.description}
                              </p>
                            )}

                            {quote.estimated_days && (
                              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                                <Clock className="w-3.5 h-3.5 text-slate-400" />
                                <span>Plazo estimado: <strong>{quote.estimated_days} días</strong></span>
                              </div>
                            )}

                            {quote.breakdown && Array.isArray(quote.breakdown) && (
                              <div className="space-y-1.5 pt-2 border-t border-slate-100">
                                <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1">
                                  <FileText className="w-3 h-3" /> Desglose por partidas:
                                </span>
                                <ul className="space-y-1">
                                  {quote.breakdown.map((item: any, idx: number) => (
                                    <li key={idx} className="flex justify-between text-[11px] text-slate-600">
                                      <span className="truncate">{item.concept || item.title}</span>
                                      <span className="font-semibold ml-2">
                                        {Number(item.price || item.amount).toLocaleString("es-ES", {
                                          style: "currency",
                                          currency: "EUR",
                                        })}
                                      </span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>

                          <div className="pt-3 border-t border-slate-100">
                            <AcceptQuoteButton
                              quoteId={quote.id}
                              isAccepted={isAccepted}
                              isDisabled={hasAcceptedQuote && !isAccepted}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}