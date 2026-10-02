"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { 
  Briefcase, 
  Clock, 
  CheckCircle, 
  MessageSquare, 
  TrendingUp, 
  FileText,
  AlertCircle 
} from "lucide-react";

interface ActiveProject {
  id: string;
  total_amount: number;
  estimated_days?: number;
  description: string;
  status: string;
  created_at: string;
  requests?: {
    id: string;
    title: string;
    category: string;
    location: string;
  } | null;
}

export default function ProyectosPage() {
  const router = useRouter();
  const supabase = createClient();
  const [projects, setProjects] = useState<ActiveProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fetchActiveProjects = async () => {
    try {
      setLoading(true);
      setErrorMsg(null);

      // Cargar presupuestos aceptados con JOIN a la solicitud
      const { data, error } = await supabase
        .from("quotes")
        .select(`
          id,
          total_amount,
          estimated_days,
          description,
          status,
          created_at,
          requests (
            id,
            title,
            category,
            location
          )
        `)
        .eq("status", "accepted")
        .order("created_at", { ascending: false });

      if (error) throw error;

      setProjects((data as unknown as ActiveProject[]) || []);
    } catch (err: any) {
      console.error("Error al cargar proyectos:", err);
      setErrorMsg(`No se pudieron cargar los proyectos activos: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActiveProjects();
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Encabezado */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Proyectos en Curso 🏗️</h1>
        <p className="text-sm text-slate-500">
          Supervisa el estado, los hitos de ejecución y la comunicación de tus reformas activas.
        </p>
      </div>

      {errorMsg && (
        <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl text-sm">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p>{errorMsg}</p>
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2].map((i) => (
            <div key={i} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm animate-pulse space-y-4">
              <div className="h-5 bg-slate-200 rounded w-1/2" />
              <div className="h-4 bg-slate-200 rounded w-1/3" />
              <div className="h-16 bg-slate-100 rounded w-full" />
            </div>
          ))}
        </div>
      ) : projects.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/60 shadow-sm space-y-3">
          <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-2xl flex items-center justify-center mx-auto mb-2">
            <Briefcase className="w-6 h-6" />
          </div>
          <h3 className="text-base font-semibold text-slate-800">No hay proyectos en ejecución</h3>
          <p className="text-sm text-slate-400 max-w-sm mx-auto">
            Acepta una propuesta en el Comparador de Presupuestos para iniciar el seguimiento de tu obra.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {projects.map((project) => (
            <div
              key={project.id}
              className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition-all space-y-5"
            >
              {/* Cabecera Tarjeta */}
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-full mb-2">
                    <TrendingUp className="w-3.5 h-3.5" /> En Ejecución
                  </span>
                  <h2 className="text-lg font-bold text-slate-900">
                    {project.requests?.title || "Reforma Activa"}
                  </h2>
                  {project.requests?.category && (
                    <span className="text-xs text-slate-400 block font-medium">
                      {project.requests.category} {project.requests.location ? `• ${project.requests.location}` : ""}
                    </span>
                  )}
                </div>
                <div className="text-right shrink-0">
                  <span className="text-xs text-slate-400 block">Presupuesto</span>
                  <span className="text-xl font-extrabold text-slate-900">
                    {project.total_amount.toLocaleString("es-ES", {
                      minimumFractionDigits: 2,
                    })}{" "}
                    €
                  </span>
                </div>
              </div>

              {/* Información del Plazo */}
              <div className="flex items-center gap-4 text-xs text-slate-600 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-slate-400" />
                  <span>Plazo: <strong>{project.estimated_days || 5} días</strong></span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                  <span>Profesional Asignado</span>
                </div>
              </div>

              {/* Descripción */}
              <p className="text-xs text-slate-600 line-clamp-2">
                {project.description}
              </p>

              {/* Acciones de seguimiento */}
              <div className="pt-4 border-t border-slate-100 flex items-center gap-3">
                <button
                  onClick={() => router.push("/dashboard/mensajes")}
                  className="flex-1 py-2.5 bg-slate-900 text-white rounded-xl font-semibold text-xs hover:bg-slate-800 transition flex items-center justify-center gap-2 shadow-sm"
                >
                  <MessageSquare className="w-4 h-4" /> Contactar Profesional
                </button>
                <button
                  onClick={() => router.push(`/dashboard/proyectos/${project.id}`)}
                  className="px-4 py-2.5 bg-slate-100 text-slate-700 rounded-xl font-semibold text-xs hover:bg-slate-200 transition flex items-center justify-center gap-1.5"
                >
                  <FileText className="w-4 h-4" /> Detalles
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}