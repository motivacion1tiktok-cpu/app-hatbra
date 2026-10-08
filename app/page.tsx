'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Building2, Sparkles, Send, ArrowRight, ShieldCheck, Hammer, Users } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function Home() {
  const router = useRouter();
  const supabase = createClient();

  const [user, setUser] = useState<any>(null);
  const [userRole, setUserRole] = useState<string | null>(null);

  // Campos del formulario
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [presupuestoEstimado, setPresupuestoEstimado] = useState('');
  const [loading, setLoading] = useState(false);
  const [mensajeExito, setMensajeExito] = useState(false);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      setUser(user);
      const { data } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (data) {
        setUserRole(data.role);
      }
    }
  };

  const handleCrearSolicitud = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!user) {
      router.push('/login');
      return;
    }

    const { error } = await supabase.from('solicitudes').insert({
      client_id: user.id,
      titulo,
      descripcion,
      presupuesto_estimado: presupuestoEstimado ? parseFloat(presupuestoEstimado) : null,
      estado: 'pendiente'
    });

    if (!error) {
      setMensajeExito(true);
      setTitulo('');
      setDescripcion('');
      setPresupuestoEstimado('');
      setTimeout(() => {
        router.push('/client/dashboard');
      }, 1500);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col">
      {/* Encabezado Principal */}
      <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-500/20">
            H
          </div>
          <div>
            <h1 className="font-bold text-lg leading-none text-white tracking-wide">HATBRA</h1>
            <span className="text-xs text-blue-400 font-medium">Reformas e Inteligencia Artificial</span>
          </div>
        </div>

        <nav className="flex items-center gap-4">
          {user ? (
            <Link
              href={userRole === 'pro' ? '/pro/dashboard' : '/client/dashboard'}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl text-xs font-semibold transition shadow-lg shadow-blue-600/20"
            >
              <span>Ir a mi Panel ({userRole === 'pro' ? 'Profesional' : 'Cliente'})</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="text-xs font-medium text-slate-300 hover:text-white px-3 py-2 rounded-lg transition"
              >
                Iniciar sesión
              </Link>
              <Link
                href="/register"
                className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl text-xs font-semibold transition shadow-lg shadow-blue-600/20"
              >
                Registrarse
              </Link>
            </>
          )}
        </nav>
      </header>

      {/* Hero / Presentación Principal */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-6 md:py-16 space-y-16">
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Transforma tu espacio con la potencia de HATBRA</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Solicita tu reforma y conecta con profesionales en minutos
          </h2>
          <p className="text-slate-400 text-base md:text-lg">
            Publica lo que deseas renovar, recibe valoraciones transparentes y gestiona las propuestas directamente desde tu panel.
          </p>
        </div>

        {/* Formulario de Creación de Solicitud */}
        <div className="max-w-2xl mx-auto bg-slate-900/90 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Building2 className="w-5 h-5 text-blue-400" />
              Publicar una solicitud de reforma
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Describe tu proyecto para que los profesionales interesados te envíen sus presupuestos.
            </p>
          </div>

          {mensajeExito && (
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-emerald-400 text-xs font-medium">
              ¡Solicitud publicada con éxito! Redirigiendo a tu panel de cliente...
            </div>
          )}

          <form onSubmit={handleCrearSolicitud} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Título de la obra o proyecto</label>
              <input
                type="text"
                required
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                placeholder="Ej. Reforma integral de baño de 6m²"
                className="w-full bg-slate-800/80 border border-slate-700/80 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Detalles de la reforma</label>
              <textarea
                rows={4}
                required
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                placeholder="Especifica materiales deseados, cambios de distribución, estado actual..."
                className="w-full bg-slate-800/80 border border-slate-700/80 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Presupuesto aproximado (€) [Opcional]</label>
              <input
                type="number"
                value={presupuestoEstimado}
                onChange={(e) => setPresupuestoEstimado(e.target.value)}
                placeholder="Ej. 3500"
                className="w-full bg-slate-800/80 border border-slate-700/80 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-medium py-3 rounded-xl transition text-sm shadow-lg shadow-blue-600/25 active:scale-[0.99]"
            >
              <Send className="w-4 h-4" />
              <span>{loading ? 'Publicando...' : 'Publicar Solicitud de Reforma'}</span>
            </button>
          </form>
        </div>

        {/* Sección Informativa */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 border-t border-slate-800/80">
          <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl space-y-2">
            <ShieldCheck className="w-6 h-6 text-blue-400" />
            <h4 className="font-bold text-white text-sm">Transparencia Total</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Compara propuestas detalladas y elige el profesional que mejor se ajuste a tus requerimientos.
            </p>
          </div>

          <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl space-y-2">
            <Hammer className="w-6 h-6 text-blue-400" />
            <h4 className="font-bold text-white text-sm">Profesionales Verificados</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Conecta directamente con profesionales capacitados para llevar a cabo reformas y obras.
            </p>
          </div>

          <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl space-y-2">
            <Users className="w-6 h-6 text-blue-400" />
            <h4 className="font-bold text-white text-sm">Gestión Sencilla</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Controla las ofertas recibidas y acepta presupuestos con un solo clic desde tu panel.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}