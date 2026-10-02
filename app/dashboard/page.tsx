'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import {
  HardHat,
  Calculator,
  MessageSquare,
  Plus,
  ArrowRight,
  Euro,
  Clock,
  CheckCircle2,
  TrendingUp,
  Building2,
  AlertCircle,
} from 'lucide-react';

interface Project {
  id: string;
  title: string;
  category: string;
  budget_estimate: number | null;
  status: string;
  location: string | null;
  created_at: string;
}

export default function DashboardPage() {
  const [userName, setUserName] = useState<string>('Usuario');
  const [userRole, setUserRole] = useState<string>('client');
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const supabase = createClient();

  useEffect(() => {
    async function loadDashboardData() {
      setLoading(true);
      setFetchError(null);

      try {
        // 1. Obtener sesión de usuario
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError || !user) {
          setLoading(false);
          return;
        }

        // 2. Obtener perfil completo desde profiles
        const { data: profile } = await supabase
          .from('profiles')
          .select('full_name, role')
          .eq('id', user.id)
          .maybeSingle();

        if (profile) {
          if (profile.full_name) setUserName(profile.full_name);
          if (profile.role) setUserRole(profile.role);
        } else if (user.user_metadata?.full_name) {
          setUserName(user.user_metadata.full_name);
        }

        // 3. Consultar obras/proyectos
        const { data: projectsData, error: projectsError } = await supabase
          .from('requests')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(5);

        if (projectsError) {
          console.error('Error al consultar proyectos:', projectsError);
          setFetchError(projectsError.message);
        } else if (projectsData) {
          setProjects(projectsData);
        }
      } catch (err: any) {
        console.error('Error inesperado en Dashboard:', err);
        setFetchError('Ocurrió un error al cargar la información.');
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  const totalPresupuestado = projects.reduce(
    (sum, p) => sum + (p.budget_estimate || 0),
    0
  );

  return (
    <div className="max-w-6xl mx-auto space-y-8 p-4">
      {/* Saludo y Cabecera Naranja HATBRA */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 text-white p-6 md:p-8 rounded-3xl shadow-md relative overflow-hidden">
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-brand-500 text-xs font-medium">
            <Building2 className="w-3.5 h-3.5" /> Panel de Control HATBRA
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            ¡Hola, {userName}! 👋
          </h1>
          <p className="text-slate-300 text-xs md:text-sm max-w-xl">
            {userRole === 'professional' || userRole === 'owner'
              ? 'Gestiona las solicitudes de obras recibidas, envía presupuestos y atiende a los clientes en tiempo real.'
              : 'Gestiona tus solicitudes de reforma, realiza estimaciones de materiales y comunícate en tiempo real con los profesionales.'}
          </p>
        </div>

        <div className="relative z-10 flex flex-wrap gap-3">
          <Link
            href="/dashboard/nuevo-proyecto"
            className="flex items-center gap-2 px-4 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl text-xs transition shadow-sm"
          >
            <Plus className="w-4 h-4" /> Nueva Reforma
          </Link>
          <Link
            href="/dashboard/comparador"
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl text-xs transition border border-slate-700"
          >
            <Calculator className="w-4 h-4" /> Estimador
          </Link>
        </div>

        {/* Resplandor decorativo */}
        <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-brand-600/15 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Tarjetas de Estadísticas Rápidas */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Obras Solicitadas</span>
            <HardHat className="w-4 h-4 text-slate-700" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900">
            {loading ? '0' : projects.length}
          </div>
          <p className="text-[11px] text-slate-400">Proyectos activos o en revisión</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Presupuesto Estimado</span>
            <Euro className="w-4 h-4 text-brand-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900">
            {loading ? '0 €' : `${totalPresupuestado.toLocaleString('es-ES')} €`}
          </div>
          <p className="text-[11px] text-slate-400">Inversión total acumulada</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Respuestas / Mensajes</span>
            <MessageSquare className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900">Activo</div>
          <p className="text-[11px] text-slate-400">Canal directo de chat</p>
        </div>
      </div>

      {/* Secciones Principales */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Proyectos Recientes */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <HardHat className="w-5 h-5 text-slate-800" />
              Tus Obras Recientes
            </h2>
            <Link
              href="/dashboard/services"
              className="text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1"
            >
              Ver todas <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {loading ? (
            <div className="py-8 text-center text-xs text-slate-400">
              Cargando datos del panel...
            </div>
          ) : fetchError ? (
            <div className="py-6 px-4 bg-amber-50 border border-amber-200 rounded-xl text-center space-y-2">
              <AlertCircle className="w-5 h-5 text-amber-600 mx-auto" />
              <p className="text-xs text-amber-800 font-medium">
                No se pudieron cargar las solicitudes.
              </p>
              <p className="text-[11px] text-amber-600">{fetchError}</p>
            </div>
          ) : projects.length === 0 ? (
            <div className="py-8 text-center space-y-3 bg-slate-50 rounded-xl border border-dashed border-slate-200">
              <p className="text-xs text-slate-500">Aún no has publicado ninguna reforma.</p>
              <Link
                href="/dashboard/nuevo-proyecto"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-brand-600 text-white rounded-lg text-xs font-semibold hover:bg-brand-700 transition"
              >
                <Plus className="w-3.5 h-3.5" /> Solicitar primera reforma
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {projects.map((p) => (
                <div
                  key={p.id}
                  className="p-4 bg-slate-50 hover:bg-slate-100/80 border border-slate-200 rounded-xl transition flex items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-white border border-slate-200 text-slate-700 rounded-md">
                      {p.category || 'Reforma'}
                    </span>
                    <h3 className="font-bold text-slate-900 text-sm">{p.title}</h3>
                    <p className="text-[11px] text-slate-500 flex items-center gap-2">
                      <Clock className="w-3 h-3" />
                      {new Date(p.created_at).toLocaleDateString('es-ES')}
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="font-bold text-slate-900 text-sm">
                      {p.budget_estimate ? `${p.budget_estimate.toLocaleString('es-ES')} €` : 'N/A'}
                    </div>
                    <span className="text-[11px] font-medium text-brand-600 flex items-center gap-1 justify-end">
                      <CheckCircle2 className="w-3 h-3" /> Activo
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Herramientas Directas */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <h2 className="font-bold text-slate-900 text-base flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-slate-800" />
            Herramientas Directas
          </h2>

          <div className="space-y-3">
            <Link
              href="/dashboard/comparador"
              className="block p-4 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition space-y-1"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-slate-900 flex items-center gap-2">
                  <Calculator className="w-4 h-4 text-brand-600" />
                  Calculadora de Materiales
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </div>
              <p className="text-[11px] text-slate-500">
                Obtén el despiece de azulejos, sacos de mortero y pintura al instante.
              </p>
            </Link>

            <Link
              href="/dashboard/mensajes"
              className="block p-4 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition space-y-1"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-slate-900 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-blue-600" />
                  Chat en Tiempo Real
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </div>
              <p className="text-[11px] text-slate-500">
                Chatea directamente con los profesionales asignados a tu obra.
              </p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}