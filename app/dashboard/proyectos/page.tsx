import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { FolderKanban, Clock, Building2 } from "lucide-react";

interface ProjectItem {
  id: string;
  title: string;
  description?: string;
  status: string;
  created_at: string;
}

// Función para capitalizar y formatear caracteres en español (ej. bano -> Baño)
function fixSpanishText(text: string): string {
  if (!text) return "";
  return text
    .replace(/\bbano\b/gi, "baño")
    .replace(/\breforma de bano\b/gi, "Reforma de Baño");
}

export default async function ProyectosPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: projectsData, error } = await supabase
    .from("projects")
    .select("id, title, description, status, created_at")
    .order("created_at", { ascending: false });

  const projects = (projectsData as ProjectItem[]) || [];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          Proyectos en Curso 🏗️
        </h1>
        <p className="text-xs text-slate-500">
          Supervisa el estado, los hitos de ejecución y la comunicación de tus reformas activas.
        </p>
      </div>

      {error ? (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-xs rounded-2xl">
          No se pudieron cargar los proyectos activos: {error.message}
        </div>
      ) : projects.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-3 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
            <FolderKanban className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-sm text-slate-800">No hay proyectos en ejecución</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Acepta una propuesta en el Comparador de Presupuestos para iniciar el seguimiento de tu obra.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projects.map((proj) => (
            <div
              key={proj.id}
              className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-3 hover:border-slate-300 transition"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="space-y-1">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[10px] font-bold rounded-full bg-emerald-100 text-emerald-800 uppercase tracking-wider">
                    {proj.status}
                  </span>
                  <h2 className="font-bold text-sm text-slate-900 pt-1 capitalize">
                    {fixSpanishText(proj.title)}
                  </h2>
                </div>
                <div className="p-2 rounded-xl bg-slate-50 text-slate-400">
                  <Building2 className="w-4 h-4" />
                </div>
              </div>

              {proj.description && (
                <p className="text-xs text-slate-500 line-clamp-2 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                  {fixSpanishText(proj.description)}
                </p>
              )}

              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-100">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {new Date(proj.created_at).toLocaleDateString("es-ES")}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}