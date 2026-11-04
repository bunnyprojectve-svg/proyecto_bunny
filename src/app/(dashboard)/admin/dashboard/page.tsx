'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';

interface ArtistaRendimiento {
  id: string;
  nombre: string;
  slug: string;
}

export default function AdminDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [metricas, setMetricas] = useState({
    ingresosTotales: 0,
    suscripcionesActivas: 0,
    totalUsuarios: 0,
    totalArtistas: 0,
  });

  const [rankingArtistas, setRankingArtistas] = useState<ArtistaRendimiento[]>([]);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      // 1. Contar total de usuarios en 'profiles'
      const { count: countUsuarios } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      // 2. Contar total de artistas en 'artistas'
      const { count: countArtistas, data: artistasData } = await supabase
        .from('artistas')
        .select('*', { count: 'exact' });

      // 3. Obtener compras y calcular ingresos y packs vendidos desde 'compras_packs'
      const { data: comprasData, count: countVentas } = await supabase
        .from('compras_packs')
        .select('*, pack:pack_id(precio)', { count: 'exact' });

      let ingresosSuma = 0;
      if (comprasData) {
        comprasData.forEach((compra: any) => {
          ingresosSuma += Number(compra.pack?.precio || 0);
        });
      }

      setMetricas({
        ingresosTotales: ingresosSuma,
        suscripcionesActivas: countVentas || 0,
        totalUsuarios: countUsuarios || 0,
        totalArtistas: countArtistas || 0,
      });

      if (artistasData) {
        setRankingArtistas(artistasData as ArtistaRendimiento[]);
      }

    } catch (err) {
      console.error('Error al cargar métricas del administrador:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-400 flex items-center justify-center p-6">
        Cargando panel de administración y métricas globales...
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-white p-4 sm:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Barra superior de navegación interna */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-zinc-800 pb-6">
          <div>
            <div className="flex items-center gap-3">
              <span className="bg-rose-950 text-rose-400 border border-rose-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                Panel de Control / Admin
              </span>
              <span className="text-xs text-zinc-500">Supabase Conectado (Producción)</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight mt-2">Métricas y Rendimiento Global</h1>
          </div>

          <div className="flex items-center gap-3">
            {/* Botón para crear packs multimedia */}
            <Link
              href="/admin/packs/crear"
              className="bg-red-600 hover:bg-red-700 text-white font-bold px-4 py-2.5 rounded-xl text-sm transition shadow-lg shadow-red-900/30 flex items-center gap-2"
            >
              📦 Crear Nuevo Pack
            </Link>

            <Link
              href="/"
              className="bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 px-4 py-2.5 rounded-xl text-sm font-medium transition"
            >
              ← Volver al Sitio
            </Link>
          </div>
        </div>

        {/* 1. Tarjetas de KPIs Principales */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl shadow-xl">
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1">Ingresos Brutos Globales</p>
            <h3 className="text-3xl font-black text-emerald-400">${metricas.ingresosTotales.toLocaleString(undefined, { minimumFractionDigits: 2 })}</h3>
            <span className="text-xs text-zinc-500 mt-2 block">Calculado desde Supabase</span>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl shadow-xl">
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1">Suscripciones / Packs Vendidos</p>
            <h3 className="text-3xl font-black text-white">{metricas.suscripcionesActivas}</h3>
            <span className="text-xs text-zinc-500 mt-2 block">Transacciones registradas</span>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl shadow-xl">
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1">Total de Usuarios</p>
            <h3 className="text-3xl font-black text-white">{metricas.totalUsuarios}</h3>
            <span className="text-xs text-zinc-500 mt-2 block">Perfiles registrados en sistema</span>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl shadow-xl">
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1">Artistas Registradas</p>
            <h3 className="text-3xl font-black text-rose-500">{metricas.totalArtistas}</h3>
            <span className="text-xs text-zinc-500 mt-2 block">Creadoras activas en catálogo</span>
          </div>
        </div>

        {/* 2. Sección de Listado de Artistas desde Supabase */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Artistas Registradas en la Plataforma</h2>
            <span className="text-xs text-zinc-400 bg-zinc-950 px-3 py-1 rounded-lg border border-zinc-800">Base de Datos Activa</span>
          </div>

          <div className="overflow-x-auto">
            {rankingArtistas.length === 0 ? (
              <p className="text-zinc-500 text-sm py-4 text-center">No hay artistas registradas todavía.</p>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-zinc-800 text-xs uppercase tracking-wider text-zinc-400">
                    <th className="py-3 px-4">Nombre Artístico</th>
                    <th className="py-3 px-4">Enlace del Perfil Público</th>
                    <th className="py-3 px-4 text-right">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60 text-sm">
                  {rankingArtistas.map((art) => (
                    <tr key={art.id} className="hover:bg-zinc-800/40 transition">
                      <td className="py-4 px-4 font-medium text-white flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                        {art.nombre}
                      </td>
                      <td className="py-4 px-4 text-zinc-400 font-mono text-xs">
                        /artistas/{art.slug}
                      </td>
                      <td className="py-4 px-4 text-right">
                        <Link 
                          href={`/artistas/${art.slug}`} 
                          target="_blank"
                          className="text-xs bg-zinc-800 hover:bg-zinc-700 text-white font-bold px-3 py-1.5 rounded-lg transition"
                        >
                          Ver Perfil ↗
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

      </div>
    </main>
  );
}