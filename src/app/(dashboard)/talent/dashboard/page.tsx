'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabaseClient'

export default function TalentDashboardPage() {
  const [loading, setLoading] = useState(true)

  // Estados dinámicos de la artista
  const [nombre, setNombre] = useState('')
  const [slug, setSlug] = useState('')
  const [fotoPortada, setFotoPortada] = useState('')

  // Métricas reales desde Supabase
  const [visitasTotales, setVisitasTotales] = useState(0)
  const [packsVendidos, setPacksVendidos] = useState(0)
  const [gananciasTotales, setGananciasTotales] = useState(0)

  // Listado real de packs
  const [packsArtista, setPacksArtista] = useState<any[]>([])

  useEffect(() => {
    fetchTalentData()
  }, [])

  const fetchTalentData = async () => {
    try {
      setLoading(true)
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // 1. Obtener información básica de la artista logueada
      const { data: artistaData, error: artistaError } = await supabase
        .from('artistas')
        .select('nombre, slug, foto_portada')
        .eq('id', user.id)
        .single()

      if (artistaError) throw artistaError

      if (artistaData) {
        setNombre(artistaData.nombre || '')
        setSlug(artistaData.slug || '')
        setFotoPortada(artistaData.foto_portada || '')

        // 2. Obtener visitas reales de la tabla 'perfil_visitas' usando el slug
        const { count: countVisitas } = await supabase
          .from('perfil_visitas')
          .select('*', { count: 'exact', head: true })
          .eq('artista_slug', artistaData.slug)

        setVisitasTotales(countVisitas || 0)
      }

      // 3. Obtener ventas de packs e ingresos reales desde 'compras_packs'
      const { data: comprasData, count: countVentas } = await supabase
        .from('compras_packs')
        .select('*, pack:pack_id(precio)', { count: 'exact' })

      let sumaIngresos = 0
      if (comprasData) {
        comprasData.forEach((compra: any) => {
          sumaIngresos += Number(compra.pack?.precio || 0)
        })
      }

      setPacksVendidos(countVentas || 0)
      setGananciasTotales(sumaIngresos)

      // 4. Obtener el listado de packs generales creados por el administrador
      const { data: packsData, error: packsError } = await supabase
        .from('packs')
        .select('*')
        .order('created_at', { ascending: false })

      if (!packsError && packsData) {
        setPacksArtista(packsData)
      }

    } catch (err) {
      console.error('Error al cargar datos del panel de artista:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="min-h-screen bg-zinc-950 text-zinc-400 flex items-center justify-center">Cargando panel de creadora...</div>
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-white p-4 sm:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Barra superior */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-zinc-800 pb-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full overflow-hidden border border-rose-500/50 bg-zinc-800 shrink-0">
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

        {/* 1. Tarjetas de Métricas Reales */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl shadow-xl">
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1">Visitas en tu Perfil</p>
            <h3 className="text-3xl font-black text-white">👁️ {visitasTotales.toLocaleString()}</h3>
            <span className="text-xs text-zinc-500 mt-2 block">Tráfico registrado en tu ruta pública</span>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl shadow-xl">
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1">Packs Vendidos</p>
            <h3 className="text-3xl font-black text-white">📦 {packsVendidos}</h3>
            <span className="text-xs text-zinc-500 mt-2 block">Total de ventas en plataforma</span>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl shadow-xl">
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1">Tus Ganancias Netas</p>
            <h3 className="text-3xl font-black text-emerald-400">${gananciasTotales.toLocaleString(undefined, { minimumFractionDigits: 2 })}</h3>
            <span className="text-xs text-zinc-500 mt-2 block">Calculado desde Supabase</span>
          </div>
        </div>

        {/* Listado de Packs Dinámicos */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between space-y-6">
          <div>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-bold">Packs Multimedia Disponibles en Sistema</h2>
                <p className="text-zinc-400 text-xs mt-1">Los videos y contenido pesado de estos packs son configurados y gestionados mediante Bunny Stream.</p>
              </div>
            </div>

            {packsArtista.length === 0 ? (
              <p className="text-zinc-500 text-sm py-8 text-center">No hay packs multimedia registrados en este momento.</p>
            ) : (
              <div className="space-y-4">
                {packsArtista.map((pack) => (
                  <div key={pack.id} className="bg-zinc-950 border border-zinc-800 p-4 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs bg-emerald-950 text-emerald-300 border border-emerald-800 px-2 py-0.5 rounded font-bold uppercase">
                          {pack.incluye_videollamada ? '🎥 Incluye Videollamada' : '📦 Activo'}
                        </span>
                      </div>
                      <h3 className="font-bold text-base text-white">{pack.titulo}</h3>
                      <p className="text-xs text-zinc-400 mt-1 line-clamp-1">{pack.descripcion}</p>
                      <span className="text-rose-400 font-bold text-sm mt-1 block">${pack.precio} USD</span>
                    </div>

                    <div className="text-xs bg-zinc-900 border border-zinc-800 text-zinc-400 px-3 py-2 rounded-lg shrink-0">
                      🎥 Gestionado vía Bunny Stream
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-zinc-950 border border-zinc-800 p-4 rounded-xl text-center">
            <p className="text-xs text-zinc-400">
              ¿Necesitas agregar un nuevo pack multimedia o actualizar videos en alta definición? <br />
              <span className="text-rose-400 font-medium">Contacta al Administrador de la plataforma.</span>
            </p>
          </div>
        </div>

      </div>
    </main>
  )
}