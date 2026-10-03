import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  Building2,
  Plus,
  Calculator,
  MessageSquare,
  ArrowRight,
  TrendingUp,
  FileText,
  Clock,
  CheckCircle2,
} from "lucide-react";

interface RequestItem {
  id: string;
  title: string;
  description: string;
  status: string;
  budget: number | null;
  created_at: string;
  client_id: string;
}

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/auth/login");
  }

  // 1. Obtener perfil del usuario
  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, role")
    .eq("id", user.id)
    .single();

  const userRole = profile?.role || "client";
  const userName = profile?.full_name || user.email?.split("@")[0] || "Usuario";

  // 2. Obtener solicitudes usando client_id (filtrado si es cliente, todas si es profesional/admin)
  let query = supabase
    .from("requests")
    .select("id, title, description, status, budget, created_at, client_id")
    .order("created_at", { ascending: false })
    .limit(5);

  if (userRole === "client") {
    query = query.eq("client_id", user.id);
  }

  const { data: requestsData, error: requestsError } = await query;
  const requests = (requestsData as RequestItem[]) || [];

  // Calcular métricas rápidas
  const totalRequests = requests.length;
  const totalBudget = requests.reduce((sum, req) => sum + (req.budget || 0), 0);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Banner Superior de Bienvenida */}
      <div className="bg-slate-900 text-white p-6 md:p-8 rounded-3xl shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 text-slate-300 text-xs font-semibold">
            <Building2 className="w-3.5 h-3.5 text-brand-500" />
            <span>Panel de Control HATBRA</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            ¡Hola, {userName}! 👋
          </h1>
          <p className="text-xs md:text-sm text-slate-300 max-w-xl">
            Gestiona las solicitudes de obras recibidas, envía presupuestos y atiende a los clientes en tiempo real.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <Link
            href="/dashboard/nuevo-proyecto"
            className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold px-4 py-3 rounded-2xl transition shadow-sm"
          >
            <Plus className="w-4 h-4" /> Nueva Reforma
          </Link>
          <Link
            href="/dashboard/comparador"
            className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold px-4 py-3 rounded-2xl border border-slate-700 transition"
          >
            <Calculator className="w-4 h-4 text-brand-400" /> Estimador
          </Link>
        </div>
      </div>

      {/* Tarjetas de Métricas */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold text-slate-500">Solicitudes Activas</span>
            <FileText className="w-4 h-4 text-brand-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900">{totalRequests}</div>
          <p className="text-[11px] text-slate-400">Obras y solicitudes registradas</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold text-slate-500">Presupuesto Estimado</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900">{totalBudget.toLocaleString()} €</div>
          <p className="text-[11px] text-slate-400">Valor total estimado</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold text-slate-500">Respuestas / Mensajes</span>
            <MessageSquare className="w-4 h-4 text-brand-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900">Activo</div>
          <p className="text-[11px] text-slate-400">Canal directo de comunicación</p>
        </div>
      </div>

      {/* Grid Principal: Obras Recientes + Herramientas Directas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lista de Obras Recientes */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-brand-600" />
              <h2 className="font-extrabold text-slate-900 text-sm">Tus Obras Recientes</h2>
            </div>
            <Link
              href="/dashboard/proyectos"
              className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1"
            >
              Ver todas <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {requestsError ? (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-center text-xs text-amber-800">
              Ocurrió un error al cargar las solicitudes: {requestsError.message}
            </div>
          ) : requests.length === 0 ? (
            <div className="py-10 text-center space-y-2">
              <Clock className="w-8 h-8 text-slate-300 mx-auto" />
              <p className="text-xs font-bold text-slate-600">No hay solicitudes registradas aún</p>
              <p className="text-[11px] text-slate-400 max-w-xs mx-auto">
                Crea tu primer proyecto para empezar a recibir presupuestos de profesionales verificados.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {requests.map((req) => (
                <div
                  key={req.id}
                  className="p-4 rounded-2xl border border-slate-100 hover:border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition flex items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <h3 className="font-bold text-xs text-slate-900">{req.title}</h3>
                    <p className="text-[11px] text-slate-500 line-clamp-1">{req.description}</p>
                    <div className="flex items-center gap-2 pt-1">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 capitalize">
                        {req.status}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {new Date(req.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {req.budget && (
                    <div className="text-right">
                      <span className="text-xs font-extrabold text-slate-900">{req.budget} €</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Herramientas Directas */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="font-extrabold text-slate-900 text-sm">Herramientas Directas</h2>
          </div>

          <div className="space-y-3">
            <Link
              href="/dashboard/comparador"
              className="p-4 rounded-2xl border border-slate-100 hover:border-slate-200 bg-slate-50 hover:bg-slate-100/80 transition flex items-start gap-3 group block"
            >
              <div className="p-2.5 rounded-xl bg-brand-50 text-brand-600 group-hover:bg-brand-600 group-hover:text-white transition">
                <Calculator className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-xs text-slate-900">Calculadora de Materiales</h3>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Obtén el despiece de azulejos, sacos de mortero y pintura al instante.
                </p>
              </div>
            </Link>

            <Link
              href="/dashboard/mensajes"
              className="p-4 rounded-2xl border border-slate-100 hover:border-slate-200 bg-slate-50 hover:bg-slate-100/80 transition flex items-start gap-3 group block"
            >
              <div className="p-2.5 rounded-xl bg-brand-50 text-brand-600 group-hover:bg-brand-600 group-hover:text-white transition">
                <MessageSquare className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-xs text-slate-900">Chat en Tiempo Real</h3>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Chatea directamente con los profesionales asignados a tu obra.
                </p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}