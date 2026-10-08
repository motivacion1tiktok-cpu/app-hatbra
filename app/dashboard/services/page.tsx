'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { HardHat, Plus, MapPin, Euro, Calendar, Clock, CheckCircle2 } from 'lucide-react';

interface Project {
  id: string;
  title: string;
  category: string;
  budget_estimate: number | null;
  status: string;
  location: string | null;
  description: string;
  created_at: string;
}

export default function ServicesPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  const supabase = createClient();

  useEffect(() => {
    async function fetchProjects() {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        setProjects(data);
      }
      setLoading(false);
    }

    fetchProjects();
  }, []);

  return (
    <div className="max-w-5xl mx-auto space-y-6 p-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <HardHat className="w-7 h-7 text-slate-900" />
            Mis Solicitudes y Proyectos
          </h1>
          <p className="text-slate-500 text-sm">
            Gestiona el estado de tus obras publicadas y revisa presupuestos.
          </p>
        </div>

        <Link
          href="/dashboard/nuevo-proyecto"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 transition shadow-sm w-fit"
        >
          <Plus className="w-4 h-4" />
          Nueva Reforma
        </Link>
      </div>

      {loading ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center text-slate-400 text-sm shadow-sm">
          Cargando tus solicitudes de obra...
        </div>
      ) : projects.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center space-y-4 shadow-sm">
          <HardHat className="w-12 h-12 text-slate-300 mx-auto" />
          <div className="space-y-1">
            <h3 className="font-bold text-slate-800 text-base">No tienes ninguna obra publicada</h3>
            <p className="text-slate-500 text-xs">
              Publica tu primera solicitud para recibir presupuestos de profesionales.
            </p>
          </div>
          <Link
            href="/dashboard/nuevo-proyecto"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 transition"
          >
            <Plus className="w-4 h-4" />
            Publicar Reforma
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projects.map((project) => (
            <div
              key={project.id}
              className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4 hover:border-slate-300 transition flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 bg-slate-100 text-slate-700 rounded-full">
                    {project.category.replace('_', ' ')}
                  </span>
                  <span className="text-xs font-medium text-emerald-600 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {project.status === 'pendiente' ? 'Buscando Profesional' : project.status}
                  </span>
                </div>

                <h2 className="font-bold text-slate-900 text-base leading-snug">{project.title}</h2>
                <p className="text-slate-600 text-xs line-clamp-2 leading-relaxed">{project.description}</p>
              </div>

              <div className="pt-3 border-t border-slate-100 space-y-2 text-xs text-slate-500">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1 text-slate-600 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {project.location || 'Ubicación no especificada'}
                  </span>
                  {project.budget_estimate && (
                    <span className="font-bold text-slate-900 flex items-center gap-0.5">
                      <Euro className="w-3.5 h-3.5" />
                      {project.budget_estimate.toLocaleString('es-ES')} €
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="flex items-center gap-1 text-[11px] text-slate-400">
                    <Calendar className="w-3 h-3" />
                    {new Date(project.created_at).toLocaleDateString('es-ES')}
                  </span>
                  <Link
                    href="/dashboard/mensajes"
                    className="text-xs font-semibold text-slate-900 hover:underline flex items-center gap-1"
                  >
                    Contactar <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
