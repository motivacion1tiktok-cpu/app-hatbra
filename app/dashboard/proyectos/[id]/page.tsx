"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import {
  ArrowLeft,
  Clock,
  CheckCircle2,
  Circle,
  AlertCircle,
  MessageSquare,
  FileText,
  DollarSign,
  Calendar,
  Building2,
  ShieldCheck,
} from "lucide-react";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface ProjectDetail {
  id: string;
  total_amount: number;
  estimated_days?: number;
  description: string;
  status: string;
  created_at: string;
}

interface Milestone {
  id: string;
  title: string;
  description: string;
  status: "completed" | "in_progress" | "pending";
}

export default function DetalleProyectoPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;

  const [project, setProject] = useState<ProjectDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Fases e hitos de la obra
  const [milestones] = useState<Milestone[]>([
    {
      id: "1",
      title: "1. Demolición y Preparación",
      description: "Retirada de sanitarios antiguos, azulejos y desescombrado.",
      status: "completed",
    },
    {
      id: "2",
      title: "2. Fontanería e Instalaciones",
      description: "Instalación de tuberías de agua fría/caliente y desagües nuevos.",
      status: "in_progress",
    },
    {
      id: "3",
      title: "3. Alicatado y Solado",
      description: "Colocación de gresite/cerámica en paredes y suelo.",
      status: "pending",
    },
    {
      id: "4",
      title: "4. Montaje de Sanitarios y Remates",
      description: "Instalación de mampara, plato de ducha de resina y grifería.",
      status: "pending",
    },
  ]);

  useEffect(() => {
    async function fetchProject() {
      try {
        setLoading(true);
        setErrorMsg(null);

        const { data, error } = await supabase
          .from("quotes")
          .select("*")
          .eq("id", projectId)
          .single();

        if (error) throw error;
        setProject(data as ProjectDetail);
      } catch (err: any) {
        console.error("Error al cargar detalle del proyecto:", err);
        setErrorMsg(`No se pudo obtener el detalle de la obra: ${err.message}`);
      } finally {
        setLoading(false);
      }
    }

    if (projectId) {
      fetchProject();
    }
  }, [projectId]);

  const completedCount = milestones.filter((m) => m.status === "completed").length;
  const progressPercent = Math.round((completedCount / milestones.length) * 100);

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Botón Volver */}
      <button
        onClick={() => router.push("/dashboard/proyectos")}
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3.5 py-2 rounded-xl transition"
      >
        <ArrowLeft className="w-4 h-4" /> Volver a Proyectos
      </button>

      {errorMsg && (
        <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl text-sm">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p>{errorMsg}</p>
        </div>
      )}

      {loading ? (
        <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm animate-pulse space-y-6">
          <div className="h-6 bg-slate-200 rounded w-1/3" />
          <div className="h-4 bg-slate-100 rounded w-1/2" />
          <div className="h-24 bg-slate-100 rounded-2xl w-full" />
        </div>
      ) : !project ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/60 shadow-sm space-y-3">
          <AlertCircle className="w-10 h-10 text-amber-500 mx-auto" />
          <h3 className="text-base font-semibold text-slate-800">Proyecto no encontrado</h3>
          <p className="text-sm text-slate-400">
            El identificador proporcionado no corresponde a ninguna obra activa.
          </p>
        </div>
      ) : (
        <>
          {/* Header del Proyecto */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-full">
                  En Ejecución
                </span>
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  Inicio: {new Date(project.created_at).toLocaleDateString("es-ES")}
                </span>
              </div>
              <h1 className="text-2xl font-bold text-slate-900">Reforma Integral de Baño</h1>
              <p className="text-xs text-slate-500 flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-slate-400" />
                Profesional HATBRA Asignado
              </p>
            </div>

            <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100 self-start md:self-auto">
              <div>
                <span className="text-xs text-slate-400 block">Presupuesto Aceptado</span>
                <span className="text-2xl font-extrabold text-slate-900">
                  {project.total_amount.toLocaleString("es-ES", { minimumFractionDigits: 2 })} €
                </span>
              </div>
              <div className="h-8 w-px bg-slate-200" />
              <div>
                <span className="text-xs text-slate-400 block">Plazo Estimado</span>
                <span className="text-sm font-semibold text-slate-700 flex items-center gap-1">
                  <Clock className="w-4 h-4 text-slate-400" />
                  {project.estimated_days || 5} días
                </span>
              </div>
            </div>
          </div>

          {/* Barra de Progreso */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-3">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-slate-700">Progreso de la Obra</span>
              <span className="text-emerald-600">{progressPercent}% Completado</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
              <div
                className="bg-emerald-500 h-3 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Cuadrícula Principal */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Fases de la Obra */}
            <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-6">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-slate-700" />
                Fases e Hitos de Ejecución
              </h2>

              <div className="space-y-4">
                {milestones.map((m) => (
                  <div
                    key={m.id}
                    className={`p-4 rounded-2xl border transition-all ${
                      m.status === "completed"
                        ? "bg-emerald-50/40 border-emerald-200"
                        : m.status === "in_progress"
                        ? "bg-blue-50/40 border-blue-200"
                        : "bg-slate-50/50 border-slate-100"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        {m.status === "completed" ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                        ) : m.status === "in_progress" ? (
                          <Clock className="w-5 h-5 text-blue-600 animate-spin shrink-0 mt-0.5" />
                        ) : (
                          <Circle className="w-5 h-5 text-slate-300 shrink-0 mt-0.5" />
                        )}

                        <div>
                          <h3 className="text-sm font-bold text-slate-900">{m.title}</h3>
                          <p className="text-xs text-slate-600 mt-0.5">{m.description}</p>
                        </div>
                      </div>

                      <span
                        className={`text-[11px] font-semibold px-2.5 py-1 rounded-full shrink-0 ${
                          m.status === "completed"
                            ? "bg-emerald-100 text-emerald-800"
                            : m.status === "in_progress"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-slate-200 text-slate-600"
                        }`}
                      >
                        {m.status === "completed"
                          ? "Completado"
                          : m.status === "in_progress"
                          ? "En Proceso"
                          : "Pendiente"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Panel Lateral */}
            <div className="space-y-6">
              <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
                <h3 className="text-sm font-bold text-slate-900">Comunicación y Archivos</h3>
                <button
                  onClick={() => router.push("/dashboard/mensajes")}
                  className="w-full py-3 bg-slate-900 text-white rounded-xl font-semibold text-xs hover:bg-slate-800 transition flex items-center justify-center gap-2 shadow-sm"
                >
                  <MessageSquare className="w-4 h-4" /> Abrir Chat de la Obra
                </button>
                <button
                  onClick={() => alert("Descargando copia en PDF del presupuesto...")}
                  className="w-full py-3 bg-slate-100 text-slate-700 rounded-xl font-semibold text-xs hover:bg-slate-200 transition flex items-center justify-center gap-2"
                >
                  <FileText className="w-4 h-4" /> Ver Presupuesto Firmado
                </button>
              </div>

              <div className="bg-emerald-950 text-emerald-50 rounded-3xl p-6 space-y-3">
                <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs">
                  <DollarSign className="w-4 h-4" /> Pago Protegido HATBRA
                </div>
                <h4 className="text-sm font-bold">Depósito de Garantía Activo</h4>
                <p className="text-xs text-emerald-200/80 leading-relaxed">
                  Los fondos permanecen retenidos de forma segura y se liberan tras la aprobación de cada fase.
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}