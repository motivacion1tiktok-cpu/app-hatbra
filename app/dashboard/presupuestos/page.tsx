import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { 
  Building2, 
  FileText, 
  Clock, 
  ArrowLeft,
  Briefcase
} from "lucide-react";
import { QuoteFormModal } from "./QuoteFormModal";

interface RequestItem {
  id: string;
  title: string;
  description: string | null;
  status: string;
  created_at: string;
  client_id: string;
}

export default async function PresupuestosPage() {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/auth/login");
  }

  // Consultar solicitudes abiertas
  const { data: requestsData, error: requestsError } = await supabase
    .from("requests")
    .select("id, title, description, status, created_at, client_id")
    .order("created_at", { ascending: false });

  if (requestsError) {
    console.error("Error al obtener solicitudes:", requestsError);
  }

  const requests = (requestsData as RequestItem[]) || [];

  return (
    <div className="max-w-6xl mx-auto space-y-8 p-4">
      {/* Cabecera */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 text-white p-6 md:p-8 rounded-3xl shadow-md relative overflow-hidden">
        <div className="relative z-10 space-y-2">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Volver al panel
          </Link>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-brand-500 text-xs font-medium">
            <Briefcase className="w-3.5 h-3.5" /> Zona Profesional
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            Solicitudes Disponibles para Presupuestar
          </h1>
          <p className="text-slate-300 text-xs md:text-sm max-w-xl">
            Explora las obras publicadas por los clientes y envía tu propuesta económica directa al Comparador.
          </p>
        </div>
      </div>

      {/* Lista de Solicitudes */}
      {requests.length === 0 ? (
        <div className="py-12 text-center space-y-3 bg-white rounded-2xl border border-dashed border-slate-200 shadow-sm p-6">
          <Building2 className="w-10 h-10 text-slate-400 mx-auto" />
          <h3 className="font-bold text-slate-900 text-sm">No hay solicitudes activas en este momento</h3>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {requests.map((req) => (
            <div key={req.id} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-brand-50 text-brand-700 rounded-md">
                    Oportunidad
                  </span>
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(req.created_at).toLocaleDateString("es-ES")}
                  </span>
                </div>
                <h2 className="text-lg font-bold text-slate-900">{req.title}</h2>
                {req.description && (
                  <p className="text-xs text-slate-600 line-clamp-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
                    {req.description}
                  </p>
                )}
              </div>

              <div className="pt-3 border-t border-slate-100">
                <QuoteFormModal requestId={req.id} requestTitle={req.title} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}