'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabaseClient'

interface ContenidoItem {
  id: string
  tipo: 'foto' | 'video'
  recurso_url: string
  orden: number
}

interface PackDetalle {
  id: string
  titulo: string
  descripcion: string
  incluye_videollamada: boolean
}

interface CompraDetalle {
  id: string
  fecha_compra: string
  pack: PackDetalle
}

export default function VerContenidoPackPage() {
  const params = useParams()
  const router = useRouter()
  const compraId = params?.id as string

  const [loading, setLoading] = useState(true)
  const [compra, setCompra] = useState<CompraDetalle | null>(null)
  const [contenidos, setContenidos] = useState<ContenidoItem[]>([])
  const [errorAcceso, setErrorAcceso] = useState(false)

  useEffect(() => {
    if (compraId) {
      fetchContenidoPack()
    }
  }, [compraId])

  const fetchContenidoPack = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/auth/login')
        return
      }

      // 1. Verificar que la compra pertenezca al usuario actual y traer info del pack
      const { data: compraData, error: compraError } = await supabase
        .from('compras_packs')
        .select(`
          id,
          fecha_compra,
          usuario_id,
          pack:pack_id (
            id,
            titulo,
            descripcion,
            incluye_videollamada
          )
        `)
        .eq('id', compraId)
        .single()

      if (compraError || !compraData || compraData.usuario_id !== user.id) {
        setErrorAcceso(true)
        setLoading(false)
        return
      }

      setCompra(compraData as unknown as CompraDetalle)

      // 2. Traer los elementos multimedia de la tabla 'pack_contenido'
      const packId = (compraData.pack as any)?.id
      if (packId) {
        const { data: contenidoData, error: contenidoError } = await supabase
          .from('pack_contenido')
          .select('id, tipo, recurso_url, orden')
          .eq('pack_id', packId)
          .order('orden', { ascending: true })

        if (!contenidoError && contenidoData) {
          setContenidos(contenidoData as ContenidoItem[])
        }
      }

    } catch (err) {
      console.error('Error al cargar contenido:', err)
      setErrorAcceso(true)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="min-h-screen bg-zinc-950 text-zinc-400 flex items-center justify-center">Verificando acceso al contenido...</div>
  }

  if (errorAcceso || !compra) {
    return (
      <main className="min-h-screen bg-zinc-950 text-white p-8 flex items-center justify-center">
        <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-2xl max-w-md text-center space-y-4">
          <h1 className="text-xl font-bold text-red-500">Acceso Denegado</h1>
          <p className="text-sm text-zinc-400">No tienes permisos para ver este contenido o la compra no existe.</p>
          <Link href="/perfil" className="inline-block bg-zinc-800 text-white text-xs font-bold px-4 py-2 rounded-xl">
            ← Volver a mi Panel
          </Link>
        </div>
      </main>
    )
  }

  const fotos = contenidos.filter(c => c.tipo === 'foto')
  const videos = contenidos.filter(c => c.tipo === 'video')

  return (
    <main className="min-h-screen bg-zinc-950 text-white p-4 sm:p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Barra de Navegación superior */}
        <div className="flex justify-between items-center border-b border-zinc-800 pb-4">
          <Link href="/perfil" className="text-xs text-zinc-400 hover:text-white transition">
            ← Volver a Mis Packs
          </Link>
          <span className="text-xs bg-emerald-950 text-emerald-400 border border-emerald-800 px-3 py-1 rounded-full uppercase font-bold">
            Contenido Desbloqueado
          </span>
        </div>

        {/* Cabecera del Pack */}
        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl shadow-xl">
          <h1 className="text-2xl font-black">{compra.pack.titulo}</h1>
          <p className="text-zinc-400 text-sm mt-2">{compra.pack.descripcion}</p>
        </div>

        {/* Sección de Videollamada (Si aplica) */}
        {compra.pack.incluye_videollamada && (
          <div className="bg-gradient-to-r from-red-950/40 via-zinc-900 to-zinc-900 border border-red-900/50 p-6 rounded-2xl shadow-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <span className="text-xs font-bold text-red-400 uppercase tracking-widest">Beneficio Exclusivo</span>
              <h2 className="text-lg font-bold text-white mt-1">🎥 Videollamada Privada (15 Minutos)</h2>
              <p className="text-xs text-zinc-400 mt-1">Tienes acceso a una sesión en vivo directa con la creadora.</p>
            </div>
            <a
              href={`/sala-privada/${compra.id}`}
              target="_blank"
              className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs px-5 py-3 rounded-xl transition shadow-lg shadow-red-900/40 shrink-0"
            >
              Unirme a la Videollamada ↗
            </a>
          </div>
        )}

        {/* Sección de Fotos */}
        {fotos.length > 0 && (
          <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl shadow-xl space-y-4">
            <h2 className="text-lg font-bold">📸 Galería de Fotos ({fotos.length})</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {fotos.map((foto) => (
                <div key={foto.id} className="rounded-xl overflow-hidden border border-zinc-800 bg-zinc-950 aspect-square relative">
                  <img src={foto.recurso_url} alt="Contenido exclusivo" className="w-full h-full object-cover hover:scale-105 transition duration-300" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Sección de Videos (Bunny Stream / URLs) */}
        {videos.length > 0 && (
          <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl shadow-xl space-y-4">
            <h2 className="text-lg font-bold">🎬 Videos Exclusivos ({videos.length})</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {videos.map((video) => (
                <div key={video.id} className="rounded-xl overflow-hidden border border-zinc-800 bg-zinc-950 p-3 space-y-2">
                  <div className="aspect-video w-full bg-black rounded-lg overflow-hidden flex items-center justify-center">
                    {/* Si usas iframe de Bunny Stream o video nativo */}
                    <iframe 
                      src={video.recurso_url} 
                      loading="lazy" 
                      className="w-full h-full border-0" 
                      allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;" 
                      allowFullScreen 
                    />
                  </div>
                  <span className="text-xs text-zinc-500 block text-right font-mono">Protegido por Bunny Stream</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {contenidos.length === 0 && (
          <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-2xl text-center text-zinc-400">
            Este pack aún no tiene contenido multimedia cargado por el administrador.
          </div>
        )}

      </div>
    </main>
  )
}