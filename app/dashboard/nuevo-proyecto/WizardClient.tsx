"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { CategoryOption } from "./page";
import { Building2, ArrowRight, ArrowLeft, CheckCircle2 } from "lucide-react";

interface WizardClientProps {
  categories: CategoryOption[];
}

export function WizardClient({ categories }: WizardClientProps) {
  const router = useRouter();
  const supabase = createClient();

  const [step, setStep] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState(categories[0]?.name || "");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleNext = () => {
    if (step === 1 && !selectedCategory) return;
    if (step === 2 && (!title.trim() || !description.trim())) {
      setErrorMsg("Por favor, completa el título y la descripción.");
      return;
    }
    setErrorMsg(null);
    setStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setErrorMsg(null);
    setStep((prev) => prev - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      setErrorMsg("Sesión expirada. Por favor, inicia sesión de nuevo.");
      setLoading(false);
      return;
    }

    const { error } = await supabase.from("requests").insert([
      {
        client_id: user.id,
        category: selectedCategory,
        title,
        description,
        status: "open",
      },
    ]);

    if (error) {
      setErrorMsg(`Error al publicar la solicitud: ${error.message}`);
      setLoading(false);
    } else {
      router.push("/dashboard/proyectos");
      router.refresh();
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Nueva Solicitud de Reforma 🏗️️
        </h1>
        <p className="text-xs text-slate-500">
          Publica los detalles de tu proyecto para recibir presupuestos de profesionales verificados.
        </p>
      </div>

      <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        {/* Indicador de pasos */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 text-xs font-bold text-slate-400">
          <span className={step >= 1 ? "text-brand-600" : ""}>1. Categoría</span>
          <span className={step >= 2 ? "text-brand-600" : ""}>2. Detalles</span>
          <span className={step >= 3 ? "text-brand-600" : ""}>3. Confirmación</span>
        </div>

        {errorMsg && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-xs rounded-2xl">
            {errorMsg}
          </div>
        )}

        {/* Paso 1: Selección de categoría desde BD */}
        {step === 1 && (
          <div className="space-y-4">
            <h2 className="font-extrabold text-slate-900 text-sm">Selecciona la especialidad de tu obra</h2>
            <div className="grid grid-cols-1 gap-3">
              {categories.map((cat) => (
                <button
                  key={cat.name}
                  type="button"
                  onClick={() => setSelectedCategory(cat.name)}
                  className={`p-4 rounded-2xl border text-left transition flex items-start justify-between ${
                    selectedCategory === cat.name
                      ? "border-brand-600 bg-brand-50/50 ring-1 ring-brand-600"
                      : "border-slate-200 hover:border-slate-300 bg-white"
                  }`}
                >
                  <div className="space-y-1">
                    <p className="font-bold text-xs text-slate-900">{cat.name}</p>
                    {cat.description && (
                      <p className="text-[11px] text-slate-500">{cat.description}</p>
                    )}
                  </div>
                  {selectedCategory === cat.name && (
                    <CheckCircle2 className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
                  )}
                </button>
              ))}
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="button"
                onClick={handleNext}
                className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs px-5 py-3 rounded-2xl transition"
              >
                Siguiente <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Paso 2: Detalles de la obra */}
        {step === 2 && (
          <div className="space-y-4">
            <h2 className="font-extrabold text-slate-900 text-sm">Describe las características del trabajo</h2>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Título corto</label>
                <input
                  type="text"
                  placeholder="Ej: Reforma integral de baño principal"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-brand-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Descripción detallada</label>
                <textarea
                  rows={4}
                  placeholder="Describe las medidas aproximadas, materiales requeridos y cualquier detalle importante..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-brand-600"
                />
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between">
              <button
                type="button"
                onClick={handleBack}
                className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 font-bold text-xs px-4 py-2.5 transition"
              >
                <ArrowLeft className="w-4 h-4" /> Anterior
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs px-5 py-3 rounded-2xl transition"
              >
                Revisar Solicitud <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Paso 3: Confirmación y envío */}
        {step === 3 && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <h2 className="font-extrabold text-slate-900 text-sm">Resumen de la solicitud</h2>
            
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-2 text-xs">
              <div>
                <span className="font-bold text-slate-500">Categoría:</span>
                <p className="font-extrabold text-slate-900">{selectedCategory}</p>
              </div>
              <div>
                <span className="font-bold text-slate-500">Título:</span>
                <p className="font-extrabold text-slate-900">{title}</p>
              </div>
              <div>
                <span className="font-bold text-slate-500">Descripción:</span>
                <p className="text-slate-700 mt-0.5">{description}</p>
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between">
              <button
                type="button"
                onClick={handleBack}
                disabled={loading}
                className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 font-bold text-xs px-4 py-2.5 transition"
              >
                <ArrowLeft className="w-4 h-4" /> Anterior
              </button>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 disabled:bg-brand-300 text-white font-bold text-xs px-6 py-3 rounded-2xl transition"
              >
                {loading ? "Publicando..." : "Confirmar y Publicar Solicitud"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}