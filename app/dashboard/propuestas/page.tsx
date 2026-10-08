import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function PropuestasPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Propuestas y Presupuestos</h1>
          <p className="text-sm text-slate-500">
            Revisa las valoraciones generadas para tus proyectos.
          </p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-center py-12">
        <p className="text-sm text-slate-500">No hay propuestas registradas.</p>
      </div>
    </div>
  );
}
