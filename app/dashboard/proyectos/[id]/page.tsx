import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { 
  Building2, 
  Calendar, 
  Euro, 
  Clock, 
  Send, 
  CheckCircle2, 
  ArrowLeft 
} from "lucide-react";
import Link from "next/link";
import { revalidatePath } from "next/cache";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ProyectoDetallePage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();

  // Obtener sesión del usuario
  const { data: { user } } = await supabase.auth.getUser();

  // Obtener perfil para el rol
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user?.id || "")
    .single();

  const isPro = profile?.role === "professional" || profile?.role === "pro";

  // Obtener la solicitud
  const { data: request, error } = await supabase
    .from("requests")
    .select("*, profiles:client_id(full_name)")
    .eq("id", id)
    .single();

  if (error || !request) {
    notFound();
  }

  // Obtener presupuestos/ofertas para esta solicitud
  const { data: quotes } = await supabase
    .from("quotes")
    .select("*, profiles:professional_id(full_name)")
    .eq("request_id", id);

  // Acción de servidor para enviar presupuesto
  async function submitQuote(formData: FormData) {
    "use server";
    const amount = Number(formData.get("amount"));
    const estimatedDays = Number(formData.get("estimated_days"));
    const description = formData.get("description") as string;

    const supabaseServer = await createClient();
    const { data: { user: currentUser } } = await supabaseServer.auth.getUser();

    if (!currentUser) return;

    await supabaseServer.from("quotes").insert({
      request_id: id,
      professional_id: currentUser.id,
      amount,
      estimated_days: estimatedDays,
      description,
      status: "pending",
    });

    revalidatePath(`/dashboard/proyectos/${id}`);
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Link 
        href="/dashboard/proyectos" 
        className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-900 transition"
      >
        <ArrowLeft className="w-4 h-4" /> Volver a solicitudes
      </Link>

      <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-6">
          <div>
            <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 uppercase tracking-wider">
              {request.status || "abierto"}
            </span>
            <h1 className="text-2xl font-extrabold text-slate-900 mt-2">{request.title}</h1>
            <p className="text-xs text-slate-400 mt-1">
              Publicado el {new Date(request.created_at).toLocaleDateString()} por {request.profiles?.full_name || "Cliente"}
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">Descripción del trabajo</h2>
          <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100">
            {request.description}
          </p>
        </div>

        {/* Formulario de Presupuesto (Sólo Profesionales) */}
        {isPro && request.status === "open" && (
          <div className="border-t border-slate-100 pt-6 space-y-4">
            <div className="flex items-center gap-2 text-brand-600 font-extrabold text-sm">
              <Send className="w-4 h-4" /> Enviar Presupuesto
            </div>

            <form action={submitQuote} className="space-y-4 bg-slate-50/50 p-6 rounded-2xl border border-slate-200">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Importe Total (€)</label>
                  <div className="relative">
                    <Euro className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                    <input 
                      type="number" 
                      name="amount" 
                      required 
                      placeholder="1200"
                      className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Plazo estimado (días)</label>
                  <div className="relative">
                    <Clock className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                    <input 
                      type="number" 
                      name="estimated_days" 
                      required 
                      placeholder="5"
                      className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Detalles de la propuesta</label>
                <textarea 
                  name="description" 
                  rows={3} 
                  required 
                  placeholder="Incluye desescombrado, materiales de agarre y mano de obra..."
                  className="w-full p-3 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <button 
                type="submit" 
                className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs py-3 rounded-xl transition shadow-sm flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" /> Confirmar y Enviar Presupuesto
              </button>
            </form>
          </div>
        )}

        {/* Presupuestos Enviados */}
        {quotes && quotes.length > 0 && (
          <div className="border-t border-slate-100 pt-6 space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">Presupuestos Enviados ({quotes.length})</h2>
            <div className="space-y-2">
              {quotes.map((q: any) => (
                <div key={q.id} className="p-4 rounded-2xl border border-slate-100 bg-white flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-slate-900">{q.profiles?.full_name || "Profesional"}</p>
                    <p className="text-xs text-slate-500">{q.description}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-extrabold text-slate-900">{q.amount || q.total_amount} €</span>
                    <p className="text-[10px] text-slate-400">{q.estimated_days} días</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}