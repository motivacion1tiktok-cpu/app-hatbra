'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import {
  Calculator,
  Hammer,
  PackageCheck,
  FileSpreadsheet,
  Sparkles,
  CheckCircle2,
  XCircle,
  Clock,
  Euro,
  Building2,
  FileText,
  AlertCircle,
  RefreshCw,
  SlidersHorizontal,
} from 'lucide-react';

interface MaterialEstimate {
  nombre: string;
  cantidad: number;
  unidad: string;
  precioUnitario: number;
  subtotal: number;
}

interface QuoteWithRequest {
  id: string;
  request_id: string;
  provider_name?: string;
  total_amount: number;
  description: string;
  breakdown?: any;
  status: 'draft' | 'submitted' | 'accepted' | 'rejected';
  created_at: string;
  requests?: {
    id: string;
    title: string;
    category: string;
    budget_estimated?: number;
  } | null;
}

export default function ComparadorPage() {
  const router = useRouter();
  const supabase = createClient();

  const [activeTab, setActiveTab] = useState<'quotes' | 'estimator'>('quotes');
  
  // Estado para ofertas reales
  const [quotes, setQuotes] = useState<QuoteWithRequest[]>([]);
  const [loadingQuotes, setLoadingQuotes] = useState(true);
  const [errorQuotes, setErrorQuotes] = useState<string | null>(null);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  // Estado para estimador de materiales
  const [estancia, setEstancia] = useState('bano');
  const [metrosCuadrados, setMetrosCuadrados] = useState<number>(12);
  const [calidad, setCalidad] = useState<'basica' | 'media' | 'premium'>('media');

  // Cargar presupuestos desde Supabase (RLS filtra automáticamente por cliente)
  async function loadQuotes() {
    setLoadingQuotes(true);
    setErrorQuotes(null);

    try {
      const { data, error } = await supabase
        .from('quotes')
        .select(`
          id,
          request_id,
          provider_name,
          total_amount,
          description,
          breakdown,
          status,
          created_at,
          requests (
            id,
            title,
            category,
            budget_estimated
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setQuotes((data as unknown as QuoteWithRequest[]) || []);
    } catch (err: any) {
      console.error('Error al cargar ofertas:', err);
      setErrorQuotes(err.message || 'No se pudieron cargar los presupuestos.');
    } finally {
      setLoadingQuotes(false);
    }
  }

  useEffect(() => {
    loadQuotes();
  }, []);

  // Cambiar estado de oferta (Aceptar / Rechazar)
  async function handleQuoteStatus(quoteId: string, newStatus: 'accepted' | 'rejected') {
    setActionLoadingId(quoteId);

    try {
      const { error } = await supabase
        .from('quotes')
        .update({ status: newStatus })
        .eq('id', quoteId);

      if (error) throw error;

      setQuotes((prev) =>
        prev.map((q) => (q.id === quoteId ? { ...q, status: newStatus } : q))
      );

      if (newStatus === 'accepted') {
        router.push('/dashboard/proyectos');
      }
    } catch (err: any) {
      alert(`Error al actualizar el presupuesto: ${err.message}`);
    } finally {
      setActionLoadingId(null);
    }
  }

  // --- LÓGICA DE ESTIMADOR DE MATERIALES ---
  const factorCalidad = {
    basica: 0.8,
    media: 1.0,
    premium: 1.4,
  }[calidad];

  const calcularMateriales = (): MaterialEstimate[] => {
    const baseM2 = Math.max(1, metrosCuadrados);

    if (estancia === 'bano') {
      return [
        {
          nombre: 'Azulejo cerámico / Porcelánico para paredes y suelo',
          cantidad: Math.ceil(baseM2 * 3.2),
          unidad: 'm²',
          precioUnitario: Math.round(22 * factorCalidad),
          subtotal: Math.ceil(baseM2 * 3.2) * Math.round(22 * factorCalidad),
        },
        {
          nombre: 'Sacos de Cemento Cola Flexible C2TE',
          cantidad: Math.ceil(baseM2 * 0.8),
          unidad: 'sacos (25kg)',
          precioUnitario: 14,
          subtotal: Math.ceil(baseM2 * 0.8) * 14,
        },
        {
          nombre: 'Pasta de Juntas e Impermeabilizante Líquido',
          cantidad: Math.ceil(baseM2 / 5),
          unidad: 'kits',
          precioUnitario: 35,
          subtotal: Math.ceil(baseM2 / 5) * 35,
        },
        {
          nombre: 'Kit de Sanitarios y Grifería',
          cantidad: 1,
          unidad: 'conjunto',
          precioUnitario: Math.round(450 * factorCalidad),
          subtotal: Math.round(450 * factorCalidad),
        },
      ];
    }

    if (estancia === 'cocina') {
      return [
        {
          nombre: 'Revestimiento para paredes / Frontal de cocina',
          cantidad: Math.ceil(baseM2 * 1.5),
          unidad: 'm²',
          precioUnitario: Math.round(28 * factorCalidad),
          subtotal: Math.ceil(baseM2 * 1.5) * Math.round(28 * factorCalidad),
        },
        {
          nombre: 'Suelo Vinílico o Porcelánico de Alta Durabilidad',
          cantidad: Math.ceil(baseM2 * 1.1),
          unidad: 'm²',
          precioUnitario: Math.round(25 * factorCalidad),
          subtotal: Math.ceil(baseM2 * 1.1) * Math.round(25 * factorCalidad),
        },
        {
          nombre: 'Pintura plástica lavable antihumedad',
          cantidad: Math.ceil(baseM2 / 10),
          unidad: 'botes (15L)',
          precioUnitario: 48,
          subtotal: Math.ceil(baseM2 / 10) * 48,
        },
      ];
    }

    return [
      {
        nombre: 'Tarima flotante AC5 o Suelo Laminado',
        cantidad: Math.ceil(baseM2 * 1.1),
        unidad: 'm²',
        precioUnitario: Math.round(18 * factorCalidad),
        subtotal: Math.ceil(baseM2 * 1.1) * Math.round(18 * factorCalidad),
      },
      {
        nombre: 'Aislamiento bajo suelo / Manta acústica',
        cantidad: Math.ceil(baseM2 * 1.05),
        unidad: 'm²',
        precioUnitario: 3.5,
        subtotal: Math.round(Math.ceil(baseM2 * 1.05) * 3.5),
      },
      {
        nombre: 'Pintura Plástica Mate Paredes y Techo',
        cantidad: Math.ceil(baseM2 / 8),
        unidad: 'botes (15L)',
        precioUnitario: 42,
        subtotal: Math.ceil(baseM2 / 8) * 42,
      },
      {
        nombre: 'Placa de Yeso Laminado (Placostic/Laminado)',
        cantidad: Math.ceil(baseM2 * 0.5),
        unidad: 'placas',
        precioUnitario: 12,
        subtotal: Math.ceil(baseM2 * 0.5) * 12,
      },
    ];
  };

  const materiales = calcularMateriales();
  const totalMateriales = materiales.reduce((acc, item) => acc + item.subtotal, 0);
  const estimacionManoObra = Math.round(totalMateriales * 1.35);
  const presupuestoTotal = totalMateriales + estimacionManoObra;

  return (
    <div className="max-w-6xl mx-auto space-y-6 p-4">
      {/* Cabecera Principal */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 text-white p-6 md:p-8 rounded-3xl shadow-md relative overflow-hidden">
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-amber-500 text-xs font-medium">
            <SlidersHorizontal className="w-3.5 h-3.5 text-amber-500" /> Módulo de Comparación
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            Comparador y Estimador 📊
          </h1>
          <p className="text-slate-300 text-xs md:text-sm max-w-xl">
            Compara las propuestas recibidas de los profesionales o calcula el coste de materiales estimado para tus reformas.
          </p>
        </div>

        {/* Pestañas de Navegación */}
        <div className="relative z-10 flex items-center gap-2 bg-slate-800 p-1.5 rounded-2xl border border-slate-700">
          <button
            onClick={() => setActiveTab('quotes')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeTab === 'quotes'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Euro className="w-4 h-4" /> Ofertas Recibidas ({quotes.length})
          </button>
          <button
            onClick={() => setActiveTab('estimator')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeTab === 'estimator'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Calculator className="w-4 h-4" /> Estimador IA
          </button>
        </div>

        <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* PESTAÑA 1: OFERTAS DE PROFESIONALES */}
      {activeTab === 'quotes' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Euro className="w-5 h-5 text-amber-600" />
              Presupuestos Presentados por Profesionales
            </h2>
            <button
              onClick={loadQuotes}
              disabled={loadingQuotes}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loadingQuotes ? 'animate-spin' : ''}`} />
              Actualizar
            </button>
          </div>

          {loadingQuotes ? (
            <div className="py-12 text-center text-xs text-slate-400">
              Cargando presupuestos de profesionales...
            </div>
          ) : errorQuotes ? (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-3 text-xs text-rose-800">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
              <span>{errorQuotes}</span>
            </div>
          ) : quotes.length === 0 ? (
            <div className="py-12 text-center space-y-3 bg-white rounded-3xl border border-dashed border-slate-200 p-8">
              <Building2 className="w-10 h-10 text-slate-300 mx-auto" />
              <h3 className="text-sm font-bold text-slate-700">Sin propuestas recibidas todavía</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Las ofertas de los profesionales verificados para tus solicitudes de obra aparecerán en esta sección para que puedas compararlas y aceptarlas.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {quotes.map((quote) => (
                <div
                  key={quote.id}
                  className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-md transition flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <span className="text-xs font-semibold px-2.5 py-1 bg-amber-50 text-amber-700 rounded-full border border-amber-200">
                        {quote.requests?.category || 'Reforma'}
                      </span>
                      {quote.status === 'accepted' && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3" /> Aceptado
                        </span>
                      )}
                      {quote.status === 'rejected' && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                          <XCircle className="w-3 h-3" /> Rechazado
                        </span>
                      )}
                      {quote.status === 'submitted' && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">
                          <Clock className="w-3 h-3 text-slate-400" /> Pendiente
                        </span>
                      )}
                    </div>

                    <h3 className="font-bold text-slate-900 text-base">
                      {quote.requests?.title || 'Proyecto de Reforma'}
                    </h3>

                    <p className="text-xs text-slate-500 line-clamp-3">
                      {quote.description}
                    </p>

                    <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 flex items-center justify-between">
                      <span className="text-xs text-slate-500">Proveedor</span>
                      <span className="text-xs font-bold text-slate-900">
                        {quote.provider_name || 'Profesional Verificado'}
                      </span>
                    </div>

                    <div className="bg-amber-50/50 p-4 rounded-2xl border border-amber-100 flex items-center justify-between">
                      <span className="text-xs font-bold text-amber-900">Importe Total</span>
                      <span className="text-xl font-extrabold text-amber-900">
                        {quote.total_amount.toLocaleString('es-ES')} €
                      </span>
                    </div>
                  </div>

                  {/* Botones de acción */}
                  <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
                    {quote.status !== 'accepted' && (
                      <button
                        onClick={() => handleQuoteStatus(quote.id, 'accepted')}
                        disabled={actionLoadingId === quote.id}
                        className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-sm flex items-center justify-center gap-1.5 disabled:opacity-50"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        {actionLoadingId === quote.id ? 'Guardando...' : 'Aceptar Oferta'}
                      </button>
                    )}

                    {quote.status !== 'rejected' && (
                      <button
                        onClick={() => handleQuoteStatus(quote.id, 'rejected')}
                        disabled={actionLoadingId === quote.id}
                        className="py-2.5 px-3 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 disabled:opacity-50"
                      >
                        <XCircle className="w-4 h-4" />
                        Rechazar
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* PESTAÑA 2: ESTIMADOR DE MATERIALES */}
      {activeTab === 'estimator' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Panel de Controles */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-5">
            <h2 className="font-semibold text-slate-800 text-base flex items-center gap-2">
              <Hammer className="w-4 h-4 text-slate-600" />
              Parámetros de la Reforma
            </h2>

            <div className="space-y-2">
              <label className="text-xs font-medium text-slate-700">Tipo de Estancia</label>
              <select
                value={estancia}
                onChange={(e) => setEstancia(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900"
              >
                <option value="bano">Cuarto de Baño</option>
                <option value="cocina">Cocina</option>
                <option value="general">Salón / Dormitorio / General</option>
              </select>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <label className="font-medium text-slate-700">Superficie ({metrosCuadrados} m²)</label>
              </div>
              <input
                type="range"
                min="3"
                max="100"
                value={metrosCuadrados}
                onChange={(e) => setMetrosCuadrados(Number(e.target.value))}
                className="w-full accent-slate-900 cursor-pointer"
              />
              <input
                type="number"
                min="1"
                value={metrosCuadrados}
                onChange={(e) => setMetrosCuadrados(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-sm text-center font-bold text-slate-800"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-slate-700">Gama de Acabados</label>
              <div className="grid grid-cols-3 gap-2">
                {(['basica', 'media', 'premium'] as const).map((gama) => (
                  <button
                    key={gama}
                    type="button"
                    onClick={() => setCalidad(gama)}
                    className={`py-2 text-xs font-semibold capitalize rounded-xl border transition ${
                      calidad === gama
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {gama}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-slate-900 text-white p-4 rounded-xl space-y-2">
              <div className="flex justify-between text-xs text-slate-300">
                <span>Materiales:</span>
                <span className="font-semibold">{totalMateriales.toLocaleString('es-ES')} €</span>
              </div>
              <div className="flex justify-between text-xs text-slate-300">
                <span>Mano de obra est.:</span>
                <span className="font-semibold">{estimacionManoObra.toLocaleString('es-ES')} €</span>
              </div>
              <div className="border-t border-slate-700 pt-2 flex justify-between text-sm font-bold">
                <span>Total Estimado:</span>
                <span className="text-emerald-400">{presupuestoTotal.toLocaleString('es-ES')} €</span>
              </div>
            </div>
          </div>

          {/* Tabla de Despiece de Materiales */}
          <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <h2 className="font-semibold text-slate-800 text-base flex items-center gap-2">
                  <PackageCheck className="w-5 h-5 text-emerald-600" />
                  Despiece Estimado de Materiales
                </h2>
                <span className="text-xs font-semibold px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-200 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Cálculo de Mermas incluido
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-700">
                  <thead className="bg-slate-100 text-slate-800 font-semibold uppercase text-[10px]">
                    <tr>
                      <th className="p-3 rounded-l-xl">Material</th>
                      <th className="p-3">Cantidad</th>
                      <th className="p-3">Precio Est.</th>
                      <th className="p-3 text-right rounded-r-xl">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {materiales.map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/80 transition">
                        <td className="p-3 font-medium text-slate-900">{item.nombre}</td>
                        <td className="p-3 font-semibold text-slate-700">
                          {item.cantidad} {item.unidad}
                        </td>
                        <td className="p-3">{item.precioUnitario} €</td>
                        <td className="p-3 text-right font-bold text-slate-900">{item.subtotal} €</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => router.push('/dashboard/nuevo-proyecto')}
                className="flex items-center gap-2 px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-semibold transition"
              >
                <FileText className="w-4 h-4" />
                Publicar Proyecto con esta Estimación
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}