"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { 
  Building2, 
  Wrench, 
  Paintbrush, 
  Zap, 
  Droplet, 
  ArrowRight, 
  ArrowLeft, 
  Loader2, 
  CheckCircle2 
} from "lucide-react";
import { createRequest } from "./actions";

const CATEGORIES = [
  { id: "baño", name: "Reforma de Baño", icon: Droplet, desc: "Cambio de plato de ducha, alicatados, fontanería" },
  { id: "cocina", name: "Reforma de Cocina", icon: Wrench, desc: "Mobiliario, encimeras, alicatado y fontanería" },
  { id: "integral", name: "Reforma Integral", icon: Building2, desc: "Reforma completa de vivienda o local" },
  { id: "pintura", name: "Pintura y Acabados", icon: Paintbrush, desc: "Alisado de paredes, pintura interior/exterior" },
  { id: "electricidad", name: "Electricidad y Iluminación", icon: Zap, desc: "Instalación eléctrica, cuadro y mecanismos" },
];

export function WizardForm() {
  const [step, setStep] = useState(1);
  const [category, setCategory] = useState("baño");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [budget, setBudget] = useState("");
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [completed, setCompleted] = useState(false);
  const router = useRouter();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    startTransition(async () => {
      const res = await createRequest({
        title,
        category,
        description,
        estimatedBudget: budget ? parseFloat(budget) : undefined,
      });

      if (!res.ok) {
        setError(res.error ?? "No se pudo publicar la solicitud.");
        return;
      }

      setCompleted(true);
      setTimeout(() => {
        router.push("/dashboard/comparador");
      }, 1500);
    });
  }

  if (completed) {
    return (
      <div className="bg-white border border-slate-200 rounded-3xl p-8 text-center space-y-4 shadow-sm">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-extrabold text-slate-900">¡Solicitud Publicada con Éxito!</h2>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          Tu proyecto ya está visible para los profesionales. Redirigiendo al Comparador de Presupuestos...
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
      {/* Indicador de pasos */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div className="flex items-center gap-2">
          <span className={`w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center ${step === 1 ? "bg-brand-600 text-white" : "bg-slate-100 text-slate-600"}`}>
            1
          </span>
          <span className="text-xs font-bold text-slate-700">Tipo de Obra</span>
        </div>
        <div className="h-0.5 w-12 bg-slate-100" />
        <div className="flex items-center gap-2">
          <span className={`w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center ${step === 2 ? "bg-brand-600 text-white" : "bg-slate-100 text-slate-600"}`}>
            2
          </span>
          <span className="text-xs font-bold text-slate-700">Detalles del Proyecto</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {step === 1 && (
          <div className="space-y-4">
            <h2 className="text-base font-bold text-slate-900">Selecciona el tipo de trabajo</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                const selected = category === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategory(cat.id)}
                    className={`p-4 rounded-2xl border text-left transition flex items-start gap-3 ${
                      selected
                        ? "border-brand-600 bg-brand-50/50 text-brand-900 shadow-sm"
                        : "border-slate-200 hover:border-slate-300 bg-white"
                    }`}
                  >
                    <div className={`p-2 rounded-xl ${selected ? "bg-brand-600 text-white" : "bg-slate-100 text-slate-600"}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-xs text-slate-900">{cat.name}</h3>
                      <p className="text-[11px] text-slate-500 mt-0.5">{cat.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="pt-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">Título de la Obra</label>
              <input
                type="text"
                required
                placeholder="Ej. Reforma integral de baño principal"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-brand-600"
              />
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                disabled={!title.trim()}
                onClick={() => setStep(2)}
                className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs py-2.5 px-5 rounded-xl transition disabled:opacity-50"
              >
                Siguiente <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Descripción detallada de la obra</label>
              <textarea
                rows={4}
                required
                placeholder="Describe qué cambios necesitas, medidas aproximadas, si aportas materiales o prefieres mano de obra completa..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-brand-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Presupuesto aproximado (Opcional en €)</label>
              <input
                type="number"
                placeholder="Ej. 2500"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-brand-600"
              />
            </div>

            {error && <p className="text-xs text-red-600">{error}</p>}

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800"
              >
                <ArrowLeft className="w-4 h-4" /> Volver
              </button>
              <button
                type="submit"
                disabled={pending || !description.trim()}
                className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs py-2.5 px-5 rounded-xl transition disabled:opacity-50"
              >
                {pending && <Loader2 className="w-4 h-4 animate-spin" />}
                {pending ? "Publicando..." : "Publicar Solicitud"}
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}