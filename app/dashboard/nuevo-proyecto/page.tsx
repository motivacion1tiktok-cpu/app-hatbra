'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import {
  FolderPlus,
  Send,
  Building2,
  Euro,
  FileText,
  MapPin,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';

export default function NuevoProyectoPage() {
  const router = useRouter();
  const supabase = createClient();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Reforma Integral');
  const [location, setLocation] = useState('');
  const [budget, setBudget] = useState('');
  const [description, setDescription] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg(null);

    try {
      // 1. Obtener sesión activa para capturar el client_id
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        throw new Error('Debes iniciar sesión para publicar una solicitud.');
      }

      // 2. Insertar en la tabla public.requests
      const { error: insertError } = await supabase.from('requests').insert({
        client_id: user.id,
        title: title.trim(),
        category,
        location: location.trim(),
        budget_estimated: budget ? parseFloat(budget) : null,
        description: description.trim(),
        status: 'open',
      });

      if (insertError) {
        throw new Error(insertError.message);
      }

      setSuccess(true);
      setTimeout(() => {
        router.push('/dashboard/requests');
      }, 1500);
    } catch (err: any) {
      console.error('Error al crear proyecto:', err);
      setErrorMsg(err.message || 'Ocurrió un error inesperado al enviar la solicitud.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 p-4">
      {/* Cabecera */}
      <div className="bg-slate-900 text-white p-6 md:p-8 rounded-3xl shadow-md relative overflow-hidden">
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-amber-500 text-xs font-medium">
            <FolderPlus className="w-3.5 h-3.5 text-amber-500" /> Solicitud de Reforma
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            Publicar Nuevo Proyecto 🏗️
          </h1>
          <p className="text-slate-300 text-xs md:text-sm max-w-xl">
            Describe los detalles de la obra o reforma que deseas realizar. Los profesionales homologados por HATBRA evaluarán tu solicitud y te enviarán sus propuestas.
          </p>
        </div>
        <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Formulario */}
      <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-sm space-y-6">
        {errorMsg && (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-3 text-xs text-rose-800 font-medium">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {success && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3 text-xs text-emerald-800 font-medium">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>¡Proyecto publicado con éxito! Redirigiendo a tus solicitudes...</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Título */}
          <div className="space-y-2 md:col-span-2">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-slate-400" />
              Título del Proyecto *
            </label>
            <input
              type="text"
              required
              placeholder="Ej: Reforma integral de baño principal y cambio de fontanería"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2.5 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600"
            />
          </div>

          {/* Categoría */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-slate-400" />
              Categoría
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2.5 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 bg-white"
            >
              <option value="Reforma Integral">Reforma Integral</option>
              <option value="Baños">Baños</option>
              <option value="Cocinas">Cocinas</option>
              <option value="Fontanería">Fontanería</option>
              <option value="Electricidad">Electricidad</option>
              <option value="Pintura y Acabados">Pintura y Acabados</option>
              <option value="Albañilería y Pladur">Albañilería y Pladur</option>
            </select>
          </div>

          {/* Ubicación */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              Ubicación / Municipio *
            </label>
            <input
              type="text"
              required
              placeholder="Ej: Santa Cruz de Tenerife"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-4 py-2.5 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600"
            />
          </div>

          {/* Presupuesto Estimado */}
          <div className="space-y-2 md:col-span-2">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Euro className="w-3.5 h-3.5 text-slate-400" />
              Presupuesto Máximo Estimado (€)
            </label>
            <input
              type="number"
              min="0"
              step="100"
              placeholder="Ej: 4500 (Opcional)"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              className="w-full px-4 py-2.5 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600"
            />
          </div>

          {/* Descripción detallada */}
          <div className="space-y-2 md:col-span-2">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-slate-400" />
              Descripción Detallada de los Trabajos *
            </label>
            <textarea
              required
              rows={5}
              placeholder="Detalla las medidas, materiales preferidos o requisitos especiales para que los profesionales preparen un presupuesto ajustado..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2.5 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 resize-none"
            />
          </div>
        </div>

        {/* Botón Acción */}
        <div className="flex justify-end pt-4 border-t border-slate-100">
          <button
            type="submit"
            disabled={submitting || success}
            className="flex items-center gap-2 px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition shadow-sm disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
            {submitting ? 'Publicando...' : 'Publicar Solicitud'}
          </button>
        </div>
      </form>
    </div>
  );
}