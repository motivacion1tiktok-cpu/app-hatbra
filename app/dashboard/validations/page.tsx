'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Clock,
  UserCheck,
  Building2,
  AlertCircle,
  Search,
} from 'lucide-react';

interface ProfessionalProfile {
  id: string;
  full_name: string | null;
  role: string;
  created_at: string;
  is_verified?: boolean | null;
}

export default function ValidationsPage() {
  const [professionals, setProfessionals] = useState<ProfessionalProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  const supabase = createClient();

  async function loadProfessionals() {
    setLoading(true);
    setErrorMsg(null);

    try {
      // Consultar perfiles de tipo 'professional'
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, role, created_at, is_verified')
        .eq('role', 'professional')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error al cargar profesionales:', error);
        setErrorMsg(error.message);
      } else if (data) {
        setProfessionals(data);
      }
    } catch (err: any) {
      console.error('Error inesperado:', err);
      setErrorMsg('No se pudieron cargar las solicitudes de profesionales.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProfessionals();
  }, []);

  // Función para aprobar/verificar profesional
  async function handleApprove(id: string) {
    setActionLoadingId(id);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ is_verified: true })
        .eq('id', id);

      if (error) {
        alert(`Error al aprobar profesional: ${error.message}`);
      } else {
        // Actualizar estado local
        setProfessionals((prev) =>
          prev.map((p) => (p.id === id ? { ...p, is_verified: true } : p))
        );
      }
    } catch (err: any) {
      alert('Error al realizar la actualización.');
    } finally {
      setActionLoadingId(null);
    }
  }

  // Función para revocar/rechazar
  async function handleReject(id: string) {
    setActionLoadingId(id);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ is_verified: false })
        .eq('id', id);

      if (error) {
        alert(`Error al cambiar estado: ${error.message}`);
      } else {
        setProfessionals((prev) =>
          prev.map((p) => (p.id === id ? { ...p, is_verified: false } : p))
        );
      }
    } catch (err: any) {
      alert('Error al realizar la actualización.');
    } finally {
      setActionLoadingId(null);
    }
  }

  const filteredProfessionals = professionals.filter((p) =>
    (p.full_name || 'Profesional sin nombre')
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const pendingCount = professionals.filter((p) => !p.is_verified).length;
  const verifiedCount = professionals.filter((p) => p.is_verified).length;

  return (
    <div className="max-w-6xl mx-auto space-y-8 p-4">
      {/* Cabecera de Gobernanza */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 text-white p-6 md:p-8 rounded-3xl shadow-md relative overflow-hidden">
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-brand-500 text-xs font-medium">
            <ShieldCheck className="w-3.5 h-3.5" /> Módulo de Administración
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            Validación de Profesionales 👷‍♂️️
          </h1>
          <p className="text-slate-300 text-xs md:text-sm max-w-xl">
            Revisa y aprueba las cuentas de empresas y profesionales autónomos para autorizar su acceso a responder solicitudes de reformas.
          </p>
        </div>

        {/* Resplandor decorativo */}
        <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-brand-600/15 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Tarjetas Resumen */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Pendientes de Revisión</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900">
            {loading ? '-' : pendingCount}
          </div>
          <p className="text-[11px] text-slate-400">Requieren aprobación del Owner</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Profesionales Verificados</span>
            <UserCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900">
            {loading ? '-' : verifiedCount}
          </div>
          <p className="text-[11px] text-slate-400">Listos para emitir presupuestos</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Total Registrados</span>
            <Building2 className="w-4 h-4 text-brand-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900">
            {loading ? '-' : professionals.length}
          </div>
          <p className="text-[11px] text-slate-400">Cuentas con rol professional</p>
        </div>
      </div>

      {/* Lista y Buscador */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h2 className="font-bold text-slate-900 text-base">
            Solicitudes de Profesionales
          </h2>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar por nombre..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-600"
            />
          </div>
        </div>

        {loading ? (
          <div className="py-12 text-center text-xs text-slate-400">
            Cargando lista de profesionales...
          </div>
        ) : errorMsg ? (
          <div className="py-6 px-4 bg-amber-50 border border-amber-200 rounded-xl text-center space-y-2">
            <AlertCircle className="w-5 h-5 text-amber-600 mx-auto" />
            <p className="text-xs text-amber-800 font-medium">
              Ocurrió un problema al cargar los profesionales.
            </p>
            <p className="text-[11px] text-amber-600">{errorMsg}</p>
          </div>
        ) : filteredProfessionals.length === 0 ? (
          <div className="py-12 text-center space-y-2 bg-slate-50 rounded-xl border border-dashed border-slate-200">
            <p className="text-xs font-medium text-slate-600">
              No se encontraron cuentas de profesionales.
            </p>
            <p className="text-[11px] text-slate-400">
              Las nuevas altas con rol 'professional' aparecerán listadas en esta sección.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredProfessionals.map((pro) => (
              <div
                key={pro.id}
                className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition hover:bg-slate-50/50 px-2 rounded-xl"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm">
                      {pro.full_name || 'Sin Nombre Registrado'}
                    </span>
                    {pro.is_verified ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
                        <CheckCircle2 className="w-3 h-3" /> Verificado
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-bold">
                        <Clock className="w-3 h-3" /> Pendiente
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400">
                    ID: {pro.id} • Alta: {new Date(pro.created_at).toLocaleDateString('es-ES')}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {!pro.is_verified ? (
                    <button
                      onClick={() => handleApprove(pro.id)}
                      disabled={actionLoadingId === pro.id}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold transition shadow-sm disabled:opacity-50"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {actionLoadingId === pro.id ? 'Aprobando...' : 'Aprobar'}
                    </button>
                  ) : (
                    <button
                      onClick={() => handleReject(pro.id)}
                      disabled={actionLoadingId === pro.id}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 rounded-xl text-xs font-semibold transition disabled:opacity-50"
                    >
                      <XCircle className="w-3.5 h-3.5 text-slate-500" />
                      {actionLoadingId === pro.id ? 'Actualizando...' : 'Revocar'}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}