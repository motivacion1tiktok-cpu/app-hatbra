import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function AdminConfiguracionPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Configuración de Administración</h1>
        <p className="text-sm text-slate-500">
          Parámetros del sistema y permisos globales de la aplicación.
        </p>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <h2 className="text-sm font-bold text-slate-800">Ajustes Generales</h2>
        <div className="flex items-center justify-between py-2 border-b border-slate-100">
          <span className="text-xs text-slate-600">Modo Mantenimiento</span>
          <span className="text-xs font-semibold text-slate-400">Desactivado</span>
        </div>
      </div>
    </div>
  );
}