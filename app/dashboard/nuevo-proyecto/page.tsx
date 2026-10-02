'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { HardHat, Send, MapPin, Euro, FileText, CheckCircle2 } from 'lucide-react';

export default function NuevoProyectoPage() {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('bano');
  const [budgetEstimate, setBudgetEstimate] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const router = useRouter();
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      alert('Debes estar autenticado para crear un proyecto.');
      setLoading(false);
      return;
    }

    const { error } = await supabase.from('projects').insert([
      {
        user_id: user.id,
        title,
        category,
        budget_estimate: budgetEstimate ? parseFloat(budgetEstimate) : null,
        location,
        description,
      },
    ]);

    setLoading(false);

    if (error) {
      console.error('Error al crear el proyecto:', error.message);
      alert('Hubo un error al guardar el proyecto. Inténtalo de nuevo.');
    } else {
      setSubmitted(true);
      setTimeout(() => {
        router.push('/dashboard/services');
      }, 2000);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 p-4">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <HardHat className="w-7 h-7 text-slate-900" />
          Publicar Nueva Reforma u Obra
        </h1>
        <p className="text-slate-500 text-sm">
          Describe tu proyecto para recibir propuestas y presupuestos de profesionales certificados.
        </p>
      </div>

      {submitted ? (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl p-8 text-center space-y-3">
          <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto animate-bounce" />
          <h2 className="text-xl font-bold">¡Proyecto Publicado con Éxito!</h2>
          <p className="text-sm text-emerald-700">
            Redirigiendo al panel de proyectos...
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-5">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">Título de la Obra / Reforma</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ej. Reforma integral de cuarto de baño principal"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 transition"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Categoría</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-slate-900 transition"
              >
                <option value="bano">Cuarto de Baño</option>
                <option value="cocina">Cocina</option>
                <option value="fontaneria">Fontanería e Instalaciones</option>
                <option value="electricidad">Electricidad</option>
                <option value="reforma_integral">Reforma Integral</option>
                <option value="pintura_placa">Pintura y Placa de Yeso (Drywall)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                <Euro className="w-3.5 h-3.5" /> Presupuesto Estimado (€)
              </label>
              <input
                type="number"
                value={budgetEstimate}
                onChange={(e) => setBudgetEstimate(e.target.value)}
                placeholder="Ej. 3500"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 transition"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" /> Ubicación de la Obra
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Ej. Santa Cruz de Tenerife, Tenerife"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 transition"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
              <FileText className="w-3.5 h-3.5" /> Detalles y Descripción del Trabajo
            </label>
            <textarea
              rows={4}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe los materiales deseados, plazos o detalles específicos de la obra..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 transition"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white font-semibold text-sm rounded-xl hover:bg-slate-800 transition disabled:opacity-50 shadow-sm"
            >
              {loading ? 'Publicando...' : 'Publicar Solicitud'}
              <Send className="w-4 h-4" />
            </button>
          </div>
        </form>
      )}
    </div>
  );
}