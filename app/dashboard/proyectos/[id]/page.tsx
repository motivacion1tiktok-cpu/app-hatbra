"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client"; // ✅ Cliente centralizado con contexto Auth / SSR

export default function ProyectoDetallePage() {
  const params = useParams();
  const router = useRouter();
  const [proyecto, setProyecto] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [presupuesto, setPresupuesto] = useState({
    monto: "",
    descripcion: "",
    tiempoDias: "",
  });
  const [enviando, setEnviando] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    async function cargarProyecto() {
      if (!params?.id) return;
      
      setLoading(true);
      const { data, error } = await supabase
        .from("requests")
        .select("*, profiles(full_name, email)")
        .eq("id", params.id)
        .single();

      if (error) {
        console.error("Error al cargar la solicitud:", error.message);
      } else {
        setProyecto(data);
      }
      setLoading(false);
    }

    cargarProyecto();
  }, [params?.id]);

  const handleSubmitPresupuesto = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnviando(true);

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      alert("Debes iniciar sesión para enviar un presupuesto.");
      setEnviando(false);
      return;
    }

    const { error } = await supabase.from("quotes").insert({
      request_id: params.id,
      professional_id: user.id,
      amount: parseFloat(presupuesto.monto),
      description: presupuesto.descripcion,
      estimated_days: parseInt(presupuesto.tiempoDias),
      status: "pending",
    });

    if (error) {
      alert(`Error al emitir el presupuesto: ${error.message}`);
    } else {
      alert("¡Presupuesto enviado con éxito!");
      router.push("/dashboard/proyectos");
    }
    setEnviando(false);
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Cargando detalles del proyecto...</div>;
  }

  if (!proyecto) {
    return <div className="p-8 text-center text-red-500">Proyecto no encontrado o no disponible.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{proyecto.title || "Solicitud de Reforma"}</h1>
        <p className="text-gray-600 mb-4">{proyecto.description}</p>
        <div className="flex gap-4 text-sm text-gray-500">
          <span>Categoría: <strong>{proyecto.category || "General"}</strong></span>
          <span>Estado: <strong>{proyecto.status}</strong></span>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <h2 className="text-xl font-semibold mb-4 text-gray-900">Enviar Propuesta / Presupuesto</h2>
        <form onSubmit={handleSubmitPresupuesto} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Monto (€)</label>
            <input
              type="number"
              required
              value={presupuesto.monto}
              onChange={(e) => setPresupuesto({ ...presupuesto, monto: e.target.value })}
              className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Ej: 1200"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tiempo estimado (Días)</label>
            <input
              type="number"
              required
              value={presupuesto.tiempoDias}
              onChange={(e) => setPresupuesto({ ...presupuesto, tiempoDias: e.target.value })}
              className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Ej: 5"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Detalles de la propuesta</label>
            <textarea
              required
              rows={4}
              value={presupuesto.descripcion}
              onChange={(e) => setPresupuesto({ ...presupuesto, descripcion: e.target.value })}
              className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Describe los materiales, plazos de ejecución y condiciones..."
            />
          </div>

          <button
            type="submit"
            disabled={enviando}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition-colors"
          >
            {enviando ? "Enviando presupuesto..." : "Emitir Presupuesto"}
          </button>
        </form>
      </div>
    </div>
  );
}