'use client';

import { useState } from 'react';
import { Calculator, Hammer, PackageCheck, FileSpreadsheet, Sparkles } from 'lucide-react';

interface MaterialEstimate {
  nombre: string;
  cantidad: number;
  unidad: string;
  precioUnitario: number;
  subtotal: number;
}

export default function ComparadorPage() {
  const [estancia, setEstancia] = useState('bano');
  const [metrosCuadrados, setMetrosCuadrados] = useState<number>(12);
  const [calidad, setCalidad] = useState<'basica' | 'media' | 'premium'>('media');

  // Multiplicadores según calidad
  const factorCalidad = {
    basica: 0.8,
    media: 1.0,
    premium: 1.4,
  }[calidad];

  // Cálculo automático del despiece de materiales según metros y estancia
  const calcularMateriales = (): MaterialEstimate[] => {
    const baseM2 = Math.max(1, metrosCuadrados);

    if (estancia === 'bano') {
      return [
        {
          nombre: 'Azulejo cerámico / Porcelánico para paredes y suelo',
          cantidad: Math.ceil(baseM2 * 3.2), // Incluye 10% mermas
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

    // Por defecto (General / Salón / Habitación)
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
        nombre: 'Pintura Plástica Plástica Mate Paredes y Techo',
        cantidad: Math.ceil(baseM2 / 8),
        unidad: 'botes (15L)',
        precioUnitario: 42,
        subtotal: Math.ceil(baseM2 / 8) * 42,
      },
      {
        nombre: 'Placa Placa de Yeso Laminado (Placostic/Laminado)',
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
    <div className="max-w-5xl mx-auto space-y-6 p-4">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Calculator className="w-7 h-7 text-slate-900" />
          Estimador de Materiales y Presupuesto
        </h1>
        <p className="text-slate-500 text-sm">
          Calcula automáticamente las cantidades de material y el presupuesto aproximado para tu obra.
        </p>
      </div>

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
              onClick={() => alert('Generando informe de presupuesto PDF...')}
              className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 transition"
            >
              <FileSpreadsheet className="w-4 h-4" />
              Guardar Presupuesto
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}