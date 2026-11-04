'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabaseClient'

export default function TalentDashboardPage() {
  const [loading, setLoading] = useState(true)

  // Estados básicos del perfil (solo para mostrar nombre y foto en la cabecera)
  const [nombre, setNombre] = useState('')
  const [slug, setSlug] = useState('')
  const [fotoPortada, setFotoPortada] = useState('')

  // Métricas de prueba para el demo
  const [visitasTotales] = useState(4230)
  const [packsVendidos] = useState(145)
  const [gananciasTotales] = useState(3850.00)

  const [packsArtista] = useState([
    { id: 1, titulo: 'Pack Exclusivo Fotos & Videos - Octubre', precio: 19.99, estado: 'Activo', ventas: 95 },
    { id: 2, titulo: 'Suscripción Anual VIP', precio: 149.99, estado: 'Activo', ventas: 50 },
  ])

  useEffect(() => {
    fetchTalentData()
  }, [])

  const fetchTalentData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from('artistas')
        .select('nombre, slug, foto_portada')
        .eq('id', user.id)
        .single()

      if (error) throw error

      if (data) {
        setNombre(data.nombre || '')
        setSlug(data.slug || '')
        setFotoPortada(data.foto_portada || '')
      }
    } catch (err) {
      console.error('Error al cargar datos:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="p-10 text-zinc-400">Cargando panel de creadora...</div>
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-white p-4 sm:p-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Barra superior */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 border-b border-zinc-800 pb-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full overflow-hidden border border-rose-500/50 bg-zinc-800">
              <img src={fotoPortada || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800'} alt={nombre} className="w-full h-full object-cover" />
            </div>
            <div>
              <span className="bg-rose-950 text-rose-400 border border-rose-800 text-xs font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                Panel de Artista
              </span>
              <h1 className="text-2xl font-extrabold tracking-tight mt-1">Bienvenida, {nombre}</h1>
            </div>
          </div>

          {slug && (
            <Link
              href={`/artistas/${slug}`}
              target="_blank"
              className="bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 px-4 py-2 rounded-xl text-sm font-medium transition"
            >
              Ver mi Perfil Público ↗
            </Link>
          )}
        </div>

        {/* 1. Tarjetas de Métricas */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
          <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl shadow-xl">
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1">Visitas en tu Perfil</p>
            <h3 className="text-3xl font-black text-white">👁️ {visitasTotales.toLocaleString()}</h3>
            <span className="text-xs text-zinc-500 mt-2 block">Tráfico registrado en tu ruta pública</span>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl shadow-xl">
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1">Packs Vendidos</p>
            <h3 className="text-3xl font-black text-white">📦 {packsVendidos}</h3>
            <span className="text-xs text-zinc-500 mt-2 block">Total de ventas registradas</span>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl shadow-xl">
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1">Tus Ganancias Netas</p>
            <h3 className="text-3xl font-black text-emerald-400">${gananciasTotales.toLocaleString()}</h3>
            <span className="text-xs text-zinc-500 mt-2 block">Calculado tras comisión de plataforma</span>
          </div>
        </div>

        {/* Listado de Packs */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-bold">Tus Packs Multimedia</h2>
                <p className="text-zinc-400 text-xs mt-1">Los videos y contenido pesado de estos packs son configurados por el equipo de desarrollo mediante Bunny Stream.</p>
              </div>
            </div>

            <div className="space-y-4">
              {packsArtista.map((pack) => (
                <div key={pack.id} className="bg-zinc-950 border border-zinc-800 p-4 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs bg-emerald-950 text-emerald-300 border border-emerald-800 px-2 py-0.5 rounded font-bold uppercase">
                        {pack.estado}
                      </span>
                      <span className="text-xs text-zinc-400 font-mono">Ventas: {pack.ventas}</span>
                    </div>
                    <h3 className="font-bold text-base">{pack.titulo}</h3>
                    <span className="text-rose-400 font-bold text-sm">${pack.precio} USD</span>
                  </div>

                  <div className="text-xs bg-zinc-900 border border-zinc-800 text-zinc-400 px-3 py-2 rounded-lg">
                    🎥 Gestionado vía Bunny Stream
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 bg-zinc-950 border border-zinc-800 p-4 rounded-xl text-center">
            <p className="text-xs text-zinc-400">
              ¿Necesitas agregar un nuevo pack multimedia o actualizar videos en alta definición? <br />
              <span className="text-rose-400 font-medium">Contacta al Administrador / Desarrollador de la plataforma.</span>
            </p>
          </div>
        </div>

      </div>
    </main>
  )
}