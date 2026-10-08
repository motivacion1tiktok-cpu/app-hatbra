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
  RefreshCw,
  Ban,
} from 'lucide-react';

export type VerificationStatus = 'pending' | 'verified' | 'rejected';

interface ProfessionalProfile {
  id: string;
  full_name: string | null;
  email: string | null;
  role: string;
  created_at: string;
  verification_status: VerificationStatus;
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
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, email, role, created_at, verification_status')
        .eq('role', 'professional')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error al cargar profesionales:', error);
        setErrorMsg(error.message);
      } else if (data) {
        setProfessionals(data as ProfessionalProfile[]);
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

  async function handleStatusChange(id: string, newStatus: VerificationStatus) {
    setActionLoadingId(id);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ verification_status: newStatus })
        .eq('id', id);

      if (error) {
        alert(`Error al cambiar estado: ${error.message}`);
      } else {
        setProfessionals((prev) =>
          prev.map((p) => (p.id === id ? { ...p, verification_status: newStatus } : p))
        );
      }
    } catch (err: any) {
      alert('Error al realizar la actualización.');
    } finally {
      setActionLoadingId(null);
    }
  }

  const filteredProfessionals = professionals.filter((p) => {
    const term = searchTerm.toLowerCase();
    const nameMatch = (p.full_name || '').toLowerCase().includes(term);
    const emailMatch = (p.email || '').toLowerCase().includes(term);
    return nameMatch || emailMatch;
  });

  const pendingCount = professionals.filter((p) => p.verification_status === 'pending').length;
  const verifiedCount = professionals.filter((p) => p.verification_status === 'verified').length;
  const rejectedCount = professionals.filter((p) => p.verification_status === 'rejected').length;

  return (
    <div className="max-w-6xl mx-auto space-y-8 p-4">
      {/* Cabecera de Gobernanza */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 text-white p-6 md:p-8 rounded-3xl shadow-md relative overflow-hidden">
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-brand-500 text-xs font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-500" /> Módulo de Gobernanza
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            Validación de Profesionales 👷‍♂️
          </h1>
          <p className="text-slate-300 text-xs md:text-sm max-w-xl">
            Gestiona el estado de homologación de las empresas y profesionales autónomos para autorizar su acceso a responder solicitudes de presupuestos.
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-2">
          <button
            onClick={loadProfessionals}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-xs font-semibold transition text-slate-200"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Actualizar
          </button>
        </div>

        {/* Resplandor decorativo */}
        <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Tarjetas Resumen */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Pendientes</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900">
            {loading ? '-' : pendingCount}
          </div>
          <p className="text-[11px] text-slate-400">En espera de decisión</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Verificados</span>
            <UserCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900">
            {loading ? '-' : verifiedCount}
          </div>
          <p className="text-[11px] text-slate-400">Autorizados para cotizar</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Rechazados</span>
            <Ban className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900">
            {loading ? '-' : rejectedCount}
          </div>
          <p className="text-[11px] text-slate-400">Acceso bloqueado</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Total Cuentas</span>
            <Building2 className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900">
            {loading ? '-' : professionals.length}
          </div>
          <p className="text-[11px] text-slate-400">Rol 'professional'</p>
        </div>
      </div>

      {/* Lista y Buscador */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h2 className="font-bold text-slate-900 text-base">
            Solicitudes de Homologación
          </h2>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar por nombre o email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600"
            />
          </div>
        </div>

        {loading ? (
          <div className="py-12 text-center text-xs text-slate-400">
            Cargando solicitudes de homologación...
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
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-slate-900 text-sm">
                      {pro.full_name || 'Sin Nombre Registrado'}
                    </span>
                    
                    {pro.verification_status === 'verified' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
                        <CheckCircle2 className="w-3 h-3" /> Verificado
                      </span>
                    )}

                    {pro.verification_status === 'pending' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-bold">
                        <Clock className="w-3 h-3" /> Pendiente
                      </span>
                    )}

                    {pro.verification_status === 'rejected' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-bold">
                        <XCircle className="w-3 h-3" /> Rechazado
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500">
                    {pro.email || 'Sin email'} • ID: <span className="font-mono text-slate-400">{pro.id.substring(0, 8)}...</span> • Alta: {new Date(pro.created_at).toLocaleDateString('es-ES')}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {pro.verification_status !== 'verified' && (
                    <button
                      onClick={() => handleStatusChange(pro.id, 'verified')}
                      disabled={actionLoadingId === pro.id}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-sm disabled:opacity-50"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {actionLoadingId === pro.id ? 'Guardando...' : 'Aprobar'}
                    </button>
                  )}

                  {pro.verification_status !== 'rejected' && (
                    <button
                      onClick={() => handleStatusChange(pro.id, 'rejected')}
                      disabled={actionLoadingId === pro.id}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold transition disabled:opacity-50"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      {actionLoadingId === pro.id ? 'Guardando...' : 'Rechazar'}
                    </button>
                  )}

                  {pro.verification_status !== 'pending' && (
                    <button
                      onClick={() => handleStatusChange(pro.id, 'pending')}
                      disabled={actionLoadingId === pro.id}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 border border-slate-200 rounded-xl text-xs font-semibold transition disabled:opacity-50"
                    >
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {actionLoadingId === pro.id ? 'Guardando...' : 'Marcar Pendiente'}
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
