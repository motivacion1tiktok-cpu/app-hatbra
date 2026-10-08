import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function NuevaPropuestaPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Generar Propuesta</h1>
        <p className="text-sm text-slate-500">
          Crea una nueva estimación detallada para un cliente.
        </p>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Monto Estimado (€)
          </label>
          <input
            type="number"
            placeholder="0.00"
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-slate-900/10"
          />
        </div>

        <button
          type="button"
          className="w-full py-3 bg-slate-900 text-white font-medium text-xs rounded-xl hover:bg-slate-800 transition"
        >
          Enviar Propuesta
        </button>
      </div>
    </div>
  );
}
