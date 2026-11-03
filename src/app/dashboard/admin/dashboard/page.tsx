'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function AdminDashboardPage() {
  // Datos de prueba (Mock Data) para simular las métricas en tiempo real de la plataforma
  const [metricas] = useState({
    ingresosTotales: 12450.00,
    suscripcionesActivas: 342,
    totalUsuarios: 1250,
    totalArtistas: 18,
  });

  const [rankingArtistas] = useState([
    { id: 1, nombre: 'Camila Torres', slug: 'camila-torres', visitas: 4230, ingresos: 3850.00, packsVendidos: 145 },
    { id: 2, nombre: 'Valeria Gómez', slug: 'valeria-gomez', visitas: 3890, ingresos: 3100.00, packsVendidos: 120 },
    { id: 3, nombre: 'Sofía Martínez', slug: 'sofia-martinez', visitas: 2540, ingresos: 1950.00, packsVendidos: 85 },
  ]);

  return (
    <main className="min-h-screen bg-zinc-950 text-white p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Barra superior de navegación interna */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 border-b border-zinc-800 pb-6">
          <div>
            <div className="flex items-center gap-3">
              <span className="bg-rose-950 text-rose-400 border border-rose-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                Panel de Control / Admin
              </span>
              <span className="text-xs text-zinc-500">Modo Desarrollador & Supervisor</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight mt-2">Métricas y Rendimiento Global</h1>
          </div>

          <Link
            href="/"
            className="bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 px-4 py-2 rounded-xl text-sm font-medium transition"
          >
            ← Volver al Sitio Principal
          </Link>
        </div>

        {/* 1. Tarjetas de KPIs Principales */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl shadow-xl">
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1">Ingresos Brutos Globales</p>
            <h3 className="text-3xl font-black text-emerald-400">${metricas.ingresosTotales.toLocaleString()}</h3>
            <span className="text-xs text-zinc-500 mt-2 block">+18% en comparación al mes anterior</span>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl shadow-xl">
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1">Suscripciones Activas</p>
            <h3 className="text-3xl font-black text-white">{metricas.suscripcionesActivas}</h3>
            <span className="text-xs text-zinc-500 mt-2 block">Packs multimedia vigentes</span>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl shadow-xl">
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1">Total de Usuarios</p>
            <h3 className="text-3xl font-black text-white">{metricas.totalUsuarios}</h3>
            <span className="text-xs text-zinc-500 mt-2 block">Suscriptores registrados</span>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl shadow-xl">
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1">Artistas Registradas</p>
            <h3 className="text-3xl font-black text-rose-500">{metricas.totalArtistas}</h3>
            <span className="text-xs text-zinc-500 mt-2 block">Creadoras activas en catálogo</span>
          </div>
        </div>

        {/* 2. Sección de Análisis y Ranking de Artistas (Tráfico e Ingresos) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Tabla de Artistas con mayor flujo y rentabilidad */}
          <div className="lg:col-span-2 bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Rendimiento por Artista (Tráfico e Ingresos)</h2>
              <span className="text-xs text-zinc-400 bg-zinc-950 px-3 py-1 rounded-lg border border-zinc-800">Top del Mes</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-zinc-800 text-xs uppercase tracking-wider text-zinc-400">
                    <th className="py-3 px-4">Artista</th>
                    <th className="py-3 px-4">Visitas Totales</th>
                    <th className="py-3 px-4">Packs Vendidos</th>
                    <th className="py-3 px-4 text-right">Ingresos Generados</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60 text-sm">
                  {rankingArtistas.map((art) => (
                    <tr key={art.id} className="hover:bg-zinc-800/40 transition">
                      <td className="py-4 px-4 font-medium text-white flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                        <Link href={`/artistas/${art.slug}`} className="hover:underline hover:text-rose-400">
                          {art.nombre}
                        </Link>
                      </td>
                      <td className="py-4 px-4 text-zinc-300 font-mono">👁️ {art.visitas.toLocaleString()}</td>
                      <td className="py-4 px-4 text-zinc-300 font-mono">📦 {art.packsVendidos}</td>
                      <td className="py-4 px-4 text-right font-bold text-emerald-400 font-mono">${art.ingresos.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Panel Lateral: Pasarelas de Pago y Comisiones */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
            <div>
              <h2 className="text-xl font-bold mb-4">Pasarelas de Pago</h2>
              <p className="text-zinc-400 text-sm mb-6">Distribución de cobros procesados en la plataforma.</p>

              <div className="space-y-4">
                <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <span className="text-rose-500 font-bold">💳</span>
                    <div>
                      <p className="font-semibold text-sm">CCBill (Tarjetas)</p>
                      <p className="text-xs text-zinc-500">65% del volumen total</p>
                    </div>
                  </div>
                  <span className="font-bold text-sm text-white">$8,092.50</span>
                </div>

                <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <span className="text-yellow-500 font-bold">🟡</span>
                    <div>
                      <p className="font-semibold text-sm">BinancePay</p>
                      <p className="text-xs text-zinc-500">20% del volumen total</p>
                    </div>
                  </div>
                  <span className="font-bold text-sm text-white">$2,490.00</span>
                </div>

                <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <span className="text-blue-400 font-bold">🔷</span>
                    <div>
                      <p className="font-semibold text-sm">NOWPayments</p>
                      <p className="text-xs text-zinc-500">15% del volumen total</p>
                    </div>
                  </div>
                  <span className="font-bold text-sm text-white">$1,867.50</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-zinc-800 text-center">
              <span className="text-xs text-zinc-500 block">Comisión estimada para la plataforma (20%)</span>
              <span className="text-lg font-bold text-rose-400">$2,490.00 USD</span>
            </div>
          </div>

        </div>

      </div>
    </main>
  );
}