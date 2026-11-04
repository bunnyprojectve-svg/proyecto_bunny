'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import Link from 'next/link'

interface Artista {
  id: string
  nombre: string
  nombre_legal: string
  slug: string
  biografia: string
  foto_portada: string
  video_destacado: string
  fotos_galeria: string[]
  telefono: string
  binance_pay: string
  banco: string
  cedula: string
  telefono_pago_movil: string
  numero_cuenta: string
  activo: boolean
}

export default function EditarArtistasAdminPage() {
  const [artistas, setArtistas] = useState<Artista[]>([])
  const [busqueda, setBusqueda] = useState('')
  const [loading, setLoading] = useState(true)
  
  // Artista seleccionada para editar
  const [artistaSeleccionada, setArtistaSeleccionada] = useState<Artista | null>(null)
  const [guardando, setGuardando] = useState(false)
  const [mensaje, setMensaje] = useState('')

  useEffect(() => {
    fetchArtistas()
  }, [])

  const fetchArtistas = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('artistas')
        .select('*')
        .order('nombre', { ascending: true })

      if (error) throw error
      if (data) setArtistas(data as Artista[])
    } catch (err) {
      console.error('Error al cargar artistas:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!artistaSeleccionada) return

    setGuardando(true)
    setMensaje('')

    try {
      const fotosArray = [
        artistaSeleccionada.fotos_galeria?.[0],
        artistaSeleccionada.fotos_galeria?.[1],
        artistaSeleccionada.fotos_galeria?.[2],
        artistaSeleccionada.fotos_galeria?.[3],
      ].filter(Boolean)

      const { error } = await supabase
        .from('artistas')
        .update({
          nombre: artistaSeleccionada.nombre,
          nombre_legal: artistaSeleccionada.nombre_legal,
          biografia: artistaSeleccionada.biografia,
          foto_portada: artistaSeleccionada.foto_portada,
          video_destacado: artistaSeleccionada.video_destacado || null,
          fotos_galeria: fotosArray,
          telefono: artistaSeleccionada.telefono,
          binance_pay: artistaSeleccionada.binance_pay || null,
          banco: artistaSeleccionada.banco || null,
          cedula: artistaSeleccionada.cedula || null,
          telefono_pago_movil: artistaSeleccionada.telefono_pago_movil || null,
          numero_cuenta: artistaSeleccionada.numero_cuenta || null,
          activo: artistaSeleccionada.activo,
        })
        .eq('id', artistaSeleccionada.id)

      if (error) throw error

      setMensaje('¡Información de la artista actualizada con éxito!')
      fetchArtistas()
    } catch (err: any) {
      setMensaje('Error al actualizar: ' + err.message)
    } finally {
      setGuardando(false)
    }
  }

  // Filtrar artistas por nombre o slug
  const artistasFiltrados = artistas.filter((art) =>
    art.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    art.slug.toLowerCase().includes(busqueda.toLowerCase())
  )

  if (loading) {
    return <div className="min-h-screen bg-zinc-950 text-zinc-400 flex items-center justify-center">Cargando listado de artistas...</div>
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-white p-4 sm:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Navegación superior */}
        <div className="flex justify-between items-center border-b border-zinc-800 pb-4">
          <Link href="/admin/dashboard" className="text-xs text-zinc-400 hover:text-white transition">
            ← Volver al Panel de Admin
          </Link>
          <span className="text-xs bg-rose-950 text-rose-400 border border-rose-800 px-3 py-1 rounded-full font-bold uppercase">
            Gestión de Artistas
          </span>
        </div>

        <div>
          <h1 className="text-2xl sm:text-3xl font-black">Modificar Información de Artistas</h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">Busca una creadora por su nombre artístico o slug y edita su perfil multimedia o bancario.</p>
        </div>

        {mensaje && (
          <div className={`p-4 rounded-xl text-sm ${mensaje.includes('Error') ? 'bg-red-950/80 border border-red-600 text-red-200' : 'bg-emerald-950/80 border border-emerald-600 text-emerald-200'}`}>
            {mensaje}
          </div>
        )}

        {/* Si no hay ninguna seleccionada, mostrar buscador y listado */}
        {!artistaSeleccionada ? (
          <div className="space-y-4">
            <div>
              <input
                type="text"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder="🔍 Buscar por nombre artístico o slug (ej. camila)..."
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-rose-500 transition"
              />
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl space-y-3">
              <h2 className="text-sm font-bold text-zinc-400 uppercase tracking-wider">Artistas Encontradas ({artistasFiltrados.length})</h2>
              
              {artistasFiltrados.length === 0 ? (
                <p className="text-zinc-500 text-sm py-4 text-center">No se encontraron creadoras con ese criterio.</p>
              ) : (
                <div className="divide-y divide-zinc-800">
                  {artistasFiltrados.map((art) => (
                    <div key={art.id} className="py-3 flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full overflow-hidden bg-zinc-800 border border-zinc-700">
                          <img src={art.foto_portada || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200'} alt={art.nombre} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <h3 className="font-bold text-sm text-white">{art.nombre}</h3>
                          <span className="text-xs text-zinc-500 font-mono">@{art.slug}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => setArtistaSeleccionada(art)}
                        className="bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition border border-zinc-700"
                      >
                        Editar Datos ✏️
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Formulario de Edición de la Artista Seleccionada */
          <form onSubmit={handleUpdate} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
            <div className="flex justify-between items-center border-b border-zinc-800 pb-4">
              <h2 className="text-lg font-bold text-rose-400">Editando a: {artistaSeleccionada.nombre}</h2>
              <button
                type="button"
                onClick={() => setArtistaSeleccionada(null)}
                className="text-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-3 py-1.5 rounded-lg transition"
              >
                ← Volver a la lista
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2">Nombre Legal</label>
                <input
                  type="text"
                  required
                  value={artistaSeleccionada.nombre_legal || ''}
                  onChange={(e) => setArtistaSeleccionada({ ...artistaSeleccionada, nombre_legal: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2">Nombre Artístico</label>
                <input
                  type="text"
                  required
                  value={artistaSeleccionada.nombre || ''}
                  onChange={(e) => setArtistaSeleccionada({ ...artistaSeleccionada, nombre: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2">Biografía</label>
                <textarea
                  rows={3}
                  value={artistaSeleccionada.biografia || ''}
                  onChange={(e) => setArtistaSeleccionada({ ...artistaSeleccionada, biografia: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-sm text-white focus:outline-none focus:border-rose-500 resize-none"
                />
              </div>

              {/* Multimedia */}
              <div className="space-y-4 pt-4 border-t border-zinc-800">
                <h3 className="text-xs font-bold text-rose-400 uppercase tracking-wider">Multimedia</h3>
                
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2">Foto de Portada (Obligatoria)</label>
                  <input
                    type="url"
                    required
                    value={artistaSeleccionada.foto_portada || ''}
                    onChange={(e) => setArtistaSeleccionada({ ...artistaSeleccionada, foto_portada: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2">Video Destacado (Bunny Stream)</label>
                  <input
                    type="url"
                    value={artistaSeleccionada.video_destacado || ''}
                    onChange={(e) => setArtistaSeleccionada({ ...artistaSeleccionada, video_destacado: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2">Fotos de Galería Opcionales (Hasta 4 URLs)</label>
                  <div className="space-y-2">
                    <input type="url" value={artistaSeleccionada.fotos_galeria?.[0] || ''} onChange={(e) => {
                      const gal = [...(artistaSeleccionada.fotos_galeria || [])]; gal[0] = e.target.value;
                      setArtistaSeleccionada({ ...artistaSeleccionada, fotos_galeria: gal })
                    }} placeholder="URL Foto 1" className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-xs text-white" />
                    
                    <input type="url" value={artistaSeleccionada.fotos_galeria?.[1] || ''} onChange={(e) => {
                      const gal = [...(artistaSeleccionada.fotos_galeria || [])]; gal[1] = e.target.value;
                      setArtistaSeleccionada({ ...artistaSeleccionada, fotos_galeria: gal })
                    }} placeholder="URL Foto 2" className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-xs text-white" />

                    <input type="url" value={artistaSeleccionada.fotos_galeria?.[2] || ''} onChange={(e) => {
                      const gal = [...(artistaSeleccionada.fotos_galeria || [])]; gal[2] = e.target.value;
                      setArtistaSeleccionada({ ...artistaSeleccionada, fotos_galeria: gal })
                    }} placeholder="URL Foto 3" className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-xs text-white" />

                    <input type="url" value={artistaSeleccionada.fotos_galeria?.[3] || ''} onChange={(e) => {
                      const gal = [...(artistaSeleccionada.fotos_galeria || [])]; gal[3] = e.target.value;
                      setArtistaSeleccionada({ ...artistaSeleccionada, fotos_galeria: gal })
                    }} placeholder="URL Foto 4" className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-xs text-white" />
                  </div>
                </div>
              </div>

              {/* Métodos de Pago */}
              <div className="space-y-4 pt-4 border-t border-zinc-800">
                <h3 className="text-xs font-bold text-rose-400 uppercase tracking-wider">Métodos de Cobro</h3>
                
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2">BinancePay</label>
                  <input type="text" value={artistaSeleccionada.binance_pay || ''} onChange={(e) => setArtistaSeleccionada({ ...artistaSeleccionada, binance_pay: e.target.value })} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2">Banco</label>
                    <input type="text" value={artistaSeleccionada.banco || ''} onChange={(e) => setArtistaSeleccionada({ ...artistaSeleccionada, banco: e.target.value })} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2">Cédula</label>
                    <input type="text" value={artistaSeleccionada.cedula || ''} onChange={(e) => setArtistaSeleccionada({ ...artistaSeleccionada, cedula: e.target.value })} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2">Pago Móvil (Teléfono)</label>
                    <input type="tel" value={artistaSeleccionada.telefono_pago_movil || ''} onChange={(e) => setArtistaSeleccionada({ ...artistaSeleccionada, telefono_pago_movil: e.target.value })} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2">Número de Cuenta</label>
                    <input type="text" value={artistaSeleccionada.numero_cuenta || ''} onChange={(e) => setArtistaSeleccionada({ ...artistaSeleccionada, numero_cuenta: e.target.value })} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white" />
                  </div>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={guardando}
              className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold py-3.5 rounded-xl transition shadow-lg text-sm disabled:opacity-50"
            >
              {guardando ? 'Guardando cambios...' : 'Guardar Cambios de Artista'}
            </button>
          </form>
        )}

      </div>
    </main>
  )
}