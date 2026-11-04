'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabaseClient'

interface PackComprado {
  id: string
  fecha_compra: string
  estado: string
  pack: {
    id: string
    titulo: string
    precio: number
    descripcion: string
    incluye_videollamada: boolean
  }
}

export default function UserDashboardPage() {
  const [loading, setLoading] = useState(true)
  const [puntos, setPuntos] = useState<number>(0)
  const [nombreUsuario, setNombreUsuario] = useState<string>('')
  const [compras, setCompras] = useState<PackComprado[]>([])

  useEffect(() => {
    fetchUserData()
  }, [])

  const fetchUserData = async () => {
    try {
      // 1. Obtener sesión del usuario actual
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      if (authError || !user) return

      // 2. Obtener datos del perfil y puntos desde la tabla 'profiles'
      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name, puntos')
        .eq('id', user.id)
        .single()

      if (profile) {
        setNombreUsuario(profile.full_name || user.email?.split('@')[0] || 'Usuario')
        setPuntos(profile.puntos || 0)
      }

      // 3. Obtener los packs comprados desde la tabla 'compras_packs'
      const { data: comprasData, error: comprasError } = await supabase
        .from('compras_packs')
        .select(`
          id,
          fecha_compra,
          estado:st_transaccion_ext,
          pack:pack_id (
            id,
            titulo,
            precio,
            descripcion,
            incluye_videollamada
          )
        `)
        .eq('usuario_id', user.id)
        .order('fecha_compra', { ascending: false })

      if (!comprasError && comprasData) {
        setCompras(comprasData as unknown as PackComprado[])
      }

    } catch (err) {
      console.error('Error al cargar datos del usuario:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-400 flex items-center justify-center p-6">
        Cargando tus datos y compras...
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-white p-4 sm:p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Encabezado Principal */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-red-500 bg-red-950/50 border border-red-800 px-3 py-1 rounded-full">
              Panel de Suscriptor
            </span>
            <h1 className="text-2xl font-black tracking-tight mt-2">Bienvenido, {nombreUsuario}</h1>
            <p className="text-zinc-400 text-sm mt-1">Gestiona tus puntos y accede al contenido exclusivo que has adquirido.</p>
          </div>
          <Link
            href="/catalogo"
            className="bg-red-600 hover:bg-red-700 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition shadow-lg shadow-red-900/40 shrink-0"
          >
            ✨ Explorar Catálogo
          </Link>
        </div>

        {/* Tarjetas de Resumen Reales */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl shadow-xl">
            <h3 className="text-zinc-400 text-xs font-semibold uppercase tracking-wider">Puntos Acumulados</h3>
            <p className="text-3xl font-black text-yellow-400 mt-2">💎 {puntos} Pts</p>
            <span className="text-xs text-zinc-500 mt-1 block">Canjeables en tus próximas compras</span>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl shadow-xl">
            <h3 className="text-zinc-400 text-xs font-semibold uppercase tracking-wider">Packs Adquiridos</h3>
            <p className="text-3xl font-black text-white mt-2">📦 {compras.length} Packs</p>
            <span className="text-xs text-zinc-500 mt-1 block">Acceso disponible a tu contenido</span>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl shadow-xl">
            <h3 className="text-zinc-400 text-xs font-semibold uppercase tracking-wider">Estado de Cuenta</h3>
            <p className="text-3xl font-black text-emerald-400 mt-2">🟢 Activa</p>
            <span className="text-xs text-zinc-500 mt-1 block">Acceso VIP a la plataforma</span>
          </div>
        </div>

        {/* Sección de Packs Adquiridos con Botones de Acceso */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl">
          <h2 className="text-xl font-bold mb-4">Tus Packs de Contenido Adquiridos</h2>
          
          {compras.length === 0 ? (
            <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-8 text-center text-zinc-400 space-y-3">
              <p className="text-base">Aún no has comprado ningún pack de contenido.</p>
              <Link 
                href="/catalogo" 
                className="inline-block text-sm font-semibold text-red-400 hover:text-red-300 underline"
              >
                Ir al catálogo de artistas para realizar tu primera compra →
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {compras.map((item) => (
                <div 
                  key={item.id} 
                  className="bg-zinc-950 border border-zinc-800 p-5 rounded-xl flex flex-col justify-between space-y-4 hover:border-zinc-700 transition"
                >
                  <div>
                    <div className="flex justify-between items-start gap-2 mb-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-950 text-emerald-400 border border-emerald-800 px-2 py-0.5 rounded">
                        {item.estado || 'Completado'}
                      </span>
                      <span className="text-xs text-zinc-500 font-mono">
                        {item.fecha_compra ? new Date(item.fecha_compra).toLocaleDateString() : ''}
                      </span>
                    </div>

                    <h3 className="font-bold text-lg text-white">
                      {item.pack?.titulo || 'Pack Exclusivo'}
                    </h3>

                    <p className="text-xs text-zinc-400 mt-1 line-clamp-2">
                      {item.pack?.descripcion || 'Contenido multimedia exclusivo.'}
                    </p>
                  </div>

                  {/* Botón de Acceso al Contenido del Pack */}
                  <Link
                    href={`/perfil/compras/${item.id}`}
                    className="w-full text-center bg-red-600 hover:bg-red-700 text-white font-bold text-xs py-2.5 px-4 rounded-lg transition shadow-md shadow-red-900/30"
                  >
                    🔓 Ver Contenido del Pack (Fotos y Videos)
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </main>
  )
}