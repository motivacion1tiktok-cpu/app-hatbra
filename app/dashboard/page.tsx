import Link from "next/link";
import { 
  Building2, 
  Plus, 
  Calculator, 
  FileText, 
  TrendingUp, 
  MessageSquare, 
  ArrowRight,
  Search
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const supabase = await createClient();

  // Obtener sesión del usuario
  const { data: { user } } = await supabase.auth.getUser();

  // Obtener perfil para conocer rol e identificador
  const { data: profile } = await supabase
    .from("profiles")
    .select("role, full_name")
    .eq("id", user?.id || "")
    .single();

  const isPro = profile?.role === "professional" || profile?.role === "pro";

  // Obtener proyectos/solicitudes recientes
  const { data: projects } = await supabase
    .from("requests")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(5);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Banner Principal */}
      <div className="bg-slate-900 text-white p-6 md:p-8 rounded-3xl shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 text-slate-300 text-xs font-semibold">
            <Building2 className="w-3.5 h-3.5 text-brand-500" />
            <span>Panel de Control HATBRA</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            ¡Hola, {profile?.full_name || user?.email?.split("@")[0]}! 👋
          </h1>
          <p className="text-xs md:text-sm text-slate-300 max-w-xl">
            {isPro
              ? "Gestiona las solicitudes de obras recibidas, envía presupuestos y atiende a los clientes en tiempo real."
              : "Publica tus proyectos de reforma, compara presupuestos de profesionales y gestiona tus obras."}
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

      {/* Métricas rápidas */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold text-slate-500">Solicitudes Activas</span>
            <FileText className="w-4 h-4 text-brand-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900">{projects?.length || 0}</div>
          <p className="text-[11px] text-slate-400">Obras y solicitudes registradas</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold text-slate-500">Estado de Operaciones</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900">En marcha</div>
          <p className="text-[11px] text-slate-400">Gestión de presupuestos activa</p>
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

      {/* Lista de Obras y Herramientas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-brand-600" />
              <h2 className="font-extrabold text-slate-900 text-sm">Tus Obras Recientes</h2>
            </div>
            {/* ENLACE CORREGIDO AQUI: /dashboard/proyectos */}
            <Link
              href="/dashboard/proyectos"
              className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1"
            >
              Ver todas <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {projects && projects.length > 0 ? (
              projects.map((project: any) => (
                <Link
                  key={project.id}
                  href={`/dashboard/proyectos/${project.id}`}
                  className="p-4 rounded-2xl border border-slate-100 hover:border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition flex items-center justify-between gap-4 block"
                >
                  <div className="space-y-1">
                    <h3 className="font-bold text-xs text-slate-900">{project.title}</h3>
                    <p className="text-[11px] text-slate-500 line-clamp-1">{project.description}</p>
                    <div className="flex items-center gap-2 pt-1">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 capitalize">
                        {project.status || "abierto"}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {new Date(project.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <p className="text-xs text-slate-400 py-4 text-center">No hay obras o solicitudes aún.</p>
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="font-extrabold text-slate-900 text-sm">Herramientas Directas</h2>
          </div>
          <div className="space-y-3">
            {isPro && (
              /* ENLACE CORREGIDO PARA PROFESIONALES */
              <Link
                href="/dashboard/proyectos"
                className="p-4 rounded-2xl border border-slate-100 hover:border-slate-200 bg-slate-50 hover:bg-slate-100/80 transition flex items-start gap-3 group block"
              >
                <div className="p-2.5 rounded-xl bg-brand-50 text-brand-600 group-hover:bg-brand-600 group-hover:text-white transition">
                  <Search className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-xs text-slate-900">Buscar Obras</h3>
                  <p className="text-[11px] text-slate-500 mt-0.5">Encuentra nuevas solicitudes de reforma activas.</p>
                </div>
              </Link>
            )}

            <Link
              href="/dashboard/comparador"
              className="p-4 rounded-2xl border border-slate-100 hover:border-slate-200 bg-slate-50 hover:bg-slate-100/80 transition flex items-start gap-3 group block"
            >
              <div className="p-2.5 rounded-xl bg-brand-50 text-brand-600 group-hover:bg-brand-600 group-hover:text-white transition">
                <Calculator className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-xs text-slate-900">Calculadora de Materiales</h3>
                <p className="text-[11px] text-slate-500 mt-0.5">Obtén el despiece de azulejos y materiales al instante.</p>
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
                <p className="text-[11px] text-slate-500 mt-0.5">Chatea directamente con tus clientes o profesionales.</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}